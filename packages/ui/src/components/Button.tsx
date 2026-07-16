import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyle =
      variant === "primary"
        ? "bg-[var(--brand-cyan)] text-[var(--brand-navy)] hover:bg-[var(--brand-cyan-light)] hover:shadow-brand"
        : "bg-[var(--surface)] border border-white/15 text-[var(--foreground)] hover:bg-[var(--surface-alt)] hover:border-white/25";

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyle} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
