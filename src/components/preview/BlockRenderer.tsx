/**
 * Block Renderer
 * 
 * Dynamically renders blocks based on their type.
 * Uses the block registry to get the correct preview component.
 */

"use client";

import { createElement } from "react";
import { useBlockRegistry } from "@/hooks/useBlockRegistry";
import type { Block } from "@/types/block.types";

interface BlockRendererProps {
  block: Block;
}

/**
 * Dynamically render a block using the registry
 */
export function BlockRenderer({ block }: BlockRendererProps) {
  const { getPreview, isRegistered } = useBlockRegistry();

  // Check if block type is registered
  if (!isRegistered(block.type)) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded text-center text-red-700">
        <p>Unknown block type: {block.type}</p>
      </div>
    );
  }

  // Get the preview component from registry
  const previewComponent = getPreview(block.type);

  // Render the preview component with the block data
  return createElement(previewComponent, { block });
}
