-- Reset script for partial Atlas schema migration
-- WARNING: This script will remove Atlas application tables and objects
-- Use ONLY for empty/test Supabase projects with failed migrations
-- DO NOT use on production databases with real data

-- Drop Atlas-specific functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;

-- Drop Atlas-specific triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop Atlas application tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS public.ai_conversations CASCADE;
DROP TABLE IF EXISTS public.interview_questions CASCADE;
DROP TABLE IF EXISTS public.interviews CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.adjusters CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.supplements CASCADE;
DROP TABLE IF EXISTS public.claims CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.tenant_members CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- Note: We intentionally DO NOT drop:
-- - auth schema (Supabase Authentication)
-- - auth.users table (Supabase user management)
-- - storage schema (Supabase Storage)
-- - extensions (pgcrypto and other Supabase extensions)
-- - system schemas and roles

-- This makes it safe to rerun 001_initial.sql on the same database