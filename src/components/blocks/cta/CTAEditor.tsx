/**
 * CTA Block - Editor Component
 * 
 * Allows editing: Heading, Button Text
 */

"use client";

import { TextField } from "@/components/common/fields/TextField";
import type { BlockEditorProps } from "@/types/block.types";
import type { CTABlock } from "@/types/block.types";

interface CTAEditorProps extends BlockEditorProps {
  block: CTABlock;
}

export function CTAEditor({ block, onChange }: CTAEditorProps) {
  const handleChange = (field: keyof CTABlock["content"], value: string) => {
    onChange(block.id, { [field]: value } as Partial<CTABlock["content"]>);
  };

  return (
    <div className="space-y-4">
      <TextField
        label="Heading"
        value={block.content.heading}
        onChange={(e) => handleChange("heading", e.target.value)}
        placeholder="Enter CTA heading..."
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
