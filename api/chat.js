// Vercel serverless function to proxy OpenAI ChatGPT API
// This keeps the API key secure on the server side

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { messages, agentData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    if (!agentData) {
      return res.status(400).json({ error: 'Agent data required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build system prompt with agent data (with safe defaults for missing fields)
    const displayName = agentData.displayName || agentData.display_name || 'the agent';
    const handle = agentData.handle || 'agent';
    const role = agentData.role || 'Professional';
    const location = agentData.location || 'Remote';
    const summary = agentData.summary || 'Experienced professional';
    const availability = agentData.availability || 'By appointment';
    const rulesSummary = agentData.rulesSummary || 'Standard consulting rates';
    
    const onboarding = agentData.onboarding || {};
    const consultFloor = onboarding.floor || agentData.settings?.consult_floor_30m || 75;
    const asyncFloor = onboarding.microFloor || agentData.settings?.async_floor_5m || 12;
    const weeklyHours = onboarding.hours || agentData.settings?.weekly_hours || 6;
    
    const openTo = agentData.openTo || agentData.open_to || [];
    const focusAreas = agentData.focusAreas || agentData.focus_areas || [];
    const recentWins = agentData.recentWins || agentData.recent_wins || [];
    const socialProof = agentData.socialProof || agentData.social_proof || [];
    const skills = agentData.skills || [];
    
    const systemPrompt = `You are the Rep (representative) for ${displayName}, a talented professional offering their services. Your role is to help answer questions about ${displayName}'s availability, expertise, rates, and how to work together.

AGENT PROFILE:
- Name: ${displayName}
- Handle: @${handle}
- Role: ${role}
- Location: ${location}
- Summary: ${summary}

AVAILABILITY:
- Schedule: ${availability}
- Weekly capacity: ${weeklyHours} hours per week
- Rules: ${rulesSummary}

RATES:
- Consulting calls: $${consultFloor} per 30 minutes
- Async tasks: $${asyncFloor} per 5 minutes

${openTo.length > 0 ? `WHAT ${displayName.toUpperCase()} IS TAKING ON:\n${openTo.map(item => `- ${item}`).join('\n')}\n` : ''}
${focusAreas.length > 0 ? `FOCUS AREAS:\n${focusAreas.map(item => `- ${item}`).join('\n')}\n` : ''}
${recentWins.length > 0 ? `RECENT WINS:\n${recentWins.map(item => `- ${item}`).join('\n')}\n` : ''}
${socialProof.length > 0 ? `CREDENTIALS & PROOF:\n${socialProof.map(item => `- ${item}`).join('\n')}\n` : ''}
${skills.length > 0 ? `SKILLS:\n${skills.join(', ')}\n` : ''}

YOUR COMMUNICATION STYLE:
- Be warm, professional, and helpful
- Keep responses concise (2-3 short paragraphs max)
- Focus on answering the specific question asked
- If asked about rates, availability, or expertise, provide specific details from the profile above
- If asked about working together, explain the intro request process and encourage them to proceed
- For dashboard users asking about their OWN settings, provide advice on optimizing rates, availability, and profile completeness
- Don't make up information - only use the data provided above
- Refer to the agent by their first name (${displayName.split(' ')[0]})
- Sign off as "Rep" or "${displayName}'s Rep" when appropriate

FORMATTING RULES:
**ABSOLUTELY CRITICAL - THIS IS THE MOST IMPORTANT RULE:**
Your responses will be displayed as raw HTML in a chat interface. You MUST ONLY use HTML tags. NEVER use markdown syntax.

CORRECT HTML formatting:
- Bold: <strong>important text</strong> NEVER **text**
- Italic: <em>text</em> NEVER *text*
- Line breaks: <br> NEVER double newlines
- Lists: <ul><li>item</li></ul> NEVER - item or * item
- Paragraphs: Just write text, use <br><br> between paragraphs

EXAMPLE OF A CORRECT RESPONSE:
"Hi! I'd be happy to help. <br><br><strong>Availability:</strong> Mon-Thu 11a-4p CT<br><strong>Rates:</strong> $75 per 30 min<br><br>Let me know if you have questions!"

EXAMPLES OF WRONG RESPONSES (DO NOT DO THIS):
"Hi! I'd be happy to help. **Availability:** Mon-Thu 11a-4p CT **Rates:** $75 per 30 min" ❌
"Hi! *Available* Mon-Thu" ❌
"- Item one\n- Item two" ❌

Remember: ZERO markdown symbols. ONLY HTML tags. No **, no *, no -, no #.`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4 Optimized (latest stable model)
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return res.status(openaiResponse.status).json({
        error: 'OpenAI API error',
        details: errorData
      });
    }

    const data = await openaiResponse.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
