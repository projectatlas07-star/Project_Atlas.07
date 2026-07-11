import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@project-atlas/database';

// Create PostgreSQL pool for server-side operations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Set company context for RLS policies
export async function setCompanyContext(companyId: string) {
  try {
    await pool.query('SET app.current_company = $1', [companyId]);
  } catch (error) {
    console.error('Failed to set company context:', error);
    // Continue anyway as RLS will use default behavior
  }
}