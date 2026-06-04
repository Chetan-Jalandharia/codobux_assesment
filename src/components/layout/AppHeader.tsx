"use client";

import { LayoutTemplate } from "lucide-react";
import { useBlockCount } from "@/hooks/useBlockStore";

export function AppHeader() {
  const blockCount = useBlockCount();

  return (
    <header className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-slate-600">
            <LayoutTemplate className="h-[18px] w-[18px]" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Landing Page Builder
            </h1>
            <p className="hidden text-sm text-[var(--muted)] sm:block">
              Build and preview your page in real time
            </p>
          </div>
        </div>

        <span className="shrink-0 text-sm text-[var(--muted)]">
          <span className="font-medium text-slate-700">{blockCount}</span>
          {blockCount === 1 ? " block" : " blocks"}
        </span>
      </div>
    </header>
  );
}
