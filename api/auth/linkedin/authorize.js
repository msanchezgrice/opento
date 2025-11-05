// LinkedIn OAuth authorization initiation
// GET /api/auth/linkedin/authorize

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://opento.vercel.app'}/api/auth/linkedin/callback`;
    
    if (!clientId) {
      return res.status(500).json({ error: 'LinkedIn OAuth not configured' });
    }

    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // Build LinkedIn OAuth URL (using OpenID Connect)
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', 'openid profile email');

    console.log('Redirecting to LinkedIn OAuth:', authUrl.toString());

    // Redirect to LinkedIn
    return res.redirect(authUrl.toString());

  } catch (error) {
    console.error('LinkedIn authorize error:', error);
    return res.redirect('/onboarding.html?error=auth_failed');
  }
}
