// Auth Modal Manager - Opens Clerk auth components in modals
let clerkInitialized = false;
let currentAuthType = null;

async function initClerk() {
  if (clerkInitialized) return window.Clerk;
  
  const publishableKey = window.opentoConfig?.clerk?.publishableKey;
  if (!publishableKey) {
    console.error('❌ Clerk publishable key not found');
    return null;
  }

  return new Promise((resolve, reject) => {
    // Check if Clerk is already loaded
    if (window.Clerk) {
      window.Clerk.load({ publishableKey }).then(() => {
        clerkInitialized = true;
        resolve(window.Clerk);
      }).catch(reject);
      return;
    }

    // Load Clerk SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.clerk.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
    script.setAttribute('data-clerk-publishable-key', publishableKey);
    script.async = true;
    
    script.onload = async () => {
      try {
        let attempts = 0;
        while (!window.Clerk && attempts < 100) {
          await new Promise(r => setTimeout(r, 50));
          attempts++;
        }
        
        if (!window.Clerk) {
          reject(new Error('Clerk object not found'));
          return;
        }

        await window.Clerk.load({ publishableKey });
        clerkInitialized = true;
        resolve(window.Clerk);
      } catch (error) {
        reject(error);
      }
    };
    
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function openAuthModal(type) {
  const modal = document.getElementById('authModal');
  const container = document.getElementById('clerk-auth-container');
  const title = document.getElementById('authModalTitle');
  
  if (!modal || !container) {
    console.error('Auth modal elements not found');
    return;
  }

  // If modal is already open with the same type, do nothing
  if (modal.style.display === 'flex' && currentAuthType === type) {
    return;
  }

  // Unmount previous component if switching types
  if (modal.style.display === 'flex' && currentAuthType && currentAuthType !== type) {
    if (window.Clerk) {
      try {
        if (currentAuthType === 'sign-in') {
          window.Clerk.unmountSignIn(container);
        } else {
          window.Clerk.unmountSignUp(container);
        }
      } catch (e) {
        // Ignore unmount errors
      }
    }
  }

  currentAuthType = type;
  title.textContent = type === 'sign-in' ? 'Sign In' : 'Sign Up';
  
  // Clear previous content
  container.innerHTML = '<div style="text-align: center; padding: 40px;">Loading...</div>';
  
  // Show modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Initialize Clerk and mount component
  initClerk().then(clerk => {
    if (!clerk) {
      container.innerHTML = `
        <div class="card">
          <p class="small" style="color: #991b1b;">Failed to load authentication. Please refresh the page.</p>
        </div>
      `;
      return;
    }

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Mount the appropriate component
      if (type === 'sign-in') {
        clerk.mountSignIn(container, {
          afterSignInUrl: '/inbox',
          appearance: {
            elements: {
              rootBox: { margin: '0 auto', width: '100%' },
              card: { 
                boxShadow: 'none',
                border: 'none',
                borderRadius: '0'
              },
              headerTitle: { fontSize: '24px', fontWeight: '700' },
              headerSubtitle: { fontSize: '14px', color: 'var(--muted)' }
            }
          },
          routing: 'hash'
        });
        
        // Intercept sign-up link clicks to open modal instead
        setTimeout(() => {
          const signUpLinks = container.querySelectorAll('a[href*="sign-up"], a[href*="sign_up"]');
          signUpLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              openAuthModal('sign-up');
            });
          });
        }, 500);
      } else {
        clerk.mountSignUp(container, {
          afterSignUpUrl: '/onboarding',
          appearance: {
            elements: {
              rootBox: { margin: '0 auto', width: '100%' },
              card: { 
                boxShadow: 'none',
                border: 'none',
                borderRadius: '0'
              },
              headerTitle: { fontSize: '24px', fontWeight: '700' },
              headerSubtitle: { fontSize: '14px', color: 'var(--muted)' }
            }
          },
          routing: 'hash'
        });
        
        // Intercept sign-in link clicks to open modal instead
        setTimeout(() => {
          const signInLinks = container.querySelectorAll('a[href*="sign-in"], a[href*="sign_in"]');
          signInLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              openAuthModal('sign-in');
            });
          });
        }, 500);
      }
    }, 100);

    // Listen for successful auth to close modal
    clerk.addListener(({ session }) => {
      if (session) {
        closeAuthModal();
        // Redirect handled by Clerk's afterSignInUrl/afterSignUpUrl
      }
    });
  }).catch(error => {
    console.error('Failed to initialize Clerk:', error);
    container.innerHTML = `
      <div class="card">
        <p class="small" style="color: #991b1b;">Error loading authentication. Please try again.</p>
        <button class="btn gray" onclick="closeAuthModal()" style="margin-top: 12px;">Close</button>
      </div>
    `;
  });
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  const container = document.getElementById('clerk-auth-container');
  
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  if (container) {
    // Unmount Clerk components
    if (window.Clerk && currentAuthType) {
      try {
        if (currentAuthType === 'sign-in') {
          window.Clerk.unmountSignIn(container);
        } else {
          window.Clerk.unmountSignUp(container);
        }
      } catch (e) {
        // Ignore unmount errors
      }
    }
    container.innerHTML = '';
  }
  
  currentAuthType = null;
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModal');
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAuthModal();
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAuthModal);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeAuthModal();
    }
  });
});

// Make functions globally available
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;

