import { createClient } from '@supabase/supabase-js';

// Supabase client for backend (service role key for privileged actions)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
