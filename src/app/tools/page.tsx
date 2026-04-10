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
        description="Il primo tool di Choiser è un timer con selezione dei secondi, countdown in tempo reale, barra di progresso e notifica finale. Un modulo pronto da espandere con utility future."
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
                  Preset rapidi, countdown visivo e stato finale evidente per un
                  uso semplice in desktop e mobile.
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
