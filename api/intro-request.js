// API endpoint to save intro requests
// POST /api/intro-request

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
    const {
      fromName,
      fromEmail,
      fromCompany,
      toHandle,
      brief
    } = req.body;

    if (!fromName || !fromEmail || !toHandle) {
      return res.status(400).json({ error: 'Name, email, and agent handle are required' });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get target user by handle
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, display_name')
      .eq('handle', toHandle)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Create intro request
    const { data: introRequest, error: introError } = await supabase
      .from('intro_requests')
      .insert({
        from_name: fromName,
        from_email: fromEmail,
        from_company: fromCompany || null,
        to_user_id: user.id,
        brief: brief || null,
        status: 'pending'
      })
      .select()
      .single();

    if (introError) {
      console.error('Error creating intro request:', introError);
      return res.status(500).json({ error: 'Failed to create intro request', details: introError });
    }

    // TODO: Send notification email to agent

    return res.status(201).json({
      success: true,
      introRequest,
      message: `Intro request sent to ${user.display_name}. They'll respond within 1 business day.`
    });

  } catch (error) {
    console.error('Intro request API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
