// API endpoint to save onboarding data (agent settings, skills, profile)
// POST /api/onboarding

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      settings,
      skills,
      socialLinks,
      profileData = {}
    } = req.body;
    
    // Extract enhanced fields from profileData
    const seniorityLevel = profileData.seniorityLevel;
    const currentCompany = profileData.currentCompany;
    const yearsInRole = profileData.yearsInRole;
    const industries = profileData.industries || [];

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, handle')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Save agent settings
    if (settings) {
      const { error: settingsError } = await supabase
        .from('agent_settings')
        .upsert({
          user_id: userId,
          consult_floor_30m: settings.consultFloor || 75,
          async_floor_5m: settings.asyncFloor || 12,
          weekly_hours: settings.weeklyHours || 6,
          availability_window: settings.availabilityWindow || 'Mon–Thu 11a–4p CT',
          anonymous_first: settings.anonymousFirst !== false,
          consent_reminders: settings.consentReminders !== false,
          auto_accept_fast: settings.autoAcceptFast || false,
          categories: settings.categories || []
        });

      if (settingsError) {
        console.error('Error saving settings:', settingsError);
        return res.status(500).json({ error: 'Failed to save settings', details: settingsError });
      }
    }

    // 2. Match and save skills
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Get all skills from database
      const { data: allSkills, error: skillsError } = await supabase
        .from('skills')
        .select('id, name');

      if (skillsError) {
        console.error('Error fetching skills:', skillsError);
      } else {
        // Match user skills to database skills
        const skillMatches = [];
        skills.forEach(userSkill => {
          const skillName = userSkill.toLowerCase().trim();
          const match = allSkills.find(s =>
            s.name.toLowerCase() === skillName ||
            s.name.toLowerCase().includes(skillName) ||
            skillName.includes(s.name.toLowerCase())
          );

          if (match) {
            skillMatches.push({
              user_id: userId,
              skill_id: match.id,
              years_experience: userSkill.years || 0
            });
          }
        });

        // Insert matched skills
        if (skillMatches.length > 0) {
          const { error: userSkillsError } = await supabase
            .from('user_skills')
            .upsert(skillMatches, { onConflict: 'user_id,skill_id' });

          if (userSkillsError) {
            console.error('Error saving user skills:', userSkillsError);
          }
        }
      }
    }

    // 3. Update user profile with social links if provided
    if (socialLinks) {
      const updates = {};
      if (socialLinks.linkedin) {
        // Store in summary or create a separate table
        updates.summary = user.summary ? `${user.summary}\n\nLinkedIn: ${socialLinks.linkedin}` : `LinkedIn: ${socialLinks.linkedin}`;
      }
      // Could add twitter, instagram fields to schema later

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('users')
          .update(updates)
          .eq('id', userId);
      }
    }

    // 4. Generate and save agent profile
    const openTo = generateOpenTo(settings?.categories || []);
    const focusAreas = generateFocusAreas(skills || [], settings?.categories || []);
    const socialProof = generateSocialProof(profileData || {});

    const profilePayload = {
      user_id: userId,
      // Enhanced fields
      seniority_level: seniorityLevel || null,
      current_company: currentCompany || null,
      years_in_role: yearsInRole ? parseInt(yearsInRole) : null,
      industries: industries || [],
      // Profile story fields (user-authored)
      professional_title: profileData.professionalTitle || null,
      bio: profileData.bio || null,
      best_at: profileData.bestAt || [],
      experience_highlights: profileData.experienceHighlights || [],
      // Generated fields
      open_to: openTo || [],
      focus_areas: focusAreas || [],
      recent_wins: [],
      social_proof: socialProof || [],
      lifetime_earned: 0,
      last_payout: 0,
      total_gigs_completed: 0
    };
    
    console.log('Upserting agent_profiles with payload:', JSON.stringify(profilePayload, null, 2));
    
    const { data: profileResult, error: profileError } = await supabase
      .from('agent_profiles')
      .upsert(profilePayload)
      .select();

    if (profileError) {
      console.error('Error saving profile:', profileError);
      return res.status(500).json({ error: 'Failed to save profile', details: profileError });
    }

    return res.status(200).json({
      success: true,
      handle: user.handle,
      message: 'Onboarding data saved successfully'
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Helper functions
function generateOpenTo(categories) {
  const mapping = {
    'Growth audits': 'Growth audits and performance consulting (30-min deep dives)',
    'Campaign optimization': 'Campaign setup and optimization sprints',
    'Fractional retainers': 'Fractional growth or performance roles (8-12 hrs/week)',
    'Data labeling': 'Data labeling, QA tasks, and content tagging'
  };

  const openTo = categories
    .map(c => mapping[c] || c)
    .filter(Boolean);

  return openTo.length > 0 ? openTo : ['Open to various consulting and project work'];
}

function generateFocusAreas(skills, categories) {
  const areas = [];

  // Infer from skills
  const skillNames = skills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase() || '');

  const hasMarketing = skillNames.some(s =>
    ['performance marketing', 'paid social', 'seo', 'growth', 'email', 'content'].some(k => s.includes(k))
  );
  const hasEngineering = skillNames.some(s =>
    ['engineering', 'frontend', 'backend', 'full-stack', 'developer', 'react', 'node', 'python'].some(k => s.includes(k))
  );
  const hasDesign = skillNames.some(s =>
    ['design', 'ui', 'ux', 'product design', 'figma'].some(k => s.includes(k))
  );
  const hasData = skillNames.some(s =>
    ['data', 'analytics', 'ml', 'machine learning', 'sql'].some(k => s.includes(k))
  );
  const hasProduct = skillNames.some(s =>
    ['product', 'pm', 'product management', 'roadmap'].some(k => s.includes(k))
  );

  if (hasMarketing) areas.push('Digital marketing, growth strategy, and campaign optimization');
  if (hasEngineering) areas.push('Web and mobile application development');
  if (hasDesign) areas.push('Product design and user experience');
  if (hasData) areas.push('Data analysis and business intelligence');
  if (hasProduct) areas.push('Product strategy and roadmap planning');

  // Infer from categories
  if (categories.includes('Growth audits')) {
    areas.push('Performance audits and metric deep-dives');
  }
  if (categories.includes('Data labeling')) {
    areas.push('Data labeling and quality assurance work');
  }

  return areas.length > 0 ? areas : ['Cross-functional consulting and project work'];
}

function generateSocialProof(profileData) {
  const proof = [];

  if (profileData.yearsExperience) {
    const years = parseInt(profileData.yearsExperience);
    if (years > 0) {
      proof.push(`${years}+ years of experience`);
    }
  }

  if (profileData.location) {
    proof.push(`Based in ${profileData.location}`);
  }

  if (profileData.hasLinkedIn) {
    proof.push('Verified LinkedIn profile');
  }

  // Default if nothing else
  if (proof.length === 0) {
    proof.push('Verified Opento profile');
  }

  return proof;
}
