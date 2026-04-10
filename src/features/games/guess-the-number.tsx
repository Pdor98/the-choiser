"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Trophy, Target } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FeedbackTone = "default" | "warning" | "success";

function createTargetNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

function feedbackToneClasses(tone: FeedbackTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
    case "warning":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
    default:
      return "border-white/10 bg-white/6 text-white/72";
  }
}

export function GuessTheNumberGame() {
  const [targetNumber, setTargetNumber] = useState(createTargetNumber);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("Inserisci un numero da 1 a 10.");
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("default");
  const [attempts, setAttempts] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  function resetGame() {
    setTargetNumber(createTargetNumber());
    setGuess("");
    setFeedback("Nuova partita. Il numero segreto è cambiato.");
    setFeedbackTone("default");
    setAttempts(0);
    setHasWon(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedGuess = Number(guess);

    if (!Number.isInteger(parsedGuess) || parsedGuess < 1 || parsedGuess > 10) {
      setFeedback("Scegli un numero intero compreso tra 1 e 10.");
      setFeedbackTone("warning");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (parsedGuess === targetNumber) {
      setFeedback(`Hai indovinato in ${nextAttempts} tentativ${nextAttempts === 1 ? "o" : "i"}!`);
      setFeedbackTone("success");
      setHasWon(true);
      return;
    }

    if (parsedGuess < targetNumber) {
      setFeedback("Troppo basso. Prova con un numero più alto.");
      setFeedbackTone("warning");
      return;
    }

    setFeedback("Troppo alto. Prova con un numero più basso.");
    setFeedbackTone("warning");
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-amber-300/16 to-transparent" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
                Guess the number
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
                Indovina il numero segreto
              </h2>
              <p className="max-w-xl text-sm leading-7 text-white/62">
                Scegli un numero da 1 a 10, invialo e segui il feedback finché
                non lo centri.
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
                min={1}
                max={10}
                inputMode="numeric"
                placeholder="Es. 7"
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
                onClick={resetGame}
              >
                Reset
              </Button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${feedback}-${feedbackTone}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`rounded-[24px] border p-4 ${feedbackToneClasses(feedbackTone)}`}
            >
              <p className="text-sm leading-7">{feedback}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid gap-4 self-start">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">
              Range
            </p>
            <p className="font-heading mt-3 text-4xl font-semibold text-white">
              1-10
            </p>
          </div>
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
        </div>
      </div>
    </Card>
  );
}
