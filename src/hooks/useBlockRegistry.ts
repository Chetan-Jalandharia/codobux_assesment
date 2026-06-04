/**
 * useBlockRegistry Hook
 * 
 * Provides access to the block registry for rendering components dynamically.
 */

import { useCallback } from "react";
import { getBlockEntry, isBlockTypeRegistered } from "@/components/blocks/registry";
import type { Block } from "@/types/block.types";

export function useBlockRegistry() {
  const getEditor = useCallback((type: Block["type"]) => {
    const entry = getBlockEntry(type);
    return entry.Editor;
  }, []);

  const getPreview = useCallback((type: Block["type"]) => {
    const entry = getBlockEntry(type);
    return entry.Preview;
  }, []);

  const isRegistered = useCallback((type: Block["type"]) => {
    return isBlockTypeRegistered(type);
  }, []);

  return {
    getEditor,
    getPreview,
    isRegistered,
  };
}
