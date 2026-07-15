import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={`h-4 w-4 rounded border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] text-[var(--brand-cyan)] focus:ring-[var(--brand-cyan)] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {label && <span className="text-sm text-[var(--foreground)]">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
