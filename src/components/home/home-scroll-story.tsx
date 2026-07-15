"use client";

import { ArrowRight, Dices, Gamepad2, Moon, TimerReset } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useRef, useState, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Chapters — una serata in 4 atti
// ─────────────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    n: "01",
    act: "La scena",
    line1: "Siete in cinque.",
    line2: "Nessuno decide niente.",
    body: "Conoscete quel momento. Siete carichi, siete insieme, lo schermo è lì. Ma manca qualcosa — qualcuno — che dia il via. Quel qualcuno è Choiser.",
    cta: { label: "Scopri Choiser", href: "/" },
    stat: { n: "00:00", label: "ora di iniziare" },
    accentHex: "#67d8ff",
    accentRgb: "103 216 255",
    dotCls: "bg-sky-400",
    bg: "radial-gradient(ellipse 130% 90% at 15% 20%, rgba(8,30,60,0.92), transparent 55%), linear-gradient(170deg, #030810 0%, #060f1e 55%, #040c18 100%)",
    halo1: "rgba(56,130,220,0.24)",
    halo2: "rgba(30,80,140,0.16)",
    screenLabel: "La serata non è ancora iniziata",
  },
  {
    n: "02",
    act: "Il momento",
    line1: "Qualcuno apre",
    line2: "Choiser.",
    body: "Random lancia una risposta netta in tre secondi. Nessuna discussione, nessun voto. Una direzione — concreta, immediata, inappellabile. La serata ha trovato il suo via.",
    cta: { label: "Prova Random", href: "/random" },
    stat: { n: "3s", label: "per decidere" },
    accentHex: "#22d3ee",
    accentRgb: "34 211 238",
    dotCls: "bg-cyan-400",
    bg: "radial-gradient(ellipse 130% 90% at 15% 20%, rgba(6,52,72,0.92), transparent 55%), linear-gradient(170deg, #020a0f 0%, #041520 55%, #030e18 100%)",
    halo1: "rgba(22,200,220,0.26)",
    halo2: "rgba(10,100,120,0.16)",
    screenLabel: "Random ha deciso",
  },
  {
    n: "03",
    act: "L'esplosione",
    line1: "La serata",
    line2: "accende tutto.",
    body: "Obbligo o Verità, Chi è più probabile, TAB-WHO, la Ruota. Sei giochi pronti — nessuno da spiegare, nessuno da scaricare. Aprite e iniziate a ridere.",
    cta: { label: "Vai ai Games", href: "/games" },
    stat: { n: "6", label: "giochi pronti" },
    accentHex: "#a78bfa",
    accentRgb: "167 139 250",
    dotCls: "bg-violet-400",
    bg: "radial-gradient(ellipse 130% 90% at 15% 20%, rgba(42,10,95,0.92), transparent 55%), linear-gradient(170deg, #04020c 0%, #0b0420 55%, #07031a 100%)",
    halo1: "rgba(150,100,250,0.26)",
    halo2: "rgba(80,40,160,0.16)",
    screenLabel: "Il gioco è iniziato",
  },
  {
    n: "04",
    act: "Il ritorno",
    line1: "Tornerete ancora.",
    line2: "Lo sappiamo già.",
    body: "Perché funziona. Perché non serve spiegarlo a nessuno. Perché basta aprire il link, e la serata — di nuovo — prende forma da sola.",
    cta: { label: "Inizia stasera", href: "/games" },
    stat: { n: "∞", label: "serate" },
    accentHex: "#34d399",
    accentRgb: "52 211 153",
    dotCls: "bg-emerald-400",
    bg: "radial-gradient(ellipse 130% 90% at 15% 20%, rgba(5,60,38,0.92), transparent 55%), linear-gradient(170deg, #020a05 0%, #041409 55%, #030f06 100%)",
    halo1: "rgba(40,200,120,0.26)",
    halo2: "rgba(20,110,62,0.16)",
    screenLabel: "La serata è tua",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// WordReveal
// ─────────────────────────────────────────────────────────────────────────────
function WordReveal({
  text,
  className,
  style,
  startDelay = 0,
  reduceMotion = false,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  startDelay?: number;
  reduceMotion?: boolean;
}) {
  if (reduceMotion) {
    return <span className={className} style={style}>{text}</span>;
  }
  const words = text.split(" ");
  return (
    <span className={cn("inline", className)} style={style}>
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <span className="inline-block overflow-hidden leading-[1.15]">
            <motion.span
              className="inline-block"
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: startDelay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && <span className="inline-block w-[0.28em]" />}
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phone screens
// ─────────────────────────────────────────────────────────────────────────────
function PhoneIdleScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-5 pb-4">
      <Moon className="mb-5 size-10 text-slate-600" strokeWidth={1} />
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-slate-600">
        In attesa
      </p>
      <p className="mt-3 text-center text-[0.9rem] font-semibold leading-snug text-slate-500">
        Siete in cinque.<br />Nessuno ha ancora deciso.
      </p>
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-700"
            style={{ animation: `pulse 1.6s ease-in-out ${i * 0.25}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function PhoneRandomScreen() {
  return (
    <div className="flex h-full flex-col items-stretch px-4 pb-5 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Random</p>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-cyan-300">Via!</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="w-full rounded-[18px] border border-cyan-300/14 bg-cyan-300/[0.06] px-5 py-6 text-center">
          <p className="text-[8px] uppercase tracking-[0.32em] text-slate-500">Stasera fate</p>
          <p className="mt-3 font-heading text-[1.3rem] font-bold leading-tight tracking-[-0.03em] text-slate-50">
            Obbligo o Verità
          </p>
          <p className="mt-1 text-[9px] text-cyan-300/70">Risposta in 3s</p>
        </div>
        <div className="flex w-full gap-2">
          {["Idea", "Risposta", "Numero"].map((label, i) => (
            <div
              key={label}
              className={cn(
                "flex-1 rounded-xl py-2 text-center text-[9px] font-semibold",
                i === 0
                  ? "border border-cyan-400/28 bg-cyan-400/12 text-cyan-200"
                  : "border border-white/6 bg-white/[0.03] text-slate-500",
              )}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <button className="mt-2 w-full rounded-2xl border border-cyan-400/18 bg-cyan-400/[0.08] py-3 text-[11px] font-semibold text-cyan-200">
        Un&apos;altra idea →
      </button>
    </div>
  );
}

function PhoneGamesScreen() {
  const games = [
    { label: "Obbligo o Verità", tag: "In corso →", cls: "text-rose-200 border-rose-400/30 bg-rose-400/[0.1]", active: true },
    { label: "Chi è più probabile", tag: "Pronto", cls: "text-amber-200 border-amber-400/15 bg-amber-400/[0.04]", active: false },
    { label: "TAB-WHO?", tag: "Pronto", cls: "text-sky-200 border-sky-400/15 bg-sky-400/[0.04]", active: false },
    { label: "Ruota Elimina-Nomi", tag: "Pronto", cls: "text-fuchsia-200 border-fuchsia-400/15 bg-fuchsia-400/[0.04]", active: false },
  ];
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Games</p>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {games.map((g) => (
          <div
            key={g.label}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-3 py-2.5",
              g.cls,
              g.active && "shadow-[0_0_12px_rgba(251,113,133,0.2)]",
            )}
          >
            <div>
              <p className="text-[10px] font-semibold leading-none">{g.label}</p>
              <p className={cn("mt-0.5 text-[8px]", g.active ? "opacity-80" : "opacity-40")}>{g.tag}</p>
            </div>
            <ArrowRight className={cn("size-3", g.active ? "opacity-70" : "opacity-20")} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneReturnScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-5 pb-4">
      <div className="flex items-center justify-center rounded-[28px] border border-emerald-300/15 bg-emerald-300/[0.06] p-5">
        <Gamepad2 className="size-8 text-emerald-300/80" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300/60">Sessione #47</p>
        <p className="mt-2 font-heading text-[1.1rem] font-bold leading-snug tracking-[-0.02em] text-slate-50">
          Di nuovo qui.
        </p>
        <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">Come ogni venerdì.</p>
      </div>
      <div className="flex gap-2">
        {[
          { icon: Dices, label: "Random", cls: "text-cyan-300 border-cyan-300/15 bg-cyan-300/[0.05]" },
          { icon: TimerReset, label: "Tools", cls: "text-emerald-300 border-emerald-300/15 bg-emerald-300/[0.05]" },
        ].map(({ icon: Icon, label, cls }) => (
          <div key={label} className={cn("flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2.5", cls)}>
            <Icon className="size-3.5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS = [PhoneIdleScreen, PhoneRandomScreen, PhoneGamesScreen, PhoneReturnScreen];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function HomeScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [chapter, setChapter] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3;
    setChapter((c) => (c === next ? c : next));
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [18, 56]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 0.975]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);

  const ph0O = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0]);
  const ph1O = useTransform(scrollYProgress, [0.22, 0.28, 0.47, 0.53], [0, 1, 1, 0]);
  const ph2O = useTransform(scrollYProgress, [0.47, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const ph3O = useTransform(scrollYProgress, [0.72, 0.78, 1], [0, 1, 1]);
  const phoneOpacities = [ph0O, ph1O, ph2O, ph3O];

  const railW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToChapter = useCallback((index: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const scrollableHeight = sectionRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({ top: sectionTop + scrollableHeight * (index / CHAPTERS.length + 0.01), behavior: "smooth" });
  }, []);

  const ch = CHAPTERS[chapter];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[320vh]"
      aria-label="Scroll story Choiser"
    >
      {/* Sticky container — NO overflow:hidden (rompe sticky in alcuni browser).
          Il clip dei bordi arrotondati è fatto dal div figlio absolute con overflow:clip */}
      <div className="sticky top-0 h-screen">

        {/* Questo div fa il clip visivo senza rompere sticky */}
        <div className="absolute inset-0 overflow-clip rounded-[24px] border border-white/8 sm:rounded-[32px] lg:rounded-[36px]">

          {/* Sfondo */}
          <div className="absolute inset-0 transition-all duration-700" style={{ background: ch.bg }} />

          {/* Aurora orbs */}
          <div className="pointer-events-none absolute left-[18%] top-[-8%] h-[44%] w-[52%] -translate-x-1/2 rounded-full blur-3xl transition-colors duration-700" style={{ background: ch.halo1, animation: "aurora-a 8s ease-in-out infinite" }} />
          <div className="pointer-events-none absolute right-[-4%] top-[15%] h-[36%] w-[40%] rounded-full blur-3xl transition-colors duration-700" style={{ background: ch.halo2, animation: "aurora-b 11s ease-in-out infinite" }} />
          <div className="pointer-events-none absolute bottom-[-10%] left-[45%] h-[28%] w-[32%] rounded-full opacity-40 blur-3xl transition-colors duration-700" style={{ background: ch.halo1, animation: "aurora-c 13s ease-in-out infinite" }} />

          {/* Noise + grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.032]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px 256px" }} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.026)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content */}
          <div className="relative flex h-full flex-col">

            {/* Main area */}
            <div className="flex flex-1 items-center overflow-visible">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-14">
                <div className="grid items-center gap-6 sm:gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:gap-16">

                  {/* Left — narrative */}
                  <div className="order-2 w-full xl:order-1">

                    {/* Act + nav */}
                    <motion.div
                      className="mb-5 flex items-center gap-3 sm:mb-7"
                      initial={reduceMotion ? {} : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`act-${chapter}`}
                          className="rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.32em] backdrop-blur-sm"
                          style={{ color: ch.accentHex, borderColor: `rgba(${ch.accentRgb},0.2)`, background: `rgba(${ch.accentRgb},0.06)` }}
                          initial={reduceMotion ? {} : { opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.35 }}
                        >
                          {ch.act}
                        </motion.span>
                      </AnimatePresence>

                      <div className="flex items-center gap-2">
                        {CHAPTERS.map((item, i) => (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Vai a ${item.act}`}
                            onClick={() => scrollToChapter(i)}
                            className={cn("rounded-full transition-all duration-500", i === chapter ? cn("h-1.5 w-6", item.dotCls) : "size-1.5 bg-white/20 hover:bg-white/35")}
                          />
                        ))}
                      </div>

                      <div className="ml-auto flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 backdrop-blur-sm">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`stat-${chapter}`}
                            className="font-mono text-sm font-bold tabular-nums"
                            style={{ color: ch.accentHex }}
                            initial={reduceMotion ? {} : { opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? {} : { opacity: 0, y: -5 }}
                            transition={{ duration: 0.28 }}
                          >
                            {ch.stat.n}
                          </motion.span>
                        </AnimatePresence>
                        <span className="text-[8px] uppercase tracking-[0.2em] text-slate-500">{ch.stat.label}</span>
                      </div>
                    </motion.div>

                    {/* Text area */}
                    <div className="relative min-h-[240px] sm:min-h-[290px] lg:min-h-[340px]">

                      {/* Decorative chapter number */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`num-${chapter}`}
                          className="pointer-events-none absolute -left-2 -top-4 select-none font-heading text-[6rem] font-black leading-none tracking-[-0.1em] sm:-top-6 sm:text-[10rem] lg:text-[13rem]"
                          style={{ color: ch.accentHex, opacity: 0.028 }}
                          initial={reduceMotion ? {} : { opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 0.028, scale: 1 }}
                          exit={reduceMotion ? {} : { opacity: 0, scale: 1.12 }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {ch.n}
                        </motion.div>
                      </AnimatePresence>

                      {/* Chapter content */}
                      <AnimatePresence>
                        <motion.div
                          key={`ch-${chapter}`}
                          className="absolute inset-x-0 top-0"
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)", y: 20 }}
                          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: -24 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="mt-1">
                            <WordReveal
                              text={ch.line1}
                              className="font-heading block text-[clamp(2.2rem,7.5vw,5rem)] font-black leading-[1.0] tracking-[-0.05em] text-slate-50 sm:text-[clamp(2.6rem,6.5vw,5rem)]"
                              startDelay={0.1}
                              reduceMotion={reduceMotion}
                            />
                            <WordReveal
                              text={ch.line2}
                              className="font-heading block text-[clamp(2.2rem,7.5vw,5rem)] font-black leading-[1.0] tracking-[-0.05em] sm:text-[clamp(2.6rem,6.5vw,5rem)]"
                              style={{ color: ch.accentHex }}
                              startDelay={0.22}
                              reduceMotion={reduceMotion}
                            />
                          </div>

                          <motion.div
                            className="mt-6 h-px w-10 rounded-full sm:mt-7"
                            style={{ backgroundColor: `rgba(${ch.accentRgb}, 0.4)` }}
                            initial={reduceMotion ? {} : { scaleX: 0, originX: "0%" }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.38, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          />

                          <motion.p
                            className="mt-5 max-w-[34rem] text-[0.9rem] leading-[1.85] text-slate-400 sm:text-[1rem] lg:text-[1.08rem]"
                            initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.44, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {ch.body}
                          </motion.p>

                          <motion.div
                            initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.58, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <a
                              href={ch.cta.href}
                              className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2.5 text-[0.82rem] font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:border-white/22 hover:bg-white/10 sm:mt-9 sm:px-6 sm:py-3"
                            >
                              {ch.cta.label}
                              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right — phone */}
                  <div className="order-1 hidden justify-center pt-5 xl:order-2 xl:flex xl:justify-end xl:pt-8" aria-hidden="true">
                    <motion.div
                      className="relative"
                      style={reduceMotion ? undefined : { y: phoneY, scale: phoneScale, rotateX: phoneRotateX, perspective: 1000 }}
                    >
                      <div className="absolute inset-[-24%] rounded-full blur-3xl transition-all duration-700" style={{ background: ch.halo1, opacity: 0.5 }} />

                      <div className="relative h-[220px] w-[124px] overflow-hidden rounded-[30px] border border-white/14 bg-[#040810] shadow-[0_48px_120px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.09)] sm:h-[360px] sm:w-[200px] sm:rounded-[40px] lg:h-[500px] lg:w-[274px] lg:rounded-[48px]">
                        <div className="pointer-events-none absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse 65% 40% at 50% 0%, rgba(${ch.accentRgb} / 0.18), transparent 56%)` }} />

                        {/* Status bar */}
                        <div className="absolute left-5 right-5 top-3.5 flex items-center justify-between text-[7.5px] text-white/25">
                          <span className="font-semibold tabular-nums">9:41</span>
                          <div className="flex items-center gap-[3px]">
                            {[2, 3, 4, 4].map((h, j) => (
                              <div key={j} className="w-[2.5px] rounded-sm bg-current" style={{ height: `${h * 2}px`, opacity: j < 3 ? 1 : 0.3 }} />
                            ))}
                            <div className="ml-1 h-2 w-3.5 rounded-[3px] border border-current">
                              <div className="m-px h-full w-3/4 rounded-sm bg-current" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 top-2.5 h-[17px] w-[66px] -translate-x-1/2 rounded-full bg-black" />

                        {/* Screens */}
                        <div className="absolute inset-0 pt-12">
                          {SCREENS.map((Screen, i) => (
                            <motion.div
                              key={i}
                              className={cn("absolute inset-0", i === chapter ? "!opacity-100" : "pointer-events-none hidden !opacity-0")}
                              style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: phoneOpacities[i] }}
                            >
                              <Screen />
                            </motion.div>
                          ))}
                        </div>

                        {/* Screen label */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`label-${chapter}`}
                            className="absolute inset-x-3 bottom-8 rounded-xl border border-white/6 bg-black/40 px-3 py-2 backdrop-blur-md"
                            initial={reduceMotion ? {} : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? {} : { opacity: 0, y: -4 }}
                            transition={{ duration: 0.4 }}
                          >
                            <p className="text-center text-[8px] text-slate-400">{ch.screenLabel}</p>
                          </motion.div>
                        </AnimatePresence>

                        <div className="absolute bottom-3.5 left-1/2 h-[3.5px] w-[72px] -translate-x-1/2 rounded-full bg-white/20" />
                        <div className="absolute -right-[2px] top-[88px] h-11 w-[3px] rounded-l-full bg-white/8" />
                        <div className="absolute -left-[2px] top-[76px] h-8 w-[3px] rounded-r-full bg-white/8" />
                        <div className="absolute -left-[2px] top-[116px] h-8 w-[3px] rounded-r-full bg-white/8" />
                      </div>

                      <div className="absolute -bottom-10 left-1/2 h-24 w-60 -translate-x-1/2 rounded-full blur-2xl transition-all duration-700" style={{ background: ch.halo1, opacity: 0.7 }} />

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`chip-${chapter}`}
                          className="absolute -right-5 -top-4 rounded-full border border-white/10 bg-[#060c18]/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.28em] backdrop-blur-sm"
                          style={{ color: ch.accentHex }}
                          initial={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduceMotion ? {} : { opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {ch.act}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>

                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="shrink-0 pb-5 pt-2">
              <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 sm:px-8 lg:px-14">
                <div className="hidden items-center gap-6 sm:flex">
                  {CHAPTERS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToChapter(i)}
                      className={cn("text-[8px] font-semibold uppercase tracking-[0.28em] transition-all duration-300", i === chapter ? "text-slate-200" : "text-slate-600 hover:text-slate-400")}
                    >
                      {item.act}
                    </button>
                  ))}
                </div>
                <div className="ml-auto h-px w-32 overflow-hidden rounded-full bg-white/10 sm:w-44">
                  <motion.div
                    className="h-full rounded-full transition-colors duration-500"
                    style={{ width: railW, backgroundColor: ch.accentHex }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`pct-${chapter}`}
                    className="min-w-[2.5rem] text-right font-mono text-[9px] text-slate-500"
                    initial={reduceMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? {} : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {String(chapter + 1).padStart(2, "0")} / 04
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

          </div>{/* end flex h-full */}
        </div>{/* end overflow-clip */}
      </div>{/* end sticky */}
    </section>
  );
}
