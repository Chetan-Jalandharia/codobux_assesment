"use client";

import { useBlocksOrdered } from "@/hooks/useBlockStore";
import { PreviewContainer } from "./PreviewContainer";
import { BlockRenderer } from "./BlockRenderer";

export function PreviewPanel() {
  const blocks = useBlocksOrdered();

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--background)]">
      <div className="min-h-0 flex-1">
        <PreviewContainer>
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
              <p className="text-sm font-medium text-slate-700">
                Nothing to preview yet
              </p>
              <p className="max-w-xs text-sm text-[var(--muted)]">
                Add blocks in the editor — changes appear here instantly.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          )}
        </PreviewContainer>
      </div>
    </div>
  );
}
