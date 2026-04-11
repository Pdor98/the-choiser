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
    <Card className="relative overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(12,23,40,0.94),rgba(15,29,51,0.92))] p-6 shadow-[0_28px_68px_-44px_rgba(37,99,235,0.26)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-300/16 via-indigo-300/8 to-transparent" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="relative space-y-6">
        <SectionBadge className="border-cyan-300/18 bg-white/6 text-cyan-100">
          Choiser overview
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-14 items-center justify-center rounded-[20px] border border-cyan-300/16 bg-white/6 text-cyan-200 shadow-[0_18px_44px_-30px_rgba(56,189,248,0.2)]">
            <Sparkles className="size-6" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-50">
              Una dashboard dark più morbida, leggibile e immediata.
            </h2>
            <p className="text-sm leading-7 text-slate-300">
              Questa variante riporta Choiser verso un tema scuro premium,
              alleggerendo i contrasti più duri e mantenendo ogni modulo
              leggibile sia da desktop sia da smartphone.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Moduli attivi
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-slate-50">
              8
            </p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Pronta per mobile
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-slate-50">
              100%
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              UX goal
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Più focus sull’azione iniziale, meno dispersione e lettura sempre
              chiara.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Feeling
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Gradienti freddi, glow leggeri e superfici scure più morbide.
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
