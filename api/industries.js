// API endpoint to get list of tech industries
// GET /api/industries

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: industries, error } = await supabase
      .from('industries')
      .select('*')
      .order('popular', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching industries:', error);
      return res.status(500).json({ error: 'Failed to fetch industries' });
    }

    return res.status(200).json({
      industries: industries || [],
      popular: industries?.filter(i => i.popular) || []
    });

  } catch (error) {
    console.error('Industries API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
