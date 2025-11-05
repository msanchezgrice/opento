// Session management helpers
// Simple localStorage-based session until proper auth is implemented

(function() {
  // Session storage keys
  const KEYS = {
    SESSION_ID: 'opento_session_id',
    USER_ID: 'opento_user_id',
    USER_HANDLE: 'opento_user_handle',
    USER_NAME: 'opento_user_name',
    SESSION_CREATED: 'opento_session_created'
  };

  // Check if user is signed in
  function isSignedIn() {
    return !!localStorage.getItem(KEYS.USER_ID);
  }

  // Get current user data
  function getCurrentUser() {
    if (!isSignedIn()) return null;
    
    return {
      id: localStorage.getItem(KEYS.USER_ID),
      handle: localStorage.getItem(KEYS.USER_HANDLE),
      name: localStorage.getItem(KEYS.USER_NAME),
      sessionId: localStorage.getItem(KEYS.SESSION_ID),
      sessionCreated: localStorage.getItem(KEYS.SESSION_CREATED)
    };
  }

  // Set user session
  function setSession(userData) {
    const sessionId = generateSessionId();
    const sessionCreated = new Date().toISOString();
    
    localStorage.setItem(KEYS.SESSION_ID, sessionId);
    localStorage.setItem(KEYS.USER_ID, userData.id || userData.user_id);
    localStorage.setItem(KEYS.USER_HANDLE, userData.handle);
    localStorage.setItem(KEYS.USER_NAME, userData.name || userData.display_name);
    localStorage.setItem(KEYS.SESSION_CREATED, sessionCreated);
    
    return {
      sessionId,
      sessionCreated
    };
  }

  // Sign out - clear all session data
  function signOut() {
    // Clear session keys
    Object.values(KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear other opento keys
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('opento_') && !KEYS[key]) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✓ User signed out');
  }

  // Generate unique session ID
  function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }

  // Get session age in hours
  function getSessionAge() {
    const created = localStorage.getItem(KEYS.SESSION_CREATED);
    if (!created) return null;
    
    const createdDate = new Date(created);
    const now = new Date();
    const ageMs = now - createdDate;
    const ageHours = ageMs / (1000 * 60 * 60);
    
    return ageHours;
  }

  // Check if session is expired (optional, for future use)
  function isSessionExpired(maxAgeHours = 720) { // 30 days default
    const age = getSessionAge();
    return age !== null && age > maxAgeHours;
  }

  // Require authentication (redirect if not signed in)
  function requireAuth(redirectUrl = '/onboarding.html') {
    if (!isSignedIn()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Test sign in (for development - load user by handle)
  async function testSignIn(handle) {
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api';
      
      const response = await fetch(`${API_BASE}/agents/${handle}`);
      
      if (!response.ok) {
        throw new Error('User not found');
      }
      
      const userData = await response.json();
      
      setSession({
        id: userData.id,
        handle: userData.handle,
        name: userData.displayName
      });
      
      console.log(`✓ Test sign-in successful: ${userData.displayName} (@${userData.handle})`);
      return userData;
      
    } catch (error) {
      console.error('Test sign-in failed:', error);
      throw error;
    }
  }

  // Export to window
  window.opentoSession = {
    isSignedIn,
    getCurrentUser,
    setSession,
    signOut,
    getSessionAge,
    isSessionExpired,
    requireAuth,
    testSignIn
  };

  // Make individual functions available globally for convenience
  window.isSignedIn = isSignedIn;
  window.getCurrentUser = getCurrentUser;
  window.signOut = signOut;

  console.log('✓ Session helpers loaded');
})();
