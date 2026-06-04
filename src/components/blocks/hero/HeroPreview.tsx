import type { BlockPreviewProps } from "@/types/block.types";
import type { HeroBlock } from "@/types/block.types";
import { PreviewCtaButton } from "@/components/preview/PreviewCtaButton";
import { ArrowRight } from "lucide-react";

interface HeroPreviewProps extends BlockPreviewProps {
  block: HeroBlock;
}

export function HeroPreview({ block }: HeroPreviewProps) {
  const { title, subtitle, buttonText } = block.content;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-16 sm:px-10 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgb(59 130 246 / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgb(99 102 241 / 0.35) 0%, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-8 flex justify-center">
          <PreviewCtaButton className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
            {buttonText}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </PreviewCtaButton>
        </div>
      </div>
    </section>
  );
}
