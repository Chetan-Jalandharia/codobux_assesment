/**
 * Block Validator
 * 
 * Validates block structure and content.
 * Ensures data integrity and type safety.
 */

import type { Block, BlockType } from "@/types/block.types";
import { VALID_BLOCK_TYPES } from "@/constants/block-types";

/**
 * Check if a block type is valid
 */
export function isValidBlockType(type: unknown): type is BlockType {
  return VALID_BLOCK_TYPES.includes(type as BlockType);
}

/**
 * Validate a block structure
 */
export function isValidBlock(block: unknown): block is Block {
  if (!block || typeof block !== "object") {
    return false;
  }

  const b = block as Record<string, unknown>;

  // Check required fields
  if (typeof b.id !== "string" || !b.id) {
    return false;
  }

  if (!isValidBlockType(b.type)) {
    return false;
  }

  if (typeof b.order !== "number" || b.order < 0) {
    return false;
  }

  // Check content object exists
  if (!b.content || typeof b.content !== "object") {
    return false;
  }

  // Validate based on type (basic validation)
  const content = b.content as Record<string, unknown>;

  switch (b.type) {
    case "hero":
      return (
        typeof content.title === "string" &&
        typeof content.subtitle === "string" &&
        typeof content.buttonText === "string"
      );

    case "features":
      return (
        typeof content.sectionTitle === "string" &&
        Array.isArray(content.cards) &&
        content.cards.every(
          (card: unknown) =>
            typeof card === "object" &&
            card !== null &&
            typeof (card as Record<string, unknown>).id === "string" &&
            typeof (card as Record<string, unknown>).title === "string" &&
            typeof (card as Record<string, unknown>).description === "string"
        )
      );

    case "testimonial":
      return (
        typeof content.quote === "string" &&
        typeof content.authorName === "string"
      );

    case "cta":
      return (
        typeof content.heading === "string" &&
        typeof content.buttonText === "string"
      );

    default:
      return false;
  }
}

/**
 * Validate an array of blocks
 */
export function isValidBlockArray(blocks: unknown): blocks is Block[] {
  if (!Array.isArray(blocks)) {
    return false;
  }

  return blocks.every((block) => isValidBlock(block));
}
