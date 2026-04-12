"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, Sparkles } from "lucide-react";
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
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState(
    "Inserisci almeno due scelte e fai girare la bottiglia.",
  );

  function applyChoices() {
    const nextChoices = parseEntryInput(draftChoices, 12);

    if (nextChoices.length < 2) {
      setFeedback("Servono almeno due scelte distinte per far girare la bottiglia.");
      return;
    }

    setChoices(nextChoices);
    setSelectedChoice(null);
    setFeedback(`${nextChoices.length} scelte pronte. Puoi far partire lo spin.`);
  }

  function resetBoard() {
    setDraftChoices(bottleDefaultChoices.join("\n"));
    setChoices(bottleDefaultChoices);
    setSelectedChoice(null);
    setRotation(0);
    setIsSpinning(false);
    setFeedback("Board resettata. La bottiglia è pronta per un nuovo giro.");
  }

  function spinBottle() {
    if (isSpinning || choices.length < 2) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * choices.length);
    const segmentAngle = 360 / choices.length;
    const currentRotation = ((rotation % 360) + 360) % 360;
    const nextRotation =
      rotation + 360 * 6 + ((selectedIndex * segmentAngle - currentRotation + 360) % 360);

    setSelectedChoice(choices[selectedIndex]);
    setIsSpinning(true);
    setFeedback("La bottiglia sta girando...");
    setRotation(nextRotation);
  }

  const orbitRadius = 39;

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
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              Inserisci nomi o opzioni, disponili attorno al tavolo e lascia che
              la bottiglia scelga per te.
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
            <Sparkles className="size-5" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-5">
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <div className="absolute inset-3 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.2),_rgba(6,13,24,0.95)_64%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_70px_-45px_rgba(0,0,0,0.95)]" />
              <div className="absolute inset-8 rounded-full border border-white/8 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_rgba(7,11,25,0.95)_72%)]" />

              {choices.map((choice, index) => {
                const angle = (-90 + index * (360 / choices.length) * 1) * (Math.PI / 180);
                const x = 50 + Math.cos(angle) * orbitRadius;
                const y = 50 + Math.sin(angle) * orbitRadius;
                const isSelected = selectedChoice === choice && !isSpinning;

                return (
                  <div
                    key={choice}
                    className="absolute w-[110px] -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className={`rounded-full border px-3 py-2 text-center text-sm font-semibold shadow-[0_12px_30px_-24px_rgba(0,0,0,0.95)] ${
                        isSelected
                          ? "border-cyan-200/50 bg-cyan-300/18 text-white"
                          : "border-white/10 bg-slate-950/86 text-white/76"
                      }`}
                    >
                      <span className="block truncate">{choice}</span>
                    </div>
                  </div>
                );
              })}

              <motion.div
                className="absolute left-1/2 top-1/2 h-[56%] w-12 -translate-x-1/2 -translate-y-1/2 origin-center"
                animate={{ rotate: rotation }}
                transition={
                  isSpinning
                    ? { duration: 3.6, ease: [0.16, 0.84, 0.22, 1] }
                    : { duration: 0.2, ease: "easeOut" }
                }
                onAnimationComplete={() => {
                  if (!isSpinning || !selectedChoice) {
                    return;
                  }

                  setIsSpinning(false);
                  setFeedback(`La bottiglia si è fermata su ${selectedChoice}.`);
                }}
              >
                <div className="relative flex h-full w-full items-start justify-center">
                  <div className="absolute -top-1 h-7 w-4 rounded-full border border-white/20 bg-slate-950/90" />
                  <div className="relative mt-3 h-[84%] w-full rounded-[999px_999px_20px_20px] border border-white/60 bg-gradient-to-b from-white via-cyan-100 to-amber-200 shadow-[0_18px_45px_-30px_rgba(255,255,255,0.95)]">
                    <div className="absolute inset-x-2 top-3 h-[38%] rounded-full bg-slate-950/20" />
                    <div className="absolute inset-x-3 bottom-4 h-2 rounded-full bg-white/40" />
                  </div>
                </div>
              </motion.div>

              <div className="absolute left-1/2 top-[8%] h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-t-[18px] border-l-transparent border-r-transparent border-t-cyan-200 drop-shadow-[0_0_12px_rgba(165,243,252,0.75)]" />
              <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-slate-950 shadow-[0_0_0_8px_rgba(255,255,255,0.04)]" />
            </div>
          </div>

          <div className="space-y-4">
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
                  icon={<Play className="size-4" />}
                  onClick={spinBottle}
                  disabled={isSpinning}
                >
                  Gira bottiglia
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

            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Risultato
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedChoice ?? feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="mt-3"
                >
                  {selectedChoice && !isSpinning ? (
                    <div className="rounded-[24px] border border-cyan-200/28 bg-cyan-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">
                        Scelta selezionata
                      </p>
                      <p className="font-heading mt-2 text-3xl font-semibold text-white">
                        {selectedChoice}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm leading-7 text-white/62">{feedback}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
