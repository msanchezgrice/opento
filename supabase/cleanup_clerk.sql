-- SQL Script to Clean Up Clerk-Related Database Items
-- Run this in Supabase SQL Editor to remove any Clerk remnants

-- WARNING: This will permanently delete data. Review carefully before running.

-- ============================================
-- 1. DROP CLERK-RELATED TABLES (if they exist)
-- ============================================

-- Drop clerk_users table if it exists
DROP TABLE IF EXISTS clerk_users CASCADE;

-- Drop clerk_sessions table if it exists
DROP TABLE IF EXISTS clerk_sessions CASCADE;

-- Drop clerk_organizations table if it exists
DROP TABLE IF EXISTS clerk_organizations CASCADE;

-- Drop clerk_organization_memberships table if it exists
DROP TABLE IF EXISTS clerk_organization_memberships CASCADE;

-- Drop any other Clerk-related tables you may have created
DROP TABLE IF EXISTS auth_providers CASCADE;
DROP TABLE IF EXISTS external_accounts CASCADE;

-- ============================================
-- 2. DROP CLERK-RELATED COLUMNS (if they exist)
-- ============================================

-- Remove clerk_id from users table if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'clerk_id'
  ) THEN
    ALTER TABLE users DROP COLUMN clerk_id;
  END IF;
END $$;

-- Remove clerk_user_id if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'clerk_user_id'
  ) THEN
    ALTER TABLE users DROP COLUMN clerk_user_id;
  END IF;
END $$;

-- Remove external_id if it was used for Clerk
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'external_id'
  ) THEN
    ALTER TABLE users DROP COLUMN external_id;
  END IF;
END $$;

-- ============================================
-- 3. DROP CLERK-RELATED INDEXES
-- ============================================

DROP INDEX IF EXISTS idx_users_clerk_id;
DROP INDEX IF EXISTS idx_users_clerk_user_id;
DROP INDEX IF EXISTS idx_users_external_id;
DROP INDEX IF EXISTS idx_clerk_sessions_user_id;
DROP INDEX IF EXISTS idx_clerk_organizations_id;

-- ============================================
-- 4. DROP CLERK-RELATED FUNCTIONS
-- ============================================

DROP FUNCTION IF EXISTS sync_clerk_user() CASCADE;
DROP FUNCTION IF EXISTS handle_clerk_webhook() CASCADE;
DROP FUNCTION IF EXISTS verify_clerk_session() CASCADE;

-- ============================================
-- 5. DROP CLERK-RELATED TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS on_clerk_user_created ON users;
DROP TRIGGER IF EXISTS on_clerk_user_updated ON users;
DROP TRIGGER IF EXISTS on_clerk_session_created ON clerk_sessions;

-- ============================================
-- 6. DROP CLERK-RELATED POLICIES (RLS)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own Clerk data" ON users;
DROP POLICY IF EXISTS "Clerk service can manage all users" ON users;
DROP POLICY IF EXISTS "Clerk sessions are private" ON clerk_sessions;

-- ============================================
-- 7. CLEAN UP ENUMS (if Clerk-specific)
-- ============================================

-- Drop Clerk-related enum types if they exist
DROP TYPE IF EXISTS clerk_user_status CASCADE;
DROP TYPE IF EXISTS clerk_session_status CASCADE;

-- ============================================
-- 8. VERIFY CLEANUP
-- ============================================

-- Check for any remaining Clerk-related tables
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (
    table_name LIKE '%clerk%'
    OR table_name LIKE '%auth%'
    OR table_name LIKE '%external%'
  );

-- Check for any remaining Clerk-related columns
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    column_name LIKE '%clerk%'
    OR column_name LIKE '%external_id%'
  );

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✓ Clerk cleanup complete!';
  RAISE NOTICE 'Review the verification queries above to confirm all Clerk remnants are removed.';
  RAISE NOTICE 'If any tables or columns are listed, you may need to manually review and remove them.';
END $$;
