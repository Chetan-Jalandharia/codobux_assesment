"use client";

import { useSelectedBlock, useBlockActions, useBlocks } from "@/hooks/useBlockStore";
import { Button } from "@/components/common/Button";
import { Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react";

export function BlockControlsBar() {
  const selectedBlock = useSelectedBlock();
  const blocks = useBlocks();
  const { deleteBlock, moveBlock, duplicateBlockAction } = useBlockActions();

  if (!selectedBlock) {
    return (
      <div className="shrink-0 border-t border-[var(--border)] px-4 py-3 text-center text-xs text-[var(--muted)]">
        Select a block for actions
      </div>
    );
  }

  const blockIndex = blocks.findIndex((b) => b.id === selectedBlock.id);
  const canMoveUp = blockIndex > 0;
  const canMoveDown = blockIndex < blocks.length - 1;

  return (
    <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface-muted)]/50 px-4 py-3">
      <p className="mb-2 text-xs font-medium text-[var(--muted)]">Actions</p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveBlock(selectedBlock.id, blockIndex - 1)}
          disabled={!canMoveUp}
        >
          <ChevronUp size={15} aria-hidden />
          Up
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => moveBlock(selectedBlock.id, blockIndex + 1)}
          disabled={!canMoveDown}
        >
          <ChevronDown size={15} aria-hidden />
          Down
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => duplicateBlockAction(selectedBlock.id)}
        >
          <Copy size={15} aria-hidden />
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => deleteBlock(selectedBlock.id)}
        >
          <Trash2 size={15} aria-hidden />
          Delete
        </Button>
      </div>
    </div>
  );
}
