/**
 * Custom Hooks for CMS Store
 *
 * Provides convenient access to store state and actions.
 * Each hook is specialized for specific use cases.
 *
 * Selectors that return new arrays/objects must use `shallow` equality.
 * Otherwise React 19's useSyncExternalStore re-subscribes every render and
 * triggers "getServerSnapshot should be cached" / infinite update loops.
 */

"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCMSStore, type CMSStore } from "@/store/cms-store";
import type { Block } from "@/types/block.types";

/**
 * Hook to access all blocks (canonical order; normalized on load/import)
 */
export function useBlocks(): Block[] {
  return useCMSStore((state) => state.blocks);
}

/**
 * Hook to access a specific block by ID
 */
export function useBlockById(id: string): Block | undefined {
  return useCMSStore((state) =>
    state.blocks.find((block) => block.id === id)
  );
}

/**
 * Hook to access the selected block ID
 */
export function useSelectedBlockId(): string | null {
  return useCMSStore((state) => state.selectedBlockId);
}

/**
 * Hook to access the currently selected block
 */
export function useSelectedBlock(): Block | undefined {
  const selectedId = useSelectedBlockId();
  return useCMSStore((state) =>
    selectedId ? state.blocks.find((b) => b.id === selectedId) : undefined
  );
}

/**
 * Hook for block actions (stable object reference via shallow compare)
 */
export function useBlockActions(): Pick<
  CMSStore,
  | "addBlock"
  | "updateBlock"
  | "deleteBlock"
  | "moveBlock"
  | "duplicateBlockAction"
  | "selectBlock"
> {
  return useCMSStore(
    useShallow((state) => ({
      addBlock: state.addBlock,
      updateBlock: state.updateBlock,
      deleteBlock: state.deleteBlock,
      moveBlock: state.moveBlock,
      duplicateBlockAction: state.duplicateBlockAction,
      selectBlock: state.selectBlock,
    }))
  );
}

/**
 * Hook for persistence actions
 */
export function usePersistence() {
  const loadBlocks = useCMSStore((s) => s.loadBlocks);
  const saveBlocks = useCMSStore((s) => s.saveBlocks);
  const clearBlocks = useCMSStore((s) => s.clearBlocks);
  const setBlocks = useCMSStore((s) => s.setBlocks);
  const isLoading = useCMSStore((s) => s.isLoading);

  return useMemo(
    () => ({ loadBlocks, saveBlocks, clearBlocks, setBlocks, isLoading }),
    [loadBlocks, saveBlocks, clearBlocks, setBlocks, isLoading]
  );
}

/**
 * Blocks sorted by `order` for preview.
 * Shallow equality avoids a new snapshot reference when order/content is unchanged.
 */
export function useBlocksOrdered(): Block[] {
  return useCMSStore(
    useShallow((state) =>
      [...state.blocks].sort((a, b) => a.order - b.order)
    )
  );
}

/**
 * Hook to add a new block
 */
export function useAddBlock() {
  return useCMSStore((state) => state.addBlock);
}

/**
 * Hook to select a block
 */
export function useSelectBlock() {
  return useCMSStore((state) => state.selectBlock);
}

/**
 * Hook to check if a block exists by ID
 */
export function useBlockExists(id: string): boolean {
  return useCMSStore((state) => state.blocks.some((block) => block.id === id));
}

/**
 * Hook to get block count
 */
export function useBlockCount(): number {
  return useCMSStore((state) => state.blocks.length);
}
