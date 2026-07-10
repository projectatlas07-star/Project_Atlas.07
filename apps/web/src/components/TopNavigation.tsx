'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface TopNavigationProps {
  onMobileMenuToggle?: () => void;
}

export default function TopNavigation({ onMobileMenuToggle }: TopNavigationProps) {
  const { supabase, session } = useSupabase();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-[var(--brand-navy-light)] border-b border-white/10 flex items-center justify-between px-4 md:px-6 z-40">
      {/* Mobile Menu Button & Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="relative w-28 h-8 md:w-36 md:h-10">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Project Atlas"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors relative"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--brand-cyan)] rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--brand-navy)] border border-white/20 rounded-lg shadow-xl p-4">
              <h3 className="text-white font-medium mb-3">Notifications</h3>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded text-sm text-white/80">
                  <p className="font-medium text-white">New claim assigned</p>
                  <p className="text-xs text-white/60">2 minutes ago</p>
                </div>
                <div className="p-2 bg-white/5 rounded text-sm text-white/80">
                  <p className="font-medium text-white">Supplement approved</p>
                  <p className="text-xs text-white/60">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-[var(--brand-cyan)] rounded-full flex items-center justify-center text-[var(--brand-navy)] font-medium">
              {session?.user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <span className="text-white text-sm hidden md:block">
              {session?.user?.email?.split('@')[0] || 'User'}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--brand-navy)] border border-white/20 rounded-lg shadow-xl p-2">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-white text-sm font-medium">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
