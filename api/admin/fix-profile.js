// Emergency admin endpoint to fix missing agent_profiles
// DELETE THIS after fixing all profiles!

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { handle, secret } = req.body;
  
  // Simple security - require a secret
  if (secret !== 'fix-my-profiles-2024') {
    return res.status(403).json({ error: 'Invalid secret' });
  }
  
  if (!handle) {
    return res.status(400).json({ error: 'Handle required' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, handle, display_name')
      .eq('handle', handle)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found', details: userError });
    }

    // Check if profile exists
    const { data: existing } = await supabase
      .from('agent_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return res.status(200).json({ 
        message: 'Profile already exists',
        user_id: user.id,
        handle: user.handle
      });
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('agent_profiles')
      .insert({
        user_id: user.id,
        professional_title: `${user.display_name.split(' ')[0]}'s Professional Title`,
        bio: `Professional with expertise in their field. Complete your profile to customize this.`,
        best_at: [
          'Add your strengths here',
          'What makes you unique',
          'Your specialized skills'
        ],
        experience_highlights: [
          'Your achievements',
          'Notable projects',
          'Impact you\'ve made'
        ],
        open_to: ['Consulting calls', 'Advisory sessions', 'Project work'],
        focus_areas: ['Professional services'],
        recent_wins: [],
        social_proof: ['Verified Opento profile'],
        lifetime_earned: 0,
        last_payout: 0,
        total_gigs_completed: 0
      })
      .select('user_id, professional_title, bio');

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return res.status(500).json({ error: 'Failed to create profile', details: profileError });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile created successfully',
      user_id: user.id,
      handle: user.handle,
      profile: profile
    });

  } catch (error) {
    console.error('Fix profile error:', error);
    return res.status(500).json({ error: 'Internal error', message: error.message });
  }
}
