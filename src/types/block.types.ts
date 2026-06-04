/**
 * Block Type Definitions
 * 
 * This file contains all block type definitions using discriminated unions.
 * This ensures type safety and allows TypeScript to catch errors at compile time.
 */

// ============================================================================
// BASE BLOCK INTERFACE
// ============================================================================

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

// ============================================================================
// BLOCK TYPE DEFINITIONS (DISCRIMINATED UNIONS)
// ============================================================================

export interface HeroBlock extends BaseBlock {
  type: "hero";
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

export interface FeaturesBlock extends BaseBlock {
  type: "features";
  content: {
    sectionTitle: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
}

export interface TestimonialBlock extends BaseBlock {
  type: "testimonial";
  content: {
    quote: string;
    authorName: string;
  };
}

export interface CTABlock extends BaseBlock {
  type: "cta";
  content: {
    heading: string;
    buttonText: string;
  };
}

// ============================================================================
// UNION TYPES
// ============================================================================

/**
 * Discriminated union of all block types.
 * This ensures type safety when working with blocks.
 * 
 * Example:
 * function renderBlock(block: Block) {
 *   if (block.type === 'hero') {
 *     // TypeScript knows block is HeroBlock here
 *     console.log(block.content.title)
 *   }
 * }
 */
export type Block = HeroBlock | FeaturesBlock | TestimonialBlock | CTABlock;

/**
 * Union of all possible block types (string literals)
 */
export type BlockType = "hero" | "features" | "testimonial" | "cta";

// ============================================================================
// BLOCK CONTENT TYPES (for easier extraction)
// ============================================================================

export type BlockContent = Block["content"];

// ============================================================================
// EDITOR TYPES
// ============================================================================

/**
 * Props for block editor components
 */
export interface BlockEditorProps {
  block: Block;
  onChange: (id: string, content: Partial<Block["content"]>) => void;
}

/**
 * Props for block preview components
 */
export interface BlockPreviewProps {
  block: Block;
}
