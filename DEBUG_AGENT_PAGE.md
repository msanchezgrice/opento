# Debugging Agent Page Data Not Showing

## Issue:
Agent page showing:
- Generic title ("account management" instead of user's professional title)
- Generic bio ("Hi I'm test...")
- "Building their profile" instead of user's "best at" content
- "Building track record" instead of user's achievements

## Root Causes:

### 1. Database Migration Not Run
**Most Likely Cause**

The database doesn't have the new columns yet, so:
- `professional_title` doesn't exist → API returns null → fallback to generic
- `bio` doesn't exist → API returns null → fallback to generic
- `best_at` doesn't exist → API returns empty array → shows placeholder
- `experience_highlights` doesn't exist → API returns empty array → shows placeholder

**Fix:** Run the SQL migration in Supabase:
```sql
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
```

### 2. Profile Created Before Migration
Even if migration is run, existing profiles won't have data in new fields.

**Fix A:** Create a new test profile through onboarding

**Fix B:** Manually update existing profile:
```sql
UPDATE agent_profiles 
SET 
  professional_title = 'Senior Account Management Lead',
  bio = 'I help B2B SaaS companies build lasting client relationships and drive retention. Specialized in enterprise accounts and strategic growth.',
  best_at = ARRAY[
    'Managing enterprise accounts $100K+ ARR',
    'Improving client retention by 25%+',
    'Building strategic account plans'
  ],
  experience_highlights = ARRAY[
    'Increased portfolio retention from 85% to 95%',
    'Managed $5M book of business across 50 accounts',
    'Led successful expansion into 3 Fortune 500 clients'
  ]
WHERE handle = 'test-12';
```

### 3. Data Not Being Saved During Onboarding
If you fill out Step 2 but data doesn't save:

**Check:** Browser console for errors during onboarding
**Verify:** `api/onboarding.js` is receiving the data (check Vercel logs)
**Test:** Create new profile and check database directly

## Verification Steps:

### Step 1: Check if columns exist
Run in Supabase SQL editor:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_profiles' 
AND column_name IN ('professional_title', 'bio', 'best_at', 'experience_highlights');
```

Should return 4 rows. If it returns 0 rows, migration wasn't run.

### Step 2: Check existing profile data
```sql
SELECT 
  handle,
  professional_title,
  bio,
  best_at,
  experience_highlights,
  skills
FROM agent_profiles 
WHERE handle = 'test-12';
```

If all new fields are NULL, profile was created before migration.

### Step 3: Test API response
Visit in browser:
```
https://your-domain.vercel.app/api/agents/test-12
```

Check JSON response for:
```json
{
  "professional_title": "...",
  "bio": "...",
  "best_at": [...],
  "experience_highlights": [...],
  ...
}
```

If these are null/empty, the data isn't in database.

### Step 4: Test public page
Visit: `/handle.html?u=test-12`

Should now show your actual content instead of placeholders.

## Quick Fix for Testing:

Run this in Supabase to update your existing profile:
```sql
-- First, run migration if not done
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];

-- Then update your profile
UPDATE agent_profiles 
SET 
  professional_title = 'Account Management Expert',
  bio = 'Helping B2B companies retain and grow their best accounts. 10+ years managing enterprise relationships.',
  best_at = ARRAY[
    'Enterprise account management',
    'Client retention strategies',
    'Upsell and expansion planning'
  ],
  experience_highlights = ARRAY[
    'Achieved 95% retention across $5M portfolio',
    '50+ enterprise accounts managed',
    'Closed $2M in upsells last year'
  ],
  skills = ARRAY['account management', 'consulting', 'copywriting', 'customer success', 'relationship management']
WHERE handle = 'test-12';

-- Verify it worked
SELECT professional_title, bio FROM agent_profiles WHERE handle = 'test-12';
```

## Expected Result:

After running the above SQL, refresh `/handle.html?u=test-12` and you should see:
- ✅ Title: "Account Management Expert"
- ✅ Bio: "Helping B2B companies retain..."
- ✅ Skills: 5 chips displayed
- ✅ What I'm best at: 3 bullets
- ✅ Recent wins: 3 achievements

---

## For Future Profiles:

New profiles created through onboarding AFTER migration will automatically have all data populated correctly. Just make sure to:
1. Fill out Step 2 completely
2. Use "Get Help" buttons or write your own content
3. Complete all steps
4. Check public page to verify

