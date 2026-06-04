/**
 * Block Type Constants
 * 
 * Defines all available block types and their metadata.
 * This is the single source of truth for valid block types.
 */

import type { BlockType } from "@/types/block.types";

export const BLOCK_TYPES: Record<
  BlockType,
  {
    label: string;
    description: string;
    icon: string;
  }
> = {
  hero: {
    label: "Hero",
    description: "Large banner with title and CTA",
    icon: "Zap",
  },
  features: {
    label: "Features",
    description: "Showcase features with cards",
    icon: "Grid",
  },
  testimonial: {
    label: "Testimonial",
    description: "Customer quote and attribution",
    icon: "Quote",
  },
  cta: {
    label: "Call to Action",
    description: "Action block with heading and button",
    icon: "MessageSquare",
  },
};

export const VALID_BLOCK_TYPES: BlockType[] = Object.keys(
  BLOCK_TYPES
) as BlockType[];
