import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import {
  buttonStyles,
  primaryButtonReadableStyle,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionBadge } from "@/components/ui/section-badge";

export function HomeHeroPanel() {
  return (
    <Card className="relative overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(243,248,255,0.88))] p-6 shadow-[0_28px_68px_-44px_rgba(96,165,250,0.18)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-sky-200/80 via-indigo-100/45 to-transparent" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-cyan-200/24 blur-3xl" />
      <div className="relative space-y-6">
        <SectionBadge className="border-sky-200/80 bg-white/84 text-sky-800">
          Choiser overview
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-14 items-center justify-center rounded-[20px] border border-sky-200/80 bg-white/84 text-sky-700 shadow-[0_18px_44px_-30px_rgba(96,165,250,0.22)]">
            <Sparkles className="size-6" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900">
              Una dashboard più luminosa, più chiara e più immediata.
            </h2>
            <p className="text-sm leading-7 text-slate-700">
              Questa variante mette al centro l’azione iniziale, riduce il
              rumore visivo e rende ogni modulo più leggibile da desktop e da
              smartphone.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200/80 bg-white/76 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Moduli attivi
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-slate-900">
              8
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-200/80 bg-white/76 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Pronta per mobile
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-slate-900">
              100%
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/88 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              UX goal
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Meno rumore visivo, più gerarchia, azioni subito riconoscibili.
            </p>
          </div>
          <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/88 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Feeling
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Superfici soft, accenti freddi e lettura più rilassata.
            </p>
          </div>
        </div>

        <Link
          href="/random"
          className={buttonStyles({ className: "w-full sm:w-auto" })}
          style={primaryButtonReadableStyle}
        >
          <ArrowRight
            className="size-4 text-slate-950"
            style={primaryButtonReadableStyle}
          />
          <span
            className="text-slate-700"
            style={primaryButtonReadableStyle}
          >
            Apri il modulo Random
          </span>
        </Link>
      </div>
    </Card>
  );
}
