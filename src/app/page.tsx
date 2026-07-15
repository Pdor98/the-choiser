import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import {
  EditorialCTAButton,
  EditorialFooter,
  EditorialSectionHeader,
} from "@/components/layout/editorial-elements";
import { PageExitBar } from "@/components/layout/page-exit-bar";
import { DailyAdvicePanel } from "@/components/home/daily-advice-panel";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import { HomeScrollStage } from "@/components/home/home-scroll-stage";
import { HomeScrollStory } from "@/components/home/home-scroll-story";
import { categories, homeHighlights } from "@/lib/site-content";

// Per-category accent config
const CATEGORY_ACCENTS: Record<string, { hex: string; rgb: string; glow: string }> = {
  "/random": { hex: "#22d3ee", rgb: "34 211 238",   glow: "rgba(34,211,238,0.12)" },
  "/games":  { hex: "#a78bfa", rgb: "167 139 250",  glow: "rgba(167,139,250,0.12)" },
  "/tools":  { hex: "#34d399", rgb: "52 211 153",   glow: "rgba(52,211,153,0.12)" },
};

export default function HomePage() {
  return (
    <div className="space-y-20 pb-10 sm:space-y-24 lg:space-y-28">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <HomeScrollStage
        variant="hero"
        className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[#0a0a0a] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-8 sm:py-24 lg:px-12 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,44,84,0.46),transparent_34%),radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_58%),linear-gradient(180deg,rgba(10,10,10,0.22),rgba(10,10,10,0.8))]" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-400/14 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl sm:h-84 sm:w-84" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="editorial-reveal text-[11px] font-medium uppercase tracking-[0.36em] text-slate-400 sm:text-xs">
            Choiser
          </p>
          <h1 className="editorial-reveal editorial-reveal-delay-1 font-heading mx-auto mt-6 max-w-4xl text-balance text-[clamp(3.4rem,8vw,4.7rem)] font-bold tracking-[-0.04em] text-slate-50">
            Perché le serate migliori non si pianificano. Si innescano.
          </h1>
          <p className="editorial-reveal editorial-reveal-delay-2 mx-auto mt-6 max-w-[38rem] text-balance text-[1.05rem] leading-8 text-slate-400 sm:text-[1.18rem]">
            Choiser è nato per quei momenti in cui siete tutti insieme, nessuno
            ha voglia di decidere e la serata rischia di non decollare mai.
            Giochi, scelte rapide, strumenti utili: tutto pronto, tutto gratis,
            tutto in un posto solo.
          </p>
          <div className="editorial-reveal editorial-reveal-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EditorialCTAButton href="/games">
              <span>Entra in Games</span>
            </EditorialCTAButton>
            <EditorialCTAButton href="/random" variant="secondary">
              <span>Apri Random</span>
            </EditorialCTAButton>
          </div>
        </div>
      </HomeScrollStage>

      {/* ── SCROLL STORY ──────────────────────────────────────────────────── */}
      <HomeScrollStory />

      {/* ── CATEGORY CARDS ────────────────────────────────────────────────── */}
      <HomeScrollStage className="space-y-10 sm:space-y-12">
        <EditorialSectionHeader
          title="Cosa vuoi fare stasera?"
          description="Che siate in due o in dieci, indecisi o carichi, Choiser ha sempre qualcosa pronto per voi."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const accent = CATEGORY_ACCENTS[category.href] ?? { hex: "#94a3b8", rgb: "148 163 184", glow: "rgba(148,163,184,0.1)" };

            return (
              <div
                key={category.href}
                className="home-scroll-panel"
                style={{ "--home-scroll-delay": `${index * 90}ms` } as CSSProperties}
              >
                <a
                  href={category.href}
                  className="home-category-card group relative flex flex-col overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(160deg,rgba(10,17,29,0.98),rgba(8,14,24,0.96))] p-7 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/14 hover:shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]"
                  style={{ "--card-accent": `rgba(${accent.rgb}, 0.5)` } as CSSProperties}
                >
                  {/* Accent glow — bottom corner */}
                  <div
                    className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-100"
                    style={{ background: accent.glow, opacity: 0.6 }}
                  />

                  {/* Large background icon */}
                  <div
                    className="pointer-events-none absolute -bottom-4 -right-2 transition-all duration-700 group-hover:-bottom-2 group-hover:right-0 group-hover:opacity-[0.09]"
                    style={{ color: accent.hex, opacity: 0.055 }}
                  >
                    <Icon className="size-44" strokeWidth={1} />
                  </div>

                  {/* Top shimmer on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-full flex-col">
                    {/* Icon badge */}
                    <div
                      className="flex size-12 items-center justify-center rounded-2xl border bg-white/[0.05] transition-all duration-500 group-hover:scale-110"
                      style={{
                        borderColor: `rgba(${accent.rgb}, 0.25)`,
                        color: accent.hex,
                        boxShadow: `0 0 20px rgba(${accent.rgb}, 0.15)`,
                      }}
                    >
                      <Icon className="size-5" />
                    </div>

                    <p
                      className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em]"
                      style={{ color: `rgba(${accent.rgb}, 0.6)` }}
                    >
                      {category.eyebrow}
                    </p>
                    <h2 className="mt-2.5 font-heading text-[1.6rem] font-bold tracking-[-0.03em] text-slate-50 lg:text-3xl">
                      {category.title}
                    </h2>
                    <p className="mt-4 flex-1 text-sm leading-7 text-slate-400">
                      {category.description}
                    </p>

                    {/* CTA row */}
                    <div
                      className="mt-7 flex items-center gap-1.5 text-[0.82rem] font-semibold transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: accent.hex }}
                    >
                      <span>Apri {category.title}</span>
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </HomeScrollStage>

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────────── */}
      <HomeScrollStage className="space-y-10 sm:space-y-12">
        <EditorialSectionHeader
          title="Fatto per stare insieme."
          description="Nato da una domanda semplice: perché ogni volta che siamo in gruppo, l'unica cosa su cui non riusciamo a metterci d'accordo è cosa fare?"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {homeHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={highlight.title}
                className="home-scroll-panel"
                style={{ "--home-scroll-delay": `${index * 100}ms` } as CSSProperties}
              >
                <div className="group relative overflow-hidden rounded-[28px] border border-white/7 bg-[linear-gradient(160deg,rgba(10,15,26,0.97),rgba(8,12,22,0.95))] p-6 transition-all duration-500 hover:border-white/12 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]">

                  {/* Decorative number */}
                  <div
                    className="home-highlight-number pointer-events-none absolute -right-2 -top-4 select-none font-heading text-[6rem] font-bold leading-none tracking-[-0.08em] text-white"
                    style={{ transitionDelay: `${index * 100 + 100}ms` }}
                  >
                    {num}
                  </div>

                  <div className="relative flex h-full flex-col">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200 transition-all duration-500 group-hover:border-cyan-300/20 group-hover:bg-cyan-300/[0.07]">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-50">
                      {highlight.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </HomeScrollStage>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <HomeScrollStage className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(6,9,18,0.98),rgba(9,14,26,0.96))] px-5 py-20 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.9)] sm:px-10 sm:py-24 lg:px-16 lg:py-28">

        {/* Background aurora */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[50%] w-[70%] -translate-x-1/2 rounded-full opacity-30 blur-[80px]"
          style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.4), rgba(99,102,241,0.25), transparent 70%)", animation: "aurora-a 12s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[35%] w-[50%] opacity-20 blur-[60px]"
          style={{ background: "rgba(59,130,246,0.3)", animation: "aurora-b 15s ease-in-out infinite" }}
        />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.018)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Top/bottom edge shimmers */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/24 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/12 to-transparent" />

        {/* Huge watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
          <span className="font-heading text-[min(22vw,18rem)] font-black tracking-[-0.06em] text-white opacity-[0.018]">
            CHOISER
          </span>
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* Eyebrow */}
          <p className="home-section-header-line text-[10px] font-semibold uppercase tracking-[0.42em] text-violet-300/60">
            Manifesto
          </p>

          {/* Big staggered lines */}
          <div className="mt-8 space-y-1 sm:mt-10">
            <h2 className="manifesto-line font-heading text-[clamp(2rem,5.5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.04em] text-slate-50">
              Non è un&apos;app.
            </h2>
            <h2 className="manifesto-line font-heading text-[clamp(2rem,5.5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.04em] text-slate-50">
              Non è un gioco.
            </h2>
            <h2 className="manifesto-line font-heading text-[clamp(2rem,5.5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.04em] text-violet-300">
              È la scusa giusta
            </h2>
            <h2 className="manifesto-line font-heading text-[clamp(2rem,5.5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.04em] text-violet-300">
              per stare insieme meglio.
            </h2>
          </div>

          {/* Body */}
          <p className="home-section-header-desc mx-auto mt-10 max-w-2xl text-base leading-[1.9] text-slate-400 sm:text-lg">
            L&apos;abbiamo costruito perché non esisteva un posto semplice, immediato
            e fatto apposta per una serata tra amici. Non un social, non qualcosa
            da spiegare. Solo uno spazio dove arrivate in cinque, aprite Choiser,
            e la serata prende forma da sola.
          </p>

          {/* Quote block */}
          <div
            className="home-scroll-panel mt-10 rounded-2xl border border-violet-300/10 bg-violet-300/[0.04] px-7 py-6 backdrop-blur-sm"
            style={{ "--home-scroll-delay": "300ms" } as CSSProperties}
          >
            <p className="text-sm italic leading-8 text-slate-300/80 sm:text-base">
              &ldquo;C&apos;è un momento preciso in ogni serata in cui tutto potrebbe andare
              in mille direzioni diverse. Choiser esiste per trasformare quel momento
              in qualcosa di bello.&rdquo;
            </p>
          </div>
        </div>
      </HomeScrollStage>

      {/* ── INIZIA SUBITO ─────────────────────────────────────────────────── */}
      <HomeScrollStage className="space-y-8 sm:space-y-10">
        <EditorialSectionHeader
          title="Inizia subito"
          description="Se vuoi entrare direttamente nel flusso, qui sotto trovi due ingressi rapidi."
        />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="home-scroll-panel" style={{ "--home-scroll-delay": "0ms" } as CSSProperties}>
            <DailyAdvicePanel />
          </div>
          <div className="home-scroll-panel" style={{ "--home-scroll-delay": "90ms" } as CSSProperties}>
            <HomeHeroPanel />
          </div>
        </div>
      </HomeScrollStage>

      <HomeScrollStage as="div">
        <EditorialFooter />
      </HomeScrollStage>

      <HomeScrollStage as="div">
        <PageExitBar
          title="Stasera avete già tutto quello che serve. Mancava solo il posto giusto da cui partire."
          description="Nessun account. Nessun download. Solo voi, uno schermo e una serata da vivere."
        />
      </HomeScrollStage>
    </div>
  );
}
