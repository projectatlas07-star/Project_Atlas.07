'use client';

import Image from 'next/image';
import { Button } from '@project-atlas/ui';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-cyan)]/20 to-[var(--brand-purple)]/20 rounded-full animate-pulse" />
        <div className="absolute inset-4 flex items-center justify-center text-5xl">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md space-y-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="text-[var(--neutral-gray-500)]">{description}</p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {action && (
              <Button
                onClick={action.onClick}
                className="bg-[var(--brand-cyan)] hover:bg-[var(--brand-cyan-light)] text-[var(--brand-navy)] font-medium"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                className="border border-[var(--brand-purple)] text-[var(--brand-purple)] hover:bg-[var(--brand-purple)]/10 bg-transparent"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
