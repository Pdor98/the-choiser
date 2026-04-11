import { TimerReset } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { TimerTool } from "@/features/tools/timer-tool";

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Tools category"
        title="Strumenti essenziali con una UI più pulita, moderna e pronta all’uso."
        description="La sezione tools adotta ora un look più dashboard: preset rapidi, controlli più leggibili, feedback visivi chiari e countdown disponibile sia in vista classica sia in modalità clessidra."
        aside={
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-sky-200/80 bg-white/84 p-3 text-sky-700">
                <TimerReset className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Utility deck
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Countdown più leggibile, doppia visualizzazione e feedback
                  sonoro mantengono l’esperienza essenziale ma più sofisticata.
                </p>
              </div>
            </div>
          </Card>
        }
      />

      <TimerTool />
    </div>
  );
}
