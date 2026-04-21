import { ArrowRight, Compass, Dices, Sparkles, Zap } from "lucide-react";

import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { Card } from "@/components/ui/card";
import { RandomHub } from "@/features/random/random-hub";

export default function RandomPage() {
  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">
      <section className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,59,76,0.48),transparent_34%),radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_58%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.8))]" />
        <div className="pointer-events-none absolute left-1/2 top-12 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-300/14 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl sm:h-88 sm:w-88" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Random · Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.2rem,8vw,4.4rem)] font-bold tracking-[-0.04em] text-slate-50">
            Lascia spazio al caso.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[36rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Prompt quotidiani, risposte istantanee e piccoli segnali eleganti
            per quando vuoi smettere di pensarci troppo e lasciarti guidare.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex justify-center">
            <EditorialCTAButton href="/random#random-lab">
              <span>Apri Random</span>
              <ArrowRight className="size-4" />
            </EditorialCTAButton>
          </div>
        </div>
      </section>

      <section id="random-lab" className="scroll-mt-28 space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Apri Random"
          description="Se vuoi usarlo subito, qui sotto trovi tutta la sezione pronta, senza passaggi intermedi."
        />

        <RandomHub />
      </section>

      <section className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Cosa trovi dentro"
          description="Una sezione compatta che alterna ispirazione, gioco leggero e casualità pura senza costringerti a preparare nulla."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Cosa fare oggi?",
              description:
                "Un suggerimento semplice e realistico per orientare la giornata con zero attrito.",
            },
            {
              title: "Libro delle risposte",
              description:
                "Una risposta istantanea, evocativa, quasi cinematografica. Giusta o sbagliata, ti smuove.",
            },
            {
              title: "Numero casuale",
              description:
                "Da 1 a 100, immediato e leggibile. Quando ti serve solo lasciare decidere il caso.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-white/7 bg-[linear-gradient(180deg,rgba(10,17,29,0.96),rgba(14,24,40,0.92))] p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.9)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Modulo
              </p>
              <h2 className="mt-5 text-2xl font-semibold text-slate-50">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Perché Random?"
          description="Perché a volte non ti serve una spiegazione in più. Ti serve solo un segnale chiaro, un numero, un'idea o una risposta abbastanza netta da farti muovere."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Rompe l'indecisione",
              description:
                "Ti aiuta a partire subito, senza restare incastrato tra troppe possibilità.",
            },
            {
              icon: Sparkles,
              title: "Ha il tono giusto",
              description:
                "Non è rumoroso, non è banale. È leggero, elegante, immediato.",
            },
            {
              icon: Zap,
              title: "Funziona ovunque",
              description:
                "Sul divano, fuori casa, durante una pausa. Apri, usi, continui.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
                <item.icon className="size-5" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-slate-50">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

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
              rapido, da aprire quando vuoi un segnale in più.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles className="size-3.5" />
              Mobile-ready
            </div>
          </div>
        </div>
      </Card>

      <EditorialFooter />

      <PageExitBar description="Quando hai finito con un prompt o una risposta casuale, puoi tornare alla home o cambiare sezione senza fare scroll all’indietro." />
    </div>
  );
}
