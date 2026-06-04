/**
 * Block Registry
 * 
 * Maps block types to their editor and preview components.
 * This is the single source of truth for block type mappings.
 * 
 * By using a registry pattern, we:
 * - Enable dynamic component loading
 * - Support future plugin systems
 * - Eliminate hardcoded if/switch statements
 * - Make it easy to add new block types
 */

import type { ComponentType } from "react";
import type { Block, BlockPreviewProps, BlockEditorProps } from "@/types/block.types";

// Import Hero block components
import { HeroEditor } from "./hero/HeroEditor";
import { HeroPreview } from "./hero/HeroPreview";

// Import Features block components
import { FeaturesEditor } from "./features/FeaturesEditor";
import { FeaturesPreview } from "./features/FeaturesPreview";

// Import Testimonial block components
import { TestimonialEditor } from "./testimonial/TestimonialEditor";
import { TestimonialPreview } from "./testimonial/TestimonialPreview";

// Import CTA block components
import { CTAEditor } from "./cta/CTAEditor";
import { CTAPreview } from "./cta/CTAPreview";

export interface BlockRegistryEntry {
  Editor: ComponentType<BlockEditorProps>;
  Preview: ComponentType<BlockPreviewProps>;
}

export type BlockRegistry = Record<Block["type"], BlockRegistryEntry>;

/**
 * Helper to construct registry entries type-safely.
 * Casts block-specific editor/preview components to general BlockEditorProps/BlockPreviewProps.
 */
function createRegistryEntry<T extends Block>(
  Editor: ComponentType<{ block: T; onChange: (id: string, content: Partial<Block["content"]>) => void }>,
  Preview: ComponentType<{ block: T }>
): BlockRegistryEntry {
  return {
    Editor: Editor as unknown as ComponentType<BlockEditorProps>,
    Preview: Preview as unknown as ComponentType<BlockPreviewProps>,
  };
}

/**
 * The block registry - maps block types to their components
 */
export const blockRegistry: BlockRegistry = {
  hero: createRegistryEntry(HeroEditor, HeroPreview),
  features: createRegistryEntry(FeaturesEditor, FeaturesPreview),
  testimonial: createRegistryEntry(TestimonialEditor, TestimonialPreview),
  cta: createRegistryEntry(CTAEditor, CTAPreview),
};

/**
 * Get a block component entry by type
 * Throws error if block type is not registered
 */
export function getBlockEntry(type: Block["type"]): BlockRegistryEntry {
  const entry = blockRegistry[type];
  if (!entry) {
    throw new Error(
      `Block type "${type}" is not registered. Available types: ${Object.keys(blockRegistry).join(", ")}`
    );
  }
  return entry;
}

/**
 * Check if a block type is registered
 */
export function isBlockTypeRegistered(type: Block["type"]): boolean {
  return type in blockRegistry;
}

/**
 * Get all registered block types
 */
export function getRegisteredBlockTypes(): Array<Block["type"]> {
  return Object.keys(blockRegistry) as Array<Block["type"]>;
}
