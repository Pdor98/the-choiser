"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { BottleSpinGame } from "@/features/games/bottle-spin";
import { EliminationWheelGame } from "@/features/games/elimination-wheel";
import { GuessTheNumberGame } from "@/features/games/guess-the-number";
import { TruthOrDareGame } from "@/features/games/truth-or-dare";

const whyCards = [
  {
    emoji: "🎮",
    title: "Pronto in un secondo",
    description: "Nessuna installazione. Apri e gioca, subito.",
  },
  {
    emoji: "🔥",
    title: "Ogni serata è diversa",
    description: "Modalità, domande e sfide sempre nuove.",
  },
  {
    emoji: "🎯",
    title: "Per ogni gruppo",
    description:
      "Dal gioco leggero alla modalità spicy. C'è qualcosa per tutti.",
  },
  {
    emoji: "🤝",
    title: "Connessione vera",
    description:
      "Non solo intrattenimento. Ogni gioco avvicina le persone davvero.",
  },
  {
    emoji: "⚡",
    title: "Veloce e fluido",
    description: "Pensato per il mobile. Zero attriti, massima reattività.",
  },
  {
    emoji: "🪩",
    title: "Un ritmo naturale",
    description:
      "Ruote, bottiglia, taboo e sfide tengono viva la serata senza forzature.",
  },
] as const;

const showcaseCards = [
  {
    icon: "🧠",
    title: "TAB-WHO?",
    description:
      "Sfide in stile Taboo, veloci e divertenti. Timer, punteggio, round rapidi.",
    href: "/games/tab-who",
    label: "Games",
    targetId: null,
    glowClassName:
      "group-hover:border-fuchsia-300/32 group-hover:shadow-[0_24px_70px_-34px_rgba(217,70,239,0.34)]",
  },
  {
    icon: "🔥",
    title: "Obbligo o Verità",
    description:
      "Normale, Spicy e Osé. Domande già pronte, nessuna preparazione.",
    href: "/games#truth-or-dare",
    label: "Games",
    targetId: "truth-or-dare",
    glowClassName:
      "group-hover:border-rose-300/32 group-hover:shadow-[0_24px_70px_-34px_rgba(251,113,133,0.34)]",
  },
  {
    icon: "🍾",
    title: "Gira la Bottiglia",
    description: "Inserisci le tue scelte. La bottiglia decide.",
    href: "/games#bottle-spin",
    label: "Games",
    targetId: "bottle-spin",
    glowClassName:
      "group-hover:border-cyan-300/34 group-hover:shadow-[0_24px_70px_-34px_rgba(34,211,238,0.34)]",
  },
  {
    icon: "🌀",
    title: "Ruota Elimina-Nomi",
    description: "Carica i nomi, lascia che il caso faccia il resto.",
    href: "/games#elimination-wheel",
    label: "Games",
    targetId: "elimination-wheel",
    glowClassName:
      "group-hover:border-sky-300/34 group-hover:shadow-[0_24px_70px_-34px_rgba(59,130,246,0.34)]",
  },
  {
    icon: "🔢",
    title: "Indovina il Numero",
    description: "Range libero, feedback evoluto, storico tentativi.",
    href: "/games#guess-the-number",
    label: "Games",
    targetId: "guess-the-number",
    glowClassName:
      "group-hover:border-emerald-300/32 group-hover:shadow-[0_24px_70px_-34px_rgba(52,211,153,0.3)]",
  },
] as const;

const carouselQuotes = [
  "Le migliori serate non si pianificano. Si innescano.",
  "Un gioco può dire più di mille presentazioni.",
  "Non serve conoscersi da anni. Basta una domanda giusta.",
  "Il momento in cui tutti ridono insieme - quello è il gioco che ha vinto.",
  "Osare un po' è sempre la scelta giusta.",
  "Ogni risposta rivela qualcosa. Ogni sfida avvicina.",
  "La serata perfetta inizia con: a chi tocca?",
  "Non è solo un gioco. È il modo in cui ti ricorderanno.",
  "Il ghiaccio si rompe in un secondo. Basta il gioco giusto.",
  "Giocare insieme è la forma più onesta di conoscersi.",
] as const;

const steps = [
  {
    number: "01",
    title: "Scegli un gioco",
    description:
      "Naviga tra TAB-WHO?, Obbligo o Verità, la Bottiglia, la Ruota e gli altri.",
  },
  {
    number: "02",
    title: "Configura se vuoi",
    description:
      "Giocatori, modalità, intensità. O lascia tutto di default e inizia subito.",
  },
  {
    number: "03",
    title: "Gioca e goditi il momento",
    description:
      "Il resto lo fa Choiser. Tu pensa solo a divertirti.",
  },
] as const;

type InternalGameTarget =
  | "guess-the-number"
  | "truth-or-dare"
  | "bottle-spin"
  | "elimination-wheel";

const internalGameTargets = [
  "guess-the-number",
  "truth-or-dare",
  "bottle-spin",
  "elimination-wheel",
] as const satisfies readonly InternalGameTarget[];

const gamePanels = [
  {
    id: "guess-the-number",
    icon: Target,
    eyebrow: "Guess The Number",
    title: "Indovina il Numero",
    description:
      "Range libero, feedback evoluto e storico tentativi. Si apre solo quando lo scegli.",
    activeClassName:
      "bg-cyan-300/[0.06] shadow-[0_26px_80px_-48px_rgba(34,211,238,0.28)]",
    focusedClassName: "ring-1 ring-cyan-300/20",
    render: () => <GuessTheNumberGame />,
  },
  {
    id: "truth-or-dare",
    icon: Flame,
    eyebrow: "Truth Or Dare",
    title: "Obbligo o Verità",
    description:
      "Normale, Spicy e Osé. Apri il pannello solo quando vuoi entrare davvero nel gioco.",
    activeClassName:
      "bg-rose-300/[0.06] shadow-[0_26px_80px_-48px_rgba(251,113,133,0.28)]",
    focusedClassName: "ring-1 ring-rose-300/20",
    render: () => <TruthOrDareGame />,
  },
  {
    id: "bottle-spin",
    icon: Sparkles,
    eyebrow: "Bottle Spin",
    title: "Gira la Bottiglia",
    description:
      "Inserisci le scelte e lascia che la bottiglia decida. Il modulo resta nascosto finché non lo apri.",
    activeClassName:
      "bg-cyan-300/[0.06] shadow-[0_26px_80px_-48px_rgba(34,211,238,0.28)]",
    focusedClassName: "ring-1 ring-cyan-300/20",
    render: () => <BottleSpinGame />,
  },
  {
    id: "elimination-wheel",
    icon: RotateCcw,
    eyebrow: "Elimination Wheel",
    title: "Ruota Elimina-Nomi",
    description:
      "Carica i nomi e lascia che il caso faccia il resto. Lo apri solo quando serve davvero.",
    activeClassName:
      "bg-sky-300/[0.06] shadow-[0_26px_80px_-48px_rgba(59,130,246,0.28)]",
    focusedClassName: "ring-1 ring-sky-300/20",
    render: () => <EliminationWheelGame />,
  },
] as const;

function isInternalGameTarget(value: string): value is InternalGameTarget {
  return internalGameTargets.includes(value as InternalGameTarget);
}

export default function GamesPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openGameTarget, setOpenGameTarget] =
    useState<InternalGameTarget | null>(null);
  const [focusedGameTarget, setFocusedGameTarget] =
    useState<InternalGameTarget | null>(null);
  const focusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setQuoteIndex((currentIndex) => (currentIndex + 1) % carouselQuotes.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const hash = window.location.hash.replace("#", "");

      if (isInternalGameTarget(hash)) {
        setOpenGameTarget(hash);
        setFocusedGameTarget(hash);
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

  function setFocusedTarget(targetId: InternalGameTarget) {
    setOpenGameTarget(targetId);
    setFocusedGameTarget(targetId);

    if (focusTimerRef.current) {
      window.clearTimeout(focusTimerRef.current);
    }

    focusTimerRef.current = window.setTimeout(() => {
      setFocusedGameTarget((currentTarget) =>
        currentTarget === targetId ? null : currentTarget,
      );
    }, 1800);
  }

  function scrollToGamePanel(targetId: InternalGameTarget) {
    window.requestAnimationFrame(() => {
      const element = document.getElementById(`game-panel-${targetId}`);

      if (!element) {
        return;
      }

      window.history.replaceState(null, "", `#${targetId}`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openGamePanel(targetId: InternalGameTarget) {
    setFocusedTarget(targetId);
    scrollToGamePanel(targetId);
  }

  function toggleGamePanel(targetId: InternalGameTarget) {
    if (openGameTarget === targetId) {
      setOpenGameTarget(null);
      setFocusedGameTarget(null);
      window.history.replaceState(null, "", "/games");
      return;
    }

    openGamePanel(targetId);
  }

  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">
      <section className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,5,51,0.92),transparent_36%),radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_60%),linear-gradient(180deg,rgba(10,10,10,0.2),rgba(10,10,10,0.78))]" />
        <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-400/16 blur-3xl sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-400/12 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Games · Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.5rem,9vw,4.5rem)] font-bold tracking-[-0.04em] text-slate-50">
            Gioca. Scopri. Connettiti.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[35rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Una raccolta di mini giochi pensati per animare ogni serata,
            rompere il ghiaccio e creare momenti che non dimentichi.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex justify-center">
            <EditorialCTAButton href="/games#games-arcade">
              <span>Inizia a giocare</span>
              <ArrowRight className="size-4" />
            </EditorialCTAButton>
          </div>
        </div>
      </section>

      <section id="games-arcade" className="scroll-mt-28 space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Apri e gioca"
          description="Le card qui sopra sono il vero hub di accesso: scegli un gioco e apri solo quello che ti serve, nel momento in cui ti serve."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {showcaseCards.map((card) => {
            const isActive = card.targetId !== null && openGameTarget === card.targetId;

            if (card.targetId) {
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => openGamePanel(card.targetId)}
                  aria-pressed={isActive}
                  className={`group rounded-[30px] border border-white/6 bg-[#111111] p-5 text-left transition duration-300 hover:-translate-y-1 ${card.glowClassName} ${
                    isActive
                      ? "border-white/14 bg-white/[0.06] shadow-[0_24px_70px_-34px_rgba(34,211,238,0.18)]"
                      : ""
                  }`}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-3xl">{card.icon}</span>
                      <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        {isActive ? "Aperto" : card.label}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-50">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                      {card.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                      <span>Apri il gioco</span>
                      <ChevronRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group rounded-[30px] border border-white/6 bg-[#111111] p-5 transition duration-300 hover:-translate-y-1 ${card.glowClassName}`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-50">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                    {card.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-200">
                    <span>Apri</span>
                    <ChevronRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="space-y-8">
          {gamePanels.map((panel) => {
            const Icon = panel.icon;
            const isOpen = openGameTarget === panel.id;
            const isFocused = focusedGameTarget === panel.id;

            return (
              <article
                key={panel.id}
                id={`game-panel-${panel.id}`}
                className={`scroll-mt-28 rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,18,30,0.94),rgba(14,22,36,0.96))] p-2 transition duration-500 sm:scroll-mt-32 ${
                  isOpen ? panel.activeClassName : ""
                } ${isFocused ? panel.focusedClassName : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleGamePanel(panel.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start justify-between gap-4 rounded-[28px] px-4 py-5 text-left sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white">
                        <Icon className="size-4.5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                          {panel.eyebrow}
                        </p>
                        <h3 className="mt-2 font-heading text-2xl font-semibold text-slate-50">
                          {panel.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                      {panel.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      {isOpen ? "Aperto" : "Scopri"}
                    </span>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition duration-300 group-hover:border-white/16 group-hover:text-white">
                      <ChevronDown
                        className={`size-4 transition duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-1 pb-1 pt-2">{panel.render()}</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Perché Games?"
          description="Una sezione pensata per partire in fretta, coinvolgere subito e lasciare il centro della scena alle persone con cui stai giocando."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {whyCards.map((card) => (
            <article
              key={card.title}
              className="group relative overflow-hidden rounded-[30px] border border-white/7 bg-white/[0.03] p-5 shadow-[0_18px_54px_-42px_rgba(15,23,42,0.82)] backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:border-violet-300/26 hover:shadow-[0_22px_70px_-40px_rgba(168,85,247,0.24)] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_48%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              <div className="relative">
                <span className="text-2xl">{card.emoji}</span>
                <h3 className="mt-5 text-lg font-semibold text-slate-50">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,8,10,0.94),rgba(12,14,22,0.96))] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_42%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_48%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <EditorialSectionHeader title="Perché giocare insieme" />

          <div className="mt-10">
            <div className="flex min-h-[13rem] items-center justify-center">
              <p
                key={quoteIndex}
                className="editorial-quote-fade max-w-4xl text-balance text-[clamp(1.9rem,4vw,3.15rem)] font-medium italic tracking-[-0.03em] text-slate-100"
              >
                “{carouselQuotes[quoteIndex]}”
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-2.5">
              {carouselQuotes.map((quote, index) => (
                <button
                  key={quote}
                  type="button"
                  aria-label={`Mostra frase ${index + 1}`}
                  onClick={() => setQuoteIndex(index)}
                  className={`h-2.5 rounded-full transition duration-300 ${
                    index === quoteIndex
                      ? "w-8 bg-violet-300 shadow-[0_0_24px_rgba(168,85,247,0.56)]"
                      : "w-2.5 bg-white/22 hover:bg-white/38"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Tre passi, zero attrito"
          description="Una sequenza così semplice che dopo il primo giro smetti di pensarci e inizi a giocare davvero."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative overflow-hidden rounded-[30px] border border-white/7 bg-[linear-gradient(180deg,rgba(11,16,24,0.94),rgba(14,20,31,0.96))] px-5 py-6 shadow-[0_20px_56px_-42px_rgba(15,23,42,0.82)] sm:px-6 sm:py-7"
            >
              <span className="pointer-events-none absolute right-4 top-2 font-heading text-[4.75rem] font-semibold tracking-[-0.08em] text-white/[0.05] sm:text-[5.75rem]">
                {step.number}
              </span>
              <div className="relative max-w-sm">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Step {step.number}
                </p>
                <h3 className="mt-5 text-xl font-semibold text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] border border-violet-300/10 bg-[linear-gradient(135deg,#1a0533_0%,#111426_46%,#0a1628_100%)] px-5 py-16 shadow-[0_30px_96px_-56px_rgba(76,29,149,0.78)] sm:px-8 sm:py-20 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.24),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_36%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold tracking-[-0.04em] text-slate-50">
            Stasera si gioca.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-8 text-slate-300 sm:text-lg">
            Scegli il tuo gioco e inizia. È immediato, è gratuito, è fatto
            per divertirsi.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EditorialCTAButton href="/games#games-arcade">
              <span>Entra in Games</span>
              <ArrowRight className="size-4" />
            </EditorialCTAButton>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 px-6 text-sm font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/[0.05]"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </section>

      <EditorialFooter />

      <PageExitBar description="Quando hai finito puoi continuare a giocare, cambiare sezione o tornare alla home senza perdere il ritmo della serata." />
    </div>
  );
}
