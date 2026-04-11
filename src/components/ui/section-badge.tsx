import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-100/12 bg-[linear-gradient(180deg,rgba(12,20,36,0.88),rgba(8,14,26,0.78))] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_36px_-30px_rgba(56,189,248,0.4)]",
        className,
      )}
      {...props}
    />
  );
}
