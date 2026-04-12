import { CategoryCard } from "@/components/home/category-card";
import { DailyAdvicePanel } from "@/components/home/daily-advice-panel";
import { HighlightCard } from "@/components/home/highlight-card";
import { HomeHeroPanel } from "@/components/home/home-hero-panel";
import { ScrollFocusSection } from "@/components/layout/scroll-focus-section";
import { categories, homeHighlights } from "@/lib/site-content";

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <ScrollFocusSection emphasis="hero">
        <DailyAdvicePanel />
      </ScrollFocusSection>

      <ScrollFocusSection className="mx-auto max-w-5xl">
        <HomeHeroPanel />
      </ScrollFocusSection>

      <ScrollFocusSection className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Categorie
            </p>
            <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Scegli come vuoi iniziare
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Tre aree principali organizzano l&apos;esperienza: generatori
            casuali, mini giochi e strumenti pratici.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.href} {...category} />
          ))}
        </div>
      </ScrollFocusSection>

      <ScrollFocusSection className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Perché Choiser
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Più leggibile, più profondo, più orientato all’azione
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {homeHighlights.map((highlight) => (
            <HighlightCard key={highlight.title} {...highlight} />
          ))}
        </div>
      </ScrollFocusSection>
    </div>
  );
}
