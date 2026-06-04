"use client";

import { useState } from "react";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { AppHeader } from "./AppHeader";
import { MobileViewTabs, type MobileWorkspaceView } from "./MobileViewTabs";
import { cn } from "@/lib/cn";

export function WorkspaceShell() {
  const [mobileView, setMobileView] = useState<MobileWorkspaceView>("editor");

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--background)]">
      <AppHeader />
      <MobileViewTabs activeView={mobileView} onChange={setMobileView} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section
          className={cn(
            "flex min-h-0 flex-col lg:w-[min(400px,36%)] lg:max-w-[420px] lg:flex-none lg:border-r lg:border-[var(--border)]",
            mobileView === "editor" ? "flex flex-1" : "hidden lg:flex"
          )}
          aria-label="Block editor"
        >
          <EditorPanel />
        </section>

        <section
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            mobileView === "preview" ? "flex" : "hidden lg:flex"
          )}
          aria-label="Live preview"
        >
          <PreviewPanel />
        </section>
      </div>
    </main>
  );
}
