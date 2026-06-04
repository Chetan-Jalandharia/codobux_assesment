# AI Workflow — Codobux Frontend Assessment

> This document explains how AI tools were actually used across this project — which tools, at what points, what I asked, and what I got back. The intent is to be honest about the workflow rather than just listing tools.

---

## Tools Used

| Tool | How I Used It |
|------|--------------|
| **GitHub Copilot** (VS Code extension) | Architecture planning and review, folder structure decisions, initial scaffolding of types and store — all via Copilot Chat before writing any component code |
| **Cursor** | Day-to-day implementation: block components, DnD, layout polish, debugging runtime errors, refactors |

The split was deliberate. Copilot Chat is better for open-ended architectural conversations where I want to think through decisions before committing to code. Cursor is better when I'm inside a file and need to generate or fix specific code quickly.

I did **not** use a single "generate everything" prompt. The project was built across multiple sessions, each with a narrow focus. That's the only way AI-generated code stays coherent at this scale.

---

## Workflow: How the Two Tools Divided the Work

```
GitHub Copilot (Chat)          Cursor (IDE)
─────────────────────          ─────────────────
Phase 1: Architecture          Phase 4: UI shell & layout
Phase 2: Type system           Phase 5: Block components (all 4)
Phase 3: Zustand store         Phase 6: Registry + renderers
         + storage layer       Phase 7: Drag and drop
                               Phase 8: Bug fixes + polish
```

---

## Phase 1 — Architecture Planning (GitHub Copilot Chat)

Started with the assessment requirements and opened a Copilot Chat thread to think through the architecture before touching code. I gave it the full assessment and asked it to push back on anything that seemed like overengineering.

**My opening message to Copilot Chat:**

> I'm building a Next.js CMS for a frontend assessment. It needs Hero, Features, Testimonial and CTA blocks. Editor on the left, live preview on the right. Zustand for state. Before I write anything, help me design the folder structure and agree on the key patterns. I don't want a giant switch statement in my page rendering blocks. What's the cleanest approach here?

**What came out of that conversation:**

Copilot suggested a **block registry pattern** — a plain object mapping `block.type → { Editor, Preview }`. The renderer just does a lookup instead of a switch. This was the key architectural insight. I'd been thinking switch/if-else; Copilot suggested the registry and it clicked immediately.

It also pushed for:
- Discriminated union `Block` type so TypeScript narrows `content` per block type
- A storage interface (`IBlockStorage`) instead of calling `localStorage` directly in the store
- Feature-based folder layout under `src/components/blocks/` with one folder per block type

I asked a follow-up:

> Why put Editor and Preview components together in the same block folder instead of separating all editors in one folder and all previews in another?

Copilot's reasoning was that colocating them by feature means when you add a new block type, all its files are in one place. You don't have to touch `editors/` and `previews/` separately. That made sense and I went with it.

**Folder structure agreed on in this session** — see `README.md` for the full tree.

---

## Phase 2 — Type System (GitHub Copilot Chat)

Once the architecture was agreed on, I asked Copilot to generate the type definitions. The prompt was short because the context was already established:

> Generate the TypeScript types for the block system. Use discriminated unions. BaseBlock has id, type, order. Each block type extends it with its own content shape. Hero has title/subtitle/buttonText, Features has sectionTitle and a cards array, Testimonial has quote and authorName, CTA has heading and buttonText.

Got back `block.types.ts` almost exactly as it is now. Minor things I changed manually: added `BlockEditorProps` and `BlockPreviewProps` interfaces for the component contracts, and moved some types around to group them better.

Then asked separately:

> Now write block-factory.ts with createNewBlock, duplicateBlock, reorderBlocks, and normalizeBlocks. normalizeBlocks should sort by order then reassign sequential indices — I'll call it on load and import so the store array always matches display order.

The `normalizeBlocks` function specifically came from pushing Copilot to think about edge cases around what happens when you import JSON that has gaps in the order numbers.

---

## Phase 3 — Zustand Store & Storage Layer (GitHub Copilot Chat)

Still in Copilot Chat for this phase. The store is the most critical piece so I wanted to think it through carefully.

> Write the Zustand store for this CMS. State: blocks array, selectedBlockId, isLoading. Actions I need: addBlock, updateBlock, deleteBlock, moveBlock, duplicateBlockAction, selectBlock, loadBlocks, saveBlocks, clearBlocks, setBlocks. Every mutation should auto-save to localStorage. All updates should be immutable. loadBlocks should call normalizeBlocks after loading. setBlocks (used for JSON import) should also normalize.

One thing I specifically called out:

> Don't call localStorage directly in the store. I want a storage service abstraction. The store calls storage.save() and storage.load() — not localStorage.setItem() directly.

This produced the `IBlockStorage` interface and `LocalStorageBlockStorage` class. Copilot also suggested making `storage` a singleton exported from `src/services/storage/index.ts` which is cleaner than instantiating it in the store.

---

## Phase 4 — UI Shell & Layout (Cursor)

Switched to Cursor at this point. Now I have a type system and store, and I need to build visible UI. Cursor is better here because I can generate code, immediately see it, and ask for tweaks inline.

**Cursor chat prompt:**

> Build WorkspaceShell.tsx — two panel layout, editor fixed at ~380px on the left, preview fills the rest. On mobile collapse to tabs. Also build AppHeader.tsx with export, import (hidden file input), and clear buttons wired to the store. Use Tailwind, light theme only.

The first version Cursor gave me had the mobile tab state in WorkspaceShell, which made it harder to test. I asked:

> Extract the mobile tab logic into its own MobileViewTabs component, keep WorkspaceShell cleaner.

That refactor took one prompt and worked cleanly.

---

## Phase 5 — Block Components (Cursor)

This was the most prompt-intensive phase. Each block needed an Editor and a Preview component.

Rather than doing all four at once, I did them one at a time. First pass:

> Build HeroEditor.tsx and HeroPreview.tsx. Editor uses TextField components (label + input/textarea). Preview should look like a real landing page hero section — gradient background, large bold title, a button. Accept BlockEditorProps and BlockPreviewProps respectively.

Then I asked Cursor to build a reusable `TextField` primitive first:

> Before the block editors, create TextField.tsx in components/common. It's a labeled input or textarea (multiline boolean prop), controlled, calls an onChange handler. Keep it simple but style it cleanly with Tailwind.

Once `TextField` existed, the remaining block editors were quick. I prompted each one:

> Now FeaturesEditor — it has a sectionTitle TextField and a repeatable card array (each card has title + description). Build CardArrayField.tsx in common/ for the repeatable cards. Features preview shows a 3-column card grid.

> Testimonial is simple — just a quote textarea and authorName input. Preview should look like a pull quote with a large opening quotation mark.

> CTA editor is heading + buttonText. Preview is a full-width section with centered text and a prominent button.

The previews took a few back-and-forths on styling. First versions were too plain. I'd say something like:

> The hero preview looks too basic. Add a subtle gradient background, make the title bigger, give the button a hover effect.

Not a detailed prompt — just directing Cursor toward the right aesthetic.

---

## Phase 6 — Registry & Dynamic Rendering (Cursor)

> Create src/components/blocks/registry.ts. It maps block types to their Editor and Preview components. Export getBlockEntry(type) that throws if the type isn't registered. Then create BlockEditor.tsx in components/editor and BlockRenderer.tsx in components/preview — both look up the right component from the registry based on block.type. No if/switch.

This worked on the first try. The registry pattern was already decided in Phase 1 so Cursor just needed to implement it.

---

## Phase 7 — Drag-and-Drop (Cursor)

> Add drag-and-drop to the block list using @dnd-kit. Vertical-only reorder. Drag handle icon on each item (GripVertical from lucide). Use PointerSensor with activationConstraint distance: 8 so clicks don't accidentally start a drag. On drag end call moveBlock from the store with the new index. Also add up/down buttons as accessible fallback. Put the DnD sensor logic in a useDragDrop hook.

I also had to explicitly add:

> The block list container needs overflow-x-hidden. During drag, dnd-kit can cause horizontal scroll without it.

That was something I found myself — the DnD was causing a visual glitch on the list, overflow-x-hidden fixed it. I asked Cursor to add it once I knew what to fix.

---

## Phase 8 — Debugging (Cursor)

Two real bugs came up during testing that needed AI help to diagnose.

### Bug 1: React 19 Infinite Re-render

The app was crashing with:

```
Error: getServerSnapshot should be cached
Maximum update depth exceeded
```

Stack trace pointed to `useBlocksOrdered`. I pasted the error into Cursor chat:

> Getting this error from useBlocksOrdered. Stack trace points at the useCMSStore selector. The selector does [...state.blocks].sort() — why would this cause an infinite loop?

Cursor explained the issue clearly: in React 19, `useSyncExternalStore` (which Zustand uses internally) compares snapshots by reference. `[...state.blocks].sort()` creates a new array reference every render even if the contents didn't change, so React thinks the store changed, re-renders, creates a new array, thinks it changed again — infinite loop.

Fix: wrap the selector with `useShallow` from `zustand/react/shallow`.

```ts
// Before — new array reference every render
return useCMSStore((state) =>
  [...state.blocks].sort((a, b) => a.order - b.order)
);

// After — shallow equality check breaks the loop
return useCMSStore(
  useShallow((state) =>
    [...state.blocks].sort((a, b) => a.order - b.order)
  )
);
```

I also applied `useShallow` to `useBlockActions` since it returns an object literal.

### Bug 2: CTA Preview Button Text Invisible

The CTA preview button text wasn't showing. Turned out the editor `Button` component uses CVA and includes `text-white` as a base class. In the preview context, the button background was also white/light, making the text invisible.

> The CTA preview button text is invisible. The editor Button uses CVA with text-white as a base. I think CVA is winning over my custom preview styles. What's the cleanest fix?

Cursor suggested either overriding with `!important` (bad) or creating a separate button component for preview use that doesn't inherit CVA styles. I went with the separate component: `PreviewCtaButton.tsx` in `src/components/preview/`. It's just a plain Tailwind button with no CVA — isolated from the editor styling.

### Bug 3: Drag-and-Drop (dnd-kit) Parent Restrict Constraint

During testing, drag-and-drop block reordering in the editor list was not working. Dragging a block using the handle did not let it move vertically.

**Reason:** In `BlockList.tsx`, each `DraggableBlockItem` was wrapped in an `<li>` element inside the `<ul>`. Inside `DraggableBlockItem.tsx`, the component itself returned a `<div>` which registered the `setNodeRef`.
Since `restrictToParentElement` from `@dnd-kit/modifiers` was configured in the context, `@dnd-kit` restricted the vertical drag movement to the parent of the draggable node.
Because the draggable node was the inner `<div>` and its parent was the outer `<li>` wrapping it, the drag boundaries were constrained strictly to the height of that single item's `<li>` wrapper (i.e. it couldn't drag past its own item).

**Fix:**
1. Changed the outer element of `DraggableBlockItem.tsx` to render an `<li>` directly instead of a `<div>` and attach the `setNodeRef` to it.
2. Removed the redundant `<li>` wrapper in `BlockList.tsx` so the immediate parent of `DraggableBlockItem` became the `<ul>` container.
This allowed the parent constraint to bound the drag boundaries to the entire `<ul>` list, enabling vertical drag-and-drop to work perfectly.

### Phase 8b — General Polish

A few shorter prompts for UI cleanup:

> The block list scrolls weirdly on long lists. Cap its height and make it scroll independently, editor panel should be sticky.

> Mobile tab indicator should look more like a segmented control — pill background that slides, not just a bottom border.

> Block items in the list should show the block type badge and a short content preview (first 30 chars of the title) so the user knows what they're looking at without expanding.

---

## What I'd Note About This Workflow

**Copilot Chat for architecture worked well.** The back-and-forth in Phase 1 was the most valuable use of AI in the whole project. Talking through the registry pattern before writing it meant I never had to refactor it.

**Cursor for implementation is fast but needs direction.** It's good at "build this specific thing" prompts. It's less useful if you ask it something vague like "make the UI better" — you need to be specific about what feels off.

**Prompts got shorter as context built up.** Phase 1 prompts were long because I was establishing the architecture. By Phase 5, prompts like "now do the testimonial block, same pattern as hero" worked fine because Cursor had the context from previous files.

**AI didn't catch the React 19 `useShallow` issue upfront.** I had to discover it from a runtime crash. The initial store and hooks were generated without it. This is a good reminder that AI tools reflect their training data — React 19 + Zustand 5 compatibility specifics are recent enough that they need manual verification.

**Every output was reviewed before use.** No generated file went in unchanged. Types, naming, structure — all reviewed against what made sense for this project.

---

## Key Files for Reviewers

| Concern | Path |
|---------|------|
| State | `src/store/cms-store.ts` |
| Types | `src/types/block.types.ts` |
| Block Registry | `src/components/blocks/registry.ts` |
| Store Hooks | `src/hooks/useBlockStore.ts` |
| Persistence | `src/services/storage/localStorage.ts` |
| DnD Hook | `src/hooks/useDragDrop.tsx` |

---

## Submission Checklist

- `npm install` → `npm run dev` → [http://localhost:3000](http://localhost:3000)
- All four block types: add, edit, reorder (drag + up/down), delete, duplicate
- Refresh page → blocks restored from localStorage
- Export → downloads a valid JSON file
- Clear → localStorage wiped
- Import → file picker, validates JSON, restores blocks
- Mobile: Editor / Preview tabs switch correctly
- `npm run build` → zero TypeScript errors, zero lint errors
