-- Migration: Add LinkedIn profile data storage
-- Stores raw LinkedIn profile data for future use

-- Add column to store LinkedIn profile data
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'linkedin_profile_data'
  ) THEN
    ALTER TABLE users ADD COLUMN linkedin_profile_data JSONB;
    RAISE NOTICE '✓ Added linkedin_profile_data column to users table';
  ELSE
    RAISE NOTICE 'linkedin_profile_data column already exists';
  END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_linkedin_profile ON users USING gin (linkedin_profile_data);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ LinkedIn profile data storage ready!';
  RAISE NOTICE 'Users can now import and store their LinkedIn profiles';
END $$;
