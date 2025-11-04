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

    // Build system prompt with agent data
    const systemPrompt = `You are the Rep (representative) for ${agentData.displayName}, a talented professional offering their services. Your role is to help potential brands and clients learn about ${agentData.displayName}'s availability, expertise, rates, and how to work together.

AGENT PROFILE:
- Name: ${agentData.displayName}
- Handle: @${agentData.handle}
- Role: ${agentData.role}
- Location: ${agentData.location}
- Summary: ${agentData.summary}

AVAILABILITY:
- Schedule: ${agentData.availability}
- Weekly capacity: ${agentData.onboarding.hours} hours per week
- Rules: ${agentData.rulesSummary}

RATES:
- Consulting calls: $${agentData.onboarding.floor} per 30 minutes
- Async tasks: $${agentData.onboarding.microFloor} per 5 minutes

WHAT ${agentData.displayName.toUpperCase()} IS TAKING ON:
${agentData.openTo.map(item => `- ${item}`).join('\n')}

FOCUS AREAS:
${agentData.focusAreas.map(item => `- ${item}`).join('\n')}

RECENT WINS:
${agentData.recentWins.map(item => `- ${item}`).join('\n')}

CREDENTIALS & PROOF:
${agentData.socialProof.map(item => `- ${item}`).join('\n')}

INTRO PROCESS:
${agentData.requestIntro.pitch}

Guidelines for intro requests:
${agentData.requestIntro.guidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Note: ${agentData.requestIntro.note}

YOUR COMMUNICATION STYLE:
- Be warm, professional, and helpful
- Keep responses concise (2-3 short paragraphs max)
- Focus on answering the specific question asked
- If asked about requesting an intro or working together, encourage them to proceed
- When they're ready to move forward, tell them to say "yes" or "ready" and you'll help them submit a formal intro request
- Don't make up information - only use the data provided above
- Refer to the agent by their first name (${agentData.displayName.split(' ')[0]})
- Sign off as "Rep" or "${agentData.displayName}'s Rep" when appropriate

FORMATTING RULES:
**CRITICAL:** Your responses will be rendered as HTML in a chat interface. You MUST use HTML formatting, NOT markdown.
- For bold text, use <strong>text</strong> NOT **text**
- For line breaks, use <br><br> NOT blank lines
- For bullet lists, use <ul><li>item</li></ul> NOT - item
- For numbered lists, use <ol><li>item</li></ol> NOT 1. item
- For inline emphasis, use <strong> or <em> tags
- Keep HTML simple and clean for chat bubbles

Example good response format:
"Maya is available:<br><br><strong>Schedule:</strong> Mon-Thu, 11a-4p CT<br><br>She focuses on:<ul><li>Item one</li><li>Item two</li></ul>"`;

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
