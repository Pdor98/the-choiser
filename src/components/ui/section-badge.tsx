import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SectionBadge({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/55",
        className,
      )}
      {...props}
    />
  );
}
