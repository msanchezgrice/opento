# Profile & Agent Page Coherence Plan

## Problem Statement
The onboarding data collection and public agent page display aren't well-mapped. Users need confidence that:
1. The system understands their background
2. Their agent accurately represents them
3. They'll get quality matches

---

## Current State Analysis

### Data We Collect (Onboarding):
✅ Years of experience, Location, Skills
✅ Seniority level, Current company, Years in role, Industries
✅ LinkedIn, Twitter, Instagram
✅ Weekly hours target
✅ What they're open to (categories)
✅ Rates (consult floor, async floor)
✅ Availability window, Rules

### What We Display (Agent Page):
❌ Role - AUTO-GENERATED from first skill (not accurate)
❌ Summary - AUTO-GENERATED generic text (not personal)
❌ Focus Areas - AUTO-GENERATED from categories (may be wrong)
❌ What They're Open To - AUTO-GENERATED lists (generic)
❌ Recent Wins - Empty placeholder
❌ Skills - NOT DISPLAYED AT ALL
❌ Social Proof - Minimal (just "X years experience")
⚠️ Experience section - Shows seniority/company but feels disconnected

### Key Gaps:
1. **No personal voice** - Everything is auto-generated
2. **Skills hidden** - Collected but not shown
3. **Resume data underutilized** - Parsed but not displayed
4. **Weak credibility signals** - Missing education, certs, achievements
5. **Generic positioning** - Doesn't tell their unique story
6. **Disconnect between input and output** - User fills out form, sees different text

---

## Proposed Solution: 3-Phase Improvement

### PHASE 1: Let Users Define Their Story (High Priority)
**Goal:** Replace auto-generated content with user-authored content

#### 1A. Add Professional Title Field
**Where:** Step 1 of onboarding
**Field:** "Professional title" (free text)
**Example:** "Performance Marketing Lead" or "Senior Product Designer"
**Impact:** Shows on agent page header instead of auto-generated role

#### 1B. Add Professional Summary/Bio
**Where:** New step between Step 1 and Step 2 (Step 1.5)
**Field:** "Tell people about yourself" (textarea, 2-3 sentences)
**Guidance:** "What makes you unique? What problems do you solve?"
**Example:** "I help B2B SaaS companies build data-driven growth engines. Specialized in PLG motions and reducing CAC through experimentation."
**Impact:** Shows on agent page as authentic bio, not generic text

#### 1C. Add "I'm Best At" Section
**Where:** Step 1.5 (same as bio)
**Field:** 3-5 bullet points of specific strengths
**Example:** 
- "Building acquisition funnels that convert at 20%+"
- "Reducing CAC through creative testing"
- "Attribution modeling across Meta/Google/TikTok"
**Impact:** Replaces auto-generated "Focus Areas"

#### 1D. Add Experience Highlights
**Where:** Step 1.5 or pull from resume
**Field:** "Biggest wins or notable projects" (3 bullet points)
**Example:**
- "Cut blended CAC by 22% for Looply in two weeks"
- "Grew trial-to-paid by 18% via lifecycle rebuild"
- "Managed $3.2M/yr in ad spend across 3 channels"
**Impact:** Replaces empty "Recent Wins" section

---

### PHASE 2: Display All Collected Data (Medium Priority)
**Goal:** Show everything the user provided to build credibility

#### 2A. Add Skills Section to Agent Page
**Display:** Prominent chips/badges below bio
**Show:** Top 8-10 skills from onboarding
**Why:** Skills are credibility signals and help with matching

#### 2B. Enhance Experience Section
**Current:** Just shows seniority chip + company
**Add:**
- Years of experience (prominently)
- Industries (already showing)
- "X years in [specific role]"
**Format:** 
```
🏆 Senior · 8+ years experience
Currently at Google · 3 years as Growth Lead
Industries: SaaS, Fintech, B2B
```

#### 2C. Add Credentials Section (if data exists)
**Show:**
- Education (if provided or from resume)
- Certifications (if provided)
- Notable companies worked at
**Format:**
```
📚 Background
• MBA, Stanford
• Meta Blueprint Certified
• Previously: Stripe, Airbnb, Uber
```

#### 2D. Better Social Proof
**Current:** Generic ("6+ years experience")
**Improved:** Use all data
- "8+ years in performance marketing"
- "Senior-level professional"
- "Previously at Google and Stripe"
- "Meta Blueprint certified"
- "Specialized in SaaS and Fintech"
- "Managed $3M+ in ad spend"

#### 2E. Display "What I'm Open To"
**Current:** Auto-generated generic list
**Improved:** Show actual selections from Step 4
- Map to user's category selections
- Use their actual words if they wrote custom options
- Show with icons/visual hierarchy

---

### PHASE 3: Profile Completeness & Encouragement (Lower Priority)
**Goal:** Guide users to build stronger profiles

#### 3A. Profile Completeness Score
**Where:** Dashboard header
**Calculate:** Based on:
- Basic info filled (25 points)
- Bio written (15 points)
- Skills added (10 points)
- Experience highlights added (15 points)
- Social links added (10 points)
- Photo uploaded (10 points)
- Enhanced fields filled (15 points)

**Display:**
```
Profile Strength: 75% ⭐⭐⭐⭐☆
"Add 3 experience highlights to reach 90%"
```

#### 3B. Profile Preview Before Finish
**Where:** Step 6 (final step)
**Show:** Live preview of exactly how their agent page will look
**Include:** All their entered data rendered as it will appear
**CTA:** "This is how brands will see you. Look good?"

#### 3C. Post-Onboarding Profile Editor
**Where:** Dashboard → Profile tab
**Allow editing:**
- Professional title
- Bio/summary
- Experience highlights
- Skills
- Credentials
**Make it easy to refine after initial setup**

---

## Implementation Priority

### MUST HAVE (Do First):
1. ✅ Professional Title field (Step 1)
2. ✅ Bio/Summary textarea (New Step 1.5)
3. ✅ Display skills on agent page
4. ✅ Experience Highlights (3 bullets)
5. ✅ Better map Step 4 selections to "What I'm Open To"

### SHOULD HAVE (Do Next):
6. Profile completeness score
7. Credentials section (education, certs)
8. Enhanced social proof generation
9. "I'm Best At" section (custom focus areas)

### NICE TO HAVE (Future):
10. Live preview before finish
11. Profile editor in dashboard
12. AI suggestions for bio/highlights
13. LinkedIn import for experience highlights

---

## Database Changes Required

```sql
-- Add to agent_profiles table
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT; -- User-written summary
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[]; -- "I'm best at" bullets
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[]; -- Recent wins
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT; -- "MBA, Stanford"
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS certifications_display TEXT[]; -- Display format
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[]; -- Previous employers

-- Update profile completeness calculation to include new fields
```

---

## Updated Agent Page Structure

```
┌─────────────────────────────────────────┐
│ [Photo] Maya Chen                       │
│ Performance Marketing Lead              │ ← User-defined title
│ @growthmaya · Austin, TX                │
│                                         │
│ "I help B2B SaaS companies build..."   │ ← User-written bio
│                                         │
│ [Request Intro] [Chat with Rep]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🎯 Experience                           │
│ Senior · 8+ years in marketing         │
│ Currently at Google · 3 years           │
│ Industries: SaaS, Fintech, B2B         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💡 Skills                               │
│ [Performance Marketing] [Paid Social]   │
│ [Google Ads] [Meta Ads] [Analytics]    │
│ [A/B Testing] [Funnel Optimization]    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚡ What I'm Best At                     │
│ • Building acquisition funnels 20%+    │ ← User-written
│ • Reducing CAC through testing         │
│ • Attribution across channels          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏆 Recent Wins                          │
│ • Cut blended CAC by 22% for Looply    │ ← User-written
│ • Grew trial-to-paid by 18%            │
│ • Managed $3.2M/yr in ad spend         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📚 Background                           │
│ • MBA, Stanford                         │
│ • Meta Blueprint Certified             │
│ • Previously: Stripe, Airbnb           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💼 What I'm Open To                     │
│ ✓ Growth audits & strategy calls       │ ← From Step 4
│ ✓ Creative QA & testing                │
│ ✓ Attribution & analytics setup        │
│                                         │
│ 📅 Mon-Thu, 11a-4p CT                  │
│ 💵 $75/30min · $12/5min                │
└─────────────────────────────────────────┘
```

---

## Key Improvements This Achieves

### For User Setting Up Agent:
✅ **Personal voice** - They write their bio, not auto-generated
✅ **Accurate representation** - They define their title and strengths
✅ **See their data used** - Everything they enter shows on the page
✅ **Confidence building** - Preview shows professional, complete profile
✅ **Clear value prop** - "This is how brands will see you"

### For Brands Viewing Agent:
✅ **Authentic** - Real person's voice, not templated
✅ **Credible** - Skills, experience, wins, credentials all visible
✅ **Clear fit** - Can quickly assess if right match
✅ **Trustworthy** - Complete profile signals serious professional
✅ **Actionable** - Clear what they do, rates, availability

---

## Success Metrics

1. **Profile Completion Rate**
   - Target: 80% of users fill out bio
   - Target: 70% add experience highlights

2. **Agent Page Quality**
   - Target: 90% completeness score average
   - Target: All sections populated (no empty placeholders)

3. **User Confidence**
   - Survey: "Does your agent page accurately represent you?"
   - Target: 85% say "Yes" or "Mostly yes"

4. **Match Quality**
   - Better matches due to richer profiles
   - Fewer mismatches due to clear positioning

---

## Next Steps

If you approve this plan, I will:

1. ✅ Create database migration (008_profile_coherence.sql)
2. ✅ Add Step 1.5 to onboarding (title, bio, highlights)
3. ✅ Update onboarding API to save new fields
4. ✅ Redesign agent page to show all data coherently
5. ✅ Add skills display to public profile
6. ✅ Improve social proof generation
7. ✅ Update profile completeness calculation
8. ✅ Test end-to-end flow

Estimated time: 2-3 hours
Commits: ~5-6 commits
Impact: Major UX improvement, much stronger profiles

Ready to proceed?
