import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/12 bg-slate-900/76 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.92)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
