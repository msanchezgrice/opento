// Update agent settings - PUT /api/me/settings
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, settings } = req.body;
    if (!userId || !settings) return res.status(400).json({ error: 'User ID and settings required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const settingsData = { user_id: userId };
    if (settings.consultFloor !== undefined) settingsData.consult_floor_30m = settings.consultFloor;
    if (settings.asyncFloor !== undefined) settingsData.async_floor_5m = settings.asyncFloor;
    if (settings.weeklyHours !== undefined) settingsData.weekly_hours = settings.weeklyHours;
    if (settings.availabilityWindow !== undefined) settingsData.availability_window = settings.availabilityWindow;
    if (settings.anonymousFirst !== undefined) settingsData.anonymous_first = settings.anonymousFirst;
    if (settings.consentReminders !== undefined) settingsData.consent_reminders = settings.consentReminders;
    if (settings.autoAcceptFast !== undefined) settingsData.auto_accept_fast = settings.autoAcceptFast;
    if (settings.categories !== undefined) settingsData.categories = settings.categories;

    const { data, error } = await supabase.from('agent_settings').upsert(settingsData).select().single();
    if (error) return res.status(500).json({ error: 'Failed to update settings', details: error });

    return res.status(200).json({ success: true, settings: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
