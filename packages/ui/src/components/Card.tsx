import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--neutral-gray-200)] dark:border-[var(--brand-navy-light)] rounded-xl shadow-md shadow-[var(--shadow-sm)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
