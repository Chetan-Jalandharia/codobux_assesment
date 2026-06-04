/**
 * Block Factory
 * 
 * Factory functions for creating and manipulating blocks.
 * Centralizes block creation logic.
 */

import type { Block, BlockType } from "@/types/block.types";
import { createDefaultBlock } from "@/constants/default-blocks";

/**
 * Generate a unique ID for a block
 */
export function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new block with default content
 */
export function createNewBlock(
  type: BlockType,
  order: number
): Block {
  const id = generateBlockId();
  return createDefaultBlock(type, id, order);
}

/**
 * Create a duplicate of an existing block
 */
export function duplicateBlock(block: Block, newOrder: number): Block {
  const newBlock: Block = {
    ...block,
    id: generateBlockId(),
    order: newOrder,
  };

  // Deep copy content object
  if (block.type === "features") {
    newBlock.content = {
      ...block.content,
      cards: block.content.cards.map((card) => ({
        ...card,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
  } else {
    newBlock.content = JSON.parse(JSON.stringify(block.content));
  }

  return newBlock;
}

/**
 * Reorder blocks after an insertion or deletion
 */
export function reorderBlocks(blocks: Block[]): Block[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * Sort by `order` and normalize indices so store array order matches display order.
 * Use after load/import so reorder/move operations stay consistent.
 */
export function normalizeBlocks(blocks: Block[]): Block[] {
  return reorderBlocks([...blocks].sort((a, b) => a.order - b.order));
}
