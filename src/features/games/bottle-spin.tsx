"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MousePointer2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";
import { Textarea } from "@/components/ui/textarea";
import { bottleDefaultChoices, parseEntryInput } from "@/features/games/shared";

export function BottleSpinGame() {
  const [draftChoices, setDraftChoices] = useState(
    bottleDefaultChoices.join("\n"),
  );
  const [choices, setChoices] = useState(bottleDefaultChoices);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [pendingStopRotation, setPendingStopRotation] = useState<number | null>(
    null,
  );
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(4.6);
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState(
    "Inserisci almeno due scelte e fai girare la bottiglia.",
  );
  const hasEnoughChoices = choices.length >= 2;

  function normalizeRotation(value: number) {
    return ((value % 360) + 360) % 360;
  }

  function getChoiceIndexFromRotation(finalRotation: number, totalChoices: number) {
    const segmentAngle = 360 / totalChoices;
    return Math.round(finalRotation / segmentAngle) % totalChoices;
  }

  function applyChoices() {
    const nextChoices = parseEntryInput(draftChoices, 12);

    if (nextChoices.length < 2) {
      setFeedback("Servono almeno due scelte distinte per far girare la bottiglia.");
      return;
    }

    setChoices(nextChoices);
    setSelectedChoice(null);
    setPendingStopRotation(null);
    setFeedback(`${nextChoices.length} scelte pronte. Puoi far partire lo spin.`);
  }

  function resetBoard() {
    setDraftChoices(bottleDefaultChoices.join("\n"));
    setChoices(bottleDefaultChoices);
    setSelectedChoice(null);
    setPendingStopRotation(null);
    setRotation(0);
    setSpinDuration(4.6);
    setIsSpinning(false);
    setFeedback("Board resettata. La bottiglia è pronta per un nuovo giro.");
  }

  function spinBottle() {
    if (isSpinning || !hasEnoughChoices) {
      return;
    }

    const segmentAngle = 360 / choices.length;
    const randomChoiceIndex = Math.floor(Math.random() * choices.length);
    const segmentJitter = (Math.random() - 0.5) * Math.min(segmentAngle * 0.18, 10);
    const desiredRotation = normalizeRotation(
      randomChoiceIndex * segmentAngle + segmentJitter,
    );
    const currentRotation = normalizeRotation(rotation);
    const travelToTarget = (desiredRotation - currentRotation + 360) % 360;
    const extraTurns = 8 + Math.floor(Math.random() * 4);
    const travelTurns = extraTurns + travelToTarget / 360;
    const nextRotation = rotation + 360 * extraTurns + travelToTarget;
    const nextDuration = Math.min(5.4, Math.max(4.2, 3.7 + travelTurns * 0.16));

    setSelectedChoice(null);
    setPendingStopRotation(nextRotation);
    setIsSpinning(true);
    setSpinDuration(nextDuration);
    setFeedback("La bottiglia sta girando...");
    setRotation(nextRotation);
  }

  const orbitRadiusX = 38;
  const orbitRadiusY = 31;
  const activeChoice = selectedChoice;

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-cyan-300/14 to-transparent" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
              Bottle spin
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Gira la bottiglia sulle tue scelte
            </h2>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
            <Sparkles className="size-5" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-5 shadow-[0_26px_64px_-44px_rgba(0,0,0,0.98)]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Tavolo di spin
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    Una scelta alla volta, con una rotazione chiara e credibile.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/62 shadow-[0_18px_36px_-28px_rgba(0,0,0,0.94)]">
                  {choices.length} scelte
                </div>
              </div>

              <motion.button
                type="button"
                onClick={spinBottle}
                disabled={isSpinning || !hasEnoughChoices}
                aria-label="Gira la bottiglia"
                whileHover={
                  !isSpinning && hasEnoughChoices
                    ? { scale: 1.01 }
                    : undefined
                }
                whileTap={
                  !isSpinning && hasEnoughChoices
                    ? { scale: 0.985 }
                    : undefined
                }
                className="group relative mx-auto block aspect-square w-full max-w-[440px] touch-manipulation rounded-full transition duration-300 active:scale-[0.99] disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,rgba(34,211,238,0.18),rgba(59,130,246,0.08),rgba(99,102,241,0.18),rgba(14,165,233,0.08),rgba(34,211,238,0.18))] opacity-85 blur-[2px] transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-2 rounded-full border border-cyan-200/12 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.28),_rgba(6,13,24,0.96)_62%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_34px_80px_-48px_rgba(0,0,0,0.98)]" />
                <div className="absolute inset-5 rounded-full border border-white/8 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.09),_rgba(7,11,25,0.96)_70%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
                <div className="absolute inset-[15%] rounded-full border border-cyan-200/10 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.12),_rgba(2,6,23,0.74))]" />
                <div className="absolute inset-[11%] rounded-full border border-white/6" />
                <div className="absolute inset-[9%] rounded-full border border-cyan-200/10 opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100" />

                {choices.map((choice, index) => {
                  const angle =
                    (-90 + index * (360 / choices.length)) * (Math.PI / 180);
                  const x = 50 + Math.cos(angle) * orbitRadiusX;
                  const y = 50 + Math.sin(angle) * orbitRadiusY;
                  const isSelected = !isSpinning && selectedChoice === choice;

                  return (
                    <div
                      key={choice}
                      className="pointer-events-none absolute w-[86px] -translate-x-1/2 -translate-y-1/2 sm:w-[98px] md:w-[108px]"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <motion.div
                        animate={
                          isSelected
                            ? { scale: [1, 1.06, 1], y: [0, -2, 0] }
                            : undefined
                        }
                        transition={{
                          duration: 0.56,
                          ease: "easeOut",
                        }}
                        className={`rounded-full border px-3 py-2 text-center text-[11px] font-semibold shadow-[0_14px_34px_-24px_rgba(0,0,0,0.98)] sm:text-xs md:text-sm ${
                          isSelected
                            ? "border-cyan-200/54 bg-[linear-gradient(180deg,rgba(34,211,238,0.22),rgba(59,130,246,0.22))] text-white shadow-[0_18px_42px_-26px_rgba(34,211,238,0.52)]"
                            : "border-white/10 bg-slate-950/88 text-white/76 backdrop-blur-sm"
                        }`}
                      >
                        <span className="block truncate">{choice}</span>
                      </motion.div>
                    </div>
                  );
                })}

                <motion.div
                  className="absolute left-1/2 top-1/2 h-[58%] w-[68px] -translate-x-1/2 -translate-y-1/2 origin-center will-change-transform sm:w-[74px]"
                  animate={{ rotate: rotation }}
                  transition={
                    isSpinning
                      ? { duration: spinDuration, ease: [0.12, 0.82, 0.14, 1] }
                      : { duration: 0.24, ease: "easeOut" }
                  }
                  onAnimationComplete={() => {
                    if (!isSpinning || pendingStopRotation === null) {
                      return;
                    }

                    const finalRotation = normalizeRotation(pendingStopRotation);
                    const finalChoiceIndex = getChoiceIndexFromRotation(
                      finalRotation,
                      choices.length,
                    );
                    const finalChoice = choices[finalChoiceIndex];

                    setSelectedChoice(finalChoice);
                    setPendingStopRotation(null);
                    setIsSpinning(false);
                    setFeedback(`La bottiglia si è fermata su ${finalChoice}.`);
                  }}
                >
                  <motion.div
                    animate={
                      isSpinning
                        ? { scale: [1, 1.03, 1], y: [0, -3, 0] }
                        : { scale: 1, y: 0 }
                    }
                    transition={
                      isSpinning
                        ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.24 }
                    }
                    className="relative flex h-full w-full items-start justify-center"
                  >
                    <div className="absolute left-1/2 top-0 h-[5%] w-[10%] -translate-x-1/2 rounded-[4px] border border-white/18 bg-slate-900/98 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.88)]" />
                    <div className="absolute left-1/2 top-[4%] h-[18%] w-[20%] -translate-x-1/2 rounded-[10px_10px_14px_14px] border border-emerald-100/22 bg-[linear-gradient(180deg,rgba(187,247,208,0.55),rgba(22,163,74,0.86))] shadow-[0_14px_30px_-18px_rgba(16,185,129,0.44)]" />
                    <div className="absolute left-1/2 top-[18%] h-[8%] w-[30%] -translate-x-1/2 rounded-full border border-emerald-100/20 bg-[linear-gradient(180deg,rgba(167,243,208,0.74),rgba(5,150,105,0.72))]" />
                    <div className="absolute left-1/2 top-[20%] h-[14%] w-[56%] -translate-x-1/2 rounded-[38px_38px_18px_18px] border border-emerald-100/18 bg-[linear-gradient(180deg,rgba(34,197,94,0.34),rgba(6,95,70,0.62))]" />
                    <div className="absolute top-[30%] h-[56%] w-full rounded-[28px_28px_22px_22px] border border-emerald-100/24 bg-[linear-gradient(180deg,rgba(16,185,129,0.56),rgba(5,46,22,0.9)_30%,rgba(6,78,59,0.88)_66%,rgba(16,185,129,0.64)_100%)] shadow-[0_22px_54px_-28px_rgba(16,185,129,0.38)]">
                      <div className="absolute inset-x-[18%] top-[10%] h-[60%] rounded-[20px_20px_16px_16px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.22))]" />
                      <div className="absolute inset-x-[15%] bottom-[9%] h-[26%] rounded-[16px_16px_20px_20px] bg-[linear-gradient(180deg,rgba(245,158,11,0.76),rgba(180,83,9,0.94))]" />
                      <div className="absolute inset-x-[15%] bottom-[34%] h-[2%] bg-white/14" />
                      <div className="absolute left-[17%] top-[10%] h-[64%] w-[12%] rounded-full bg-white/38 blur-[4px]" />
                      <div className="absolute left-[52%] top-[16%] h-[50%] w-[8%] -translate-x-1/2 rounded-full bg-white/12 blur-[3px]" />
                      <div className="absolute inset-x-[24%] top-[20%] h-[14%] rounded-[10px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
                      <div className="absolute inset-x-[8%] bottom-[2%] h-[11%] rounded-full border border-emerald-100/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.82),rgba(4,120,87,0.98))]" />
                    </div>
                  </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute left-1/2 top-[3.2%] h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[13px] border-l-transparent border-r-transparent border-t-cyan-200 drop-shadow-[0_0_10px_rgba(165,243,252,0.6)]" />
                <div className="pointer-events-none absolute left-1/2 top-[6.1%] h-1 w-8 -translate-x-1/2 rounded-full bg-cyan-200/24 blur-sm" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-slate-950 shadow-[0_0_0_10px_rgba(255,255,255,0.04),0_0_0_22px_rgba(34,211,238,0.03)]" />
                <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100">
                  <div className="absolute inset-[14%] rounded-full border border-cyan-200/16 shadow-[0_0_0_1px_rgba(34,211,238,0.1),0_0_34px_-20px_rgba(34,211,238,0.55)]" />
                </div>
              </motion.button>

              <div className="flex justify-center">
                <div className="w-full max-w-[320px] rounded-[22px] border border-white/10 bg-slate-950/78 px-4 py-3 text-left shadow-[0_20px_48px_-34px_rgba(0,0,0,0.98)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">
                    Stato
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {isSpinning
                      ? "Rotazione in corso"
                      : activeChoice
                        ? "Scelta pronta"
                        : "Pronta a girare"}
                  </p>
                  <p className="mt-1 text-xs text-white/54">
                    {isSpinning
                      ? "Aspetta lo stop finale"
                      : hasEnoughChoices
                        ? "La bottiglia e pronta a scegliere"
                        : "Aggiungi almeno due scelte"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Risultato
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/56">
                    Quando si ferma, la scelta resta in evidenza qui.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/56">
                  {isSpinning ? "Spin" : activeChoice ? "Fermata" : "Attesa"}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedChoice ?? feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="mt-4"
                >
                  {selectedChoice && !isSpinning ? (
                    <div className="rounded-[24px] border border-cyan-200/30 bg-[linear-gradient(180deg,rgba(34,211,238,0.16),rgba(12,24,42,0.78))] p-4 shadow-[0_24px_54px_-38px_rgba(34,211,238,0.58)]">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl border border-cyan-200/24 bg-cyan-300/14 text-cyan-100">
                          <MousePointer2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/72">
                            La bottiglia ha scelto
                          </p>
                          <p className="mt-2 font-heading text-3xl font-semibold text-white">
                            {selectedChoice}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/66">
                            Esito finale chiaro, pronto per il prossimo giro.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
                      <p className="text-sm leading-7 text-white/62">{feedback}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <ResponsiveControlPanel
              title="Scelte"
              summary={`${choices.length} opzioni pronte`}
            >
              <Textarea
                className="min-h-40"
                value={draftChoices}
                onChange={(event) => setDraftChoices(event.target.value)}
                placeholder="Es. Alice&#10;Marco&#10;Pizza"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={applyChoices}>
                  Applica scelte
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetBoard}
                >
                  Reset
                </Button>
              </div>
            </ResponsiveControlPanel>

            <ResponsiveControlPanel
              title="Spiegazioni"
              summary="Come funziona"
            >
              <div className="space-y-3 text-sm leading-7 text-white/62">
                <p>
                  Inserisci almeno due scelte, applicale e fai girare la
                  bottiglia quando vuoi.
                </p>
                <p>
                  Il risultato resta in evidenza subito sotto, così il gruppo
                  può andare avanti senza cercare altre informazioni.
                </p>
              </div>
            </ResponsiveControlPanel>
          </div>
        </div>
      </div>
    </Card>
  );
}
