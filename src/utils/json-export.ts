/**
 * JSON Export/Import Utilities
 * 
 * Utilities for exporting and importing blocks as JSON.
 */

import type { Block } from "@/types/block.types";
import { isValidBlockArray } from "./block-validator";

/**
 * Export blocks as JSON string
 */
export function exportBlocksAsJSON(blocks: Block[]): string {
  return JSON.stringify(blocks, null, 2);
}

/**
 * Export blocks as a JSON file download
 */
export function downloadBlocksAsJSON(blocks: Block[], filename: string = "blocks.json") {
  const json = exportBlocksAsJSON(blocks);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import blocks from JSON string
 */
export function importBlocksFromJSON(json: string): Block[] | null {
  try {
    const parsed = JSON.parse(json);
    if (isValidBlockArray(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

/**
 * Create a file input element and handle JSON import
 */
export function createJSONImportHandler(onImport: (blocks: Block[]) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const blocks = importBlocksFromJSON(text);
      if (blocks) {
        onImport(blocks);
      } else {
        alert("Invalid blocks JSON format");
      }
    } catch (error) {
      console.error("Failed to read file:", error);
      alert("Failed to read file");
    }
  };

  return input;
}

/**
 * Trigger JSON file import
 */
export function triggerJSONImport(onImport: (blocks: Block[]) => void) {
  const input = createJSONImportHandler(onImport);
  input.click();
}
