import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionBadge } from "@/components/ui/section-badge";

export function HomeHeroPanel() {
  return (
    <Card className="relative overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(34,46,61,0.92),rgba(17,24,39,0.88))] p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-300/16 via-white/7 to-amber-300/16" />
      <div className="relative space-y-6">
        <SectionBadge className="border-white/14 bg-slate-900/58 text-white/82">
          Startup-ready experience
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/12 bg-slate-950/78 text-cyan-200">
            <Sparkles className="size-6" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
              Una home pensata per scegliere in pochi secondi.
            </h2>
            <p className="text-sm leading-7 text-white/76">
              Choiser combina micro-tool, giochi veloci e generatori casuali in
              un&apos;interfaccia unica, chiara e facile da estendere.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/58">
              Live modules
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-white">
              8
            </p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/58">
              Mobile ready
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold text-white">
              100%
            </p>
          </div>
        </div>

        <Link
          href="/random"
          className={buttonStyles({ className: "w-full sm:w-auto" })}
        >
          <ArrowRight className="size-4" />
          <span>Inizia dal Random</span>
        </Link>
      </div>
    </Card>
  );
}
