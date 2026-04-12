"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";

type FeedbackTone = "default" | "warning" | "success";
type GuessDirection = "higher" | "lower" | "correct" | null;
type GuessHistoryItem = {
  value: number;
  direction: Exclude<GuessDirection, null>;
};
type Range = {
  min: number;
  max: number;
};
type RangeResult =
  | {
      min: number;
      max: number;
    }
  | {
      error: string;
    };

const defaultMin = 1;
const defaultMax = 10;

function createTargetNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function feedbackToneClasses(tone: FeedbackTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
    case "warning":
      return "border-red-400/25 bg-red-400/10 text-red-100";
    default:
      return "border-white/10 bg-white/6 text-white/72";
  }
}

function getDirectionMeta(direction: GuessDirection) {
  switch (direction) {
    case "higher":
      return {
        label: "Più alto",
        icon: ArrowUp,
        className: "border-red-300/18 bg-red-300/12 text-red-50",
      };
    case "lower":
      return {
        label: "Più basso",
        icon: ArrowDown,
        className: "border-red-300/18 bg-red-300/12 text-red-50",
      };
    case "correct":
      return {
        label: "Corretto",
        icon: CheckCircle2,
        className:
          "border-emerald-300/18 bg-emerald-300/12 text-emerald-50",
      };
    default:
      return null;
  }
}

export function GuessTheNumberGame() {
  const [range, setRange] = useState<Range>({
    min: defaultMin,
    max: defaultMax,
  });
  const [draftRange, setDraftRange] = useState({
    min: String(defaultMin),
    max: String(defaultMax),
  });
  const [targetNumber, setTargetNumber] = useState(() =>
    createTargetNumber(defaultMin, defaultMax),
  );
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(
    `Inserisci un numero da ${defaultMin} a ${defaultMax}.`,
  );
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("default");
  const [lastGuess, setLastGuess] = useState<number | null>(null);
  const [guessDirection, setGuessDirection] = useState<GuessDirection>(null);
  const [guessHistory, setGuessHistory] = useState<GuessHistoryItem[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  function parseDraftRange(): RangeResult {
    const parsedMin = Number(draftRange.min);
    const parsedMax = Number(draftRange.max);

    if (!Number.isInteger(parsedMin) || !Number.isInteger(parsedMax)) {
      return { error: "Inserisci due numeri interi validi per il range." };
    }

    if (parsedMin >= parsedMax) {
      return { error: "Il valore minimo deve essere più piccolo del massimo." };
    }

    if (parsedMax - parsedMin > 10000) {
      return {
        error: "Scegli un intervallo più contenuto, massimo 10.000 numeri.",
      };
    }

    return { min: parsedMin, max: parsedMax };
  }

  function startGame(nextRange: Range, nextFeedback: string) {
    setRange(nextRange);
    setTargetNumber(createTargetNumber(nextRange.min, nextRange.max));
    setGuess("");
    setFeedback(nextFeedback);
    setFeedbackTone("default");
    setLastGuess(null);
    setGuessDirection(null);
    setGuessHistory([]);
    setAttempts(0);
    setHasWon(false);
  }

  function resetGame() {
    startGame(
      range,
      `Nuova partita. Il numero segreto è tra ${range.min} e ${range.max}.`,
    );
  }

  function applyRange() {
    const parsedRange = parseDraftRange();

    if ("error" in parsedRange) {
      setFeedback(parsedRange.error);
      setFeedbackTone("warning");
      setLastGuess(null);
      setGuessDirection(null);
      return;
    }

    setDraftRange({
      min: String(parsedRange.min),
      max: String(parsedRange.max),
    });
    startGame(
      parsedRange,
      `Range aggiornato. Il numero segreto è tra ${parsedRange.min} e ${parsedRange.max}.`,
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedGuess = Number(guess);

    if (
      !Number.isInteger(parsedGuess) ||
      parsedGuess < range.min ||
      parsedGuess > range.max
    ) {
      setFeedback(
        `Scegli un numero intero compreso tra ${range.min} e ${range.max}.`,
      );
      setFeedbackTone("warning");
      setLastGuess(null);
      setGuessDirection(null);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setLastGuess(parsedGuess);

    if (parsedGuess === targetNumber) {
      setFeedback(`Hai indovinato in ${nextAttempts} tentativ${nextAttempts === 1 ? "o" : "i"}!`);
      setFeedbackTone("success");
      setGuessDirection("correct");
      setGuessHistory((current) => [
        ...current,
        { value: parsedGuess, direction: "correct" },
      ]);
      setHasWon(true);
      return;
    }

    if (parsedGuess < targetNumber) {
      setFeedback("Il numero segreto è più alto.");
      setFeedbackTone("warning");
      setGuessDirection("higher");
      setGuessHistory((current) => [
        ...current,
        { value: parsedGuess, direction: "higher" },
      ]);
      return;
    }

    setFeedback("Il numero segreto è più basso.");
    setFeedbackTone("warning");
    setGuessDirection("lower");
    setGuessHistory((current) => [
      ...current,
      { value: parsedGuess, direction: "lower" },
    ]);
  }

  const directionMeta = getDirectionMeta(guessDirection);

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-amber-300/16 to-transparent" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
                Guess the number
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
                Indovina il numero segreto
              </h2>
              <p className="hidden max-w-xl text-sm leading-7 text-white/62 lg:block">
                Imposta il range che vuoi usare, poi prova a trovare il numero
                segreto seguendo gli indizi.
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-amber-200">
              {hasWon ? <Trophy className="size-5" /> : <Target className="size-5" />}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white/72">
                Il tuo tentativo
              </span>
              <Input
                type="number"
                inputMode="numeric"
                placeholder={`Es. ${Math.floor((range.min + range.max) / 2)}`}
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                disabled={hasWon}
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={hasWon}>
                Invia tentativo
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={<RotateCcw className="size-4" />}
                onClick={() => resetGame()}
              >
                Reset
              </Button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${feedback}-${feedbackTone}-${lastGuess ?? "none"}-${guessDirection ?? "none"}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`rounded-[24px] border p-4 ${feedbackToneClasses(feedbackTone)}`}
            >
              {lastGuess !== null ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-current/70">
                        Ultimo tentativo
                      </p>
                      <p className="font-heading mt-2 text-5xl font-semibold tracking-tight text-current">
                        {lastGuess}
                      </p>
                    </div>

                    {directionMeta ? (
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${directionMeta.className}`}
                      >
                        <directionMeta.icon className="size-4" />
                        <span>{directionMeta.label}</span>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-sm leading-7 text-current/88">{feedback}</p>
                </div>
              ) : (
                <p className="text-sm leading-7">{feedback}</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Storico tentativi
                </p>
                <p className="mt-2 hidden text-sm leading-6 text-white/58 sm:block">
                  Tieni traccia dei numeri gi{`\u00E0`} provati.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/68">
                {guessHistory.length}
              </div>
            </div>

            {guessHistory.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {guessHistory.map((item, index) => {
                  const meta = getDirectionMeta(item.direction);

                  if (!meta) {
                    return null;
                  }

                  const Icon = meta.icon;

                  return (
                    <div
                      key={`${item.value}-${index}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${meta.className}`}
                    >
                      <span className="font-heading text-base">{item.value}</span>
                      <Icon className="size-4" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-white/48">
                Nessun tentativo ancora registrato.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 self-start">
          <ResponsiveControlPanel
            title="Range"
            summary={`${range.min} - ${range.max}`}
            className="rounded-[24px]"
          >
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                applyRange();
              }}
            >
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={draftRange.min}
                  onChange={(event) =>
                    setDraftRange((current) => ({
                      ...current,
                      min: event.target.value,
                    }))
                  }
                  className="h-14 px-3 text-center font-heading text-2xl font-semibold"
                />
                <span className="text-center font-heading text-3xl font-semibold text-white/55">
                  -
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={draftRange.max}
                  onChange={(event) =>
                    setDraftRange((current) => ({
                      ...current,
                      max: event.target.value,
                    }))
                  }
                  className="h-14 px-3 text-center font-heading text-2xl font-semibold"
                />
              </div>

              <Button type="submit" variant="secondary" className="w-full">
                Applica range
              </Button>
            </form>
          </ResponsiveControlPanel>
          <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">
              Tentativi
            </p>
            <p className="font-heading mt-3 text-4xl font-semibold text-white">
              {attempts}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">
              Stato
            </p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              {hasWon ? "Vittoria sbloccata. Premi reset per giocare di nuovo." : "Partita in corso. Segui gli indizi."}
            </p>
          </div>

          <ResponsiveControlPanel
            title="Spiegazioni"
            summary="Come funziona"
            className="lg:hidden"
          >
            <div className="space-y-3 text-sm leading-7 text-white/62">
              <p>
                Imposta il range che vuoi usare, poi prova a trovare il numero
                seguendo gli indizi.
              </p>
              <p>
                Se il numero e piu alto o piu basso lo vedi subito nel feedback,
                mentre lo storico tiene traccia dei tentativi gia fatti.
              </p>
            </div>
          </ResponsiveControlPanel>
        </div>
      </div>
    </Card>
  );
}
