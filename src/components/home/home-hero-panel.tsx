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
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-cyan-300/14 via-indigo-300/10 to-transparent" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-cyan-200/8 blur-3xl" />
      <div className="relative space-y-6">
        <SectionBadge className="border-cyan-100/14 bg-slate-950/52 text-white/84">
          Control panel
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-14 items-center justify-center rounded-[20px] border border-cyan-100/14 bg-[linear-gradient(180deg,rgba(17,29,47,0.96),rgba(8,15,28,0.94))] text-cyan-100 shadow-[0_20px_48px_-34px_rgba(56,189,248,0.5)]">
            <Sparkles className="size-6" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
              Un’interfaccia pensata per scegliere con meno attrito.
            </h2>
            <p className="text-sm leading-7 text-white/80">
              Choiser combina micro-tool, giochi veloci e generatori casuali in
              un layout più pulito, leggibile e modulare, pensato per desktop e
              mobile.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/12 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/64">
              Moduli attivi
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-white">
              8
            </p>
          </div>
          <div className="rounded-[22px] border border-white/12 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/64">
              Pronta per mobile
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-white">
              100%
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/10 bg-slate-950/42 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/56">
              UX goal
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Meno rumore visivo, più gerarchia, azioni subito riconoscibili.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-slate-950/42 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/56">
              Feeling
            </p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Dashboard leggera, superfici premium e navigazione più chiara.
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
            className="text-slate-950"
            style={primaryButtonReadableStyle}
          >
            Apri il Random
          </span>
        </Link>
      </div>
    </Card>
  );
}
