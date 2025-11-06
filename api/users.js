// API endpoint to create new users
// POST /api/users

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
    const { displayName, email, location, role, summary } = req.body;

    if (!displayName) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
    );

    // Generate handle from display name
    const baseHandle = displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);

    // Check if handle exists, add random suffix if needed
    let handle = baseHandle;
    let attempts = 0;
    let handleExists = true;

    while (handleExists && attempts < 10) {
      const { data: existing } = await supabase
        .from('users')
        .select('handle')
        .eq('handle', handle)
        .single();

      if (!existing) {
        handleExists = false;
      } else {
        // Add random 4-character suffix
        const suffix = Math.random().toString(36).substring(2, 6);
        handle = `${baseHandle}-${suffix}`;
        attempts++;
      }
    }

    if (handleExists) {
      return res.status(500).json({ error: 'Could not generate unique handle' });
    }

    // Generate avatar initials
    const nameParts = displayName.trim().split(/\s+/);
    const avatarInitials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : displayName.substring(0, 2).toUpperCase();

    // Create user record
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_id: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Temporary until proper auth
        handle,
        display_name: displayName,
        email: email || null,
        avatar_initials: avatarInitials,
        location: location || null,
        role: role || null,
        summary: summary || null
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({ error: 'Failed to create user', details: userError });
    }

    // Create default agent_settings and agent_profiles
    // This ensures they always exist even if onboarding flow fails
    const { error: settingsError } = await supabase
      .from('agent_settings')
      .insert({
        user_id: user.id,
        consult_floor_30m: 75,
        async_floor_5m: 12,
        weekly_hours: 6,
        availability_window: 'Mon–Thu 11a–4p CT',
        anonymous_first: true,
        consent_reminders: true,
        auto_accept_fast: false,
        categories: []
      });

    if (settingsError) {
      console.error('Error creating default settings:', settingsError);
      // Don't fail user creation, just log the error
    }

    const { error: profileError } = await supabase
      .from('agent_profiles')
      .insert({
        user_id: user.id,
        open_to: [],
        focus_areas: [],
        recent_wins: [],
        social_proof: [],
        lifetime_earned: 0,
        last_payout: 0,
        total_gigs_completed: 0
      });

    if (profileError) {
      console.error('Error creating default profile:', profileError);
      // Don't fail user creation, just log the error
    }

    // Return user data
    return res.status(201).json({
      user,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
