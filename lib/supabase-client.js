// Supabase client wrapper for Opento

class SupabaseClient {
  constructor() {
    console.log('🔧 Initializing Supabase client...');
    
    if (!window.opentoConfig) {
      console.error('❌ Config not loaded. Make sure config.js is included before supabase-client.js');
      this.demoMode = true;
      return;
    }
    
    const { url, anonKey } = window.opentoConfig.supabase;
    console.log('📝 Supabase URL:', url);
    console.log('📝 Anon key present:', !!anonKey);
    
    if (!url || !anonKey || url.includes('YOUR_')) {
      console.warn('⚠️ Supabase not configured. Using demo mode.');
      this.demoMode = true;
      return;
    }
    
    // Initialize Supabase client (requires @supabase/supabase-js loaded via CDN)
    if (window.supabase && window.supabase.createClient) {
      console.log('✅ Supabase library loaded, creating client...');
      this.client = window.supabase.createClient(url, anonKey);
      this.demoMode = false;
      console.log('✅ Supabase client ready (live mode)');
    } else {
      console.error('❌ Supabase library not loaded - window.supabase:', typeof window.supabase);
      this.demoMode = true;
    }
  }

  // Users
  async getUser(userId) {
    if (this.demoMode) return this.getDemoUser();
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  }

  async getUserByHandle(handle) {
    if (this.demoMode) return this.getDemoUser();
    const { data, error } = await this.client
      .from('users')
      .select(`
        *,
        user_skills(
          years_experience,
          skill:skills(id, name, category, tier)
        ),
        agent_settings(*),
        agent_profiles(*)
      `)
      .eq('handle', handle)
      .single();
    if (error) throw error;
    return data;
  }

  async createUser(userData) {
    if (this.demoMode) return this.getDemoUser();
    const { data, error } = await this.client
      .from('users')
      .insert(userData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateUser(userId, updates) {
    if (this.demoMode) return this.getDemoUser();
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Agent Settings
  async getAgentSettings(userId) {
    if (this.demoMode) return this.getDemoAgentSettings();
    const { data, error } = await this.client
      .from('agent_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  }

  async upsertAgentSettings(userId, settings) {
    if (this.demoMode) return settings;
    const { data, error } = await this.client
      .from('agent_settings')
      .upsert({ user_id: userId, ...settings })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Skills
  async getAllSkills() {
    if (this.demoMode) return this.getDemoSkills();
    const { data, error } = await this.client
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  async searchSkills(query) {
    if (this.demoMode) return this.getDemoSkills().filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    const { data, error } = await this.client
      .from('skills')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);
    if (error) throw error;
    return data;
  }

  async addUserSkills(userId, skills) {
    if (this.demoMode) return skills;
    // skills: [{skill_id: 1, years_experience: 3}, ...]
    const skillsWithUser = skills.map(s => ({ user_id: userId, ...s }));
    const { data, error } = await this.client
      .from('user_skills')
      .upsert(skillsWithUser)
      .select();
    if (error) throw error;
    return data;
  }

  // Opportunities
  async getOpportunitiesBySkills(skillIds, category = null) {
    if (this.demoMode) return this.getDemoOpportunities();
    let query = this.client
      .from('opportunities')
      .select('*')
      .contains('required_skill_ids', skillIds)
      .eq('is_active', true);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.limit(50);
    if (error) throw error;
    return data;
  }

  // Matched Offers (Inbox)
  async getMatchedOffers(userId, status = null) {
    if (this.demoMode) return this.getDemoMatchedOffers();
    let query = this.client
      .from('matched_offers')
      .select(`
        *,
        opportunity:opportunities(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateOfferStatus(offerId, status) {
    if (this.demoMode) return { id: offerId, status };
    const { data, error } = await this.client
      .from('matched_offers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', offerId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async createTransaction(userId, opportunityId, amount, type) {
    if (this.demoMode) return { id: 1, amount, type };
    const { data, error } = await this.client
      .from('transactions')
      .insert({
        user_id: userId,
        opportunity_id: opportunityId,
        amount,
        type,
        status: 'pending'
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Agent Profiles
  async getAgentProfile(userId) {
    if (this.demoMode) return this.getDemoAgentProfile();
    const { data, error } = await this.client
      .from('agent_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async upsertAgentProfile(userId, profile) {
    if (this.demoMode) return profile;
    const { data, error } = await this.client
      .from('agent_profiles')
      .upsert({ user_id: userId, ...profile })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Browse Agents
  async browseAgents(filters = {}) {
    const { skill, category, minEarnings, limit = 50 } = filters;
    
    // Always try database first
    if (!this.demoMode) {
      try {
        console.log('📊 Querying database for agents...');
        
        let query = this.client
          .from('users')
          .select(`
            *,
            user_skills(skill_id, years_experience, skill:skills(id, name, category)),
            agent_profiles(*)
          `)
          .not('handle', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('❌ Browse agents query error:', error);
          console.log('Falling back to demo agents');
        } else {
          console.log(`📦 Raw query returned ${data ? data.length : 0} results`);
          
          if (data && data.length > 0) {
            // Apply filters client-side if needed
            let filtered = data;
            
            if (skill) {
              filtered = filtered.filter(agent => 
                agent.user_skills?.some(us => 
                  us.skill?.name?.toLowerCase() === skill.toLowerCase()
                )
              );
            }
            
            if (category) {
              filtered = filtered.filter(agent =>
                agent.user_skills?.some(us => 
                  us.skill?.category === category
                )
              );
            }
            
            if (minEarnings) {
              filtered = filtered.filter(agent => {
                const profile = agent.agent_profiles?.[0];
                return profile && profile.lifetime_earned >= minEarnings;
              });
            }
            
            console.log(`✅ Loaded ${filtered.length} agents from database (${data.length} total, ${filtered.length} after filters)`);
            return filtered;
          }
        }
      } catch (err) {
        console.error('❌ Browse agents exception:', err);
      }
    }
    
    // Fallback to demo agents
    console.log('Using demo agents (6 agents)');
    return this.getDemoBrowseAgents();
  }

  // Intro Requests
  async createIntroRequest(requestData) {
    if (this.demoMode) {
      console.log('Demo mode: Intro request', requestData);
      return { id: 1, ...requestData, status: 'pending' };
    }
    const { data, error } = await this.client
      .from('intro_requests')
      .insert(requestData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Demo data for development
  getDemoUser() {
    return {
      id: '00000000-0000-0000-0000-000000000001',
      clerk_id: 'demo_user',
      handle: 'growthmaya',
      display_name: 'Maya Chen',
      email: 'maya@example.com',
      avatar_initials: 'MC',
      location: 'Austin, TX (CT)',
      role: 'Performance marketing lead for consumer apps',
      summary: 'Runs acquisition & lifecycle experiments for subscription and marketplace brands. Ex-Looply growth lead; now fractional.'
    };
  }

  getDemoAgentSettings() {
    return {
      user_id: '00000000-0000-0000-0000-000000000001',
      consult_floor_30m: 75,
      async_floor_5m: 12,
      weekly_hours: 6,
      availability_window: 'Mon–Thu 11a–4p CT',
      anonymous_first: true,
      consent_reminders: true,
      auto_accept_fast: false,
      categories: ['Growth audits', 'Campaign optimization', 'Fractional retainers', 'Data labeling']
    };
  }

  getDemoAgentProfile() {
    return {
      user_id: '00000000-0000-0000-0000-000000000001',
      open_to: [
        'Fractional growth engagements (8–12 hrs/week)',
        'One-off performance audits & playbooks',
        'Micro tasks: ad creative scoring, copy polish, tagging datasets',
        'Labeling: paid social hooks, funnel QA, event taxonomy clean-up'
      ],
      focus_areas: [
        'Acquisition & lifecycle experiments for subscription apps',
        'Paid social creative testing + reporting automation',
        'Attribution clean-up across Meta, Google, and TikTok'
      ],
      recent_wins: [
        'Cut blended CAC by 22% for Looply with a two-week creative sprint.',
        'Grew trial-to-paid by 18% for Pollinate Labs via lifecycle rebuild.',
        'Stabilized attribution across Meta + Google + TikTok for a marketplace launch.'
      ],
      social_proof: [
        'Managed $3.2M/yr in spend',
        'Meta Blueprint certified',
        'Ex-Looply growth lead',
        'Preferred vendor for 3 YC startups'
      ],
      lifetime_earned: 6480,
      last_payout: 284,
      total_gigs_completed: 18
    };
  }

  getDemoSkills() {
    return [
      { id: 1, name: 'performance marketing', category: 'marketing', tier: 'high' },
      { id: 2, name: 'paid social', category: 'marketing', tier: 'core' },
      { id: 8, name: 'growth marketing', category: 'marketing', tier: 'high' },
      { id: 11, name: 'marketing analytics', category: 'marketing', tier: 'core' }
    ];
  }

  getDemoOpportunities() {
    return [
      {
        id: 1,
        title: 'Creative QA sprint — 8 hooks scored',
        description: 'Review and score ad creative performance potential',
        category: 'async',
        required_skill_ids: [1, 2],
        min_years_experience: 1,
        rate_min: 12,
        rate_max: 25,
        estimated_hours: 0.17
      },
      {
        id: 2,
        title: '30-min consult — Ads efficiency reset',
        description: 'Series A fintech recalibrating Meta + Google spend',
        category: 'consult',
        required_skill_ids: [1, 2],
        min_years_experience: 2,
        rate_min: 90,
        rate_max: 150,
        estimated_hours: 0.5
      }
    ];
  }

  getDemoBrowseAgents() {
    // Return full demo agents for browse page
    return [
      {
        handle: 'growthmaya',
        display_name: 'Maya Chen',
        avatar_initials: 'MC',
        role: 'Performance marketing lead',
        summary: 'Runs acquisition & lifecycle experiments for subscription and marketplace brands. Ex-Looply growth lead; now fractional.',
        location: 'Austin, TX',
        user_skills: [
          { skill: { name: 'performance marketing', category: 'marketing' } },
          { skill: { name: 'paid social', category: 'marketing' } },
          { skill: { name: 'growth marketing', category: 'marketing' } }
        ],
        agent_profiles: [{
          lifetime_earned: 6480,
          total_gigs_completed: 18,
          last_payout: 284
        }]
      },
      {
        handle: 'designdave',
        display_name: 'David Kim',
        avatar_initials: 'DK',
        role: 'Product designer',
        summary: 'Senior product designer specializing in SaaS dashboards and design systems. 8 years at tech companies.',
        location: 'San Francisco, CA',
        user_skills: [
          { skill: { name: 'product design', category: 'design' } },
          { skill: { name: 'ui design', category: 'design' } },
          { skill: { name: 'design systems', category: 'design' } }
        ],
        agent_profiles: [{
          lifetime_earned: 8920,
          total_gigs_completed: 24,
          last_payout: 450
        }]
      },
      {
        handle: 'coderjess',
        display_name: 'Jessica Torres',
        avatar_initials: 'JT',
        role: 'Full-stack engineer',
        summary: 'Full-stack developer with expertise in React, Node.js, and cloud architecture. Love solving complex technical challenges.',
        location: 'Denver, CO',
        user_skills: [
          { skill: { name: 'full-stack development', category: 'engineering' } },
          { skill: { name: 'react', category: 'engineering' } },
          { skill: { name: 'cloud architecture', category: 'engineering' } }
        ],
        agent_profiles: [{
          lifetime_earned: 12400,
          total_gigs_completed: 32,
          last_payout: 680
        }]
      },
      {
        handle: 'datasamuel',
        display_name: 'Samuel Park',
        avatar_initials: 'SP',
        role: 'Data scientist',
        summary: 'ML engineer and data scientist. Built predictive models for e-commerce and fintech. PhD in Computer Science.',
        location: 'Seattle, WA',
        user_skills: [
          { skill: { name: 'data science', category: 'data' } },
          { skill: { name: 'machine learning', category: 'data' } },
          { skill: { name: 'python', category: 'engineering' } }
        ],
        agent_profiles: [{
          lifetime_earned: 15800,
          total_gigs_completed: 28,
          last_payout: 920
        }]
      },
      {
        handle: 'productrachel',
        display_name: 'Rachel Singh',
        avatar_initials: 'RS',
        role: 'Product manager',
        summary: 'Product manager with B2B SaaS experience. Expert in roadmap planning, user research, and cross-functional leadership.',
        location: 'New York, NY',
        user_skills: [
          { skill: { name: 'product management', category: 'product' } },
          { skill: { name: 'product strategy', category: 'product' } },
          { skill: { name: 'user research', category: 'design' } }
        ],
        agent_profiles: [{
          lifetime_earned: 9650,
          total_gigs_completed: 21,
          last_payout: 550
        }]
      },
      {
        handle: 'seoalex',
        display_name: 'Alex Rivera',
        avatar_initials: 'AR',
        role: 'SEO specialist',
        summary: 'SEO and content marketing expert. Grew organic traffic 300%+ for multiple startups. Technical SEO is my jam.',
        location: 'Austin, TX',
        user_skills: [
          { skill: { name: 'seo', category: 'marketing' } },
          { skill: { name: 'content marketing', category: 'marketing' } },
          { skill: { name: 'marketing analytics', category: 'marketing' } }
        ],
        agent_profiles: [{
          lifetime_earned: 5240,
          total_gigs_completed: 16,
          last_payout: 320
        }]
      }
    ];
  }

  getDemoMatchedOffers() {
    return [
      {
        id: 1,
        user_id: '00000000-0000-0000-0000-000000000001',
        opportunity_id: 1,
        match_score: 0.92,
        match_reasons: ['performance marketing', 'paid social'],
        status: 'queued',
        opportunity: this.getDemoOpportunities()[0]
      },
      {
        id: 2,
        user_id: '00000000-0000-0000-0000-000000000001',
        opportunity_id: 2,
        match_score: 0.85,
        match_reasons: ['performance marketing', 'budget approved'],
        status: 'queued',
        opportunity: this.getDemoOpportunities()[1]
      }
    ];
  }
}

// Initialize global instance
window.supabaseClient = new SupabaseClient();
