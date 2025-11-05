// Dashboard integration - Load and manage user data

(function() {
  // API base URL
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

  let currentUserData = null;
  let currentSkills = [];

  // Require authentication
  if (typeof window.opentoSession !== 'undefined') {
    if (!window.opentoSession.requireAuth('/onboarding.html')) {
      return; // Redirected to onboarding
    }
  }

  // Load user data on page load
  window.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
    initializeTabs();
    initializeForms();
  });

  async function loadDashboard() {
    try {
      const user = getCurrentUser();
      if (!user || !user.id) {
        window.location.href = '/onboarding.html';
        return;
      }

      console.log('Loading dashboard for user:', user.id);

      // Fetch user data from API
      const response = await fetch(`${API_BASE}/me?userId=${user.id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      currentUserData = await response.json();
      console.log('✓ Dashboard data loaded:', currentUserData);

      // Populate dashboard
      populateDashboard(currentUserData);

      // Show dashboard, hide loading
      document.getElementById('dashboardLoading').style.display = 'none';
      document.getElementById('dashboardContent').style.display = 'block';

      // Load intro requests for the intros tab
      loadIntroRequests(user.id);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      document.getElementById('dashboardLoading').innerHTML = `
        <div class="card" style="max-width: 500px; margin: 0 auto;">
          <h3>Error Loading Dashboard</h3>
          <p class="small">We couldn't load your dashboard data. Please try again.</p>
          <button onclick="window.location.reload()" class="btn primary" style="margin-top: 16px;">Retry</button>
          <a href="/" class="btn gray" style="margin-left: 12px;">Go Home</a>
        </div>
      `;
    }
  }

  function populateDashboard(data) {
    // Header
    const dashAvatar = document.getElementById('dashAvatar');
    if (dashAvatar) dashAvatar.textContent = data.avatarInitials || '—';
    
    setText('#dashName', data.displayName || 'User');
    setText('#dashHandle', data.handle || '—');
    
    // Update profile link buttons
    const profileLink = `handle.html?u=${data.handle}`;
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    if (viewProfileBtn) viewProfileBtn.href = profileLink;
    
    const viewPublicProfile = document.getElementById('viewPublicProfile');
    if (viewPublicProfile) viewPublicProfile.href = profileLink;
    
    const shareProfileLink = document.getElementById('shareProfileLink');
    if (shareProfileLink) shareProfileLink.href = profileLink;

    // Populate Profile form
    if (document.getElementById('profileName')) document.getElementById('profileName').value = data.displayName || '';
    if (document.getElementById('profileRole')) document.getElementById('profileRole').value = data.role || '';
    if (document.getElementById('profileSummary')) document.getElementById('profileSummary').value = data.summary || '';
    if (document.getElementById('profileLocation')) document.getElementById('profileLocation').value = data.location || '';
    if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = data.email || '';

    // Populate Settings form
    const settings = data.settings || {};
    if (document.getElementById('settingsConsultFloor')) document.getElementById('settingsConsultFloor').value = settings.consult_floor_30m || 75;
    if (document.getElementById('settingsAsyncFloor')) document.getElementById('settingsAsyncFloor').value = settings.async_floor_5m || 12;
    if (document.getElementById('settingsHours')) {
      document.getElementById('settingsHours').value = settings.weekly_hours || 6;
      updateHoursDisplay();
    }
    if (document.getElementById('settingsWindow')) document.getElementById('settingsWindow').value = settings.availability_window || 'Mon–Thu 11a–4p CT';
    if (document.getElementById('settingsAnonFirst')) document.getElementById('settingsAnonFirst').checked = settings.anonymous_first !== false;
    if (document.getElementById('settingsConsentReminders')) document.getElementById('settingsConsentReminders').checked = settings.consent_reminders !== false;

    // Check categories
    const categories = settings.categories || [];
    document.querySelectorAll('input[name="category"]').forEach(cb => {
      cb.checked = categories.includes(cb.value);
    });

    // Populate Skills
    currentSkills = data.skills || [];
    renderCurrentSkills();

    // Update photo preview
    updatePhotoPreview(data.avatar_url, data.avatarInitials);
  }

  function renderCurrentSkills() {
    const container = document.getElementById('currentSkills');
    if (!container) return;

    if (currentSkills.length === 0) {
      container.innerHTML = '<div class="small muted">No skills added yet</div>';
      return;
    }

    container.innerHTML = currentSkills.map((skill, idx) => `
      <div class="chip" style="display: inline-flex; align-items: center; gap: 6px;">
        <span>${skill.name}</span>
        <button type="button" onclick="removeSkill(${idx})" style="background: none; border: none; cursor: pointer; padding: 0; margin: 0; color: #64748b; font-size: 16px; line-height: 1; font-weight: bold;">×</button>
      </div>
    `).join('');
  }

  // Make removeSkill global
  window.removeSkill = function(idx) {
    currentSkills.splice(idx, 1);
    renderCurrentSkills();
  };

  function updatePhotoPreview(avatarUrl, initials) {
    const preview = document.getElementById('photoPreview');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    if (!preview) return;
    
    if (avatarUrl) {
      // Show uploaded photo
      preview.innerHTML = `<img src="${avatarUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">`;
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      // Show initials
      preview.innerHTML = initials || '—';
      preview.style.display = 'flex';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  function initializePhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const removeBtn = document.getElementById('removePhotoBtn');
    const status = document.getElementById('photoUploadStatus');
    
    if (!photoInput) return;
    
    // Handle file selection
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showPhotoStatus('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showPhotoStatus('Image must be less than 10MB', 'error');
        return;
      }
      
      await uploadPhoto(file);
    });
    
    // Handle remove photo
    if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
        if (confirm('Remove your profile photo?')) {
          await removePhoto();
        }
      });
    }
  }

  async function uploadPhoto(file) {
    const user = getCurrentUser();
    if (!user) return;
    
    const status = document.getElementById('photoUploadStatus');
    const preview = document.getElementById('photoPreview');
    
    try {
      showPhotoStatus('Uploading photo...', 'loading');
      
      // Convert file to base64
      const reader = new FileReader();
      const imageData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      // Upload to API
      const response = await fetch(`${API_BASE}/upload/photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          imageData: imageData
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      const data = await response.json();
      console.log('✓ Photo uploaded:', data.url);
      
      // Update preview
      updatePhotoPreview(data.url, null);
      
      showPhotoStatus('✓ Photo uploaded successfully!', 'success');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        if (status) status.innerHTML = '';
      }, 3000);
      
    } catch (error) {
      console.error('Photo upload error:', error);
      showPhotoStatus('Failed to upload photo. Please try again.', 'error');
    }
  }

  async function removePhoto() {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
      showPhotoStatus('Removing photo...', 'loading');
      
      // Update database to remove avatar_url
      const response = await fetch(`${API_BASE}/me/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          avatarUrl: null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }
      
      // Reset preview to initials
      const initials = currentUserData?.avatarInitials || '—';
      updatePhotoPreview(null, initials);
      
      showPhotoStatus('✓ Photo removed', 'success');
      
      setTimeout(() => {
        const status = document.getElementById('photoUploadStatus');
        if (status) status.innerHTML = '';
      }, 3000);
      
    } catch (error) {
      console.error('Remove photo error:', error);
      showPhotoStatus('Failed to remove photo. Please try again.', 'error');
    }
  }

  function showPhotoStatus(message, type) {
    const status = document.getElementById('photoUploadStatus');
    if (!status) return;
    
    const colors = {
      loading: '#2D6FFF',
      success: '#2EE6A6',
      error: '#F43F5E'
    };
    
    status.innerHTML = `<span style="color: ${colors[type] || colors.loading}">${message}</span>`;
  }

  function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update button styles
        tabBtns.forEach(b => {
          if (b.dataset.tab === targetTab) {
            b.style.borderBottomColor = 'var(--primary)';
            b.style.color = 'var(--primary)';
            b.style.fontWeight = '600';
            b.classList.add('active');
          } else {
            b.style.borderBottomColor = 'transparent';
            b.style.color = 'var(--muted)';
            b.style.fontWeight = '500';
            b.classList.remove('active');
          }
        });

        // Show/hide content
        tabContents.forEach(content => {
          content.style.display = content.dataset.tab === targetTab ? 'block' : 'none';
        });

        // Load intro requests when that tab is opened
        if (targetTab === 'intros' && currentUserData) {
          loadIntroRequests(currentUserData.id);
        }
      });
    });
  }

  function initializeForms() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProfile();
      });
    }

    // Photo upload
    initializePhotoUpload();

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSettings();
      });
      
      // Update hours display
      const hoursInput = document.getElementById('settingsHours');
      if (hoursInput) {
        hoursInput.addEventListener('input', updateHoursDisplay);
      }
    }

    // Skills form
    const skillsForm = document.getElementById('skillsForm');
    const skillsInput = document.getElementById('skillsInput');
    
    if (skillsForm && skillsInput) {
      skillsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSkills();
      });

      // Handle Enter and comma keys
      skillsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const value = skillsInput.value.trim();
          if (value) {
            addSkill(value);
            skillsInput.value = '';
          }
        }
      });
    }
  }

  function addSkill(skillName) {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    
    // Check if already exists
    if (currentSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast('Skill already added');
      return;
    }
    
    currentSkills.push({ name: trimmed });
    renderCurrentSkills();
  }

  function updateHoursDisplay() {
    const hoursInput = document.getElementById('settingsHours');
    const hoursVal = document.getElementById('settingsHoursVal');
    if (hoursInput && hoursVal) {
      hoursVal.textContent = `${hoursInput.value} hrs / week`;
    }
  }

  async function saveProfile() {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const submitBtn = document.querySelector('#profileForm button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      const profileData = {
        userId: user.id,
        displayName: document.getElementById('profileName').value.trim(),
        role: document.getElementById('profileRole').value.trim(),
        summary: document.getElementById('profileSummary').value.trim(),
        location: document.getElementById('profileLocation').value.trim(),
        email: document.getElementById('profileEmail').value.trim()
      };

      const response = await fetch(`${API_BASE}/me/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const result = await response.json();
      
      // Update localStorage with new name
      if (profileData.displayName) {
        localStorage.setItem('opento_user_name', profileData.displayName);
      }
      
      toast('✓ Profile saved successfully');
      console.log('✓ Profile updated');

      // Reload data
      await loadDashboard();

    } catch (error) {
      console.error('Error saving profile:', error);
      toast('Error saving profile. Please try again.');
    } finally {
      const submitBtn = document.querySelector('#profileForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Profile';
      }
    }
  }

  async function saveSettings() {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      // Get selected categories
      const categories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);

      const settingsData = {
        userId: user.id,
        settings: {
          consultFloor: Number(document.getElementById('settingsConsultFloor').value),
          asyncFloor: Number(document.getElementById('settingsAsyncFloor').value),
          weeklyHours: Number(document.getElementById('settingsHours').value),
          availabilityWindow: document.getElementById('settingsWindow').value,
          anonymousFirst: document.getElementById('settingsAnonFirst').checked,
          consentReminders: document.getElementById('settingsConsentReminders').checked,
          categories: categories
        }
      };

      const response = await fetch(`${API_BASE}/me/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast('✓ Settings saved successfully');
      console.log('✓ Settings updated');

    } catch (error) {
      console.error('Error saving settings:', error);
      toast('Error saving settings. Please try again.');
    } finally {
      const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Settings';
      }
    }
  }

  async function saveSkills() {
    try {
      const user = getCurrentUser();
      if (!user) return;

      if (currentSkills.length === 0) {
        toast('Add at least one skill');
        return;
      }

      const submitBtn = document.querySelector('#skillsForm button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      const skillsData = {
        userId: user.id,
        skills: currentSkills.map(s => s.name)
      };

      const response = await fetch(`${API_BASE}/me/skills`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillsData)
      });

      if (!response.ok) {
        throw new Error('Failed to save skills');
      }

      const result = await response.json();
      toast(`✓ ${result.matched} skill(s) saved successfully`);
      console.log('✓ Skills updated');

      // Reload data to get proper skill IDs
      await loadDashboard();

    } catch (error) {
      console.error('Error saving skills:', error);
      toast('Error saving skills. Please try again.');
    } finally {
      const submitBtn = document.querySelector('#skillsForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Skills';
      }
    }
  }

  async function loadIntroRequests(userId) {
    const loading = document.getElementById('introsLoading');
    const list = document.getElementById('introsList');
    const empty = document.getElementById('introsEmpty');

    try {
      loading.style.display = 'block';
      list.style.display = 'none';
      empty.style.display = 'none';

      const response = await fetch(`${API_BASE}/me/intros?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to load intro requests');
      }

      const data = await response.json();
      const intros = data.intros || [];

      loading.style.display = 'none';

      if (intros.length === 0) {
        empty.style.display = 'block';
      } else {
        list.style.display = 'block';
        renderIntroRequests(intros);
      }

    } catch (error) {
      console.error('Error loading intros:', error);
      loading.innerHTML = '<div class="small" style="color: #991b1b;">Error loading requests</div>';
    }
  }

  function renderIntroRequests(intros) {
    const list = document.getElementById('introsList');
    if (!list) return;

    list.innerHTML = intros.map(intro => {
      const date = new Date(intro.created_at);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const statusClass = intro.status === 'pending' ? 'queued' : intro.status === 'accepted' ? 'accepted' : 'declined';
      const statusText = intro.status.charAt(0).toUpperCase() + intro.status.slice(1);

      return `
        <div class="card" style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div>
              <strong>${intro.from_name}</strong>
              ${intro.from_company ? `<span class="small" style="color: #64748b;"> · ${intro.from_company}</span>` : ''}
              <div class="small" style="color: #64748b; margin-top: 4px;">${intro.from_email}</div>
            </div>
            <div class="state ${statusClass}" style="font-size: 12px; padding: 4px 12px;">${statusText}</div>
          </div>
          
          ${intro.brief ? `
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 12px;">
              <div class="small" style="font-weight: 600; margin-bottom: 6px;">Message:</div>
              <div class="small" style="white-space: pre-wrap;">${intro.brief}</div>
            </div>
          ` : ''}
          
          <div class="small muted" style="margin-top: 12px;">${dateStr} at ${timeStr}</div>
          
          ${intro.status === 'pending' ? `
            <div style="margin-top: 16px; display: flex; gap: 8px;">
              <button class="btn small primary" onclick="updateIntroStatus(${intro.id}, 'accepted')">Accept</button>
              <button class="btn small gray" onclick="updateIntroStatus(${intro.id}, 'declined')">Decline</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // Make updateIntroStatus global
  window.updateIntroStatus = async function(introId, status) {
    toast('Intro status management coming soon');
    console.log('Update intro', introId, 'to', status);
  };

  // Helper functions
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value !== null && value !== undefined) {
      el.textContent = value;
    }
  }

})();
