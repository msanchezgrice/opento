# Clerk Routes Configuration

## Current Setup

Your Clerk configuration is set up for production at `clerk.opento.co`.

### Publishable Key
```
pk_live_Y2xlcmsub3BlbnRvLmNvJA
```

---

## Required Clerk Dashboard Configuration

Go to: https://dashboard.clerk.com → Your Opento App → **Paths**

### 1. Sign-up Redirect URL
After successful sign-up, redirect to onboarding:
```
/onboarding.html
```

### 2. Sign-in Redirect URL  
After successful sign-in, redirect to inbox:
```
/inbox.html
```

### 3. After Sign-out URL
After sign-out, redirect to home:
```
/index.html
```

### 4. Home URL (optional)
```
/index.html
```

---

## Application URLs in Clerk

Go to: **Domains** section

Add your production domain:
```
https://opento-psi.vercel.app
```

And if you have a custom domain:
```
https://opento.co
https://www.opento.co
```

---

## OAuth Callbacks (for social logins)

If using Google/GitHub auth, Clerk auto-configures these, but verify:

**Allowed callback URLs:**
```
https://opento-psi.vercel.app/*
https://opento.co/*
```

---

## Vercel Environment Variables

Already set (✅):
- `CLERK_SECRET_KEY` = `sk_live_***` (your secret key from Clerk dashboard)

The publishable key is in `config.js` (frontend-safe).

---

## Testing Routes

### 1. Sign Up Flow
1. Go to: `https://opento-psi.vercel.app/sign-up`
2. Create account with email
3. Verify email
4. Should redirect to: `/onboarding.html`

### 2. Sign In Flow
1. Go to: `https://opento-psi.vercel.app/sign-in`
2. Sign in with credentials
3. Should redirect to: `/inbox.html`

### 3. Sign Out
- Click sign out (when implemented)
- Should redirect to: `/index.html`

---

## Current Navigation Structure

### Landing Page (`/index.html`)
- **Sign in** → `/sign-in.html`
- **Start my agent** → `/sign-up.html`
- **Browse agents** → `/browse.html`

### Browse Page (`/browse.html`)
- **Home** → `/index.html`
- **Sign in** → `/sign-in.html`
- **Testimonials** → `/testimonials.html`
- No "Start my agent" button (browse is for clients looking for agents)

### Handle Page (`/handle.html?u=...`)
- **Browse agents** → `/browse.html`
- **Testimonials** → `/testimonials.html`
- **Start my agent** → `/onboarding.html` (for those who want to become agents)

### Sign-up Page (`/sign-up.html`)
- After completion → `/onboarding.html`

### Sign-in Page (`/sign-in.html`)
- After completion → `/inbox.html`

### Onboarding Page (`/onboarding.html`)
- After completion → `/inbox.html`

---

## Protected Routes (Future Enhancement)

You may want to add auth checks to these pages:
- `/inbox.html` - Requires sign-in
- `/onboarding.html` - Requires sign-in
- `/recipes.html` - Requires sign-in

Add this to the top of protected pages:
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

### 1. Create webhook endpoint
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
    // ...
  }

  res.status(200).json({ received: true });
}
```

### 2. Add webhook in Clerk dashboard
**Webhooks** section → Add endpoint:
```
https://opento-psi.vercel.app/api/webhooks/clerk
```

Subscribe to events:
- `user.created`
- `user.updated`
- `user.deleted`

---

## Summary

✅ **Landing page** - Sign up button added  
✅ **Browse page** - Navigation fixed (no "Start my agent")  
✅ **Clerk keys** - Configured in `config.js` and Vercel  
⏳ **Clerk dashboard** - Configure redirect URLs (see above)  
⏳ **Test sign-up flow** - Create account and verify redirects  

Once you configure the redirect URLs in Clerk dashboard, everything will work perfectly!
