import { Dices, Sparkles } from "lucide-react";

import { PageExitBar } from "@/components/layout/page-exit-bar";
import { Card } from "@/components/ui/card";
import { SectionBadge } from "@/components/ui/section-badge";
import { RandomHub } from "@/features/random/random-hub";

export default function RandomPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionBadge>Random category</SectionBadge>
        <div className="space-y-3">
          <h1 className="font-heading max-w-4xl text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.65rem]">
            Prima il prompt giusto per oggi, poi una risposta casuale al volo.
          </h1>
        </div>
      </section>

      <RandomHub />

      <Card className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-cyan-300/16 bg-white/6 p-3 text-cyan-200">
            <Dices className="size-5" />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Nuova struttura
            </p>
            <p className="text-sm leading-7 text-slate-300">
              La pagina Random parte da un suggerimento concreto su cosa fare
              oggi e affianca un piccolo libro delle risposte, elegante e
              rapido, da aprire quando vuoi un segnale in piu.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles className="size-3.5" />
              Mobile-ready
            </div>
          </div>
        </div>
      </Card>

      <PageExitBar description="Quando hai finito con un prompt o una risposta casuale, puoi tornare alla home o cambiare sezione senza fare scroll all’indietro." />
    </div>
  );
}
