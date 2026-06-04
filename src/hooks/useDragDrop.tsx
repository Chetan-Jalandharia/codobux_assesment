/**
 * Drag and drop for block list — vertical reorder only, constrained to list area.
 */

"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";

interface UseDragDropProps {
  items: Array<{ id: string }>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function useDragDrop({ items, onReorder }: UseDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return {
    sensors,
    activeId,
    itemIds: items.map((item) => item.id),
    handlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
  };
}

interface DragDropProviderProps {
  items: Array<{ id: string }>;
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
  /** Clone shown while dragging (avoids transform scroll jitter in list) */
  renderOverlay?: (activeId: string) => ReactNode;
}

export function DragDropProvider({
  items,
  onReorder,
  children,
  renderOverlay,
}: DragDropProviderProps) {
  const { sensors, activeId, itemIds, handlers } = useDragDrop({
    items,
    onReorder,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragStart={handlers.onDragStart}
      onDragEnd={handlers.onDragEnd}
      onDragCancel={handlers.onDragCancel}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {activeId && renderOverlay ? (
        <DragOverlay dropAnimation={null}>
          {renderOverlay(activeId)}
        </DragOverlay>
      ) : null}
    </DndContext>
  );
}
