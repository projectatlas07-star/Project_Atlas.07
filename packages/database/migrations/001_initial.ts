import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "../src"; // imports all exported schema tables

// Initialize PostgreSQL pool – connection string will be provided via env var DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export async function up() {
  // Create all tables using raw SQL for migration
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        plan TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenant_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        owner_name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        claim_number VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL,
        date_of_loss TIMESTAMP,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
        amount NUMERIC,
        status VARCHAR(32),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
        url TEXT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100),
        size_bytes UUID,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to UUID,
        status VARCHAR(32) DEFAULT 'open',
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        entity_type TEXT NOT NULL,
        entity_id UUID NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS adjusters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_by UUID,
        updated_by UUID
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        user_id UUID,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id UUID,
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS interviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
        status VARCHAR(32) DEFAULT 'in_progress',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        user_id UUID,
        prompt TEXT NOT NULL,
        response TEXT,
        model TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create edge function for handling auth.user creation -> profiles sync
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, first_name, last_name)
        VALUES (NEW.id, NEW.email, NULL, NULL);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // Create trigger to call the function on auth.users creation
    await client.query(`
      CREATE OR REPLACE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

    // Create edge function for updating profile on auth.user update
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_user_update()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE public.profiles
        SET email = NEW.email
        WHERE id = NEW.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // Create trigger to call the function on auth.users update
    await client.query(`
      CREATE OR REPLACE TRIGGER on_auth_user_updated
        AFTER UPDATE ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
    `);

    // RLS policies – company isolation
    const tables = [
      "companies",
      "tenants",
      "profiles",
      "tenant_members",
      "contacts",
      "properties",
      "claims",
      "supplements",
      "documents",
      "tasks",
      "notes",
      "adjusters",
      "activity_logs",
      "interviews",
      "interview_questions",
      "ai_conversations",
    ];
    for (const tbl of tables) {
      await client.query(`
        ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;
        CREATE POLICY ${tbl}_company_isolation ON ${tbl}
          USING (company_id = current_setting('app.current_company', true)::uuid);
      `);
    }
  } finally {
    client.release();
  }
}

export async function down() {
  // Drop triggers and functions first
  const client = await pool.connect();
  try {
    await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);
    await client.query(`DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users`);
    await client.query(`DROP FUNCTION IF EXISTS public.handle_new_user`);
    await client.query(`DROP FUNCTION IF EXISTS public.handle_user_update`);
  } finally {
    client.release();
  }

  // Drop tables in reverse order
  const dropOrder = [
    "ai_conversations",
    "interview_questions",
    "interviews",
    "activity_logs",
    "adjusters",
    "notes",
    "tasks",
    "documents",
    "supplements",
    "claims",
    "properties",
    "contacts",
    "tenant_members",
    "profiles",
    "tenants",
    "companies",
  ];
  const client2 = await pool.connect();
  try {
    for (const tbl of dropOrder) {
      await client2.query(`DROP TABLE IF EXISTS ${tbl} CASCADE`);
    }
  } finally {
    client2.release();
  }
}
