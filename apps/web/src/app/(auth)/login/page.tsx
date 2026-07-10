'use client';

import { useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from '@project-atlas/ui';
import { Input } from '@project-atlas/ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-navy)] via-[var(--brand-navy-light)] to-[var(--brand-purple)] p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:40px_40px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <form
          onSubmit={handleLogin}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl space-y-6"
        >
          {/* Full Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-20">
              <Image
                src="/brand/logo-full.svg"
                alt="Project Atlas"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Welcome to Project Atlas</h1>
            <p className="text-[var(--brand-cyan-light)] text-sm">AI Operating System for Insurance Restoration</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-[var(--brand-cyan)] focus:ring-[var(--brand-cyan)]"
              />
              <span>Remember me</span>
            </label>
            <a
              href="/auth/reset-password"
              className="text-[var(--brand-cyan)] hover:text-[var(--brand-cyan-light)] transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Magic Link */}
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full text-sm text-white/70 hover:text-white transition-colors"
          >
            Or sign in with magic link
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-white/70">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="text-[var(--brand-cyan)] hover:text-[var(--brand-cyan-light)] transition-colors font-medium">
              Sign Up
            </a>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-white/40 mt-6">
          © 2026 Project Atlas. All rights reserved.
        </p>
      </div>
    </div>
  );
}
