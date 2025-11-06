# Debug Instructions - API Returning Null Profiles

## 🔍 Current Status

✅ **Database**: Has all enhanced onboarding data  
✅ **Code**: `/api/agents/[handle].js` is coded correctly to return enhanced fields  
❌ **API Response**: Returning `"profile": null` and `"settings": null`

## 🐛 Debug Logging Added

I've added console.log statements to `/api/agents/[handle].js` to see what Supabase is actually returning.

## 📋 Steps to Debug

### 1. Wait for Vercel Deployment (1-2 minutes)

Check: https://vercel.com/dashboard → Your project → Deployments

Wait for the latest deployment (commit: "Add debug logging to agents API endpoint") to show status: **Ready**

### 2. Trigger the API

Visit: https://www.opento.co/api/agents/joe-tester

(This will trigger the logs)

### 3. Check Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to "Logs" tab (or "Runtime Logs")  
4. Look for logs from the `/api/agents/joe-tester` endpoint
5. You should see:
   ```
   Supabase query result for joe-tester:
   - agent_profiles: [...]
   - agent_settings: [...]
   ```

### 4. What to Look For

**If logs show empty/null:**
```
- agent_profiles: null
- agent_settings: null
```
→ **Issue**: Supabase join query isn't working (likely env var issue)

**If logs show data:**
```
- agent_profiles: [{"professional_title":"Senior Growth..."}]
- agent_settings: [{"consult_floor_30m":75...}]
```
→ **Issue**: Code logic problem (but this shouldn't happen as code looks correct)

## 🔧 Likely Root Causes

### Cause 1: Missing/Incorrect SUPABASE_SERVICE_KEY

**Check**: Vercel Dashboard → Your Project → Settings → Environment Variables

Should have:
- `SUPABASE_URL`: `https://axoycualmoxyqizjkuof.supabase.co`
- `SUPABASE_SERVICE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (service_role key)

**If missing/wrong**, the API is using the anon key which might not have permissions.

### Cause 2: Supabase JS Client Version Issue

The join syntax `agent_profiles (*)` should work with Supabase JS v2, but might have issues.

**Solution**: Try alternative query format (I can update this if needed)

### Cause 3: RLS Policy Edge Case

Even though we verified RLS policies allow SELECT, there might be a service_role specific issue.

**Solution**: Temporarily disable RLS on agent_profiles table (not recommended for prod)

## 📊 Verification Query

To confirm database has data, run in Supabase SQL Editor:

```sql
SELECT 
  u.handle,
  ap.professional_title,
  ap.bio,
  ap.seniority_level,
  ase.consult_floor_30m
FROM users u
LEFT JOIN agent_profiles ap ON ap.user_id = u.id
LEFT JOIN agent_settings ase ON ase.user_id = u.id
WHERE u.handle = 'joe-tester';
```

Should return:
```
joe-tester | Senior Growth Marketing Lead | I help B2B... | Senior | 75
```

## 🎯 Next Steps After Checking Logs

**Share the log output with me** and I'll:
1. Identify the exact issue
2. Provide the fix
3. Update the code accordingly

The data is definitely in the database - we just need to see why the API can't read it! 🔍

