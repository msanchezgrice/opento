# API Setup Guide

## OpenAI Chat Integration

The chat feature uses OpenAI's GPT-4 API to provide intelligent conversational responses about the agent's availability, expertise, and services.

### Setup Instructions

#### 1. Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-proj-...`)

#### 2. Configure Environment Variable

##### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Environment:** Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy your project for changes to take effect

##### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. Install Vercel CLI if needed:
   ```bash
   npm install -g vercel
   ```

4. Run locally:
   ```bash
   vercel dev
   ```

### API Endpoint

The serverless function is located at `/api/chat.js` and handles:

- Secure API key management (never exposed to client)
- Conversation context (maintains last 10 messages)
- Dynamic system prompts based on agent data
- Error handling and fallback responses
- CORS configuration for browser requests

### System Prompt

The AI is instructed to act as the agent's "Rep" (representative) with:
- Full knowledge of the agent's profile, rates, availability
- Access to what they're open to, focus areas, recent wins
- Guidelines for intro requests
- Professional, warm, and concise communication style
- Ability to transition users to formal intro request form

### Usage

The chat automatically calls the API when users send messages. No additional configuration needed once the environment variable is set.

### Cost Considerations

- Model: GPT-4 Optimized (`gpt-4o`)
- Approximate cost: $0.005 per message pair (input + output)
- Max tokens per response: 500 (keeps responses concise)
- Temperature: 0.7 (balanced creativity and consistency)

Monitor usage at: https://platform.openai.com/usage

### Troubleshooting

**Chat shows "having trouble connecting":**
- Check that `OPENAI_API_KEY` environment variable is set in Vercel
- Verify API key is valid and has credits
- Check Vercel function logs for errors

**API key exposed warning:**
- Ensure `.env` is in `.gitignore`
- Never commit API keys to git
- Rotate key immediately if exposed: https://platform.openai.com/api-keys

### Security Notes

- API key is stored server-side only (in environment variables)
- Never exposed to client/browser
- Requests are proxied through Vercel serverless function
- CORS configured to allow requests from your domain
