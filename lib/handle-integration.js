// Handle page integration - Load agent data from Supabase

(async function() {
  const params = new URLSearchParams(window.location.search);
  const handle = params.get('u');
  
  if (!handle) {
    console.warn('No handle provided');
    return;
  }
  
  try {
    // Show loading state
    document.body.classList.add('loading');
    
    // Try to load from Supabase
    if (!window.supabaseClient.demoMode) {
      console.log(`Loading agent data for @${handle}...`);
      
      const agentData = await window.supabaseClient.getUserByHandle(handle);
      
      if (agentData) {
        // Agent found in database - override demo data
        updatePageWithAgentData(agentData);
        console.log('✓ Agent data loaded from database');
      } else {
        console.log('Agent not found in database, using demo data');
      }
    } else {
      console.log('Demo mode: using demo data from script.js');
    }
    
  } catch (error) {
    console.error('Error loading agent data:', error);
    console.log('Falling back to demo data');
  } finally {
    document.body.classList.remove('loading');
  }
  
  function updatePageWithAgentData(agent) {
    // Update basic info
    if (agent.display_name) setText('#displayName', agent.display_name);
    if (agent.display_name) setText('#displayNameModal', agent.display_name);
    if (agent.handle) setText('#handleName', agent.handle);
    if (agent.avatar_initials) {
      const avatar = qs('#handleAvatar');
      if (avatar) avatar.textContent = agent.avatar_initials;
    }
    
    // Update role and summary
    if (agent.role) setText('#handleRole', agent.role);
    if (agent.summary) setText('#handleSummary', agent.summary);
    if (agent.location) setText('#handleLocation', agent.location);
    
    // Update settings
    const settings = agent.agent_settings?.[0] || agent.agent_settings;
    if (settings) {
      const floor = settings.consult_floor_30m || 75;
      const asyncFloor = settings.async_floor_5m || 12;
      const window = settings.availability_window || 'Mon–Thu 11a–4p CT';
      const anon = settings.anonymous_first ? 'Anonymous first' : 'Identity shared';
      
      setText('#availability', window);
      setText('#rulesSummary', `${anon} • $${floor}/30m floor • Prefers async briefs before live calls`);
    }
    
    // Update profile data
    const profile = agent.agent_profiles?.[0] || agent.agent_profiles;
    if (profile) {
      if (profile.lifetime_earned !== undefined) {
        setText('#lifetimeEarned', formatUsd(profile.lifetime_earned));
      }
      if (profile.last_payout !== undefined) {
        setText('#overnightEarned', formatUsd(profile.last_payout));
      }
      
      // Update lists
      if (profile.open_to && profile.open_to.length > 0) {
        const openToList = qs('#openToList');
        if (openToList) {
          openToList.innerHTML = profile.open_to.map(item => `<li>${item}</li>`).join('');
        }
      }
      
      if (profile.focus_areas && profile.focus_areas.length > 0) {
        const focusList = qs('#focusList');
        if (focusList) {
          focusList.innerHTML = profile.focus_areas.map(item => `<li>${item}</li>`).join('');
        }
      }
      
      if (profile.recent_wins && profile.recent_wins.length > 0) {
        const winList = qs('#winList');
        if (winList) {
          winList.innerHTML = profile.recent_wins.map(item => `<li>${item}</li>`).join('');
        }
      }
      
      if (profile.social_proof && profile.social_proof.length > 0) {
        const proofHolder = qs('#proofList');
        if (proofHolder) {
          proofHolder.innerHTML = profile.social_proof.map(p => `<div class="chip">${p}</div>`).join('');
        }
      }
    }
    
    // Update skills display
    if (agent.user_skills && agent.user_skills.length > 0) {
      const skills = agent.user_skills
        .map(us => us.skill?.name)
        .filter(Boolean)
        .slice(0, 5);
      
      if (skills.length > 0 && !profile?.social_proof?.length) {
        // Add skills to proof section if no other proof exists
        const proofHolder = qs('#proofList');
        if (proofHolder) {
          proofHolder.innerHTML = skills.map(skill => `<div class="chip">${skill}</div>`).join('');
        }
      }
    }
    
    // Update page title
    document.title = `${agent.display_name || 'Agent'} (@${agent.handle}) — Opento`;
  }
  
})();
