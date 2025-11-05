// Update user profile - PUT /api/me/profile
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, displayName, role, summary, location, email, avatarUrl } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const updates = {};
    if (displayName !== undefined) updates.display_name = displayName;
    if (role !== undefined) updates.role = role;
    if (summary !== undefined) updates.summary = summary;
    if (location !== undefined) updates.location = location;
    if (email !== undefined) updates.email = email;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    const { data, error } = await supabase.from('users').update(updates).eq('id', userId).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update profile', details: error });

    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
