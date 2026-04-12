"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type ResponsiveControlPanelProps = {
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpenMobile?: boolean;
  className?: string;
  bodyClassName?: string;
};

export function ResponsiveControlPanel({
  title,
  summary,
  children,
  defaultOpenMobile = false,
  className,
  bodyClassName,
}: ResponsiveControlPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpenMobile);

  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-slate-950/72 p-5",
        className,
      )}
    >
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-left transition duration-300 hover:border-white/16 hover:bg-white/10"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
              {title}
            </p>
            <p className="mt-1 truncate text-base font-semibold text-white">
              {summary}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-white/56 transition duration-300",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen ? <div className={cn("mt-4", bodyClassName)}>{children}</div> : null}
      </div>

      <div className="hidden lg:block">
        <p className="text-xs uppercase tracking-[0.18em] text-white/42">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/58">{summary}</p>
        <div className={cn("mt-4", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}
