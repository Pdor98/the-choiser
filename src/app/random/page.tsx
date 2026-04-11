import { Dices } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { RandomHub } from "@/features/random/random-hub";

export default function RandomPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Random category"
        title="Generatori casuali che trasformano l'indecisione in azione."
        description="Scegli tra un numero casuale e un suggerimento su cosa fare oggi. Ogni risultato appare con animazioni morbide e un layout pensato per restare leggibile anche su mobile."
        aside={
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-sky-200/80 bg-white/84 p-3 text-sky-700">
                <Dices className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Due generatori
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Risultati rapidi, reset immediato e presentazione visuale
                  coerente con il resto dell&apos;app.
                </p>
              </div>
            </div>
          </Card>
        }
      />

      <RandomHub />
    </div>
  );
}
