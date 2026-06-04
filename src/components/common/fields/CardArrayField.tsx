/**
 * Common UI Components - CardArrayField
 * 
 * Reusable field for editing arrays of objects (cards).
 * Used by Features block for managing multiple feature cards.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import { TextField } from "./TextField";
import { TextAreaField } from "./TextAreaField";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CardItem {
  id: string;
  title: string;
  description: string;
}

export interface CardArrayFieldProps {
  label?: string;
  cards: CardItem[];
  onChange: (cards: CardItem[]) => void;
}

export function CardArrayField({ label, cards, onChange }: CardArrayFieldProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(
    cards.length > 0 ? cards[0].id : null
  );

  const handleAddCard = () => {
    const newCard: CardItem = {
      id: `card-${Date.now()}`,
      title: "New Feature",
      description: "Feature description",
    };
    onChange([...cards, newCard]);
    setExpandedCardId(newCard.id);
  };

  const handleUpdateCard = (id: string, field: keyof CardItem, value: string) => {
    onChange(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleDeleteCard = (id: string) => {
    const newCards = cards.filter((card) => card.id !== id);
    onChange(newCards);
    if (expandedCardId === id) {
      setExpandedCardId(newCards.length > 0 ? newCards[0].id : null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      {/* Cards List */}
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              "interactive rounded-lg border",
              expandedCardId === card.id
                ? "border-[var(--border)] bg-[var(--surface-muted)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
            )}
          >
            {/* Card Header (Click to expand) */}
            <button
              onClick={() =>
                setExpandedCardId(
                  expandedCardId === card.id ? null : card.id
                )
              }
              className="interactive flex w-full items-center justify-between px-3 py-2.5 text-left"
            >
              <span className="truncate text-sm font-medium text-slate-700">
                {card.title || "Untitled Card"}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {expandedCardId === card.id ? "▼" : "▶"}
              </span>
            </button>

            {/* Card Content (Expanded) */}
            {expandedCardId === card.id && (
              <div className="space-y-3 border-t border-[var(--border)] px-3 py-3">
                <TextField
                  label="Title"
                  value={card.title}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "title", e.target.value)
                  }
                />
                <TextAreaField
                  label="Description"
                  value={card.description}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "description", e.target.value)
                  }
                  rows={3}
                />
                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCard(card.id)}
                    className="gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleAddCard}
        className="gap-1 w-full"
      >
        <Plus size={16} />
        Add Card
      </Button>
    </div>
  );
}
