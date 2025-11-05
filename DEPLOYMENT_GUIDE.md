# Opento Deployment Guide

## ✅ What's Been Implemented

### 1. User Creation & Management System
- **API Endpoint**: `POST /api/users`
- Creates new user accounts with unique handles
- Generates pretty URLs (e.g., `jane-doe-a4b2`)
- Automatic avatar initials generation
- Stores user profile data in Supabase

### 2. Onboarding Flow Integration
- **API Endpoint**: `POST /api/onboarding`
- Collects and saves:
  - Agent settings (rates, hours, availability)
  - Skills (fuzzy-matched to database)
  - Social links (LinkedIn, Twitter, Instagram)
  - Profile data (years of experience, location)
- Generates agent profile automatically
- Creates `open_to` and `focus_areas` based on categories and skills

### 3. Dynamic Agent Profile Pages
- **API Endpoint**: `GET /api/agents/:handle`
- Loads agent data from Supabase
- Populates handle.html dynamically
- Shows real user data instead of demo data
- Fallback to 404 if agent not found

### 4. Communication Features
- **Chat API**: `POST /api/chat` (already existed, now uses dynamic agent data)
- **Intro Requests**: `POST /api/intro-request`
- Saves intro requests to database
- Links requests to specific agents

### 5. Skills Database
- Pre-seeded with 85+ common skills across 6 categories:
  - Marketing (17 skills)
  - Engineering (16 skills)
  - Design (12 skills)
  - Product (8 skills)
  - Data & Analytics (10 skills)
  - Business & Sales (12 skills)
- Each skill tagged with category and tier (core/high)

### 6. Database Schema
- All tables from `001_initial_schema.sql` are used
- New migration `002_seed_skills.sql` for skills data
- Relationships properly configured

---

## 🚀 Deployment Steps

### 1. Environment Variables

Add these to your Vercel project settings:

```
SUPABASE_URL=https://axoycualmoxyqizjkuof.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>
OPENAI_API_KEY=<your-openai-key>
```

### 2. Run Database Migrations

In Supabase SQL Editor:

```sql
-- Already done in your project:
-- supabase/migrations/001_initial_schema.sql

-- Run the skills seed:
-- Copy contents of supabase/migrations/002_seed_skills.sql
-- Paste and execute in SQL Editor
```

### 3. Install Dependencies

Vercel will auto-install, but locally:

```bash
npm install
```

### 4. Deploy

```bash
git push origin main
# Vercel auto-deploys on push
```

---

## 🧪 Testing the Flow

### Test User Creation + Onboarding

1. Go to `https://opento.com/onboarding.html` (or your domain)
2. Fill out all 6 steps of the wizard:
   - Step 1: Years, location, skills
   - Step 2: Social links (optional)
   - Step 3: Weekly hours
   - Step 4: Select categories
   - Step 5: Set rates
   - Step 6: Privacy settings
3. Click "Build my agent"
4. When prompted, enter your name (e.g., "John Smith")
5. You'll be redirected to your agent page: `handle.html?u=john-smith-a4b2`

### Test Agent Profile Page

1. Go to `handle.html?u=<handle>` for any created user
2. Verify:
   - Name, role, location display correctly
   - Skills show up
   - Open to / Focus areas are populated
   - Rates and availability are correct
3. Test chat: Click "Chat with Rep"
4. Test intro request: Click "Request an intro"

### Test Browse Agents

1. Go to `browse.html`
2. If no real agents exist yet, demo agents will show
3. Once real users are created, they'll appear in browse

---

## 📋 Current Flow

```
User lands on index.html
  ↓
Clicks "Start my agent"
  ↓
Routed to onboarding.html
  ↓
Fills out 6-step wizard
  ↓
Clicks "Build my agent"
  ↓
[Popup] Enter display name
  ↓
API: POST /api/users → Creates user, generates handle
  ↓
API: POST /api/onboarding → Saves settings + skills + profile
  ↓
Redirected to handle.html?u=<handle>
  ↓
handle-integration.js loads: GET /api/agents/<handle>
  ↓
Agent profile page displays with real data
```

---

## 🔧 What Still Needs Configuration

### 1. Supabase Environment Variables
- Get your `SUPABASE_SERVICE_KEY` from Supabase dashboard
- Add to Vercel environment variables
- Redeploy after adding

### 2. OpenAI API Key (for Chat)
- Get from https://platform.openai.com/api-keys
- Add `OPENAI_API_KEY` to Vercel
- Chat will work once key is configured

### 3. Skills Migration
- If not already run, execute `002_seed_skills.sql` in Supabase SQL Editor
- This populates the skills table

---

## 🐛 Troubleshooting

### "Failed to create user account"
- Check that `SUPABASE_SERVICE_KEY` is set in Vercel
- Verify database migrations are applied
- Check Vercel function logs

### "Agent not found"
- User may not exist in database
- Check handle is correct
- Verify API endpoint returns 200

### "Failed to save onboarding data"
- Skills migration may not be run
- Check user_id exists
- Verify database schema is up to date

### Chat not working
- Check `OPENAI_API_KEY` is set
- Verify agent data is loading correctly
- Check browser console for errors

---

## 📝 Next Steps (Future Work)

### Authentication
- [ ] Implement LinkedIn OAuth
- [ ] Replace localStorage user IDs with real auth
- [ ] Session management

### User Management
- [ ] Profile editing page
- [ ] Upload profile photos
- [ ] Settings page to update rates/hours

### Inbox Functionality
- [ ] Load real matched offers
- [ ] Accept/decline offers
- [ ] Track earnings

### Browse & Discovery
- [ ] Load real agents from database
- [ ] Implement filtering by skills
- [ ] Search functionality

### Notifications
- [ ] Email notifications for intro requests
- [ ] Agent activity digest

---

## 📚 Documentation

- **API Documentation**: See `API_README.md`
- **Database Schema**: See `supabase/migrations/001_initial_schema.sql`
- **Environment Variables**: See `.env.example`

---

## ✅ Verification Checklist

Before considering deployment complete:

- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Skills seed data loaded
- [ ] Can create new user via onboarding
- [ ] Agent profile page loads with real data
- [ ] Chat functionality works
- [ ] Intro requests save to database
- [ ] No console errors on any page

---

## 🎉 Success Criteria

You'll know it's working when:

1. You complete onboarding and see your own agent page
2. Your name, skills, and settings appear correctly
3. Someone else can view your agent page by handle
4. Chat responds with your specific data
5. Intro requests save and appear in Supabase

---

**Commit**: `083d178`  
**Date**: 2025-11-05  
**Branch**: `main`
