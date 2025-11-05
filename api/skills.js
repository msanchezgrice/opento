// API endpoint to get all skills with categories
// GET /api/skills

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Fetch all skills ordered by category and name
    const { data: skills, error } = await supabase
      .from('skills')
      .select('id, name, category, tier')
      .order('category')
      .order('name');

    if (error) {
      console.error('Error fetching skills:', error);
      return res.status(500).json({ error: 'Failed to fetch skills', details: error });
    }

    // Group skills by category
    const grouped = {};
    skills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    return res.status(200).json({
      skills,
      grouped,
      categories: Object.keys(grouped)
    });

  } catch (error) {
    console.error('Skills API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
