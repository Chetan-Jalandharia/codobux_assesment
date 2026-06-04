/**
 * CMS Store (Zustand)
 * 
 * Central state management for the CMS application.
 * Handles all block operations and UI state.
 * 
 * State is immutable and updates are atomic.
 */

import { create } from "zustand";
import type { Block, BlockType } from "@/types/block.types";
import { storage } from "@/services/storage";
import {
  createNewBlock,
  duplicateBlock,
  reorderBlocks,
  normalizeBlocks,
} from "@/utils/block-factory";

export interface CMSStore {
  // State
  blocks: Block[];
  selectedBlockId: string | null;
  isLoading: boolean;

  // Actions - Block Management
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, content: Partial<Block["content"]>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, newIndex: number) => void;
  duplicateBlockAction: (id: string) => void;
  selectBlock: (id: string | null) => void;

  // Actions - Persistence
  loadBlocks: () => Promise<void>;
  saveBlocks: () => Promise<void>;
  clearBlocks: () => Promise<void>;

  // Actions - Batch
  setBlocks: (blocks: Block[]) => void;
}

export const useCMSStore = create<CMSStore>((set, get) => ({
  // ========================================================================
  // INITIAL STATE
  // ========================================================================
  blocks: [],
  selectedBlockId: null,
  isLoading: false,

  // ========================================================================
  // BLOCK MANAGEMENT ACTIONS
  // ========================================================================

  addBlock: (type: BlockType, index?: number) => {
    set((state) => {
      const newBlock = createNewBlock(type, index ?? state.blocks.length);

      let newBlocks: Block[];
      if (index !== undefined && index >= 0 && index <= state.blocks.length) {
        // Insert at specific index
        newBlocks = [
          ...state.blocks.slice(0, index),
          newBlock,
          ...state.blocks.slice(index),
        ];
      } else {
        // Add to end
        newBlocks = [...state.blocks, newBlock];
      }

      // Reorder all blocks to ensure sequential order
      newBlocks = reorderBlocks(newBlocks);

      // Auto-save to localStorage
      storage.save(newBlocks as Block[]).catch(console.error);

      return {
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
      };
    });
  },

  updateBlock: (id: string, content: Partial<Block["content"]>) => {
    set((state) => {
      const newBlocks = state.blocks.map((block) => {
        if (block.id === id) {
          return {
            ...block,
            content: {
              ...block.content,
              ...content,
            },
          };
        }
        return block;
      });

      // Auto-save to localStorage
      storage.save(newBlocks as Block[]).catch(console.error);

      return { blocks: newBlocks as Block[] };
    });
  },

  deleteBlock: (id: string) => {
    set((state) => {
      const newBlocks = state.blocks.filter((block) => block.id !== id);
      const reordered = reorderBlocks(newBlocks);

      // Auto-save to localStorage
      storage.save(reordered as Block[]).catch(console.error);

      return {
        blocks: reordered,
        selectedBlockId:
          state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    });
  },

  moveBlock: (id: string, newIndex: number) => {
    set((state) => {
      const blockIndex = state.blocks.findIndex((b) => b.id === id);
      if (blockIndex === -1 || newIndex < 0 || newIndex >= state.blocks.length)
        return state;

      const newBlocks = [...state.blocks];
      const [block] = newBlocks.splice(blockIndex, 1);
      newBlocks.splice(newIndex, 0, block);

      const reordered = reorderBlocks(newBlocks);

      // Auto-save to localStorage
      storage.save(reordered as Block[]).catch(console.error);

      return { blocks: reordered };
    });
  },

  duplicateBlockAction: (id: string) => {
    set((state) => {
      const block = state.blocks.find((b) => b.id === id);
      if (!block) return state;

      const blockIndex = state.blocks.findIndex((b) => b.id === id);
      const newBlock = duplicateBlock(block, blockIndex + 1);

      const newBlocks = [
        ...state.blocks.slice(0, blockIndex + 1),
        newBlock,
        ...state.blocks.slice(blockIndex + 1),
      ];

      const reordered = reorderBlocks(newBlocks);

      // Auto-save to localStorage
      storage.save(reordered).catch(console.error);

      return {
        blocks: reordered,
        selectedBlockId: newBlock.id,
      };
    });
  },

  selectBlock: (id: string | null) => {
    set({ selectedBlockId: id });
  },

  // ========================================================================
  // PERSISTENCE ACTIONS
  // ========================================================================

  loadBlocks: async () => {
    set({ isLoading: true });
    try {
      const blocks = await storage.load();
      set({
        blocks: blocks.length > 0 ? normalizeBlocks(blocks) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load blocks:", error);
      set({ isLoading: false });
    }
  },

  saveBlocks: async () => {
    try {
      const state = get();
      await storage.save(state.blocks);
    } catch (error) {
      console.error("Failed to save blocks:", error);
    }
  },

  clearBlocks: async () => {
    try {
      await storage.clear();
      set({ blocks: [], selectedBlockId: null });
    } catch (error) {
      console.error("Failed to clear blocks:", error);
    }
  },

  // ========================================================================
  // BATCH ACTIONS
  // ========================================================================

  setBlocks: (blocks: Block[]) => {
    const normalized = normalizeBlocks(blocks);
    set({ blocks: normalized });
    storage.save(normalized).catch(console.error);
  },
}));
