import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-[var(--neutral-gray-700)] dark:text-[var(--neutral-gray-200)]">{label}</label>}
        <input
          ref={ref}
          className={`rounded-md border border-[var(--neutral-gray-400)] bg-[var(--neutral-gray-100)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors dark:border-[var(--brand-navy-light)] dark:bg-[var(--surface-alt)] dark:placeholder:text-[var(--neutral-gray-400)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
