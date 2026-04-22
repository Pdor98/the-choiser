"use client";

import { ArrowDown, Compass, Dices, Sparkles, Wand2, Zap } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { Card } from "@/components/ui/card";
import { RandomHub, type RandomModuleTarget } from "@/features/random/random-hub";

const randomAccessCards = [
  {
    icon: Wand2,
    eyebrow: "Idea veloce",
    title: "Cosa fare oggi?",
    description:
      "Quando vi serve un primo spunto concreto per smuovere la giornata o la serata.",
    targetId: "today-prompt",
  },
  {
    icon: Sparkles,
    eyebrow: "Risposta istantanea",
    title: "Libro delle risposte",
    description:
      "Per quelle domande che non hanno bisogno di analisi, ma di un segnale netto.",
    targetId: "instant-answer",
  },
  {
    icon: Dices,
    eyebrow: "Caso puro",
    title: "Numero casuale",
    description:
      "Se vi serve solo una decisione pulita, rapida e leggibile al primo sguardo.",
    targetId: "random-number",
  },
] as const satisfies readonly {
  icon: typeof Wand2;
  eyebrow: string;
  title: string;
  description: string;
  targetId: RandomModuleTarget;
}[];

export default function RandomPage() {
  const randomLabRef = useRef<HTMLElement | null>(null);
  const focusTimerRef = useRef<number | null>(null);
  const [focusedTarget, setFocusedTarget] =
    useState<RandomModuleTarget | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const hash = window.location.hash.replace("#random-module-", "");

      if (
        hash === "today-prompt" ||
        hash === "instant-answer" ||
        hash === "random-number"
      ) {
        setFocusedTarget(hash);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  function handleRandomJump(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const element = randomLabRef.current ?? document.getElementById("random-lab");

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
    window.history.replaceState(null, "", `${currentPath}#random-lab`);
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function openRandomModule(targetId: RandomModuleTarget) {
    setFocusedTarget(targetId);

    if (focusTimerRef.current) {
      window.clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = window.setTimeout(() => {
      setFocusedTarget((currentTarget) =>
        currentTarget === targetId ? null : currentTarget,
      );
    }, 1800);

    window.requestAnimationFrame(() => {
      const element = document.getElementById(`random-module-${targetId}`);

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
      window.history.replaceState(
        null,
        "",
        `${currentPath}#random-module-${targetId}`,
      );
      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth",
      });
    });
  }

  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">
      <section className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(24,16,20,0.82)] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(58,7,20,0.46),transparent_34%),radial-gradient(circle_at_center,rgba(123,18,48,0.12),transparent_58%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.8))]" />
        <div className="pointer-events-none absolute left-1/2 top-12 h-52 w-52 -translate-x-1/2 rounded-full bg-[rgba(168,36,62,0.12)] blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-[#7b1230]/8 blur-3xl sm:h-88 sm:w-88" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Random · Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.2rem,8vw,4.4rem)] font-bold tracking-[-0.04em] text-slate-50">
            Quando nessuno vuole scegliere, Random lo fa per voi.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[36rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Un&apos;idea da seguire, una risposta da ascoltare o un numero da
            lasciare al caso: scegli il segnale che ti serve e fai ripartire
            il momento.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex justify-center">
            <EditorialCTAButton
              href="/random#random-lab"
              onClick={handleRandomJump}
              ariaControls="random-lab"
            >
              <span>Scegli il tuo segnale</span>
              <ArrowDown className="size-4" />
            </EditorialCTAButton>
          </div>
        </div>
      </section>

      <section
        id="random-lab"
        ref={randomLabRef}
        className="scroll-mt-28 space-y-8 sm:space-y-10"
      >
        <EditorialSectionHeader
          title="Scegli da dove partire"
          description="Tre ingressi chiari, un solo principio: prima capisci cosa ti serve, poi lo apri e lo usi subito."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {randomAccessCards.map((card) => {
            const Icon = card.icon;
            const isActive = focusedTarget === card.targetId;

            return (
              <button
                key={card.targetId}
                type="button"
                onClick={() => openRandomModule(card.targetId)}
                aria-pressed={isActive}
                className={`group rounded-[30px] border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                  isActive
                    ? "border-[#a8243e]/18 bg-[linear-gradient(180deg,rgba(11,20,34,0.98),rgba(15,27,46,0.94))] shadow-[0_24px_70px_-40px_rgba(15,23,42,0.34)]"
                    : "border-white/7 bg-[linear-gradient(180deg,rgba(10,17,29,0.96),rgba(14,24,40,0.92))] shadow-[0_24px_70px_-50px_rgba(15,23,42,0.9)] hover:border-[#a8243e]/14 hover:shadow-[0_24px_70px_-42px_rgba(15,23,42,0.72)]"
                }`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#c88fa1]">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      {isActive ? "Attivo" : card.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-50">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                    {card.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                    <span>Vai al modulo</span>
                    <ArrowDown className="size-4 transition duration-300 group-hover:translate-y-0.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <RandomHub focusedTarget={focusedTarget} />

        <p className="mx-auto max-w-3xl text-center text-sm leading-7 text-slate-400 sm:text-base">
          Un ingresso rapido, un gesto chiaro, una risposta subito leggibile:
          Random deve servirti in fretta, non farti perdere tempo.
        </p>
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
            <Card
              key={item.title}
              className="p-6"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#c88fa1]">
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
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-[#c88fa1]">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-300">
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
