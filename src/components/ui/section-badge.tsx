import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(18,31,53,0.9),rgba(11,22,39,0.86))] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-200 shadow-[0_14px_34px_-26px_rgba(56,189,248,0.24)]",
        className,
      )}
      {...props}
    />
  );
}
