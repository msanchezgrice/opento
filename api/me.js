// API endpoint to get current user's full data
// GET /api/me

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // Fetch related data separately to avoid join issues
    const { data: skills } = await supabase
      .from('user_skills')
      .select('years_experience, skill:skills(*)')
      .eq('user_id', user.id);

    const { data: settings } = await supabase
      .from('agent_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: profile } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Attach to user object
    user.user_skills = skills || [];
    user.agent_settings = settings ? [settings] : [];
    user.agent_profiles = profile ? [profile] : [];

    const profileData = user.agent_profiles?.[0] || {};
    
    const userData = {
      id: user.id,
      handle: user.handle,
      displayName: user.display_name,
      email: user.email,
      avatarInitials: user.avatar_initials,
      avatar_url: user.avatar_url,
      location: user.location,
      role: user.role,
      summary: user.summary,
      skills: user.user_skills?.map(us => ({ id: us.skill?.id, name: us.skill?.name, category: us.skill?.category, years: us.years_experience })) || [],
      settings: user.agent_settings?.[0] || null,
      profile: profileData,
      // Flatten enhanced profile fields for easy access
      professional_title: profileData.professional_title,
      bio: profileData.bio,
      seniority_level: profileData.seniority_level,
      current_company: profileData.current_company,
      years_in_role: profileData.years_in_role,
      industries: profileData.industries || [],
      best_at: profileData.best_at || [],
      experience_highlights: profileData.experience_highlights || []
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Me API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
