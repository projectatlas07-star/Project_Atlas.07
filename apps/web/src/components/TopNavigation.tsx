'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@project-atlas/ui';
import { Menu, Search, Bell, LogOut, User } from 'lucide-react';

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
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 z-40">
      {/* Mobile Menu Button & Logo */}
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
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
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 panel-atlas rounded-lg shadow-xl p-4">
              <h3 className="text-foreground font-medium mb-3">Notifications</h3>
              <div className="space-y-2">
                <div className="p-2 rounded text-sm bg-muted/50 text-foreground/80">
                  <p className="font-medium text-foreground">New claim assigned</p>
                  <p className="text-xs text-foreground/60">2 minutes ago</p>
                </div>
                <div className="p-2 rounded text-sm bg-muted/50 text-foreground/80">
                  <p className="font-medium text-foreground">Supplement approved</p>
                  <p className="text-xs text-foreground/60">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowProfile(!showProfile)}
            className="gap-2 hidden md:flex"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              {session?.user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <span className="text-foreground text-sm hidden md:block">
              {session?.user?.email?.split('@')[0] || 'User'}
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowProfile(!showProfile)}
            className="md:hidden"
            aria-label="User menu"
          >
            <User className="h-5 w-5" />
          </Button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 panel-atlas rounded-lg shadow-xl p-2">
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <p className="text-foreground text-sm font-medium">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
