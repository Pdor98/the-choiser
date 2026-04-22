"use client";

import { ArrowDown, Dices, Hourglass, SlidersHorizontal, TimerReset } from "lucide-react";
import { useRef, type MouseEvent } from "react";

import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { Card } from "@/components/ui/card";
import { DiceArenaGame } from "@/features/games/dice-arena";
import { TimerTool } from "@/features/tools/timer-tool";

export default function ToolsPage() {
  const toolsDeckRef = useRef<HTMLElement | null>(null);

  function handleToolsJump(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const element = toolsDeckRef.current ?? document.getElementById("tools-deck");

    if (!element) {
      return;
    }

    const headerElement = document.querySelector("header");
    const headerHeight =
      headerElement instanceof HTMLElement
        ? headerElement.getBoundingClientRect().height
        : 0;

    const targetTop =
      element.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

    const currentPath = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", `${currentPath}#tools-deck`);
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">
      <section className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,66,48,0.4),transparent_34%),radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_58%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.8))]" />
        <div className="pointer-events-none absolute left-1/2 top-12 h-52 w-52 -translate-x-1/2 rounded-full bg-emerald-300/12 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl sm:h-88 sm:w-88" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Tools · Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.2rem,8vw,4.4rem)] font-bold tracking-[-0.04em] text-slate-50">
            Piccoli strumenti che fanno la differenza.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[36rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Non fanno rumore, non si mettono in mezzo - ma quando ne hai
            bisogno, ci sono.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex justify-center">
            <EditorialCTAButton
              href="/tools#tools-deck"
              onClick={handleToolsJump}
              ariaControls="tools-deck"
            >
              <span>Apri Tools</span>
              <ArrowDown className="size-4" />
            </EditorialCTAButton>
          </div>
        </div>
      </section>

      <section
        id="tools-deck"
        ref={toolsDeckRef}
        className="scroll-mt-28 space-y-8 sm:space-y-10"
      >
        <EditorialSectionHeader
          title="Apri Tools"
          description="Qui sotto trovi i moduli già attivi, pronti da usare senza cambiare contesto."
        />

        <TimerTool />
        <DiceArenaGame />
      </section>

      <section className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Cosa trovi dentro"
          description="Un piccolo deck di utility che fanno poche cose, ma le fanno bene: misurano il tempo, lanciano il caso, ti aiutano a decidere in fretta."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            {
              title: "Timer",
              description:
                "Preset rapidi, countdown chiaro e una UI pulita che resta leggibile anche al volo.",
            },
            {
              title: "Dado Configurabile",
              description:
                "Scegli il tipo di dado, il numero di lanci e lascia che il risultato si componga da solo.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-white/7 bg-[linear-gradient(180deg,rgba(10,17,29,0.96),rgba(14,24,40,0.92))] p-6 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.9)]"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Utility
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
          title="Perché Tools?"
          description="Perché i buoni strumenti non rubano attenzione. Ti fanno fare una cosa in fretta, bene e con un'interfaccia che non pesa."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: TimerReset,
              title: "Pratici subito",
              description:
                "Apri, scegli, parti. Nessun setup inutile, nessuna schermata di troppo.",
            },
            {
              icon: SlidersHorizontal,
              title: "Configurabili il giusto",
              description:
                "Abbastanza flessibili da adattarsi a te, abbastanza semplici da non rallentarti.",
            },
            {
              icon: Hourglass,
              title: "Pensati per restare leggibili",
              description:
                "Su mobile, durante una serata o in mezzo a una pausa: tutto resta chiaro.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-emerald-200">
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

      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-cyan-300/16 bg-white/6 p-3 text-cyan-200">
            <Dices className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Utility deck
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Timer e dadi convivono in una sezione più chiara: preset rapidi,
              countdown in vista classica o clessidra e lanci personalizzati
              con storico rendono Tools più pratico e immediato.
            </p>
          </div>
        </div>
      </Card>

      <EditorialFooter />

      <PageExitBar description="Quando hai finito con timer o dadi puoi tornare alla home o aprire un’altra sezione senza risalire fino all’header." />
    </div>
  );
}
