import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryCard } from "@/components/home/category-card";
import { DailyAdvicePanel } from "@/components/home/daily-advice-panel";
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
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_400px] xl:items-stretch">
        <DailyAdvicePanel />
        <HomeHeroPanel />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionBadge>Scorciatoie Choiser</SectionBadge>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Dopo il consiglio, scegli dove continuare
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-700">
            La home ora parte da un’azione concreta e poi ti accompagna verso
            generatori, giochi e strumenti senza dispersione.
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
            <span className="text-slate-950" style={primaryButtonReadableStyle}>
              Apri il consiglio di oggi
            </span>
          </Link>
          <Link
            href="/games/tab-who"
            className={buttonStyles({
              variant: "secondary",
              className: "w-full sm:w-auto",
            })}
          >
            <span>Vai a TAB-WHO ?</span>
          </Link>
          <Link
            href="/tools"
            className={buttonStyles({
              variant: "ghost",
              className: "w-full sm:w-auto",
            })}
          >
            <span>Apri i tools</span>
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Categorie
            </p>
            <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Scegli come vuoi iniziare
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-700">
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
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Perché Choiser
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Più chiaro, più fresco, più orientato all’azione
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
