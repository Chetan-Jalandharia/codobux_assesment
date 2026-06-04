import {
  Grid,
  MessageSquare,
  Quote,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { BlockType } from "@/types/block.types";

export const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  hero: Zap,
  features: Grid,
  testimonial: Quote,
  cta: MessageSquare,
};
