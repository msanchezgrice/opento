// Update user profile - PUT /api/me/profile
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { 
      userId, 
      displayName, 
      professionalTitle,
      bio,
      role, 
      summary, 
      location, 
      email, 
      avatarUrl,
      // Enhanced onboarding fields
      seniorityLevel,
      currentCompany,
      yearsInRole,
      industries,
      bestAt,
      experienceHighlights
    } = req.body;
    
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Update users table
    const userUpdates = {};
    if (displayName !== undefined) userUpdates.display_name = displayName;
    if (role !== undefined) userUpdates.role = role;
    if (summary !== undefined) userUpdates.summary = summary;
    if (location !== undefined) userUpdates.location = location;
    if (email !== undefined) userUpdates.email = email;
    if (avatarUrl !== undefined) userUpdates.avatar_url = avatarUrl;

    if (Object.keys(userUpdates).length > 0) {
      const { data, error } = await supabase.from('users').update(userUpdates).eq('id', userId).select().single();
      if (error) return res.status(500).json({ error: 'Failed to update user profile', details: error });
    }

    // Update agent_profiles table with enhanced fields
    const profileUpdates = {};
    if (professionalTitle !== undefined) profileUpdates.professional_title = professionalTitle;
    if (bio !== undefined) profileUpdates.bio = bio;
    if (seniorityLevel !== undefined) profileUpdates.seniority_level = seniorityLevel;
    if (currentCompany !== undefined) profileUpdates.current_company = currentCompany;
    if (yearsInRole !== undefined) profileUpdates.years_in_role = yearsInRole;
    if (industries !== undefined) profileUpdates.industries = industries;
    if (bestAt !== undefined) profileUpdates.best_at = bestAt;
    if (experienceHighlights !== undefined) profileUpdates.experience_highlights = experienceHighlights;

    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.user_id = userId;
      profileUpdates.updated_at = new Date().toISOString();
      
      const { error: profileError } = await supabase
        .from('agent_profiles')
        .upsert(profileUpdates, { onConflict: 'user_id' });
      
      if (profileError) {
        console.error('Failed to update agent profile:', profileError);
        // Don't fail the request, but log the error
      }
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: error.message });
  }
}
