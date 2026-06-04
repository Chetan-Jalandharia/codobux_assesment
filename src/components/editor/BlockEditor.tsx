"use client";

import { createElement } from "react";
import { useSelectedBlock, useBlockActions } from "@/hooks/useBlockStore";
import { useBlockRegistry } from "@/hooks/useBlockRegistry";
import { BLOCK_TYPES } from "@/constants/block-types";
import { BLOCK_ICONS } from "@/constants/block-icons";
import { Settings2 } from "lucide-react";

export function BlockEditor() {
  const selectedBlock = useSelectedBlock();
  const { updateBlock } = useBlockActions();
  const { getEditor, isRegistered } = useBlockRegistry();

  if (!selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
        <Settings2 className="h-7 w-7 text-slate-300" aria-hidden />
        <p className="text-sm text-slate-600">Select a block to edit</p>
      </div>
    );
  }

  if (!isRegistered(selectedBlock.type)) {
    return (
      <div className="p-4 text-sm text-red-600">
        Editor for &quot;{selectedBlock.type}&quot; is not registered.
      </div>
    );
  }

  const blockMeta = BLOCK_TYPES[selectedBlock.type];
  const Icon = BLOCK_ICONS[selectedBlock.type];
  const editorComponent = getEditor(selectedBlock.type);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--surface-muted)] text-slate-600">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {blockMeta.label}
          </h3>
          <p className="text-xs text-[var(--muted)]">Settings</p>
        </div>
      </div>
      {createElement(editorComponent, { block: selectedBlock, onChange: updateBlock })}
    </div>
  );
}
