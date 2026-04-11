import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20",
        className,
      )}
      {...props}
    />
  );
}
