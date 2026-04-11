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
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px] xl:items-stretch">
        <div className="rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,rgba(32,47,63,0.94),rgba(18,25,39,0.9))] p-6 shadow-[0_42px_90px_-54px_rgba(8,15,30,0.95)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="space-y-6">
            <SectionBadge>Piattaforma decisionale</SectionBadge>

            <div className="space-y-5">
              <h1 className="text-balance font-heading max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Choiser
              </h1>
              <p className="text-balance max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Non sai cosa scegliere? Ti aiutiamo noi.
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/72">
                Una web app moderna per generare idee, giocare rapidamente e
                usare strumenti essenziali dentro un&apos;unica esperienza
                fluida.
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
          </div>
        </div>

        <HomeHeroPanel />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/48">
            Categorie
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-white">
            Scegli come vuoi iniziare
          </h2>
        </div>
          <p className="max-w-2xl text-sm leading-7 text-white/70">
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
          <p className="text-xs uppercase tracking-[0.22em] text-white/48">
            Perché Choiser
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-white">
            Design orientato all&apos;uso, non solo alla presentazione
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
