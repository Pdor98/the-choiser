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
      <Card className="relative flex h-full flex-col justify-between overflow-hidden p-6 transition duration-500 hover:-translate-y-1.5 hover:border-cyan-100/18 hover:bg-[linear-gradient(180deg,rgba(12,20,36,0.94),rgba(7,12,24,0.94))]">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClassName} opacity-80 transition duration-500 group-hover:opacity-100`}
        />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-100/8 blur-3xl transition duration-500 group-hover:scale-110" />

        <div className="relative space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-[20px] border border-white/12 bg-[linear-gradient(180deg,rgba(13,22,38,0.92),rgba(9,16,29,0.9))] p-3 text-white shadow-[0_20px_42px_-28px_rgba(2,8,23,0.82)]">
              <Icon className="size-6" />
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/64 transition duration-300 group-hover:border-cyan-100/20 group-hover:text-white">
              <ArrowUpRight className="size-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">
              {eyebrow}
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
              {title}
            </h2>
            <p className="text-sm leading-7 text-white/82">{description}</p>
          </div>
        </div>

        <div className="relative mt-8 flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/82">
          <span>Apri sezione</span>
          <span className="rounded-full border border-cyan-100/12 bg-slate-950/58 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100/72">
            Dashboard
          </span>
        </div>
      </Card>
    </Link>
  );
}
