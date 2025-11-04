# Vercel Environment Variables Setup

## Required Environment Variables

Add these in **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**:

### Clerk (Required)
```
CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsub3BlbnRvLmNvJA
CLERK_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
```

**Note:** Get `CLERK_SECRET_KEY` from Clerk Dashboard → API Keys

### Supabase (Optional - already hardcoded as fallback)
```
SUPABASE_URL=https://axoycualmoxyqizjkuof.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## How to Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **opento** project
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Click **Add New**
6. For each variable:
   - **Key**: `CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_live_Y2xlcmsub3BlbnRvLmNvJA`
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just Production)
   - Click **Save**
7. Repeat for `CLERK_SECRET_KEY` and Supabase variables

---

## Injecting Environment Variables into Frontend

Since this is a static site, we need to inject env vars at build time. Create a small script to inject them:

### Option 1: Add to vercel.json (Recommended)

Vercel automatically injects env vars, but we need to expose them to the browser. Add this build command:

```json
{
  "buildCommand": "node inject-env.js",
  "outputDirectory": ".",
  "installCommand": "echo 'No install needed'",
  "devCommand": "python3 -m http.server 8080",
  "rewrites": [
    { "source": "/", "destination": "/index.html" }
  ],
  "cleanUrls": true
}
```

### Option 2: Create inject-env.js (Simple approach)

Create `inject-env.js`:

```javascript
const fs = require('fs');

// Read config.js
let configJs = fs.readFileSync('config.js', 'utf8');

// Replace placeholder with actual env vars (Vercel injects these)
const clerkKey = process.env.CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsub3BlbnRvLmNvJA';
const supabaseUrl = process.env.SUPABASE_URL || 'https://axoycualmoxyqizjkuof.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Inject into config.js
configJs = configJs.replace(
  /publishableKey:.*?['"](.*?)['"]/,
  `publishableKey: '${clerkKey}'`
);

fs.writeFileSync('config.js', configJs);
console.log('✅ Environment variables injected');
```

---

## Simpler Approach: Use Vercel's Built-in Injection

Actually, for static sites, we can use a simpler approach. Vercel automatically makes env vars available, but we need to expose them to the browser via a small script tag.

### Update index.html (or create _env.js)

Add this before `config.js`:

```html
<script>
  // Inject Vercel environment variables into window
  window.ENV_CLERK_PUBLISHABLE_KEY = '<!-- CLERK_PUBLISHABLE_KEY -->';
  window.ENV_SUPABASE_URL = '<!-- SUPABASE_URL -->';
  window.ENV_SUPABASE_ANON_KEY = '<!-- SUPABASE_ANON_KEY -->';
</script>
```

But this requires server-side processing...

---

## Easiest Solution: Keep Hardcoded (Current Approach)

For now, **keep the hardcoded values in `config.js`** as fallbacks. The `CLERK_SECRET_KEY` is the only one that MUST be in environment variables (it's used server-side only).

The publishable key is safe to expose in frontend code, so hardcoding it is fine for now.

---

## Summary

**Minimum Required:**
- ✅ `CLERK_SECRET_KEY` - Add to Vercel (for webhooks/serverless functions)

**Optional (but recommended):**
- `CLERK_PUBLISHABLE_KEY` - Can stay hardcoded in `config.js` (it's public anyway)
- `SUPABASE_URL` - Can stay hardcoded
- `SUPABASE_ANON_KEY` - Can stay hardcoded

**After adding env vars:**
1. Redeploy your Vercel project (or push a new commit)
2. Environment variables take effect on next deployment

