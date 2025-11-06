# Database Migration Instructions

## Migration 008: Profile Story Fields

This migration adds user-authored content fields to replace auto-generated content.

### What It Does:
- Adds `professional_title` (user-defined title instead of auto-gen)
- Adds `bio` (user-written 2-3 sentence bio)
- Adds `best_at` (array of user strengths)
- Adds `experience_highlights` (array of achievements)
- Adds `education_display` and `notable_companies` for future use
- Updates profile completeness calculation

### How to Run:

#### Option 1: Via Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard/project/[your-project]/sql
2. Copy the contents of `supabase/migrations/008_profile_story.sql`
3. Paste into SQL editor
4. Click "Run"
5. Verify success message

#### Option 2: Via Supabase CLI
```bash
supabase db push
```

#### Option 3: Manual SQL Execution
Connect to your database and run:
```sql
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[];
```

### Verification:
After running, check the schema:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_profiles' 
AND column_name IN ('professional_title', 'bio', 'best_at', 'experience_highlights');
```

Should return 4 rows.

### Rollback (if needed):
```sql
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS professional_title;
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS best_at;
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS experience_highlights;
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS education_display;
ALTER TABLE agent_profiles DROP COLUMN IF EXISTS notable_companies;
```

---

## Environment Variable Check

Make sure you have `OPENAI_API_KEY` set in Vercel:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Redeploy if needed

---

## Testing Checklist

After migration:
- [ ] Visit `/onboarding.html`
- [ ] Complete Step 1 (basic info + skills)
- [ ] Try "Get Help" buttons in Step 2
- [ ] Fill in title, bio, best at, highlights
- [ ] Complete remaining steps
- [ ] View public profile - verify all fields display
- [ ] Check Skills section appears
- [ ] Check "What I'm best at" shows your bullets
- [ ] Check "Recent wins" shows your achievements

---

## Status: ✅ READY TO RUN

All code is deployed. Just need to run the migration on your Supabase database.
