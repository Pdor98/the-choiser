"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionBadge } from "@/components/ui/section-badge";

const decisionNotes = [
  "Prima mossa leggera: parti da qui e vedi come ti senti.",
  "Se sei bloccato, lascia che sia l'azione a sbloccare il resto.",
  "Quando le opzioni sono vicine, scegliere in fretta aiuta piu di ottimizzare.",
  "Provala senza pensarci troppo: il feedback arriva dopo il primo passo.",
  "Questa sembra la direzione piu semplice da accendere adesso.",
];

function getRandomItem(items: string[], previous?: string) {
  if (items.length === 1) {
    return items[0];
  }

  let nextItem = items[Math.floor(Math.random() * items.length)];

  if (!previous) {
    return nextItem;
  }

  while (nextItem === previous) {
    nextItem = items[Math.floor(Math.random() * items.length)];
  }

  return nextItem;
}

export function HomeHeroPanel() {
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [decision, setDecision] = useState<string | null>(null);
  const [note, setNote] = useState(decisionNotes[0]);

  const canChoose = optionA.trim().length > 0 && optionB.trim().length > 0;

  function handleChoose() {
    if (!canChoose) {
      return;
    }

    const nextDecision =
      Math.random() > 0.5 ? optionA.trim() : optionB.trim();

    setDecision(nextDecision);
    setNote((currentNote) => getRandomItem(decisionNotes, currentNote));
  }

  return (
    <Card className="relative overflow-hidden border-white/7 bg-[linear-gradient(180deg,rgba(10,19,33,0.78),rgba(13,24,41,0.74))] p-4 shadow-[0_22px_58px_-46px_rgba(15,23,42,0.3)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-300/10 via-indigo-300/5 to-transparent" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-cyan-300/8 blur-3xl" />

      <div className="relative space-y-5 sm:space-y-6">
        <SectionBadge className="border-white/8 bg-white/5 text-slate-200">
          Mini tool rapido
        </SectionBadge>

        <div className="space-y-4">
          <div className="flex size-11 items-center justify-center rounded-[18px] border border-white/8 bg-white/5 text-cyan-200 shadow-[0_14px_36px_-30px_rgba(56,189,248,0.16)] sm:size-12">
            <ArrowLeftRight className="size-5" />
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-slate-100 sm:text-[1.35rem]">
              Indeciso tra due opzioni?
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-300/88 sm:leading-7">
              Scrivi due alternative e lascia che Choiser scelga una direzione
              rapida per te. Perfetto per dubbi veloci, scelte leggere o
              semplici blocchi da sbloccare.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.84fr)] xl:items-stretch">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Opzione A
                </p>
                <Input
                  value={optionA}
                  onChange={(event) => setOptionA(event.target.value)}
                  placeholder="Pizza"
                  aria-label="Prima opzione"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Opzione B
                </p>
                <Input
                  value={optionB}
                  onChange={(event) => setOptionB(event.target.value)}
                  placeholder="Sushi"
                  aria-label="Seconda opzione"
                />
              </div>
            </div>

            <div className="rounded-[22px] border border-white/7 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Quando usarlo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300/86">
                Cena, film, pausa, prossima mossa, piccole decisioni del giorno.
              </p>
            </div>

            <Button
              icon={<Wand2 className="size-4" />}
              onClick={handleChoose}
              className="w-full"
              disabled={!canChoose}
            >
              Decidi per me
            </Button>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,28,48,0.94),rgba(10,20,35,0.92))] p-4 sm:p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-200">
                <Sparkles className="size-4" />
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Scelta rapida
                </p>
              </div>

              <div className="flex min-h-[11rem] flex-col items-center justify-center rounded-[22px] border border-white/8 bg-white/[0.045] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[12rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={decision ?? "idle"}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.985 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {decision ? "Choiser sceglie" : "In attesa"}
                    </p>
                    <p className="font-heading text-[clamp(1.4rem,1.05rem+1vw,2.1rem)] font-semibold leading-tight text-slate-50">
                      {decision ?? "Inserisci due opzioni e lascia decidere Choiser."}
                    </p>
                    <p className="mx-auto max-w-[20rem] text-sm leading-6 text-slate-300/86">
                      {decision ? note : "Un mini tool utile e leggero per sbloccare i dubbi piu rapidi senza uscire dalla home."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
