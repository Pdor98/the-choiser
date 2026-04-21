"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, Trophy, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";
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

type ConfettiParticle = {
  id: number;
  color: string;
  left: number;
  top: number;
  size: number;
  drift: number;
  rise: number;
  fall: number;
  rotate: number;
  delay: number;
  duration: number;
};

function createCelebrationParticles() {
  return Array.from({ length: 16 }, (_, index) => ({
    id: index,
    color: wheelSegmentColors[index % wheelSegmentColors.length],
    left: 16 + ((index * 17) % 68),
    top: 36 + ((index * 9) % 16),
    size: 6 + (index % 4),
    drift: -36 + ((index * 11) % 72),
    rise: 18 + (index % 5) * 10,
    fall: 72 + (index % 6) * 12,
    rotate: -120 + ((index * 39) % 240),
    delay: (index % 6) * 0.03,
    duration: 1.05 + (index % 4) * 0.1,
  }));
}

export function EliminationWheelGame() {
  const [draftNames, setDraftNames] = useState(wheelDefaultNames.join("\n"));
  const [lineupNames, setLineupNames] = useState(wheelDefaultNames);
  const [activeNames, setActiveNames] = useState(wheelDefaultNames);
  const [eliminatedNames, setEliminatedNames] = useState<string[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [pendingElimination, setPendingElimination] =
    useState<PendingElimination>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [celebrationParticles, setCelebrationParticles] = useState<
    ConfettiParticle[]
  >([]);
  const [feedback, setFeedback] = useState(
    "Carica i nomi, gira la ruota e lascia che venga eliminato un nome a ogni spin.",
  );

  function applyNames() {
    const nextNames = parseEntryInput(draftNames, 12);

    if (nextNames.length < 2) {
      setFeedback("Servono almeno due nomi distinti per avviare la ruota.");
      return;
    }

    setLineupNames(nextNames);
    setActiveNames(nextNames);
    setEliminatedNames([]);
    setWheelRotation(0);
    setPendingElimination(null);
    setIsSpinning(false);
    setCelebrationParticles([]);
    setFeedback(`${nextNames.length} nomi caricati. Puoi lanciare la ruota.`);
  }

  function resetWheel() {
    setDraftNames(wheelDefaultNames.join("\n"));
    setLineupNames(wheelDefaultNames);
    setActiveNames(wheelDefaultNames);
    setEliminatedNames([]);
    setWheelRotation(0);
    setPendingElimination(null);
    setIsSpinning(false);
    setCelebrationParticles([]);
    setFeedback("Ruota resettata. Pronta per un nuovo torneo.");
  }

  function triggerSpin(names = activeNames, baseRotation = wheelRotation) {
    if (isSpinning || names.length <= 1) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * names.length);
    const segmentAngle = 360 / names.length;
    const chosenCenter = selectedIndex * segmentAngle + segmentAngle / 2;
    const desiredRotation = (360 - chosenCenter) % 360;
    const currentRotation = ((baseRotation % 360) + 360) % 360;
    const nextRotation =
      baseRotation + 360 * 7 + ((desiredRotation - currentRotation + 360) % 360);

    setPendingElimination({
      index: selectedIndex,
      name: names[selectedIndex],
    });
    setIsSpinning(true);
    setCelebrationParticles([]);
    setFeedback("La ruota sta girando...");
    setWheelRotation(nextRotation);
  }

  function spinWheel() {
    triggerSpin(activeNames, wheelRotation);
  }

  function restartRoundFromWinner() {
    if (isSpinning || !winner || lineupNames.length <= 1) {
      return;
    }

    const nextNames = [...lineupNames];

    setActiveNames(nextNames);
    setEliminatedNames([]);
    setWheelRotation(0);
    setPendingElimination(null);
    setIsSpinning(false);
    setCelebrationParticles([]);
    setFeedback("Nuovo giro in partenza...");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        triggerSpin(nextNames, 0);
      });
    });
  }

  const winner = activeNames.length === 1 ? activeNames[0] : null;
  const displayedRotation = winner ? 0 : wheelRotation;
  const segmentAngle = activeNames.length > 0 ? 360 / activeNames.length : 360;
  const canSpin = !isSpinning && activeNames.length > 1;

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-pink-300/12 to-transparent" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-pink-200/70">
              Elimination wheel
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Ruota a eliminazione automatica
            </h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-pink-200">
            <Users className="size-5" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-5">
            <div className="relative mx-auto aspect-square w-full max-w-[430px]">
              <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-pink-200 drop-shadow-[0_0_14px_rgba(244,114,182,0.8)]" />

              <motion.div
                animate={{ rotate: displayedRotation }}
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
                    setWheelRotation(0);
                    setCelebrationParticles(createCelebrationParticles());
                    setFeedback(
                      `${nextNames[0]} resta in gioco ed è il vincitore finale. Tocca il suo nome per ripartire subito.`,
                    );
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
                  {winner ? (
                    <g>
                      <circle
                        cx="120"
                        cy="120"
                        r="108"
                        fill={wheelSegmentColors[0]}
                        fillOpacity={0.92}
                        stroke="rgba(255,255,255,0.24)"
                        strokeWidth="1.2"
                      />
                      <text
                        x="120"
                        y="120"
                        fill="rgba(6,10,20,0.9)"
                        fontSize="18"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {winner.length > 16 ? `${winner.slice(0, 16)}…` : winner}
                      </text>
                    </g>
                  ) : (
                    activeNames.map((name, index) => {
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
                    })
                  )}
                </svg>
              </motion.div>

              {winner ? (
                <>
                  <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                    {celebrationParticles.map((particle) => (
                      <motion.span
                        key={`${winner}-${particle.id}`}
                        className="absolute rounded-[2px]"
                        style={{
                          left: `${particle.left}%`,
                          top: `${particle.top}%`,
                          width: particle.size,
                          height: particle.size * 1.6,
                          backgroundColor: particle.color,
                          boxShadow: `0 0 18px -10px ${particle.color}`,
                        }}
                        initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.8 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          x: [0, particle.drift],
                          y: [0, -particle.rise, particle.fall],
                          rotate: [0, particle.rotate],
                          scale: [0.8, 1, 0.92],
                        }}
                        transition={{
                          duration: particle.duration,
                          delay: particle.delay,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    onClick={restartRoundFromWinner}
                    aria-label={`Riparti subito con ${winner}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute left-1/2 top-1/2 z-30 flex h-[34%] min-h-[118px] w-[34%] min-w-[118px] max-h-[156px] max-w-[156px] -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-emerald-200/24 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] shadow-[0_0_0_10px_rgba(255,255,255,0.04),0_18px_42px_-30px_rgba(0,0,0,0.95)] transition duration-300 hover:border-emerald-200/34 hover:shadow-[0_0_0_10px_rgba(255,255,255,0.04),0_20px_46px_-28px_rgba(16,185,129,0.28)]"
                  >
                    <div className="px-3 text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-100/62 sm:text-[10px]">
                        Vincitore
                      </p>
                      <p className="font-heading mt-2 text-balance text-base font-semibold leading-tight text-white sm:text-lg">
                        {winner.length > 18 ? `${winner.slice(0, 18)}…` : winner}
                      </p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-emerald-100/58">
                        Tocca per ripartire
                      </p>
                    </div>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  type="button"
                  onClick={spinWheel}
                  disabled={!canSpin}
                  aria-label="Gira la ruota toccando il centro"
                  whileHover={canSpin ? { scale: 1.03 } : undefined}
                  whileTap={canSpin ? { scale: 0.97 } : undefined}
                  className="group absolute left-1/2 top-1/2 z-30 flex h-[24%] min-h-[84px] w-[24%] min-w-[84px] max-h-[108px] max-w-[108px] -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/12 bg-slate-950 shadow-[0_0_0_10px_rgba(255,255,255,0.04),0_0_0_22px_rgba(244,114,182,0.04),0_18px_42px_-30px_rgba(0,0,0,0.95)] transition duration-300 active:scale-[0.98] disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.96),rgba(2,6,23,0.92))] transition duration-300 group-hover:border-pink-200/24 group-hover:shadow-[0_0_24px_-12px_rgba(244,114,182,0.55)]" />
                  <div className="relative flex items-center justify-center text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/52">
                      Spin
                    </span>
                  </div>
                </motion.button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <ResponsiveControlPanel
              title="Partecipanti"
              summary={`${activeNames.length} nomi in gioco`}
            >
              <Textarea
                className="min-h-40"
                value={draftNames}
                onChange={(event) => setDraftNames(event.target.value)}
                placeholder="Es. Alice&#10;Marco&#10;Giulia"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={applyNames}>
                  Applica nomi
                </Button>
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={spinWheel}
                  disabled={!canSpin}
                >
                  Gira la ruota
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetWheel}
                >
                  Reset
                </Button>
              </div>
            </ResponsiveControlPanel>

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
                    <button
                      type="button"
                      onClick={restartRoundFromWinner}
                      className="group w-full touch-manipulation text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-50">
                          <Trophy className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/70">
                            Vincitore
                          </p>
                          <p className="font-heading mt-1 text-2xl font-semibold text-white transition duration-300 group-hover:text-emerald-50 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.26)]">
                            {winner}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100/54">
                            Tocca per ripartire
                          </p>
                        </div>
                      </div>
                    </button>
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

            <ResponsiveControlPanel
              title="Spiegazioni"
              summary="Come funziona"
            >
              <div className="space-y-3 text-sm leading-7 text-white/62">
                <p>
                  Carica i partecipanti, gira la ruota e lascia che venga
                  eliminato un nome a ogni spin.
                </p>
                <p>
                  Stato, eliminati e vincitore restano tutti sotto ai controlli,
                  così il flusso è più rapido anche durante una serata di gruppo.
                </p>
              </div>
            </ResponsiveControlPanel>
          </div>
        </div>
      </div>
    </Card>
  );
}
