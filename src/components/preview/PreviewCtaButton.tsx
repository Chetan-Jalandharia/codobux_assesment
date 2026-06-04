import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PreviewCtaButtonProps {
  children: ReactNode;
  /** Tailwind classes for background + text (no variant merge issues) */
  className?: string;
}

/**
 * Decorative CTA for landing preview blocks only — not the editor Button component.
 */
export function PreviewCtaButton({ children, className }: PreviewCtaButtonProps) {
  return (
    <span
      role="presentation"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg",
        className
      )}
    >
      {children}
    </span>
  );
}
