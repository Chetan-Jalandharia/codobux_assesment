/**
 * Default Block Content
 * 
 * Provides default/template content for new blocks.
 * This ensures consistency when users create new blocks.
 */

import type { Block } from "@/types/block.types";

export function createHeroBlock(id: string, order: number): Block {
  return {
    id,
    type: "hero",
    order,
    content: {
      title: "Welcome to our site",
      subtitle: "This is a hero block",
      buttonText: "Get Started",
    },
  };
}

export function createFeaturesBlock(id: string, order: number): Block {
  return {
    id,
    type: "features",
    order,
    content: {
      sectionTitle: "Our Features",
      cards: [
        {
          id: `${id}-feature-1`,
          title: "Feature One",
          description: "Description of the first feature",
        },
        {
          id: `${id}-feature-2`,
          title: "Feature Two",
          description: "Description of the second feature",
        },
      ],
    },
  };
}

export function createTestimonialBlock(id: string, order: number): Block {
  return {
    id,
    type: "testimonial",
    order,
    content: {
      quote: "This is an amazing product!",
      authorName: "John Doe",
    },
  };
}

export function createCTABlock(id: string, order: number): Block {
  return {
    id,
    type: "cta",
    order,
    content: {
      heading: "Ready to get started?",
      buttonText: "Sign Up",
    },
  };
}

/**
 * Factory function to create default blocks by type
 */
export function createDefaultBlock(
  type: Block["type"],
  id: string,
  order: number
): Block {
  switch (type) {
    case "hero":
      return createHeroBlock(id, order);
    case "features":
      return createFeaturesBlock(id, order);
    case "testimonial":
      return createTestimonialBlock(id, order);
    case "cta":
      return createCTABlock(id, order);
    default:
      const exhaustive: never = type;
      throw new Error(`Unknown block type: ${exhaustive}`);
  }
}
