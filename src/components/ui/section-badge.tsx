import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/12 bg-slate-900/72 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
      {...props}
    />
  );
}
