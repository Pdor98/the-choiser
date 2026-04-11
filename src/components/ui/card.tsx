import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-[var(--stroke-soft)] bg-[linear-gradient(180deg,rgba(10,20,35,0.94),rgba(15,28,49,0.9))] shadow-[0_32px_88px_-56px_rgba(37,99,235,0.36),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
