// Update user skills - PUT /api/me/skills
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, skills } = req.body;
    if (!userId || !Array.isArray(skills)) return res.status(400).json({ error: 'User ID and skills array required' });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: allSkills } = await supabase.from('skills').select('id, name');
    
    const skillMatches = skills.map(userSkill => {
      const skillName = (typeof userSkill === 'string' ? userSkill : userSkill.name).toLowerCase().trim();
      const years = typeof userSkill === 'object' ? userSkill.years : 0;
      const match = allSkills.find(s => s.name.toLowerCase() === skillName || s.name.toLowerCase().includes(skillName));
      return match ? { user_id: userId, skill_id: match.id, years_experience: years || 0 } : null;
    }).filter(Boolean);

    if (skillMatches.length === 0) return res.status(400).json({ error: 'No matching skills found' });

    await supabase.from('user_skills').delete().eq('user_id', userId);
    const { data, error } = await supabase.from('user_skills').insert(skillMatches).select(`years_experience, skill:skills(*)`);
    if (error) return res.status(500).json({ error: 'Failed to update skills', details: error });

    return res.status(200).json({ success: true, skills: data, matched: skillMatches.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
