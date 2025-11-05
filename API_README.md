# Opento API Documentation

## Overview

The Opento API powers user creation, onboarding, agent profile management, and chat functionality. All endpoints are implemented as Vercel serverless functions.

## API Endpoints

### User Management

#### POST /api/users
Create a new user account.

**Request Body:**
```json
{
  "displayName": "Jane Doe",
  "email": "jane@example.com",
  "location": "Austin, TX",
  "role": "Performance Marketer",
  "summary": "Growth marketing specialist"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "handle": "jane-doe-a4b2",
    "display_name": "Jane Doe",
    "email": "jane@example.com",
    "avatar_initials": "JD",
    "location": "Austin, TX",
    "role": "Performance Marketer",
    "created_at": "2025-01-01T00:00:00Z"
  },
  "message": "User created successfully"
}
```

---

### Onboarding

#### POST /api/onboarding
Save user onboarding data (settings, skills, profile).

**Request Body:**
```json
{
  "userId": "uuid",
  "settings": {
    "consultFloor": 75,
    "asyncFloor": 12,
    "weeklyHours": 6,
    "availabilityWindow": "Mon–Thu 11a–4p CT",
    "anonymousFirst": true,
    "consentReminders": true,
    "autoAcceptFast": false,
    "categories": ["Growth audits", "Campaign optimization"]
  },
  "skills": ["performance marketing", "paid social", "seo"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/jane",
    "twitter": "https://x.com/jane",
    "instagram": null
  },
  "profileData": {
    "yearsExperience": "6",
    "location": "Austin, TX",
    "hasLinkedIn": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "handle": "jane-doe-a4b2",
  "message": "Onboarding data saved successfully"
}
```

---

### Agent Profiles

#### GET /api/agents/:handle
Get agent profile data by handle.

**URL Parameters:**
- `handle` - Agent's unique handle (e.g., "jane-doe-a4b2")

**Response:**
```json
{
  "id": "uuid",
  "handle": "jane-doe-a4b2",
  "displayName": "Jane Doe",
  "avatar": "JD",
  "role": "Performance Marketer",
  "summary": "Growth marketing specialist",
  "location": "Austin, TX",
  "skills": [
    {
      "name": "performance marketing",
      "category": "marketing",
      "tier": "high",
      "years": 6
    }
  ],
  "settings": {
    "consult_floor_30m": 75,
    "async_floor_5m": 12,
    "weekly_hours": 6,
    "availability_window": "Mon–Thu 11a–4p CT",
    "categories": ["Growth audits"]
  },
  "profile": {
    "open_to": ["Growth audits and consulting"],
    "focus_areas": ["Digital marketing and growth strategy"],
    "recent_wins": [],
    "social_proof": ["6+ years of experience", "Based in Austin, TX"],
    "lifetime_earned": 0,
    "total_gigs_completed": 0
  },
  "availability": "Mon–Thu 11a–4p CT",
  "rulesSummary": "Anonymous first • $75/30m floor",
  "onboarding": {
    "floor": 75,
    "microFloor": 12,
    "hours": 6,
    "window": "Mon–Thu 11a–4p CT"
  },
  "requestIntro": {
    "pitch": "Jane is open to growth audits and consulting work",
    "guidelines": [...],
    "template": "...",
    "note": "Rep replies within 1 business day"
  }
}
```

---

### Communication

#### POST /api/chat
Chat with an agent's rep (powered by OpenAI).

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What are the rates?" }
  ],
  "agentData": {
    "displayName": "Jane Doe",
    "handle": "jane-doe-a4b2",
    "role": "Performance Marketer",
    ...
  }
}
```

**Response:**
```json
{
  "reply": "Jane's rates are $75 per 30 minutes for consulting..."
}
```

---

#### POST /api/intro-request
Submit an intro request to an agent.

**Request Body:**
```json
{
  "fromName": "John Smith",
  "fromEmail": "john@company.com",
  "fromCompany": "Acme Inc",
  "toHandle": "jane-doe-a4b2",
  "brief": "Looking for help with performance marketing..."
}
```

**Response:**
```json
{
  "success": true,
  "introRequest": {
    "id": 123,
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z"
  },
  "message": "Intro request sent to Jane Doe. They'll respond within 1 business day."
}
```

---

## Environment Variables

Required environment variables (see `.env.example`):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous (public) key
- `SUPABASE_SERVICE_KEY` - Supabase service role key (for admin operations)
- `OPENAI_API_KEY` - OpenAI API key for chat feature

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

On Vercel:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`

### 3. Run Migrations

Apply database migrations:

```bash
# Run in Supabase SQL Editor or via CLI
psql < supabase/migrations/001_initial_schema.sql
psql < supabase/migrations/002_seed_skills.sql
```

### 4. Deploy

```bash
git push origin main
# Vercel will auto-deploy
```

## Database Schema

### Key Tables

- **users** - User accounts with basic profile info
- **agent_settings** - Agent preferences (rates, hours, categories)
- **user_skills** - Skills linked to users
- **agent_profiles** - Denormalized profile data (open_to, focus_areas, stats)
- **intro_requests** - Intro requests sent to agents
- **skills** - Catalog of available skills

See `supabase/migrations/001_initial_schema.sql` for full schema.

## Authentication

Currently using a local UUID system without full authentication. LinkedIn OAuth integration coming soon.

For now, user IDs are stored in localStorage:
- `opento_user_id` - User UUID
- `opento_user_handle` - User handle
- `opento_user_name` - Display name

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Resource created
- `400` - Bad request (missing required fields)
- `404` - Resource not found
- `405` - Method not allowed
- `500` - Internal server error

Error response format:
```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "details": { ... }
}
```

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production.

## CORS

All endpoints support CORS with `Access-Control-Allow-Origin: *` for development. Consider restricting in production.
