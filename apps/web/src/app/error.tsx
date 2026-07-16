'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@project-atlas/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-error)]/20 to-[var(--color-error)]/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            ⚠️
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">500</h1>
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">Something went wrong</h2>
        <p className="text-[var(--neutral-gray-500)] mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] font-medium"
          >
            Try Again
          </Button>
          <Link href="/admin">
            <Button className="border border-[var(--brand-purple)] text-[var(--brand-purple)] hover:bg-[var(--brand-purple)]/10 bg-transparent">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-[var(--neutral-gray-400)]">
          © 2026 Project Atlas. All rights reserved.
        </p>
      </div>
    </div>
  );
}
