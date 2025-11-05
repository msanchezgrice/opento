// Handle page integration - Loads agent data dynamically from API
// Replaces demo data with real agent profiles

(function() {
  // API base URL
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'  // Local dev
    : '/api';  // Production (Vercel)

  // Get handle from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const handle = urlParams.get('u');

  if (!handle) {
    console.warn('No handle parameter found in URL');
    return;
  }

  // Load agent data on page load
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      console.log(`Loading agent data for @${handle}...`);

      // Fetch agent data from API
      const response = await fetch(`${API_BASE}/agents/${handle}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.error('Agent not found');
          showAgentNotFound();
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const agentData = await response.json();
      console.log('✓ Agent data loaded:', agentData);

      // Store globally for chat and other functions
      window.currentAgentData = agentData;

      // Populate the page with agent data
      populateAgentPage(agentData);

    } catch (error) {
      console.error('Error loading agent data:', error);
      showLoadError();
    }
  });

  function populateAgentPage(agent) {
    // Update page title
    document.title = `${agent.displayName} (@${agent.handle}) — Opento`;

    // Basic info
    setText('#displayName', agent.displayName);
    setText('#displayNameModal', agent.displayName);
    setText('#displayNameChat', agent.displayName.split(' ')[0]); // First name for chat
    setText('#handleName', agent.handle);
    setText('#handleRole', agent.role || 'Professional');
    setText('#handleSummary', agent.summary || 'Building their presence on Opento');
    setText('#handleLocation', agent.location || 'Remote');
    setText('#rulesSummary', agent.rulesSummary || 'Standard consulting rates');
    setText('#availability', agent.availability || 'By appointment');

    // Show/update badge
    const badge = qs('#agentBadge');
    if (badge && agent.role) {
      badge.textContent = `${agent.role}`;
      badge.style.display = '';
    }

    // Avatar
    const avatar = qs('#handleAvatar');
    if (avatar) avatar.textContent = agent.avatar || agent.avatar_initials || '—';

    // LinkedIn link
    const linkedinLink = qs('#linkedinLink');
    if (linkedinLink && agent.linkedinUrl) {
      linkedinLink.href = agent.linkedinUrl;
      linkedinLink.style.display = 'inline';
    } else if (linkedinLink) {
      linkedinLink.style.display = 'none';
      // Hide the entire metric if no LinkedIn
      const metric = linkedinLink.closest('.metric');
      if (metric) metric.style.display = 'none';
    }

    // Social proof chips
    const proofHolder = qs('#proofList');
    if (proofHolder) {
      if (agent.socialProof && agent.socialProof.length > 0) {
        proofHolder.innerHTML = agent.socialProof
          .map(p => `<div class="chip">${p}</div>`)
          .join('');
      } else {
        proofHolder.innerHTML = '<div class="chip">Verified Opento profile</div>';
      }
    }

    // Focus areas list
    const focusList = qs('#focusList');
    if (focusList) {
      if (agent.focusAreas && agent.focusAreas.length > 0) {
        focusList.innerHTML = agent.focusAreas
          .map(item => `<li>${item}</li>`)
          .join('');
      } else {
        focusList.innerHTML = '<li class="muted">Focus areas will appear as profile is built</li>';
      }
    }

    // Open to list
    const openList = qs('#openToList');
    if (openList) {
      if (agent.openTo && agent.openTo.length > 0) {
        openList.innerHTML = agent.openTo
          .map(item => `<li>${item}</li>`)
          .join('');
      } else {
        openList.innerHTML = '<li class="muted">Open to various consulting and project work</li>';
      }
    }

    // Recent wins list
    const winList = qs('#winList');
    if (winList) {
      if (agent.recentWins && agent.recentWins.length > 0) {
        winList.innerHTML = agent.recentWins
          .map(item => `<li>${item}</li>`)
          .join('');
      } else {
        winList.innerHTML = '<li class="muted">Building track record on Opento</li>';
      }
    }

    // Request intro section
    const guidelines = qs('#introGuidelines');
    if (guidelines && agent.requestIntro && agent.requestIntro.guidelines) {
      guidelines.innerHTML = agent.requestIntro.guidelines
        .map(item => `<li>${item}</li>`)
        .join('');
    } else if (guidelines) {
      guidelines.innerHTML = '<li>Describe your project or need</li><li>Include timeline and budget range</li><li>Mention your role and company</li>';
    }

    setText('#introPitch', agent.requestIntro?.pitch || `${agent.displayName.split(' ')[0]} is open to consulting and project opportunities.`);
    setText('#introNote', agent.requestIntro?.note || 'Rep replies within 1 business day.');
    setText('#introTemplatePreview', agent.requestIntro?.template);

    // Share link
    const shareLink = qs('#handleShareLink');
    if (shareLink) shareLink.href = `share.html?handle=${agent.handle}`;

    // Typewriter effect for "open to" items
    const firstName = agent.displayName.split(' ')[0];
    setText('#handleNameInline', firstName);
    const typewriterHandle = qs('.typewriter-handle');
    if (typewriterHandle && agent.openTo && agent.openTo.length > 0) {
      // Use the typeWriter function from script.js if available
      if (window.typeWriter) {
        typeWriter(typewriterHandle, agent.openTo, 55, 1300);
      } else {
        // Fallback: just show first item
        typewriterHandle.textContent = agent.openTo[0] || 'consulting work';
      }
    }

    // Update intro form submission handler
    updateIntroFormHandler(agent);

    console.log('✓ Agent page populated');
  }

  function updateIntroFormHandler(agent) {
    const form = qs('#introForm');
    if (!form) return;

    // Remove existing handler
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Add new handler
    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(newForm);
      const payload = {
        fromName: (formData.get('name') || '').toString().trim(),
        fromEmail: (formData.get('email') || '').toString().trim(),
        fromCompany: (formData.get('company') || '').toString().trim(),
        toHandle: agent.handle,
        brief: (formData.get('notes') || '').toString().trim()
      };

      if (!payload.fromName || !payload.fromEmail) {
        toast('Please fill in your name and email');
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/intro-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Failed to send intro request');
        }

        const result = await response.json();
        toast(result.message || 'Intro request sent!');
        track('Intro Request Sent', { toHandle: agent.handle, hasCompany: !!payload.fromCompany });

        newForm.reset();
        const modal = qs('#introModal');
        if (modal) modal.style.display = 'none';

      } catch (error) {
        console.error('Error sending intro request:', error);
        toast('Error sending request. Please try again.');
      }
    });
  }

  function showAgentNotFound() {
    const container = qs('.container.section');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 60px 20px; margin-top: 40px;">
          <h2>Agent Not Found</h2>
          <p>The agent profile you're looking for doesn't exist or has been removed.</p>
          <div style="margin-top: 24px;">
            <a href="browse.html" class="btn">Browse other agents</a>
            <a href="index.html" class="btn gray" style="margin-left: 12px;">Go home</a>
          </div>
        </div>
      `;
    }
  }

  function showLoadError() {
    const container = qs('.container.section');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 60px 20px; margin-top: 40px;">
          <h2>Error Loading Profile</h2>
          <p>We couldn't load this agent's profile. Please try again.</p>
          <div style="margin-top: 24px;">
            <button onclick="window.location.reload()" class="btn primary">Try again</button>
            <a href="browse.html" class="btn gray" style="margin-left: 12px;">Browse other agents</a>
          </div>
        </div>
      `;
    }
  }

  // Helper function to set text content
  function setText(selector, value) {
    const el = qs(selector);
    if (el && value !== null && value !== undefined) {
      el.textContent = value;
    }
    return el;
  }

  // Helper function to query selector
  function qs(sel, el = document) {
    return el.querySelector(sel);
  }

  function qsa(sel, el = document) {
    return Array.from(el.querySelectorAll(sel));
  }

  // Make toast available if not already defined
  if (!window.toast) {
    window.toast = function(msg, t = 2200) {
      const n = document.createElement('div');
      n.className = 'toast';
      n.textContent = msg;
      document.body.appendChild(n);
      requestAnimationFrame(() => n.classList.add('show'));
      setTimeout(() => {
        n.classList.remove('show');
        setTimeout(() => n.remove(), 320);
      }, t);
    };
  }

  // Make track available if not already defined
  if (!window.track) {
    window.track = function(event, props = {}) {
      console.log('[track]', event, props);
      const payload = { event, props, ts: new Date().toISOString() };
      const k = 'opento_events';
      const list = JSON.parse(localStorage.getItem(k) || '[]');
      list.push(payload);
      localStorage.setItem(k, JSON.stringify(list));
    };
  }

})();
