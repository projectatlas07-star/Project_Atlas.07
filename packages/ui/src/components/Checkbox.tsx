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
          className={`h-4 w-4 rounded border border-input bg-transparent text-primary focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
