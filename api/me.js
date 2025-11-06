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
      .select(`*, user_skills(years_experience, skill:skills(*)), agent_settings(*), agent_profiles(*)`)
      .eq('id', userId)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    const profile = user.agent_profiles?.[0] || {};
    
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
      profile: profile,
      // Flatten enhanced profile fields for easy access
      professional_title: profile.professional_title,
      bio: profile.bio,
      seniority_level: profile.seniority_level,
      current_company: profile.current_company,
      years_in_role: profile.years_in_role,
      industries: profile.industries || [],
      best_at: profile.best_at || [],
      experience_highlights: profile.experience_highlights || []
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Me API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
