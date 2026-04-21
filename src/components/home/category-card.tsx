import type { Route } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

const categoryCtaLabels: Record<string, string> = {
  Random: "Scopri Random",
  Games: "Entra in Games",
  Tools: "Esplora Tools",
};

type CategoryCardProps = {
  href: Route;
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  accentClassName: string;
};

export function CategoryCard({
  href,
  title,
  description,
  eyebrow,
  icon: Icon,
  accentClassName,
}: CategoryCardProps) {
  const ctaLabel = categoryCtaLabels[title] ?? "Scopri";

  return (
    <Link href={href} className="group h-full">
      <Card className="relative flex h-full flex-col justify-between overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.94),rgba(14,28,48,0.9))] p-5 transition duration-500 hover:-translate-y-1.5 hover:border-cyan-300/18 hover:bg-[linear-gradient(180deg,rgba(12,24,42,0.96),rgba(16,31,54,0.92))] sm:p-6">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClassName} opacity-80 transition duration-500 group-hover:opacity-100`}
        />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/26 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-300/14 blur-3xl transition duration-500 group-hover:scale-110" />

        <div className="relative space-y-6 sm:space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-[20px] border border-cyan-300/16 bg-white/6 p-3 text-cyan-200 shadow-[0_18px_42px_-30px_rgba(56,189,248,0.24)]">
              <Icon className="size-6" />
            </div>
            <div className="rounded-full border border-white/8 bg-white/5 p-2 text-slate-400 transition duration-300 group-hover:border-cyan-300/18 group-hover:text-slate-50">
              <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
              {eyebrow}
            </p>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-slate-50 sm:text-[1.7rem]">
              {title}
            </h2>
            <p className="text-sm leading-6 text-slate-300 sm:leading-7">
              {description}
            </p>
          </div>
        </div>

        <div className="relative mt-7 flex flex-col items-start gap-3 rounded-[22px] border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
          <span>{ctaLabel}</span>
          <span className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
            Focus
          </span>
        </div>
      </Card>
    </Link>
  );
}
