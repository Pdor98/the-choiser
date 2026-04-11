import type { Route } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

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
  return (
    <Link href={href} className="group h-full">
      <Card className="relative flex h-full flex-col justify-between overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(243,248,255,0.88))] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-sky-200/80 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,255,0.96))]">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClassName} opacity-80 transition duration-500 group-hover:opacity-100`}
        />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-200/35 blur-3xl transition duration-500 group-hover:scale-110" />

        <div className="relative space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-[20px] border border-sky-100/80 bg-white/84 p-3 text-sky-800 shadow-[0_18px_42px_-30px_rgba(96,165,250,0.24)]">
              <Icon className="size-6" />
            </div>
            <div className="rounded-full border border-slate-200/80 bg-white/72 p-2 text-slate-500 transition duration-300 group-hover:border-sky-200/80 group-hover:text-slate-900">
              <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              {eyebrow}
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]">
              {title}
            </h2>
            <p className="text-sm leading-7 text-slate-700">{description}</p>
          </div>
        </div>

        <div className="relative mt-8 flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white/72 px-4 py-3 text-sm text-slate-700">
          <span>Apri sezione</span>
          <span className="rounded-full border border-sky-100/80 bg-sky-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-700">
            Focus
          </span>
        </div>
      </Card>
    </Link>
  );
}
