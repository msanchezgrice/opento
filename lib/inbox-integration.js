// Inbox integration - Load and manage matched offers from Supabase

(async function() {
  let currentUserId = null;
  
  // Initialize on page load
  async function initInbox() {
    try {
      // Get current user (from localStorage for now, or Clerk in production)
      currentUserId = localStorage.getItem('opento_user_id');
      
      if (!currentUserId) {
        // No user logged in, show demo mode
        console.log('No user logged in, using demo data');
        return; // Let script.js handle demo mode
      }
      
      if (window.supabaseClient.demoMode) {
        console.log('Demo mode enabled, using static data');
        return;
      }
      
      // Load matched offers from database
      console.log('Loading matched offers from database...');
      await loadMatchedOffers();
      
      // Override accept/decline handlers
      overrideOfferHandlers();
      
    } catch (error) {
      console.error('Error initializing inbox:', error);
    }
  }
  
  async function loadMatchedOffers() {
    try {
      const offers = await window.supabaseClient.getMatchedOffers(currentUserId);
      
      if (!offers || offers.length === 0) {
        console.log('No matched offers found');
        // Optionally trigger matching algorithm
        await generateMatchedOffers();
        return;
      }
      
      console.log(`Loaded ${offers.length} matched offers`);
      
      // Replace static offers with real data
      const resultsDiv = qs('.results');
      if (resultsDiv && offers.length > 0) {
        resultsDiv.innerHTML = offers.map(offer => renderOffer(offer)).join('');
        
        // Re-bind event listeners
        if (window.inboxInit) {
          // Rebind interactions from script.js
          qsa('.offer').forEach(card => bindOfferCard(card));
        }
      }
      
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  }
  
  async function generateMatchedOffers() {
    // Simple matching algorithm: find opportunities that match user's skills
    try {
      console.log('Generating matched offers...');
      
      // Get user's skills
      const userSkills = await window.supabaseClient.client
        .from('user_skills')
        .select('skill_id')
        .eq('user_id', currentUserId);
      
      if (!userSkills.data || userSkills.data.length === 0) {
        console.log('User has no skills set, cannot generate matches');
        return;
      }
      
      const skillIds = userSkills.data.map(us => us.skill_id);
      
      // Find opportunities that match these skills
      const opportunities = await window.supabaseClient.getOpportunitiesBySkills(skillIds);
      
      if (!opportunities || opportunities.length === 0) {
        console.log('No matching opportunities found');
        return;
      }
      
      console.log(`Found ${opportunities.length} matching opportunities`);
      
      // Create matched offers (limit to top 5)
      const topOpps = opportunities.slice(0, 5);
      
      for (const opp of topOpps) {
        // Calculate match score based on skill overlap
        const oppSkills = opp.required_skill_ids || [];
        const overlap = oppSkills.filter(id => skillIds.includes(id)).length;
        const matchScore = Math.min(1.0, 0.5 + (overlap / oppSkills.length) * 0.5);
        
        // Insert matched offer
        await window.supabaseClient.client
          .from('matched_offers')
          .insert({
            user_id: currentUserId,
            opportunity_id: opp.id,
            match_score: matchScore,
            match_reasons: ['Skills match'],
            status: 'queued'
          });
      }
      
      console.log('✓ Generated matched offers');
      
      // Reload offers
      await loadMatchedOffers();
      
    } catch (error) {
      console.error('Error generating matches:', error);
    }
  }
  
  function renderOffer(matchedOffer) {
    const opp = matchedOffer.opportunity;
    if (!opp) return '';
    
    const category = opp.category || 'other';
    const isFast = opp.estimated_hours < 0.5;
    const rate = opp.rate_min ? `$${opp.rate_min}` : '$0';
    const duration = formatDuration(opp.estimated_hours);
    const matchReasons = matchedOffer.match_reasons || [];
    
    const chipClass = matchedOffer.match_score > 0.8 ? 'chip' : 'chip gray';
    
    return `
      <div class="offer" data-cat="${category}" data-fast="${isFast ? '1' : '0'}" data-offer-id="${matchedOffer.id}">
        <div class="sel"><input type="checkbox"></div>
        <div>
          <div class="title">${opp.title}</div>
          <div class="meta">${opp.description || category} • ${rate} • ${duration}</div>
          ${matchReasons.length > 0 ? `
            <div class="chips" style="margin-top:6px;">
              ${matchReasons.map(r => `<div class="${chipClass}">${r}</div>`).join('')}
              ${matchedOffer.match_score > 0.8 ? '<div class="chip">High match</div>' : ''}
            </div>
          ` : ''}
        </div>
        <div class="actions">
          <div class="state queued">Queued</div>
          <button class="btn small accept">Accept</button>
          <button class="btn small gray decline">Decline</button>
        </div>
      </div>
    `;
  }
  
  function formatDuration(hours) {
    if (!hours) return 'TBD';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} min`;
    }
    return `${hours} hrs`;
  }
  
  function overrideOfferHandlers() {
    // Override accept/decline to update database
    qsa('.offer').forEach(card => bindOfferCard(card));
  }
  
  function bindOfferCard(card) {
    const accept = card.querySelector('.btn.accept');
    const decline = card.querySelector('.btn.decline');
    const offerId = card.dataset.offerId;
    
    if (!offerId) return; // Skip if no offer ID (demo mode)
    
    if (accept) {
      // Remove existing listener
      const newAccept = accept.cloneNode(true);
      accept.parentNode.replaceChild(newAccept, accept);
      
      newAccept.addEventListener('click', async (e) => {
        try {
          // Update status in database
          await window.supabaseClient.updateOfferStatus(offerId, 'accepted');
          
          // Get opportunity details for transaction
          const matchedOffer = await window.supabaseClient.client
            .from('matched_offers')
            .select('*, opportunity:opportunities(*)')
            .eq('id', offerId)
            .single();
          
          if (matchedOffer.data) {
            const opp = matchedOffer.data.opportunity;
            const amount = opp.rate_min || 0;
            
            // Create transaction
            await window.supabaseClient.createTransaction(
              currentUserId,
              opp.id,
              amount,
              opp.category
            );
            
            // Update UI
            const state = card.querySelector('.state');
            if (state) {
              state.textContent = 'Accepted';
              state.className = 'state accepted';
            }
            
            // Show confetti and update balance (from script.js)
            if (window.addConfetti) {
              const r = e.target.getBoundingClientRect();
              addConfetti(r.left, r.top);
            }
            
            const currentBalance = getBalance();
            const newBalance = currentBalance + amount;
            setBalance(newBalance);
            
            toast(`Offer accepted • +$${amount} on completion`);
            
            console.log('✓ Offer accepted and saved to database');
          }
          
        } catch (error) {
          console.error('Error accepting offer:', error);
          toast('Error accepting offer. Please try again.');
        }
      });
    }
    
    if (decline) {
      const newDecline = decline.cloneNode(true);
      decline.parentNode.replaceChild(newDecline, decline);
      
      newDecline.addEventListener('click', async () => {
        try {
          await window.supabaseClient.updateOfferStatus(offerId, 'declined');
          
          const state = card.querySelector('.state');
          if (state) {
            state.textContent = 'Declined';
            state.className = 'state declined';
          }
          
          toast('Offer declined');
          console.log('✓ Offer declined and saved');
          
        } catch (error) {
          console.error('Error declining offer:', error);
          toast('Error declining offer. Please try again.');
        }
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInbox);
  } else {
    initInbox();
  }
  
})();
