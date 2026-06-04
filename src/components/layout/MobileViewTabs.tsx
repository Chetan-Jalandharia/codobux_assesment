"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eye, Pencil } from "lucide-react";

export type MobileWorkspaceView = "editor" | "preview";

interface MobileViewTabsProps {
  activeView: MobileWorkspaceView;
  onChange: (view: MobileWorkspaceView) => void;
}

export function MobileViewTabs({ activeView, onChange }: MobileViewTabsProps) {
  return (
    <div
      className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 lg:hidden"
      role="tablist"
      aria-label="Workspace view"
    >
      <div className="flex gap-1 rounded-lg bg-[var(--surface-muted)] p-1">
        <TabButton
          active={activeView === "editor"}
          onClick={() => onChange("editor")}
          icon={<Pencil className="h-4 w-4" aria-hidden />}
          label="Editor"
        />
        <TabButton
          active={activeView === "preview"}
          onClick={() => onChange("preview")}
          icon={<Eye className="h-4 w-4" aria-hidden />}
          label="Preview"
        />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "interactive flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        active
          ? "bg-[var(--surface)] text-slate-900 shadow-[var(--shadow-sm)]"
          : "text-[var(--muted)] hover:text-slate-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
