# Phase 2: Enhanced Onboarding + Resume Upload

## 📋 Plan Overview

**Goal:** Improve data collection during onboarding and add resume upload as an alternative to LinkedIn import.

---

## A. Enhanced Onboarding Questions

### **Objectives:**
1. Collect richer profile data for better matching
2. Display all collected data on public agent profiles
3. Make onboarding questions map directly to database fields

### **New Questions to Add:**

#### **Step 1 Enhancement: Professional Background**
Current: Years, Location, Skills

Add:
- **Seniority Level**: Junior / Mid / Senior / Lead / Executive
- **Company Size Preference**: Startup (1-50) / SMB (51-500) / Mid-Market (501-5000) / Enterprise (5000+)
- **Industries**: Tech, Finance, Healthcare, E-commerce, SaaS, etc. (multi-select)
- **Current Company** (optional, for credibility)

#### **Step 1.5 NEW: Experience & Credentials**
- **Previous Roles**: Add 2-3 past job titles (e.g., "Senior PM at Stripe")
- **Years in Current Role**: Dropdown 0-10+
- **Education**: Degree + University (optional)
- **Certifications**: PMP, AWS, Google Ads, etc. (optional, autocomplete)

#### **Step 2 Enhancement: Social Proof**
Current: LinkedIn, Twitter, Instagram

Keep current + add validation that URLs are correct format

#### **Step 3 Enhancement: Work Type**
Current: Categories (generic)

Add:
- **Preferred Project Duration**: One-off / Short-term (< 1 month) / Ongoing (retainer)
- **Minimum Project Size**: Quick task ($100-500) / Small project ($500-2k) / Medium ($2k-10k) / Large ($10k+)

### **Database Changes:**

```sql
-- Enhance agent_profiles table
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS seniority_level TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS company_size_preference TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS industries TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS current_company TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS years_in_role INTEGER;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education JSONB;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS previous_roles JSONB;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS preferred_project_duration TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS minimum_project_size TEXT;
```

### **Public Profile Display:**

Update `handle.html` to show:
- **About Section**: 
  - Seniority level + years in role
  - Current company (if provided)
  - Industries worked in
  
- **Experience Section** (NEW):
  - Previous roles with titles
  - Education
  - Certifications
  
- **Work Preferences Section**:
  - Project types (duration, size)
  - Company sizes preferred

### **Files to Create/Modify:**

**Create:**
- `supabase/migrations/006_enhanced_onboarding_fields.sql`

**Modify:**
- `onboarding.html` - Add new steps/questions
- `lib/onboarding-integration.js` - Save new fields
- `handle.html` - Display new fields on public profile
- `lib/handle-integration.js` - Load and render new fields
- `api/onboarding.js` - Accept new fields
- `api/agents/[handle].js` - Return new fields

### **Implementation Order:**
1. Database migration
2. Update onboarding UI with new questions
3. Update onboarding-integration.js to save new data
4. Update APIs to accept/return new fields
5. Update public profile to display new data
6. Test end-to-end flow

---

## B. Resume Upload + GPT-4o Parsing

### **Objectives:**
1. Allow users to upload PDF/DOCX resume as alternative to LinkedIn
2. Use GPT-4o to intelligently extract profile data
3. Pre-fill onboarding form with extracted data

### **User Flow:**

```
Step 0: Choose Import Method
├─ Option 1: Import from LinkedIn (existing)
├─ Option 2: Upload Resume (NEW)
└─ Option 3: Enter Manually (existing)

If Upload Resume:
  ↓
1. User uploads PDF/DOCX
  ↓
2. Frontend sends file to /api/resume/parse
  ↓
3. Backend extracts text from file
  ↓
4. Send to OpenAI GPT-4o with structured prompt
  ↓
5. GPT-4o returns JSON with:
   - name
   - email
   - phone
   - location
   - currentRole
   - currentCompany
   - yearsExperience
   - seniorityLevel
   - summary
   - skills []
   - previousRoles [{title, company, years}]
   - education [{degree, school, year}]
   - certifications []
   - industries []
  ↓
6. Store in localStorage
  ↓
7. Pre-fill onboarding form
  ↓
8. User reviews and edits
  ↓
9. Continue normal flow
```

### **Technical Implementation:**

#### **1. File Upload (Frontend)**

```javascript
// In onboarding.html Step 0
<input type="file" accept=".pdf,.doc,.docx" id="resumeInput">
<button onclick="uploadResume()">Upload Resume</button>

function uploadResume() {
  const file = document.getElementById('resumeInput').files[0];
  
  // Validate file
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    alert('File too large. Max 5MB');
    return;
  }
  
  // Convert to base64
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result.split(',')[1];
    
    // Send to API
    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        data: base64
      })
    });
    
    const parsed = await response.json();
    
    // Store and pre-fill
    localStorage.setItem('resume_data', JSON.stringify(parsed));
    prefillFromResume(parsed);
  };
  
  reader.readAsDataURL(file);
}
```

#### **2. Backend: Text Extraction**

```javascript
// api/resume/parse.js
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse/lib/pdf-parse.js'; // For PDFs
import mammoth from 'mammoth'; // For DOCX

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, data } = req.body;
    const buffer = Buffer.from(data, 'base64');
    
    let text = '';
    
    // Extract text based on file type
    if (filename.endsWith('.pdf')) {
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    } else if (filename.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (filename.endsWith('.doc')) {
      // .doc files are harder - may need external service
      return res.status(400).json({ error: 'DOC format not supported. Please convert to PDF or DOCX' });
    }
    
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from resume' });
    }
    
    // Send to GPT-4o for parsing
    const parsed = await parseResumeWithGPT(text);
    
    return res.status(200).json(parsed);
    
  } catch (error) {
    console.error('Resume parse error:', error);
    return res.status(500).json({ error: 'Failed to parse resume', message: error.message });
  }
}
```

#### **3. GPT-4o Parsing with Function Calling**

```javascript
async function parseResumeWithGPT(resumeText) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // Latest GPT-4o model
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract structured data from resumes and return it in JSON format. Be accurate and thorough.`
        },
        {
          role: 'user',
          content: `Parse this resume and extract all relevant information:\n\n${resumeText}`
        }
      ],
      response_format: { type: 'json_object' },
      functions: [
        {
          name: 'extract_resume_data',
          description: 'Extract structured profile data from a resume',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Full name' },
              email: { type: 'string', description: 'Email address' },
              phone: { type: 'string', description: 'Phone number' },
              location: { type: 'string', description: 'City, State or Country' },
              currentRole: { type: 'string', description: 'Current job title' },
              currentCompany: { type: 'string', description: 'Current employer' },
              yearsExperience: { type: 'number', description: 'Total years of professional experience' },
              seniorityLevel: { 
                type: 'string', 
                enum: ['Junior', 'Mid', 'Senior', 'Lead', 'Executive'],
                description: 'Career seniority level'
              },
              summary: { type: 'string', description: 'Professional summary or bio (2-3 sentences)' },
              skills: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of skills mentioned'
              },
              previousRoles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    company: { type: 'string' },
                    years: { type: 'string', description: 'e.g. "2020-2023" or "2 years"' }
                  }
                },
                description: 'Previous job positions'
              },
              education: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    degree: { type: 'string' },
                    school: { type: 'string' },
                    year: { type: 'string' }
                  }
                }
              },
              certifications: {
                type: 'array',
                items: { type: 'string' },
                description: 'Professional certifications'
              },
              industries: {
                type: 'array',
                items: { type: 'string' },
                description: 'Industries or sectors worked in'
              }
            },
            required: ['name', 'skills']
          }
        }
      ],
      function_call: { name: 'extract_resume_data' }
    })
  });
  
  const data = await response.json();
  const functionCall = data.choices[0].message.function_call;
  const parsed = JSON.parse(functionCall.arguments);
  
  return parsed;
}
```

### **Dependencies to Add:**

```bash
npm install pdf-parse mammoth
```

### **Database Storage:**

Store resume parsing result for future reference:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_data JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_filename TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_uploaded_at TIMESTAMPTZ;
```

### **Files to Create/Modify:**

**Create:**
- `api/resume/parse.js` - Resume parsing endpoint
- `lib/resume-upload.js` - Frontend upload logic
- `supabase/migrations/007_resume_storage.sql`

**Modify:**
- `onboarding.html` - Add resume upload UI
- `lib/onboarding-integration.js` - Handle resume data pre-fill
- `package.json` - Add pdf-parse, mammoth

### **Error Handling:**

- File too large (> 5MB) → Show error
- Unsupported format → Show error, suggest PDF
- Text extraction fails → Fall back to manual entry
- GPT parsing fails → Fall back to manual entry
- Missing required fields → Ask user to fill manually

### **Security Considerations:**

- Validate file size and type on backend
- Don't store raw resume files (privacy concern)
- Only store extracted structured data
- Sanitize all extracted text before storing
- Rate limit resume parsing to prevent abuse

---

## 📊 Implementation Timeline

### **Week 1: Enhanced Onboarding**
- Day 1-2: Database migration + API updates
- Day 3-4: Onboarding UI updates
- Day 5: Public profile display updates
- Day 6-7: Testing + bug fixes

### **Week 2: Resume Upload**
- Day 1-2: Backend parsing (text extraction + GPT-4o)
- Day 3-4: Frontend upload UI
- Day 5: Pre-fill logic + integration
- Day 6-7: Testing + error handling

**Total: 2 weeks for both features**

---

## 🧪 Testing Checklist

### **Enhanced Onboarding:**
- [ ] All new fields save to database
- [ ] All new fields display on public profile
- [ ] LinkedIn import still works
- [ ] Manual entry still works
- [ ] Fields are optional where appropriate
- [ ] Validation works correctly

### **Resume Upload:**
- [ ] PDF upload works
- [ ] DOCX upload works
- [ ] Text extraction succeeds
- [ ] GPT-4o parsing returns valid JSON
- [ ] Data pre-fills correctly
- [ ] User can edit pre-filled data
- [ ] Error handling works for all edge cases
- [ ] File size limits enforced

---

## 💰 Cost Estimates

### **GPT-4o API Costs:**
- GPT-4o: ~$0.01-0.03 per resume parse (depending on resume length)
- Expected: 100 resumes/month = $1-3/month
- Very affordable

### **Storage:**
- Resumes not stored (only parsed data)
- JSONB fields in Postgres = negligible cost

---

## 🎯 Success Metrics

### **Enhanced Onboarding:**
- Profile completeness score increases
- Better match quality (more data points)
- Users fill out 80%+ of new optional fields

### **Resume Upload:**
- 30-40% of users choose resume upload
- 90%+ parsing accuracy for common resume formats
- Average time to complete onboarding decreases

---

## ❓ Questions for You

1. **Enhanced Onboarding:**
   - Do you want all new fields to be optional or some required?
   - Should we add a "Profile Completeness" score (e.g., "75% complete")?
   - Any specific industries to include in the dropdown?

2. **Resume Upload:**
   - Max file size: 5MB okay?
   - Should we store the original resume or just parsed data?
   - What happens if GPT-4o fails? Manual entry or ask to re-upload?

3. **Priority:**
   - Which should we build first? (I recommend Enhanced Onboarding first, then Resume Upload)
   - Or build both in parallel?

---

## 🚀 Ready to Start?

Let me know if this plan looks good, and which priority you prefer! I can start building immediately.
