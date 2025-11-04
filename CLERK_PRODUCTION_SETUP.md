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

### Step 1: Configure Redirect URLs

Go to: **https://dashboard.clerk.com** → Your Opento App → **Paths**

#### Sign-up Redirect URL
After successful sign-up, redirect to:
```
/onboarding.html
```

#### Sign-in Redirect URL  
After successful sign-in, redirect to:
```
/inbox.html
```

#### After Sign-out URL
After sign-out, redirect to:
```
/index.html
```

#### Home URL (optional)
```
/index.html
```

---

### Step 2: Configure Application URLs

Go to: **Domains** section

Add your production domain(s):
```
https://opento-psi.vercel.app
```

If you have a custom domain:
```
https://opento.co
https://www.opento.co
```

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

- [ ] Configure redirect URLs in Clerk dashboard:
  - [ ] Sign-up → `/onboarding.html`
  - [ ] Sign-in → `/inbox.html`
  - [ ] Sign-out → `/index.html`
- [ ] Add production domain(s) to Clerk:
  - [ ] `https://opento-psi.vercel.app`
  - [ ] `https://opento.co` (if custom domain)
- [ ] Verify Vercel environment variables:
  - [ ] `CLERK_SECRET_KEY` is set for Production
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test sign-out flow
- [ ] (Optional) Set up webhook for Supabase sync

---

## Troubleshooting

### Issue: Redirects not working
- Verify redirect URLs are set correctly in Clerk dashboard
- Check browser console for errors
- Ensure paths match exactly (case-sensitive)

### Issue: "Invalid API key"
- Verify `CLERK_SECRET_KEY` is set in Vercel
- Check that publishable key in `config.js` matches Clerk dashboard
- Ensure keys are for the correct environment (live vs test)

### Issue: CORS errors
- Add production domain to Clerk dashboard → Domains
- Verify callback URLs include wildcard pattern: `https://opento-psi.vercel.app/*`

---

## Resources

- Clerk Dashboard: https://dashboard.clerk.com
- Clerk Docs: https://clerk.com/docs
- Vercel Dashboard: https://vercel.com/dashboard

