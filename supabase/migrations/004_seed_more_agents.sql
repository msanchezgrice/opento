-- Seed 20 additional demo agents for browse functionality
-- Run this after 001, 002, and 003 migrations

-- Insert 20 new users
INSERT INTO users (clerk_id, handle, display_name, email, avatar_initials, location, role, summary) VALUES
('demo_user_007', 'sarahdesign', 'Sarah Martinez', 'sarah@example.com', 'SM', 'Los Angeles, CA', 'Senior UX Designer', 'UX designer passionate about accessibility and inclusive design. 10 years at startups and agencies.'),
('demo_user_008', 'techcarlos', 'Carlos Rodriguez', 'carlos@example.com', 'CR', 'Miami, FL', 'Backend Engineer', 'Backend specialist in Python and Go. Built scalable APIs for fintech and healthcare companies.'),
('demo_user_009', 'contentkim', 'Kimberly Lee', 'kim@example.com', 'KL', 'Portland, OR', 'Content Strategist', 'Content marketing and SEO expert. Grew blog traffic 500% for multiple B2B SaaS companies.'),
('demo_user_010', 'devandrew', 'Andrew Thompson', 'andrew@example.com', 'AT', 'Boston, MA', 'Full-Stack Developer', 'MERN stack developer with DevOps experience. Love building MVPs for early-stage startups.'),
('demo_user_011', 'analyticslisa', 'Lisa Wong', 'lisa@example.com', 'LW', 'San Francisco, CA', 'Data Analyst', 'Business intelligence and data visualization specialist. SQL, Tableau, and Python expert.'),
('demo_user_012', 'brandjohn', 'John Davis', 'john@example.com', 'JD', 'Chicago, IL', 'Brand Designer', 'Brand identity designer for consumer and tech brands. Specializing in visual systems and packaging.'),
('demo_user_013', 'marketingmike', 'Michael Chen', 'michael@example.com', 'MC', 'Austin, TX', 'Email Marketing Manager', 'Email and lifecycle marketing specialist. Built automated flows generating $2M+ in revenue.'),
('demo_user_014', 'uxemily', 'Emily Brown', 'emily@example.com', 'EB', 'Seattle, WA', 'UX Researcher', 'User research and testing expert. Conducted 200+ user interviews for Fortune 500 companies.'),
('demo_user_015', 'frontendtom', 'Thomas Anderson', 'tom@example.com', 'TA', 'Denver, CO', 'Frontend Engineer', 'React and TypeScript specialist. Performance optimization and component library expert.'),
('demo_user_016', 'productanna', 'Anna Johnson', 'anna@example.com', 'AJ', 'New York, NY', 'Senior Product Manager', 'B2B SaaS product manager. Led 5+ successful product launches at Series B+ companies.'),
('demo_user_017', 'mlnina', 'Nina Patel', 'nina@example.com', 'NP', 'San Jose, CA', 'ML Engineer', 'Machine learning engineer specializing in NLP and recommendation systems. PhD in AI.'),
('demo_user_018', 'mobilejack', 'Jack Wilson', 'jack@example.com', 'JW', 'Austin, TX', 'Mobile Developer', 'iOS and React Native developer. Built apps with 1M+ downloads across app stores.'),
('demo_user_019', 'seoemma', 'Emma Taylor', 'emma@example.com', 'ET', 'Remote', 'Technical SEO Specialist', 'Technical SEO and site speed optimization expert. Increased organic traffic 400% on average.'),
('demo_user_020', 'salesolivia', 'Olivia White', 'olivia@example.com', 'OW', 'San Francisco, CA', 'Sales Operations Manager', 'Sales ops and enablement specialist. Built processes scaling teams from 5 to 50 reps.'),
('demo_user_021', 'creativeryan', 'Ryan Moore', 'ryan@example.com', 'RM', 'Brooklyn, NY', 'Creative Director', 'Creative director for digital campaigns. Led work for Nike, Apple, and startups.'),
('demo_user_022', 'devopssam', 'Samantha Garcia', 'sam@example.com', 'SG', 'Seattle, WA', 'DevOps Engineer', 'Cloud infrastructure and CI/CD specialist. AWS and Kubernetes expert.'),
('demo_user_023', 'datasophie', 'Sophie Martin', 'sophie@example.com', 'SM', 'Boston, MA', 'Data Scientist', 'Data scientist with expertise in predictive modeling and A/B testing frameworks.'),
('demo_user_024', 'designdaniel', 'Daniel Lopez', 'daniel@example.com', 'DL', 'Los Angeles, CA', 'Product Designer', 'Product designer for mobile apps. Specialized in fintech and health tech interfaces.'),
('demo_user_025', 'growthliam', 'Liam Harris', 'liam@example.com', 'LH', 'Remote', 'Growth Hacker', 'Growth marketing and viral loops expert. Scaled 3 companies from 0 to 100K users.'),
('demo_user_026', 'qaava', 'Ava Martinez', 'ava@example.com', 'AM', 'Chicago, IL', 'QA Engineer', 'Quality assurance and test automation specialist. Selenium, Cypress, and manual testing.');

-- Add skills for each agent (mapping to existing skills from 002_seed_skills.sql)
-- Sarah Martinez - UX Designer (skills: 42, 43, 52)
INSERT INTO user_skills (user_id, skill_id, years_experience) 
SELECT id, unnest(ARRAY[42, 43, 52]), unnest(ARRAY[10, 10, 8])
FROM users WHERE handle = 'sarahdesign';

-- Carlos Rodriguez - Backend Engineer (skills: 24, 38, 28)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[24, 38, 28]), unnest(ARRAY[8, 8, 6])
FROM users WHERE handle = 'techcarlos';

-- Kimberly Lee - Content Strategist (skills: 9, 5, 11)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[9, 5, 11]), unnest(ARRAY[7, 7, 5])
FROM users WHERE handle = 'contentkim';

-- Andrew Thompson - Full-Stack Developer (skills: 22, 36, 37)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[22, 36, 37]), unnest(ARRAY[6, 6, 5])
FROM users WHERE handle = 'devandrew';

-- Lisa Wong - Data Analyst (skills: 64, 69, 68)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[64, 69, 68]), unnest(ARRAY[8, 8, 7])
FROM users WHERE handle = 'analyticslisa';

-- John Davis - Brand Designer (skills: 47, 46, 45)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[47, 46, 45]), unnest(ARRAY[9, 9, 8])
FROM users WHERE handle = 'brandjohn';

-- Michael Chen - Email Marketing (skills: 6, 7, 13)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[6, 7, 13]), unnest(ARRAY[7, 7, 6])
FROM users WHERE handle = 'marketingmike';

-- Emily Brown - UX Researcher (skills: 52, 43, 51)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[52, 43, 51]), unnest(ARRAY[9, 8, 7])
FROM users WHERE handle = 'uxemily';

-- Thomas Anderson - Frontend Engineer (skills: 23, 36, 35)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[23, 36, 35]), unnest(ARRAY[7, 7, 6])
FROM users WHERE handle = 'frontendtom';

-- Anna Johnson - Product Manager (skills: 57, 58, 60)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[57, 58, 60]), unnest(ARRAY[9, 9, 8])
FROM users WHERE handle = 'productanna';

-- Nina Patel - ML Engineer (skills: 67, 66, 38)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[67, 66, 38]), unnest(ARRAY[6, 6, 8])
FROM users WHERE handle = 'mlnina';

-- Jack Wilson - Mobile Developer (skills: 25, 23, 36)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[25, 23, 36]), unnest(ARRAY[8, 6, 6])
FROM users WHERE handle = 'mobilejack';

-- Emma Taylor - Technical SEO (skills: 5, 31, 11)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[5, 31, 11]), unnest(ARRAY[7, 5, 6])
FROM users WHERE handle = 'seoemma';

-- Olivia White - Sales Operations (skills: 75, 81, 82)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[75, 81, 82]), unnest(ARRAY[8, 7, 6])
FROM users WHERE handle = 'salesolivia';

-- Ryan Moore - Creative Director (skills: 46, 47, 9)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[46, 47, 9]), unnest(ARRAY[12, 12, 10])
FROM users WHERE handle = 'creativeryan';

-- Samantha Garcia - DevOps Engineer (skills: 26, 29, 32)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[26, 29, 32]), unnest(ARRAY[7, 7, 5])
FROM users WHERE handle = 'devopssam';

-- Sophie Martin - Data Scientist (skills: 63, 70, 64)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[63, 70, 64]), unnest(ARRAY[6, 6, 7])
FROM users WHERE handle = 'datasophie';

-- Daniel Lopez - Product Designer (skills: 44, 42, 43)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[44, 42, 43]), unnest(ARRAY[8, 8, 7])
FROM users WHERE handle = 'designdaniel';

-- Liam Harris - Growth Hacker (skills: 8, 1, 12)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[8, 1, 12]), unnest(ARRAY[6, 6, 5])
FROM users WHERE handle = 'growthliam';

-- Ava Martinez - QA Engineer (skills: 33, 23, 82)
INSERT INTO user_skills (user_id, skill_id, years_experience)
SELECT id, unnest(ARRAY[33, 23, 82]), unnest(ARRAY[7, 5, 6])
FROM users WHERE handle = 'qaava';

-- Create agent profiles for all 20 agents
INSERT INTO agent_profiles (user_id, open_to, focus_areas, recent_wins, social_proof, lifetime_earned, last_payout, total_gigs_completed)
SELECT 
  u.id,
  ARRAY['UX audits and usability testing', 'Accessibility consulting', 'Design system reviews'],
  ARRAY['Mobile app UX', 'Inclusive design', 'User research'],
  ARRAY['Redesigned checkout flow increasing conversion by 28%', 'Built accessible design system for healthcare app'],
  ARRAY['10 years experience', 'WCAG certified', 'Led design at 3 unicorn startups'],
  7840,
  420,
  22
FROM users u WHERE u.handle = 'sarahdesign'
UNION ALL
SELECT 
  u.id,
  ARRAY['API development and optimization', 'Database architecture', 'Backend consulting'],
  ARRAY['Python/Go microservices', 'Database optimization', 'API design'],
  ARRAY['Built payment API handling $50M+ transactions', 'Reduced API latency by 60%'],
  ARRAY['8 years backend experience', 'AWS certified', 'Fintech & healthcare expertise'],
  11200,
  680,
  29
FROM users u WHERE u.handle = 'techcarlos'
UNION ALL
SELECT 
  u.id,
  ARRAY['Content strategy and planning', 'SEO content optimization', 'Blog and email writing'],
  ARRAY['B2B SaaS content', 'SEO optimization', 'Content systems'],
  ARRAY['Grew blog traffic from 5K to 50K monthly visitors', 'Content strategy generating 200+ qualified leads/month'],
  ARRAY['7 years content marketing', 'SEO certified', 'Published in TechCrunch, Forbes'],
  6920,
  380,
  26
FROM users u WHERE u.handle = 'contentkim'
UNION ALL
SELECT 
  u.id,
  ARRAY['Full-stack development', 'MVP builds', 'Code reviews and mentoring'],
  ARRAY['MERN stack development', 'DevOps and deployment', 'Startup MVPs'],
  ARRAY['Built 12 MVPs for YC companies', 'Reduced deployment time by 75% with CI/CD'],
  ARRAY['6 years full-stack', 'Built 30+ production apps', 'Preferred vendor for 5 accelerators'],
  9640,
  520,
  34
FROM users u WHERE u.handle = 'devandrew'
UNION ALL
SELECT 
  u.id,
  ARRAY['Business intelligence dashboards', 'Data analysis and insights', 'SQL consulting'],
  ARRAY['Tableau and Looker dashboards', 'SQL optimization', 'Business metrics'],
  ARRAY['Built executive dashboard saving 20 hrs/week', 'Data-driven insights increasing revenue 15%'],
  ARRAY['8 years BI experience', 'Tableau certified', 'Worked with Fortune 500 clients'],
  8420,
  490,
  27
FROM users u WHERE u.handle = 'analyticslisa'
UNION ALL
SELECT 
  u.id,
  ARRAY['Brand identity design', 'Logo and visual systems', 'Packaging design'],
  ARRAY['Consumer brand identity', 'Visual systems', 'Packaging and print'],
  ARRAY['Rebranded startup increasing brand recognition 40%', 'Designed packaging for product with $5M revenue'],
  ARRAY['9 years brand design', 'Work featured in design blogs', 'Clients include Fortune 500'],
  10800,
  620,
  25
FROM users u WHERE u.handle = 'brandjohn'
UNION ALL
SELECT 
  u.id,
  ARRAY['Email marketing campaigns', 'Lifecycle automation', 'Email performance audits'],
  ARRAY['Automated email flows', 'List growth strategies', 'Email deliverability'],
  ARRAY['Email flows generating $2M+ in revenue', 'Grew email list from 10K to 100K subscribers'],
  ARRAY['7 years email marketing', 'Generated $10M+ via email', 'Klaviyo certified'],
  7280,
  410,
  31
FROM users u WHERE u.handle = 'marketingmike'
UNION ALL
SELECT 
  u.id,
  ARRAY['User research studies', 'Usability testing', 'Research planning'],
  ARRAY['Qualitative research', 'User interviews', 'Testing methodologies'],
  ARRAY['Conducted 200+ user interviews', 'Research insights increasing feature adoption 35%'],
  ARRAY['9 years UX research', 'Fortune 500 clients', 'Published research papers'],
  9120,
  550,
  28
FROM users u WHERE u.handle = 'uxemily'
UNION ALL
SELECT 
  u.id,
  ARRAY['React development', 'Component library builds', 'Performance optimization'],
  ARRAY['React and TypeScript', 'Frontend performance', 'Design systems'],
  ARRAY['Reduced page load time by 50%', 'Built component library used by 50+ engineers'],
  ARRAY['7 years frontend', 'React expert', 'Open source contributor'],
  8960,
  510,
  33
FROM users u WHERE u.handle = 'frontendtom'
UNION ALL
SELECT 
  u.id,
  ARRAY['Product strategy and roadmaps', 'Feature prioritization', 'Product launches'],
  ARRAY['B2B SaaS products', 'Product-market fit', 'Go-to-market strategy'],
  ARRAY['Launched 5 successful products', 'Product decisions increasing revenue 25%'],
  ARRAY['9 years product management', 'Led products at Series B+ companies', 'MBA from Stanford'],
  12600,
  740,
  23
FROM users u WHERE u.handle = 'productanna'
UNION ALL
SELECT 
  u.id,
  ARRAY['ML model development', 'NLP projects', 'AI consulting'],
  ARRAY['Natural language processing', 'Recommendation systems', 'Model optimization'],
  ARRAY['Built recommendation system increasing engagement 40%', 'NLP model with 95% accuracy'],
  ARRAY['PhD in AI', '6 years ML engineering', 'Published research in top conferences'],
  14200,
  820,
  19
FROM users u WHERE u.handle = 'mlnina'
UNION ALL
SELECT 
  u.id,
  ARRAY['iOS app development', 'React Native apps', 'App performance optimization'],
  ARRAY['Mobile UI/UX', 'App Store optimization', 'Cross-platform development'],
  ARRAY['Built apps with 1M+ downloads', 'Reduced app crashes by 80%'],
  ARRAY['8 years mobile dev', 'Apps in top charts', 'React Native expert'],
  10400,
  590,
  26
FROM users u WHERE u.handle = 'mobilejack'
UNION ALL
SELECT 
  u.id,
  ARRAY['Technical SEO audits', 'Site speed optimization', 'SEO strategy'],
  ARRAY['Technical SEO', 'Core Web Vitals', 'Schema markup'],
  ARRAY['Increased organic traffic 400% on average', 'Improved Core Web Vitals for 50+ sites'],
  ARRAY['7 years SEO', 'Google certified', 'Clients rank #1 for competitive keywords'],
  6780,
  390,
  35
FROM users u WHERE u.handle = 'seoemma'
UNION ALL
SELECT 
  u.id,
  ARRAY['Sales operations setup', 'CRM optimization', 'Sales enablement'],
  ARRAY['Salesforce administration', 'Sales process design', 'Team scaling'],
  ARRAY['Scaled sales team from 5 to 50 reps', 'Built sales processes increasing close rate 30%'],
  ARRAY['8 years sales ops', 'Salesforce certified', 'Scaled 3 companies past $10M ARR'],
  9840,
  560,
  24
FROM users u WHERE u.handle = 'salesolivia'
UNION ALL
SELECT 
  u.id,
  ARRAY['Creative direction', 'Campaign concepting', 'Art direction'],
  ARRAY['Digital advertising', 'Brand campaigns', 'Video production'],
  ARRAY['Campaigns for Nike, Apple, and major startups', 'Award-winning creative work'],
  ARRAY['12 years creative direction', 'Cannes Lions winner', 'Led teams at top agencies'],
  15600,
  890,
  18
FROM users u WHERE u.handle = 'creativeryan'
UNION ALL
SELECT 
  u.id,
  ARRAY['Cloud infrastructure', 'CI/CD pipelines', 'Kubernetes consulting'],
  ARRAY['AWS and GCP', 'Docker and Kubernetes', 'Infrastructure as code'],
  ARRAY['Reduced deployment time by 80%', 'Built infrastructure handling 10M+ requests/day'],
  ARRAY['7 years DevOps', 'AWS certified', 'Kubernetes expert'],
  10200,
  610,
  28
FROM users u WHERE u.handle = 'devopssam'
UNION ALL
SELECT 
  u.id,
  ARRAY['Predictive modeling', 'A/B testing frameworks', 'Statistical analysis'],
  ARRAY['ML model development', 'Experimentation', 'Data pipelines'],
  ARRAY['A/B testing framework increasing experiment velocity 3x', 'Predictive model saving $500K/year'],
  ARRAY['6 years data science', 'Published research', 'PhD in Statistics'],
  11800,
  690,
  21
FROM users u WHERE u.handle = 'datasophie'
UNION ALL
SELECT 
  u.id,
  ARRAY['Mobile app design', 'Fintech UI/UX', 'Health tech interfaces'],
  ARRAY['Mobile-first design', 'Fintech products', 'Healthcare apps'],
  ARRAY['Designed fintech app with 500K users', 'Health app featured by Apple'],
  ARRAY['8 years product design', 'Fintech specialist', 'Apps in top charts'],
  9560,
  540,
  27
FROM users u WHERE u.handle = 'designdaniel'
UNION ALL
SELECT 
  u.id,
  ARRAY['Growth experiments', 'Viral loops', 'User acquisition'],
  ARRAY['Growth hacking', 'Viral mechanics', 'Referral programs'],
  ARRAY['Scaled 3 companies from 0 to 100K users', 'Built referral program generating 40% of signups'],
  ARRAY['6 years growth', 'Scaled startups to Series B', 'Expert in viral mechanics'],
  8640,
  480,
  32
FROM users u WHERE u.handle = 'growthliam'
UNION ALL
SELECT 
  u.id,
  ARRAY['Test automation', 'Manual QA', 'Test strategy'],
  ARRAY['Selenium and Cypress', 'API testing', 'Quality processes'],
  ARRAY['Reduced bugs in production by 70%', 'Built automated test suite covering 90% of code'],
  ARRAY['7 years QA', 'Automation expert', 'ISTQB certified'],
  7120,
  400,
  30
FROM users u WHERE u.handle = 'qaava';

-- Create agent settings for all 20 agents (with varied pricing and availability)
INSERT INTO agent_settings (user_id, consult_floor_30m, async_floor_5m, weekly_hours, availability_window, anonymous_first, consent_reminders, auto_accept_fast, categories)
SELECT 
  u.id,
  CASE u.handle
    WHEN 'sarahdesign' THEN 85
    WHEN 'techcarlos' THEN 95
    WHEN 'contentkim' THEN 70
    WHEN 'devandrew' THEN 80
    WHEN 'analyticslisa' THEN 80
    WHEN 'brandjohn' THEN 90
    WHEN 'marketingmike' THEN 75
    WHEN 'uxemily' THEN 90
    WHEN 'frontendtom' THEN 85
    WHEN 'productanna' THEN 100
    WHEN 'mlnina' THEN 110
    WHEN 'mobilejack' THEN 95
    WHEN 'seoemma' THEN 70
    WHEN 'salesolivia' THEN 90
    WHEN 'creativeryan' THEN 120
    WHEN 'devopssam' THEN 95
    WHEN 'datasophie' THEN 100
    WHEN 'designdaniel' THEN 85
    WHEN 'growthliam' THEN 80
    WHEN 'qaava' THEN 75
  END as consult_floor_30m,
  CASE u.handle
    WHEN 'sarahdesign' THEN 15
    WHEN 'techcarlos' THEN 18
    WHEN 'contentkim' THEN 12
    WHEN 'devandrew' THEN 14
    WHEN 'analyticslisa' THEN 14
    WHEN 'brandjohn' THEN 16
    WHEN 'marketingmike' THEN 13
    WHEN 'uxemily' THEN 16
    WHEN 'frontendtom' THEN 15
    WHEN 'productanna' THEN 18
    WHEN 'mlnina' THEN 20
    WHEN 'mobilejack' THEN 17
    WHEN 'seoemma' THEN 12
    WHEN 'salesolivia' THEN 16
    WHEN 'creativeryan' THEN 22
    WHEN 'devopssam' THEN 17
    WHEN 'datasophie' THEN 18
    WHEN 'designdaniel' THEN 15
    WHEN 'growthliam' THEN 14
    WHEN 'qaava' THEN 13
  END as async_floor_5m,
  CASE 
    WHEN u.handle IN ('creativeryan', 'productanna') THEN 4
    WHEN u.handle IN ('contentkim', 'seoemma', 'qaava') THEN 10
    ELSE 6
  END as weekly_hours,
  CASE 
    WHEN u.handle IN ('techcarlos', 'devandrew') THEN 'Mon–Fri 9a–5p PT'
    WHEN u.handle IN ('sarahdesign', 'uxemily') THEN 'Tue–Thu 10a–3p PT'
    WHEN u.handle IN ('creativeryan') THEN 'By appointment only'
    ELSE 'Mon–Thu 11a–4p CT'
  END as availability_window,
  true as anonymous_first,
  true as consent_reminders,
  CASE WHEN u.handle IN ('contentkim', 'devandrew', 'growthliam') THEN true ELSE false END as auto_accept_fast,
  '[]'::jsonb as categories
FROM users u 
WHERE u.handle IN ('sarahdesign', 'techcarlos', 'contentkim', 'devandrew', 'analyticslisa', 'brandjohn', 'marketingmike', 'uxemily', 'frontendtom', 'productanna', 'mlnina', 'mobilejack', 'seoemma', 'salesolivia', 'creativeryan', 'devopssam', 'datasophie', 'designdaniel', 'growthliam', 'qaava');
