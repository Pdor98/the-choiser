"use client";

import { Compass, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Button,
  buttonStyles,
  primaryButtonReadableStyle,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionBadge } from "@/components/ui/section-badge";
import { randomActivities } from "@/lib/site-content";

function getDayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
}

function getAdvice(exclude?: string) {
  if (randomActivities.length === 1) {
    return randomActivities[0];
  }

  let nextAdvice = randomActivities[getDayIndex() % randomActivities.length];

  if (!exclude) {
    return nextAdvice;
  }

  while (nextAdvice === exclude) {
    nextAdvice =
      randomActivities[Math.floor(Math.random() * randomActivities.length)];
  }

  return nextAdvice;
}

export function DailyAdvicePanel() {
  const [advice, setAdvice] = useState(() => getAdvice());

  const tags = useMemo(
    () => ["Scelta guidata", "Fresh start", "Mobile-ready"],
    [],
  );

  return (
    <Card className="relative overflow-hidden border-sky-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,248,255,0.92))] p-6 shadow-[0_34px_90px_-48px_rgba(96,165,250,0.24)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-sky-200/90 via-cyan-100/70 to-white/0" />
      <div className="pointer-events-none absolute -right-12 top-10 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-indigo-200/25 blur-3xl" />

      <div className="relative space-y-7">
        <div className="space-y-4">
          <SectionBadge className="border-sky-200/80 bg-white/86 text-sky-800">
            Consiglio del giorno
          </SectionBadge>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sky-700">
              <div className="flex size-12 items-center justify-center rounded-[20px] border border-sky-200/80 bg-white/80 shadow-[0_16px_36px_-26px_rgba(96,165,250,0.35)]">
                <Compass className="size-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-sky-700/72">
                Cosa devo fare oggi?
              </p>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-balance max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Parti da qui: ti aiutiamo a scegliere la prossima cosa da fare.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                Non sai da dove partire? Choiser mette al centro il suggerimento
                più utile del momento e ti lascia generare un nuovo consiglio in
                un attimo.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-sky-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,255,0.96))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_46px_-34px_rgba(96,165,250,0.22)] sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Consiglio attuale
          </p>
          <p className="mt-4 font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {advice}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sky-100 bg-white/78 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <Button
            icon={<Sparkles className="size-4" />}
            onClick={() => setAdvice(getAdvice(advice))}
            className="w-full sm:w-auto"
          >
            Genera consiglio
          </Button>
          <Link
            href="/random"
            className={buttonStyles({
              variant: "secondary",
              className: "w-full sm:w-auto",
            })}
          >
            <span>Scopri il consiglio</span>
          </Link>
          <Link
            href="/random"
            className={buttonStyles({
              variant: "ghost",
              className: "w-full sm:w-auto",
            })}
            style={primaryButtonReadableStyle}
          >
            <RefreshCw
              className="size-4 text-slate-700"
              style={primaryButtonReadableStyle}
            />
            <span className="text-slate-700" style={primaryButtonReadableStyle}>
              Vai al Random
            </span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
