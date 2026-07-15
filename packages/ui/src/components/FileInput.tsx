import * as React from "react";

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && <label className="text-sm font-medium text-[var(--neutral-gray-700)] dark:text-[var(--neutral-gray-200)]">{label}</label>}
        <input
          type="file"
          ref={ref}
          className={`block w-full text-sm text-[var(--foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-cyan)] file:text-[var(--brand-navy)] hover:file:bg-[var(--brand-cyan-light)] transition-colors ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
