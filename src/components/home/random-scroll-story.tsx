"use client";

import { ArrowRight, BookOpen, Dices, Wand2 } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    n: "00",
    eyebrow: "Il problema",
    line1: "Troppe opzioni.",
    line2: "Nessuna risposta.",
    body: "Stai lì a fissare il telefono. Hai idee vaghe, nessuna concreta. Random è il segnale che trasforma l'indecisione in movimento.",
    cta: { label: "Scopri Random", href: "/random" },
    stat: { n: "3", label: "moduli" },
    accentHex: "#fb7185",
    accentRgb: "251 113 133",
    dotCls: "bg-rose-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(76,5,25,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(40,3,15,0.7), transparent 50%), linear-gradient(170deg, #08020a 0%, #140511 50%, #0d0209 100%)",
    halo1: "rgba(240,50,90,0.20)",
    halo2: "rgba(120,15,40,0.14)",
  },
  {
    n: "01",
    eyebrow: "Libro delle risposte",
    line1: "Una parola sola.",
    line2: "Abbastanza netta.",
    body: "Non ti serve un'analisi. Ti serve un segnale — evocativo, immediato, abbastanza forte da farti muovere senza aspettare altro.",
    cta: { label: "Apri il Libro", href: "/random" },
    stat: { n: "∞", label: "risposte" },
    accentHex: "#f472b6",
    accentRgb: "244 114 182",
    dotCls: "bg-pink-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(86,7,28,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(48,4,18,0.7), transparent 50%), linear-gradient(170deg, #09020c 0%, #180614 50%, #0f0210 100%)",
    halo1: "rgba(240,80,160,0.20)",
    halo2: "rgba(130,25,70,0.14)",
  },
  {
    n: "02",
    eyebrow: "Numero casuale",
    line1: "Lascia decidere",
    line2: "il caso puro.",
    body: "Da 1 a 100, immediato e leggibile. Quando non serve nemmeno una risposta: serve solo un numero che chiuda la questione.",
    cta: { label: "Genera un numero", href: "/random" },
    stat: { n: "100", label: "max" },
    accentHex: "#f87171",
    accentRgb: "248 113 113",
    dotCls: "bg-red-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(90,10,10,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(50,5,5,0.7), transparent 50%), linear-gradient(170deg, #0a0202 0%, #180606 50%, #110404 100%)",
    halo1: "rgba(240,70,70,0.20)",
    halo2: "rgba(130,22,22,0.14)",
  },
] as const;

function PhoneModules() {
  return (
    <div className="flex h-full flex-col gap-2 p-4 pt-2">
      <div className="mb-1 flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-200/70">Random</span>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
      </div>
      {[
        { label: "Cosa fare oggi?", sub: "Idea concreta", icon: Wand2, cls: "border-rose-400/18 bg-rose-400/[0.06] text-rose-200" },
        { label: "Libro delle risposte", sub: "Segnale evocativo", icon: BookOpen, cls: "border-pink-400/18 bg-pink-400/[0.06] text-pink-200" },
        { label: "Numero casuale", sub: "Caso puro", icon: Dices, cls: "border-red-400/18 bg-red-400/[0.06] text-red-200" },
      ].map((item) => (
        <div key={item.label} className={cn("flex items-center gap-3 rounded-2xl border px-3 py-3.5", item.cls)}>
          <item.icon className="size-4 shrink-0 opacity-80" />
          <div className="flex-1">
            <p className="text-[11px] font-bold leading-none">{item.label}</p>
            <p className="mt-0.5 text-[9px] opacity-55">{item.sub}</p>
          </div>
          <ArrowRight className="size-3 opacity-25" />
        </div>
      ))}
    </div>
  );
}

const bookAnswers = ["La risposta è già in te.", "Sì, senza dubbi.", "Aspetta ancora un po'.", "Il momento è adesso.", "Decisamente no.", "Lascia andare."];

function PhoneBook() {
  return (
    <div className="flex h-full flex-col items-stretch px-4 pb-5 pt-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Libro delle risposte</p>
        <BookOpen className="size-3.5 text-pink-400/50" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-[20px] border border-pink-400/20 bg-pink-400/[0.08] shadow-[0_0_40px_-12px_rgba(236,72,153,0.4)]">
          <BookOpen className="size-7 text-pink-300" />
        </div>
        <div className="w-full rounded-[20px] border border-pink-300/12 bg-pink-300/[0.05] px-5 py-6 text-center">
          <p className="text-[8px] uppercase tracking-[0.32em] text-pink-300/50">Il segnale</p>
          <p className="mt-3 font-heading text-[1.3rem] font-bold leading-tight tracking-[-0.03em] text-slate-50">{bookAnswers[0]}</p>
        </div>
      </div>
      <button className="mt-3 w-full rounded-2xl border border-pink-400/18 bg-pink-400/[0.07] py-3 text-[11px] font-semibold text-pink-200">Nuova risposta →</button>
    </div>
  );
}

function PhoneNumber() {
  return (
    <div className="flex h-full flex-col items-stretch px-4 pb-5 pt-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Numero casuale</p>
        <Dices className="size-3.5 text-red-400/50" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="flex items-center justify-center rounded-[28px] border border-red-400/22 bg-red-400/[0.07] px-10 py-7 shadow-[0_0_60px_-18px_rgba(239,68,68,0.36)]">
          <span className="font-heading text-[4rem] font-bold tabular-nums leading-none tracking-[-0.06em] text-red-200">42</span>
        </div>
        <div className="flex w-full items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-2.5">
          <span className="text-[9px] text-slate-500">Range</span>
          <span className="text-[11px] font-semibold text-slate-300">1 — 100</span>
        </div>
      </div>
      <button className="mt-3 w-full rounded-2xl border border-red-400/18 bg-red-400/[0.07] py-3 text-[11px] font-semibold text-red-200">Rilancia →</button>
    </div>
  );
}

const SCREENS = [PhoneModules, PhoneBook, PhoneNumber];

export function RandomScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [chapter, setChapter] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.36 ? 0 : v < 0.70 ? 1 : 2;
    setChapter((c) => (c === next ? c : next));
  });

  const ch0O = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0]);
  const ch1O = useTransform(scrollYProgress, [0.28, 0.36, 0.62, 0.70], [0, 1, 1, 0]);
  const ch2O = useTransform(scrollYProgress, [0.62, 0.70, 1], [0, 1, 1]);
  const ch0Y1 = useTransform(scrollYProgress, [0, 0.36], [0, -32]);
  const ch0Y2 = useTransform(scrollYProgress, [0, 0.36], [0, -18]);
  const ch1Y1 = useTransform(scrollYProgress, [0.28, 0.38, 0.70], [28, 0, -32]);
  const ch1Y2 = useTransform(scrollYProgress, [0.28, 0.38, 0.70], [16, 0, -18]);
  const ch2Y1 = useTransform(scrollYProgress, [0.62, 0.72, 1], [28, 0, -24]);
  const ch2Y2 = useTransform(scrollYProgress, [0.62, 0.72, 1], [16, 0, -14]);
  const chOpacities = [ch0O, ch1O, ch2O];
  const chY1s = [ch0Y1, ch1Y1, ch2Y1];
  const chY2s = [ch0Y2, ch1Y2, ch2Y2];

  const ph0O = useTransform(scrollYProgress, [0, 0.30, 0.38], [1, 1, 0]);
  const ph1O = useTransform(scrollYProgress, [0.30, 0.38, 0.64, 0.72], [0, 1, 1, 0]);
  const ph2O = useTransform(scrollYProgress, [0.64, 0.72, 1], [0, 1, 1]);
  const phoneOpacities = [ph0O, ph1O, ph2O];

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.01, 0.985]);
  const railW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToChapter = useCallback((index: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const scrollable = sectionRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({ top: sectionTop + scrollable * (index / CHAPTERS.length + 0.01), behavior: "smooth" });
  }, []);

  const ch = CHAPTERS[chapter];

  return (
    <section ref={sectionRef} data-motion="random-scroll-story" className="relative hidden min-h-[260vh] lg:block" aria-label="Scroll story Random">
      <div className="sticky top-0 h-screen overflow-hidden rounded-[36px] border border-white/8">
        <div className="absolute inset-0 transition-all duration-700" style={{ background: ch.bg }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.032]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px 256px" }} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.028)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute left-[18%] top-[-8%] h-[44%] w-[52%] -translate-x-1/2 rounded-full blur-3xl transition-all duration-700" style={{ background: ch.halo1 }} />
        <div className="pointer-events-none absolute right-[-4%] top-[15%] h-[36%] w-[40%] rounded-full blur-3xl transition-all duration-700" style={{ background: ch.halo2 }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative flex h-full flex-col">
          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14">
              <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                <div className="order-2 lg:order-1">
                  <div className="mb-6 flex items-center gap-4 sm:mb-8">
                    <span className="font-mono text-[10px] font-medium tracking-[0.28em] transition-colors duration-500" style={{ color: ch.accentHex }}>{ch.n} / 02</span>
                    <div className="flex items-center gap-2">
                      {CHAPTERS.map((item, i) => (
                        <button key={i} type="button" onClick={() => scrollToChapter(i)} className={cn("rounded-full transition-all duration-500", i === chapter ? cn("h-1.5 w-7", item.dotCls) : "size-1.5 bg-white/18 hover:bg-white/30")} />
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 backdrop-blur-sm transition-all duration-500">
                      <span className="font-mono text-sm font-bold transition-colors duration-500" style={{ color: ch.accentHex }}>{ch.stat.n}</span>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-slate-500">{ch.stat.label}</span>
                    </div>
                  </div>
                  <div className="relative min-h-[300px] sm:min-h-[280px] lg:min-h-[320px]">
                    <div className="pointer-events-none absolute -left-3 -top-8 select-none font-heading text-[11rem] font-bold leading-none tracking-[-0.08em] transition-all duration-700 sm:text-[14rem]" style={{ color: ch.accentHex, opacity: 0.032 }}>{ch.n}</div>
                    {CHAPTERS.map((item, i) => (
                      <div key={item.n} className={cn("absolute inset-x-0 top-0 transition-opacity duration-300", i === chapter ? "pointer-events-auto opacity-100 [&_*]:!opacity-100" : "hidden pointer-events-none opacity-0")} aria-hidden={i !== chapter}>
                        <motion.p className="text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: item.accentHex, ...(reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }) }}>{item.eyebrow}</motion.p>
                        <motion.h2 className="font-heading mt-4 text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.05em] text-slate-50" style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY1s[i] }}>{item.line1}</motion.h2>
                        <motion.h2 className="font-heading text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.05em]" style={{ color: item.accentHex, ...(reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }) }}>{item.line2}</motion.h2>
                        <motion.p className="mt-6 max-w-md text-[0.97rem] leading-[1.8] text-slate-400 sm:text-[1.06rem]" style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }}>{item.body}</motion.p>
                        <motion.div style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }}>
                          <a href={item.cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:border-white/24 hover:bg-white/12">{item.cta.label} <ArrowRight className="size-3.5" /></a>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
                  <motion.div className="relative" style={reduceMotion ? undefined : { y: phoneY, scale: phoneScale }}>
                    <div className="absolute inset-[-20%] rounded-full blur-3xl transition-all duration-700" style={{ background: ch.halo1, opacity: 0.45 }} />
                    <div className="relative h-[340px] w-[188px] overflow-hidden rounded-[40px] border border-white/14 bg-[#040810] shadow-[0_48px_120px_-24px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.09)] sm:h-[400px] sm:w-[218px] lg:h-[488px] lg:w-[264px]">
                      <div className="pointer-events-none absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse 65% 44% at 50% 0%, rgba(${ch.accentRgb} / 0.15), transparent 56%)` }} />
                      <div className="absolute left-5 right-5 top-3.5 flex items-center justify-between text-[7.5px] text-white/25">
                        <span className="font-semibold tabular-nums">9:41</span>
                        <div className="flex items-center gap-[3px]">{[2,3,4,4].map((h,j) => <div key={j} className="w-[2.5px] rounded-sm bg-current" style={{ height:`${h*2}px`, opacity: j<3?1:0.3 }} />)}<div className="ml-1 h-2 w-3.5 rounded-[3px] border border-current"><div className="m-px h-full w-3/4 rounded-sm bg-current" /></div></div>
                      </div>
                      <div className="absolute left-1/2 top-2.5 h-[17px] w-[66px] -translate-x-1/2 rounded-full bg-black" />
                      <div className="absolute inset-0 pt-12">
                        {SCREENS.map((Screen, i) => (
                          <motion.div key={i} className={cn("absolute inset-0 transition-opacity duration-300", i === chapter ? "!opacity-100" : "hidden pointer-events-none !opacity-0")} style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: phoneOpacities[i] }}><Screen /></motion.div>
                        ))}
                      </div>
                      <div className="absolute bottom-3.5 left-1/2 h-[3.5px] w-[72px] -translate-x-1/2 rounded-full bg-white/22" />
                      <div className="absolute -right-[2px] top-[88px] h-11 w-[3px] rounded-l-full bg-white/8" />
                      <div className="absolute -left-[2px] top-[76px] h-8 w-[3px] rounded-r-full bg-white/8" />
                      <div className="absolute -left-[2px] top-[116px] h-8 w-[3px] rounded-r-full bg-white/8" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 h-20 w-56 -translate-x-1/2 rounded-full blur-2xl transition-all duration-700" style={{ background: ch.halo1, opacity: 0.65 }} />
                    <div className="absolute -right-4 -top-3 rounded-full border border-white/10 bg-[#060c18]/90 px-3 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.26em] backdrop-blur-sm transition-colors duration-500" style={{ color: ch.accentHex }}>{ch.eyebrow}</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 pb-6 pt-2">
            <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 sm:px-8 lg:px-14">
              <div className="hidden items-center gap-5 sm:flex">
                {CHAPTERS.map((item, i) => (
                  <button key={i} type="button" onClick={() => scrollToChapter(i)} className={cn("text-[8px] font-semibold uppercase tracking-[0.26em] transition-all duration-300", i === chapter ? "text-slate-300" : "text-slate-600 hover:text-slate-400")}>{item.eyebrow}</button>
                ))}
              </div>
              <div className="ml-auto h-px w-28 overflow-hidden rounded-full bg-white/10 sm:w-40">
                <motion.div className="h-full rounded-full transition-colors duration-500" style={{ width: railW, backgroundColor: ch.accentHex }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
