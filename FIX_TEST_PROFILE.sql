-- Script to update your test profile with proper data
-- Run this in Supabase SQL Editor

-- First, run migration if not done yet
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[];

-- Find and update your profile (joining with users to get handle)
UPDATE agent_profiles 
SET 
  professional_title = 'Account Management Expert',
  bio = 'Helping B2B companies retain and grow their best accounts. 10+ years managing enterprise relationships.',
  best_at = ARRAY[
    'Enterprise account management',
    'Client retention strategies',
    'Upsell and expansion planning'
  ],
  experience_highlights = ARRAY[
    'Achieved 95% retention across $5M portfolio',
    '50+ enterprise accounts managed',
    'Closed $2M in upsells last year'
  ]
WHERE user_id IN (
  SELECT id FROM users WHERE handle = 'test-12'
);

-- Note: Skills are stored in user_skills table, not agent_profiles
-- Your skills from onboarding should already be there

-- Verify it worked
SELECT 
  u.handle,
  ap.professional_title,
  ap.bio,
  ap.best_at,
  ap.experience_highlights
FROM agent_profiles ap
JOIN users u ON ap.user_id = u.id
WHERE u.handle = 'test-12';
