"use client";

import { useState } from "react";
import { useAddBlock } from "@/hooks/useBlockStore";
import { BLOCK_TYPES, VALID_BLOCK_TYPES } from "@/constants/block-types";
import { BLOCK_ICONS } from "@/constants/block-icons";
import { Button } from "@/components/common/Button";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function AddBlockMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const addBlock = useAddBlock();

  const handleAddBlock = (blockType: (typeof VALID_BLOCK_TYPES)[number]) => {
    addBlock(blockType);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
        variant="default"
        size="md"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Plus size={17} aria-hidden />
        Add Block
        <ChevronDown
          size={15}
          className={cn("ml-auto opacity-80", isOpen && "rotate-180")}
          aria-hidden
        />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 z-20 mt-1.5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-md)]"
          role="menu"
        >
          {VALID_BLOCK_TYPES.map((blockType) => {
            const blockMeta = BLOCK_TYPES[blockType];
            const Icon = BLOCK_ICONS[blockType];

            return (
              <button
                key={blockType}
                type="button"
                role="menuitem"
                onClick={() => handleAddBlock(blockType)}
                className="interactive flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--surface-muted)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface-muted)] text-slate-500">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-800">
                    {blockMeta.label}
                  </span>
                  <span className="block truncate text-xs text-[var(--muted)]">
                    {blockMeta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-10 cursor-default"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
