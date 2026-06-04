<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Codobux CMS Builder — Agent Context

## What This Project Is

A CMS-style landing page builder built as a frontend engineering assessment.

- **Left panel:** Editor — add, edit, reorder, delete, duplicate blocks
- **Right panel:** Live preview — renders the same blocks in marketing/landing-page style
- **State:** Zustand (`src/store/cms-store.ts`) — single store, shared by editor and preview
- **Block types:** `hero` | `features` | `testimonial` | `cta`
- **Persistence:** Auto-save to `localStorage` via storage service abstraction
- **DnD:** `@dnd-kit` vertical reorder + up/down buttons as accessible fallback
- **Mobile:** Segmented tab control (Editor / Preview) below `md` breakpoint

---

## Stack

| Layer | Version | Notes |
|-------|---------|-------|
| Next.js | 16 (App Router) | `src/app/` layout + page |
| React | 19 | Requires `useShallow` for Zustand — see below |
| TypeScript | 5 (strict) | Discriminated union Block types |
| Tailwind CSS | v4 | PostCSS pipeline, no `tailwind.config.js` |
| Zustand | 5 | `useShallow` from `zustand/react/shallow` |
| @dnd-kit | core + sortable + modifiers | Vertical-only reorder |
| CVA | class-variance-authority | `Button` component only |

---

## Critical Rules — Read Before Editing Anything

### 1. Block rendering is registry-based — never hardcode
Do **not** add `<HeroBlock />`, `<FeaturesBlock />` etc. directly in `page.tsx` or any container.  
Always go through the registry:

```ts
// src/components/blocks/registry.ts
const entry = getBlockEntry(block.type); // throws if unregistered
<entry.Editor block={block} onChange={...} />
<entry.Preview block={block} />
```

### 2. No localStorage calls in components
All persistence goes through `src/services/storage`:

```ts
import { storage } from "@/services/storage";
await storage.save(blocks);
await storage.load();
await storage.clear();
```

The Zustand store handles all calls to `storage` internally. Components call store actions only.

### 3. Zustand + React 19 — useShallow is mandatory for derived values
Any selector that returns a **new array or object reference** on every call will cause an infinite re-render loop in React 19 (`getServerSnapshot should be cached` / `Maximum update depth exceeded`).

```ts
// ✅ Correct
import { useShallow } from "zustand/react/shallow";
export function useBlocksOrdered() {
  return useCMSStore(
    useShallow((state) => [...state.blocks].sort((a, b) => a.order - b.order))
  );
}

// ❌ Wrong — new array every render → infinite loop
export function useBlocksOrdered() {
  return useCMSStore((state) =>
    [...state.blocks].sort((a, b) => a.order - b.order)
  );
}
```

`useShallow` is applied in `src/hooks/useBlockStore.ts` to `useBlocksOrdered` and `useBlockActions`. Don't remove it.

### 4. PreviewCtaButton ≠ editor Button
The editor `Button` uses CVA with `text-white` as a base class. In preview landing-page context this makes button text invisible against certain backgrounds.

- **Editor UI:** use `Button` from `src/components/common/Button.tsx`
- **Preview landing blocks:** use `PreviewCtaButton` from `src/components/preview/PreviewCtaButton.tsx`

Do **not** use the editor `Button` inside any preview block component.

### 5. DnD — axis constraint and overflow
Block list DnD must use:
- `restrictToVerticalAxis` + `restrictToParentElement` from `@dnd-kit/modifiers`
- Block list container must have `overflow-x-hidden` — without it, horizontal scroll appears during drag

### 6. Block normalization after load/import
After loading from localStorage or importing JSON, always pass blocks through `normalizeBlocks()`:

```ts
import { normalizeBlocks } from "@/utils/block-factory";
const clean = normalizeBlocks(rawBlocks); // sorts by .order, reassigns sequential indices
```

This is already done in `loadBlocks()` and `setBlocks()` in the store. Don't skip it.

### 7. Light theme only
Editor chrome is light theme. No dark mode toggle. No dark: Tailwind variants in editor layout components. Preview blocks can use colored/gradient backgrounds.

---

## Key File Map

| Concern | Path |
|---------|------|
| Zustand store | `src/store/cms-store.ts` |
| Store hooks (selectors) | `src/hooks/useBlockStore.ts` |
| Block type definitions | `src/types/block.types.ts` |
| Block registry | `src/components/blocks/registry.ts` |
| Editor shell | `src/components/layout/WorkspaceShell.tsx` |
| App header (export/import/clear) | `src/components/layout/AppHeader.tsx` |
| Preview panel | `src/components/preview/PreviewPanel.tsx` |
| Block renderer (preview) | `src/components/preview/BlockRenderer.tsx` |
| Block editor resolver | `src/components/editor/BlockEditor.tsx` |
| Storage service | `src/services/storage/localStorage.ts` |
| Storage interface | `src/services/storage/interface.ts` |
| DnD hook | `src/hooks/useDragDrop.tsx` |
| Block factory utils | `src/utils/block-factory.ts` |
| JSON import validator | `src/utils/block-validator.ts` |
| JSON export/import logic | `src/utils/json-export.ts` |
| Default block content | `src/constants/default-blocks.ts` |

---

## How to Add a New Block Type

1. **Add to union** — `src/types/block.types.ts`: add `NewBlock extends BaseBlock` + add to `Block` union + add to `BlockType`
2. **Add defaults** — `src/constants/default-blocks.ts`: add default content for the new type
3. **Create components** — `src/components/blocks/newtype/NewTypeEditor.tsx` + `NewTypePreview.tsx`
4. **Register** — `src/components/blocks/registry.ts`: one line `newtype: { Editor: NewTypeEditor, Preview: NewTypePreview }`

That's it. No changes to `page.tsx`, `BlockRenderer`, or `BlockEditor`.

---

## Block Data Model

```ts
// Every block
interface BaseBlock {
  id: string;       // "block-{timestamp}-{random}"
  type: BlockType;  // "hero" | "features" | "testimonial" | "cta"
  order: number;    // 0-indexed, sequential, reassigned on every mutation
}

// Content shapes per type
HeroBlock.content       = { title, subtitle, buttonText }
FeaturesBlock.content   = { sectionTitle, cards: Array<{ id, title, description }> }
TestimonialBlock.content = { quote, authorName }
CTABlock.content        = { heading, buttonText }
```

---

## Store Actions Quick Reference

| Action | Signature | Notes |
|--------|-----------|-------|
| `addBlock` | `(type, index?) => void` | Inserts at index or end; auto-saves |
| `updateBlock` | `(id, Partial<content>) => void` | Merges content; auto-saves |
| `deleteBlock` | `(id) => void` | Removes + reorders; auto-saves |
| `moveBlock` | `(id, newIndex) => void` | Splice to new position; auto-saves |
| `duplicateBlockAction` | `(id) => void` | Deep copy; inserts after source; auto-saves |
| `selectBlock` | `(id \| null) => void` | Sets selectedBlockId only |
| `loadBlocks` | `() => Promise<void>` | Async; normalizes on load |
| `saveBlocks` | `() => Promise<void>` | Manual save (auto-save is primary) |
| `clearBlocks` | `() => Promise<void>` | Wipes storage + resets state |
| `setBlocks` | `(blocks) => void` | Batch set (used by JSON import); normalizes |

---

## Commands

```bash
npm run dev    # start development server (http://localhost:3000)
npm run build  # production build + TypeScript check
npm run lint   # ESLint
```

---

## Submission Documents

- `README.md` — setup instructions, architecture, project structure, state management overview, assessment checklist
- `AI_WORKFLOW.md` — AI tools used (GitHub Copilot + Cursor), prompts used per phase, key debugging moments, architectural decisions
