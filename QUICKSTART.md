# Opento Backend - Quick Start Guide

## What We Built

Your Opento prototype now has a **fully functional backend** with:

✅ **Clerk Authentication** - Sign up/sign in pages  
✅ **Supabase Database** - PostgreSQL with all tables  
✅ **90+ Skills** - Pre-seeded tech industry skills  
✅ **100+ Opportunities** - Gigs for marketing, engineering, design, data, product, sales  
✅ **Browse Agents** - Searchable directory with filters  
✅ **Dynamic Profiles** - Agent pages load from database  
✅ **Working Inbox** - Smart matching algorithm  
✅ **Real Transactions** - Accept offers, track earnings  

---

## 🚀 Get Started in 15 Minutes

### Step 1: Create Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Click "New Project"
3. Name: `opento-prod`, choose region, set password
4. Wait ~2 minutes for project to spin up

### Step 2: Run Migrations (3 min)

1. In Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Open `supabase/migrations/001_initial_schema.sql`
4. Copy all contents → Paste in SQL Editor → Click "Run"
5. Repeat for `002_seed_skills.sql`
6. Repeat for `003_seed_opportunities.sql`

✅ You now have 90+ skills and 100+ opportunities in your database!

### Step 3: Get Supabase Keys (1 min)

1. In Supabase → **Project Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (long string)

### Step 4: Create Clerk Account (3 min)

1. Go to [clerk.dev](https://clerk.dev) → Sign up
2. Click "Add application" → Name it "Opento"
3. Choose: Email + Google (optional)
4. Click "Create application"

### Step 5: Get Clerk Key (1 min)

1. In Clerk dashboard → **API Keys**
2. Copy **Publishable Key**: `pk_test_...`

### Step 6: Configure App (2 min)

Open `config.js` and replace:

```javascript
const config = {
  clerk: {
    publishableKey: 'pk_test_YOUR_KEY_HERE' // ← Paste Clerk key
  },
  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co', // ← Paste Supabase URL
    anonKey: 'eyJ...' // ← Paste Supabase anon key
  },
  app: {
    url: window.location.origin
  }
};
```

### Step 7: Test It! (5 min)

1. Open `sign-up.html` in browser
2. Create an account
3. You'll redirect to onboarding
4. Complete onboarding (settings saved to DB!)
5. View inbox → See matched offers
6. Go to `browse.html` → Search for agents
7. Visit an agent page → See dynamic data

---

## 📁 New Files Overview

```
config.js                           ← UPDATE THIS with your keys
sign-up.html                        ← Clerk sign up
sign-in.html                        ← Clerk sign in
browse.html                         ← Browse all agents (NEW!)

lib/
├── supabase-client.js             ← Database wrapper
├── onboarding-integration.js      ← Saves onboarding to DB
├── handle-integration.js          ← Loads agent pages from DB
└── inbox-integration.js           ← Loads offers from DB

supabase/migrations/
├── 001_initial_schema.sql         ← Database tables
├── 002_seed_skills.sql            ← 90+ skills
└── 003_seed_opportunities.sql     ← 100+ gigs
```

---

## 🧪 How to Test

### Test 1: Sign Up & Onboarding
1. Open `sign-up.html`
2. Create account
3. Complete onboarding
4. Check Supabase → **Table Editor** → `agent_settings` (should see your data!)

### Test 2: Browse Agents
1. Open `browse.html`
2. Try search: "performance marketing"
3. Filter by category: "Marketing"
4. Click "View profile" → Should load agent page

### Test 3: Dynamic Profile
1. Go to `handle.html?u=growthmaya`
2. Open browser console
3. Should see: "✓ Agent data loaded from database" (or "using demo data")

### Test 4: Inbox
1. Go to `inbox.html`
2. Should see matched offers
3. Click "Accept" on an offer
4. Check Supabase → `matched_offers` table (status = 'accepted')
5. Check `transactions` table (new transaction created!)

---

## 🎯 What's Different from Before?

### Before (Static Prototype):
- All data hardcoded in JavaScript
- No user accounts
- No database
- Everyone sees same content

### After (Full Backend):
- User accounts with Clerk
- All data in Supabase
- Personalized experiences
- Real matching algorithm
- Working transactions

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** enabled  
✅ Users can only see their own inbox/settings  
✅ Public profiles visible to everyone  
✅ Intro requests protected  
✅ Transactions private  

---

## 🐛 Troubleshooting

### "Clerk not loading"
→ Check `config.js` has correct `publishableKey`  
→ Should start with `pk_test_` or `pk_live_`

### "Supabase connection failed"
→ Verify URL has no trailing slash  
→ Check anon key is correct (long eyJ... string)  
→ Verify migrations were run

### "No offers in inbox"
→ Complete onboarding first (adds skills)  
→ Check browser console for errors  
→ Inbox will generate matches on first load

### "Browse page shows no agents"
→ Demo agents will always show  
→ Real users appear after onboarding  
→ Check console for errors

---

## 📊 Database Tables Explained

### Core Tables:
- **users** - User profiles (from Clerk)
- **skills** - 90+ tech skills (marketing, eng, design, data, product)
- **user_skills** - Links users to their skills
- **opportunities** - 100+ gigs/projects
- **agent_settings** - Floors, hours, availability (from onboarding)
- **agent_profiles** - Public profile data
- **matched_offers** - User's inbox
- **transactions** - Earnings tracking
- **intro_requests** - Contact form submissions

---

## 🚢 Deploy to Production

### Vercel Deployment:

1. Add environment variables in Vercel:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

2. Update `config.js` to use env vars:
   ```javascript
   const config = {
     clerk: {
       publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_...'
     },
     // ...
   };
   ```

3. Deploy: `vercel --prod`

---

## 🎓 Next Steps

### Immediate:
1. ✅ Configure Clerk + Supabase (you're here!)
2. Test all features
3. Customize opportunities for your niche
4. Add your branding/copy

### Soon:
1. Set up Clerk webhook (auto-sync users)
2. Improve matching algorithm
3. Add real-time updates (Supabase subscriptions)
4. Payment integration (Stripe)

### Later:
1. Admin dashboard
2. Messaging system
3. Reviews/ratings
4. Mobile app (React Native)

---

## 📚 Resources

- **Full Setup Guide**: `SETUP.md`
- **Architecture Overview**: `README_BACKEND.md`
- **Supabase Docs**: https://supabase.com/docs
- **Clerk Docs**: https://clerk.dev/docs

---

## 💡 Tips

- **Demo mode works without config** - Test UI before setting up backend
- **All pages have fallbacks** - Graceful degradation if DB fails
- **Console logs everywhere** - Check browser console for debug info
- **Mobile friendly** - Responsive design included
- **RLS enabled** - Data security built-in

---

## ✨ You're Ready!

Your Opento backend is complete. Time to:
1. Configure your keys (15 min)
2. Test everything (30 min)
3. Customize for your market
4. Launch! 🚀

Questions? Check the browser console first - lots of helpful logs!
