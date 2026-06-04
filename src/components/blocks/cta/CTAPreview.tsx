import type { BlockPreviewProps } from "@/types/block.types";
import type { CTABlock } from "@/types/block.types";
import { PreviewCtaButton } from "@/components/preview/PreviewCtaButton";

interface CTAPreviewProps extends BlockPreviewProps {
  block: CTABlock;
}

export function CTAPreview({ block }: CTAPreviewProps) {
  const { heading, buttonText } = block.content;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-14 sm:px-10 sm:py-16">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-black/10"
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {heading}
        </h2>
        <div className="mt-8 flex justify-center">
          <PreviewCtaButton className="bg-white text-emerald-700 shadow-emerald-900/20 hover:bg-emerald-50">
            {buttonText}
          </PreviewCtaButton>
        </div>
      </div>
    </section>
  );
}
