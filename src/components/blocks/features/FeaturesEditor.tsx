/**
 * Features Block - Editor Component
 * 
 * Allows editing: Section Title, Feature Cards
 */

"use client";

import { TextField } from "@/components/common/fields/TextField";
import { CardArrayField } from "@/components/common/fields/CardArrayField";
import type { BlockEditorProps } from "@/types/block.types";
import type { FeaturesBlock } from "@/types/block.types";

interface FeaturesEditorProps extends BlockEditorProps {
  block: FeaturesBlock;
}

export function FeaturesEditor({ block, onChange }: FeaturesEditorProps) {
  const handleTitleChange = (title: string) => {
    onChange(block.id, { sectionTitle: title });
  };

  const handleCardsChange = (cards: typeof block.content.cards) => {
    onChange(block.id, { cards });
  };

  return (
    <div className="space-y-6">
      <TextField
        label="Section Title"
        value={block.content.sectionTitle}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Enter section title..."
      />
      <CardArrayField
        label="Feature Cards"
        cards={block.content.cards}
        onChange={handleCardsChange}
      />
    </div>
  );
}
