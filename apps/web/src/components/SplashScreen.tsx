'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--brand-navy)] transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading Project Atlas"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Full Logo */}
        <div className="relative w-64 h-20 animate-pulse">
          <Image
            src="/brand/logo-full.svg"
            alt="Project Atlas"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Subtitle */}
        <p className="text-[var(--brand-cyan)] text-lg font-medium tracking-wide">
          AI Operating System for Insurance Restoration
        </p>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[var(--brand-cyan)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[var(--brand-purple)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[var(--brand-cyan)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
