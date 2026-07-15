"use client";

import { ArrowRight, Flame, Gamepad2, RotateCcw, Users } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CHAPTERS = [
  {
    n: "00",
    eyebrow: "La serata aspetta",
    line1: "Siete insieme.",
    line2: "Manca solo il gioco.",
    body: "Ogni serata ha un momento in cui tutto si decide. Games esiste per quel momento: sei giochi pronti, nessuna installazione.",
    cta: { label: "Vedi tutti i giochi", href: "/games" },
    stat: { n: "6", label: "giochi" },
    accentHex: "#a78bfa",
    accentRgb: "167 139 250",
    dotCls: "bg-violet-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(42,10,95,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(22,5,55,0.7), transparent 50%), linear-gradient(170deg, #04020c 0%, #0b0420 50%, #07031a 100%)",
    halo1: "rgba(140,90,250,0.22)",
    halo2: "rgba(70,30,160,0.14)",
  },
  {
    n: "01",
    eyebrow: "Obbligo o Verità",
    line1: "La sfida accende",
    line2: "il momento.",
    body: "Normale, Spicy o Osé. Centinaia di domande già pronte, nessuna preparazione. Apri e il gioco inizia in dieci secondi.",
    cta: { label: "Gioca adesso", href: "/games" },
    stat: { n: "3", label: "modalità" },
    accentHex: "#fb7185",
    accentRgb: "251 113 133",
    dotCls: "bg-rose-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(76,5,30,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(40,3,18,0.7), transparent 50%), linear-gradient(170deg, #090206 0%, #160410 50%, #0f030c 100%)",
    halo1: "rgba(240,60,100,0.20)",
    halo2: "rgba(120,20,50,0.14)",
  },
  {
    n: "02",
    eyebrow: "Chi è più probabile",
    line1: "Il gruppo rivela",
    line2: "chi siete davvero.",
    body: "Chi ruba cibo agli altri? Chi si addormenta per primo? Domande rapide che mettono in discussione chi credi di conoscere.",
    cta: { label: "Scopri Most Likely", href: "/games" },
    stat: { n: "∞", label: "domande" },
    accentHex: "#fbbf24",
    accentRgb: "251 191 36",
    dotCls: "bg-amber-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(78,50,5,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(45,28,3,0.7), transparent 50%), linear-gradient(170deg, #080501 0%, #140d02 50%, #0d0901 100%)",
    halo1: "rgba(240,170,20,0.20)",
    halo2: "rgba(140,90,8,0.14)",
  },
  {
    n: "03",
    eyebrow: "Ruota Elimina-Nomi",
    line1: "Il caso ha",
    line2: "l'ultima parola.",
    body: "Inserisci i nomi, la ruota gira. Nessuno può protestare perché ha deciso il caso — e questo lo rende ancora più divertente.",
    cta: { label: "Gira la ruota", href: "/games" },
    stat: { n: "1", label: "spin" },
    accentHex: "#38bdf8",
    accentRgb: "56 189 248",
    dotCls: "bg-sky-400",
    bg: "radial-gradient(ellipse 120% 80% at 20% 25%, rgba(8,47,72,0.88), transparent 52%), radial-gradient(ellipse 70% 50% at 80% 75%, rgba(4,26,42,0.7), transparent 50%), linear-gradient(170deg, #020710 0%, #040f1e 50%, #030c18 100%)",
    halo1: "rgba(30,160,240,0.20)",
    halo2: "rgba(10,80,130,0.14)",
  },
] as const;

// ── Phone screens ─────────────────────────────────────────────────────────────
function PhoneGamesList() {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Games</p>
        <Gamepad2 className="size-3.5 text-violet-400/50" />
      </div>
      {[
        { label: "TAB-WHO?", tag: "Taboo style", cls: "text-fuchsia-200 border-fuchsia-400/18 bg-fuchsia-400/[0.06]" },
        { label: "Obbligo o Verità", tag: "Spicy · Osé", cls: "text-rose-200 border-rose-400/18 bg-rose-400/[0.06]" },
        { label: "Chi è più probabile", tag: "Gruppo", cls: "text-amber-200 border-amber-400/18 bg-amber-400/[0.06]" },
        { label: "Ruota Elimina-Nomi", tag: "Caso", cls: "text-sky-200 border-sky-400/18 bg-sky-400/[0.06]" },
        { label: "Gira la Bottiglia", tag: "Classico", cls: "text-cyan-200 border-cyan-400/18 bg-cyan-400/[0.06]" },
      ].map((g) => (
        <div key={g.label} className={cn("mb-1.5 flex items-center justify-between rounded-2xl border px-3 py-2.5", g.cls)}>
          <div>
            <p className="text-[10px] font-semibold leading-none">{g.label}</p>
            <p className="mt-0.5 text-[8px] opacity-50">{g.tag}</p>
          </div>
          <ArrowRight className="size-3 opacity-25" />
        </div>
      ))}
    </div>
  );
}

function PhoneTruthDare() {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Obbligo o Verità</p>
        <Flame className="size-3.5 text-rose-400/50" />
      </div>
      <div className="flex gap-1.5">
        {["Normale", "Spicy", "Osé"].map((m, i) => (
          <div key={m} className={cn("flex-1 rounded-xl py-2 text-center text-[8.5px] font-semibold", i === 1 ? "border border-orange-400/28 bg-orange-400/12 text-orange-200" : "border border-white/6 bg-white/[0.03] text-slate-500")}>{m}</div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {["Verità", "Sfida"].map((m, i) => (
          <div key={m} className={cn("flex-1 rounded-xl py-2 text-center text-[9px] font-bold", i === 1 ? "border border-rose-400/30 bg-rose-400/14 text-rose-200" : "border border-white/8 bg-white/[0.04] text-slate-400")}>{m}</div>
        ))}
      </div>
      <div className="mt-2 flex-1 rounded-[18px] border border-rose-300/14 bg-rose-300/[0.06] p-4 text-center">
        <p className="text-[8px] uppercase tracking-[0.3em] text-rose-300/50">Sfida</p>
        <p className="mt-2.5 font-heading text-[1.1rem] font-bold leading-snug tracking-[-0.02em] text-slate-50">
          Imita un animale per 30 secondi senza ridere.
        </p>
      </div>
      <button className="mt-2 w-full rounded-2xl border border-rose-400/18 bg-rose-400/[0.07] py-2.5 text-[10px] font-semibold text-rose-200">Prossima →</button>
    </div>
  );
}

function PhoneMostLikely() {
  const players = ["Marco", "Sara", "Luca", "Elena"];
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Chi è più probabile</p>
        <Users className="size-3.5 text-amber-400/50" />
      </div>
      <div className="flex-1 rounded-[18px] border border-amber-300/14 bg-amber-300/[0.06] p-4 text-center">
        <p className="text-[8px] uppercase tracking-[0.28em] text-amber-300/50">Domanda</p>
        <p className="mt-2.5 font-heading text-[1.1rem] font-bold leading-snug tracking-[-0.02em] text-slate-50">
          Chi dimentica più spesso il portafogli?
        </p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {players.map((p, i) => (
          <div key={p} className={cn("rounded-xl border py-2.5 text-center text-[10px] font-bold", i === 2 ? "border-amber-400/32 bg-amber-400/16 text-amber-200" : "border-white/6 bg-white/[0.03] text-slate-400")}>
            {p} {i === 2 && <span className="ml-1 text-[8px] opacity-60">3v</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneWheel() {
  const names = ["Marco", "Sara", "Luca", "Elena", "Gio"];
  const colors = ["#8b5cf6","#ec4899","#f59e0b","#14b8a6","#3b82f6"];
  const total = names.length;
  const r = 40, cx = 60, cy = 60;
  return (
    <div className="flex h-full flex-col items-center px-4 pb-4 pt-2">
      <div className="mb-2 flex w-full items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-500">Ruota Elimina-Nomi</p>
        <RotateCcw className="size-3.5 text-sky-400/50" />
      </div>
      <svg width="128" height="128" viewBox="0 0 120 120" className="animate-[spin_9s_linear_infinite] drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]">
        {names.map((name, i) => {
          const s = (i / total) * 2 * Math.PI - Math.PI / 2;
          const e = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
          const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
          const mid = (s + e) / 2;
          return (
            <g key={name}>
              <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={colors[i]} fillOpacity={0.75} stroke="rgba(0,0,0,0.25)" strokeWidth={0.5} />
              <text x={cx + r * 0.6 * Math.cos(mid)} y={cy + r * 0.6 * Math.sin(mid)} textAnchor="middle" dominantBaseline="middle" fontSize={6} fill="white" fontWeight="700">{name}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={9} fill="#060c18" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <line x1={cx} y1={cy - r - 2} x2={cx} y2={cy - r + 7} stroke="#38bdf8" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
      <button className="mt-auto w-full rounded-2xl border border-sky-400/18 bg-sky-400/[0.07] py-2.5 text-[10px] font-semibold text-sky-200">Gira! →</button>
    </div>
  );
}

const SCREENS = [PhoneGamesList, PhoneTruthDare, PhoneMostLikely, PhoneWheel];

export function GamesScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [chapter, setChapter] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.25 ? 0 : v < 0.5 ? 1 : v < 0.75 ? 2 : 3;
    setChapter((c) => (c === next ? c : next));
  });

  const ch0O = useTransform(scrollYProgress, [0, 0.20, 0.26], [1, 1, 0]);
  const ch1O = useTransform(scrollYProgress, [0.20, 0.26, 0.45, 0.51], [0, 1, 1, 0]);
  const ch2O = useTransform(scrollYProgress, [0.45, 0.51, 0.70, 0.76], [0, 1, 1, 0]);
  const ch3O = useTransform(scrollYProgress, [0.70, 0.76, 1], [0, 1, 1]);
  const ch0Y1 = useTransform(scrollYProgress, [0, 0.26], [0, -32]);
  const ch0Y2 = useTransform(scrollYProgress, [0, 0.26], [0, -18]);
  const ch1Y1 = useTransform(scrollYProgress, [0.20, 0.28, 0.51], [28, 0, -32]);
  const ch1Y2 = useTransform(scrollYProgress, [0.20, 0.28, 0.51], [16, 0, -18]);
  const ch2Y1 = useTransform(scrollYProgress, [0.45, 0.53, 0.76], [28, 0, -32]);
  const ch2Y2 = useTransform(scrollYProgress, [0.45, 0.53, 0.76], [16, 0, -18]);
  const ch3Y1 = useTransform(scrollYProgress, [0.70, 0.78, 1], [28, 0, -24]);
  const ch3Y2 = useTransform(scrollYProgress, [0.70, 0.78, 1], [16, 0, -14]);
  const chOpacities = [ch0O, ch1O, ch2O, ch3O];
  const chY1s = [ch0Y1, ch1Y1, ch2Y1, ch3Y1];
  const chY2s = [ch0Y2, ch1Y2, ch2Y2, ch3Y2];

  const ph0O = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0]);
  const ph1O = useTransform(scrollYProgress, [0.22, 0.28, 0.47, 0.53], [0, 1, 1, 0]);
  const ph2O = useTransform(scrollYProgress, [0.47, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const ph3O = useTransform(scrollYProgress, [0.72, 0.78, 1], [0, 1, 1]);
  const phoneOpacities = [ph0O, ph1O, ph2O, ph3O];

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 40]);
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
    <section ref={sectionRef} data-motion="games-scroll-story" className="relative hidden min-h-[300vh] lg:block" aria-label="Scroll story Games">
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

                {/* Left */}
                <div className="order-2 lg:order-1">
                  <div className="mb-6 flex items-center gap-4 sm:mb-8">
                    <span className="font-mono text-[10px] font-medium tracking-[0.28em] transition-colors duration-500" style={{ color: ch.accentHex }}>{ch.n} / 03</span>
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
                        <motion.p className="text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: item.accentHex, ...(reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }) }}>
                          {item.eyebrow}
                        </motion.p>
                        <motion.h2 className="font-heading mt-4 text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.05em] text-slate-50" style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY1s[i] }}>
                          {item.line1}
                        </motion.h2>
                        <motion.h2 className="font-heading text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[1.0] tracking-[-0.05em]" style={{ color: item.accentHex, ...(reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }) }}>
                          {item.line2}
                        </motion.h2>
                        <motion.p className="mt-6 max-w-md text-[0.97rem] leading-[1.8] text-slate-400 sm:text-[1.06rem]" style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }}>
                          {item.body}
                        </motion.p>
                        <motion.div style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: chOpacities[i], y: chY2s[i] }}>
                          <a href={item.cta.href} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:border-white/24 hover:bg-white/12">
                            {item.cta.label} <ArrowRight className="size-3.5" />
                          </a>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: phone */}
                <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
                  <motion.div className="relative" style={reduceMotion ? undefined : { y: phoneY, scale: phoneScale }}>
                    <div className="absolute inset-[-20%] rounded-full blur-3xl transition-all duration-700" style={{ background: ch.halo1, opacity: 0.45 }} />
                    <div className="relative h-[340px] w-[188px] overflow-hidden rounded-[40px] border border-white/14 bg-[#040810] shadow-[0_48px_120px_-24px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.09)] sm:h-[400px] sm:w-[218px] lg:h-[488px] lg:w-[264px]">
                      <div className="pointer-events-none absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse 65% 44% at 50% 0%, rgba(${ch.accentRgb} / 0.15), transparent 56%)` }} />
                      <div className="absolute left-5 right-5 top-3.5 flex items-center justify-between text-[7.5px] text-white/25">
                        <span className="font-semibold tabular-nums">9:41</span>
                        <div className="flex items-center gap-[3px]">
                          {[2, 3, 4, 4].map((h, j) => <div key={j} className="w-[2.5px] rounded-sm bg-current" style={{ height: `${h * 2}px`, opacity: j < 3 ? 1 : 0.3 }} />)}
                          <div className="ml-1 h-2 w-3.5 rounded-[3px] border border-current"><div className="m-px h-full w-3/4 rounded-sm bg-current" /></div>
                        </div>
                      </div>
                      <div className="absolute left-1/2 top-2.5 h-[17px] w-[66px] -translate-x-1/2 rounded-full bg-black" />
                      <div className="absolute inset-0 pt-12">
                        {SCREENS.map((Screen, i) => (
                          <motion.div key={i} className={cn("absolute inset-0 transition-opacity duration-300", i === chapter ? "!opacity-100" : "hidden pointer-events-none !opacity-0")} style={reduceMotion ? { opacity: i === chapter ? 1 : 0 } : { opacity: phoneOpacities[i] }}>
                            <Screen />
                          </motion.div>
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
                  <button key={i} type="button" onClick={() => scrollToChapter(i)} className={cn("text-[8px] font-semibold uppercase tracking-[0.26em] transition-all duration-300", i === chapter ? "text-slate-300" : "text-slate-600 hover:text-slate-400")}>
                    {item.eyebrow}
                  </button>
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
