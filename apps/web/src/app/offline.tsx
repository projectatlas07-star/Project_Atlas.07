'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@project-atlas/ui';

export default function Offline() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-alt)] p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="relative w-32 h-10 mx-auto mb-8">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Project Atlas"
            fill
            className="object-contain"
          />
        </div>

        {/* Error Icon */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            📡
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">You're Offline</h1>
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">No Internet Connection</h2>
        <p className="text-[var(--neutral-gray-500)] mb-8">
          Please check your internet connection and try again. Some features may not be available while offline.
        </p>

        {/* Action */}
        <Button
          onClick={() => window.location.reload()}
          className="bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] font-medium"
        >
          Retry Connection
        </Button>

        {/* Footer */}
        <p className="mt-12 text-sm text-[var(--neutral-gray-400)]">
          © 2026 Project Atlas. All rights reserved.
        </p>
      </div>
    </div>
  );
}
