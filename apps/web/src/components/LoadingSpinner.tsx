'use client';

import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Branded Logo Animation */}
      <div className="relative animate-pulse">
        <div className={`relative ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'}`}>
          <Image
            src="/brand/logo-icon.svg"
            alt="Loading"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2">
        <div className={`${sizeClasses[size]} bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-0`} />
        <div className={`${sizeClasses[size]} bg-[var(--brand-purple)] rounded-full animate-bounce animate-delay-150`} />
        <div className={`${sizeClasses[size]} bg-[var(--brand-cyan)] rounded-full animate-bounce animate-delay-300`} />
      </div>

      {/* Optional Text */}
      {text && (
        <p className="text-sm text-[var(--neutral-gray-500)] animate-pulse">{text}</p>
      )}
    </div>
  );
}
