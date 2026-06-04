"use client";

import { AddBlockMenu } from "./AddBlockMenu";
import { BlockList } from "./BlockList";
import { BlockEditor } from "./BlockEditor";
import { BlockControlsBar } from "./BlockControlsBar";
import { EmptyState } from "./EmptyState";
import { ExportImportMenu } from "./ExportImportMenu";
import { useBlocks } from "@/hooks/useBlockStore";

export function EditorPanel() {
  const blocks = useBlocks();
  const isEmpty = blocks.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface)]">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h2 className="text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
            Content
          </h2>
          {!isEmpty && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <AddBlockMenu />
          </div>
          <ExportImportMenu />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Block list — capped height */}
        <div
          className={
            isEmpty
              ? "shrink-0 px-4 py-4"
              : "max-h-[min(240px,32vh)] shrink-0 overflow-x-hidden overflow-y-auto overscroll-contain border-b border-[var(--border)] px-4 py-3"
          }
        >
          {isEmpty ? <EmptyState /> : <BlockList />}
        </div>

        {!isEmpty && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <BlockEditor />
          </div>
        )}
      </div>

      {!isEmpty && <BlockControlsBar />}
    </div>
  );
}
