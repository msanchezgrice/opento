#!/bin/bash
# Opento Backend Setup Verification Script

echo "🔍 Opento Backend Setup Verification"
echo "===================================="
echo ""

# Check if files exist
echo "📁 Checking files..."
FILES=(
  "config.js"
  "sign-up.html"
  "sign-in.html"
  "browse.html"
  "lib/supabase-client.js"
  "lib/onboarding-integration.js"
  "lib/handle-integration.js"
  "lib/inbox-integration.js"
  "supabase/migrations/001_initial_schema.sql"
  "supabase/migrations/002_seed_skills.sql"
  "supabase/migrations/003_seed_opportunities.sql"
)

MISSING=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
    MISSING=$((MISSING + 1))
  fi
done

echo ""

if [ $MISSING -eq 0 ]; then
  echo "✅ All backend files present!"
else
  echo "❌ Missing $MISSING files"
  exit 1
fi

echo ""
echo "📊 Code Statistics"
echo "===================="
echo ""
echo "JavaScript files:"
wc -l lib/*.js | tail -1
echo ""
echo "SQL migration files:"
wc -l supabase/migrations/*.sql | tail -1
echo ""
echo "Documentation:"
wc -l *.md 2>/dev/null | tail -1
echo ""

# Check config
echo "⚙️  Configuration Check"
echo "======================="
echo ""

if grep -q "YOUR_CLERK_PUBLISHABLE_KEY" config.js; then
  echo "⚠️  Clerk key not configured yet"
  echo "   → Update config.js with your Clerk publishable key"
else
  echo "✓ Clerk key configured"
fi

if grep -q "YOUR_SUPABASE_URL" config.js; then
  echo "⚠️  Supabase URL not configured yet"
  echo "   → Update config.js with your Supabase project URL"
else
  echo "✓ Supabase URL configured"
fi

echo ""
echo "📚 Next Steps"
echo "============="
echo ""
echo "1. Read QUICKSTART.md for 15-minute setup"
echo "2. Create Supabase project and run migrations"
echo "3. Create Clerk account and get keys"
echo "4. Update config.js with your keys"
echo "5. Test locally: python3 -m http.server 8080"
echo "6. Deploy to Vercel!"
echo ""
echo "📖 Documentation:"
echo "   QUICKSTART.md - Quick setup guide"
echo "   SETUP.md - Detailed instructions"
echo "   IMPLEMENTATION_SUMMARY.md - What was built"
echo "   README_BACKEND.md - Architecture overview"
echo ""
echo "🚀 You're ready to launch!"
