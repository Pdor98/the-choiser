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
    <Card className="relative overflow-hidden border-white/7 bg-[linear-gradient(180deg,rgba(10,19,33,0.78),rgba(13,24,41,0.74))] p-5 shadow-[0_22px_58px_-46px_rgba(15,23,42,0.3)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-300/10 via-indigo-300/5 to-transparent" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-cyan-300/8 blur-3xl" />
      <div className="relative space-y-6">
        <SectionBadge className="border-white/8 bg-white/5 text-slate-200">
          Secondo step
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-11 items-center justify-center rounded-[18px] border border-white/8 bg-white/5 text-cyan-200 shadow-[0_14px_36px_-30px_rgba(56,189,248,0.16)] sm:size-12">
            <Sparkles className="size-5" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-slate-100 sm:text-[1.45rem]">
              Dopo il consiglio, trovi tutto il resto in modo ordinato.
            </h2>
            <p className="text-sm leading-7 text-slate-300/88">
              Random, giochi e tools restano subito accessibili, ma il primo
              impatto della home ora è concentrato su un suggerimento rapido e
              utile.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/7 bg-white/[0.045] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Moduli attivi
            </p>
            <p className="mt-2 font-heading text-[1.8rem] font-semibold text-slate-50">
              8
            </p>
          </div>
          <div className="rounded-[22px] border border-white/7 bg-white/[0.045] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Pronta per mobile
            </p>
            <p className="mt-2 font-heading text-[1.8rem] font-semibold text-slate-50">
              100%
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/7 bg-white/[0.035] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              UX goal
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300/86">
              Focus iniziale forte, poi percorso chiaro verso il resto
              dell&apos;esperienza.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/7 bg-white/[0.035] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Feeling
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300/86">
              Una dashboard dark leggibile, calma e ordinata, senza rumore
              visivo in eccesso.
            </p>
          </div>
        </div>

        <Link
          href="/random"
          className={buttonStyles({ className: "w-full sm:w-auto" })}
          style={primaryButtonReadableStyle}
        >
          <ArrowRight
            className="size-4 text-slate-50"
            style={primaryButtonReadableStyle}
          />
          <span
            className="text-slate-50"
            style={primaryButtonReadableStyle}
          >
            Apri il modulo Random
          </span>
        </Link>
      </div>
    </Card>
  );
}
