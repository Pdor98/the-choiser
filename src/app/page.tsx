import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryCard } from "@/components/home/category-card";
import { HighlightCard } from "@/components/home/highlight-card";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import {
  buttonStyles,
  primaryButtonReadableStyle,
} from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";
import { categories, homeHighlights } from "@/lib/site-content";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px] xl:items-stretch">
        <div className="rounded-[36px] border border-[var(--stroke-strong)] bg-[linear-gradient(180deg,rgba(13,22,38,0.94),rgba(8,14,26,0.92))] p-6 shadow-[0_42px_100px_-56px_rgba(2,8,23,0.96),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="space-y-6">
            <SectionBadge>Piattaforma decisionale</SectionBadge>

            <div className="space-y-5">
              <h1 className="text-balance font-heading max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Choiser
              </h1>
              <p className="text-balance max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
                Non sai cosa scegliere? Ti aiutiamo noi.
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/78">
                Una dashboard leggera per generare idee, giocare in pochi tap e
                usare strumenti utili con un linguaggio visivo più chiaro e
                coerente.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/random"
                className={buttonStyles({ className: "w-full sm:w-auto" })}
                style={primaryButtonReadableStyle}
              >
                <ArrowRight
                  className="size-4 text-slate-950"
                  style={primaryButtonReadableStyle}
                />
                <span
                  className="text-slate-950"
                  style={primaryButtonReadableStyle}
                >
                  Esplora le categorie
                </span>
              </Link>
              <Link
                href="/games/tab-who"
                className={buttonStyles({
                  variant: "secondary",
                  className: "w-full sm:w-auto",
                })}
              >
                <span>Apri TAB-WHO ?</span>
              </Link>
              <Link
                href="/tools"
                className={buttonStyles({
                  variant: "ghost",
                  className: "w-full sm:w-auto",
                })}
              >
                <span>Vai ai tools</span>
              </Link>
            </div>

            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/54">
                  Esperienza
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Mobile-first e leggibile
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/54">
                  Moduli
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Giochi, random e tools
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/54">
                  Focus
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Interfaccia più semplice
                </p>
              </div>
            </div>
          </div>
        </div>

        <HomeHeroPanel />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">
              Categorie
            </p>
            <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-white">
              Scegli come vuoi iniziare
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-white/76">
            Tre aree principali organizzano l&apos;esperienza: generatori
            casuali, mini giochi e strumenti pratici.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">
            Perché Choiser
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-white">
            Un linguaggio visivo più tech, ma più facile da usare
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {homeHighlights.map((highlight) => (
            <HighlightCard key={highlight.title} {...highlight} />
          ))}
        </div>
      </section>
    </div>
  );
}
