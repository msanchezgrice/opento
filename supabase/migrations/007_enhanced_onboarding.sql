-- Migration: Enhanced Onboarding Fields
-- Adds rich profile data for better matching and public display

-- Add enhanced fields to agent_profiles table
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS seniority_level TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS company_size_preference TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS industries TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS current_company TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS years_in_role INTEGER;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS education JSONB; -- {degree, school, year}
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS previous_roles JSONB; -- [{title, company, years}]
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS preferred_project_duration TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS minimum_project_size TEXT;
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0; -- 0-100 score

-- Add indexes for filtering/searching
CREATE INDEX IF NOT EXISTS idx_agent_profiles_seniority ON agent_profiles(seniority_level);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_industries ON agent_profiles USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_certifications ON agent_profiles USING GIN(certifications);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_completeness ON agent_profiles(profile_completeness);

-- Add constraints
ALTER TABLE agent_profiles ADD CONSTRAINT chk_seniority_level 
  CHECK (seniority_level IN ('Junior', 'Mid', 'Senior', 'Lead', 'Executive') OR seniority_level IS NULL);
  
ALTER TABLE agent_profiles ADD CONSTRAINT chk_project_duration
  CHECK (preferred_project_duration IN ('One-off', 'Short-term', 'Ongoing', 'Flexible') OR preferred_project_duration IS NULL);
  
ALTER TABLE agent_profiles ADD CONSTRAINT chk_project_size
  CHECK (minimum_project_size IN ('Quick task', 'Small project', 'Medium project', 'Large project', 'Any size') OR minimum_project_size IS NULL);

ALTER TABLE agent_profiles ADD CONSTRAINT chk_completeness_range
  CHECK (profile_completeness >= 0 AND profile_completeness <= 100);

-- Add comments
COMMENT ON COLUMN agent_profiles.seniority_level IS 'Career level: Junior, Mid, Senior, Lead, or Executive';
COMMENT ON COLUMN agent_profiles.company_size_preference IS 'Preferred company sizes to work with (e.g., Startup, SMB, Enterprise)';
COMMENT ON COLUMN agent_profiles.industries IS 'Industries or sectors of experience';
COMMENT ON COLUMN agent_profiles.current_company IS 'Current employer for credibility';
COMMENT ON COLUMN agent_profiles.years_in_role IS 'Years in current role';
COMMENT ON COLUMN agent_profiles.education IS 'Educational background: {degree: string, school: string, year: string}';
COMMENT ON COLUMN agent_profiles.certifications IS 'Professional certifications';
COMMENT ON COLUMN agent_profiles.previous_roles IS 'Past positions: [{title: string, company: string, years: string}]';
COMMENT ON COLUMN agent_profiles.preferred_project_duration IS 'Preferred engagement length';
COMMENT ON COLUMN agent_profiles.minimum_project_size IS 'Minimum project budget/scope';
COMMENT ON COLUMN agent_profiles.profile_completeness IS 'Profile completion score (0-100)';

-- Create function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  profile_data RECORD;
BEGIN
  SELECT * INTO profile_data FROM agent_profiles WHERE id = profile_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Base fields (10 points each)
  IF profile_data.display_name IS NOT NULL AND profile_data.display_name != '' THEN score := score + 10; END IF;
  IF profile_data.role IS NOT NULL AND profile_data.role != '' THEN score := score + 10; END IF;
  IF profile_data.summary IS NOT NULL AND profile_data.summary != '' THEN score := score + 10; END IF;
  IF profile_data.location IS NOT NULL AND profile_data.location != '' THEN score := score + 10; END IF;
  
  -- Skills (10 points if any skills)
  IF profile_data.skills IS NOT NULL AND array_length(profile_data.skills, 1) > 0 THEN score := score + 10; END IF;
  
  -- Enhanced fields (5 points each)
  IF profile_data.seniority_level IS NOT NULL THEN score := score + 5; END IF;
  IF profile_data.years_in_role IS NOT NULL THEN score := score + 5; END IF;
  IF profile_data.current_company IS NOT NULL AND profile_data.current_company != '' THEN score := score + 5; END IF;
  IF profile_data.industries IS NOT NULL AND array_length(profile_data.industries, 1) > 0 THEN score := score + 5; END IF;
  IF profile_data.certifications IS NOT NULL AND array_length(profile_data.certifications, 1) > 0 THEN score := score + 5; END IF;
  IF profile_data.education IS NOT NULL THEN score := score + 5; END IF;
  IF profile_data.previous_roles IS NOT NULL THEN score := score + 5; END IF;
  
  -- Social links (3 points each)
  IF profile_data.linkedin_url IS NOT NULL AND profile_data.linkedin_url != '' THEN score := score + 3; END IF;
  IF profile_data.twitter_url IS NOT NULL AND profile_data.twitter_url != '' THEN score := score + 3; END IF;
  
  -- Settings (2 points each)
  IF profile_data.preferred_project_duration IS NOT NULL THEN score := score + 2; END IF;
  IF profile_data.minimum_project_size IS NOT NULL THEN score := score + 2; END IF;
  
  -- Avatar (5 points)
  SELECT avatar_url INTO profile_data FROM users WHERE id = profile_data.user_id;
  IF profile_data.avatar_url IS NOT NULL AND profile_data.avatar_url != '' THEN score := score + 5; END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update completeness score
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completeness := calculate_profile_completeness(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_completeness
BEFORE INSERT OR UPDATE ON agent_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_completeness();

-- Seed tech industries (can be referenced in frontend)
CREATE TABLE IF NOT EXISTS industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  popular BOOLEAN DEFAULT false
);

INSERT INTO industries (name, category, popular) VALUES
  ('SaaS', 'Technology', true),
  ('E-commerce', 'Technology', true),
  ('Fintech', 'Technology', true),
  ('Healthtech', 'Technology', true),
  ('AI/ML', 'Technology', true),
  ('Developer Tools', 'Technology', true),
  ('Cybersecurity', 'Technology', true),
  ('Cloud Infrastructure', 'Technology', true),
  ('Mobile Apps', 'Technology', true),
  ('Web3/Crypto', 'Technology', true),
  ('Edtech', 'Technology', false),
  ('Marketplaces', 'Technology', true),
  ('Analytics/Data', 'Technology', true),
  ('DevOps', 'Technology', false),
  ('API/Integration', 'Technology', false),
  ('Consumer Tech', 'Technology', true),
  ('B2B Software', 'Technology', true),
  ('Gaming', 'Technology', false),
  ('Media/Content', 'Technology', false),
  ('Legal Tech', 'Technology', false)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE industries IS 'Curated list of tech industries for filtering and selection';
