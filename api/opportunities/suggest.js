// API endpoint to suggest opportunities based on user skills
// GET /api/opportunities/suggest?skills=skill1,skill2,skill3

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({ error: 'Skills parameter required (comma-separated list)' });
    }

    // Parse skills
    const skillArray = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    if (skillArray.length === 0) {
      return res.status(400).json({ error: 'At least one skill required' });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Query mappings for these skills
    const { data: mappings, error } = await supabase
      .from('skill_opportunity_mappings')
      .select('opportunity_type, relevance_score')
      .in('skill_name', skillArray)
      .order('relevance_score', { ascending: false });

    if (error) {
      console.error('Error fetching mappings:', error);
      return res.status(500).json({ error: 'Failed to fetch suggestions', details: error });
    }

    if (!mappings || mappings.length === 0) {
      // No mappings found - return generic suggestions
      return res.status(200).json({
        opportunities: [
          'Consulting calls',
          'Advisory sessions',
          'Strategy workshops',
          'Expert review',
          'Training sessions'
        ],
        matched: 0,
        totalSkills: skillArray.length
      });
    }

    // Aggregate scores for each opportunity
    const opportunityScores = {};
    mappings.forEach(row => {
      if (!opportunityScores[row.opportunity_type]) {
        opportunityScores[row.opportunity_type] = 0;
      }
      opportunityScores[row.opportunity_type] += row.relevance_score;
    });

    // Sort by total score and get top 15
    const sortedOpportunities = Object.entries(opportunityScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([type]) => type);

    return res.status(200).json({
      opportunities: sortedOpportunities,
      matched: sortedOpportunities.length,
      totalSkills: skillArray.length,
      skillsUsed: skillArray
    });

  } catch (error) {
    console.error('Opportunities API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
