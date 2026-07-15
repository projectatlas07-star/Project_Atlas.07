import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: "bg-[var(--neutral-gray-100)] text-[var(--neutral-gray-700)] border-[var(--neutral-gray-400)] dark:bg-[var(--surface-alt)] dark:text-[var(--neutral-gray-200)] dark:border-[var(--brand-navy-light)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30 dark:bg-[var(--color-success)]/10 dark:text-[var(--color-success)] dark:border-[var(--color-success)]/30",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30 dark:bg-[var(--color-warning)]/10 dark:text-[var(--color-warning)] dark:border-[var(--color-warning)]/30",
  error: "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/30 dark:bg-[var(--color-error)]/10 dark:text-[var(--color-error)] dark:border-[var(--color-error)]/30",
  info: "bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/30 dark:bg-[var(--color-info)]/10 dark:text-[var(--color-info)] dark:border-[var(--color-info)]/30",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", children, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
