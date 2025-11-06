# Profile Coherence Deployment Steps

## ✅ WHAT'S ALREADY DEPLOYED:
1. Frontend UI (Step 2 with Get Help buttons)
2. AI suggestion API (/api/suggest/profile)
3. Onboarding collection & save logic
4. Public profile display logic
5. Agent API returning new fields

## ⚠️ WHAT YOU NEED TO DO:

### Step 1: Run Database Migration
**CRITICAL: This must be done first!**

Go to: https://supabase.com/dashboard/project/[your-project]/sql

Copy and paste this SQL:
```sql
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[];
```

Click **"Run"** and verify success.

### Step 2: Verify Environment Variables in Vercel
Make sure you have:
- `OPENAI_API_KEY` - For AI suggestions (Get Help buttons)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your service role key

### Step 3: Redeploy (Optional)
If Vercel didn't auto-deploy the latest commits:
1. Go to Vercel dashboard
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

### Step 4: Test End-to-End

#### Create a New Profile:
1. Visit `/onboarding.html`
2. **Step 1:** Enter name, experience, location, skills
3. **Step 2 (NEW):** Try Get Help buttons:
   - Professional title: Click "Get Help" → Should suggest a title
   - Bio: Click "Get Help" → Should suggest 2-3 sentences
   - Best at: Click "Get Help" → Should fill 3 bullets
   - Recent wins: Click "Get Help" → Should fill 3 achievements
4. Complete remaining steps
5. Finish onboarding

#### View Public Profile:
1. Go to your agent page: `/handle.html?u=yourhandle`
2. Verify displays:
   - ✅ Your professional title (not "business development")
   - ✅ Your bio (not generic text)
   - ✅ Skills section with chips (not [object Object])
   - ✅ "What I'm best at" with your bullets
   - ✅ "Recent wins" with your achievements
   - ✅ Experience section (seniority, company, industries)

---

## 🐛 TROUBLESHOOTING:

### Issue: Skills showing "[object Object]"
**Cause:** Using old profile created before migration
**Fix:** Create a new test profile OR update existing:
```sql
UPDATE agent_profiles 
SET skills = ARRAY['Skill 1', 'Skill 2', 'Skill 3']
WHERE handle = 'yourhandle';
```

### Issue: Bio/Title showing old generic text
**Cause:** Migration not run OR old profile data
**Fix:** 
1. Verify migration ran successfully
2. Create new profile through onboarding
3. OR manually update:
```sql
UPDATE agent_profiles 
SET 
  professional_title = 'Your Title',
  bio = 'Your bio text...',
  best_at = ARRAY['bullet 1', 'bullet 2', 'bullet 3'],
  experience_highlights = ARRAY['win 1', 'win 2', 'win 3']
WHERE handle = 'yourhandle';
```

### Issue: Get Help buttons not working
**Cause:** OPENAI_API_KEY missing
**Fix:** Add to Vercel environment variables

### Issue: Page says "Agent not found"
**Cause:** Handle doesn't exist in database
**Fix:** Complete onboarding to create the profile

---

## 📊 WHAT CHANGED:

### Database Schema (+6 columns):
- `professional_title` - User-defined title
- `bio` - User-written bio
- `best_at` - Array of strengths
- `experience_highlights` - Array of wins
- `education_display` - For future use
- `notable_companies` - For future use

### New API Endpoints:
- `POST /api/suggest/profile` - AI suggestions via GPT-4o

### Modified Files:
- `onboarding.html` - Added Step 2
- `handle.html` - Added Skills card, updated sections
- `lib/handle-integration.js` - Display logic
- `api/agents/[handle].js` - Return new fields
- `api/onboarding.js` - Save new fields

### Features:
- ✨ Get Help buttons (AI-powered)
- 💡 Skills display on public profiles
- ⚡ User-written strengths section
- 🏆 User-written achievements section
- 📝 Authentic bios instead of templates

---

## 🎯 SUCCESS CRITERIA:

After deployment, you should see:
- [ ] Skills display as chips (not [object Object])
- [ ] Professional title shows user's input
- [ ] Bio shows user's writing
- [ ] "What I'm best at" shows 3 bullets
- [ ] "Recent wins" shows 3 achievements
- [ ] Get Help buttons work for all fields
- [ ] No console errors

---

## 🚀 NEXT STEPS (Optional Future):

1. Profile completeness score in dashboard
2. Profile editor (edit after onboarding)
3. Live preview before finishing
4. LinkedIn import for highlights
5. Credentials section display

---

## Status: READY FOR MIGRATION

All code is deployed to Vercel. Just need to:
1. Run the SQL migration in Supabase
2. Test with a new profile
3. Verify everything displays correctly

Let me know when you've run the migration and I can help debug any issues!
