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
      <Card className="relative flex h-full flex-col justify-between overflow-hidden border-white/12 bg-slate-900/80 p-6 shadow-[0_35px_80px_-52px_rgba(15,23,42,0.95)] transition duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/90">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentClassName} opacity-70 transition duration-500 group-hover:opacity-85`}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-white/6 blur-3xl transition duration-500 group-hover:scale-110" />

        <div className="relative space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-white shadow-[0_18px_40px_-28px_rgba(255,255,255,0.3)]">
              <Icon className="size-6" />
            </div>
            <ArrowUpRight className="size-5 text-white/60 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/66">
              {eyebrow}
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            <p className="text-sm leading-7 text-white/76">{description}</p>
          </div>
        </div>

        <div className="relative mt-8 flex items-center justify-between text-sm text-white/78">
          <span>Apri sezione</span>
          <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/72">
            Explore
          </span>
        </div>
      </Card>
    </Link>
  );
}
