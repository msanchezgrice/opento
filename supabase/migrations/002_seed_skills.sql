-- Seed skills catalog with tech industry skills
-- Run this after 001_initial_schema.sql

-- Marketing skills (20)
INSERT INTO skills (name, category, tier) VALUES
('performance marketing', 'marketing', 'high'),
('paid social', 'marketing', 'core'),
('paid search', 'marketing', 'core'),
('seo', 'marketing', 'core'),
('sem', 'marketing', 'core'),
('email marketing', 'marketing', 'core'),
('lifecycle marketing', 'marketing', 'core'),
('growth marketing', 'marketing', 'high'),
('content marketing', 'marketing', 'core'),
('copywriting', 'marketing', 'core'),
('marketing analytics', 'marketing', 'core'),
('conversion optimization', 'marketing', 'core'),
('marketing automation', 'marketing', 'core'),
('social media marketing', 'marketing', 'core'),
('influencer marketing', 'marketing', 'specialized'),
('affiliate marketing', 'marketing', 'specialized'),
('brand marketing', 'marketing', 'core'),
('product marketing', 'marketing', 'core'),
('demand generation', 'marketing', 'core'),
('account-based marketing', 'marketing', 'specialized');

-- Engineering skills (20)
INSERT INTO skills (name, category, tier) VALUES
('full-stack development', 'engineering', 'high'),
('frontend development', 'engineering', 'core'),
('backend development', 'engineering', 'core'),
('mobile development', 'engineering', 'core'),
('devops', 'engineering', 'high'),
('api development', 'engineering', 'core'),
('database design', 'engineering', 'core'),
('cloud architecture', 'engineering', 'high'),
('system design', 'engineering', 'high'),
('web performance', 'engineering', 'specialized'),
('security', 'engineering', 'high'),
('qa testing', 'engineering', 'core'),
('javascript', 'engineering', 'core'),
('typescript', 'engineering', 'core'),
('react', 'engineering', 'core'),
('node.js', 'engineering', 'core'),
('python', 'engineering', 'core'),
('ruby', 'engineering', 'core'),
('java', 'engineering', 'core'),
('go', 'engineering', 'specialized');

-- Design skills (15)
INSERT INTO skills (name, category, tier) VALUES
('ui design', 'design', 'core'),
('ux design', 'design', 'core'),
('product design', 'design', 'high'),
('interaction design', 'design', 'specialized'),
('visual design', 'design', 'core'),
('branding', 'design', 'core'),
('graphic design', 'design', 'core'),
('illustration', 'design', 'specialized'),
('animation', 'design', 'specialized'),
('prototyping', 'design', 'core'),
('user research', 'design', 'core'),
('design systems', 'design', 'specialized'),
('figma', 'design', 'core'),
('sketch', 'design', 'core'),
('adobe creative suite', 'design', 'core');

-- Product skills (10)
INSERT INTO skills (name, category, tier) VALUES
('product management', 'product', 'high'),
('product strategy', 'product', 'high'),
('product operations', 'product', 'specialized'),
('roadmap planning', 'product', 'core'),
('user stories', 'product', 'core'),
('agile', 'product', 'core'),
('scrum', 'product', 'core'),
('product analytics', 'product', 'core'),
('a/b testing', 'product', 'core'),
('feature prioritization', 'product', 'core');

-- Data skills (14)
INSERT INTO skills (name, category, tier) VALUES
('data science', 'data', 'high'),
('data analytics', 'data', 'high'),
('data engineering', 'data', 'high'),
('machine learning', 'data', 'high'),
('artificial intelligence', 'data', 'high'),
('sql', 'data', 'core'),
('data visualization', 'data', 'core'),
('business intelligence', 'data', 'core'),
('statistical analysis', 'data', 'specialized'),
('predictive modeling', 'data', 'specialized'),
('data labeling', 'data', 'core'),
('data annotation', 'data', 'core'),
('r programming', 'data', 'specialized'),
('tableau', 'data', 'core');

-- Sales & Business skills (10)
INSERT INTO skills (name, category, tier) VALUES
('sales', 'business', 'core'),
('business development', 'business', 'core'),
('account management', 'business', 'core'),
('customer success', 'business', 'core'),
('consulting', 'business', 'high'),
('strategy', 'business', 'high'),
('operations', 'business', 'core'),
('project management', 'business', 'core'),
('financial modeling', 'business', 'specialized'),
('fundraising', 'business', 'specialized');
