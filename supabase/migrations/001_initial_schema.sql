-- Opento Database Schema
-- Migration: 001_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  handle TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_initials TEXT,
  location TEXT,
  role TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills catalog
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'marketing', 'engineering', 'design', 'product', 'data', 'sales'
  tier TEXT NOT NULL, -- 'core', 'high', 'specialized'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User skills (many-to-many)
CREATE TABLE user_skills (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  years_experience INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- Agent settings (from onboarding)
CREATE TABLE agent_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  consult_floor_30m INT DEFAULT 75,
  async_floor_5m INT DEFAULT 12,
  weekly_hours INT DEFAULT 6,
  availability_window TEXT DEFAULT 'Mon–Thu 11a–4p CT',
  anonymous_first BOOLEAN DEFAULT true,
  consent_reminders BOOLEAN DEFAULT true,
  auto_accept_fast BOOLEAN DEFAULT false,
  categories JSONB DEFAULT '[]'::jsonb, -- ['Growth audits', 'Campaign optimization', etc.]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities/Gigs catalog (pre-seeded)
CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'consult', 'async', 'retainer', 'labeling'
  required_skill_ids INT[] DEFAULT '{}', -- array of skill_ids
  min_years_experience INT DEFAULT 0,
  rate_min INT,
  rate_max INT,
  estimated_hours DECIMAL(4,2), -- 0.5, 1.0, 2.0, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent profiles (computed/denormalized for fast reads)
CREATE TABLE agent_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  open_to TEXT[] DEFAULT '{}', -- list of work types
  focus_areas TEXT[] DEFAULT '{}',
  recent_wins TEXT[] DEFAULT '{}',
  social_proof TEXT[] DEFAULT '{}',
  lifetime_earned INT DEFAULT 0,
  last_payout INT DEFAULT 0,
  total_gigs_completed INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intro requests
CREATE TABLE intro_requests (
  id SERIAL PRIMARY KEY,
  from_name TEXT,
  from_email TEXT,
  from_company TEXT,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  brief TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions/Earnings
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type TEXT NOT NULL, -- 'consult', 'async', 'retainer', 'labeling'
  opportunity_id INT REFERENCES opportunities(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'paid'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Matched opportunities (inbox)
CREATE TABLE matched_offers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id INT REFERENCES opportunities(id) ON DELETE CASCADE,
  match_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00
  match_reasons TEXT[] DEFAULT '{}', -- ['performance marketing', 'budget approved']
  status TEXT DEFAULT 'queued', -- 'queued', 'accepted', 'declined'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_handle ON users(handle);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_opportunities_category ON opportunities(category);
CREATE INDEX idx_opportunities_required_skills ON opportunities USING GIN(required_skill_ids);
CREATE INDEX idx_matched_offers_user_id ON matched_offers(user_id);
CREATE INDEX idx_matched_offers_status ON matched_offers(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matched_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = clerk_id);

-- Agent profiles: public read
CREATE POLICY "Agent profiles are viewable by everyone"
  ON agent_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own agent profile"
  ON agent_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User skills: public read (for agent discovery)
CREATE POLICY "User skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

-- Agent settings: only owner can read/write
CREATE POLICY "Users can view own settings"
  ON agent_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON agent_settings FOR ALL
  USING (auth.uid() = user_id);

-- Matched offers: only owner can see
CREATE POLICY "Users can view own offers"
  ON matched_offers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own offers"
  ON matched_offers FOR UPDATE
  USING (auth.uid() = user_id);

-- Transactions: only owner can see
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Intro requests: recipient can see theirs
CREATE POLICY "Users can view intros sent to them"
  ON intro_requests FOR SELECT
  USING (auth.uid() = to_user_id);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_settings_updated_at BEFORE UPDATE ON agent_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_profiles_updated_at BEFORE UPDATE ON agent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate lifetime earnings
CREATE OR REPLACE FUNCTION calculate_lifetime_earnings(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  total INT;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM transactions
  WHERE user_id = p_user_id AND status = 'paid';
  RETURN total;
END;
$$ LANGUAGE plpgsql;
