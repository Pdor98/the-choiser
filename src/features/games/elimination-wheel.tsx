"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, Trophy, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  describeWheelSegment,
  parseEntryInput,
  polarToCartesian,
  wheelDefaultNames,
  wheelSegmentColors,
} from "@/features/games/shared";

type PendingElimination = {
  index: number;
  name: string;
} | null;

export function EliminationWheelGame() {
  const [draftNames, setDraftNames] = useState(wheelDefaultNames.join("\n"));
  const [activeNames, setActiveNames] = useState(wheelDefaultNames);
  const [eliminatedNames, setEliminatedNames] = useState<string[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [pendingElimination, setPendingElimination] =
    useState<PendingElimination>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState(
    "Carica i nomi, gira la ruota e lascia che venga eliminato un nome a ogni spin.",
  );

  function applyNames() {
    const nextNames = parseEntryInput(draftNames, 12);

    if (nextNames.length < 2) {
      setFeedback("Servono almeno due nomi distinti per avviare la ruota.");
      return;
    }

    setActiveNames(nextNames);
    setEliminatedNames([]);
    setWheelRotation(0);
    setPendingElimination(null);
    setIsSpinning(false);
    setFeedback(`${nextNames.length} nomi caricati. Puoi lanciare la ruota.`);
  }

  function resetWheel() {
    setDraftNames(wheelDefaultNames.join("\n"));
    setActiveNames(wheelDefaultNames);
    setEliminatedNames([]);
    setWheelRotation(0);
    setPendingElimination(null);
    setIsSpinning(false);
    setFeedback("Ruota resettata. Pronta per un nuovo torneo.");
  }

  function spinWheel() {
    if (isSpinning || activeNames.length <= 1) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * activeNames.length);
    const segmentAngle = 360 / activeNames.length;
    const chosenCenter = selectedIndex * segmentAngle + segmentAngle / 2;
    const desiredRotation = (360 - chosenCenter) % 360;
    const currentRotation = ((wheelRotation % 360) + 360) % 360;
    const nextRotation =
      wheelRotation + 360 * 7 + ((desiredRotation - currentRotation + 360) % 360);

    setPendingElimination({
      index: selectedIndex,
      name: activeNames[selectedIndex],
    });
    setIsSpinning(true);
    setFeedback("La ruota sta girando...");
    setWheelRotation(nextRotation);
  }

  const winner = activeNames.length === 1 ? activeNames[0] : null;
  const segmentAngle = activeNames.length > 0 ? 360 / activeNames.length : 360;

  return (
    <Card className="relative overflow-hidden p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-pink-300/12 to-transparent" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-pink-200/70">
              Elimination wheel
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ruota a eliminazione automatica
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              Inserisci i nomi, gira la ruota e lascia che a ogni round venga
              eliminato automaticamente un partecipante finché resta il vincitore.
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-pink-200">
            <Users className="size-5" />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start xl:gap-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-5">
            <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[430px]">
              <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-pink-200 drop-shadow-[0_0_14px_rgba(244,114,182,0.8)]" />

              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={
                  isSpinning
                    ? { duration: 4, ease: [0.14, 0.88, 0.2, 1] }
                    : { duration: 0.25, ease: "easeOut" }
                }
                onAnimationComplete={() => {
                  if (!isSpinning || !pendingElimination) {
                    return;
                  }

                  const nextNames = activeNames.filter(
                    (name) => name !== pendingElimination.name,
                  );

                  setActiveNames(nextNames);
                  setEliminatedNames((current) => [
                    pendingElimination.name,
                    ...current,
                  ]);
                  setIsSpinning(false);
                  setPendingElimination(null);

                  if (nextNames.length === 1) {
                    setFeedback(`${nextNames[0]} resta in gioco ed è il vincitore finale.`);
                    return;
                  }

                  setFeedback(`${pendingElimination.name} è stato eliminato.`);
                }}
                className="absolute inset-2"
              >
                <svg
                  viewBox="0 0 240 240"
                  className="size-full drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
                >
                  {activeNames.map((name, index) => {
                    const startAngle = index * segmentAngle;
                    const endAngle = startAngle + segmentAngle;
                    const centerAngle = startAngle + segmentAngle / 2;
                    const path = describeWheelSegment(
                      120,
                      120,
                      108,
                      startAngle,
                      endAngle,
                    );
                    const labelPosition = polarToCartesian(
                      120,
                      120,
                      68,
                      centerAngle,
                    );

                    return (
                      <g key={name}>
                        <path
                          d={path}
                          fill={wheelSegmentColors[index % wheelSegmentColors.length]}
                          fillOpacity={0.9}
                          stroke="rgba(255,255,255,0.24)"
                          strokeWidth="1.2"
                        />
                        <text
                          x={labelPosition.x}
                          y={labelPosition.y}
                          fill="rgba(6,10,20,0.88)"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {name.length > 10 ? `${name.slice(0, 10)}…` : name}
                        </text>
                      </g>
                    );
                  })}
                  <circle
                    cx="120"
                    cy="120"
                    r="30"
                    fill="#070b19"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="10"
                    fill="rgba(255,255,255,0.78)"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Partecipanti
              </p>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Uno per riga o separati da virgola. Massimo 12.
              </p>
              <Textarea
                className="mt-4 min-h-40"
                value={draftNames}
                onChange={(event) => setDraftNames(event.target.value)}
                placeholder="Es. Alice&#10;Marco&#10;Giulia"
              />
              <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={applyNames}
                  className="w-full sm:w-auto"
                >
                  Applica nomi
                </Button>
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={spinWheel}
                  disabled={isSpinning || activeNames.length <= 1}
                  className="w-full sm:w-auto"
                >
                  Gira la ruota
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetWheel}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Stato
              </p>
              <p className="mt-3 text-sm leading-7 text-white/66">{feedback}</p>
              <AnimatePresence mode="wait">
                {winner ? (
                  <motion.div
                    key={winner}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="mt-4 rounded-[24px] border border-emerald-300/24 bg-emerald-300/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-50">
                        <Trophy className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">
                          Vincitore
                        </p>
                        <p className="font-heading mt-1 text-2xl font-semibold text-white">
                          {winner}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Eliminati
              </p>
              {eliminatedNames.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {eliminatedNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white/72"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-white/48">
                  Nessun nome eliminato per ora.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
