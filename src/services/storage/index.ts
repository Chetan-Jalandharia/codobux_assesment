/**
 * Storage Service Factory
 * 
 * Creates and exports the appropriate storage implementation.
 * Currently uses localStorage, but can be swapped easily.
 */

import { LocalStorageBlockStorage } from "./localStorage";
import type { IBlockStorage } from "./types";

// Create singleton instance
const storage: IBlockStorage = new LocalStorageBlockStorage();

export { storage };
export type { IBlockStorage };
