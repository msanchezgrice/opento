// Test endpoint to verify environment variables are set
// GET /api/test-env

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envStatus = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'not set'
  };

  return res.status(200).json({
    message: 'Environment variables check',
    env: envStatus,
    timestamp: new Date().toISOString()
  });
}
