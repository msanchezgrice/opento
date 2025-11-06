# Production Deployment Checklist

## ISSUE: New profile (joe-tester) not showing data

### Root Causes:
1. ✅ Code is deployed to Vercel
2. ❌ Database migration NOT run on production Supabase
3. ❌ CSS changes may be cached in browser

---

## CRITICAL: Run This SQL in Production Supabase

**Go to:** https://supabase.com/dashboard

**Select your production project**

**Go to:** SQL Editor

**Paste and run:**

```sql
-- Migration 008: Profile Story Fields
-- MUST be run on production database!

ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[];

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agent_profiles' 
AND column_name IN ('professional_title', 'bio', 'best_at', 'experience_highlights')
ORDER BY column_name;

-- Should return 4 rows
```

---

## After Running Migration:

### 1. Test with NEW profile:
- Go to: https://www.opento.co/onboarding.html
- Complete all steps including Step 2 (Tell Your Story)
- Fill in professional title, bio, best at, highlights
- Finish onboarding
- Check public page

### 2. Fix existing joe-tester profile:

```sql
-- Update joe-tester profile with sample data
UPDATE agent_profiles 
SET 
  professional_title = 'Business Development Lead',
  bio = 'I help B2B companies build strategic partnerships and scale revenue. 10+ years in enterprise sales.',
  best_at = ARRAY[
    'Enterprise partnership development',
    'Revenue growth strategies',
    'Deal structuring and negotiation'
  ],
  experience_highlights = ARRAY[
    'Closed $10M+ in strategic partnerships',
    'Built BD function from 0 to $50M pipeline',
    'Negotiated deals with Fortune 500 companies'
  ]
WHERE user_id IN (
  SELECT id FROM users WHERE handle = 'joe-tester'
);
```

---

## CSS/Polish Fixes Not Showing:

### Option 1: Hard Refresh
- **Mac:** Cmd + Shift + R
- **Windows:** Ctrl + Shift + R
- **Or:** Cmd/Ctrl + F5

### Option 2: Clear Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

### Option 3: Force Vercel Redeploy
1. Go to Vercel dashboard
2. Click your project
3. Go to Deployments
4. Click "..." on latest deployment
5. Click "Redeploy"

---

## Verification Steps:

### 1. Check API Response:
```
https://www.opento.co/api/agents/joe-tester
```

Should show:
```json
{
  "professional_title": "Business Development Lead",
  "bio": "I help B2B...",
  "best_at": [...],
  "experience_highlights": [...]
}
```

### 2. Check Agent Page:
```
https://www.opento.co/handle?u=joe-tester
```

Should display:
- ✅ Professional title (not "bizdev")
- ✅ Bio (not generic text)
- ✅ Skills section
- ✅ "What I'm best at" with bullets
- ✅ "Recent wins" with bullets

### 3. Check CSS:
- All chips should be same size
- Skills dropdown should not cover input
- Monthly estimate should show on step 3

---

## Common Issues:

### Issue: "Column already exists"
**Solution:** That's fine! The `IF NOT EXISTS` handles it.

### Issue: Still showing null after migration
**Solution:** Existing profiles need to be updated (run UPDATE query above)

### Issue: New profiles still don't save data
**Solution:** 
1. Check browser console for errors
2. Check Vercel logs for API errors
3. Verify migration ran successfully

### Issue: CSS still looks old
**Solution:**
1. Hard refresh (Cmd+Shift+R)
2. Check Vercel deployment time (should be recent)
3. Check styles.css loaded from CDN

---

## Expected Timeline:

1. **Run SQL migration:** 30 seconds
2. **Update joe-tester profile:** 10 seconds  
3. **Hard refresh browser:** 5 seconds
4. **Create new test profile:** 2 minutes
5. **Verify everything works:** 1 minute

**Total:** ~4 minutes

---

## After Migration Works:

You should see:
- ✅ joe-tester page shows real data
- ✅ New profiles save correctly
- ✅ All polish fixes visible
- ✅ Skills displayed as chips
- ✅ "What I'm best at" shows bullets
- ✅ "Recent wins" shows achievements

---

## Still Having Issues?

1. **Share:** Screenshot of browser console errors
2. **Share:** Vercel deployment logs
3. **Share:** Results of SQL verification query
4. **Share:** API response from /api/agents/joe-tester

I'll debug further!
