"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dices, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export function DiceArenaGame() {
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [diceValues, setDiceValues] = useState(() => generateDiceRoll(2, 6));
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceHistoryItem[]>([]);
  const [feedback, setFeedback] = useState(
    "Scegli quanti dadi lanciare e il tipo di dado, poi fai partire il roll.",
  );

  const total = diceValues.reduce((sum, value) => sum + value, 0);

  function updateDiceCount(nextCount: number) {
    setDiceCount(nextCount);
    setDiceValues(generateDiceRoll(nextCount, diceSides));
  }

  function updateDiceSides(nextSides: number) {
    setDiceSides(nextSides);
    setDiceValues(generateDiceRoll(diceCount, nextSides));
  }

  function resetHistory() {
    setDiceCount(2);
    setDiceSides(6);
    setDiceValues(generateDiceRoll(2, 6));
    setHistory([]);
    setIsRolling(false);
    setFeedback("Configurazione resettata. Pronto per un nuovo lancio.");
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
    <Card className="relative overflow-hidden p-4 sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-300/14 to-transparent" />
      <div className="relative space-y-6 pb-28 lg:pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
              Dice arena
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Lancia i dadi con setup personalizzato
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              Scegli quanti dadi usare, il tipo di dado e ottieni un totale
              immediato con cronologia degli ultimi lanci.
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-emerald-200">
            <Dices className="size-5" />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/62 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {diceValues.map((value, index) => (
                <motion.div
                  key={`${index}-${value}-${isRolling ? "rolling" : "idle"}`}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className={`rounded-[24px] border p-4 text-center shadow-[0_24px_55px_-40px_rgba(0,0,0,0.95)] sm:rounded-[28px] sm:p-6 ${
                    isRolling
                      ? "animate-pulse border-emerald-300/24 bg-emerald-300/10"
                      : "border-white/10 bg-slate-950/86"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Dado {index + 1}
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold tracking-tight text-white sm:mt-4 sm:text-6xl">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/80 p-4 sm:mt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Totale corrente
              </p>
              <p className="font-heading mt-2 text-4xl font-semibold text-white">
                {total}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/58">{feedback}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Setup
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-white/72">
                    Numero di dadi
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {diceCountOptions.map((option) => (
                      <button
                        key={option}
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
                  <p className="text-sm font-medium text-white/72">Tipo di dado</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {diceSidesOptions.map((option) => (
                      <button
                        key={option}
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

              <div className="mt-5 hidden gap-3 lg:grid xl:grid-cols-1">
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full"
                >
                  Lancia dadi
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetHistory}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>

              <div className="mt-4 rounded-[24px] border border-emerald-300/14 bg-emerald-300/8 p-4 xl:hidden">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/68">
                  Risultato rapido
                </p>
                <p className="font-heading mt-2 text-3xl font-semibold text-white">
                  {total}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {diceValues.join(" · ")} su d{diceSides}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                Storico lanci
              </p>
              <AnimatePresence initial={false}>
                {history.length > 0 ? (
                  <div className="mt-4 space-y-3">
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
                  <p className="mt-4 text-sm leading-7 text-white/48">
                    Nessun lancio registrato per ora.
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,20,35,0.96),rgba(13,24,42,0.94))] p-3 shadow-[0_26px_70px_-38px_rgba(15,23,42,0.78)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                icon={<Play className="size-4" />}
                onClick={rollDice}
                disabled={isRolling}
                className="min-h-[3.2rem] w-full justify-center"
              >
                Lancia
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={<RotateCcw className="size-4" />}
                onClick={resetHistory}
                className="min-h-[3.2rem] w-full justify-center"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
