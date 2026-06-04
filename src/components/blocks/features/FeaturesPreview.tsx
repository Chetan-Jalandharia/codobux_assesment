import type { BlockPreviewProps } from "@/types/block.types";
import type { FeaturesBlock } from "@/types/block.types";
import { Sparkles } from "lucide-react";

interface FeaturesPreviewProps extends BlockPreviewProps {
  block: FeaturesBlock;
}

export function FeaturesPreview({ block }: FeaturesPreviewProps) {
  const { sectionTitle, cards } = block.content;

  return (
    <section className="bg-white px-6 py-14 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          {sectionTitle}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-shadow hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
