import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
        <input
          ref={ref}
          className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
