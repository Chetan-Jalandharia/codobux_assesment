"use client";

import {
  useBlocks,
  useSelectedBlockId,
  useSelectBlock,
  useBlockActions,
} from "@/hooks/useBlockStore";
import { DragDropProvider } from "@/hooks/useDragDrop";
import type { Block } from "@/types/block.types";
import { BLOCK_TYPES } from "@/constants/block-types";
import { BLOCK_ICONS } from "@/constants/block-icons";
import { DraggableBlockItem } from "@/components/common/DraggableBlockItem";
import { cn } from "@/lib/cn";

export function BlockList() {
  const blocks = useBlocks();
  const selectedId = useSelectedBlockId();
  const selectBlock = useSelectBlock();
  const { moveBlock } = useBlockActions();

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const block = sortedBlocks[fromIndex];
    if (block) {
      moveBlock(block.id, toIndex);
    }
  };

  return (
    <DragDropProvider
      items={sortedBlocks}
      onReorder={handleReorder}
      renderOverlay={(activeId) => {
        const block = sortedBlocks.find((b) => b.id === activeId);
        if (!block) return null;
        return <BlockListItemOverlay block={block} />;
      }}
    >
      <ul className="space-y-1 overflow-x-hidden" role="list">
        {sortedBlocks.map((block) => (
          <DraggableBlockItem
            key={block.id}
            id={block.id}
            isSelected={selectedId === block.id}
          >
            <BlockListItem
              block={block}
              isSelected={selectedId === block.id}
              onSelect={() => selectBlock(block.id)}
            />
          </DraggableBlockItem>
        ))}
      </ul>
    </DragDropProvider>
  );
}

interface BlockListItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
}

function BlockListItem({ block, isSelected, onSelect }: BlockListItemProps) {
  const blockType = BLOCK_TYPES[block.type];
  const Icon = BLOCK_ICONS[block.type];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "interactive relative w-full rounded-lg px-3 py-2.5 text-left",
        isSelected
          ? "bg-[var(--primary-muted)]"
          : "hover:bg-[var(--surface-muted)]"
      )}
    >
      {isSelected && (
        <span
          className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-[var(--accent-bar)]"
          aria-hidden
        />
      )}
      <div className="flex items-center gap-2.5 pl-1">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
            isSelected
              ? "bg-white text-[var(--primary)]"
              : "bg-[var(--surface-muted)] text-slate-500"
          )}
        >
          <Icon size={15} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">{blockType.label}</p>
          <p className="truncate text-xs text-[var(--muted)]">
            {getBlockPreview(block)}
          </p>
        </div>
        <span className="shrink-0 text-[10px] tabular-nums text-[var(--muted-foreground)]">
          {block.order + 1}
        </span>
      </div>
    </button>
  );
}

/** Compact clone for drag overlay (no layout shift in scroll area) */
function BlockListItemOverlay({ block }: { block: Block }) {
  const blockType = BLOCK_TYPES[block.type];
  const Icon = BLOCK_ICONS[block.type];

  return (
    <div className="flex w-[min(100%,320px)] cursor-grabbing items-center gap-2.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 shadow-lg">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-muted)] text-slate-500">
        <Icon size={15} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800">{blockType.label}</p>
        <p className="truncate text-xs text-[var(--muted)]">
          {getBlockPreview(block)}
        </p>
      </div>
    </div>
  );
}

function getBlockPreview(block: Block): string {
  switch (block.type) {
    case "hero":
      return block.content.title?.slice(0, 48) || "Untitled";
    case "features":
      return `${block.content.cards?.length ?? 0} cards`;
    case "testimonial":
      return block.content.quote?.slice(0, 48) || "Untitled";
    case "cta":
      return block.content.heading?.slice(0, 48) || "Untitled";
    default:
      return "Unknown";
  }
}
