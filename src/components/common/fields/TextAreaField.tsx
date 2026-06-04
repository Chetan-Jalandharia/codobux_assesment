import React, { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ label, error, helperText, className, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "interactive w-full resize-none rounded-md border bg-[var(--surface)] px-3 py-2 text-sm text-slate-900 placeholder:text-[var(--muted-foreground)]",
          "focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20",
          error ? "border-red-300" : "border-[var(--border)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[var(--muted)]">{helperText}</p>
      )}
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";
