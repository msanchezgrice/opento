// Resume parsing API - Extracts text and uses GPT-4o to parse structured data
// POST /api/resume/parse

import { createClient } from '@supabase/supabase-js';
// Note: pdf-parse doesn't work on Vercel serverless, using workaround
import mammoth from 'mammoth';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, data, userId } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: 'Filename and file data required' });
    }

    // Decode base64 data
    const buffer = Buffer.from(data, 'base64');

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (buffer.length > maxSize) {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    // Extract text based on file type
    let text = '';
    const lowerFilename = filename.toLowerCase();

    if (lowerFilename.endsWith('.pdf')) {
      // PDF parsing temporarily disabled on Vercel (pdf-parse not serverless-compatible)
      return res.status(400).json({ 
        error: 'PDF support coming soon. Please convert your resume to DOCX or enter information manually.',
        details: 'PDF parsing requires additional serverless configuration'
      });
    } else if (lowerFilename.endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (error) {
        console.error('DOCX parsing error:', error);
        return res.status(400).json({ error: 'Failed to extract text from DOCX. Please try a different file.' });
      }
    } else if (lowerFilename.endsWith('.doc')) {
      return res.status(400).json({ error: 'DOC format not supported. Please convert to PDF or DOCX.' });
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or DOCX.' });
    }

    // Validate extracted text
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from resume. Please try a different file.' });
    }

    console.log(`✓ Extracted ${text.length} characters from ${filename}`);

    // Parse resume with GPT-4o
    const parsed = await parseResumeWithGPT(text);

    // Store resume data if userId provided
    if (userId) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );

      const { error: updateError } = await supabase
        .from('users')
        .update({
          resume_data: parsed,
          resume_filename: filename,
          resume_uploaded_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error saving resume data:', updateError);
        // Don't fail the request, just log the error
      } else {
        console.log(`✓ Saved resume data for user ${userId}`);
      }
    }

    return res.status(200).json({
      success: true,
      parsed,
      message: 'Resume parsed successfully'
    });

  } catch (error) {
    console.error('Resume parse error:', error);
    return res.status(500).json({
      error: 'Failed to parse resume',
      message: error.message
    });
  }
}

async function parseResumeWithGPT(resumeText) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20', // Latest GPT-4o model
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. Extract structured profile data from resumes accurately and thoroughly. 

Return a JSON object with these fields:
- name: Full name (string)
- email: Email address if found (string or null)
- phone: Phone number if found (string or null)
- location: City, State or Country (string or null)
- currentRole: Current job title (string or null)
- currentCompany: Current employer (string or null)
- yearsExperience: Total years of professional experience (number)
- seniorityLevel: One of: "Junior", "Mid", "Senior", "Lead", "Executive"
- summary: Professional summary or bio, 2-3 sentences (string)
- skills: Array of skills mentioned (array of strings)
- previousRoles: Array of {title, company, years} objects
- education: Array of {degree, school, year} objects
- certifications: Array of certification names (array of strings)
- industries: Array of industries/sectors worked in (array of strings, focus on tech industries)

Be thorough but concise. Infer seniority level from job titles and experience. Extract all relevant skills. For tech roles, identify specific technologies, frameworks, and tools.`
          },
          {
            role: 'user',
            content: `Parse this resume and extract all relevant information:\n\n${resumeText}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3 // Lower temperature for more consistent parsing
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    console.log('✓ GPT-4o parsed resume:', {
      name: parsed.name,
      skills: parsed.skills?.length,
      experience: parsed.yearsExperience
    });

    return parsed;

  } catch (error) {
    console.error('GPT parsing error:', error);
    throw new Error(`Failed to parse resume with AI: ${error.message}`);
  }
}
