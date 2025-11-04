// Onboarding integration with Supabase
// Saves agent settings and skills to database

(function() {
  // Override the startAgent function from script.js to save to DB
  const originalStartAgent = window.startAgent;
  
  window.startAgent = async function(path) {
    try {
      // Collect onboarding data
      const categories = [];
      qsa('.wizard .switch').forEach(sw => {
        if (sw.classList.contains('on')) {
          categories.push(sw.dataset.label);
        }
      });

      const agentSettings = {
        consult_floor_30m: Number(qs('#floor')?.value || 75),
        async_floor_5m: Number(qs('#microfloor')?.value || 12),
        weekly_hours: Number(qs('#hours')?.value || 6),
        availability_window: qs('#autoWindow')?.value || 'Mon–Thu 11a–4p CT',
        anonymous_first: qsa('.wizard .switch').some(sw => 
          sw.dataset.label === 'Anonymous first' && sw.classList.contains('on')
        ),
        consent_reminders: qsa('.wizard .switch').some(sw => 
          sw.dataset.label === 'Consent reminders' && sw.classList.contains('on')
        ),
        auto_accept_fast: path === 'quick',
        categories: categories
      };

      // Get skills from assessment if available
      const savedAssessment = localStorage.getItem('opento_assessment');
      let userSkills = [];
      if (savedAssessment) {
        try {
          const assessment = JSON.parse(savedAssessment);
          if (assessment.skills && Array.isArray(assessment.skills)) {
            userSkills = assessment.skills;
          }
        } catch (e) {
          console.warn('Could not parse assessment', e);
        }
      }

      // Save to Supabase if configured and user is logged in
      if (!window.supabaseClient.demoMode) {
        // In production, get current user from Clerk
        // For now, we'll check if user info is in localStorage
        const userId = localStorage.getItem('opento_user_id');
        
        if (userId) {
          console.log('Saving agent settings to database...');
          
          // Save agent settings
          await window.supabaseClient.upsertAgentSettings(userId, agentSettings);
          
          // Save skills if we have them
          if (userSkills.length > 0) {
            // First, search for matching skill IDs
            const allSkills = await window.supabaseClient.getAllSkills();
            const skillMatches = [];
            
            userSkills.forEach(userSkill => {
              const skillName = userSkill.toLowerCase();
              const match = allSkills.find(s => 
                s.name.toLowerCase() === skillName ||
                s.name.toLowerCase().includes(skillName) ||
                skillName.includes(s.name.toLowerCase())
              );
              
              if (match) {
                skillMatches.push({
                  skill_id: match.id,
                  years_experience: 0 // Could be extracted from assessment
                });
              }
            });
            
            if (skillMatches.length > 0) {
              await window.supabaseClient.addUserSkills(userId, skillMatches);
            }
          }
          
          // Generate initial agent profile based on categories
          const openTo = categoriesToOpenTo(categories);
          const focusAreas = skillsToFocusAreas(userSkills);
          
          await window.supabaseClient.upsertAgentProfile(userId, {
            open_to: openTo,
            focus_areas: focusAreas,
            recent_wins: [],
            social_proof: [],
            lifetime_earned: 0,
            last_payout: 0,
            total_gigs_completed: 0
          });
          
          console.log('✓ Agent settings saved to database');
          toast('✓ Agent configured and saved');
        } else {
          console.log('No user ID found, saving to localStorage only');
        }
      } else {
        console.log('Demo mode: saving to localStorage only');
      }
      
      // Save to localStorage for demo/offline mode
      localStorage.setItem('opento_agent_settings', JSON.stringify(agentSettings));
      localStorage.setItem('opento_agent_started', '1');
      localStorage.setItem('opento_first_time', '1');
      
      track('Agent Started', { path, categories: categories.length, hasSkills: userSkills.length > 0 });
      
      // Call original function for UI updates
      if (originalStartAgent) {
        originalStartAgent(path);
      } else {
        toast('🎉 Agent started with your rules');
        setTimeout(() => window.location.href = 'inbox.html?tab=micro', 900);
      }
      
    } catch (error) {
      console.error('Error saving agent settings:', error);
      toast('Settings saved locally. Sync to cloud available after sign in.');
      
      // Still proceed to inbox even if DB save failed
      if (originalStartAgent) {
        originalStartAgent(path);
      } else {
        setTimeout(() => window.location.href = 'inbox.html?tab=micro', 900);
      }
    }
  };
  
  // Helper functions
  function categoriesToOpenTo(categories) {
    const mapping = {
      'Growth audits': 'Growth audits and performance consulting',
      'Campaign optimization': 'Campaign setup and optimization sprints',
      'Fractional retainers': 'Fractional growth or performance roles',
      'Data labeling': 'Data labeling and QA tasks'
    };
    
    return categories.map(c => mapping[c] || c).filter(Boolean);
  }
  
  function skillsToFocusAreas(skills) {
    if (!skills || skills.length === 0) {
      return ['General tech industry projects'];
    }
    
    const hasMarketing = skills.some(s => 
      ['performance marketing', 'paid social', 'seo', 'growth'].some(k => s.includes(k))
    );
    const hasEngineering = skills.some(s => 
      ['engineering', 'frontend', 'backend', 'full-stack', 'developer'].some(k => s.includes(k))
    );
    const hasDesign = skills.some(s => 
      ['design', 'ui', 'ux', 'product design'].some(k => s.includes(k))
    );
    const hasData = skills.some(s => 
      ['data', 'analytics', 'ml', 'machine learning'].some(k => s.includes(k))
    );
    
    const areas = [];
    if (hasMarketing) areas.push('Digital marketing and growth initiatives');
    if (hasEngineering) areas.push('Web and mobile application development');
    if (hasDesign) areas.push('Product and user experience design');
    if (hasData) areas.push('Data analysis and machine learning projects');
    
    return areas.length > 0 ? areas : ['Cross-functional tech projects'];
  }
  
  // Load saved settings on page load to prefill form
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const userId = localStorage.getItem('opento_user_id');
      
      if (userId && !window.supabaseClient.demoMode) {
        console.log('Loading saved agent settings...');
        
        const settings = await window.supabaseClient.getAgentSettings(userId);
        
        if (settings) {
          // Prefill form with saved settings
          if (qs('#floor')) qs('#floor').value = settings.consult_floor_30m;
          if (qs('#microfloor')) qs('#microfloor').value = settings.async_floor_5m;
          if (qs('#hours')) qs('#hours').value = settings.weekly_hours;
          if (qs('#autoWindow')) qs('#autoWindow').value = settings.availability_window;
          
          // Update switches based on saved categories
          if (settings.categories && Array.isArray(settings.categories)) {
            qsa('.wizard .switch').forEach(sw => {
              const shouldBeOn = settings.categories.includes(sw.dataset.label);
              sw.classList.toggle('on', shouldBeOn);
              sw.setAttribute('aria-checked', shouldBeOn);
            });
          }
          
          // Trigger preview update
          if (window.updateOnboardingPreview) {
            updateOnboardingPreview();
          }
          
          console.log('✓ Settings loaded from database');
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  });
  
})();
