import { Dices } from "lucide-react";

import { PageExitBar } from "@/components/layout/page-exit-bar";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { DiceArenaGame } from "@/features/games/dice-arena";
import { TimerTool } from "@/features/tools/timer-tool";

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        badge="Tools category"
        title="Strumenti essenziali con una UI più pulita, moderna e pronta all’uso."
      />

      <TimerTool />
      <DiceArenaGame />

      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-cyan-300/16 bg-white/6 p-3 text-cyan-200">
            <Dices className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Utility deck
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Timer e dadi ora convivono nella stessa sezione: preset rapidi,
              countdown in vista classica o clessidra e lanci personalizzati
              con storico rendono Tools più pratico e immediato.
            </p>
          </div>
        </div>
      </Card>

      <PageExitBar description="Quando hai finito con timer o dadi puoi tornare alla home o aprire un’altra sezione senza risalire fino all’header." />
    </div>
  );
}
