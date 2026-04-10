import { Joystick } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { GuessTheNumberGame } from "@/features/games/guess-the-number";

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Games category"
        title="Mini giochi interattivi, veloci da capire e soddisfacenti da completare."
        description="La sezione Games ospita esperienze compatte ma rifinite. Il primo modulo è Guess the Number: una sfida semplice, con feedback immediato, stato di vittoria e possibilità di ricominciare in un attimo."
        aside={
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-amber-200">
                <Joystick className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Guess the number
                </p>
                <p className="mt-2 text-sm leading-7 text-white/64">
                  Target casuale da 1 a 10, tentativi tracciati e feedback
                  chiari per rendere il gioco più coinvolgente.
                </p>
              </div>
            </div>
          </Card>
        }
      />

      <GuessTheNumberGame />
    </div>
  );
}
