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

  // Clean up previous component if switching types
  if (currentAuthType && currentAuthType !== type) {
    try {
      if (window.Clerk) {
        if (currentAuthType === 'sign-in') {
          window.Clerk.unmountSignIn(container);
        } else if (currentAuthType === 'sign-up') {
          window.Clerk.unmountSignUp(container);
        }
      }
    } catch (e) {
      console.log('Unmount error (expected):', e);
    }
    // Clean up observer if exists
    if (container._linkObserver) {
      container._linkObserver.disconnect();
      container._linkObserver = null;
    }
    container.innerHTML = '';
  }

  currentAuthType = type;
  title.textContent = type === 'sign-in' ? 'Sign In' : 'Sign Up';
  
  // Don't show loading state - mount directly
  container.innerHTML = '';
  
  // Show modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Initialize Clerk and mount component immediately
  initClerk().then(clerk => {
    if (!clerk) {
      container.innerHTML = `
        <div class="card">
          <p class="small" style="color: #991b1b;">Failed to load authentication. Please refresh the page.</p>
        </div>
      `;
      return;
    }

    // Mount the appropriate component immediately
    try {
      if (type === 'sign-in') {
        clerk.mountSignIn(container, {
          afterSignInUrl: '/inbox',
          routing: 'hash', // Keep navigation within the modal
          signUpUrl: '#', // Prevent external navigation
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
          }
        });
      } else {
        clerk.mountSignUp(container, {
          afterSignUpUrl: '/onboarding',
          routing: 'hash', // Keep navigation within the modal
          signInUrl: '#', // Prevent external navigation
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
          }
        });
      }
      
      // Intercept Clerk's internal navigation links
      setTimeout(() => {
        const interceptLinks = () => {
          // Find all links that might navigate to sign-up/sign-in
          const links = container.querySelectorAll('a[href*="sign-up"], a[href*="sign-in"], button[type="button"]');
          links.forEach(element => {
            // Check if it's a sign up/sign in link or button
            const href = element.href || element.getAttribute('href');
            const text = element.textContent || '';
            
            if (href && (href.includes('sign-up') || href.includes('sign-in'))) {
              // Remove any existing listeners first
              element.removeEventListener('click', handleLinkClick, true);
              element.addEventListener('click', handleLinkClick, true);
            } else if (text.match(/sign\s*(up|in)/i) && element.tagName === 'BUTTON') {
              // Handle buttons that say "Sign up" or "Sign in"
              element.removeEventListener('click', handleButtonClick, true);
              element.addEventListener('click', handleButtonClick, true);
            }
          });
        };
        
        const handleLinkClick = function(e) {
          const href = this.href || this.getAttribute('href');
          console.log('Intercepted Clerk link click:', href);
          
          if (href && (href.includes('sign-up') || href.includes('sign-in'))) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Switch modal type based on the link
            if (href.includes('sign-up') && currentAuthType !== 'sign-up') {
              console.log('Switching to sign-up modal');
              openAuthModal('sign-up');
            } else if (href.includes('sign-in') && currentAuthType !== 'sign-in') {
              console.log('Switching to sign-in modal');
              openAuthModal('sign-in');
            }
            
            return false;
          }
        };
        
        const handleButtonClick = function(e) {
          const text = this.textContent || '';
          console.log('Intercepted Clerk button click:', text);
          
          if (text.match(/sign\s*up/i) && currentAuthType !== 'sign-up') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Switching to sign-up modal via button');
            openAuthModal('sign-up');
            return false;
          } else if (text.match(/sign\s*in/i) && currentAuthType !== 'sign-in') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Switching to sign-in modal via button');
            openAuthModal('sign-in');
            return false;
          }
        };
        
        // Initial interception
        interceptLinks();
        
        // Watch for DOM changes to re-intercept new links
        const observer = new MutationObserver(() => {
          interceptLinks();
        });
        
        observer.observe(container, { 
          childList: true, 
          subtree: true 
        });
        
        // Store observer for cleanup
        container._linkObserver = observer;
      }, 100);

      // Listen for successful auth to close modal
      clerk.addListener(({ session }) => {
        if (session) {
          closeAuthModal();
        }
      });
    } catch (error) {
      console.error('Failed to mount Clerk component:', error);
      container.innerHTML = `
        <div class="card">
          <p class="small" style="color: #991b1b;">Error loading authentication component.</p>
          <button class="btn gray" onclick="closeAuthModal()" style="margin-top: 12px;">Close</button>
        </div>
      `;
    }
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
  
  if (container && window.Clerk && currentAuthType) {
    // Unmount Clerk components safely
    try {
      if (currentAuthType === 'sign-in') {
        window.Clerk.unmountSignIn(container);
      } else if (currentAuthType === 'sign-up') {
        window.Clerk.unmountSignUp(container);
      }
    } catch (e) {
      console.log('Unmount error on close (expected):', e);
    }
    // Clean up observer if exists
    if (container._linkObserver) {
      container._linkObserver.disconnect();
      container._linkObserver = null;
    }
    // Clear container after unmounting
    setTimeout(() => {
      if (container) {
        container.innerHTML = '';
      }
    }, 0);
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

