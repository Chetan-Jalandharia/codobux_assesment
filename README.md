# Landing Page Builder — Codobux Frontend Assessment

A CMS-style **Next.js** application for building landing pages from reusable content blocks.  
Edit on the **left panel**, see a **live preview** on the **right panel**, with **localStorage** persistence and **JSON** export/import.

---

## Features

- **Dynamic blocks:** Hero, Features, Testimonial, CTA
- **Block management:** Add, edit, reorder (drag-and-drop + up/down buttons), delete, duplicate
- **Live preview:** Instant updates via shared Zustand state — no re-fetch, no prop drilling
- **Persistence:** Auto-save to `localStorage`; state is fully restored on page refresh
- **Import / Export:** Validated JSON backup and restore (schema-validated before applying)
- **Responsive UI:** Desktop split-view; mobile Editor / Preview tabs (segmented control)

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | File-based routing, RSC-ready |
| Language | TypeScript 5 | Strict mode, discriminated unions |
| UI Library | React 19 | Concurrent features |
| Styling | Tailwind CSS v4 | Utility-first, PostCSS pipeline |
| State | Zustand 5 | Minimal boilerplate, `useShallow` for React 19 compat |
| Drag & Drop | @dnd-kit (core, sortable, modifiers) | Vertical-only reorder with axis constraint |
| Icons | Lucide React | Tree-shakeable SVG icons |
| CVA | class-variance-authority | Type-safe component variants (`Button`) |

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** (bundled with Node)

### Install & Run (Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build   # compile & type-check
npm start       # serve production bundle
```

---

## Project Structure

```
e:\codobux_assesment\
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Entry point → renders WorkspaceShell
│   │   └── globals.css             # Tailwind base + global resets
│   │
│   ├── components/
│   │   ├── blocks/                 # Block-type-specific components
│   │   │   ├── registry.ts         # ★ Block registry (type → Editor/Preview map)
│   │   │   ├── hero/
│   │   │   │   ├── HeroEditor.tsx
│   │   │   │   └── HeroPreview.tsx
│   │   │   ├── features/
│   │   │   │   ├── FeaturesEditor.tsx
│   │   │   │   └── FeaturesPreview.tsx
│   │   │   ├── testimonial/
│   │   │   │   ├── TestimonialEditor.tsx
│   │   │   │   └── TestimonialPreview.tsx
│   │   │   └── cta/
│   │   │       ├── CTAEditor.tsx
│   │   │       └── CTAPreview.tsx
│   │   │
│   │   ├── common/                 # Reusable primitives
│   │   │   ├── Button.tsx          # CVA-based button variants
│   │   │   ├── TextField.tsx       # Labeled input / textarea field
│   │   │   ├── CardArrayField.tsx  # Repeatable card input (Features block)
│   │   │   └── DraggableBlockItem.tsx  # DnD sortable wrapper for block list
│   │   │
│   │   ├── editor/                 # Left-panel editor chrome
│   │   │   ├── EditorPanel.tsx     # Container for block list + add controls
│   │   │   ├── BlockList.tsx       # DnD-sortable list of blocks
│   │   │   ├── BlockEditor.tsx     # Resolves editor component from registry
│   │   │   └── BlockControls.tsx   # Per-block actions (delete, duplicate, move)
│   │   │
│   │   ├── layout/                 # App shell
│   │   │   ├── WorkspaceShell.tsx  # Two-panel layout orchestrator
│   │   │   ├── AppHeader.tsx       # Top bar with export/import/clear actions
│   │   │   └── MobileViewTabs.tsx  # Segmented tab control for mobile
│   │   │
│   │   └── preview/                # Right-panel live preview
│   │       ├── PreviewPanel.tsx    # Preview container + scroll area
│   │       ├── BlockRenderer.tsx   # Resolves preview component from registry
│   │       └── PreviewCtaButton.tsx  # Standalone CTA button (avoids CVA conflicts)
│   │
│   ├── constants/
│   │   ├── block-types.ts          # BlockType string constants
│   │   ├── default-blocks.ts       # Default content per block type
│   │   └── icons.ts                # Icon map per block type
│   │
│   ├── hooks/
│   │   ├── useBlockStore.ts        # ★ Granular store selectors (useShallow-safe)
│   │   ├── useBlockRegistry.ts     # Registry access hook
│   │   └── useDragDrop.tsx         # DnD sensors + event handlers
│   │
│   ├── services/
│   │   └── storage/
│   │       ├── index.ts            # Re-exports default storage instance
│   │       ├── interface.ts        # IBlockStorage interface
│   │       └── localStorage.ts     # LocalStorageBlockStorage implementation
│   │
│   ├── store/
│   │   └── cms-store.ts            # ★ Zustand CMS store (all state + actions)
│   │
│   ├── types/
│   │   ├── block.types.ts          # ★ Discriminated union Block types
│   │   └── editor.types.ts         # Editor-specific prop types
│   │
│   └── utils/
│       ├── block-factory.ts        # createNewBlock, duplicateBlock, normalizeBlocks
│       ├── block-validator.ts      # JSON import schema validation
│       └── json-export.ts          # Export/import orchestration
│
├── public/                         # Static assets
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
├── README.md                       # ← You are here
└── AI_WORKFLOW.md
```

---

## Architecture

### Overview

The application follows a **unidirectional data flow** pattern:

```
User Input (Editor)
      ↓
 Zustand Store  ←→  localStorage (auto-save)
      ↓
  Live Preview
```

Both the editor panel and the preview panel subscribe to the **same Zustand store**. Any change to a block field instantly updates the preview — no intermediate state, no debounce needed.

---

### Block Registry Pattern

`src/components/blocks/registry.ts` is the **single source of truth** for mapping block types to their editor and preview React components.

```ts
export const blockRegistry: BlockRegistry = {
  hero:        { Editor: HeroEditor,        Preview: HeroPreview },
  features:    { Editor: FeaturesEditor,    Preview: FeaturesPreview },
  testimonial: { Editor: TestimonialEditor, Preview: TestimonialPreview },
  cta:         { Editor: CTAEditor,         Preview: CTAPreview },
};
```

- `BlockEditor` (editor panel) calls `getBlockEntry(block.type).Editor` — **no switch statement in the page**.
- `BlockRenderer` (preview panel) calls `getBlockEntry(block.type).Preview` — same pattern.
- **Adding a new block type** requires only: add type → add default content → create Editor/Preview components → add one line to the registry.

---

### State Management (Zustand)

`src/store/cms-store.ts` — the single Zustand store:

| State | Type | Description |
|-------|------|-------------|
| `blocks` | `Block[]` | Ordered array of all content blocks |
| `selectedBlockId` | `string \| null` | Currently active block in the editor |
| `isLoading` | `boolean` | True while loading from localStorage |

**Actions:**

| Action | Description |
|--------|-------------|
| `addBlock(type, index?)` | Creates a block with defaults; inserts at index or end |
| `updateBlock(id, content)` | Merges partial content; auto-saves |
| `deleteBlock(id)` | Removes block; re-normalizes order |
| `moveBlock(id, newIndex)` | Reorders block; re-normalizes order |
| `duplicateBlockAction(id)` | Deep-copies block; inserts after source |
| `selectBlock(id)` | Sets active editor block |
| `loadBlocks()` | Async load from localStorage; normalizes on load |
| `saveBlocks()` | Manual save (auto-save is the primary path) |
| `clearBlocks()` | Wipes localStorage and resets state |
| `setBlocks(blocks)` | Batch-set after JSON import (normalizes) |

**React 19 Compatibility — `useShallow`:**

Zustand selectors that return new array or object references on every call cause React 19's `useSyncExternalStore` to trigger infinite re-render loops (`getServerSnapshot should be cached`). All such selectors in `src/hooks/useBlockStore.ts` use `useShallow` from `zustand/react/shallow` to prevent this:

```ts
// ✅ Correct — shallow equality prevents spurious re-renders
export function useBlocksOrdered(): Block[] {
  return useCMSStore(
    useShallow((state) =>
      [...state.blocks].sort((a, b) => a.order - b.order)
    )
  );
}
```

---

### Block Type System (Discriminated Unions)

`src/types/block.types.ts` defines each block as a TypeScript discriminated union:

```ts
export type Block = HeroBlock | FeaturesBlock | TestimonialBlock | CTABlock;
```

The `type` field acts as the discriminant — TypeScript narrows the type automatically in any `if (block.type === 'hero')` branch, giving full auto-complete and compile-time safety on `block.content` fields.

---

### Persistence Layer

`src/services/storage/interface.ts` defines `IBlockStorage`:

```ts
interface IBlockStorage {
  save(blocks: Block[]): Promise<void>;
  load(): Promise<Block[]>;
  clear(): Promise<void>;
}
```

`LocalStorageBlockStorage` implements this interface. The store calls `storage.save()` after every mutation (auto-save). On mount, `loadBlocks()` reads from `localStorage` and passes blocks through `normalizeBlocks()` before setting state.

The interface makes the storage layer **swappable** — a future API-backed implementation requires zero component changes.

---

### Drag-and-Drop

`@dnd-kit` powers vertical block reordering:

- **Sensor:** `PointerSensor` with a small activation distance (avoids accidental drags on click)
- **Modifiers:** `restrictToVerticalAxis` + `restrictToParentElement` (no horizontal drift)
- **Container:** `overflow-x-hidden` on the block list prevents horizontal scroll during drag
- On `DragEndEvent`, the store's `moveBlock` action is called with the new index

---

### Live Preview

The preview panel (`PreviewPanel.tsx`) subscribes to `useBlocksOrdered()` which returns blocks sorted by `order`. Since editor and preview share the same Zustand store, typing into any editor field triggers:

1. `updateBlock` → store mutation
2. Zustand notifies all subscribers
3. Preview re-renders with updated content

**`PreviewCtaButton`** is a dedicated component separate from the editor `Button` (CVA-based). The CVA `text-white` variant class was overriding custom landing-page CTA colors, so preview CTA buttons use a plain Tailwind implementation instead.

---

## Assessment Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Next.js App Router | ✅ Done | v16, `src/app/` structure |
| TypeScript | ✅ Done | Strict, discriminated unions |
| Hero block | ✅ Done | Title, subtitle, button text |
| Features block | ✅ Done | Section title + repeatable cards |
| Testimonial block | ✅ Done | Quote + author name |
| CTA block | ✅ Done | Heading + button text |
| Add blocks | ✅ Done | Type picker, inserts at end |
| Edit blocks | ✅ Done | Field-level updates, live sync |
| Reorder blocks | ✅ Done | DnD + up/down buttons |
| Delete blocks | ✅ Done | With order re-normalization |
| Live preview | ✅ Done | Shared store, instant updates |
| localStorage persistence | ✅ Done | Auto-save on every mutation |
| JSON export | ✅ Done | Downloads validated JSON file |
| JSON import | ✅ Done | Schema-validated before apply |
| Reusable components | ✅ Done | `TextField`, `CardArrayField`, `Button`, etc. |
| Clean folder structure | ✅ Done | Feature-based, colocated |
| Zustand state management | ✅ Done | Single store, granular hooks |
| Bonus: DnD reorder | ✅ Done | @dnd-kit vertical sort |
| Bonus: Duplicate block | ✅ Done | Deep copy + insert after |
| Bonus: Mobile responsive | ✅ Done | Tab switching on small screens |
| README.md | ✅ Done | — |
| AI_WORKFLOW.md | ✅ Done | — |

**Not implemented (optional):** dark mode, shadcn/ui, undo/redo, preset templates.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build + TypeScript check |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Registry pattern** | Extensible block system — no central `switch` to edit |
| **Zustand over Context** | Simpler API, no Provider wrapping, excellent devtools |
| **Discriminated unions** | Type-safe block content per type, zero runtime type casting |
| **Storage interface** | Swap localStorage for REST/DB without touching components |
| **`useShallow` selectors** | Required for React 19 `useSyncExternalStore` compatibility |
| **`PreviewCtaButton`** | Isolates CVA variant conflicts from landing-page preview styling |
| **Light theme only** | Assessment focus: editor usability, not dark-mode overhead |
| **No shadcn/ui** | Tailwind + CVA `Button` keeps the dependency tree minimal |

---

## License

Private assessment submission — Codobux Frontend Engineer Assessment.
