/**
 * Storage Service Interface
 * 
 * Defines the contract for block storage implementations.
 * This allows us to swap implementations (localStorage → IndexedDB → API)
 * without changing the rest of the codebase.
 */

import type { Block } from "@/types/block.types";

export interface IBlockStorage {
  /**
   * Save blocks to storage
   */
  save(blocks: Block[]): Promise<void>;

  /**
   * Load blocks from storage
   */
  load(): Promise<Block[]>;

  /**
   * Clear all blocks from storage
   */
  clear(): Promise<void>;

  /**
   * Check if storage is available
   */
  isAvailable(): boolean;
}
