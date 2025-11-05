# Opento - Next Steps & Recommendations

## 🎯 Current Status
✅ **All Core Features Working:**
- User creation and onboarding
- Agent profile management
- Dashboard with full CRUD
- AI-powered chat
- Intro request system
- Session management

---

## 📋 Your Priorities (Reviewed & Enhanced)

### **1. LinkedIn OAuth + Resume Upload** ⭐ **HIGHEST PRIORITY**

#### **Implementation Plan:**

**Phase 1A: LinkedIn OAuth Setup**
- ✅ LinkedIn App already set up (you mentioned this)
- Create `/api/auth/linkedin` endpoint for OAuth callback
- Store LinkedIn tokens securely in database
- Create `linked_accounts` table to track connected accounts

**Phase 1B: Profile Import Flow**
```
User starts onboarding
  ↓
Option 1: "Import from LinkedIn" (recommended)
  → OAuth flow
  → Fetch profile data
  → Pre-populate form fields
  → User reviews and edits
  → Continue onboarding

Option 2: "Upload Resume"
  → Upload PDF/DOCX
  → Extract text (use API like Textract or pdf-parse)
  → Parse with GPT-4 to extract: name, role, summary, skills, experience
  → Pre-populate form fields
  → User reviews and edits
  → Continue onboarding

Option 3: "Enter Manually"
  → Current flow (unchanged)
```

**Database Changes:**
```sql
-- New table for linked accounts
CREATE TABLE linked_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'linkedin', 'github', etc.
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  profile_data JSONB, -- Store raw LinkedIn profile
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- New column for profile photo
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN resume_url TEXT; -- If storing resume file
```

**Files to Create:**
- `api/auth/linkedin.js` - OAuth callback handler
- `api/auth/linkedin-profile.js` - Fetch LinkedIn profile data
- `api/resume/parse.js` - Resume parsing endpoint
- `lib/linkedin-import.js` - Frontend LinkedIn import flow
- `lib/resume-upload.js` - Frontend resume upload flow

**Files to Modify:**
- `onboarding.html` - Add import options before step 1
- `lib/onboarding-integration.js` - Handle pre-populated data

**Effort:** Medium (2-3 days)  
**Impact:** High (Much better UX, higher completion rate)

---

### **2. Enhanced Onboarding Questions** ⭐ **HIGH PRIORITY**

#### **Current vs. Improved Mapping:**

**Current Onboarding Steps:**
1. Tell us about what you do (6 inputs)
2. Set your rules (rates, hours, privacy)
3. What you want to work on (categories)
4. Your skills
5. What are you open to?
6. Display name

**Improved Onboarding Steps:**

**Step 0: Import Profile (NEW)**
- LinkedIn OAuth or Resume Upload
- Manual entry as fallback

**Step 1: Professional Background (ENHANCED)**
```javascript
// Map directly to agent_profiles
{
  displayName: '', // → users.display_name
  role: '', // → users.role
  company: '', // → NEW: agent_profiles.current_company
  yearsExperience: 0, // → NEW: agent_profiles.years_experience
  location: '', // → users.location
  summary: '', // → users.summary
  linkedinUrl: '', // → NEW: agent_profiles.linkedin_url
  portfolioUrl: '' // → NEW: agent_profiles.portfolio_url
}
```

**Step 2: Your Skills (IMPROVED UI)**
- Autocomplete dropdown (not side-by-side)
- Show popular skills by category
- Visual chips with remove buttons
- Auto-suggest based on role

**Step 3: Experience Level (NEW)**
```javascript
{
  seniorityLevel: '', // Junior, Mid, Senior, Lead, Executive
  previousRoles: [], // Array of past roles
  companySizes: [], // Startup, SMB, Enterprise
  industries: [], // Tech, Finance, Healthcare, etc.
  certifications: [] // Optional certifications
}
// → Save to agent_profiles.experience_data (JSONB)
```

**Step 4: What You're Open To (IMPROVED)**
- Smart suggestions based on skills + experience
- Use mapping table (not dynamic)
- Multi-select with search

**Step 5: Your Rates & Availability**
- Current rates questions (unchanged)
- Add: Preferred project size (Quick task, Small project, Ongoing retainer)
- Add: Response time SLA (Same day, 1-2 days, Weekly)

**Step 6: Privacy & Preferences**
- Current privacy settings (unchanged)
- Add: Profile visibility (Public, Logged-in only, Private)
- Add: Notification preferences

**Database Changes:**
```sql
-- Enhance agent_profiles table
ALTER TABLE agent_profiles ADD COLUMN current_company TEXT;
ALTER TABLE agent_profiles ADD COLUMN years_experience INTEGER;
ALTER TABLE agent_profiles ADD COLUMN linkedin_url TEXT;
ALTER TABLE agent_profiles ADD COLUMN portfolio_url TEXT;
ALTER TABLE agent_profiles ADD COLUMN experience_data JSONB;
ALTER TABLE agent_profiles ADD COLUMN seniority_level TEXT;

-- Add visibility settings
ALTER TABLE agent_settings ADD COLUMN profile_visibility TEXT DEFAULT 'public';
ALTER TABLE agent_settings ADD COLUMN response_time_sla TEXT DEFAULT '1-2 days';
ALTER TABLE agent_settings ADD COLUMN preferred_project_size TEXT[];
```

**Effort:** Medium (3-4 days)  
**Impact:** High (Better data quality, more complete profiles)

---

### **3. Skills Selector UI Improvements** ⭐ **HIGH PRIORITY**

#### **Current Issue:**
Skills appear to the right of the input field (confusing UX)

#### **Improved Design:**

**Option A: Single Autocomplete Input (Recommended)**
```html
<div class="skills-selector">
  <label>Your Skills</label>
  <div class="skill-input-wrapper">
    <input 
      type="text" 
      placeholder="Type to search skills (e.g., 'paid social')" 
      autocomplete="off"
      list="skills-datalist"
    />
    <!-- Dropdown appears BELOW input -->
    <div class="skills-dropdown" style="display: none;">
      <div class="skill-category">
        <div class="category-name">Marketing</div>
        <div class="skill-option">Paid Social</div>
        <div class="skill-option">SEO</div>
        <div class="skill-option">Content Marketing</div>
      </div>
      <!-- More categories... -->
    </div>
  </div>
  
  <!-- Selected skills shown BELOW as chips -->
  <div class="skills-selected">
    <div class="skill-chip">
      Paid Social (5 years)
      <button class="remove-skill">×</button>
    </div>
    <div class="skill-chip">
      SEO (3 years)
      <button class="remove-skill">×</button>
    </div>
  </div>
</div>
```

**Features:**
- Type to filter/search
- Categorized dropdown
- Click to add skill
- Shows years of experience picker on add
- Visual chips with remove buttons
- Popular skills shown by default

**Files to Modify:**
- `onboarding.html` - Update skills step UI
- `lib/onboarding-integration.js` - Update skills handling
- `styles.css` - Add skills selector styles

**Effort:** Low (1 day)  
**Impact:** High (Much cleaner UX)

---

### **4. Smart "Open To" Suggestions** ⭐ **MEDIUM PRIORITY**

#### **Current Issue:**
Generic suggestions, not personalized to user's skills

#### **Solution: Skills → Opportunities Mapping Table**

**Create Mapping Table:**
```sql
CREATE TABLE skill_opportunity_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  relevance_score INTEGER DEFAULT 100, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_name, opportunity_type)
);

-- Seed with mappings
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
-- Marketing skills
('paid social', 'Campaign optimization', 100),
('paid social', 'Ad account audits', 95),
('paid social', 'Creative testing', 90),
('paid social', 'Facebook Ads consulting', 100),
('seo', 'SEO audits', 100),
('seo', 'Content strategy', 85),
('seo', 'Technical SEO consulting', 95),
('growth marketing', 'Growth audits', 100),
('growth marketing', 'Funnel optimization', 95),
('growth marketing', 'Retention strategy', 85),

-- Engineering skills
('react', 'Component development', 100),
('react', 'Frontend consulting', 95),
('react', 'Code reviews', 80),
('python', 'Backend development', 100),
('python', 'Data pipeline setup', 95),
('python', 'API development', 90),

-- Design skills
('ui design', 'Design system creation', 100),
('ui design', 'Landing page design', 95),
('ui design', 'Figma consulting', 85),
('ux research', 'User testing', 100),
('ux research', 'Research planning', 95),

-- Product skills
('product management', 'Product roadmap consulting', 100),
('product management', 'Feature prioritization', 95),
('product management', 'User research', 85),

-- Data skills
('data analysis', 'Dashboard creation', 100),
('data analysis', 'Metric definition', 90),
('sql', 'Database optimization', 100),
('sql', 'Query consulting', 90);

-- Add 200+ more mappings covering all skills...
```

**API Endpoint:**
```javascript
// GET /api/opportunities/suggest?skills=paid-social,seo,growth-marketing

export default async function handler(req, res) {
  const { skills } = req.query;
  const skillArray = skills.split(',');
  
  // Query mappings for these skills
  const { data } = await supabase
    .from('skill_opportunity_mappings')
    .select('opportunity_type, relevance_score')
    .in('skill_name', skillArray)
    .order('relevance_score', { ascending: false });
  
  // Group and rank opportunities
  const opportunities = {};
  data.forEach(row => {
    if (!opportunities[row.opportunity_type]) {
      opportunities[row.opportunity_type] = 0;
    }
    opportunities[row.opportunity_type] += row.relevance_score;
  });
  
  // Return top 15 sorted by total score
  const sorted = Object.entries(opportunities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([type]) => type);
  
  return res.json({ opportunities: sorted });
}
```

**Frontend Integration:**
```javascript
// In onboarding step 4
async function loadOpenToSuggestions() {
  const skills = getSelectedSkills(); // From previous step
  const response = await fetch(`/api/opportunities/suggest?skills=${skills.join(',')}`);
  const { opportunities } = await response.json();
  
  // Show as suggestions in step 4
  renderOpportunitySuggestions(opportunities);
}
```

**Effort:** Medium (2 days to build + seed mappings)  
**Impact:** High (Personalized suggestions, better matches)

---

## 🎨 Additional Recommendations

### **5. Photo Upload & Management**
**Why:** Avatar initials are fine, but photos are more professional

**Solution:**
- Use Cloudinary or similar for image hosting
- Add upload UI in dashboard
- Crop/resize to square format
- Support drag & drop

**Effort:** Low (1-2 days)  
**Impact:** Medium (Better profiles)

---

### **6. Portfolio/Work Samples**
**Why:** Showcase previous work to build trust

**Solution:**
```sql
CREATE TABLE work_samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI:** Add "Portfolio" tab in dashboard

**Effort:** Medium (2-3 days)  
**Impact:** High (Builds credibility)

---

### **7. Calendar Integration**
**Why:** Show real availability, not just text window

**Solution:**
- Integrate with Google Calendar or Cal.com
- Show available time slots on agent page
- Book consultations directly

**Effort:** High (4-5 days)  
**Impact:** High (Removes friction)

---

### **8. Payment & Escrow**
**Why:** Currently no way to actually pay agents

**Solution:**
- Integrate Stripe Connect for payouts
- Build escrow system
- Handle intro acceptance → payment → work → release

**Effort:** High (1-2 weeks)  
**Impact:** Critical (Required for MVP)

---

## 🗺️ Recommended Roadmap

### **Phase 1: Onboarding Excellence (Week 1-2)**
1. LinkedIn OAuth + Resume Upload
2. Enhanced onboarding questions
3. Skills selector UI improvements
4. Smart "Open To" suggestions

**Goal:** Get high-quality, complete agent profiles from day 1

---

### **Phase 2: Profile Quality (Week 3-4)**
1. Photo upload
2. Portfolio/work samples
3. Profile completeness score
4. Preview mode before publishing

**Goal:** Professional, trustworthy agent pages

---

### **Phase 3: Discovery & Matching (Week 5-6)**
1. Browse page with filters
2. Search functionality
3. Skill-based recommendations
4. Featured agents

**Goal:** Help brands find the right agents

---

### **Phase 4: Transactions (Week 7-10)**
1. Calendar integration
2. Payment processing (Stripe Connect)
3. Escrow system
4. Offer acceptance flow
5. Project management basics

**Goal:** Complete end-to-end transactions

---

### **Phase 5: Growth & Optimization (Week 11+)**
1. Analytics dashboard
2. Email notifications
3. Reviews/ratings
4. Referral program
5. Mobile optimization

**Goal:** Scale and optimize

---

## 💡 Quick Wins (Do These First)

1. **Skills Selector UI** - 1 day, huge UX improvement
2. **Photo Upload** - 2 days, makes profiles look professional
3. **LinkedIn OAuth** - 3 days, much better onboarding experience

These 3 changes (1 week of work) will dramatically improve the user experience.

---

## 📊 Metrics to Track

**Onboarding:**
- Completion rate by step
- Drop-off points
- Time to complete
- Import method used (LinkedIn vs Resume vs Manual)

**Profile Quality:**
- % with photos
- % with portfolio samples
- Average skills per agent
- Profile completeness score

**Engagement:**
- Agent page views
- Chat conversations
- Intro requests sent
- Acceptance rate

**Revenue:**
- Intros accepted
- Projects completed
- Average project value
- Platform take rate

---

## 🛠️ Tech Stack Additions Needed

**For LinkedIn OAuth:**
- `passport-linkedin-oauth2` or use direct API

**For Resume Parsing:**
- `pdf-parse` for PDF extraction
- `mammoth` for DOCX extraction
- OpenAI GPT-4 for intelligent parsing

**For Image Upload:**
- `cloudinary` or `uploadthing`
- `sharp` for image processing

**For Calendar:**
- Google Calendar API
- `cal.com` embedded widget
- `calendly` alternative

**For Payments:**
- `stripe` official SDK
- Stripe Connect for payouts

---

## ❓ Questions to Consider

1. **Should agents set hourly rates or project-based pricing?**
   - Currently: 30min + 5min rates
   - Alternative: Hourly rate + project quotes

2. **How do you want to handle agent verification?**
   - LinkedIn verification?
   - Resume verification?
   - Reference checks?

3. **What's your take rate model?**
   - % of transaction?
   - Monthly subscription?
   - Freemium?

4. **Should agents bid on projects or just accept/decline?**
   - Current: Accept/decline intros
   - Alternative: Agents can propose rates

5. **Do you want escrow or direct payments?**
   - Escrow = safer but more complex
   - Direct = simpler but riskier

---

**Let me know which priorities you'd like to tackle first, and I can start building!** 🚀
