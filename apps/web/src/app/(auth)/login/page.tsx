'use client';

import { useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@project-atlas/ui';
import { Input } from '@project-atlas/ui';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase not configured');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/');
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!supabase) {
      setError('Supabase not configured');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setError('Magic link sent to your email');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 rounded bg-white p-8 shadow dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Sign In</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading}>Sign In</Button>
        <div className="flex justify-between text-sm">
          <button type="button" className="text-blue-600 hover:underline" onClick={handleMagicLink} disabled={loading}>Magic Link</button>
          <a href="/auth/reset-password" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account? <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
