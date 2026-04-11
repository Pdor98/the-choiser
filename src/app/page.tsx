import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryCard } from "@/components/home/category-card";
import { HighlightCard } from "@/components/home/highlight-card";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import { buttonStyles } from "@/components/ui/button";
import { SectionBadge } from "@/components/ui/section-badge";
import { categories, homeHighlights } from "@/lib/site-content";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px] xl:items-stretch">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-7 shadow-[0_40px_90px_-50px_rgba(8,15,30,0.95)] backdrop-blur-xl sm:p-10">
          <div className="space-y-6">
            <SectionBadge>Decision platform</SectionBadge>

            <div className="space-y-5">
              <h1 className="text-balance font-heading max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Choiser
              </h1>
              <p className="text-balance max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">
                Non sai cosa scegliere? Ti aiutiamo noi.
              </p>
              <p className="max-w-2xl text-base leading-8 text-white/60">
                Una web app moderna per generare idee, giocare rapidamente e
                usare strumenti essenziali dentro un&apos;unica esperienza
                fluida.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/random" className={buttonStyles({})}>
                <ArrowRight className="size-4" />
                <span>Esplora le categorie</span>
              </Link>
              <Link
                href="/games/tab-who"
                className={buttonStyles({ variant: "secondary" })}
              >
                <span>Apri TAB-WHO ?</span>
              </Link>
              <Link
                href="/tools"
                className={buttonStyles({ variant: "ghost" })}
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
          <p className="max-w-2xl text-sm leading-7 text-white/56">
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
            Why Choiser
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
