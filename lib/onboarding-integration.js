// Onboarding integration with Supabase via API
// Saves agent settings and skills to database

(function() {
  // API base URL (use relative URLs for Vercel, or environment variable)
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'  // Local dev
    : '/api';  // Production (Vercel)
  
  // Override the startAgent function from script.js to save to DB
  // Helper to show name modal
  function showNameModal(defaultName = '') {
    return new Promise((resolve, reject) => {
      const modal = document.getElementById('nameModal');
      const input = document.getElementById('nameModalInput');
      const confirmBtn = document.getElementById('nameModalConfirm');
      const cancelBtn = document.getElementById('nameModalCancel');
      
      if (!modal || !input) {
        reject(new Error('Name modal not found'));
        return;
      }
      
      // Set default value and show modal
      input.value = defaultName;
      modal.style.display = 'flex';
      setTimeout(() => input.focus(), 100);
      
      // Handle confirm
      const confirm = () => {
        const name = input.value.trim();
        if (!name) {
          alert('Please enter your name');
          input.focus();
          return;
        }
        modal.style.display = 'none';
        resolve(name);
      };
      
      // Handle cancel
      const cancel = () => {
        modal.style.display = 'none';
        reject(new Error('User cancelled'));
      };
      
      // Add event listeners
      confirmBtn.onclick = confirm;
      cancelBtn.onclick = cancel;
      input.onkeydown = (e) => {
        if (e.key === 'Enter') confirm();
        if (e.key === 'Escape') cancel();
      };
    });
  }
  
  const originalStartAgent = window.startAgent;
  
  window.startAgent = async function(path) {
    try {
      // Collect onboarding data from form
      const name = qs('#name')?.value;
      const location = qs('#location')?.value;
      
      // Get seniority and derive years from it
      const seniorityLevel = qs('#seniorityLevel')?.value;
      const yearsMap = { 'Junior': 2, 'Mid': 4, 'Senior': 8, 'Lead': 12, 'Executive': 18 };
      const years = yearsMap[seniorityLevel] || 6;
      
      // Get skills from the new skills selector
      const skills = window.getSelectedSkills ? window.getSelectedSkills() : [];
      console.log('Selected skills:', skills);
      
      // Get enhanced fields
      const currentCompany = qs('#currentCompany')?.value;
      const yearsInRole = qs('#yearsInRole')?.value;
      const industries = window.getSelectedIndustries ? window.getSelectedIndustries() : [];
      
      console.log('Enhanced fields:', {
        seniorityLevel,
        currentCompany,
        yearsInRole,
        industries
      });
      
      // Get Step 2 fields (Tell Your Story)
      const professionalTitle = qs('#professionalTitle')?.value;
      const bio = qs('#bio')?.value;
      const bestAt = Array.from(document.querySelectorAll('.best-at-input'))
        .map(input => input.value.trim())
        .filter(v => v.length > 0);
      const highlights = Array.from(document.querySelectorAll('.highlight-input'))
        .map(input => input.value.trim())
        .filter(v => v.length > 0);
      
      console.log('Profile story:', {
        professionalTitle,
        bio: bio?.substring(0, 50) + '...',
        bestAt: bestAt.length,
        highlights: highlights.length
      });
      
      const linkedin = qs('#linkedin')?.value;
      const twitter = qs('#twitter')?.value;
      const instagram = qs('#instagram')?.value;
      
      const categories = [];
      qsa('.wizard .switch').forEach(sw => {
        if (sw.classList.contains('on')) {
          categories.push(sw.dataset.label);
        }
      });

      const agentSettings = {
        consultFloor: Number(qs('#floor')?.value || 75),
        asyncFloor: Number(qs('#microfloor')?.value || 12),
        weeklyHours: Number(qs('#hours')?.value || 6),
        availabilityWindow: qs('#autoWindow')?.value || 'Mon–Thu 11a–4p CT',
        anonymousFirst: qsa('.wizard .switch').some(sw => 
          sw.dataset.label === 'Anonymous first' && sw.classList.contains('on')
        ),
        consentReminders: qsa('.wizard .switch').some(sw => 
          sw.dataset.label === 'Consent reminders' && sw.classList.contains('on')
        ),
        autoAcceptFast: path === 'quick',
        categories: categories
      };

      // Check if user already exists in localStorage
      let userId = localStorage.getItem('opento_user_id');
      let handle = localStorage.getItem('opento_user_handle');
      
      // If no user exists, create one
      if (!userId) {
        console.log('Creating new user account...');
        
        // Check if LinkedIn data exists
        const linkedInName = localStorage.getItem('linkedin_displayName');
        const linkedInEmail = localStorage.getItem('linkedin_email');
        
        // Show styled modal to get display name
        const defaultName = linkedInName || name || 'Agent User';
        const displayName = await showNameModal(defaultName);
        
        if (!displayName) {
          throw new Error('Display name is required');
        }
        
        // Use LinkedIn email if available
        if (linkedInEmail) {
          email = linkedInEmail;
        }
        
        try {
          const userResponse = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              displayName,
              location,
              role: skills[0] || 'Professional', // Use first skill as role
              summary: `Experienced professional specializing in ${skills.slice(0, 3).join(', ') || 'consulting work'}`
            })
          });
          
          if (!userResponse.ok) {
            throw new Error('Failed to create user account');
          }
          
          const userData = await userResponse.json();
          userId = userData.user.id;
          handle = userData.user.handle;
          
          // Set session using session helper
          if (window.opentoSession) {
            window.opentoSession.setSession({
              id: userId,
              handle: handle,
              name: displayName
            });
          } else {
            // Fallback if session.js not loaded
            localStorage.setItem('opento_user_id', userId);
            localStorage.setItem('opento_user_handle', handle);
            localStorage.setItem('opento_user_name', displayName);
          }
          
          console.log(`✓ User created: ${displayName} (@${handle})`);
          toast(`✓ Welcome ${displayName}!`);
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      }
      
      // Now save onboarding data
      console.log('Saving onboarding data...');
      
      try {
        const onboardingResponse = await fetch(`${API_BASE}/onboarding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            settings: agentSettings,
            skills: skills,
            socialLinks: {
              linkedin,
              twitter,
              instagram
            },
            profileData: {
              yearsExperience: years,
              location,
              hasLinkedIn: !!linkedin,
              // Enhanced fields
              seniorityLevel: seniorityLevel,
              currentCompany: currentCompany,
              yearsInRole: yearsInRole ? parseInt(yearsInRole) : null,
              industries: industries,
              // Profile story
              professionalTitle: professionalTitle,
              bio: bio,
              bestAt: bestAt,
              experienceHighlights: highlights
            }
          })
        });
        
        if (!onboardingResponse.ok) {
          throw new Error('Failed to save onboarding data');
        }
        
        const result = await onboardingResponse.json();
        console.log('✓ Onboarding data saved');
        toast('✓ Agent configured successfully');
        
        // Store handle for easy access
        if (result.handle) {
          localStorage.setItem('opento_user_handle', result.handle);
        }
        
      } catch (error) {
        console.error('Error saving onboarding:', error);
        toast('Warning: Some settings may not have saved');
      }
      
      // Save to localStorage for offline/demo mode
      localStorage.setItem('opento_agent_settings', JSON.stringify(agentSettings));
      localStorage.setItem('opento_agent_started', '1');
      localStorage.setItem('opento_first_time', '1');
      
      track('Agent Started', { path, categories: categories.length, hasSkills: skills.length });
      
      // Always redirect to dashboard (don't call originalStartAgent)
      toast('🎉 Agent created! Redirecting to your dashboard...');
      console.log('Redirecting to dashboard...');
      
      setTimeout(() => {
        console.log('Executing redirect to dashboard.html');
        window.location.href = 'dashboard.html';
      }, 1200);
      
    } catch (error) {
      console.error('Error in onboarding flow:', error);
      toast('Error creating agent. Please try again.');
      
      // Don't redirect on error
    }
  };
  
})();
