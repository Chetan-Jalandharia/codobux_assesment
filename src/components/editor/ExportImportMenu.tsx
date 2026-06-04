"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { useBlocks, usePersistence } from "@/hooks/useBlockStore";
import {
  downloadBlocksAsJSON,
  triggerJSONImport,
} from "@/utils/json-export";
import { Download, Upload, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export function ExportImportMenu() {
  const blocks = useBlocks();
  const { setBlocks } = usePersistence();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    if (blocks.length === 0) {
      alert("No blocks to export");
      return;
    }
    const filename = `blocks-${new Date().toISOString().split("T")[0]}.json`;
    downloadBlocksAsJSON(blocks, filename);
    setIsOpen(false);
  };

  const handleImport = () => {
    triggerJSONImport((importedBlocks) => {
      setBlocks(importedBlocks);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative shrink-0">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="md"
        className="w-12 px-0"
        aria-label="Export and import"
        aria-expanded={isOpen}
      >
        <EllipsisVertical size={18} aria-hidden />
      </Button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-md)]">
            <button
              type="button"
              onClick={handleExport}
              className="interactive flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-[var(--surface-muted)]"
            >
              <Download size={15} className="text-[var(--muted)]" aria-hidden />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleImport}
              className={cn(
                "interactive flex w-full items-center gap-2.5 border-t border-[var(--border-subtle)] px-3 py-2 text-left text-sm text-slate-700 hover:bg-[var(--surface-muted)]"
              )}
            >
              <Upload size={15} className="text-[var(--muted)]" aria-hidden />
              Import JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
