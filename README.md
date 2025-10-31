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
| `testimonial-performance-marketer.html` | Jordan Ellis case study |
| `testimonial-retired-teacher.html` | Linda Ramos case study |
| `testimonial-senior-product-manager.html` | Andre Wallace case study |
| plus `onboarding.html`, `inbox.html`, `recipes.html`, `share.html`, … | |

Everything shares `styles.css` and `script.js`, so new pages inherit the existing animations, persona data, and components.

## Deploying with Vercel

1. Push this directory to GitHub (e.g., [`msanchezgrice/opento`](https://github.com/msanchezgrice/opento)).
2. In Vercel, **Import Project → GitHub → opento**.
3. Framework preset: **Other** (static site). Root directory: `/`.
4. Build command: _leave empty_. Output directory: `/` (Vercel will serve the root).
5. Deploy. Vercel uses `vercel.json` so `/` rewrites to `index.html`, and all other HTML files are available at their respective paths (e.g., `/landing-autopilot`, `/testimonial-retired-teacher` thanks to `cleanUrls`).

After the first deploy, every new push to `main` will trigger a fresh preview + production deployment automatically. You can create additional rewrites/redirects in `vercel.json` as needed.
