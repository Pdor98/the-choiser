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
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Visualizzazione
      </p>
      <div className="grid gap-2 rounded-[24px] border border-slate-200/80 bg-white/72 p-2 sm:grid-cols-2">
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
                  ? "border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(223,244,255,0.96)_55%,rgba(186,230,253,0.92))] text-slate-900 shadow-[0_18px_40px_-28px_rgba(96,165,250,0.32)]"
                  : "border-slate-200/70 bg-white/72 text-slate-700 hover:border-sky-200/80 hover:bg-white hover:text-slate-900"
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
    <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,255,0.94))] p-6 shadow-[0_24px_60px_-38px_rgba(59,130,246,0.18)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Tempo rimanente
          </p>
          <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            {timeLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200/70 bg-white/84 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Durata
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {selectedSeconds}s
          </p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500">
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
    <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,248,255,0.94))] p-6 shadow-[0_24px_60px_-38px_rgba(59,130,246,0.18)]">
      <div className="mx-auto flex max-w-[280px] flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Modalità clessidra
          </p>
          <p className="font-heading mt-3 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
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
          <div className="absolute inset-x-1/2 top-0 h-4 w-28 -translate-x-1/2 rounded-full border border-slate-300 bg-white shadow-[0_12px_24px_-18px_rgba(148,163,184,0.65)]" />
          <div className="absolute inset-x-1/2 bottom-0 h-4 w-28 -translate-x-1/2 rounded-full border border-slate-300 bg-white shadow-[0_-12px_24px_-18px_rgba(148,163,184,0.45)]" />

          <div className="absolute inset-x-1/2 top-4 h-[calc(100%-2rem)] w-2 -translate-x-1/2 rounded-full bg-slate-200" />

          <div className="absolute left-1/2 top-5 h-[112px] w-[150px] -translate-x-1/2 overflow-hidden [clip-path:polygon(8%_0%,92%_0%,62%_100%,38%_100%)]">
            <div className="absolute inset-0 border border-slate-300 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(224,235,248,0.9))]" />
            <motion.div
              className="absolute inset-x-[14%] bottom-0 rounded-t-[28px] bg-[linear-gradient(180deg,rgba(216,242,255,0.96),rgba(96,165,250,0.92))]"
              animate={{ height: topFill }}
              transition={{ duration: isRunning ? 0.22 : 0.28, ease: "easeOut" }}
            />
          </div>

          <div className="absolute left-1/2 bottom-5 h-[112px] w-[150px] -translate-x-1/2 overflow-hidden [clip-path:polygon(38%_0%,62%_0%,92%_100%,8%_100%)]">
            <div className="absolute inset-0 border border-slate-300 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(224,235,248,0.9))]" />
            <motion.div
              className="absolute inset-x-[14%] bottom-0 rounded-b-[28px] bg-[linear-gradient(180deg,rgba(216,242,255,0.96),rgba(96,165,250,0.92))]"
              animate={{ height: bottomFill }}
              transition={{ duration: isRunning ? 0.22 : 0.28, ease: "easeOut" }}
            />
          </div>

          <div className="absolute left-1/2 top-[122px] h-[56px] w-1.5 -translate-x-1/2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="absolute inset-x-0 top-0 rounded-full bg-[linear-gradient(180deg,rgba(216,242,255,0.98),rgba(96,165,250,0.92))]"
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
          <div className="rounded-2xl border border-slate-200/80 bg-white/78 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Durata
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {selectedSeconds}s
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/78 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Sabbia scesa
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
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
    <Card className="relative overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(242,247,255,0.9))] p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-sky-200/85 via-indigo-100/45 to-transparent" />
      <div className="relative grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl border border-sky-200/80 bg-white/82 p-3 text-sky-700">
              <TimerReset className="size-5" />
            </div>
            <span className="rounded-full border border-slate-200/80 bg-white/72 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              Utility deck
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-sky-700/72">
              Timer tool
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
              Countdown con suono finale e vista clessidra
            </h2>
            <p className="text-sm leading-7 text-slate-700">
              Scegli i secondi, imposta la visualizzazione che preferisci e
              lascia che il timer ti segnali la fine con un suono breve e chiaro.
            </p>
          </div>

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
                      ? "border-sky-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(223,244,255,0.92))] text-slate-900"
                      : "border-slate-200/80 bg-white/78 text-slate-700 hover:bg-white hover:text-slate-900"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">
                    Preset
                  </span>
                  <span className="mt-2 block font-heading text-xl font-semibold">
                    {preset}s
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white/78 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Volume2 className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Suono finale attivo
                </p>
                <p className="text-sm leading-7 text-slate-700">
                  Il suono viene generato via Web Audio API solo allo scadere del
                  timer e non parte durante pausa o reset.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
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
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200/80 bg-white/76"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-10 items-center justify-center rounded-2xl ${
                    hasFinished
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <BellRing className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {hasFinished
                      ? "Tempo scaduto"
                      : isRunning
                        ? "Countdown in corso"
                        : "Pronto a partire"}
                  </p>
                  <p className="text-sm leading-7 text-slate-700">
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
