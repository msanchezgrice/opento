// Navigation helper - Shows/hides nav items based on auth state
// Adds "My Dashboard" and "Sign Out" when user is signed in

(function() {
  function updateNav() {
    // Check if session helpers are loaded
    if (typeof isSignedIn !== 'function') {
      return; // Session.js not loaded yet
    }

    const user = getCurrentUser();
    const signedIn = isSignedIn();

    // Find all nav containers
    const navs = document.querySelectorAll('.nav .actions, .app-nav .actions');
    
    navs.forEach(nav => {
      // Remove any existing auth links to avoid duplicates
      const existing = nav.querySelectorAll('.auth-nav-item');
      existing.forEach(el => el.remove());

      if (signedIn && user) {
        // User is signed in - add Dashboard and Sign Out

        // Add "My Dashboard" link
        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'dashboard.html';
        dashboardLink.className = 'btn gray auth-nav-item';
        dashboardLink.textContent = 'My Dashboard';
        dashboardLink.title = `Signed in as ${user.name}`;
        
        // Add "Sign Out" button
        const signOutBtn = document.createElement('button');
        signOutBtn.className = 'btn ghost auth-nav-item';
        signOutBtn.textContent = 'Sign Out';
        signOutBtn.style.padding = '8px 12px';
        signOutBtn.style.minWidth = 'auto';
        signOutBtn.onclick = function(e) {
          e.preventDefault();
          if (confirm('Sign out?')) {
            signOut();
            window.location.href = '/';
          }
        };

        // Insert before "Start my agent" button if it exists
        const startBtn = nav.querySelector('a[href*="onboarding"]');
        if (startBtn) {
          nav.insertBefore(dashboardLink, startBtn);
          nav.insertBefore(signOutBtn, startBtn);
          // Hide "Start my agent" if user already has an agent
          startBtn.style.display = 'none';
        } else {
          // Otherwise append at the end
          nav.appendChild(dashboardLink);
          nav.appendChild(signOutBtn);
        }

      } else {
        // User is not signed in - show "Start my agent"
        const startBtn = nav.querySelector('a[href*="onboarding"]');
        if (startBtn) {
          startBtn.style.display = '';
        }
      }
    });
  }

  // Update nav on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNav);
  } else {
    updateNav();
  }

  // Export for manual updates
  window.updateNav = updateNav;

})();
