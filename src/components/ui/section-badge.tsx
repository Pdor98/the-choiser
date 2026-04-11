import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-sky-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,247,255,0.92))] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.26em] text-slate-700 shadow-[0_14px_34px_-26px_rgba(125,211,252,0.42)]",
        className,
      )}
      {...props}
    />
  );
}
