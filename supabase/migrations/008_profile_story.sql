-- Add user-defined content fields
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS best_at TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS experience_highlights TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education_display TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS notable_companies TEXT[];
