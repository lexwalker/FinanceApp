import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}
