# Fixing Clerk Authentication Issues

## Issue 1: Sign-in button routes to Vercel URL

**Problem:** Sign-in button redirects to `https://opento-psi.vercel.app/sign-in` instead of staying on `www.opento.co`

**Likely Cause:** This is probably a browser behavior or Vercel redirect. The HTML code uses relative paths (`sign-in.html`), so this shouldn't happen unless:
- There's a Vercel redirect rule
- Browser is forcing HTTPS redirect
- DNS is redirecting

**Fix:** Check Vercel Dashboard → Your Project → Settings → Redirects. Make sure there are no redirect rules sending `www.opento.co` to `opento-psi.vercel.app`.

**Workaround:** All links in the code use relative paths, so they should work correctly. If the issue persists, it's likely a Vercel configuration issue, not code.

---

## Issue 2: Clerk initialization error on www.opento.co

**Error:** `(key=)` - Empty publishable key

**Root Cause:** `config.js` isn't loading before Clerk tries to initialize, OR `www.opento.co` domain isn't added to Clerk Dashboard.

**Fixes Applied:**
1. ✅ Removed `defer` from `config.js` script tag
2. ✅ Added `waitForConfig()` function that polls until config loads
3. ✅ Added timeout and better error messages
4. ✅ Added waiting logic for Clerk object to attach

**Action Required:**

### Step 1: Add `www.opento.co` to Clerk Dashboard
Go to: **Clerk Dashboard** → Your Opento App → **Domains**

**Add:**
- `www.opento.co` (separate from `opento.co`)

**Verify these are added:**
- ✅ `opento.co`
- ✅ `www.opento.co`  
- ✅ `opento-psi.vercel.app`

### Step 2: Check if config.js is loading
Open browser console on `https://www.opento.co/sign-in` and look for:
- `🔍 Checking config...` - Should show config loaded
- `✅ Config loaded, initializing Clerk...` - Config found
- `🔑 Loading Clerk with key: pk_live_Y2xlcmsub3BlbnRvLmNv...` - Key is present

If you see `❌ Config.js failed to load`, then `config.js` isn't being served correctly.

### Step 3: Verify config.js is accessible
Try accessing directly: `https://www.opento.co/config.js`

You should see:
```javascript
const config = {
  clerk: {
    publishableKey: 'pk_live_Y2xlcmsub3BlbnRvLmNvJA'
  },
  ...
}
```

If this doesn't load, there's a deployment/Vercel issue.

---

## Testing Checklist

After fixes:
- [ ] `www.opento.co` added to Clerk Dashboard → Domains
- [ ] `config.js` loads when accessing `https://www.opento.co/config.js`
- [ ] Browser console shows config loaded message
- [ ] Clerk sign-in form appears (not error message)
- [ ] Sign-in button stays on current domain (doesn't redirect to Vercel)

---

## If Still Not Working

### Check Browser Console
Look for these specific errors:
1. **`(key=)`** → Config not loading or empty
2. **`Clerk object not found`** → Clerk script not loading from CDN
3. **CORS errors** → Domain not added to Clerk

### Check Network Tab
1. Open DevTools → Network tab
2. Reload `https://www.opento.co/sign-in`
3. Check if `config.js` loads (status 200)
4. Check if `clerk.browser.js` loads (status 200)

### Debug Steps
1. Add `console.log(window.opentoConfig)` right after config.js loads
2. Verify the key exists: `console.log(window.opentoConfig?.clerk?.publishableKey)`
3. Check if Clerk CDN is accessible: `https://accounts.clerk.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`

