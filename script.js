
/* ---------- Utilities ---------- */
function qs(sel, el=document){ return el.querySelector(sel); }
function qsa(sel, el=document){ return Array.from(el.querySelectorAll(sel)); }
function toast(msg, t=2200){ const n=document.createElement('div'); n.className='toast'; n.textContent=msg; document.body.appendChild(n); requestAnimationFrame(()=>n.classList.add('show')); setTimeout(()=>{ n.classList.remove('show'); setTimeout(()=>n.remove(), 320); }, t); }
function track(event, props={}){ const now=new Date().toISOString(); const payload={event, props, ts:now}; console.log('[track]', payload); const k='opento_events'; const list=JSON.parse(localStorage.getItem(k)||'[]'); list.push(payload); localStorage.setItem(k, JSON.stringify(list)); }

const demoAgent = {
  displayName: 'Maya Chen',
  handle: 'growthmaya',
  avatar: 'MC',
  role: 'Performance marketing lead for consumer apps',
  summary: 'Runs acquisition & lifecycle experiments for subscription and marketplace brands. Former Looply growth lead; now fractional.',
  location: 'Austin, TX (CT)',
  availability: 'Mon–Thu • 11a–4p CT',
  linkedinUrl: 'https://www.linkedin.com/in/mayachen',
  rulesSummary: 'Anonymous first • $75/30m floor • Prefers async briefs before live calls',
  focusAreas: [
    'Acquisition & lifecycle experiments for subscription apps',
    'Paid social creative testing + reporting automation',
    'Attribution clean-up across Meta, Google, and TikTok'
  ],
  openTo: [
    'Fractional growth engagements (8–12 hrs/week)',
    'One-off performance audits & playbooks',
    'Micro tasks: ad creative scoring, copy polish, tagging datasets',
    'Labeling: paid social hooks, funnel QA, event taxonomy clean-up'
  ],
  recentWins: [
    'Cut blended CAC by 22% for Looply with a two-week creative sprint.',
    'Grew trial-to-paid by 18% for Pollinate Labs via lifecycle rebuild.',
    'Stabilized attribution across Meta + Google + TikTok for a marketplace launch.'
  ],
  socialProof: [
    'Managed $3.2M/yr in spend',
    'Meta Blueprint certified',
    'Ex-Looply growth lead',
    'Preferred vendor for three YC startups'
  ],
  activity: { scanned: 48, blocked: 16, ready: 2 },
  onboarding: { floor: 75, microFloor: 12, hours: 6, window: 'Mon–Thu 11a–4p CT' },
  quickStartDescription: 'Default rules tuned for performance marketers: Growth audits + creative QA ON, $75/30m consult floor, $12/5m async sprints, Mon–Thu 11a–4p CT, Anonymous first, Auto-accept fast async tasks.',
  share: {
    headline: 'My agent kept campaigns warm overnight.',
    subheadline: '3 automation sprints closed while I slept.',
    value: 284,
    footer: 'Opento — Anonymous first • Instant payouts',
    linkSlug: 'growthmaya',
    caption: 'Maya Chen\'s agent shipped 3 growth cleanups overnight: +$284 while she slept. Powered by Opento.'
  },
  digest: {
    earned: 284,
    scanned: 48,
    autoDeclined: 16,
    queued: 3,
    streak: '4 weeks with a payout',
    nextAction: 'Enable creative QA auto-accept for +2 offers/week'
  },
  requestIntro: {
    pitch: 'Maya is open to fractional growth engagements, 30-minute consults, and async creative QA work that clears the rules below.',
    guidelines: [
      'Share the goal or KPI (e.g., CAC target, trial-to-paid conversion).',
      'Summarize current channel mix, spend pace, and biggest blockers.',
      'Add decision-maker + timeline so the Rep can route quickly.',
      'Include budget guardrails for consulting, retainers, or async sprints.'
    ],
    template: [
      'Goal: Cut CAC on Meta by 20% before Q2 launch.',
      'Channel mix: Meta 60%, Google 25%, TikTok 15%.',
      'Budget/SLA: $8k creative sprint over 4 weeks. Decision-maker: Jenna (VP Growth).'
    ].join('\n'),
    note: 'Rep replies within 1 business day. Identity reveals only after accept + escrow.'
  },
  referral: {
    offer: 'Invite a teammate to a fast CAC cleanup. You both receive $25 once they clear their first payout.'
  }
};

function formatUsd(value){
  const num = Number(value || 0);
  if(Number.isNaN(num)) return '$0';
  return '$' + num.toLocaleString();
}

function setText(selector, value){
  const el = qs(selector);
  if(el) el.textContent = value;
  return el;
}

/* ---------- Hero animations ---------- */
const phrases = ["paid research", "micro‑tasks", "relevant roles", "approved data slices"];
function typeWriter(el, arr=phrases, speed=55, hold=1300){
  let i=0, j=0, erasing=false;
  function tick(){
    if(!el) return;
    const word = arr[i%arr.length];
    if(!erasing){
      j++; el.textContent = word.slice(0,j);
      if(j === word.length){ erasing = true; setTimeout(tick, hold); return; }
    }else{
      j--; el.textContent = word.slice(0,j);
      if(j === 0){ erasing = false; i++; }
    }
    setTimeout(tick, erasing ? speed*0.6 : speed);
  }
  tick();
}
function startTicker(){
  const lines = qsa('.ticker .line'); let idx=0;
  function show(){ lines.forEach(l=>l.classList.remove('show')); lines[idx%lines.length].classList.add('show'); idx++; }
  show(); setInterval(show, 2200);
}
function spawnPings(){
  const r = qs('.radar'); if(!r) return;
  function addPing(){ const p=document.createElement('div'); p.className='ping';
    const x=Math.random()*80+10, y=Math.random()*80+10; p.style.left=x+'%'; p.style.top=y+'%';
    r.appendChild(p); setTimeout(()=>p.remove(), 2600); }
  setInterval(addPing, 700);
}

/* ---------- Overlay (Earnings Assessment) ---------- */
function testDriveInit(){
  // Reuse id hooks for compatibility, but implement assessment UX
  const openBtn = qs('#testDrive');
  const ov = qs('#testOverlay'); if(!openBtn || !ov) return;
  const hours = qs('#assHours'); const hoursVal = qs('#assHoursVal');
  const yearsSel = qs('#assYears');
  const skillsInput = qs('#assSkills');
  const locInput = qs('#assLocation');
  const ln = qs('#assLinkedIn'); const tw = qs('#assTwitter'); const ig = qs('#assInstagram');
  const calcBtn = qs('#assCalc');
  const estOut = qs('#assEstimate'); const rangeOut = qs('#assRange');
  let lastFocused=null;
  function updateHours(){ if(hoursVal && hours){ hoursVal.textContent = `${hours.value} hrs`; } }
  hours?.addEventListener('input', updateHours); updateHours();

  function isValidUrl(u){ if(!u) return true; try{ const x=new URL(u); return /^https?:$/.test(x.protocol); }catch(e){ return false; } }
  function normalizeSkills(raw){
    return raw.split(/[.,;\n]+|\s*,\s*/).map(s=>s.trim().toLowerCase()).filter(Boolean);
  }
  function validate(){
    const skillsRaw = (skillsInput?.value || '').trim();
    const hasSkills = normalizeSkills(skillsRaw).length > 0;
    const urlsOk = [ln?.value, tw?.value, ig?.value].every(isValidUrl);
    const ok = hasSkills && urlsOk;
    if(calcBtn){ calcBtn.disabled = !ok; calcBtn.classList.toggle('gray', !ok); }
    return ok;
  }
  [skillsInput, ln, tw, ig].forEach(el=> el?.addEventListener('input', validate));
  validate();

  function calc(){
    if(!validate()){ toast('Add at least one skill and fix URL format'); return; }
    const years = Number(yearsSel?.value || 6);
    const skillsRaw = (skillsInput?.value || '').trim();
    const skills = skillsRaw ? skillsRaw.split(/[.,;\n]+|\s*,\s*/).filter(Boolean) : [];
    const loc = (locInput?.value || '').toLowerCase();
    const age = Number(qs('#assAge')?.value || 0); // optional, not weighted directly
    const hasLinkedIn = !!(ln?.value || '').trim();
    const hasTwitter = !!(tw?.value || '').trim();
    const hasInstagram = !!(ig?.value || '').trim();
    const hrs = Number(hours?.value || 6);

    // ---------- Realistic rubric ----------
    // Experience baseline
    let baseHr = 25 + years * 3; // grows slower
    baseHr = Math.max(30, Math.min(baseHr, 140));

    // Recognized skills tiers
    const text = skills.join(' ').toLowerCase();
    const highTier = ['engineering','ai','ml','data science','strategy'];
    const coreTier = ['performance marketing','paid social','growth','product management','ux','design','seo','sem','email','lifecycle','content','analytics','copywriting','sales'];
    let skillScore = 0;
    coreTier.forEach(k=>{ if(text.includes(k)) skillScore += 4; });
    highTier.forEach(k=>{ if(text.includes(k)) skillScore += 6; });
    skillScore = Math.min(skillScore, 30);

    // Social presence (trust)
    const socialBoost = Math.min(10, (hasLinkedIn?6:0) + (hasTwitter?2:0) + (hasInstagram?2:0));

    // Geo coefficient
    const tier1 = /(san francisco|sf|new york|nyc|seattle|london)/;
    const tier2 = /(austin|los angeles|la|boston|denver|berlin|toronto|chicago)/;
    const geoCoef = tier1.test(loc) ? 1.15 : tier2.test(loc) ? 1.07 : 1.0;

    // Utilization factor from hours (fewer hours → less compounding)
    const util = hrs >= 12 ? 1.0 : hrs >= 8 ? 0.9 : hrs >= 4 ? 0.8 : 0.7;

    const hourly = (baseHr + skillScore + socialBoost) * geoCoef;
    const monthly = Math.round(hourly * Math.max(0, hrs) * 4 * util * 1.05);

    if(estOut){ estOut.textContent = `${formatUsd(monthly)} / mo`; }
    if(rangeOut){ const lo=Math.round(monthly*0.8), hi=Math.round(monthly*1.2); rangeOut.textContent = `Typical range ${formatUsd(lo)}–${formatUsd(hi)}`; rangeOut.title = 'Assumes all automations on, steady weekly hours, and healthy match rates.'; }
    const payload = { years, skills: skills.map(s=>s.toLowerCase()), loc, hrs, hasLinkedIn, hasTwitter, hasInstagram, estMonthly: monthly };
    localStorage.setItem('opento_assessment', JSON.stringify(payload));
    track('Assessment Calculated', { years, skills: skills.length, hasLinkedIn, hasTwitter, hasInstagram, hrs, loc, ageProvided: !!age });
  }

  function prefill(){
    try{
      const saved = JSON.parse(localStorage.getItem('opento_assessment')||'{}');
      if(saved.years && yearsSel) yearsSel.value = String(saved.years);
      if(saved.loc && locInput) locInput.value = saved.loc;
      if(saved.hrs && hours){ hours.value = String(saved.hrs); updateHours(); }
      if(saved.skills && skillsInput) skillsInput.value = Array.isArray(saved.skills) ? saved.skills.join(', ') : saved.skills;
    }catch(e){ /* ignore */ }
  }

  function trapFocus(elems){
    function onKeydown(e){
      if(e.key==='Escape'){ e.preventDefault(); close(); }
      if(e.key!=='Tab') return;
      const first = elems[0], last = elems[elems.length-1];
      if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } }
      else { if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
    }
    ov.addEventListener('keydown', onKeydown);
    return ()=> ov.removeEventListener('keydown', onKeydown);
  }
  let untrap = null;
  function open(){
    prefill(); ov.style.display='flex'; validate(); track('Assessment Opened'); lastFocused=document.activeElement; setTimeout(()=>{
      const focusables = qsa('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])', ov).filter(el=> !el.disabled && el.offsetParent!==null);
      focusables[0]?.focus(); untrap = trapFocus(focusables);
    },0);
  }
  function close(){ ov.style.display='none'; if(untrap) untrap(); if(lastFocused && lastFocused.focus) lastFocused.focus(); }

  openBtn.addEventListener('click', open);
  qs('#assCalc')?.addEventListener('click', calc);
  qs('#testDriveClose')?.addEventListener('click', close);
  // Prefill onboarding when CTA clicked
  qs('#assConfigure')?.addEventListener('click', ()=>{
    if(!localStorage.getItem('opento_assessment')){ calc(); }
    track('Assessment Configure Clicked');
  });

  // Auto-recalculate when valid inputs change
  [yearsSel, skillsInput, locInput, hours].forEach(el=> el?.addEventListener('input', ()=>{ if(validate()) calc(); }));
}

/* ---------- Onboarding ---------- */
function calculateEarningsEstimate(){
  // Get all form values
  const seniorityLevel = qs('#seniorityLevel')?.value || 'Senior';
  // Derive years from seniority
  const yearsMap = { 'Junior': 2, 'Mid': 4, 'Senior': 8, 'Lead': 12, 'Executive': 18 };
  const years = yearsMap[seniorityLevel] || 6;
  
  const location = (qs('#location')?.value || '').toLowerCase();
  const skills = (qs('#skills')?.value || '').toLowerCase();
  const hasLinkedIn = !!(qs('#linkedin')?.value || '').trim();
  const hasTwitter = !!(qs('#twitter')?.value || '').trim();
  const hasInstagram = !!(qs('#instagram')?.value || '').trim();
  const hours = Number(qs('#hours')?.value || 6);
  const floorVal = Number(qs('#floor')?.value || 75);
  const microVal = Number(qs('#microfloor')?.value || 12);

  // Calculate base hourly rate from experience
  let baseHr = 25 + years * 3;
  baseHr = Math.max(30, Math.min(baseHr, 140));

  // Skill scoring
  const highTier = ['engineering','ai','ml','data science','strategy'];
  const coreTier = ['performance marketing','paid social','growth','product management','ux','design','seo','sem','email','lifecycle','content','analytics','copywriting','sales'];
  let skillScore = 0;
  coreTier.forEach(k=>{ if(skills.includes(k)) skillScore += 4; });
  highTier.forEach(k=>{ if(skills.includes(k)) skillScore += 6; });
  skillScore = Math.min(skillScore, 30);

  // Social presence boost
  const socialBoost = Math.min(10, (hasLinkedIn?6:0) + (hasTwitter?2:0) + (hasInstagram?2:0));

  // Geographic coefficient
  const tier1 = /(san francisco|sf|new york|nyc|seattle|london)/;
  const tier2 = /(austin|los angeles|la|boston|denver|berlin|toronto|chicago)/;
  const geoCoef = tier1.test(location) ? 1.15 : tier2.test(location) ? 1.07 : 1.0;

  // Utilization factor
  const util = hours >= 12 ? 1.0 : hours >= 8 ? 0.9 : hours >= 4 ? 0.8 : 0.7;

  // Get enabled categories
  const enabled = qsa('.wizard .switch.on').map(sw=> sw.dataset.label).filter(Boolean);
  const consultEnabled = ['Growth audits','Campaign optimization','Fractional retainers'].some(lbl=> enabled.includes(lbl));
  const microEnabled = enabled.includes('Data labeling');

  const consultRateHr = floorVal * 2;
  const microRateHr = microVal * 12;
  let blendedRate = 0;
  if(consultEnabled && microEnabled){ blendedRate = consultRateHr*0.6 + microRateHr*0.4; }
  else if(consultEnabled){ blendedRate = consultRateHr; }
  else if(microEnabled){ blendedRate = microRateHr; }
  else { blendedRate = Math.max(consultRateHr, microRateHr) * 0.6; }

  const hourly = (baseHr + skillScore + socialBoost) * geoCoef;
  const finalRate = Math.max(hourly, blendedRate * 0.8); // Use higher of profile-based or rate-based
  const monthly = Math.round(finalRate * Math.max(0, hours) * 4 * util * 1.05);

  return monthly;
}

function updateOnboardingPreview(currentStep){
  if(!qs('.wizard')) return;

  // Get current step from visible step if not provided
  if(typeof currentStep === 'undefined'){
    const visibleStep = qs('.wizard .step[style*="display: block"], .wizard .step:not([style*="display: none"])');
    currentStep = visibleStep ? Number(visibleStep.dataset.step || 1) : 1;
  }

  // Update profile preview
  const years = qs('#years')?.value;
  const location = qs('#location')?.value;
  const skills = qs('#skills')?.value;

  if(years){
    const yearsText = years === '0' ? 'Starting out' : years === '20' ? '20+ years exp.' : `${years} years exp.`;
    setText('#previewYears', yearsText);
  }
  if(location){
    setText('#previewLocation', location);
  }
  if(skills){
    const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
    const skillsEl = qs('#previewSkills');
    if(skillsEl){
      skillsEl.innerHTML = skillsList.length
        ? skillsList.map(s => `<div class="chip small">${s}</div>`).join('')
        : '';
    }
  }

  // Update rates
  const floorVal = Number(qs('#floor')?.value || 75);
  const microVal = Number(qs('#microfloor')?.value || 12);
  const hoursVal = Number(qs('#hours')?.value || 6);
  const windowVal = qs('#autoWindow')?.value || 'Mon–Thu 11a–4p CT';

  setText('#floorVal', formatUsd(floorVal));
  setText('#microVal', formatUsd(microVal));
  setText('#hoursVal', `${hoursVal} hrs / week`);

  setText('#previewFloor', `${formatUsd(floorVal)} / 30m`);
  setText('#previewMicro', `${formatUsd(microVal)} / 5m`);
  setText('#previewHours', `${hoursVal} hrs / week`);
  setText('#previewWindow', windowVal);

  // Update categories - hide until user reaches step 4
  const enabled = qsa('.wizard .switch.on').map(sw=> sw.dataset.label).filter(Boolean);
  const categoriesEl = qs('#previewCategories');
  if(categoriesEl){
    if(currentStep < 4){
      categoriesEl.innerHTML = '';
    } else {
      categoriesEl.innerHTML = enabled.length
        ? enabled.map(c => `<div class="chip">${c}</div>`).join('')
        : '<div class="small muted">Select categories in step 4</div>';
    }
  }

  // Update earnings estimate - show from step 3 onward
  const estimate = calculateEarningsEstimate();
  const estNode = qs('#previewEstimate');
  const estNodeInStep = qs('#earningsEstimate');
  const estCard = estNode?.closest('.preview-card-highlight');

  // Show/hide estimate card based on current step
  if(estCard){
    if(currentStep < 3){
      estCard.style.display = 'none';
    } else {
      estCard.style.display = 'block';
    }
  }

  const animateValue = (node) => {
    if(!node) return;
    const prev = Number(node.dataset.val || 0);
    const dur = 500;
    const t0 = performance.now();
    function tick(t){
      const p = Math.min(1, (t - t0) / dur);
      const cur = Math.round(prev + (estimate - prev) * p);
      node.textContent = formatUsd(cur);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    node.dataset.val = String(estimate);
  };

  // Animate if on step 3 or later
  if(currentStep >= 3){
    animateValue(estNode);
    animateValue(estNodeInStep);
  }
}

function bindSwitches(){
  qsa('.wizard .switch').forEach(sw=>{
    const label = sw.dataset.label || 'option';
    const setState = (on)=>{
      sw.classList.toggle('on', on);
      sw.setAttribute('aria-checked', on);
      // Update parent card active state
      const card = sw.closest('.option-card');
      if(card){
        card.classList.toggle('active', on);
      }
    };
    setState(sw.classList.contains('on'));
    sw.setAttribute('role', 'switch');
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('aria-label', `${label} toggle`);

    const toggle = ()=>{
      const next = !sw.classList.contains('on');
      setState(next);
      track('Onboarding Toggle', {label, on: next});
      updateOnboardingPreview();
    };

    sw.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggle();
    });
    sw.addEventListener('keypress', (e)=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        toggle();
      }
    });

    // Make option-card clickable
    const card = sw.closest('.option-card');
    if(card){
      card.addEventListener('click', ()=>{
        toggle();
      });
    }
  });
}

function linkedinInit(){
  const signInBtn = qs('#linkedinSignIn');
  const skipBtn = qs('#linkedinSkip');
  const statusDiv = qs('#linkedinStatus');
  const userNameEl = qs('#linkedinUserName');

  // Check if already connected
  const linkedinData = JSON.parse(localStorage.getItem('opento_linkedin') || 'null');
  if(linkedinData && linkedinData.connected){
    // Show connected state
    if(statusDiv) statusDiv.style.display = 'block';
    if(userNameEl) userNameEl.textContent = linkedinData.name || 'Connected';
    if(signInBtn) signInBtn.style.display = 'none';
    if(skipBtn) skipBtn.textContent = 'Continue';
  }

  if(signInBtn){
    signInBtn.addEventListener('click', ()=>{
      track('LinkedIn Sign In Clicked', {});
      // Mock OAuth flow - in production this would redirect to LinkedIn OAuth
      // For now, simulate a successful auth
      toast('Connecting to LinkedIn...');

      // Simulate API delay
      setTimeout(()=>{
        // Mock user data - in production this would come from LinkedIn API
        const mockLinkedinData = {
          connected: true,
          name: 'Demo User',
          profileUrl: 'https://linkedin.com/in/demo',
          headline: 'Marketing Professional',
          // These would be extracted from actual LinkedIn profile
          experience: [],
          education: [],
          skills: []
        };

        localStorage.setItem('opento_linkedin', JSON.stringify(mockLinkedinData));

        // Update UI
        if(statusDiv) statusDiv.style.display = 'block';
        if(userNameEl) userNameEl.textContent = mockLinkedinData.name;
        if(signInBtn) signInBtn.style.display = 'none';
        if(skipBtn) skipBtn.textContent = 'Continue';

        toast('✓ LinkedIn connected successfully');
        track('LinkedIn Connected', {method: 'oauth'});
      }, 1000);
    });
  }

  if(skipBtn){
    skipBtn.addEventListener('click', ()=>{
      const linkedinData = JSON.parse(localStorage.getItem('opento_linkedin') || 'null');
      const isConnected = linkedinData && linkedinData.connected;

      track('LinkedIn Step Action', {action: isConnected ? 'continue' : 'skip'});

      // Move to next step
      const steps = qsa('.wizard .step');
      const currentStep = Array.from(steps).findIndex(s => s.style.display !== 'none');
      if(currentStep !== -1){
        const nextBtn = steps[currentStep].querySelector('[data-next]');
        if(nextBtn){
          nextBtn.click();
        } else {
          // Manual navigation
          steps[currentStep].style.display = 'none';
          if(steps[currentStep + 1]){
            steps[currentStep + 1].style.display = 'block';
            const ind = qs('.step-indicator');
            if(ind) ind.textContent = `Step ${currentStep + 2} of ${steps.length}`;
            const bar = qs('.progress .bar');
            if(bar){
              const pct = steps.length > 1 ? (currentStep + 1) / (steps.length - 1) : 1;
              bar.style.width = `${pct * 100}%`;
            }
          }
        }
      }
    });
  }
}

function skillsTagsInit(){
  const skillsInput = qs('#skillsInput');
  const skillsHidden = qs('#skills');
  const skillsChips = qs('#skillsChips');
  if(!skillsInput || !skillsHidden || !skillsChips) return;

  let skills = [];

  function updateSkills(){
    skillsHidden.value = skills.join(', ');
    renderChips();
    updateOnboardingPreview();
  }

  function renderChips(){
    skillsChips.innerHTML = skills.length === 0
      ? '<div class="small muted" style="color: #94a3b8; padding: 4px 0;">No skills added yet</div>'
      : skills.map((skill, idx) => `
          <div class="chip" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f1f5f9; border-radius: 16px; font-size: 14px;">
            <span>${skill}</span>
            <button type="button" onclick="removeSkill(${idx})" style="background: none; border: none; cursor: pointer; padding: 0; margin: 0; color: #64748b; font-size: 16px; line-height: 1; font-weight: bold;" aria-label="Remove ${skill}">×</button>
          </div>
        `).join('');
  }

  // Make removeSkill globally accessible for onclick handler
  window.removeSkill = function(idx){
    skills.splice(idx, 1);
    updateSkills();
  };

  function addSkill(skillText){
    const trimmed = skillText.trim().toLowerCase();
    if(trimmed && !skills.includes(trimmed)){
      skills.push(trimmed);
      updateSkills();
    }
    skillsInput.value = '';
  }

  // Handle Enter and comma keys
  skillsInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      const value = skillsInput.value.trim();
      if(value){
        addSkill(value);
      }
    }
  });

  // Handle blur
  skillsInput.addEventListener('blur', ()=>{
    const value = skillsInput.value.trim();
    if(value){
      setTimeout(()=> addSkill(value), 150); // Small delay to allow datalist selection
    }
  });

  // Initialize with empty state
  updateSkills();
}

function wizardInit(){
  const steps = qsa('.wizard .step'); if(steps.length===0) return;
  let idx=0;

  function validateStep(stepIndex){
    if(stepIndex === 0){
      // Step 1: Validate required fields
      const years = qs('#years')?.value;
      const location = qs('#location')?.value;
      const skills = qs('#skills')?.value;

      if(!years || !location || !skills || skills.trim().length === 0){
        toast('Please fill in all required fields');
        return false;
      }
    }
    // URL validation for step 2
    if(stepIndex === 1){
      const linkedin = qs('#linkedin')?.value;
      const twitter = qs('#twitter')?.value;
      const instagram = qs('#instagram')?.value;

      const isValidUrl = (u) => {
        if(!u || u.trim() === '') return true; // optional fields
        try{ const x=new URL(u); return /^https?:$/.test(x.protocol); }catch(e){ return false; }
      };

      if(!isValidUrl(linkedin) || !isValidUrl(twitter) || !isValidUrl(instagram)){
        toast('Please enter valid URLs (or leave blank)');
        return false;
      }
    }
    return true;
  }

  function show(i){
    idx=Math.max(0,Math.min(i,steps.length-1));
    steps.forEach((s,k)=>s.style.display = (k===idx?'block':'none'));
    const ind=qs('.step-indicator'); if(ind) ind.textContent = `Step ${idx+1} of ${steps.length}`;
    const bar=qs('.progress .bar'); if(bar){ const pct = steps.length>1 ? (idx)/(steps.length-1) : 1; bar.style.width = `${pct*100}%`; }
    // Pass current step (1-indexed) to preview update
    updateOnboardingPreview(idx + 1);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  qsa('[data-next]').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(validateStep(idx)){
        show(idx+1);
        track('Onboarding Next', {step: idx+1});
      }
    });
  });

  qsa('[data-back]').forEach(b=>b.addEventListener('click', ()=> show(idx-1)));
  qsa('[data-finish]').forEach(b=>b.addEventListener('click', ()=>{ saveOnboardingData(); startAgent('custom'); }));

  // Bind input listeners for real-time updates
  qs('#years')?.addEventListener('change', updateOnboardingPreview);
  qs('#location')?.addEventListener('input', updateOnboardingPreview);
  qs('#linkedin')?.addEventListener('input', updateOnboardingPreview);
  qs('#twitter')?.addEventListener('input', updateOnboardingPreview);
  qs('#instagram')?.addEventListener('input', updateOnboardingPreview);
  qs('#hours')?.addEventListener('input', updateOnboardingPreview);
  qs('#floor')?.addEventListener('input', updateOnboardingPreview);
  qs('#microfloor')?.addEventListener('input', updateOnboardingPreview);
  qs('#autoWindow')?.addEventListener('change', updateOnboardingPreview);

  skillsTagsInit();
  bindSwitches();
  show(0);
}

function saveOnboardingData(){
  const data = {
    years: qs('#years')?.value,
    location: qs('#location')?.value,
    skills: (qs('#skills')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
    linkedin: qs('#linkedin')?.value,
    twitter: qs('#twitter')?.value,
    instagram: qs('#instagram')?.value,
    hours: Number(qs('#hours')?.value || 6),
    floor: Number(qs('#floor')?.value || 75),
    microfloor: Number(qs('#microfloor')?.value || 12),
    window: qs('#autoWindow')?.value,
    categories: qsa('.wizard .switch.on').map(sw=> sw.dataset.label).filter(Boolean),
    anon: qsa('.wizard .switch[data-label="Anonymous first"]')[0]?.classList.contains('on'),
    consent: qsa('.wizard .switch[data-label="Consent reminders"]')[0]?.classList.contains('on')
  };

  localStorage.setItem('opento_profile', JSON.stringify(data));
  track('Onboarding Completed', {
    years: data.years,
    skills: data.skills.length,
    categories: data.categories.length,
    hasLinkedIn: !!data.linkedin,
    hasTwitter: !!data.twitter,
    hasInstagram: !!data.instagram
  });
}
function startAgent(path){
  localStorage.setItem('opento_agent_started', '1');
  localStorage.setItem('opento_first_time', '1');
  if(path==='quick'){
    const defaults = {
      audits:true,
      creativeQA:true,
      retainers:true,
      labeling:true,
      floor30: demoAgent.onboarding.floor,
      micro5: demoAgent.onboarding.microFloor,
      window: demoAgent.onboarding.window,
      anon:true,
      autoFast:true
    };
    localStorage.setItem('opento_defaults', JSON.stringify(defaults));
  }
  track('Agent Started', {path});
  toast('🎉 Agent started with your rules'); setTimeout(()=> window.location.href='inbox.html?tab=micro', 900);
}
function quickStartInit(){
  const quick = qs('#quickStart'); if(!quick) return;
  quick.addEventListener('click', ()=> startAgent('quick'));
  setText('#quickStartDesc', demoAgent.quickStartDescription);
  // goal meter demo
  const fill = qs('.goal .fill'); if(fill){ let p=0; const iv=setInterval(()=>{ p+=20; if(p>=80){ clearInterval(iv); } fill.style.width=p+'%'; }, 400); }
}

/* ---------- Inbox ---------- */
let confettiCtx=null, confettiParts=[];
function confettiInit(){
  const c = document.createElement('canvas'); c.id='confetti'; document.body.appendChild(c); const ctx=c.getContext('2d'); confettiCtx=ctx;
  function resize(){ c.width=window.innerWidth; c.height=window.innerHeight; } window.addEventListener('resize', resize); resize();
  function loop(){ requestAnimationFrame(loop); drawConfetti(); } loop();
}
function addConfetti(x,y){ for(let i=0;i<60;i++){ confettiParts.push({ x:x+(Math.random()*40-20), y:y+(Math.random()*10-5), s: Math.random()*6+3, a: Math.random()*Math.PI*2, v: Math.random()*2+1, life: Math.random()*60+50, color: `hsl(${Math.random()*360},80%,60%)` }); } }
function drawConfetti(){ if(!confettiCtx) return; const ctx=confettiCtx; ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); confettiParts.forEach(p=>{ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.color; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s); ctx.restore(); p.y+=p.v; p.a+=0.05; p.life-=1; }); confettiParts = confettiParts.filter(p=>p.life>0); }

function applyCategoryFromQuery(){
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') || 'all';
  qsa('.menu a').forEach(a=>{ const t=a.dataset.tab||'all'; a.classList.toggle('active', t===tab); });
  filterOffers(tab, qs('.search input')?.value || '');
}

function filterOffers(category, search){
  qsa('.offer').forEach(card=>{
    const cat = card.dataset.cat || 'other';
    const text = (card.textContent||'').toLowerCase();
    const showCat = (category==='all' || category===cat);
    const showText = (!search || text.includes(search.toLowerCase()));
    card.style.display = (showCat && showText) ? 'grid' : 'none';
  });
}

function getBalance(){ return Number(localStorage.getItem('opento_balance')|| String(demoAgent.lifetimeEarned)); }
function setBalance(v){
  const num = Number(v||0);
  localStorage.setItem('opento_balance', String(num));
  const el=qs('#balanceVal'); if(el){ el.textContent = formatUsd(num); }
}

function parsePayoutFromCard(card){
  const meta = card.querySelector('.meta')?.textContent || '';
  // try to find $X/.. or $X/hr
  const m = meta.match(/\$(\d+)(?:\/\d+m|\/hr)?/);
  if(m){ const val = Number(m[1]); const isMicro = /\/5m/.test(meta) || /5‑?min/i.test(card.textContent);
  if(/\/30m/.test(meta)) return Math.round(val); // treat $35/30m as $35
  if(isMicro) return Math.round(val); // $4/5m -> treat as $4 payout
  return Math.round(val); }
  return 4;
}

function showShareModal(value){
  const m = qs('#shareModal'); if(!m) return;
  qs('#shareVal').textContent = formatUsd(value);
  m.style.display='flex';
}
function closeShareModal(){ qs('#shareModal').style.display='none'; }
function dlShareCard(){
  const valNode = qs('#shareVal');
  const raw = valNode ? valNode.textContent.replace(/[^\d.]/g,'') : '';
  const url = `share.html?v=${encodeURIComponent(raw)}&handle=${demoAgent.handle}`;
  window.location.href = url;
  track('Receipt Viewed', {});
}

function inboxInit(){
  confettiInit();
  applyCategoryFromQuery();
  setBalance(getBalance());
  const search = qs('.search input');
  if(search){ search.addEventListener('input', ()=> filterOffers(new URLSearchParams(location.search).get('tab')||'all', search.value)); }
  qsa('.menu a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault(); const tab=a.dataset.tab||'all';
      const url = new URL(window.location); url.searchParams.set('tab', tab); history.replaceState({}, '', url);
      applyCategoryFromQuery();
    });
  });

  // Activity header
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo');
  const act = qs('.activity');
  if(act){
    const base = demoAgent.activity;
    const scanned = demo ? base.scanned + 6 : base.scanned;
    const blocked = demo ? base.blocked + 2 : base.blocked;
    const ready = base.ready;
    const readyText = ready === 1 ? '1 high-intent intro ready' : `${ready} high-intent intros ready`;
    act.innerHTML = `<div>Scout scanned <span class="strong">${scanned}</span> briefs • Rep filtered out <span class="strong">${blocked}</span></div><div class="small">${readyText}</div>`;
  }

  // First-time mode: highlight first micro fast payout
  const firstTime = localStorage.getItem('opento_first_time')==='1' && localStorage.getItem('opento_first_payout')!=='1';
  const fast = qs('.offer[data-fast="1"]');
  if(firstTime && fast){
    fast.classList.add('first-time');
    const pri = fast.querySelector('.btn.accept'); if(pri){ pri.textContent='Accept & reserve'; }
    fast.scrollIntoView({behavior:'smooth', block:'center'});
    fast.querySelector('input[type="checkbox"]').checked = true;
  }

  // per-offer interactions
  qsa('.offer').forEach(card=>{
    const accept = card.querySelector('.btn.accept'); const decline = card.querySelector('.btn.decline');
    const state = card.querySelector('.state'); const reveal = card.querySelector('.reveal');
    const details = card.querySelector('.btn.details'); const modal = qs('#offerModal'); const close = qs('#offerModal .close');
    const cb = card.querySelector('input[type="checkbox"]');

    if(accept){
      accept.addEventListener('click', (e)=>{
        const payout = parsePayoutFromCard(card);
        state.textContent='Accepted'; state.className='state accepted';
        if(reveal){ reveal.classList.add('visible'); }
        const r=e.target.getBoundingClientRect(); addConfetti(r.left, r.top);
        // Balance count-up
        const start = getBalance(); const end = start + payout; const dur=800; const t0=performance.now();
        function anim(t){ const p=Math.min(1, (t-t0)/dur); const val = Math.round(start + (end-start)*p); setBalance(val); if(p<1) requestAnimationFrame(anim); }
        requestAnimationFrame(anim);
        localStorage.setItem('opento_first_payout', '1');
        toast(`Offer accepted • +$${payout} on completion`);
        showShareModal(payout);
        track('Offer Accepted', {value:payout});
      });
    }
    if(decline){
      decline.addEventListener('click', ()=>{
        state.textContent='Declined'; state.className='state declined';
        toast('Offer declined');
        // Suggestions seed (simple heuristic)
        const reason = (card.textContent.includes('Outside hours')) ? 'outside_hours' : 'other';
        const k='opento_suggestions'; const list=JSON.parse(localStorage.getItem(k)||'[]'); list.push(reason); localStorage.setItem(k, JSON.stringify(list));
        track('Offer Declined', {reason});
      });
    }
    if(details){ details.addEventListener('click', ()=>{ if(modal) modal.style.display='flex'; }); }
    if(close){ close.addEventListener('click', ()=> modal.style.display='none'); qs('#offerModal').addEventListener('click',(e)=>{ if(e.target.id==='offerModal'){ e.currentTarget.style.display='none'; }}); }
    if(cb){ cb.addEventListener('change', updateSelectionCount); }
  });

  // bulk actions
  const selAll = qs('#selAll'); if(selAll){ selAll.addEventListener('change', ()=>{ qsa('.offer input[type="checkbox"]').forEach(c=> c.checked = selAll.checked && c.closest('.offer').style.display!=='none'); updateSelectionCount(); }); }
  qs('#bulkAccept')?.addEventListener('click', ()=> bulkAction('accept'));
  qs('#bulkDecline')?.addEventListener('click', ()=> bulkAction('decline'));
}

function updateSelectionCount(){
  const visible = qsa('.offer').filter(o=> o.style.display !== 'none');
  const selected = visible.filter(o=> o.querySelector('input[type="checkbox"]').checked);
  qs('#selCount').textContent = selected.length;
}
function bulkAction(type){
  const visible = qsa('.offer').filter(o=> o.style.display !== 'none');
  const selected = visible.filter(o=> o.querySelector('input[type="checkbox"]').checked);
  if(selected.length===0){ toast('No selected offers'); return; }
  selected.forEach(card=>{
    const state = card.querySelector('.state'); const reveal = card.querySelector('.reveal');
    if(type==='accept'){ state.textContent='Accepted'; state.className='state accepted'; if(reveal) reveal.classList.add('visible'); }
    if(type==='decline'){ state.textContent='Declined'; state.className='state declined'; }
  });
  toast(`${type==='accept'?'Accepted':'Declined'} ${selected.length} offer(s)`);
}

/* ---------- Recipes builder (with advanced toggle + suggestions) ---------- */
function getRecipes(){ try{ return JSON.parse(localStorage.getItem('opento_recipes')||'[]'); }catch(e){ return []; } }
function saveRecipes(list){ localStorage.setItem('opento_recipes', JSON.stringify(list)); }
function ensureDefaultRecipes(){
  if(getRecipes().length>0) return;
  saveRecipes([
    { title:'Acquisition sprints — auto‑accept under $120/30m', chips:['Share: goal, channel mix','Hide: employer name until booked','Window: Mon–Thu 11a–4p CT'], auto:true },
    { title:'Creative QA — fast async tasks', chips:['Share: ad account read-only','Hide: financial metrics','Floor: $12+/5m'], auto:true },
    { title:'Retainer leads — manual approvals', chips:['Share: portfolio, ROAS lifts','Hide: current client roster','No auto-book'], auto:false },
  ]);
}
function renderRecipes(){
  const holder = qs('#recipesHolder'); if(!holder) return;
  holder.innerHTML='';
  const list = getRecipes();
  list.forEach((r,idx)=>{
    const card = document.createElement('div'); card.className='card recipe';
    card.innerHTML = `<h3>${r.title}</h3>
      <div class="chips" style="margin-bottom:10px;">
        ${r.chips.map(c=>`<div class="chip">${c}</div>`).join('')}
      </div>
      <button data-toggle class="btn small ${r.auto?'':'gray'}">${r.auto?'Auto‑accept: ON':'Auto‑accept: OFF'}</button>
      <div class="small preview" style="margin-top:8px;">${r.auto?'Will auto‑accept matching briefs.':'Requires manual review.'}</div>
      <div style="margin-top:8px;"><button class="btn small" data-edit="${idx}">Edit</button> <button class="btn small gray" data-del="${idx}">Delete</button></div>`;
    holder.appendChild(card);
  });
  bindRecipeCardEvents();
}
function bindRecipeCardEvents(){
  qsa('.recipe [data-toggle]').forEach(t=>{
    t.addEventListener('click', ()=>{
      const list=getRecipes(); const title=t.closest('.recipe').querySelector('h3').textContent;
      const idx=list.findIndex(x=>x.title===title); if(idx>-1){ list[idx].auto = !list[idx].auto; saveRecipes(list); renderRecipes(); toast(list[idx].auto?'Recipe enabled':'Recipe disabled'); track('Recipe Toggled', {title:list[idx].title, auto:list[idx].auto}); }
    });
  });
  qsa('.recipe [data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ const idx=+btn.dataset.del; const list=getRecipes(); list.splice(idx,1); saveRecipes(list); renderRecipes(); toast('Recipe deleted'); });
  });
  qsa('.recipe [data-edit]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ const idx=+btn.dataset.edit; const list=getRecipes(); openRecipeModal(list[idx], idx); });
  });
}
function openRecipeModal(model={}, idx=null){
  const m = qs('#recipeModal'); if(!m) return;
  m.style.display='flex';
  qs('#rTitle').value = model.title||'';
  qs('#rChips').value = model.chips ? model.chips.join(', ') : '';
  qs('#rAuto').checked = !!model.auto;
  qs('#rIdx').value = idx===null ? '' : String(idx);
}
function closeRecipeModal(){ const m=qs('#recipeModal'); if(m) m.style.display='none'; }
function saveRecipeFromModal(){
  const title = qs('#rTitle').value.trim();
  const chips = qs('#rChips').value.split(',').map(s=>s.trim()).filter(Boolean);
  const auto = qs('#rAuto').checked;
  const idx = qs('#rIdx').value;
  if(!title){ toast('Title required'); return; }
  const list = getRecipes();
  if(idx===''){ list.push({title, chips, auto}); } else { list[+idx] = {title, chips, auto}; }
  saveRecipes(list); renderRecipes(); closeRecipeModal(); toast('Recipe saved');
}

/* Suggestions (from declines) */
function renderSuggestions(){
  const sug = qs('#suggestions'); if(!sug) return;
  const list = JSON.parse(localStorage.getItem('opento_suggestions')||'[]');
  if(list.length===0){ sug.innerHTML = `<div class="small">No suggestions yet. As you decline offers, we'll coach your rules.</div>`; return; }
  const counts = list.reduce((a,x)=> (a[x]=(a[x]||0)+1, a), {});
  const arr = Object.entries(counts).sort((a,b)=> b[1]-a[1]);
  sug.innerHTML = arr.map(([k,v])=>{
    const copy = k==='outside_hours'
      ? 'Extend your async availability or add another window so the Rep can confirm intros.'
      : 'Tighten your brief (budget, KPI, or scope) to funnel more qualified matches.';
    return `<div class="card" style="margin-bottom:8px;"><strong>Suggestion:</strong> ${copy}</div>`;
  }).join('');
}

/* ---------- Share Card page helpers ---------- */
function drawShareCard(canvas, val){
  const ctx=canvas.getContext('2d'); const W=800, H=418; canvas.width=W; canvas.height=H;
  // bg
  const grad=ctx.createLinearGradient(0,0,W,H); grad.addColorStop(0,'#0B132A'); grad.addColorStop(1,'#1f2b6c'); ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  const share = demoAgent.share;
  const slugParam = new URLSearchParams(location.search).get('handle');
  const slug = slugParam || share.linkSlug || demoAgent.handle;
  const numeric = Number(val || share.value);
  const valueLabel = '+' + (Number.isNaN(numeric) ? formatUsd(share.value) : formatUsd(numeric));

  ctx.fillStyle='#fff';
  ctx.font='600 30px "Inter", Arial, sans-serif';
  ctx.fillText(share.headline, 32, 72);
  ctx.font='400 22px "Inter", Arial, sans-serif';
  ctx.fillStyle='rgba(219,227,255,0.92)';
  ctx.fillText(share.subheadline, 32, 112);
  ctx.font='700 78px "Inter", Arial, sans-serif';
  ctx.fillStyle='#2EE6A6';
  ctx.fillText(valueLabel, 32, 192);
  ctx.font='400 20px "Inter", Arial, sans-serif';
  ctx.fillStyle='#dbe3ff';
  ctx.fillText(share.footer, 32, H-64);
  ctx.font='500 24px "Inter", Arial, sans-serif';
  ctx.fillStyle='#fff';
  ctx.fillText(`Get yours: opento.me/${slug}`, 32, H-30);
}

function handlePageInit(){
  if(!document.body.classList.contains('handle-page')) return;
  
  // NOTE: Agent data is now loaded by handle-integration.js
  // This function only handles modal interactions
  console.log('Handle page: Initializing modal interactions...');

  const modal = qs('#introModal');
  const openBtn = qs('#requestIntro');
  const templateBtn = qs('#copyIntroTemplate');
  if(templateBtn){
    templateBtn.addEventListener('click', ()=>{
      const template = qs('#introTemplatePreview')?.textContent || '';
      navigator.clipboard.writeText(template)
        .then(()=> toast('Template copied'))
        .catch(()=> toast('Unable to copy template', 2600));
    });
  }
  if(modal && openBtn){
    const close = ()=>{ modal.style.display='none'; };
    const open = ()=>{ modal.style.display='flex'; track('Intro Modal Opened'); qs('#introName')?.focus(); };
    openBtn.addEventListener('click', open);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });
    qsa('[data-close="intro"]', modal).forEach(btn=> btn.addEventListener('click', close));
    // Form submission is now handled by handle-integration.js
  }

  // Initialize chat - wait for agent data to load
  initializeChat();
}

function initializeChat() {
  // Chat functionality - only on handle page
  if(!document.body.classList.contains('handle-page')) return;

  const chatModal = qs('#chatModal');
  const chatBtn = qs('#chatWithRep');
  const chatMessages = qs('#chatMessages');
  const chatInput = qs('#chatInput');
  const chatSend = qs('#chatSend');
  const chatSuggestions = qs('#chatSuggestions');

  if(chatModal && chatBtn){
    // Track if chat is already initialized
    if (chatBtn._chatInitialized) {
      console.log('Chat already initialized');
      return;
    }
    chatBtn._chatInitialized = true;

    // Get agent data when chat is opened
    let agent = null;
    const chatState = { history: [], awaitingResponse: false };

    const openChat = ()=> {
      // Get current agent data
      agent = window.currentAgentData;
      
      console.log('Opening chat, agent data:', agent);
      
      if (!agent) {
        console.error('No agent data available for chat');
        toast('Error: Agent data not loaded. Please refresh the page.');
        return;
      }
      
      const agentName = agent.display_name || agent.displayName || 'Agent';
      const firstName = agentName.split(' ')[0];
      setText('#displayNameChat', firstName);
      
      console.log(`✓ Chat opened for ${firstName}`);
      
      chatModal.style.display='flex';
      track('Chat Opened');
      if(chatState.history.length === 0){
        setTimeout(()=> addBotMessage(`Hi! I'm ${firstName}'s Rep. I can help answer questions about their availability, rates, expertise, and how to work together. What would you like to know?`, true), 300);
      }
      chatInput.focus();
    };
    const closeChat = ()=> { chatModal.style.display='none'; };

    chatBtn.addEventListener('click', openChat);
    chatModal.addEventListener('click', (e)=>{ if(e.target===chatModal) closeChat(); });
    qsa('[data-close="chat"]', chatModal).forEach(btn=> btn.addEventListener('click', closeChat));

    const addMessage = (text, isBot, showSuggestions = false)=> {
      const msg = document.createElement('div');
      msg.className = `chat-message ${isBot ? 'bot' : 'user'}`;
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      
      // Show photo for bot if available, otherwise initials
      if (isBot && agent && agent.avatar_url) {
        avatar.innerHTML = `<img src="${agent.avatar_url}" alt="Agent" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        const agentAvatar = agent ? (agent.avatar_initials || agent.avatar || 'AG') : 'AG';
        avatar.textContent = isBot ? agentAvatar : 'Y';
      }
      
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = text;
      msg.appendChild(avatar);
      msg.appendChild(bubble);
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatState.history.push({ text, isBot });

      if(showSuggestions && isBot){
        showQuickReplies();
      }
    };

    const addBotMessage = (text, showSuggestions = false)=> {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(()=> {
        typing.remove();
        addMessage(text, true, showSuggestions);
      }, 800 + Math.random() * 400);
    };

    const showQuickReplies = ()=> {
      chatSuggestions.innerHTML = '';
      const agentName = agent ? (agent.display_name || agent.displayName || 'Agent') : 'Agent';
      const firstName = agentName.split(' ')[0];
      const suggestions = [
        'What are the rates?',
        `What is ${firstName} available for?`,
        'Tell me about expertise',
        `When is ${firstName} available?`,
        'How do I request an intro?'
      ];
      suggestions.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'chat-suggestion-btn';
        btn.textContent = text;
        btn.addEventListener('click', ()=> {
          chatSuggestions.innerHTML = '';
          sendMessage(text);
        });
        chatSuggestions.appendChild(btn);
      });
    };

    const generateResponse = async (input)=> {
      const lower = input.toLowerCase();

      // Check for explicit request to open intro form (only if user explicitly asks)
      if(lower.match(/^(yes|yeah|sure|okay|ok|ready|let'?s do it|i want to send|send intro|request intro)$/i)){
        setTimeout(()=> {
          chatModal.style.display = 'none';
          const introModal = qs('#introModal');
          if(introModal){
            introModal.style.display = 'flex';
            track('Chat to Intro Conversion');
            qs('#introName')?.focus();
          }
        }, 1000);
        return `Great! Opening the intro request form for you now...`;
      }

      // Make sure we have agent data
      if (!agent) {
        return `I'm having trouble loading agent information. Please refresh the page and try again.`;
      }

      // Call backend API for AI response
      try {
        // Build messages array for API (last 10 messages for context)
        const messages = chatState.history
          .slice(-10)
          .map(msg => ({
            role: msg.isBot === false ? 'user' : 'assistant',
            content: msg.text || msg.content
          }))
          .concat([{ role: 'user', content: input }]);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            agentData: agent
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        let reply = data.reply;
        
        // Check if response includes intro button marker
        if (reply.includes('[SHOW_INTRO_BUTTON]')) {
          // Remove marker and add button functionality
          reply = reply.replace('[SHOW_INTRO_BUTTON]', '');
          
          // Schedule button to be added after message is displayed
          setTimeout(() => {
            const lastMessage = chatMessages.lastElementChild;
            if (lastMessage && lastMessage.classList.contains('bot')) {
              const buttonDiv = document.createElement('div');
              buttonDiv.style.marginTop = '12px';
              buttonDiv.innerHTML = '<button class="btn primary" style="padding: 10px 20px;" onclick="document.getElementById(\'chatModal\').style.display=\'none\'; document.getElementById(\'introModal\').style.display=\'flex\'; document.getElementById(\'introName\')?.focus();">Send Intro Request</button>';
              lastMessage.appendChild(buttonDiv);
              track('Chat Intro Button Shown');
            }
          }, 100);
        }
        
        return reply;

      } catch (error) {
        console.error('Chat API error:', error);
        track('Chat API Error', { error: error.message });

        // Fallback to basic response if API fails
        return `I'm having trouble connecting right now. Please try again in a moment, or feel free to use the intro request form to send ${firstName} a message directly.`;
      }
    };

    const sendMessage = async (text)=> {
      if(!text || text.trim() === '') return;
      if(chatState.awaitingResponse) return; // Prevent double-sends

      addMessage(text, false);
      chatInput.value = '';
      chatState.awaitingResponse = true;
      track('Chat Message Sent', { length: text.length });

      // Detect if user is describing a project (budget, timeline, need)
      const lower = text.toLowerCase();
      const hasProjectDetails = (
        (lower.includes('budget') || lower.includes('$') || lower.includes('k ') || lower.includes('need')) &&
        (lower.length > 30) // Substantial message
      );

      const response = await generateResponse(text);
      chatState.awaitingResponse = false;
      
      // If user is sharing project details, offer to open intro form
      if (hasProjectDetails && !lower.match(/^(yes|yeah|sure|okay|ok)$/i)) {
        addBotMessage(response, false);
        setTimeout(() => {
          const buttonMsg = document.createElement('div');
          buttonMsg.className = 'chat-message bot';
          buttonMsg.innerHTML = `
            <div class="avatar">${agent?.avatar_initials || 'AG'}</div>
            <div class="bubble">
              Perfect! Ready to send this as an official intro request?<br><br>
              <button class="btn primary" style="padding: 10px 20px;" onclick="document.getElementById('chatModal').style.display='none'; document.getElementById('introModal').style.display='flex'; const name=document.getElementById('introName'); if(name){name.focus();}">
                Send Intro Request
              </button>
            </div>
          `;
          chatMessages.appendChild(buttonMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1200);
      } else {
        addBotMessage(response, false);
      }
    };

    chatSend.addEventListener('click', ()=> sendMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e)=> {
      if(e.key === 'Enter'){
        e.preventDefault();
        sendMessage(chatInput.value);
      }
    });
  }
}

function sharePageInit(){
  if(!document.body.classList.contains('share-page')) return;
  const params = new URLSearchParams(location.search);
  const valueParam = params.get('v');
  const handleParam = params.get('handle') || demoAgent.share.linkSlug || demoAgent.handle;
  document.title = `Opento — ${demoAgent.displayName} receipt`;
  const value = Number(valueParam || demoAgent.share.value);
  const canvas = qs('#shareCanvas');
  if(canvas) drawShareCard(canvas, value);
  const validValue = Number.isNaN(value) ? demoAgent.share.value : value;
  setText('[data-share-headline]', demoAgent.share.headline);
  setText('[data-share-subheadline]', demoAgent.share.subheadline);
  setText('[data-share-value]', '+' + formatUsd(validValue));
  setText('[data-share-footer]', demoAgent.share.footer);
  const caption = qs('#shareCaption');
  if(caption){
    caption.value = demoAgent.share.caption;
  }
  const copyBtn = qs('#copyCaption');
  if(copyBtn){
    copyBtn.addEventListener('click', ()=>{
      navigator.clipboard.writeText(demoAgent.share.caption)
        .then(()=>{ toast('Caption copied'); track('Receipt Caption Copied'); })
        .catch(()=> toast('Unable to copy caption', 2600));
    });
  }
  const agentLink = qs('#shareViewAgent'); if(agentLink) agentLink.href = `handle.html?u=${handleParam}`;
  const linkLabel = qs('#shareLinkFriendly'); if(linkLabel) linkLabel.textContent = `opento.me/${handleParam}`;
}

/* ---------- FAQ ---------- */
function faqInit(){ qsa('.faq .item .q').forEach(h=> h.addEventListener('click', ()=> h.parentElement.classList.toggle('open')) ); }

/* ---------- State Lab ---------- */
function stateLabInit(){
  const toggle = document.createElement('button'); toggle.className='state-lab-toggle'; toggle.textContent='State Lab ⚙️';
  document.body.appendChild(toggle);
  const panel = document.createElement('div'); panel.className='state-lab';
  panel.innerHTML = `
    <h4>State Lab</h4>
    <div class="row"><span>Page state</span>
      <select id="stateSel">
        <option value="default">Default</option>
        <option value="loading">Loading</option>
        <option value="empty">Empty</option>
        <option value="error">Error</option>
      </select>
    </div>
    <div class="row"><span>Dark mode</span><input type="checkbox" id="darkT"></div>
    <div class="row"><span>Motion</span><input type="range" id="motion" min="0" max="1" step="1"><span class="small">0=reduce</span></div>
    <p class="small">Preview skeletons, empty trays, and errors.</p>
  `;
  document.body.appendChild(panel);
  toggle.addEventListener('click', ()=> panel.style.display = (panel.style.display==='block'?'none':'block'));

  const sel = panel.querySelector('#stateSel');
  const darkT = panel.querySelector('#darkT');
  const motion = panel.querySelector('#motion');

  sel.addEventListener('change', ()=> applyState(sel.value));
  darkT.addEventListener('change', ()=> document.documentElement.classList.toggle('dark', darkT.checked));
  motion.addEventListener('input', ()=> document.documentElement.style.setProperty('--motion', motion.value));

  function applyState(v){
    const container = qs('.results') || qs('.hero') || document.body;
    if(!container) return;
    qsa('.skeleton,.empty,.error-banner').forEach(n=>n.remove());
    if(v==='loading'){
      if(qs('.results')){
        const r=qs('.results'); r.innerHTML='';
        for(let i=0;i<4;i++){
          const ph=document.createElement('div'); ph.className='offer';
          ph.innerHTML=`<div class="sel"><input type="checkbox"></div>
          <div><div class="skeleton" style="width:60%; height:16px;"></div>
          <div class="skeleton" style="width:40%; height:12px; margin-top:8px;"></div></div>
          <div style="width:200px"><div class="skeleton" style="width:100%; height:32px;"></div></div>`;
          r.appendChild(ph);
        }
      } else { toast('Loading state applied'); }
    } else if(v==='empty'){
      if(qs('.results')){
        const r=qs('.results'); r.innerHTML=`<div class="card empty" style="text-align:center; padding:26px;">
        <h3>No offers yet</h3><p class="small">Your Scout is scanning. Try lowering your floor by $5 or widening availability.</p>
        <button class="btn gray" onclick="toast('Suggested changes applied')">See suggestions</button></div>`;
      } else { toast('Empty state applied'); }
    } else if(v==='error'){
      const b=document.createElement('div'); b.className='error-banner'; b.style.cssText='position:sticky;top:56px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:10px;text-align:center;z-index:12;';
      b.textContent='Network error—retrying and holding your spot in queue.'; document.body.appendChild(b); setTimeout(()=>b.remove(), 3000);
    } else { window.location.reload(); }
  }
}

/* ---------- Router ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  function initMobileNav(){
    const nav = qs('.nav'); if(!nav) return;
    const actions = nav.querySelector('.actions'); if(!actions) return;
    if(nav.querySelector('.menu-toggle')) return;
    const btn = document.createElement('button'); btn.className='menu-toggle'; btn.textContent='Menu'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Open menu');
    nav.insertBefore(btn, actions);
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', String(open));
    });
  }
  initMobileNav();

  // landing
  if(qs('.ticker')) startTicker();
  if(qs('.typewriter')) typeWriter(qs('.typewriter'));
  if(qs('.radar')) spawnPings();
  if(qs('#testDrive')) testDriveInit();

  // persona-driven pages
  handlePageInit();
  sharePageInit();

  // onboarding
  if(qs('.wizard')){ wizardInit(); linkedinInit(); }
  if(qs('#quickStart')) quickStartInit();

  // inbox
  if(qs('.offer')) inboxInit();

  // recipes
  if(qs('#recipesHolder')){ ensureDefaultRecipes(); renderRecipes(); renderSuggestions(); }
  if(qs('#recipeModal')){
    qs('#rCancel').addEventListener('click', closeRecipeModal);
    qs('#rSave').addEventListener('click', saveRecipeFromModal);
    qs('#rNew').addEventListener('click', ()=> openRecipeModal());
  }

  // email
  if(qs('.email')){ /* no change in v4.1 */ }

  // faq
  if(qs('.faq')) faqInit();

  // share card
  if(qs('#shareCanvas')){
    qs('#dlPng').addEventListener('click', ()=>{
      const link=document.createElement('a'); link.download='opento-receipt.png'; link.href=qs('#shareCanvas').toDataURL(); link.click(); track('Receipt Downloaded');
    });
    qs('#copyLink').addEventListener('click', ()=>{ navigator.clipboard.writeText(window.location.href).then(()=> toast('Link copied')); track('Receipt Link Copied'); });
  }

  // state lab only on app-like pages (hide on marketing/landing variants)
  if(!document.body.classList.contains('landing-variant')){
    stateLabInit();
  }
});
