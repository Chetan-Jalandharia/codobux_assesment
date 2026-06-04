import { ReactNode } from "react";

interface PreviewContainerProps {
  children: ReactNode;
}

/**
 * Clean light preview frame — no browser chrome, full-height scroll.
 */
export function PreviewContainer({ children }: PreviewContainerProps) {
  return (
    <div className="flex h-full min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-5">
      <p className="mb-3 shrink-0 text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
        Live preview
      </p>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
