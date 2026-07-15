import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-cyan)]";
    const variantStyle =
      variant === "primary"
        ? "bg-[var(--brand-cyan)] text-[var(--brand-navy)] hover:bg-[var(--brand-cyan-light)]"
        : "bg-[var(--neutral-gray-100)] text-[var(--foreground)] hover:bg-[var(--neutral-gray-200)] dark:bg-[var(--surface-alt)] dark:text-[var(--foreground)] dark:hover:bg-[var(--brand-navy-light)]";

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
