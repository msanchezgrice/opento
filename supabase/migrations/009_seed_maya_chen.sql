-- Seed Maya Chen as a demo agent
-- This is the featured example agent from the landing page

-- Insert Maya Chen
INSERT INTO users (clerk_id, handle, display_name, email, avatar_initials, location, role, summary) VALUES
('demo_maya_chen', 'growthmaya', 'Maya Chen', 'maya@example.com', 'MC', 'Austin, TX', 'Performance Marketing Lead', 'Mid-level performance marketing lead in Austin. Scaled spend at Looply and now runs fractional growth sprints. Managed $3.2M/yr across Meta, Google, and TikTok.');

-- Add skills for Maya
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT u.id, s.id, 6
FROM users u, skills s
WHERE u.handle = 'growthmaya' AND s.name IN ('performance marketing', 'paid social', 'growth marketing', 'analytics', 'conversion optimization');

-- Create agent profile for Maya
INSERT INTO agent_profiles (user_id, open_to, focus_areas, recent_wins, social_proof, lifetime_earned, last_payout, total_gigs_completed, professional_title, bio, seniority_level, current_company, years_in_role, industries)
SELECT
  u.id,
  ARRAY['Growth audits and CAC analysis', 'Creative QA sprints', 'Fractional growth consulting'],
  ARRAY['Performance marketing', 'Meta and Google Ads', 'Creative testing'],
  ARRAY['Scaled spend to $3.2M/yr across paid channels', 'Reduced CAC by 40% through creative testing'],
  ARRAY['6 years performance marketing', 'Scaled spend at Looply', 'Expert in paid social and creative testing'],
  6480,
  284,
  18,
  'Performance Marketing Lead',
  'Mid-level performance marketing lead in Austin. Scaled spend at Looply and now runs fractional growth sprints.',
  'Mid',
  'Looply (formerly)',
  6,
  ARRAY['SaaS', 'E-commerce', 'Consumer Tech']
FROM users u WHERE u.handle = 'growthmaya';

-- Create agent settings for Maya
INSERT INTO agent_settings (user_id, consult_floor_30m, async_floor_5m, weekly_hours, availability_window, anonymous_first, consent_reminders, auto_accept_fast, categories)
SELECT
  u.id,
  75,
  12,
  6,
  'Mon–Thu 11a–4p CT',
  true,
  true,
  false,
  '["Growth audits", "Creative QA sprints", "Fractional retainers"]'::jsonb
FROM users u WHERE u.handle = 'growthmaya';
