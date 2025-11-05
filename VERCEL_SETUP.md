# Vercel Environment Variables Setup

## ⚠️ CRITICAL: You must set these environment variables in Vercel for the API to work!

---

## Step 1: Get Your Supabase Keys

### A. Get Service Role Key (REQUIRED for user creation)

1. Go to https://supabase.com/dashboard
2. Select project: `axoycualmoxyqizjkuof`
3. Click **Settings** (gear icon in left sidebar)
4. Click **API**
5. Scroll down to **Project API keys**
6. Find **`service_role`** key
7. Click **Reveal** and **Copy** it

**⚠️ IMPORTANT**: 
- This is the **service_role** key (starts with `eyJ...`)
- NOT the anon/public key
- Keep it secret - never commit to git!

### B. Get Anon Key (for public queries)

Same steps as above, but copy the **`anon`** / **`public`** key instead.

---

## Step 2: Add Keys to Vercel

### Via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your **opento** project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Add each variable:

#### Required Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://axoycualmoxyqizjkuof.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | `eyJ...` (your service_role key) | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `eyJ...` (your anon/public key) | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-...` (your OpenAI API key) | Production, Preview, Development |

**For each variable:**
1. Click **Add New**
2. Enter **Name** (exact spelling matters!)
3. Paste **Value**
4. Select all three environments: ✅ Production ✅ Preview ✅ Development
5. Click **Save**

### Via Vercel CLI (Alternative):

```bash
vercel env add SUPABASE_URL
# Paste: https://axoycualmoxyqizjkuof.supabase.co
# Select: Production, Preview, Development

vercel env add SUPABASE_SERVICE_KEY
# Paste your service_role key
# Select: Production, Preview, Development

vercel env add SUPABASE_ANON_KEY
# Paste your anon key
# Select: Production, Preview, Development

vercel env add OPENAI_API_KEY
# Paste your OpenAI key
# Select: Production, Preview, Development
```

---

## Step 3: Redeploy

After adding all environment variables:

### Option A: Automatic (via git push)
```bash
git commit --allow-empty -m "Redeploy with env vars"
git push origin main
```

### Option B: Manual
1. Go to **Deployments** tab in Vercel
2. Find latest deployment
3. Click **⋯** (three dots)
4. Click **Redeploy**

---

## Step 4: Verify It Works

### Test Environment Variables:

Visit: `https://your-domain.vercel.app/api/test-env`

Should return:
```json
{
  "message": "Environment variables check",
  "env": {
    "SUPABASE_URL": true,
    "SUPABASE_ANON_KEY": true,
    "SUPABASE_SERVICE_KEY": true,
    "OPENAI_API_KEY": true
  }
}
```

If any show `false`, that variable is not set correctly.

### Test User Creation:

1. Go to `https://your-domain.vercel.app/onboarding.html`
2. Complete the onboarding flow
3. When prompted, enter your name
4. If it works, you'll be redirected to your agent page!

---

## Troubleshooting

### Error: "supabaseKey is required"
**Problem**: `SUPABASE_SERVICE_KEY` is not set or is empty

**Solution**: 
1. Double-check you copied the **service_role** key (not anon key)
2. Make sure variable name is exactly `SUPABASE_SERVICE_KEY` (no typos)
3. Redeploy after adding the variable

### Error: "Invalid API key"
**Problem**: Wrong key was copied

**Solution**:
1. Go back to Supabase dashboard
2. Copy the correct **service_role** key
3. Update the variable in Vercel
4. Redeploy

### Error: "Failed to create user account"
**Problem**: Database permissions or migrations not run

**Solution**:
1. Make sure you ran `001_initial_schema.sql` in Supabase SQL Editor
2. Check that `users` table exists in your database
3. Verify RLS policies are set up

---

## Security Notes

⚠️ **Service Role Key**:
- Has full database access (bypasses RLS)
- Only use server-side (Vercel functions)
- Never expose in client-side code
- Never commit to git

✅ **Anon Key**:
- Safe to expose publicly
- Respects Row Level Security (RLS)
- Used in browser via `config.js`

---

## Current Status

After you add the environment variables and redeploy:

- ✅ User creation will work
- ✅ Onboarding will save to database
- ✅ Agent profiles will load from database
- ✅ Chat will work (if OPENAI_API_KEY is set)
- ✅ Intro requests will save

---

**Need Help?**

If you're still getting errors after following these steps, check:
1. Vercel deployment logs (Functions tab)
2. Browser console (F12)
3. Supabase logs (Logs & Analytics)
