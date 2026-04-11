import { Dices, MessageCircle, RotateCcw, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { BottleSpinGame } from "@/features/games/bottle-spin";
import { DiceArenaGame } from "@/features/games/dice-arena";
import { EliminationWheelGame } from "@/features/games/elimination-wheel";
import { GuessTheNumberGame } from "@/features/games/guess-the-number";

const gameSections = [
  {
    href: "/games/tab-who",
    title: "TAB-WHO ?",
    description: "Sfida a parole con taboo, timer e punteggio in 60 secondi.",
    icon: MessageCircle,
  },
  {
    href: "#guess-the-number",
    title: "Guess the Number",
    description: "Range libero, feedback visivo e storico dei tentativi.",
    icon: Target,
  },
  {
    href: "#bottle-spin",
    title: "Bottle Spin",
    description: "La bottiglia gira sulle scelte che inserisci tu.",
    icon: Sparkles,
  },
  {
    href: "#elimination-wheel",
    title: "Elimination Wheel",
    description: "Gira la ruota e i nomi escono automaticamente.",
    icon: RotateCcw,
  },
  {
    href: "#dice-arena",
    title: "Dice Arena",
    description: "Lancio dadi con setup personalizzato e cronologia.",
    icon: Dices,
  },
] as const;

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Games category"
        title="Una collezione di mini giochi interattivi, veloci da avviare e piacevoli da rigiocare."
        description="La sezione Games ora ospita piu esperienze: TAB-WHO ? per round rapidi in stile Taboo, indovinare un numero con feedback evoluto, far girare la bottiglia su scelte personalizzate, eliminare nomi con una ruota e lanciare dadi con setup variabile."
        aside={
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-amber-200">
                <Dices className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Five live games
                </p>
                <p className="mt-2 text-sm leading-7 text-white/64">
                  Cinque moduli con input personalizzati, animazioni e logiche
                  distinte rendono la sezione piu completa e versatile.
                </p>
              </div>
            </div>
          </Card>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {gameSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link key={section.href} href={section.href} className="group h-full">
              <Card className="h-full p-5 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/16 group-hover:bg-white/8">
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-heading text-xl font-semibold text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm leading-7 text-white/60">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>

      <div className="space-y-8">
        <div className="scroll-mt-52" id="guess-the-number">
          <GuessTheNumberGame />
        </div>
        <div className="scroll-mt-52" id="bottle-spin">
          <BottleSpinGame />
        </div>
        <div className="scroll-mt-52" id="elimination-wheel">
          <EliminationWheelGame />
        </div>
        <div className="scroll-mt-52" id="dice-arena">
          <DiceArenaGame />
        </div>
      </div>
    </div>
  );
}
