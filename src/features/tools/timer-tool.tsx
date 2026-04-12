"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Hourglass,
  Pause,
  Play,
  RotateCcw,
  Timer,
  TimerReset,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";
import { timerPresets } from "@/lib/site-content";

type TimerViewMode = "classic" | "hourglass";

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: TimerViewMode;
  onChange: (mode: TimerViewMode) => void;
}) {
  const options: Array<{
    mode: TimerViewMode;
    label: string;
    icon: typeof Timer;
  }> = [
    { mode: "classic", label: "Timer classico", icon: Timer },
    { mode: "hourglass", label: "Clessidra", icon: Hourglass },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-white/46">
        Visualizzazione
      </p>
      <div className="grid gap-2 rounded-[24px] border border-white/10 bg-slate-950/62 p-2 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = option.mode === viewMode;
          const Icon = option.icon;

          return (
            <button
              key={option.mode}
              type="button"
              onClick={() => onChange(option.mode)}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                isActive
                  ? "border-emerald-300/45 bg-emerald-300/14 text-white shadow-[0_18px_40px_-28px_rgba(110,231,183,0.65)]"
                  : "border-white/10 bg-white/[0.045] text-white/72 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <Icon className="size-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ClassicTimerDisplay({
  timeLabel,
  selectedSeconds,
  progress,
}: {
  timeLabel: string;
  selectedSeconds: number;
  progress: number;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">
            Tempo rimanente
          </p>
          <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {timeLabel}
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
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/46">
        <span>Avanzamento</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

function HourglassDisplay({
  timeLabel,
  selectedSeconds,
  progress,
  isRunning,
  hasFinished,
}: {
  timeLabel: string;
  selectedSeconds: number;
  progress: number;
  isRunning: boolean;
  hasFinished: boolean;
}) {
  const topFill = `${Math.max((1 - progress) * 100, 0)}%`;
  const bottomFill = `${progress * 100}%`;
  const streamVisible = isRunning && !hasFinished && progress > 0 && progress < 1;

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-6">
      <div className="mx-auto flex max-w-[280px] flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">
            Modalità clessidra
          </p>
          <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {timeLabel}
          </p>
        </div>

        <motion.div
          className="relative h-[260px] w-[180px] sm:h-[300px] sm:w-[210px]"
          animate={
            streamVisible
              ? { y: [0, -2, 0], scale: [1, 1.01, 1] }
              : { y: 0, scale: 1 }
          }
          transition={
            streamVisible
              ? { duration: 1.2, ease: "easeInOut", repeat: Infinity }
              : { duration: 0.24 }
          }
        >
          <div className="absolute inset-x-1/2 top-0 h-4 w-28 -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/88 shadow-[0_12px_24px_-18px_rgba(0,0,0,0.8)]" />
          <div className="absolute inset-x-1/2 bottom-0 h-4 w-28 -translate-x-1/2 rounded-full border border-white/12 bg-slate-950/88 shadow-[0_-12px_24px_-18px_rgba(0,0,0,0.8)]" />

          <div className="absolute inset-x-1/2 top-4 h-[calc(100%-2rem)] w-2 -translate-x-1/2 rounded-full bg-white/10" />

          <div className="absolute left-1/2 top-5 h-[112px] w-[150px] -translate-x-1/2 overflow-hidden [clip-path:polygon(8%_0%,92%_0%,62%_100%,38%_100%)]">
            <div className="absolute inset-0 border border-white/14 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(59,130,246,0.08))]" />
            <motion.div
              className="absolute inset-x-[14%] bottom-0 rounded-t-[28px] bg-[linear-gradient(180deg,rgba(254,240,138,0.96),rgba(245,158,11,0.92))]"
              animate={{ height: topFill }}
              transition={{ duration: isRunning ? 0.22 : 0.28, ease: "easeOut" }}
            />
          </div>

          <div className="absolute left-1/2 bottom-5 h-[112px] w-[150px] -translate-x-1/2 overflow-hidden [clip-path:polygon(38%_0%,62%_0%,92%_100%,8%_100%)]">
            <div className="absolute inset-0 border border-white/14 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(59,130,246,0.08))]" />
            <motion.div
              className="absolute inset-x-[14%] bottom-0 rounded-b-[28px] bg-[linear-gradient(180deg,rgba(254,240,138,0.96),rgba(245,158,11,0.92))]"
              animate={{ height: bottomFill }}
              transition={{ duration: isRunning ? 0.22 : 0.28, ease: "easeOut" }}
            />
          </div>

          <div className="absolute left-1/2 top-[122px] h-[56px] w-1.5 -translate-x-1/2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="absolute inset-x-0 top-0 rounded-full bg-[linear-gradient(180deg,rgba(254,240,138,0.98),rgba(245,158,11,0.92))]"
              animate={{
                opacity: streamVisible ? 1 : 0,
                height: streamVisible ? ["15%", "100%", "35%"] : "0%",
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
                repeat: streamVisible ? Infinity : 0,
              }}
            />
          </div>
        </motion.div>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/46">
              Durata
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {selectedSeconds}s
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/46">
              Sabbia scesa
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {Math.round(progress * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimerTool() {
  const [selectedSeconds, setSelectedSeconds] = useState(60);
  const [remainingMs, setRemainingMs] = useState(60_000);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [viewMode, setViewMode] = useState<TimerViewMode>("classic");

  const audioContextRef = useRef<AudioContext | null>(null);
  const didPlayCompletionSoundRef = useRef(false);
  const endTimestampRef = useRef<number | null>(null);

  const selectedDurationMs = selectedSeconds * 1000;
  const remainingSeconds = remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  const timeLabel = formatTime(remainingSeconds);
  const progress = useMemo(
    () =>
      selectedDurationMs === 0
        ? 0
        : clamp(1 - remainingMs / selectedDurationMs, 0, 1),
    [remainingMs, selectedDurationMs],
  );

  const ensureAudioContext = useCallback(async () => {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextCtor =
      window.AudioContext ??
      (window as WindowWithWebkitAudio).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const playFinishSound = useCallback(() => {
    void ensureAudioContext()
      .then((context) => {
        if (!context) {
          return;
        }

        // Two short tones keep the notification clear without needing an audio file.
        const tones = [
          { frequency: 880, startOffset: 0, duration: 0.18 },
          { frequency: 1175, startOffset: 0.22, duration: 0.22 },
        ];

        tones.forEach((tone) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startTime = context.currentTime + tone.startOffset;
          const endTime = startTime + tone.duration;

          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(tone.frequency, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

          oscillator.connect(gain);
          gain.connect(context.destination);

          oscillator.start(startTime);
          oscillator.stop(endTime);
        });
      })
      .catch(() => {
        // Ignore audio failures silently so the timer UX never breaks.
      });
  }, [ensureAudioContext]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const tick = () => {
      if (!endTimestampRef.current) {
        return;
      }

      const nextRemaining = Math.max(endTimestampRef.current - performance.now(), 0);

      if (nextRemaining <= 0) {
        setRemainingMs(0);
        endTimestampRef.current = null;
        setIsRunning(false);
        setHasFinished(true);

        if (!didPlayCompletionSoundRef.current) {
          didPlayCompletionSoundRef.current = true;
          playFinishSound();
          window.navigator.vibrate?.(180);
        }

        return;
      }

      setRemainingMs(nextRemaining);
    };

    tick();
    const intervalId = window.setInterval(tick, 100);

    return () => window.clearInterval(intervalId);
  }, [isRunning, playFinishSound]);

  useEffect(() => {
    return () => {
      endTimestampRef.current = null;
      void audioContextRef.current?.close().catch(() => {
        // Ignore close failures on unsupported browsers.
      });
    };
  }, []);

  function startTimer() {
    const nextDuration =
      hasFinished || remainingMs <= 0 ? selectedDurationMs : remainingMs;

    didPlayCompletionSoundRef.current = false;
    setHasFinished(false);
    setRemainingMs(nextDuration);
    endTimestampRef.current = performance.now() + nextDuration;
    setIsRunning(true);

    void ensureAudioContext();
  }

  function pauseTimer() {
    if (!isRunning) {
      return;
    }

    const nextRemaining = endTimestampRef.current
      ? Math.max(endTimestampRef.current - performance.now(), 0)
      : remainingMs;

    endTimestampRef.current = null;
    setRemainingMs(nextRemaining);
    setIsRunning(false);
  }

  function resetTimer() {
    endTimestampRef.current = null;
    didPlayCompletionSoundRef.current = false;
    setIsRunning(false);
    setHasFinished(false);
    setRemainingMs(selectedDurationMs);
  }

  function handlePresetSelect(preset: number) {
    endTimestampRef.current = null;
    didPlayCompletionSoundRef.current = false;
    setSelectedSeconds(preset);
    setRemainingMs(preset * 1000);
    setIsRunning(false);
    setHasFinished(false);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-emerald-300/16 to-transparent" />
      <div className="relative grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="order-2 space-y-5 lg:order-1">
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
              Countdown con suono finale e vista clessidra
            </h2>
            <p className="text-sm leading-7 text-white/66">
              Scegli i secondi, imposta la visualizzazione che preferisci e
              lascia che il timer ti segnali la fine con un suono breve e chiaro.
            </p>
          </div>

          <ResponsiveControlPanel
            title="Impostazioni timer"
            summary={`${selectedSeconds}s · ${viewMode === "classic" ? "Timer classico" : "Clessidra"}`}
          >
            <div className="space-y-5">
              <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

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
                          : "border-white/10 bg-white/6 text-white/68 hover:bg-white/10 hover:text-white"
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

              <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100">
                    <Volume2 className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Suono finale attivo
                    </p>
                    <p className="text-sm leading-7 text-white/62">
                      Il suono viene generato via Web Audio API solo allo scadere del
                      timer e non parte durante pausa o reset.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveControlPanel>
        </div>

        <div className="order-1 space-y-5 lg:order-2">
          {viewMode === "classic" ? (
            <ClassicTimerDisplay
              timeLabel={timeLabel}
              selectedSeconds={selectedSeconds}
              progress={progress}
            />
          ) : (
            <HourglassDisplay
              timeLabel={timeLabel}
              selectedSeconds={selectedSeconds}
              progress={progress}
              isRunning={isRunning}
              hasFinished={hasFinished}
            />
          )}

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
                    hasFinished
                      ? "bg-emerald-300/12 text-emerald-100"
                      : "bg-white/8 text-white/64"
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
                      ? "Il timer è arrivato a zero, la clessidra si completa e parte il suono finale. Puoi riavviarlo subito o scegliere un nuovo preset."
                      : isRunning
                        ? viewMode === "hourglass"
                          ? "La clessidra resta sincronizzata in tempo reale con il countdown e si ferma insieme al timer quando metti in pausa."
                          : "Il countdown procede in tempo reale e il suono partirà solo al raggiungimento dello zero."
                        : "Scegli i secondi, passa da timer classico a clessidra quando vuoi e avvia il conto alla rovescia."}
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
