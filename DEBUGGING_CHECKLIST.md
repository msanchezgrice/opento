# Debugging Checklist - Browse Page Not Loading All Agents

## Issue: Browse page shows "Using demo agents (6 agents)" instead of loading from database

---

## Step 1: Check Console Logs (After Deploy)

Refresh the browse page and look for these console messages:

### ✅ Good (Working):
```
🔧 Initializing Supabase client...
📝 Supabase URL: https://axoycualmoxygizjkuof.supabase.co
📝 Anon key present: true
✅ Supabase library loaded, creating client...
✅ Supabase client ready (live mode)
✓ Loaded 26 agents from database
```

### ❌ Bad (Not Working):
```
🔧 Initializing Supabase client...
❌ Config not loaded...
```
OR
```
🔧 Initializing Supabase client...
📝 Supabase URL: https://axoycualmoxygizjkuof.supabase.co
📝 Anon key present: true
❌ Supabase library not loaded - window.supabase: undefined
Using demo agents (6 agents)
```

---

## Step 2: If Supabase Library Not Loaded

This means the CDN script isn't loading. Check:

1. **Verify script tags in browse.html:**
   ```html
   <script src="config.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="lib/supabase-client.js"></script>
   ```

2. **Check Network tab:**
   - Open DevTools → Network
   - Filter by "JS"
   - Look for `supabase-js@2` - should be status 200
   - If 404 or blocked, CDN might be down

3. **Try alternative CDN:**
   Replace line in browse.html:
   ```html
   <!-- Current -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   
   <!-- Alternative -->
   <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
   ```

---

## Step 3: Run Agent Profiles Migration in Supabase

Go to Supabase Dashboard → SQL Editor → New Query

**Copy and paste entire file:**
```
supabase/migrations/005_update_agent_profiles_detailed.sql
```

Then click **Run**.

This will update all 20 agent profiles with unique, detailed content:
- 4+ unique "open to" items per agent
- 4+ unique focus areas
- 4+ wins with real metrics
- 4 social proof items

**Verify it worked:**
```sql
SELECT 
  u.handle, 
  u.display_name,
  array_length(ap.open_to, 1) as open_to_count,
  array_length(ap.focus_areas, 1) as focus_count,
  array_length(ap.recent_wins, 1) as wins_count
FROM users u
JOIN agent_profiles ap ON ap.user_id = u.id
WHERE u.handle IN ('techcarlos', 'designdaniel', 'mlnina')
ORDER BY u.handle;
```

**Expected output:**
```
handle         | display_name    | open_to_count | focus_count | wins_count
---------------|-----------------|---------------|-------------|------------
designdaniel   | Daniel Lopez    | 4             | 4           | 4
mlnina         | Nina Patel      | 4             | 4           | 4
techcarlos     | Carlos Rodriguez| 4             | 4           | 4
```

---

## Step 4: Test Individual Agent Profiles

After running migration, test these URLs:

### Carlos Rodriguez (Backend Engineer):
```
https://opento-psi.vercel.app/handle?u=techcarlos
```
**Should show:**
- Title: "Hi I'm Carlos"
- Section: "What Carlos is taking on"
- Open to: "API development and RESTful/GraphQL architecture..."
- Focus: "Python and Go microservices architecture..."
- Wins: "Built payment API processing $50M+..."
- NO Maya content anywhere

### Nina Patel (ML Engineer):
```
https://opento-psi.vercel.app/handle?u=mlnina
```
**Should show:**
- Title: "Hi I'm Nina"
- Section: "What Nina is taking on"
- Open to: "Machine learning model development..."
- Focus: "NLP and text analysis..."
- Wins: "Built recommendation system increasing engagement by 40%..."
- PhD mentioned in social proof

### Daniel Lopez (Product Designer):
```
https://opento-psi.vercel.app/handle?u=designdaniel
```
**Should show:**
- Title: "Hi I'm Daniel"
- Section: "What Daniel is taking on"  
- Open to: "Mobile app product design..."
- Focus: "Mobile-first product design..."
- Wins: "Designed fintech app with 500K users..."
- Fintech specialist mentioned

---

## Step 5: Test Browse Page Agent Count

After Vercel deploys and you refresh:

**Open console and look for:**
```
✓ Loaded 26 agents from database
```

**In the UI:**
- Should show 26 agent cards (not 6)
- Filter by "Engineering" → 7 agents
- Filter by "Design" → 6 agents
- Filter by "Marketing" → 6 agents
- Search "python" → Shows Carlos Rodriguez, Nina Patel

---

## Step 6: If Still Not Working

### Check Supabase Connection:

In browser console, manually test:
```javascript
// Check if client is initialized
window.supabaseClient.demoMode

// Should return: false (if working) or true (if not working)
```

```javascript
// Try to load agents manually
await window.supabaseClient.browseAgents()

// Should return array of 26 objects
```

### Check Database Has Data:

In Supabase SQL Editor:
```sql
-- Count total users
SELECT COUNT(*) FROM users WHERE handle IS NOT NULL;
-- Expected: 26

-- Count with profiles
SELECT COUNT(*) 
FROM users u
JOIN agent_profiles ap ON ap.user_id = u.id
WHERE u.handle IS NOT NULL;
-- Expected: 26

-- Check specific agent
SELECT 
  u.handle,
  u.display_name,
  ap.open_to,
  ap.focus_areas,
  ap.recent_wins
FROM users u
JOIN agent_profiles ap ON ap.user_id = u.id
WHERE u.handle = 'techcarlos';
```

---

## Expected Results After All Fixes:

### Browse Page:
- ✅ Shows 26 agents from database
- ✅ Console: `✓ Loaded 26 agents from database`
- ✅ All filters and search work
- ✅ No "Using demo agents (6 agents)" message

### Agent Profiles:
- ✅ Each shows unique, detailed content
- ✅ NO Maya Chen content on any other profile
- ✅ 4+ unique items in each section
- ✅ Names dynamic throughout page ("Hi I'm [FirstName]")

---

## Quick Test Script

Run this in browser console on browse page:

```javascript
console.log('=== Opento Debug ===');
console.log('Demo mode:', window.supabaseClient?.demoMode);
console.log('Supabase loaded:', !!window.supabase);
console.log('Client exists:', !!window.supabaseClient?.client);
console.log('Config loaded:', !!window.opentoConfig);
console.log('Supabase URL:', window.opentoConfig?.supabase?.url);

// Try to load agents
window.supabaseClient.browseAgents().then(agents => {
  console.log('Agents loaded:', agents.length);
  console.log('First agent:', agents[0]?.display_name);
}).catch(err => {
  console.error('Error:', err);
});
```

---

## Files to Update If Issues:

1. **browse.html** - Check script tags are in correct order
2. **config.js** - Verify Supabase URL and anon key
3. **lib/supabase-client.js** - Check for errors in console

---

## Support

If still not working after all steps:
1. Screenshot the console logs
2. Share the output of the test script above
3. Check Supabase logs in dashboard
