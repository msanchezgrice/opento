-- Update agent_profiles with detailed, unique content for each agent
-- This replaces generic data with agent-specific open_to, focus_areas, recent_wins, and social_proof

-- Sarah Martinez - UX Designer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'UX audits and usability testing for mobile and web apps',
    'Accessibility consulting and WCAG compliance reviews',
    'Design system reviews and component library audits',
    'User research planning and execution'
  ],
  focus_areas = ARRAY[
    'Mobile app user experience and accessibility',
    'Inclusive design for diverse user populations',
    'User research methodologies and testing',
    'Design systems and component libraries'
  ],
  recent_wins = ARRAY[
    'Redesigned checkout flow increasing conversion by 28% for e-commerce app',
    'Built accessible design system for healthcare app serving 50K+ users',
    'Conducted usability testing uncovering 15 critical UX issues',
    'Led accessibility audit resulting in full WCAG 2.1 AA compliance'
  ],
  social_proof = ARRAY[
    '10 years UX design experience',
    'WCAG certified accessibility specialist',
    'Led design at 3 unicorn startups',
    'Published research on inclusive design'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'sarahdesign');

-- Carlos Rodriguez - Backend Engineer  
UPDATE agent_profiles SET
  open_to = ARRAY[
    'API development and RESTful/GraphQL architecture',
    'Database optimization and query performance tuning',
    'Backend system architecture consulting',
    'Microservices design and implementation'
  ],
  focus_areas = ARRAY[
    'Python and Go microservices architecture',
    'PostgreSQL and MongoDB optimization',
    'API design and scalability',
    'Payment systems and fintech infrastructure'
  ],
  recent_wins = ARRAY[
    'Built payment API processing $50M+ in monthly transactions',
    'Reduced API response time by 60% through caching and optimization',
    'Architected microservices handling 10M+ requests daily',
    'Migrated monolith to microservices with zero downtime'
  ],
  social_proof = ARRAY[
    '8 years backend engineering',
    'AWS Solutions Architect certified',
    'Fintech and healthcare expertise',
    'Built systems for Series B+ companies'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'techcarlos');

-- Kimberly Lee - Content Strategist
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Content strategy and editorial calendar planning',
    'SEO content optimization and keyword research',
    'Blog writing and thought leadership content',
    'Content audits and gap analysis'
  ],
  focus_areas = ARRAY[
    'B2B SaaS content marketing',
    'SEO-optimized blog and landing page copy',
    'Content systems and workflows',
    'Thought leadership and executive ghostwriting'
  ],
  recent_wins = ARRAY[
    'Grew blog traffic from 5K to 50K monthly visitors in 8 months',
    'Content strategy generating 200+ qualified leads per month',
    'Created content system adopted by 20+ person marketing team',
    'Published guest articles in TechCrunch and VentureBeat'
  ],
  social_proof = ARRAY[
    '7 years content marketing',
    'HubSpot Content Marketing certified',
    'Published in TechCrunch, Forbes, VentureBeat',
    'Grown organic traffic 400%+ on average'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'contentkim');

-- Andrew Thompson - Full-Stack Developer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Full-stack MVP development for startups',
    'MERN stack web application builds',
    'Code reviews and technical mentoring',
    'DevOps setup and CI/CD pipeline implementation'
  ],
  focus_areas = ARRAY[
    'React, Node.js, MongoDB, Express stack',
    'Rapid MVP development for startups',
    'DevOps and cloud deployment (AWS, Vercel)',
    'Technical architecture for early-stage companies'
  ],
  recent_wins = ARRAY[
    'Built 12 MVPs for Y Combinator companies in 18 months',
    'Reduced deployment time by 75% with automated CI/CD pipelines',
    'Architected scalable app serving 100K+ users',
    'Mentored 15+ junior developers to production readiness'
  ],
  social_proof = ARRAY[
    '6 years full-stack development',
    'Built 30+ production applications',
    'Preferred vendor for 5 startup accelerators',
    'Technical advisor for early-stage companies'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'devandrew');

-- Lisa Wong - Data Analyst
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Business intelligence dashboard creation',
    'Data analysis and insight generation',
    'SQL query optimization and database consulting',
    'Executive reporting and KPI tracking'
  ],
  focus_areas = ARRAY[
    'Tableau and Looker dashboard development',
    'SQL optimization and data modeling',
    'Business metrics and KPI frameworks',
    'Data visualization and storytelling'
  ],
  recent_wins = ARRAY[
    'Built executive dashboard saving leadership 20 hours per week',
    'Data-driven insights leading to 15% revenue increase',
    'Optimized SQL queries reducing report generation time by 80%',
    'Created BI framework adopted across 3 departments'
  ],
  social_proof = ARRAY[
    '8 years business intelligence',
    'Tableau Desktop Certified Professional',
    'Worked with Fortune 500 clients',
    'Expert in SQL, Python, and data visualization'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'analyticslisa');

-- John Davis - Brand Designer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Brand identity design and logo creation',
    'Visual systems and brand guidelines',
    'Packaging design for consumer products',
    'Brand refresh and repositioning projects'
  ],
  focus_areas = ARRAY[
    'Consumer brand identity and positioning',
    'Visual systems and design language',
    'Packaging design and print production',
    'Brand strategy and market differentiation'
  ],
  recent_wins = ARRAY[
    'Rebranded Series A startup increasing brand recognition by 40%',
    'Designed packaging for product generating $5M in first-year revenue',
    'Created brand identity for 15+ successful product launches',
    'Award-winning design featured in Communication Arts'
  ],
  social_proof = ARRAY[
    '9 years brand design',
    'Work featured in major design publications',
    'Clients include Fortune 500 companies',
    'AIGA member and design awards winner'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'brandjohn');

-- Michael Chen - Email Marketing
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Email marketing campaign strategy and execution',
    'Lifecycle automation and drip campaign setup',
    'Email deliverability audits and optimization',
    'List growth strategies and segmentation'
  ],
  focus_areas = ARRAY[
    'Automated email flows and lifecycle marketing',
    'E-commerce and SaaS email strategies',
    'Email deliverability and inbox placement',
    'A/B testing and conversion optimization'
  ],
  recent_wins = ARRAY[
    'Email automation flows generating $2M+ in annual revenue',
    'Grew email list from 10K to 100K subscribers in 12 months',
    'Increased email open rates by 45% through deliverability optimization',
    'Built welcome series with 35% conversion to paid customers'
  ],
  social_proof = ARRAY[
    '7 years email marketing',
    'Generated $10M+ revenue via email',
    'Klaviyo and HubSpot certified',
    'Email deliverability expert (DMARC, SPF, DKIM)'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'marketingmike');

-- Emily Brown - UX Researcher
UPDATE agent_profiles SET
  open_to = ARRAY[
    'User research study planning and execution',
    'Usability testing and heuristic evaluations',
    'User interview facilitation and analysis',
    'Research strategy and methodology consulting'
  ],
  focus_areas = ARRAY[
    'Qualitative research and user interviews',
    'Usability testing methodologies',
    'Research synthesis and insight generation',
    'Stakeholder research presentations'
  ],
  recent_wins = ARRAY[
    'Conducted 200+ user interviews across multiple industries',
    'Research insights increasing feature adoption by 35%',
    'Uncovered critical usability issues preventing conversion',
    'Built research practice adopted by 50+ person product org'
  ],
  social_proof = ARRAY[
    '9 years UX research experience',
    'Worked with Fortune 500 companies',
    'Published research methodology papers',
    'Led research for products with 1M+ users'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'uxemily');

-- Thomas Anderson - Frontend Engineer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'React and TypeScript application development',
    'Component library and design system builds',
    'Frontend performance optimization',
    'Code reviews and technical consulting'
  ],
  focus_areas = ARRAY[
    'React, TypeScript, and modern JavaScript',
    'Web performance and Core Web Vitals',
    'Component libraries and design systems',
    'Frontend architecture and best practices'
  ],
  recent_wins = ARRAY[
    'Reduced page load time by 50% through optimization',
    'Built component library used by 50+ engineers',
    'Improved Lighthouse scores from 60 to 95+',
    'Led frontend architecture for app with 500K+ users'
  ],
  social_proof = ARRAY[
    '7 years frontend engineering',
    'React and TypeScript expert',
    'Open source contributor (10K+ GitHub stars)',
    'Technical writer with 100K+ blog readers'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'frontendtom');

-- Anna Johnson - Product Manager
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Product strategy and roadmap development',
    'Feature prioritization and backlog management',
    'Product launches and go-to-market strategy',
    'Product-market fit discovery and validation'
  ],
  focus_areas = ARRAY[
    'B2B SaaS product management',
    'Product-market fit and customer discovery',
    'Go-to-market strategy and launches',
    'Product analytics and data-driven decisions'
  ],
  recent_wins = ARRAY[
    'Launched 5 successful products reaching $1M+ ARR',
    'Product decisions increasing revenue by 25%',
    'Led product from concept to Series B ($50M raise)',
    'Built product org from 2 to 15 people'
  ],
  social_proof = ARRAY[
    '9 years product management',
    'Led products at Series B+ companies',
    'MBA from Stanford GSB',
    'Scaled products from 0 to $10M+ ARR'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'productanna');

-- Continue with remaining agents...
-- Nina Patel - ML Engineer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Machine learning model development and deployment',
    'Natural language processing projects',
    'Recommendation system design',
    'AI/ML consulting and strategy'
  ],
  focus_areas = ARRAY[
    'NLP and text analysis',
    'Recommendation engines',
    'Model optimization and deployment',
    'MLOps and production ML systems'
  ],
  recent_wins = ARRAY[
    'Built recommendation system increasing engagement by 40%',
    'NLP model achieving 95% accuracy on production data',
    'Reduced model inference time by 70% through optimization',
    'Published 3 papers in top-tier ML conferences'
  ],
  social_proof = ARRAY[
    'PhD in Artificial Intelligence from Stanford',
    '6 years ML engineering',
    'Published in NeurIPS and ICML',
    'Led ML at unicorn startup'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'mlnina');

-- Jack Wilson - Mobile Developer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'iOS native app development',
    'React Native cross-platform apps',
    'App performance optimization',
    'App Store optimization and launch support'
  ],
  focus_areas = ARRAY[
    'Swift and React Native development',
    'Mobile UI/UX implementation',
    'App performance and crash reduction',
    'App Store presence and optimization'
  ],
  recent_wins = ARRAY[
    'Built apps with 1M+ total downloads',
    'Reduced app crashes by 80% through optimization',
    'Led mobile apps featured by Apple in App Store',
    'Shipped 20+ apps to production across iOS and Android'
  ],
  social_proof = ARRAY[
    '8 years mobile development',
    'Apps in App Store top charts',
    'React Native core contributor',
    'Technical advisor for mobile-first startups'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'mobilejack');

-- Emma Taylor - Technical SEO
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Technical SEO audits and implementation',
    'Core Web Vitals and site speed optimization',
    'SEO strategy and keyword research',
    'Schema markup and structured data'
  ],
  focus_areas = ARRAY[
    'Technical SEO and site architecture',
    'Core Web Vitals and page speed',
    'Schema markup and rich snippets',
    'International SEO and multi-language sites'
  ],
  recent_wins = ARRAY[
    'Increased organic traffic by 400% on average across clients',
    'Improved Core Web Vitals for 50+ websites',
    'Clients ranking #1 for competitive keywords',
    'Technical SEO fixes leading to 200% traffic increase'
  ],
  social_proof = ARRAY[
    '7 years SEO experience',
    'Google Analytics and Tag Manager certified',
    'Clients ranking for 1000+ keywords',
    'Speaker at Search Marketing Expo'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'seoemma');

-- Olivia White - Sales Operations
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Sales operations setup and optimization',
    'Salesforce administration and customization',
    'Sales process design and documentation',
    'Sales team scaling and enablement'
  ],
  focus_areas = ARRAY[
    'Salesforce CRM administration',
    'Sales process design and optimization',
    'Team scaling and territory planning',
    'Sales analytics and forecasting'
  ],
  recent_wins = ARRAY[
    'Scaled sales team from 5 to 50 reps in 18 months',
    'Built sales processes increasing close rate by 30%',
    'Implemented Salesforce setup supporting $50M+ pipeline',
    'Created sales playbook adopted by 100+ reps'
  ],
  social_proof = ARRAY[
    '8 years sales operations',
    'Salesforce Admin and Advanced Admin certified',
    'Scaled 3 companies past $10M ARR',
    'Expert in Salesforce, Outreach, Gong'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'salesolivia');

-- Ryan Moore - Creative Director
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Creative direction for brand campaigns',
    'Campaign concepting and art direction',
    'Video and photo shoot creative direction',
    'Brand storytelling and messaging strategy'
  ],
  focus_areas = ARRAY[
    'Digital advertising creative',
    'Brand campaign development',
    'Video production and direction',
    'Integrated campaign strategy'
  ],
  recent_wins = ARRAY[
    'Creative campaigns for Nike, Apple, and major tech brands',
    'Award-winning work featured in Cannes Lions',
    'Led creative for campaigns generating $100M+ in revenue',
    'Directed brand refresh increasing brand value by 40%'
  ],
  social_proof = ARRAY[
    '12 years creative direction',
    'Cannes Lions and One Show awards',
    'Former CD at top global agencies',
    'Clients include Fortune 100 brands'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'creativeryan');

-- Samantha Garcia - DevOps Engineer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Cloud infrastructure architecture',
    'CI/CD pipeline setup and optimization',
    'Kubernetes cluster management',
    'Infrastructure as Code consulting'
  ],
  focus_areas = ARRAY[
    'AWS and GCP cloud platforms',
    'Docker and Kubernetes orchestration',
    'Terraform and infrastructure as code',
    'CI/CD and deployment automation'
  ],
  recent_wins = ARRAY[
    'Reduced deployment time from hours to minutes',
    'Built infrastructure handling 10M+ requests per day',
    'Achieved 99.99% uptime for mission-critical systems',
    'Saved $200K annually through cloud optimization'
  ],
  social_proof = ARRAY[
    '7 years DevOps engineering',
    'AWS Solutions Architect certified',
    'Kubernetes CKA certified',
    'Led infrastructure for unicorn startup'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'devopssam');

-- Sophie Martin - Data Scientist
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Predictive modeling and forecasting',
    'A/B testing frameworks and analysis',
    'Statistical analysis and experimentation',
    'Data science consulting and strategy'
  ],
  focus_areas = ARRAY[
    'ML model development',
    'Experimentation and causal inference',
    'Data pipelines and ETL',
    'Statistical modeling and forecasting'
  ],
  recent_wins = ARRAY[
    'A/B testing framework increasing experiment velocity 3x',
    'Predictive model saving company $500K annually',
    'Built churn prediction model with 90% accuracy',
    'Data science practice generating $2M in value'
  ],
  social_proof = ARRAY[
    'PhD in Statistics from MIT',
    '6 years data science',
    'Published research in top journals',
    'Led data science at Series B startup'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'datasophie');

-- Daniel Lopez - Product Designer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Mobile app product design',
    'Fintech and health tech UI/UX',
    'Design systems for mobile applications',
    'User flow optimization and prototyping'
  ],
  focus_areas = ARRAY[
    'Mobile-first product design',
    'Fintech and healthcare interfaces',
    'iOS and Android design systems',
    'User journey mapping and optimization'
  ],
  recent_wins = ARRAY[
    'Designed fintech app with 500K active users',
    'Health app featured by Apple in App Store',
    'Improved mobile conversion rates by 45%',
    'Created design system for top-ranked mobile app'
  ],
  social_proof = ARRAY[
    '8 years product design',
    'Apps featured in App Store and Play Store',
    'Fintech design specialist',
    'Former design lead at Series C fintech'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'designdaniel');

-- Liam Harris - Growth Hacker
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Growth experiments and rapid testing',
    'Viral loop and referral program design',
    'User acquisition strategy',
    'Growth analytics and funnel optimization'
  ],
  focus_areas = ARRAY[
    'Growth hacking and viral mechanics',
    'Referral programs and viral loops',
    'Acquisition channel testing',
    'Growth analytics and metrics'
  ],
  recent_wins = ARRAY[
    'Scaled 3 companies from 0 to 100K users organically',
    'Built referral program generating 40% of signups',
    'Viral loop driving 3x user growth month-over-month',
    'Growth experiments with 200%+ improvement rates'
  ],
  social_proof = ARRAY[
    '6 years growth marketing',
    'Scaled startups to Series B',
    'Expert in viral mechanics and loops',
    'Advisor to Y Combinator companies'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'growthliam');

-- Ava Martinez - QA Engineer
UPDATE agent_profiles SET
  open_to = ARRAY[
    'Test automation framework development',
    'Manual QA and test case creation',
    'Quality assurance strategy',
    'API and integration testing'
  ],
  focus_areas = ARRAY[
    'Selenium and Cypress automation',
    'API testing with Postman and REST Assured',
    'Quality processes and best practices',
    'Cross-browser and mobile testing'
  ],
  recent_wins = ARRAY[
    'Reduced production bugs by 70% through systematic testing',
    'Built automated test suite covering 90% of critical paths',
    'Implemented QA process reducing regression time by 60%',
    'Led quality for app processing $100M+ in transactions'
  ],
  social_proof = ARRAY[
    '7 years QA engineering',
    'ISTQB Advanced Level certified',
    'Test automation expert',
    'Built QA practice from scratch at 3 companies'
  ]
WHERE user_id = (SELECT id FROM users WHERE handle = 'qaava');
