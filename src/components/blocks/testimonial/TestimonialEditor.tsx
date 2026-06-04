/**
 * Testimonial Block - Editor Component
 * 
 * Allows editing: Quote, Author Name
 */

"use client";

import { TextField } from "@/components/common/fields/TextField";
import { TextAreaField } from "@/components/common/fields/TextAreaField";
import type { BlockEditorProps } from "@/types/block.types";
import type { TestimonialBlock } from "@/types/block.types";

interface TestimonialEditorProps extends BlockEditorProps {
  block: TestimonialBlock;
}

export function TestimonialEditor({
  block,
  onChange,
}: TestimonialEditorProps) {
  const handleChange = (field: keyof TestimonialBlock["content"], value: string) => {
    onChange(block.id, { [field]: value } as Partial<TestimonialBlock["content"]>);
  };

  return (
    <div className="space-y-4">
      <TextAreaField
        label="Quote"
        value={block.content.quote}
        onChange={(e) => handleChange("quote", e.target.value)}
        placeholder="Enter the testimonial quote..."
        rows={4}
      />
      <TextField
        label="Author Name"
        value={block.content.authorName}
        onChange={(e) => handleChange("authorName", e.target.value)}
        placeholder="Enter author name..."
      />
    </div>
  );
}
