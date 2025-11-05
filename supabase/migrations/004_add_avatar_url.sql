-- Migration: Add avatar_url column to users table
-- Allows storing Cloudinary photo URLs

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
    RAISE NOTICE '✓ Added avatar_url column to users table';
  ELSE
    RAISE NOTICE 'avatar_url column already exists';
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Users table updated!';
  RAISE NOTICE 'Users can now upload profile photos to Cloudinary';
END $$;
