
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
  lifetimeEarned: 6480,
  rulesSummary: 'Anonymous first • $75/30m floor • Prefers async briefs before live calls',
  latestShareValue: 284,
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

/* ---------- Overlay (Test Drive) ---------- */
function testDriveInit(){
  const openBtn = qs('#testDrive');
  const ov = qs('#testOverlay'); if(!openBtn || !ov) return;
  const bar = ov.querySelector('.bar');
  openBtn.addEventListener('click', ()=>{
    ov.style.display='flex'; bar.style.width='0%'; track('TestDrive Opened');
    let p=0; const iv=setInterval(()=>{ p+=Math.random()*25; if(p>=100){ p=100; clearInterval(iv); qs('#testDriveGo').disabled=false; } bar.style.width = p+'%'; }, 500);
  });
  qs('#testDriveGo')?.addEventListener('click', ()=>{
    track('TestDrive Proceed'); window.location.href='inbox.html?tab=micro&demo=1';
  });
  qs('#testDriveClose')?.addEventListener('click', ()=> ov.style.display='none');
}

/* ---------- Onboarding ---------- */
function updateOnboardingPreview(){
  if(!qs('.wizard')) return;
  const floorInput = qs('#floor');
  const microInput = qs('#microfloor');
  const hoursInput = qs('#hours');
  const windowSelect = qs('#autoWindow');

  const floorVal = Number(floorInput?.value ?? demoAgent.onboarding.floor);
  const microVal = Number(microInput?.value ?? demoAgent.onboarding.microFloor);
  const hoursVal = Number(hoursInput?.value ?? demoAgent.onboarding.hours);
  const windowVal = windowSelect?.value || demoAgent.onboarding.window;

  setText('#floorVal', formatUsd(floorVal));
  setText('#microVal', formatUsd(microVal));
  setText('#hoursVal', `${hoursVal} hrs`);

  setText('[data-preview="floor"]', formatUsd(floorVal));
  setText('[data-preview="micro"]', `${formatUsd(microVal)} / 5m`);
  setText('[data-preview="hours"]', `${hoursVal} hrs / wk`);
  setText('[data-preview="window"]', windowVal);

  const enabled = qsa('.wizard .switch').filter(sw=> sw.classList.contains('on')).map(sw=> sw.dataset.label).filter(Boolean);
  const focusHolder = qs('#previewFocus');
  if(focusHolder){
    focusHolder.innerHTML = enabled.length
      ? enabled.map(c=>`<div class="chip">${c}</div>`).join('')
      : '<div class="small muted">Toggle categories to teach your agent.</div>';
  }
  const summary = qs('#previewSummary');
  if(summary){
    summary.textContent = enabled.length
      ? `Your Scout will watch for ${enabled.join(', ')} within these rules.`
      : 'Choose at least one category so your Scout knows what to surface.';
  }

  // Estimate potential (aspirational) — shows impact of more categories & hours
  const estNode = qs('#estMonthly');
  if(estNode){
    const consultEnabled = ['Growth audits','Campaign optimization','Fractional retainers'].some(lbl=> enabled.includes(lbl));
    const microEnabled = enabled.includes('Data labeling');
    const consultRateHr = floorVal * 2; // $/hr from $/30m
    const microRateHr = microVal * 12;  // $/hr from $/5m
    let blendedRate = 0;
    if(consultEnabled && microEnabled){ blendedRate = consultRateHr*0.6 + microRateHr*0.4; }
    else if(consultEnabled){ blendedRate = consultRateHr; }
    else if(microEnabled){ blendedRate = microRateHr; }
    else { blendedRate = Math.max(consultRateHr, microRateHr) * 0.6; }

    const categorySet = ['Growth audits','Campaign optimization','Fractional retainers','Data labeling'];
    const categoriesCount = categorySet.filter(lbl=> enabled.includes(lbl)).length;
    let matchMultiplier = 0.6 + 0.1 * categoriesCount; // 0.6–1.0 based on enabled breadth
    if(enabled.includes('Anonymous first')) matchMultiplier += 0.05; // trust signal bump
    if(enabled.includes('Consent reminders')) matchMultiplier += 0.05;
    matchMultiplier = Math.min(1.1, matchMultiplier); // soft cap

    const estWeekly = Math.round(hoursVal * blendedRate * matchMultiplier);
    const estMonthly = estWeekly * 4;
    estNode.textContent = formatUsd(estMonthly) + ' / mo';
  }
}

function bindSwitches(){
  qsa('.wizard .switch').forEach(sw=>{
    const label = sw.dataset.label || 'option';
    const setState = (on)=>{
      sw.classList.toggle('on', on);
      sw.setAttribute('aria-checked', on);
    };
    setState(sw.classList.contains('on'));
    sw.setAttribute('role', 'switch');
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('aria-label', `${label} toggle`);
    sw.addEventListener('click', ()=>{
      const next = !sw.classList.contains('on');
      setState(next);
      track('Onboarding Toggle', {label, on: next});
      updateOnboardingPreview();
    });
    sw.addEventListener('keypress', (e)=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        const next = !sw.classList.contains('on');
        setState(next);
        track('Onboarding Toggle', {label, on: next});
        updateOnboardingPreview();
      }
    });
  });
}

function wizardInit(){
  const steps = qsa('.wizard .step'); if(steps.length===0) return;
  let idx=0;
  function show(i){
    idx=Math.max(0,Math.min(i,steps.length-1));
    steps.forEach((s,k)=>s.style.display = (k===idx?'block':'none'));
    const ind=qs('.step-indicator'); if(ind) ind.textContent = `Step ${idx+1} of ${steps.length}`;
    const bar=qs('.progress .bar'); if(bar){ const pct = steps.length>1 ? (idx)/(steps.length-1) : 1; bar.style.width = `${pct*100}%`; }
    updateOnboardingPreview();
  }
  qsa('[data-next]').forEach(b=>b.addEventListener('click', ()=>{ show(idx+1); track('Onboarding Next', {step: idx+1}); }));
  qsa('[data-back]').forEach(b=>b.addEventListener('click', ()=> show(idx-1)));
  qsa('[data-finish]').forEach(b=>b.addEventListener('click', ()=>{ startAgent('custom'); }));

  qs('#floor')?.addEventListener('input', updateOnboardingPreview);
  qs('#microfloor')?.addEventListener('input', updateOnboardingPreview);
  qs('#hours')?.addEventListener('input', updateOnboardingPreview);
  qs('#autoWindow')?.addEventListener('change', updateOnboardingPreview);

  bindSwitches();
  show(0);
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
  const params = new URLSearchParams(location.search);
  const handle = params.get('u') || demoAgent.handle;
  document.title = `Opento — ${demoAgent.displayName} (@${handle})`;
  setText('#displayName', demoAgent.displayName);
  setText('#displayNameModal', demoAgent.displayName);
  setText('#handleName', handle);
  setText('#handleRole', demoAgent.role);
  setText('#handleSummary', demoAgent.summary);
  setText('#handleLocation', demoAgent.location);
  setText('#rulesSummary', demoAgent.rulesSummary);
  setText('#lifetimeEarned', formatUsd(demoAgent.lifetimeEarned));
  setText('#overnightEarned', formatUsd(demoAgent.latestShareValue));
  setText('#availability', demoAgent.availability);
  const avatar = qs('#handleAvatar'); if(avatar) avatar.textContent = demoAgent.avatar;
  const proofHolder = qs('#proofList'); if(proofHolder) proofHolder.innerHTML = demoAgent.socialProof.map(p=>`<div class="chip">${p}</div>`).join('');
  const focusList = qs('#focusList'); if(focusList) focusList.innerHTML = demoAgent.focusAreas.map(item=>`<li>${item}</li>`).join('');
  const openList = qs('#openToList'); if(openList) openList.innerHTML = demoAgent.openTo.map(item=>`<li>${item}</li>`).join('');
  const winList = qs('#winList'); if(winList) winList.innerHTML = demoAgent.recentWins.map(item=>`<li>${item}</li>`).join('');
  const guidelines = qs('#introGuidelines'); if(guidelines) guidelines.innerHTML = demoAgent.requestIntro.guidelines.map(item=>`<li>${item}</li>`).join('');
  setText('#introPitch', demoAgent.requestIntro.pitch);
  setText('#introNote', demoAgent.requestIntro.note);
  setText('#introTemplatePreview', demoAgent.requestIntro.template);
  const shareLink = qs('#handleShareLink'); if(shareLink) shareLink.href = `share.html?handle=${handle}`;
  qs('#previewInboxLink')?.setAttribute('href', 'inbox.html?tab=micro&demo=1');

  const modal = qs('#introModal');
  const openBtn = qs('#requestIntro');
  const templateBtn = qs('#copyIntroTemplate');
  if(templateBtn){
    templateBtn.addEventListener('click', ()=>{
      navigator.clipboard.writeText(demoAgent.requestIntro.template)
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
    const form = qs('#introForm');
    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        name: (fd.get('name')||'').toString().trim(),
        email: (fd.get('email')||'').toString().trim(),
        company: (fd.get('company')||'').toString().trim(),
        notes: (fd.get('notes')||'').toString().trim(),
        ts: new Date().toISOString()
      };
      const k='opento_intro_requests';
      const list=JSON.parse(localStorage.getItem(k)||'[]'); list.push(payload); localStorage.setItem(k, JSON.stringify(list));
      track('Intro Request Drafted', {hasNotes: !!payload.notes, company: payload.company});
      toast('Intro request drafted. Rep replies within ~1 business day.');
      form.reset();
      close();
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
  // landing
  if(qs('.ticker')) startTicker();
  if(qs('.typewriter')) typeWriter(qs('.typewriter'));
  if(qs('.radar')) spawnPings();
  if(qs('#testDrive')) testDriveInit();

  // persona-driven pages
  handlePageInit();
  sharePageInit();

  // onboarding
  if(qs('.wizard')) wizardInit();
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
