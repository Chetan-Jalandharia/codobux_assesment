/**
 * Editor-specific Type Definitions
 */

import type { Block, BlockType } from "./block.types";

export interface EditorState {
  selectedBlockId: string | null;
}

/**
 * Action payload types for better type safety
 */
export interface AddBlockPayload {
  type: BlockType;
  index?: number;
}

export interface UpdateBlockPayload {
  id: string;
  content: Partial<Block["content"]>;
}

export interface MoveBlockPayload {
  id: string;
  newIndex: number;
}
