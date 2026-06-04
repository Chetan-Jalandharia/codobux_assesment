import type { BlockPreviewProps } from "@/types/block.types";
import type { TestimonialBlock } from "@/types/block.types";
import { Quote } from "lucide-react";

interface TestimonialPreviewProps extends BlockPreviewProps {
  block: TestimonialBlock;
}

export function TestimonialPreview({ block }: TestimonialPreviewProps) {
  const { quote, authorName } = block.content;

  return (
    <section className="bg-slate-50 px-6 py-14 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Quote
          className="mx-auto mb-4 h-10 w-10 text-blue-500/80"
          aria-hidden
        />
        <blockquote>
          <p className="text-lg font-medium leading-relaxed text-slate-800 sm:text-xl">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-6 flex flex-col items-center gap-1">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
            <cite className="not-italic text-sm font-semibold text-slate-700">
              {authorName}
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
