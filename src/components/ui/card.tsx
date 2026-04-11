import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-[var(--stroke-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(243,248,255,0.86))] shadow-[0_28px_80px_-52px_rgba(59,130,246,0.18),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
