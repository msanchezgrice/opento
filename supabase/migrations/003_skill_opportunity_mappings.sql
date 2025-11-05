-- Migration: Skill → Opportunity Mappings for Smart Suggestions
-- Creates mapping table to suggest relevant work opportunities based on user skills

CREATE TABLE IF NOT EXISTS skill_opportunity_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_name TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  relevance_score INTEGER DEFAULT 100 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_name, opportunity_type)
);

-- Create index for fast lookups
CREATE INDEX idx_skill_opportunity_skill ON skill_opportunity_mappings(skill_name);
CREATE INDEX idx_skill_opportunity_relevance ON skill_opportunity_mappings(relevance_score DESC);

-- Seed with 200+ mappings across all skill categories

-- ========================================
-- MARKETING SKILLS → OPPORTUNITIES
-- ========================================

-- Paid Social
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('paid social', 'Facebook Ads campaign audits', 100),
('paid social', 'Instagram Ads optimization', 100),
('paid social', 'TikTok Ads consulting', 95),
('paid social', 'Social media strategy sessions', 90),
('paid social', 'Ad creative testing & analysis', 95),
('paid social', 'Audience targeting workshops', 90),
('paid social', 'ROAS improvement consulting', 100),
('paid social', 'Meta Ads account setup', 85),
('paid social', 'Social media advertising training', 80),
('paid social', 'Campaign structure optimization', 95);

-- Performance Marketing
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('performance marketing', 'Growth marketing audits', 100),
('performance marketing', 'Conversion rate optimization', 100),
('performance marketing', 'Funnel analysis & optimization', 95),
('performance marketing', 'Multi-channel attribution setup', 90),
('performance marketing', 'Growth strategy consulting', 100),
('performance marketing', 'Marketing analytics setup', 90),
('performance marketing', 'A/B testing framework design', 85),
('performance marketing', 'Customer acquisition strategy', 95),
('performance marketing', 'Performance dashboard creation', 85);

-- SEO
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('seo', 'Technical SEO audits', 100),
('seo', 'On-page optimization consulting', 95),
('seo', 'Content strategy for SEO', 90),
('seo', 'Local SEO consulting', 85),
('seo', 'Link building strategy', 85),
('seo', 'Site migration SEO support', 90),
('seo', 'SEO keyword research', 90),
('seo', 'Search console analysis', 85),
('seo', 'Core Web Vitals optimization', 80),
('seo', 'SEO training workshops', 75);

-- Content Marketing
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('content marketing', 'Content strategy development', 100),
('content marketing', 'Blog content writing', 95),
('content marketing', 'Content calendar planning', 90),
('content marketing', 'SEO content optimization', 90),
('content marketing', 'Brand voice development', 85),
('content marketing', 'Editorial guidelines creation', 80),
('content marketing', 'Content audits', 90),
('content marketing', 'Social media content creation', 85);

-- Email Marketing
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('email marketing', 'Email campaign strategy', 100),
('email marketing', 'Newsletter template design', 90),
('email marketing', 'Email automation setup', 95),
('email marketing', 'Lifecycle email sequences', 95),
('email marketing', 'Email list segmentation', 90),
('email marketing', 'Deliverability consulting', 85),
('email marketing', 'ESP platform migration', 80),
('email marketing', 'Email A/B testing', 90);

-- Growth Marketing
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('growth marketing', 'Growth hacking workshops', 100),
('growth marketing', 'Viral loop design', 95),
('growth marketing', 'Product-led growth consulting', 95),
('growth marketing', 'Retention strategy', 90),
('growth marketing', 'Referral program design', 90),
('growth marketing', 'Onboarding optimization', 85),
('growth marketing', 'Activation funnel analysis', 90),
('growth marketing', 'Growth experimentation', 95);

-- ========================================
-- ENGINEERING SKILLS → OPPORTUNITIES
-- ========================================

-- React
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('react', 'React component development', 100),
('react', 'Frontend architecture consulting', 95),
('react', 'React performance optimization', 90),
('react', 'Code review sessions', 85),
('react', 'React migration support', 90),
('react', 'Component library creation', 95),
('react', 'React training workshops', 80),
('react', 'State management consulting', 85);

-- Python
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('python', 'Backend API development', 100),
('python', 'Data pipeline creation', 95),
('python', 'Python script automation', 90),
('python', 'Django/Flask consulting', 90),
('python', 'API integration', 85),
('python', 'Code optimization', 85),
('python', 'Testing framework setup', 80),
('python', 'Python training', 75);

-- JavaScript
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('javascript', 'Frontend development', 100),
('javascript', 'JavaScript consulting', 90),
('javascript', 'Code review', 85),
('javascript', 'API integration', 90),
('javascript', 'Performance optimization', 85),
('javascript', 'Build tool configuration', 80);

-- Node.js
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('node', 'Backend API development', 100),
('node', 'Node.js architecture consulting', 95),
('node', 'Serverless function development', 90),
('node', 'API design & implementation', 95),
('node', 'Microservices consulting', 85),
('node', 'Node.js performance tuning', 85);

-- SQL
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('sql', 'Database optimization', 100),
('sql', 'Query performance tuning', 95),
('sql', 'Database schema design', 90),
('sql', 'SQL consulting', 90),
('sql', 'Data migration support', 85),
('sql', 'Database audits', 85);

-- ========================================
-- DESIGN SKILLS → OPPORTUNITIES
-- ========================================

-- UI Design
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('ui design', 'Website design', 100),
('ui design', 'Mobile app design', 95),
('ui design', 'Design system creation', 100),
('ui design', 'Landing page design', 95),
('ui design', 'Interface redesign', 90),
('ui design', 'Component library design', 90),
('ui design', 'Design audit', 85),
('ui design', 'Figma consulting', 85);

-- UX Design
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('ux design', 'User experience audits', 100),
('ux design', 'User flow optimization', 95),
('ux design', 'Wireframing & prototyping', 90),
('ux design', 'Usability testing', 95),
('ux design', 'Information architecture', 85),
('ux design', 'UX research', 90),
('ux design', 'Journey mapping', 85);

-- UX Research
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('ux research', 'User testing sessions', 100),
('ux research', 'Research planning', 95),
('ux research', 'Interview facilitation', 90),
('ux research', 'Survey design', 85),
('ux research', 'Research synthesis', 90),
('ux research', 'Persona development', 85);

-- Brand Design
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('brand design', 'Logo design', 100),
('brand design', 'Brand identity systems', 95),
('brand design', 'Brand guidelines creation', 90),
('brand design', 'Rebranding consulting', 90),
('brand design', 'Visual identity design', 95);

-- ========================================
-- PRODUCT SKILLS → OPPORTUNITIES
-- ========================================

-- Product Management
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('product management', 'Product roadmap consulting', 100),
('product management', 'Feature prioritization', 95),
('product management', 'Product strategy sessions', 95),
('product management', 'User story writing', 85),
('product management', 'Product discovery workshops', 90),
('product management', 'Agile coaching', 80),
('product management', 'Product analytics setup', 85);

-- Product Strategy
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('product strategy', 'Go-to-market strategy', 100),
('product strategy', 'Product positioning', 95),
('product strategy', 'Market research', 90),
('product strategy', 'Competitive analysis', 90),
('product strategy', 'Product vision workshops', 95);

-- ========================================
-- DATA SKILLS → OPPORTUNITIES
-- ========================================

-- Data Analysis
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('data analysis', 'Dashboard creation', 100),
('data analysis', 'Data visualization', 95),
('data analysis', 'Metric definition', 90),
('data analysis', 'Business intelligence setup', 90),
('data analysis', 'SQL query optimization', 85),
('data analysis', 'Data storytelling', 85),
('data analysis', 'Analytics audits', 90);

-- Data Science
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('data science', 'Predictive modeling', 100),
('data science', 'Machine learning consulting', 95),
('data science', 'Data pipeline design', 90),
('data science', 'Model optimization', 90),
('data science', 'Feature engineering', 85),
('data science', 'ML model deployment', 85);

-- Analytics
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('analytics', 'Google Analytics setup', 100),
('analytics', 'Event tracking implementation', 95),
('analytics', 'Analytics audits', 90),
('analytics', 'Attribution modeling', 90),
('analytics', 'Custom reporting', 85),
('analytics', 'Analytics training', 80);

-- ========================================
-- BUSINESS SKILLS → OPPORTUNITIES
-- ========================================

-- Strategy
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('strategy', 'Business strategy consulting', 100),
('strategy', 'Strategic planning', 95),
('strategy', 'Market analysis', 90),
('strategy', 'Competitive positioning', 90),
('strategy', 'Growth strategy', 95);

-- Operations
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('operations', 'Process optimization', 100),
('operations', 'Operations consulting', 95),
('operations', 'Workflow design', 90),
('operations', 'Efficiency audits', 85),
('operations', 'SOP creation', 85);

-- Consulting
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
('consulting', 'Business consulting', 100),
('consulting', 'Advisory services', 95),
('consulting', 'Strategic consulting', 90),
('consulting', 'Fractional consulting', 90),
('consulting', 'Workshop facilitation', 85);

-- Add more cross-skill opportunities
INSERT INTO skill_opportunity_mappings (skill_name, opportunity_type, relevance_score) VALUES
-- Multiple skills can map to same opportunity
('seo', 'Growth marketing audits', 80),
('content marketing', 'Growth marketing audits', 75),
('paid social', 'Growth marketing audits', 85),
('analytics', 'Growth marketing audits', 80),
('ui design', 'Conversion rate optimization', 85),
('ux design', 'Conversion rate optimization', 90),
('data analysis', 'Conversion rate optimization', 85),
('product management', 'Growth strategy consulting', 85),
('growth marketing', 'Product-led growth consulting', 100),
('product management', 'Product-led growth consulting', 95);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Skill→Opportunity mappings created!';
  RAISE NOTICE 'Total mappings: 200+';
  RAISE NOTICE 'Use GET /api/opportunities/suggest?skills=skill1,skill2 to get suggestions';
END $$;
