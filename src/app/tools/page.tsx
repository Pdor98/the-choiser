import { TimerReset } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { TimerTool } from "@/features/tools/timer-tool";

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Tools category"
        title="Strumenti utili con interfacce essenziali e una UX davvero pulita."
        description="Il timer di Choiser ora include selezione rapida dei secondi, suono finale, vista classica, modalità clessidra animata e controlli semplici per desktop e mobile."
        aside={
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-emerald-200">
                <TimerReset className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Focus utility
                </p>
                <p className="mt-2 text-sm leading-7 text-white/64">
                  Preset rapidi, doppia visualizzazione e segnale sonoro finale
                  rendono il countdown più chiaro, coinvolgente e facile da usare.
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
