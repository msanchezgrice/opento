# Opento Prototype (v4.1)

This directory contains the static prototype you’ve been iterating on (landing variants, onboarding flow, inbox, testimonials, etc.). It’s ready to be deployed as a static site via Vercel.

## Local development

```bash
# from repo root
python3 -m http.server 8080
# visit http://localhost:8080/index.html
```

## Pages

| Path | Notes |
| --- | --- |
| `index.html` | Main landing (variant 1) |
| `landing-autopilot.html` | Landing variant: background growth rep |
| `landing-compound.html` | Landing variant: compounding agent |
| `landing-radar.html` | Landing variant: opportunity radar |
| **`sign-up.html`** | **NEW: Clerk sign up page** |
| **`sign-in.html`** | **NEW: Clerk sign in page** |
| **`browse.html`** | **NEW: Browse all agents (search/filter)** |
| `onboarding.html` | **Now saves to Supabase!** |
| `handle.html` | **Now loads from Supabase!** |
| `inbox.html` | **Now shows real matched offers!** |
| `testimonial-*.html` | Case studies |
| plus `recipes.html`, `share.html`, `email.html`, … | |

Everything shares `styles.css` and `script.js`, plus new backend integrations in `lib/` folder.

## Deploying with Vercel

1. Push this directory to GitHub (e.g., [`msanchezgrice/opento`](https://github.com/msanchezgrice/opento)).
2. In Vercel, **Import Project → GitHub → opento**.
3. Framework preset: **Other** (static site). Root directory: `/`.
4. Build command: _leave empty_. Output directory: `/` (Vercel will serve the root).
5. Deploy. Vercel uses `vercel.json` so `/` rewrites to `index.html`, and all other HTML files are available at their respective paths (e.g., `/landing-autopilot`, `/testimonial-retired-teacher` thanks to `cleanUrls`).

After the first deploy, every new push to `main` will trigger a fresh preview + production deployment automatically. You can create additional rewrites/redirects in `vercel.json` as needed.
