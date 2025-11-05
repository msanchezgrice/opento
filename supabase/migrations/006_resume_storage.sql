-- Migration: Add resume storage fields
-- Stores parsed resume data and metadata

-- Add resume fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_data JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_filename TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_uploaded_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_file_url TEXT;

-- Add indexes for querying
CREATE INDEX IF NOT EXISTS idx_users_resume_uploaded ON users(resume_uploaded_at) WHERE resume_uploaded_at IS NOT NULL;

-- Add comment
COMMENT ON COLUMN users.resume_data IS 'Parsed resume data from GPT-4o (name, email, skills, experience, etc.)';
COMMENT ON COLUMN users.resume_filename IS 'Original filename of uploaded resume';
COMMENT ON COLUMN users.resume_uploaded_at IS 'Timestamp when resume was uploaded';
COMMENT ON COLUMN users.resume_file_url IS 'URL to stored resume file (if we decide to store it)';
