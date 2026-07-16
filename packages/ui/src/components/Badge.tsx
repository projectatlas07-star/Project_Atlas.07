import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: "bg-muted text-foreground border",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  error: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-info/10 text-info border-info/30",
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
  },
);

Badge.displayName = "Badge";
