/**
 * localStorage Storage Implementation
 * 
 * Implements IBlockStorage using browser's localStorage.
 * Provides automatic persistence with error handling.
 */

import type { Block } from "@/types/block.types";
import type { IBlockStorage } from "./types";

const STORAGE_KEY = "cms-builder-blocks";

export class LocalStorageBlockStorage implements IBlockStorage {
  async save(blocks: Block[]): Promise<void> {
    try {
      const json = JSON.stringify(blocks);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      console.error("Failed to save blocks to localStorage:", error);
      throw error;
    }
  }

  async load(): Promise<Block[]> {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        return [];
      }
      return JSON.parse(json) as Block[];
    } catch (error) {
      console.error("Failed to load blocks from localStorage:", error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      throw error;
    }
  }

  isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
