# Deployment Instructions

## Setting Up OpenAI API Key in Vercel

After pushing your code, you need to configure the OpenAI API key in Vercel:

### Step 1: Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project: **opento**
3. Click on **Settings** tab

### Step 2: Add Environment Variable

1. In Settings, click **Environment Variables** in the left sidebar
2. Add a new environment variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (get it from https://platform.openai.com/api-keys)
   - **Environments:** Select all (Production, Preview, Development)
3. Click **Save**

> **Note:** The project owner should have the API key. Contact them if you need access.

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy**
4. Or simply push a new commit to trigger automatic deployment

### Verify Chat is Working

1. Visit your deployed site: https://opento-psi.vercel.app/handle?u=growthmaya
2. Click **Chat with Rep** button
3. Type a message like "What are the rates?"
4. You should receive an AI-powered response

### Troubleshooting

If chat doesn't work:
- Check browser console for errors (F12 → Console)
- Verify environment variable is set correctly in Vercel Settings
- Check Vercel function logs: Deployments → Click deployment → View Function Logs
- Ensure OpenAI API key has credits: https://platform.openai.com/usage

## Alternative: Using Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Add environment variable
vercel env add OPENAI_API_KEY
# When prompted, paste your OpenAI API key
# Select: Production, Preview, Development

# Deploy
vercel --prod
```

## Security Notes

⚠️ **Important:** API Key Security

1. **Never commit API keys to git** - They should only exist in environment variables
2. Store keys in Vercel's encrypted environment variables
3. Keys are never exposed to the browser (handled server-side only)
4. If a key is accidentally exposed, rotate it immediately at https://platform.openai.com/api-keys
5. Monitor API usage regularly at https://platform.openai.com/usage
