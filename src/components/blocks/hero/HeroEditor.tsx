/**
 * Hero Block - Editor Component
 * 
 * Allows editing: Title, Subtitle, Button Text
 */

"use client";

import { TextField } from "@/components/common/fields/TextField";
import { TextAreaField } from "@/components/common/fields/TextAreaField";
import type { BlockEditorProps } from "@/types/block.types";
import type { HeroBlock } from "@/types/block.types";

interface HeroEditorProps extends BlockEditorProps {
  block: HeroBlock;
}

export function HeroEditor({ block, onChange }: HeroEditorProps) {
  const handleChange = (field: keyof HeroBlock["content"], value: string) => {
    onChange(block.id, { [field]: value } as Partial<HeroBlock["content"]>);
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Title"
        value={block.content.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Enter hero title..."
      />
      <TextAreaField
        label="Subtitle"
        value={block.content.subtitle}
        onChange={(e) => handleChange("subtitle", e.target.value)}
        placeholder="Enter hero subtitle..."
        rows={3}
      />
      <TextField
        label="Button Text"
        value={block.content.buttonText}
        onChange={(e) => handleChange("buttonText", e.target.value)}
        placeholder="Enter button text..."
      />
    </div>
  );
}
