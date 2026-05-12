"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Dices, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";

type DiceHistoryItem = {
  values: number[];
  total: number;
  sides: number;
};

const diceCountOptions = [1, 2, 3, 4];
const diceSidesOptions = [6, 12, 20];

function generateDiceRoll(count: number, sides: number) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
}

function createDicePreview(count: number, sides: number) {
  return Array.from({ length: count }, (_, index) => (index % sides) + 1);
}

export function DiceArenaGame() {
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [diceValues, setDiceValues] = useState(() => createDicePreview(2, 6));
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceHistoryItem[]>([]);
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [feedback, setFeedback] = useState(
    "Tocca il badge dei dadi per cambiare setup, poi fai partire il roll.",
  );

  const total = diceValues.reduce((sum, value) => sum + value, 0);
  const diceGridClassName =
    diceValues.length === 1 ? "grid-cols-1" : "grid-cols-2";

  function updateDiceCount(nextCount: number) {
    setDiceCount(nextCount);
    setDiceValues(generateDiceRoll(nextCount, diceSides));
    setFeedback(`Setup aggiornato: ${nextCount} dadi con d${diceSides}.`);
  }

  function updateDiceSides(nextSides: number) {
    setDiceSides(nextSides);
    setDiceValues(generateDiceRoll(diceCount, nextSides));
    setFeedback(`Setup aggiornato: ${diceCount} dadi con d${nextSides}.`);
  }

  function resetHistory() {
    setDiceCount(2);
    setDiceSides(6);
    setDiceValues(generateDiceRoll(2, 6));
    setHistory([]);
    setIsRolling(false);
    setIsQuickSetupOpen(false);
    setFeedback(
      "Configurazione resettata. Puoi cambiare setup dal badge in alto e rilanciare subito.",
    );
  }

  function rollDice() {
    if (isRolling) {
      return;
    }

    setIsRolling(true);
    setFeedback("I dadi stanno rotolando...");

    const count = diceCount;
    const sides = diceSides;
    const interval = window.setInterval(() => {
      setDiceValues(generateDiceRoll(count, sides));
    }, 90);

    window.setTimeout(() => {
      window.clearInterval(interval);

      const finalValues = generateDiceRoll(count, sides);
      const finalTotal = finalValues.reduce((sum, value) => sum + value, 0);

      setDiceValues(finalValues);
      setHistory((current) => [
        { values: finalValues, total: finalTotal, sides },
        ...current,
      ].slice(0, 6));
      setIsRolling(false);
      setFeedback(`Lancio completato. Totale ${finalTotal} con d${sides}.`);
    }, 1000);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-300/14 to-transparent" />
      <div className="relative space-y-6 pb-28 lg:pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                Dice arena
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
                Lancia i dadi con setup personalizzato
              </h2>
            </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-emerald-200">
            <Dices className="size-5" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-4 sm:p-5">
            <div className={`grid gap-3 sm:gap-4 ${diceGridClassName} xl:grid-cols-4`}>
              {diceValues.map((value, index) => (
                <motion.div
                  key={`${index}-${value}-${isRolling ? "rolling" : "idle"}`}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className={`rounded-[24px] border px-4 py-4 text-center shadow-[0_24px_55px_-40px_rgba(0,0,0,0.95)] sm:rounded-[28px] sm:p-6 ${
                    isRolling
                      ? "animate-pulse border-emerald-300/24 bg-emerald-300/10"
                      : "border-white/10 bg-slate-950/86"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Dado {index + 1}
                  </p>
                  <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-white sm:mt-4 sm:text-6xl">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/80 p-4 sm:mt-5 sm:rounded-[24px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Totale corrente
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-white">
                    {total}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickSetupOpen((current) => !current)}
                  disabled={isRolling}
                  aria-expanded={isQuickSetupOpen}
                  aria-controls="dice-quick-setup"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/62 transition duration-300 hover:border-emerald-300/24 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {diceCount} dadi · d{diceSides}
                  </span>
                  <ChevronDown
                    className={`size-3.5 transition duration-300 ${
                      isQuickSetupOpen ? "rotate-180 text-emerald-200" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/58">{feedback}</p>

              <AnimatePresence initial={false}>
                {isQuickSetupOpen ? (
                  <motion.div
                    id="dice-quick-setup"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="mt-4 rounded-[22px] border border-emerald-300/16 bg-white/[0.04] p-4"
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                          Numero di dadi
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {diceCountOptions.map((option) => (
                            <button
                              key={`quick-count-${option}`}
                              type="button"
                              onClick={() => updateDiceCount(option)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                                diceCount === option
                                  ? "border-emerald-200/45 bg-emerald-300/16 text-white"
                                  : "border-white/10 bg-white/6 text-white/68 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                          Tipo di dado
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {diceSidesOptions.map((option) => (
                            <button
                              key={`quick-sides-${option}`}
                              type="button"
                              onClick={() => updateDiceSides(option)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                                diceSides === option
                                  ? "border-emerald-200/45 bg-emerald-300/16 text-white"
                                  : "border-white/10 bg-white/6 text-white/68 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              d{option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={rollDice}
                  disabled={isRolling}
                  className="min-h-14 w-full sm:flex-1"
                >
                  {isRolling ? "Sto lanciando..." : "Lancia subito"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetHistory}
                  className="min-h-14 w-full sm:w-auto"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ResponsiveControlPanel
              title="Storico lanci"
              summary={
                history.length > 0
                  ? `${history.length} lanci salvati`
                  : "Nessun lancio registrato"
              }
            >
              <AnimatePresence initial={false}>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((entry, index) => (
                      <motion.div
                        key={`${entry.total}-${index}-${entry.values.join("-")}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="rounded-[20px] border border-white/10 bg-white/6 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/42">
                              d{entry.sides}
                            </p>
                            <p className="mt-2 text-sm text-white/72">
                              {entry.values.join(" · ")}
                            </p>
                          </div>
                          <p className="font-heading text-2xl font-semibold text-white">
                            {entry.total}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-white/48">
                    Nessun lancio registrato per ora.
                  </p>
                )}
              </AnimatePresence>
            </ResponsiveControlPanel>

            <ResponsiveControlPanel title="Spiegazioni" summary="Come funziona">
              <div className="space-y-3 text-sm leading-7 text-white/62">
                <p>
                  Tocca il badge con il numero di dadi e le facce per cambiare
                  setup al volo, poi lancia per ottenere subito il totale.
                </p>
                <p>
                  Lo storico salva gli ultimi risultati, così puoi continuare la
                  partita senza perdere il ritmo.
                </p>
              </div>
            </ResponsiveControlPanel>
          </div>
        </div>

      </div>
    </Card>
  );
}
