# Clerk Authentication - Production Setup Guide

## Overview
This guide covers configuring Clerk authentication for production deployment on Vercel.

## Current Configuration

### Frontend Config (`config.js`)
- **Publishable Key**: `pk_live_Y2xlcmsub3BlbnRvLmNvJA`
- This key is safe to expose in frontend code

### Environment Variables (Vercel)
✅ Already configured:
- `CLERK_SECRET_KEY` = `sk_live_***` (from Clerk dashboard)

---

## Required Clerk Dashboard Configuration

### Step 1: Configure Redirect URLs (Most Important!)

Go to: **https://dashboard.clerk.com** → Your Opento App → **Paths** → **Redirect URLs**

⚠️ **Note**: These are different from "Component paths". You need to find the "Redirect URLs" section, not "Component paths".

#### Allowed Redirect URLs
Add these patterns (these are where Clerk can redirect users after auth):
```
http://localhost:8000/*
https://opento-psi.vercel.app/*
https://opento.co/*
https://*.opento.co/*
```

#### After Sign-up Redirect URL
```
/onboarding.html
```

#### After Sign-in Redirect URL  
```
/inbox.html
```

#### After Sign-out Redirect URL
```
/index.html
```

**Note**: Your code already sets these in `sign-in.html` and `sign-up.html` using `afterSignInUrl` and `afterSignUpUrl`, but Clerk dashboard settings provide fallback/default behavior.

### Step 1b: Component Paths (Optional - You're Using Account Portal)

The Component paths section shows:
- Sign-in: `https://accounts.opento.co/sign-in`
- Sign-up: `https://accounts.opento.co/sign-up`

**This is fine** - Clerk's Account Portal is used when users navigate directly to Clerk URLs. Since you're embedding Clerk components in your own pages (`/sign-in.html`, `/sign-up.html`), this setting doesn't affect your main flow.

However, if you want users to stay on your domain entirely, you can change Component paths to use "application domain" instead of "Account Portal".

---

### Step 2: Configure Application Domains (CRITICAL - Fixes "Error loading authentication")

Go to: **Clerk Dashboard** → Your Opento App → **Domains**

**⚠️ THIS IS THE FIX FOR YOUR ERROR:** You must add all domains that will serve your app.

#### Add these domains:
1. **Primary Vercel domain:**
   ```
   opento-psi.vercel.app
   ```
   (No `https://` needed - just the domain)

2. **Custom domain (if using):**
   ```
   opento.co
   ```

3. **WWW subdomain (REQUIRED if using www.opento.co):**
   ```
   www.opento.co
   ```

**Important Notes:**
- If users access your site via `www.opento.co`, you MUST add `www.opento.co` as a separate domain
- Clerk needs to know about every domain that will make requests to Clerk
- This is separate from DNS configuration (that's for Clerk's own subdomains like `accounts.opento.co`)

---

### Step 3: OAuth Callbacks (if using social logins)

Clerk auto-configures these, but verify:

**Allowed callback URLs:**
```
https://opento-psi.vercel.app/*
https://opento.co/*
https://www.opento.co/*
```

---

## Vercel Configuration

### Environment Variables

Already set (✅):
- `CLERK_SECRET_KEY` = `sk_live_***` (your secret key from Clerk dashboard)

**To verify/update:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure `CLERK_SECRET_KEY` is set for Production
3. The publishable key is in `config.js` (frontend-safe)

---

## Testing Routes

### 1. Sign Up Flow
1. Navigate to: `https://opento-psi.vercel.app/sign-up.html`
2. Create account with email
3. Verify email (if email verification is enabled)
4. Should redirect to: `/onboarding.html`

### 2. Sign In Flow
1. Navigate to: `https://opento-psi.vercel.app/sign-in.html`
2. Sign in with credentials
3. Should redirect to: `/inbox.html`

### 3. Sign Out
- Click sign out button (when implemented)
- Should redirect to: `/index.html`

---

## Page Routes

### Public Pages (No Auth Required)
- `/index.html` - Landing page
- `/browse.html` - Browse agents
- `/handle.html?u=<handle>` - Agent profile pages
- `/testimonials.html` - Testimonials
- `/sign-in.html` - Sign in
- `/sign-up.html` - Sign up
- `/privacy.html` - Privacy policy

### Protected Pages (Auth Required)
- `/inbox.html` - User inbox (requires sign-in)
- `/onboarding.html` - Agent onboarding (requires sign-in)
- `/recipes.html` - Agent recipes (requires sign-in)

---

## Protected Route Implementation

To protect routes, add this to the top of protected pages:

```javascript
// Check if user is signed in
if (window.Clerk) {
  window.Clerk.load().then(() => {
    if (!window.Clerk.user) {
      // Redirect to sign-in
      window.location.href = '/sign-in.html';
    }
  });
}
```

---

## Webhook Setup (Optional but Recommended)

To auto-sync Clerk users to Supabase:

### 1. Create Webhook Endpoint

File: `api/webhooks/clerk.js` (Vercel serverless function)

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body;

  if (type === 'user.created') {
    // Create user in Supabase
    const { id, email_addresses, first_name, last_name } = data;
    
    // Call Supabase to insert user
    // Implementation depends on your Supabase setup
  }

  res.status(200).json({ received: true });
}
```

### 2. Add Webhook in Clerk Dashboard

**Webhooks** section → Add endpoint:
```
https://opento-psi.vercel.app/api/webhooks/clerk
```

Subscribe to events:
- `user.created`
- `user.updated`
- `user.deleted`

---

## Summary Checklist

✅ **Component Paths** - Already correct (using Account Portal is fine)
- [x] Component paths set to Account Portal (doesn't affect your embedded components)

⚠️ **Action Required:**
- [ ] Configure **Allowed Redirect URLs** in Clerk dashboard → Paths → Redirect URLs:
  - [ ] Add `http://localhost:8000/*`
  - [ ] Add `https://opento-psi.vercel.app/*`
  - [ ] Add `https://opento.co/*` (if custom domain)
- [ ] Set default redirect URLs (fallbacks):
  - [ ] After sign-up → `/onboarding.html`
  - [ ] After sign-in → `/inbox.html`
  - [ ] After sign-out → `/index.html`
- [ ] Add production domain(s) to Clerk → Domains:
  - [ ] `https://opento-psi.vercel.app`
  - [ ] `https://opento.co` (if custom domain)
- [ ] Verify Vercel environment variables:
  - [ ] `CLERK_SECRET_KEY` is set for Production
- [ ] Test sign-up flow (should redirect to `/onboarding.html`)
- [ ] Test sign-in flow (should redirect to `/inbox.html`)
- [ ] (Optional) Set up webhook for Supabase sync

---

## Troubleshooting

### Issue: Redirects not working
- Verify redirect URLs are set correctly in Clerk dashboard
- Check browser console for errors
- Ensure paths match exactly (case-sensitive)

### Issue: "Error loading authentication" on sign-in/sign-up pages
- **Most common cause:** Domain not added to Clerk → Domains
- **Fix:** Add your domain(s) to Clerk Dashboard → Domains:
  - `opento-psi.vercel.app`
  - `opento.co` (if using custom domain)
  - `www.opento.co` (if users access via www - this is often the issue!)
- **Verify:** Check browser console for CORS errors
- **Check:** Ensure publishable key in `config.js` matches Clerk dashboard

### Issue: "Invalid API key"
- Verify `CLERK_SECRET_KEY` is set in Vercel
- Check that publishable key in `config.js` matches Clerk dashboard
- Ensure keys are for the correct environment (live vs test)

### Issue: CORS errors
- Add production domain to Clerk dashboard → Domains
- Verify callback URLs include wildcard pattern: `https://opento-psi.vercel.app/*`
- Make sure you've added BOTH `opento.co` AND `www.opento.co` if using www

---

## Resources

- Clerk Dashboard: https://dashboard.clerk.com
- Clerk Docs: https://clerk.com/docs
- Vercel Dashboard: https://vercel.com/dashboard

