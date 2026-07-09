'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface SupabaseContextValue {
  supabase: SupabaseClient | null;
  session: any; // Supabase session type (can be refined later)
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase] = useState(() => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    }
    return null;
  });
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check initial session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error('Supabase session error', error);
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // Listen for auth changes (sign‑in, sign‑out)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error('useSupabase must be used within SupabaseProvider');
  return context;
};
