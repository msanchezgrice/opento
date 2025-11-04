-- Seed opportunities/gigs table with common tech industry gigs
-- Each opportunity is mapped to specific skills

-- Performance Marketing / Growth opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('Growth audit for SaaS company', 'Deep dive on CAC, retention, and channel mix for B2B SaaS', 'consult', ARRAY[1,8], 3, 100, 200, 0.5),
('Meta ads optimization consult', 'Review Meta campaign structure and recommend improvements', 'consult', ARRAY[1,2], 2, 75, 150, 0.5),
('CAC reduction sprint kickoff', 'Strategic session to identify opportunities to lower customer acquisition costs', 'consult', ARRAY[1,8,12], 3, 110, 180, 0.5),
('Attribution modeling review', 'Evaluate current attribution setup and recommend improvements', 'consult', ARRAY[1,11], 3, 90, 160, 0.5),
('Paid search audit', 'Review Google Ads campaigns for efficiency gains', 'consult', ARRAY[3,4], 2, 70, 140, 0.5),
('Email marketing strategy session', 'Plan lifecycle email flows and automation', 'consult', ARRAY[6,7], 2, 65, 130, 0.5),
('Conversion rate optimization consult', 'Analyze funnel and recommend testing roadmap', 'consult', ARRAY[12], 2, 80, 150, 0.5),

-- Async sprints
('Creative QA sprint — 8 ad hooks scored', 'Review and score ad creative performance potential', 'async', ARRAY[1,2], 1, 12, 25, 0.17),
('Ad copy polish — 5 variants', 'Edit and improve ad copy for better CTR', 'async', ARRAY[2,10], 1, 10, 20, 0.17),
('Landing page teardown', 'Quick review of landing page with actionable feedback', 'async', ARRAY[12,8], 2, 15, 30, 0.17),
('Campaign reporting cleanup', 'Organize and standardize campaign reports', 'async', ARRAY[11,1], 1, 12, 22, 0.25),
('Email subject line testing', 'Generate and test email subject line variants', 'async', ARRAY[6,10], 1, 8, 18, 0.17),

-- Retainers
('Fractional growth marketer — 8-12 hrs/week', 'Ongoing growth experiments and optimization', 'retainer', ARRAY[1,8], 3, 85, 150, 10.0),
('Fractional performance marketing lead', 'Manage paid acquisition channels part-time', 'retainer', ARRAY[1,2,3], 4, 95, 160, 10.0),
('Part-time SEO consultant', 'Ongoing SEO optimization and content strategy', 'retainer', ARRAY[5], 3, 70, 120, 8.0),

-- Data labeling
('Label paid social hooks — performance dataset', 'Tag and categorize social ad creative elements', 'labeling', ARRAY[73,74,2], 0, 15, 35, 0.25),
('Tag UGC video content', 'Categorize user-generated content for analysis', 'labeling', ARRAY[73,74], 0, 12, 28, 0.25),
('QA event taxonomy', 'Review and validate analytics event naming', 'labeling', ARRAY[11,73], 1, 18, 40, 0.33);

-- Engineering opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('API architecture review', 'Review API design and scalability', 'consult', ARRAY[27,29], 5, 150, 250, 0.5),
('Database optimization consult', 'Analyze and improve database performance', 'consult', ARRAY[28,68], 4, 120, 200, 0.5),
('Frontend performance audit', 'Review web app performance and recommend optimizations', 'consult', ARRAY[23,31], 3, 100, 180, 0.5),
('Security review', 'Evaluate application security posture', 'consult', ARRAY[32], 5, 140, 220, 0.5),
('Cloud architecture consultation', 'Design or review cloud infrastructure', 'consult', ARRAY[29,26], 5, 150, 240, 0.5),

-- Async sprints
('Code review — React component', 'Review React component for best practices', 'async', ARRAY[36,23], 2, 25, 50, 0.25),
('Bug fix — CSS layout issue', 'Fix responsive layout bug', 'async', ARRAY[23,34], 1, 20, 40, 0.33),
('API endpoint implementation', 'Build simple REST API endpoint', 'async', ARRAY[27,37], 2, 30, 60, 0.5),
('Unit test coverage improvement', 'Add tests to increase coverage', 'async', ARRAY[33,34], 2, 22, 45, 0.33),
('Performance optimization — page load', 'Optimize specific page for faster load time', 'async', ARRAY[31,23], 2, 28, 55, 0.33),

-- Retainers
('Fractional CTO — 10 hrs/week', 'Technical leadership for early-stage startup', 'retainer', ARRAY[22,29], 8, 180, 300, 10.0),
('Part-time frontend engineer', 'Ongoing frontend feature development', 'retainer', ARRAY[23,36], 3, 90, 150, 12.0),
('DevOps consultant — ongoing', 'Manage infrastructure and deployments', 'retainer', ARRAY[26,29], 4, 100, 170, 8.0);

-- Design opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('Product design review', 'Review product flows and provide UX feedback', 'consult', ARRAY[43,44], 3, 100, 180, 0.5),
('Design system audit', 'Evaluate consistency and scalability of design system', 'consult', ARRAY[53,54], 4, 120, 200, 0.5),
('User research planning session', 'Plan user research approach and methodology', 'consult', ARRAY[52], 3, 90, 160, 0.5),
('Brand identity consultation', 'Develop or refine brand visual identity', 'consult', ARRAY[47], 4, 110, 190, 0.5),

-- Async sprints
('UI mockup — dashboard screen', 'Design single dashboard screen in Figma', 'async', ARRAY[42,54], 2, 40, 80, 0.5),
('Icon set creation — 8 icons', 'Design custom icon set for app', 'async', ARRAY[46,49], 1, 25, 50, 0.33),
('Landing page design', 'Design marketing landing page layout', 'async', ARRAY[42,46], 2, 50, 100, 1.0),
('Design QA — component library', 'Review components for consistency', 'async', ARRAY[43,53], 2, 20, 40, 0.25),
('Prototype interaction flow', 'Create interactive prototype in Figma', 'async', ARRAY[51,54], 2, 35, 70, 0.5),

-- Retainers
('Fractional product designer — 10 hrs/week', 'Ongoing product design and UX work', 'retainer', ARRAY[44,43], 4, 95, 160, 10.0),
('Part-time brand designer', 'Ongoing marketing and brand design', 'retainer', ARRAY[47,46], 3, 80, 140, 8.0);

-- Product Management opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('Product roadmap review', 'Evaluate and provide feedback on product roadmap', 'consult', ARRAY[57,58,61], 5, 120, 200, 0.5),
('Feature prioritization workshop', 'Facilitate session to prioritize feature backlog', 'consult', ARRAY[57,62], 4, 100, 180, 0.5),
('Product analytics setup', 'Design analytics tracking plan for product', 'consult', ARRAY[60,63], 3, 90, 160, 0.5),
('PRD review and feedback', 'Review product requirements document', 'consult', ARRAY[57,61], 4, 80, 150, 0.5),

-- Async sprints
('User story writing — 10 stories', 'Write detailed user stories for features', 'async', ARRAY[61], 2, 25, 50, 0.5),
('Product spec documentation', 'Document feature specifications', 'async', ARRAY[57,61], 2, 30, 60, 0.75),
('Competitive analysis brief', 'Research and document competitor features', 'async', ARRAY[57], 1, 20, 40, 0.5),

-- Retainers
('Fractional product manager — 12 hrs/week', 'Ongoing product management support', 'retainer', ARRAY[57,58], 5, 100, 170, 12.0);

-- Data & Analytics opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('Data analytics strategy session', 'Define analytics approach and KPIs', 'consult', ARRAY[64,66], 4, 110, 190, 0.5),
('Machine learning feasibility review', 'Evaluate ML use case and approach', 'consult', ARRAY[66,67], 5, 140, 230, 0.5),
('Dashboard design consultation', 'Plan executive dashboard and metrics', 'consult', ARRAY[69,70], 3, 90, 160, 0.5),
('SQL optimization review', 'Review and optimize database queries', 'consult', ARRAY[68], 3, 85, 150, 0.5),

-- Async sprints
('Build data visualization', 'Create dashboard or chart in Tableau/Looker', 'async', ARRAY[69], 2, 30, 60, 0.5),
('SQL query optimization', 'Optimize slow-running queries', 'async', ARRAY[68], 2, 25, 50, 0.33),
('Data quality audit', 'Check data consistency and accuracy', 'async', ARRAY[64], 1, 20, 40, 0.33),

-- Data labeling
('ML training data annotation', 'Label images or text for ML model training', 'labeling', ARRAY[73,74], 0, 15, 35, 0.5),
('NLP dataset tagging', 'Tag text data for sentiment or classification', 'labeling', ARRAY[73,74], 0, 18, 40, 0.5),
('Computer vision data labeling', 'Annotate images with bounding boxes or labels', 'labeling', ARRAY[73,74], 0, 16, 38, 0.5),

-- Retainers
('Fractional data analyst — 10 hrs/week', 'Ongoing data analysis and reporting', 'retainer', ARRAY[64,68,69], 3, 90, 150, 10.0);

-- Sales & Business opportunities
INSERT INTO opportunities (title, description, category, required_skill_ids, min_years_experience, rate_min, rate_max, estimated_hours) VALUES
-- Consults
('Sales strategy consultation', 'Review and optimize sales process', 'consult', ARRAY[75,78], 5, 110, 190, 0.5),
('Go-to-market strategy session', 'Plan product launch and GTM approach', 'consult', ARRAY[76,79], 5, 120, 200, 0.5),
('Customer success process review', 'Evaluate and improve CS workflows', 'consult', ARRAY[78,81], 3, 90, 160, 0.5),
('Business model consultation', 'Analyze and refine business model', 'consult', ARRAY[79,82], 6, 130, 210, 0.5),

-- Async sprints
('Sales deck review and polish', 'Improve pitch deck content and flow', 'async', ARRAY[75,79], 2, 30, 60, 0.5),
('Customer interview analysis', 'Synthesize insights from customer calls', 'async', ARRAY[78,59], 2, 25, 50, 0.5),
('Market research brief', 'Research target market and compile findings', 'async', ARRAY[76], 1, 20, 40, 0.75),

-- Retainers
('Fractional business development — 10 hrs/week', 'Ongoing partnership and BD work', 'retainer', ARRAY[76], 5, 95, 160, 10.0),
('Part-time customer success manager', 'Manage customer relationships and retention', 'retainer', ARRAY[78], 3, 70, 120, 12.0);
