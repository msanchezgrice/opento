-- Seed common skills for Opento
-- Migration: 002_seed_skills

INSERT INTO skills (name, category, tier) VALUES
  -- Marketing (high tier)
  ('performance marketing', 'marketing', 'high'),
  ('growth marketing', 'marketing', 'high'),
  ('marketing strategy', 'marketing', 'high'),
  
  -- Marketing (core)
  ('paid social', 'marketing', 'core'),
  ('paid search', 'marketing', 'core'),
  ('email marketing', 'marketing', 'core'),
  ('lifecycle marketing', 'marketing', 'core'),
  ('content marketing', 'marketing', 'core'),
  ('seo', 'marketing', 'core'),
  ('sem', 'marketing', 'core'),
  ('social media marketing', 'marketing', 'core'),
  ('influencer marketing', 'marketing', 'core'),
  ('marketing analytics', 'marketing', 'core'),
  ('conversion optimization', 'marketing', 'core'),
  ('brand marketing', 'marketing', 'core'),
  ('product marketing', 'marketing', 'core'),
  
  -- Engineering (high tier)
  ('ai', 'engineering', 'high'),
  ('machine learning', 'engineering', 'high'),
  ('system architecture', 'engineering', 'high'),
  ('devops', 'engineering', 'high'),
  
  -- Engineering (core)
  ('frontend development', 'engineering', 'core'),
  ('backend development', 'engineering', 'core'),
  ('full-stack development', 'engineering', 'core'),
  ('mobile development', 'engineering', 'core'),
  ('react', 'engineering', 'core'),
  ('node.js', 'engineering', 'core'),
  ('python', 'engineering', 'core'),
  ('javascript', 'engineering', 'core'),
  ('typescript', 'engineering', 'core'),
  ('cloud architecture', 'engineering', 'core'),
  ('api development', 'engineering', 'core'),
  ('database design', 'engineering', 'core'),
  ('qa testing', 'engineering', 'core'),
  
  -- Design (high tier)
  ('product design', 'design', 'high'),
  ('design systems', 'design', 'high'),
  ('design strategy', 'design', 'high'),
  
  -- Design (core)
  ('ui design', 'design', 'core'),
  ('ux design', 'design', 'core'),
  ('user research', 'design', 'core'),
  ('interaction design', 'design', 'core'),
  ('visual design', 'design', 'core'),
  ('graphic design', 'design', 'core'),
  ('brand design', 'design', 'core'),
  ('motion design', 'design', 'core'),
  ('figma', 'design', 'core'),
  ('prototyping', 'design', 'core'),
  
  -- Product (high tier)
  ('product management', 'product', 'high'),
  ('product strategy', 'product', 'high'),
  ('product operations', 'product', 'high'),
  
  -- Product (core)
  ('roadmap planning', 'product', 'core'),
  ('product analytics', 'product', 'core'),
  ('agile', 'product', 'core'),
  ('scrum', 'product', 'core'),
  ('product launch', 'product', 'core'),
  ('stakeholder management', 'product', 'core'),
  
  -- Data & Analytics (high tier)
  ('data science', 'data', 'high'),
  ('data engineering', 'data', 'high'),
  ('business intelligence', 'data', 'high'),
  
  -- Data & Analytics (core)
  ('data analysis', 'data', 'core'),
  ('sql', 'data', 'core'),
  ('data visualization', 'data', 'core'),
  ('excel', 'data', 'core'),
  ('tableau', 'data', 'core'),
  ('analytics', 'data', 'core'),
  ('ab testing', 'data', 'core'),
  ('statistics', 'data', 'core'),
  
  -- Business & Sales (high tier)
  ('business strategy', 'business', 'high'),
  ('sales strategy', 'business', 'high'),
  ('consulting', 'business', 'high'),
  
  -- Business & Sales (core)
  ('sales', 'business', 'core'),
  ('account management', 'business', 'core'),
  ('customer success', 'business', 'core'),
  ('bizdev', 'business', 'core'),
  ('partnerships', 'business', 'core'),
  ('operations', 'business', 'core'),
  ('project management', 'business', 'core'),
  ('copywriting', 'business', 'core'),
  ('presentation', 'business', 'core')
ON CONFLICT (name) DO NOTHING;
