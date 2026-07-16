import * as React from "react";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          ref={ref}
          className={`h-4 w-4 border border-input bg-transparent text-primary focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = "Radio";
