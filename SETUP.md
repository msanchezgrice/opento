# Opento Backend Setup Guide

## Overview
This guide will help you set up Clerk authentication and Supabase database for Opento.

## Prerequisites
- Node.js installed (for running migrations)
- Clerk account (free tier works)
- Supabase account (free tier works)

---

## Step 1: Set up Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose organization, name your project (e.g., "opento-prod")
4. Set a strong database password (save this!)
5. Choose region closest to your users
6. Click "Create new project" (takes ~2 minutes)

### 1.2 Run Database Migrations
1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy the content from `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run" (bottom right)
5. Repeat for `002_seed_skills.sql`
6. Repeat for `003_seed_opportunities.sql`

### 1.3 Get Supabase Keys
1. Go to Project Settings > API
2. Copy "Project URL" (e.g., `https://abc123.supabase.co`)
3. Copy "anon/public" key (starts with `eyJ...`)
4. Save these for Step 3

---

## Step 2: Set up Clerk

### 2.1 Create Clerk Application
1. Go to [clerk.dev](https://clerk.dev) and sign up
2. Click "Add application"
3. Name it "Opento"
4. Choose authentication options:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)
5. Click "Create application"

### 2.2 Configure Redirects
1. In Clerk dashboard, go to "Paths"
2. Set:
   - Sign-up fallback redirect: `/onboarding.html`
   - Sign-in fallback redirect: `/inbox.html`
   - After sign out: `/index.html`

### 2.3 Get Clerk Keys
1. Go to "API Keys" in Clerk dashboard
2. Copy "Publishable Key" (starts with `pk_test_...` or `pk_live_...`)
3. Save this for Step 3

### 2.4 Set up Webhook (Optional but Recommended)
This syncs Clerk users to Supabase automatically.

1. In Clerk dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/clerk` (you'll create this)
4. Subscribe to events: `user.created`, `user.updated`
5. Copy "Signing Secret"

---

## Step 3: Configure Application

### 3.1 Update config.js
Open `config.js` and replace the placeholder values:

```javascript
const config = {
  clerk: {
    publishableKey: 'pk_test_YOUR_KEY_HERE' // From Step 2.3
  },
  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co', // From Step 1.3
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // From Step 1.3
  },
  app: {
    url: window.location.origin
  }
};
```

### 3.2 Create .env file (for webhooks/backend)
If you're setting up webhooks or API routes:

```bash
# Copy example
cp .env.example .env

# Edit with your keys
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # From Supabase > Settings > API
```

---

## Step 4: Test the Setup

### 4.1 Test Authentication
1. Open `sign-up.html` in browser
2. Try creating an account
3. Should redirect to onboarding after sign up
4. Sign out and try `sign-in.html`

### 4.2 Test Database Connection
1. Open browser console (F12)
2. Run: `window.supabaseClient.getAllSkills()`
3. Should see array of skills
4. Run: `window.supabaseClient.getDemoUser()`
5. Should see demo user object

### 4.3 Test Browse Agents
1. Navigate to `browse.html`
2. Should see demo agents listed
3. Try filtering by skill or category
4. Click "View profile" to see agent page

---

## Step 5: Deploy (Vercel)

### 5.1 Add Environment Variables to Vercel
1. Go to Vercel dashboard
2. Select your project
3. Settings > Environment Variables
4. Add:
   ```
   CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

### 5.2 Update Production Config
Create `config.prod.js` or use environment variable injection:

```javascript
const config = {
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_live_...'
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://...',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ...'
  }
};
```

### 5.3 Deploy
```bash
vercel --prod
```

---

## Troubleshooting

### "Clerk not loading"
- Check that `config.js` has correct publishable key
- Check browser console for errors
- Verify key starts with `pk_test_` or `pk_live_`

### "Supabase connection failed"
- Verify project URL is correct (no trailing slash)
- Check anon key is correct
- Go to Supabase > Settings > API to verify

### "No agents showing in browse"
- Check browser console for errors
- Run `window.supabaseClient.demoMode` - should be `true` if not configured
- If demo mode, agents should still show (demo data)

### Row Level Security (RLS) errors
- Go to Supabase > Authentication > Policies
- Verify policies are enabled
- For testing, you can temporarily disable RLS on tables

---

## Next Steps

1. **Create Demo Account**: Sign up at your domain to test full flow
2. **Complete Onboarding**: Go through onboarding to see data save to DB
3. **View Your Agent Page**: Check `handle.html?u=yourhandle`
4. **Test Inbox**: Go to `inbox.html` to see matched offers
5. **Set up Webhooks**: Create API endpoint for Clerk webhook (see Step 2.4)

---

## Architecture Overview

```
Frontend (Static HTML/JS)
  ↓
Clerk (Authentication)
  ↓
Supabase (Database + Auth Proxy)
  ↓
PostgreSQL (Data Storage)
```

### Key Files
- `config.js` - Configuration (update with your keys)
- `lib/supabase-client.js` - Database wrapper
- `supabase/migrations/` - Database schema
- `sign-up.html` / `sign-in.html` - Auth pages
- `onboarding.html` - Saves to Supabase
- `browse.html` - Queries agents from DB
- `handle.html` - Dynamic agent profiles
- `inbox.html` - Matched offers from DB

---

## Security Notes

⚠️ **Never commit sensitive keys to Git**
- Add `.env` to `.gitignore`
- Keep `config.js` with placeholder values in repo
- Use environment variables in production

⚠️ **Row Level Security (RLS) is enabled**
- Users can only see their own sensitive data
- Public profiles are viewable by everyone
- Test policies thoroughly before launch

---

## Support

Having issues? Check:
1. Browser console for errors
2. Supabase logs: Database > Logs
3. Clerk logs: Dashboard > Logs
4. Network tab to see failed requests

For questions, refer to:
- [Clerk Docs](https://clerk.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
