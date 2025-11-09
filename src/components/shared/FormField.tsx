/**
 * FormField Component
 * Reusable form field wrapper with label and error
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  hint?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  htmlFor,
  className,
  hint,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
