import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-[var(--stroke-soft)] bg-[linear-gradient(180deg,rgba(11,18,32,0.88),rgba(7,12,22,0.86))] shadow-[0_30px_90px_-55px_rgba(2,8,23,0.92),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
