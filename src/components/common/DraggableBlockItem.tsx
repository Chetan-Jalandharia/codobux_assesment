"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";

interface DraggableBlockItemProps {
  id: string;
  isSelected: boolean;
  children: React.ReactNode;
}

export function DraggableBlockItem({
  id,
  isSelected,
  children,
}: DraggableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex max-w-full items-stretch gap-0.5",
        isDragging && "opacity-40"
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "interactive mt-1 flex shrink-0 touch-none items-start rounded p-1",
          "cursor-grab text-[var(--muted-foreground)] hover:text-slate-600 active:cursor-grabbing",
          isSelected && "text-[var(--primary)]"
        )}
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} aria-hidden />
      </button>
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </li>
  );
}
