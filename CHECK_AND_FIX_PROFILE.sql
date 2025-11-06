-- Diagnostic and Fix Script for joe-tester profile

-- Step 1: Check if user exists
SELECT id, handle, display_name FROM users WHERE handle = 'joe-tester';

-- Step 2: Check if agent_profiles record exists
SELECT ap.user_id, u.handle, ap.professional_title, ap.bio
FROM agent_profiles ap
JOIN users u ON ap.user_id = u.id
WHERE u.handle = 'joe-tester';

-- Step 3: If no agent_profiles record exists, this will show it
SELECT 
  u.id as user_id,
  u.handle,
  CASE 
    WHEN ap.user_id IS NULL THEN 'NO AGENT_PROFILES RECORD'
    ELSE 'HAS AGENT_PROFILES RECORD'
  END as status
FROM users u
LEFT JOIN agent_profiles ap ON u.id = ap.user_id
WHERE u.handle = 'joe-tester';

-- Step 4: Fix - Create or update agent_profiles record
-- First, get the user_id
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user_id for joe-tester
  SELECT id INTO v_user_id FROM users WHERE handle = 'joe-tester';
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User joe-tester not found!';
  ELSE
    RAISE NOTICE 'Found user_id: %', v_user_id;
    
    -- Insert or update agent_profiles
    INSERT INTO agent_profiles (
      user_id,
      professional_title,
      bio,
      best_at,
      experience_highlights,
      open_to,
      focus_areas,
      recent_wins,
      social_proof,
      lifetime_earned,
      last_payout,
      total_gigs_completed
    ) VALUES (
      v_user_id,
      'Business Development Lead',
      'I help B2B companies build strategic partnerships and scale revenue. 10+ years in enterprise sales.',
      ARRAY[
        'Enterprise partnership development',
        'Revenue growth strategies',
        'Deal structuring and negotiation'
      ],
      ARRAY[
        'Closed $10M+ in strategic partnerships',
        'Built BD function from 0 to $50M pipeline',
        'Negotiated deals with Fortune 500 companies'
      ],
      ARRAY['Consulting calls', 'Advisory sessions', 'Strategy workshops'],
      ARRAY['Business development', 'Partnership strategy', 'Revenue growth'],
      ARRAY[],
      ARRAY['10+ years in enterprise sales', 'B2B partnerships expert'],
      0,
      0,
      0
    )
    ON CONFLICT (user_id) DO UPDATE SET
      professional_title = EXCLUDED.professional_title,
      bio = EXCLUDED.bio,
      best_at = EXCLUDED.best_at,
      experience_highlights = EXCLUDED.experience_highlights,
      open_to = EXCLUDED.open_to,
      focus_areas = EXCLUDED.focus_areas,
      social_proof = EXCLUDED.social_proof,
      updated_at = NOW();
    
    RAISE NOTICE 'Agent profile created/updated successfully!';
  END IF;
END $$;

-- Step 5: Verify it worked
SELECT 
  u.handle,
  ap.professional_title,
  ap.bio,
  ap.best_at,
  ap.experience_highlights
FROM agent_profiles ap
JOIN users u ON ap.user_id = u.id
WHERE u.handle = 'joe-tester';

-- Should now show all the data!
