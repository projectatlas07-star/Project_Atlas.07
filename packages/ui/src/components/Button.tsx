import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyle =
      variant === "primary"
        ? "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        : "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700";

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
