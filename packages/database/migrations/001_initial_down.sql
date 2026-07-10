-- Project Atlas Initial Schema Rollback Migration
-- This migration drops all tables, indexes, policies, triggers, and functions in reverse order

-- Drop triggers and functions first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP FUNCTION IF EXISTS public.handle_user_update;

-- Drop indexes
DROP INDEX IF EXISTS idx_ai_conversations_user_id;
DROP INDEX IF EXISTS idx_ai_conversations_company_id;
DROP INDEX IF EXISTS idx_interview_questions_interview_id;
DROP INDEX IF EXISTS idx_interviews_company_id;
DROP INDEX IF EXISTS idx_activity_logs_user_id;
DROP INDEX IF EXISTS idx_activity_logs_company_id;
DROP INDEX IF EXISTS idx_adjusters_company_id;
DROP INDEX IF EXISTS idx_notes_company_id;
DROP INDEX IF EXISTS idx_notes_entity;
DROP INDEX IF EXISTS idx_tasks_assigned_to;
DROP INDEX IF EXISTS idx_tasks_company_id;
DROP INDEX IF EXISTS idx_documents_company_id;
DROP INDEX IF EXISTS idx_documents_claim_id;
DROP INDEX IF EXISTS idx_supplements_company_id;
DROP INDEX IF EXISTS idx_supplements_claim_id;
DROP INDEX IF EXISTS idx_claims_company_id;
DROP INDEX IF EXISTS idx_claim_number;
DROP INDEX IF EXISTS idx_properties_company_id;
DROP INDEX IF EXISTS idx_contacts_company_id;
DROP INDEX IF EXISTS idx_tenant_members_company_id;
DROP INDEX IF EXISTS idx_tenant_members_user_id;
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_tenants_slug;
DROP INDEX IF EXISTS idx_companies_slug;

-- Drop RLS policies
DROP POLICY IF EXISTS ai_conversations_company_isolation ON ai_conversations;
DROP POLICY IF EXISTS interview_questions_company_isolation ON interview_questions;
DROP POLICY IF EXISTS interviews_company_isolation ON interviews;
DROP POLICY IF EXISTS activity_logs_company_isolation ON activity_logs;
DROP POLICY IF EXISTS adjusters_company_isolation ON adjusters;
DROP POLICY IF EXISTS notes_company_isolation ON notes;
DROP POLICY IF EXISTS tasks_company_isolation ON tasks;
DROP POLICY IF EXISTS documents_company_isolation ON documents;
DROP POLICY IF EXISTS supplements_company_isolation ON supplements;
DROP POLICY IF EXISTS claims_company_isolation ON claims;
DROP POLICY IF EXISTS properties_company_isolation ON properties;
DROP POLICY IF EXISTS contacts_company_isolation ON contacts;
DROP POLICY IF EXISTS tenant_members_company_isolation ON tenant_members;
DROP POLICY IF EXISTS profiles_company_isolation ON profiles;
DROP POLICY IF EXISTS tenants_company_isolation ON tenants;
DROP POLICY IF EXISTS companies_company_isolation ON companies;

-- Disable RLS on tables
ALTER TABLE ai_conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE adjusters DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplements DISABLE ROW LEVEL SECURITY;
ALTER TABLE claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Drop tables in reverse order of creation
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS adjusters CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS supplements CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS tenant_members CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
