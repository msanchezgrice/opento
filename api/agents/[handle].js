// API endpoint to get agent data by handle
// GET /api/agents/:handle

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { handle } = req.query;

    if (!handle) {
      return res.status(400).json({ error: 'Handle is required' });
    }

    // Initialize Supabase client with service key for full access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Fetch user with all related data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_skills (
          years_experience,
          skill:skills (
            id,
            name,
            category,
            tier
          )
        ),
        agent_settings (*),
        agent_profiles (*)
      `)
      .eq('handle', handle)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Transform data for frontend consumption
    const agentData = {
      id: user.id,
      handle: user.handle,
      displayName: user.display_name,
      display_name: user.display_name,
      avatar: user.avatar_initials,
      avatar_initials: user.avatar_initials,
      role: user.role || 'Professional',
      summary: user.summary || '',
      location: user.location || '',
      email: user.email,
      
      // Skills
      skills: user.user_skills?.map(us => ({
        name: us.skill?.name || '',
        category: us.skill?.category || '',
        tier: us.skill?.tier || '',
        years: us.years_experience
      })) || [],
      
      // Settings
      settings: user.agent_settings?.[0] || null,
      
      // Profile
      profile: user.agent_profiles?.[0] || null,
      
      // Formatted data for handle.html compatibility
      availability: user.agent_settings?.[0]?.availability_window || 'By appointment',
      linkedinUrl: extractLinkedIn(user.summary),
      rulesSummary: buildRulesSummary(user.agent_settings?.[0]),
      
      // Profile arrays
      focusAreas: user.agent_profiles?.[0]?.focus_areas || [],
      openTo: user.agent_profiles?.[0]?.open_to || [],
      recentWins: user.agent_profiles?.[0]?.recent_wins || [],
      socialProof: user.agent_profiles?.[0]?.social_proof || [],
      
      // Stats
      activity: {
        scanned: 0, // Would come from matched_offers
        blocked: 0,
        ready: 0
      },
      
      // Onboarding data for compatibility with script.js
      onboarding: {
        floor: user.agent_settings?.[0]?.consult_floor_30m || 75,
        microFloor: user.agent_settings?.[0]?.async_floor_5m || 12,
        hours: user.agent_settings?.[0]?.weekly_hours || 6,
        window: user.agent_settings?.[0]?.availability_window || 'Mon–Thu 11a–4p CT'
      },
      
      // Request intro data
      requestIntro: {
        pitch: buildIntroPitch(user),
        guidelines: [
          'Share the goal or KPI you are trying to achieve',
          'Summarize your current approach and main blockers',
          'Include decision-maker info and timeline',
          'Mention budget range for consulting or project work'
        ],
        template: buildIntroTemplate(user),
        note: 'Rep replies within 1 business day. Identity reveals only after accept + escrow.'
      },
      
      // Share/receipt data
      share: {
        headline: `${user.display_name.split(' ')[0]}'s agent keeps opportunities warm.`,
        subheadline: 'Qualified matches found while focused on core work.',
        value: user.agent_profiles?.[0]?.last_payout || 0,
        footer: 'Opento — Anonymous first • Instant payouts',
        linkSlug: user.handle,
        caption: `${user.display_name}'s agent on Opento. Check it out: opento.me/${user.handle}`
      }
    };

    return res.status(200).json(agentData);

  } catch (error) {
    console.error('Agents API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Helper functions
function extractLinkedIn(summary) {
  if (!summary) return null;
  const match = summary.match(/linkedin\.com\/[^\s]+/i);
  return match ? `https://${match[0]}` : null;
}

function buildRulesSummary(settings) {
  if (!settings) return 'Anonymous first • Standard consulting rates';
  
  const parts = [];
  
  if (settings.anonymous_first) {
    parts.push('Anonymous first');
  }
  
  if (settings.consult_floor_30m) {
    parts.push(`$${settings.consult_floor_30m}/30m floor`);
  }
  
  if (settings.auto_accept_fast) {
    parts.push('Auto-accepts quick tasks');
  } else {
    parts.push('Manual approval');
  }
  
  return parts.join(' • ');
}

function buildIntroPitch(user) {
  const firstName = user.display_name?.split(' ')[0] || 'This professional';
  const categories = user.agent_settings?.[0]?.categories || [];
  
  let pitch = `${firstName} is open to `;
  
  if (categories.length > 0) {
    const formatted = categories.map(c => c.toLowerCase()).join(', ');
    pitch += `${formatted}, and related consulting work.`;
  } else {
    pitch += 'consulting, project work, and advisory opportunities.';
  }
  
  return pitch;
}

function buildIntroTemplate(user) {
  const firstName = user.display_name?.split(' ')[0] || 'there';
  
  return `Hi ${firstName},

We're looking for help with [specific goal/challenge].

Current situation: [Brief context about your company/project]

What we need: [Specific deliverable or outcome you're seeking]

Timeline: [When you need this completed]
Budget: [Your budget range]

Decision-maker: [Your name and role]

Looking forward to hearing if this might be a fit!`;
}
