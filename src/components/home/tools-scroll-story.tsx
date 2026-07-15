"use client";

import { ArrowRight, Dices, TimerReset } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    n: "01",
    eyebrow: "Timer",
    line1: "Il tempo scorre.",
    line2: "Tu non ci pensi.",
    body: "Preset da 1 a 10 minuti, countdown grande e leggibile, cambio istantaneo. Un'interfaccia che non si mette in mezzo quando la serata è nel vivo.",
    cta: { label: "Apri il Timer", href: "/tools" },
    stat: { n: "6", label: "preset" },
    accentHex: "#34d399",
    accentRgb: "52 211 153",
    dotCls: "bg-emerald-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(5,60,38,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(3,35,22,0.7), transparent 50%), linear-gradient(170deg, #020a05 0%, #041409 50%, #030f06 100%)",
    halo1: "rgba(40,200,120,0.22)",
    halo2: "rgba(20,110,62,0.14)",
  },
  {
    n: "02",
    eyebrow: "Dado Configurabile",
    line1: "Il dado ha",
    line2: "l'ultima parola.",
    body: "D4, D6, D8, D12, D20. Scegli tipo, quantità e lancia: il risultato è immediato, lo storico è lì. Quando serve solo lasciare decidere il caso.",
    cta: { label: "Lancia il dado", href: "/tools" },
    stat: { n: "5", label: "tipi" },
    accentHex: "#22d3ee",
    accentRgb: "34 211 238",
    dotCls: "bg-cyan-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(6,52,72,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(3,30,45,0.7), transparent 50%), linear-gradient(170deg, #020a0f 0%, #041520 50%, #030e18 100%)",
    halo1: "rgba(22,200,220,0.22)",
    halo2: "rgba(10,100,120,0.14)",
  },
] as const;

function PhoneTimer() {
  return (
    <div className="flex h-full flex-col items-center px-4 pb-4 pt-2">
      <div className="mb-2 flex w-full items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Timer</p>
        <TimerReset className="size-3.5 text-emerald-400/50" />
      </div>
      <div className="relative flex size-[108px] shrink-0 items-center justify-center">
        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(52,211,153,0.08)" strokeWidth="5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#34d399" strokeDasharray="263.9" strokeDashoffset="72" strokeLinecap="round" strokeWidth="5" />
        </svg>
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums tracking-[-0.04em] text-emerald-200">2:34</p>
          <p className="text-[8px] text-slate-500">rimasti</p>
        </div>
      </div>
      <div className="mt-3 grid w-full grid-cols-3 gap-1.5">
        {["1 min", "3 min", "5 min", "10 min", "15 min", "30 min"].map((p, i) => (
          <div key={p} className={cn("rounded-xl py-2 text-center text-[8.5px] font-semibold", i === 1 ? "border border-emerald-400/28 bg-emerald-400/12 text-emerald-200" : "border border-white/6 bg-white/[0.03] text-slate-500")}>{p}</div>
        ))}
      </div>
      <div className="mt-2 flex w-full gap-1.5">
        <button className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] py-2 text-[9px] font-semibold text-slate-400">Pausa</button>
        <button className="flex-1 rounded-xl border border-emerald-400/22 bg-emerald-400/[0.07] py-2 text-[9px] font-semibold text-emerald-200">Riavvia</button>
      </div>
    </div>
  );
}

function PhoneDice() {
  return (
    <div className="flex h-full flex-col items-center px-4 pb-4 pt-2">
      <div className="mb-2 flex w-full items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Dado Configurabile</p>
        <Dices className="size-3.5 text-cyan-400/50" />
      </div>
      <div className="flex size-[76px] items-center justify-center rounded-[22px] border border-cyan-400/22 bg-cyan-400/[0.07] shadow-[0_0_48px_-14px_rgba(34,211,238,0.38)]">
        <span className="font-heading text-[2.8rem] font-bold tabular-nums leading-none text-cyan-200">5</span>
      </div>
      <div className="mt-3 grid w-full grid-cols-5 gap-1">
        {["D4","D6","D8","D12","D20"].map((d, i) => (
          <div key={d} className={cn("rounded-xl py-2 text-center text-[8px] font-bold", i === 1 ? "border border-cyan-400/28 bg-cyan-400/12 text-cyan-200" : "border border-white/6 bg-white/[0.03] text-slate-500")}>{d}</div>
        ))}
      </div>
      <div className="mt-2 w-full">
        <p className="mb-1.5 text-[8px] text-slate-600">Ultimi lanci</p>
        <div className="flex gap-1.5">
          {[4, 2, 6, 1, 5].map((n, i) => (
            <div key={i} className={cn("flex flex-1 items-center justify-center rounded-xl py-2 text-[9px] font-bold", i === 0 ? "border border-cyan-400/24 bg-cyan-400/[0.08] text-cyan-200" : "border border-white/6 bg-white/[0.03] text-slate-400")}>{n}</div>
          ))}
        </div>
      </div>
      <button className="mt-2 w-full rounded-2xl border border-cyan-400/18 bg-cyan-400/[0.07] py-2.5 text-[10px] font-semibold text-cyan-200">Lancia ancora →</button>
    </div>
  );
}

const SCREENS = [PhoneTimer, PhoneDice];

export function ToolsScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [chapter, setChapter] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.52 ? 0 : 1;
    setChapter((c) => (c === next ? c : next));
  });

  const ch0O = useTransform(scrollYProgress, [0, 0.42, 0.52], [1, 1, 0]);
  const ch1O = useTransform(scrollYProgress, [0.42, 0.52, 1], [0, 1, 1]);
  const ch0Y1 = useTransform(scrollYProgress, [0, 0.52], [0, -32]);
  const ch0Y2 = useTransform(scrollYProgress, [0, 0.52], [0, -18]);
  const ch1Y1 = useTransform(scrollYProgress, [0.42, 0.54, 1], [28, 0, -24]);
  const ch1Y2 = useTransform(scrollYProgress, [0.42, 0.54, 1], [16, 0, -14]);
  const chOpacities = [ch0O, ch1O];
  const chY1s = [ch0Y1, ch1Y1];
  const chY2s = [ch0Y2, ch1Y2];

  const ph0O = useTransform(scrollYProgress, [0, 0.44, 0.54], [1, 1, 0]);
  const ph1O = useTransform(scrollYProgress, [0.44, 0.54, 1], [0, 1, 1]);
  const phoneOpacities = [ph0O, ph1O];

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 32]);
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
    <section ref={sectionRef} data-motion="tools-scroll-story" className="relative hidden min-h-[220vh] lg:block" aria-label="Scroll story Tools">
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
