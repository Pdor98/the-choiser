"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Heart, Shuffle, Sparkles, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  mostLikelyNormal,
  mostLikelyQuestions,
  type MostLikelyMode,
} from "@/features/games/most-likely-data";

const modeOptions: Array<{
  value: MostLikelyMode;
  label: string;
  tone: string;
  icon: typeof Users;
  activeClassName: string;
}> = [
  {
    value: "normal",
    label: "Normale",
    tone: "Leggero",
    icon: Users,
    activeClassName:
      "border-cyan-200/30 bg-cyan-300/12 text-white shadow-[0_18px_44px_-30px_rgba(34,211,238,0.55)]",
  },
  {
    value: "spicy",
    label: "Piccante soft",
    tone: "Elegante",
    icon: Flame,
    activeClassName:
      "border-rose-200/30 bg-rose-300/12 text-white shadow-[0_18px_44px_-30px_rgba(251,113,133,0.55)]",
  },
  {
    value: "deep",
    label: "Deep",
    tone: "Personale",
    icon: Heart,
    activeClassName:
      "border-amber-200/30 bg-amber-300/12 text-white shadow-[0_18px_44px_-30px_rgba(251,191,36,0.45)]",
  },
];

function pickQuestion(pool: readonly string[], currentQuestion?: string) {
  if (pool.length === 0) {
    return "";
  }

  if (pool.length === 1) {
    return pool[0] ?? "";
  }

  let nextQuestion = currentQuestion ?? "";

  while (nextQuestion === currentQuestion) {
    nextQuestion = pool[Math.floor(Math.random() * pool.length)] ?? "";
  }

  return nextQuestion;
}

export function MostLikelyGame() {
  const [mode, setMode] = useState<MostLikelyMode>("normal");
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    mostLikelyNormal[0],
  );
  const [questionVersion, setQuestionVersion] = useState(1);

  const promptPool = mostLikelyQuestions[mode];
  const activeMode = modeOptions.find((option) => option.value === mode);
  const activeModeLabel = activeMode?.label ?? "Normale";

  function selectMode(nextMode: MostLikelyMode) {
    const nextPool = mostLikelyQuestions[nextMode];

    setMode(nextMode);
    setCurrentQuestion(pickQuestion(nextPool, currentQuestion));
    setQuestionVersion(1);
  }

  function revealNextQuestion() {
    setCurrentQuestion(pickQuestion(promptPool, currentQuestion));
    setQuestionVersion((current) => current + 1);
  }

  return (
    <Card className="relative overflow-hidden p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(110deg,rgba(34,211,238,0.14),rgba(251,113,133,0.1)_48%,rgba(251,191,36,0.08))]" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">
              Gioco sociale
            </p>
            <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
              Chi è più probabile che…?
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Scopri cosa pensa davvero il gruppo, una domanda alla volta.
            </p>
          </div>

          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
            <Users className="size-5" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/44">
            Modalità
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {modeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = mode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectMode(option.value)}
                  aria-pressed={isActive}
                  className={`min-h-16 rounded-[22px] border px-4 py-3 text-left transition duration-300 ${
                    isActive
                      ? option.activeClassName
                      : "border-white/10 bg-white/[0.05] text-white/70 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="mt-1 text-xs text-current opacity-62">
                        {option.tone}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_58%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,13,24,0.96))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
          <div className="flex min-h-[19rem] flex-col items-center justify-center gap-7 text-center sm:min-h-[22rem]">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/58">
              <Sparkles className="size-3.5 shrink-0 text-cyan-100/80" />
              <span className="truncate">
                {activeModeLabel} · {promptPool.length} domande
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${mode}-${questionVersion}-${currentQuestion}`}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.26, ease: "easeOut" }}
                className="mx-auto max-w-[24ch] break-words font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
              >
                {currentQuestion}
              </motion.p>
            </AnimatePresence>

            <Button
              type="button"
              icon={<Shuffle className="size-4" />}
              onClick={revealNextQuestion}
              className="w-full sm:w-auto"
            >
              Nuova domanda
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">
              Come si gioca
            </p>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Leggete la domanda, scegliete a voce la persona più adatta e poi
              passate alla domanda successiva.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">
              Ritmo
            </p>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Normale resta leggero, Piccante soft alza la tensione senza
              diventare esplicito, Deep porta il gruppo su risposte più
              personali.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
