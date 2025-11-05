// LinkedIn OAuth callback endpoint
// GET /api/auth/linkedin/callback?code=xxx&state=xxx

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error, error_description } = req.query;

    // Check for OAuth error
    if (error) {
      console.error('LinkedIn OAuth error:', error, error_description);
      return res.redirect(`/onboarding.html?error=linkedin_failed&message=${encodeURIComponent(error_description || 'LinkedIn authentication failed')}`);
    }

    if (!code) {
      return res.redirect('/onboarding.html?error=no_code');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://opento.vercel.app'}/api/auth/linkedin/callback`
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return res.redirect('/onboarding.html?error=token_failed');
    }

    const { access_token } = await tokenResponse.json();

    // Fetch user profile using OpenID Connect userinfo endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', await profileResponse.text());
      return res.redirect('/onboarding.html?error=profile_failed');
    }

    const profile = await profileResponse.json();
    console.log('LinkedIn profile:', profile);

    // OpenID Connect returns profile in different format
    const linkedInData = {
      id: profile.sub || '',
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
      email: profile.email || '',
      headline: '', // Not available in basic OpenID Connect profile
      profilePicture: profile.picture || '',
      // Store full profile for later use
      rawProfile: profile
    };

    console.log('✓ LinkedIn profile fetched:', linkedInData.firstName, linkedInData.lastName);

    // Store in session storage and redirect to onboarding
    const encodedData = Buffer.from(JSON.stringify(linkedInData)).toString('base64');
    
    return res.redirect(`/onboarding.html?linkedin=${encodedData}&imported=true`);

  } catch (error) {
    console.error('LinkedIn OAuth callback error:', error);
    return res.redirect(`/onboarding.html?error=linkedin_error&message=${encodeURIComponent(error.message)}`);
  }
}
