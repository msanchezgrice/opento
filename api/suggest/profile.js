// AI suggestions using GPT-4o
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { field, context } = req.body;
  const KEY = process.env.OPENAI_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'API key missing' });

  const skills = context?.skills || [];
  const seniority = context?.seniorityLevel || 'Senior';
  const years = context?.yearsExperience || 6;
  const company = context?.currentCompany || '';
  const industries = context?.industries || [];

  let prompt = '';
  if (field === 'title') {
    prompt = `Professional title for: ${seniority}, ${years}y exp, skills: ${skills.slice(0,3).join(', ')}. Return only the title (3-6 words).`;
  } else if (field === 'bio') {
    prompt = `Write 2-3 sentence bio in first person for: ${seniority}, ${years}y, skills: ${skills.join(', ')}, industries: ${industries.join(', ')}${company ? `, at ${company}` : ''}. Focus on value delivered. Under 60 words. Return only bio text.`;
  } else if (field === 'best_at') {
    prompt = `List 3 specific professional strengths for: ${seniority}, skills: ${skills.join(', ')}. Each should be 5-10 words, action-oriented, measurable. Return ONLY 3 lines, one per line, no bullets, no numbers, no JSON.`;
  } else if (field === 'highlights') {
    prompt = `List 3 achievement highlights for: ${seniority}, ${years}y experience, ${skills.slice(0,3).join(', ')}${company ? `, at ${company}` : ''}. Include metrics. Each 8-15 words. Return ONLY 3 lines, one per line, no bullets, no numbers, no JSON.`;
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-2024-11-20',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: field === 'title' ? 50 : 300
    })
  });

  const data = await resp.json();
  let suggestion = data.choices[0].message.content.trim();

  if (field === 'best_at' || field === 'highlights') {
    // Always parse as newline-separated text
    suggestion = suggestion
      .split('\n')
      .map(line => line
        .replace(/^[-•*\d.)\]}\["\s]+/, '') // Remove bullets, numbers, brackets, quotes at start
        .replace(/["\]}\[,]+$/, '') // Remove quotes, brackets at end
        .trim()
      )
      .filter(line => 
        line.length > 0 && 
        !line.startsWith('[') && 
        !line.startsWith('{') &&
        !line.match(/^["'\[\{]/)
      )
      .slice(0, 3);
  }

  return res.status(200).json({ success: true, suggestion, field });
}
