import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-[var(--neutral-gray-700)] dark:text-[var(--neutral-gray-200)]">{label}</label>}
        <textarea
          ref={ref}
          className={`rounded-md border border-[var(--neutral-gray-400)] dark:border-[var(--brand-navy-light)] bg-[var(--neutral-gray-100)] dark:bg-[var(--surface-alt)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--neutral-gray-500)] dark:placeholder:text-[var(--neutral-gray-400)] focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:border-[var(--neutral-gray-500)] dark:hover:border-[var(--brand-cyan)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
