"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { timerPresets } from "@/lib/site-content";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function TimerTool() {
  const [selectedSeconds, setSelectedSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          setHasFinished(true);
          window.navigator.vibrate?.(180);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isRunning, timeLeft]);

  const progress =
    selectedSeconds === 0 ? 0 : Math.max((timeLeft / selectedSeconds) * 100, 0);

  function startTimer() {
    if (hasFinished || timeLeft <= 0) {
      setTimeLeft(selectedSeconds);
    }

    setHasFinished(false);
    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    setHasFinished(false);
    setTimeLeft(selectedSeconds);
  }

  function handlePresetSelect(preset: number) {
    setSelectedSeconds(preset);
    setTimeLeft(preset);
    setHasFinished(false);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-300/16 to-transparent" />
      <div className="relative grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-emerald-200">
              <TimerReset className="size-5" />
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/46">
              Focus mode
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
              Timer tool
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Countdown semplice, pulito e immediato
            </h2>
            <p className="text-sm leading-7 text-white/62">
              Seleziona la durata, avvia il countdown e lascia che Choiser ti
              segnali la fine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {timerPresets.map((preset) => {
              const isSelected = preset === selectedSeconds;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  disabled={isRunning}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition duration-300 ${
                    isSelected
                      ? "border-emerald-300/50 bg-emerald-300/12 text-white"
                      : "border-white/10 bg-white/6 text-white/64 hover:bg-white/10 hover:text-white"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span className="block text-xs uppercase tracking-[0.16em] text-white/40">
                    Preset
                  </span>
                  <span className="mt-2 block font-heading text-xl font-semibold">
                    {preset}s
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Tempo rimanente
                </p>
                <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-white/42">
                  Durata
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedSeconds}s
                </p>
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              icon={<Play className="size-4" />}
              onClick={startTimer}
              disabled={isRunning}
            >
              Start
            </Button>
            <Button
              variant="secondary"
              icon={<Pause className="size-4" />}
              onClick={pauseTimer}
              disabled={!isRunning}
            >
              Pause
            </Button>
            <Button
              variant="secondary"
              icon={<RotateCcw className="size-4" />}
              onClick={resetTimer}
            >
              Reset
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={hasFinished ? "done" : isRunning ? "running" : "idle"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`rounded-[24px] border p-4 ${
                hasFinished
                  ? "border-emerald-300/20 bg-emerald-300/10"
                  : "border-white/10 bg-white/6"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-10 items-center justify-center rounded-2xl ${
                    hasFinished ? "bg-emerald-300/12 text-emerald-100" : "bg-white/8 text-white/64"
                  }`}
                >
                  <BellRing className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {hasFinished
                      ? "Tempo scaduto"
                      : isRunning
                        ? "Countdown in corso"
                        : "Pronto a partire"}
                  </p>
                  <p className="text-sm leading-7 text-white/62">
                    {hasFinished
                      ? "Il timer è arrivato a zero. Puoi riavviarlo subito o selezionare una nuova durata."
                      : isRunning
                        ? "Lascia aperta la scheda oppure metti l'app a lato mentre il conto alla rovescia procede."
                        : "Scegli i secondi che ti servono e avvia il conto alla rovescia quando vuoi."}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
