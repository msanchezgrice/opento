// Get intro requests - GET /api/me/intros
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, status } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    let query = supabase.from('intro_requests').select('*').eq('to_user_id', userId).order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data: intros, error } = await query;
    if (error) return res.status(500).json({ error: 'Failed to fetch intros', details: error });

    return res.status(200).json({ intros: intros || [], total: intros?.length || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
