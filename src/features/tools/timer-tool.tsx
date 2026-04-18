"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
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

type TimerVisualState = "idle" | "running" | "warning" | "paused" | "finished";

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

function getTimerVisualState({
  isRunning,
  hasFinished,
  isPaused,
  isEnding,
}: {
  isRunning: boolean;
  hasFinished: boolean;
  isPaused: boolean;
  isEnding: boolean;
}): TimerVisualState {
  if (hasFinished) {
    return "finished";
  }

  if (isEnding) {
    return "warning";
  }

  if (isRunning) {
    return "running";
  }

  if (isPaused) {
    return "paused";
  }

  return "idle";
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
    icon: "timer" | "hourglass";
  }> = [
    { mode: "classic", label: "Timer classico", icon: "timer" },
    { mode: "hourglass", label: "Clessidra", icon: "hourglass" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.18em] text-white/46">
        Visualizzazione
      </p>
      <div className="grid gap-2 rounded-[24px] border border-white/10 bg-slate-950/62 p-2 sm:grid-cols-2">
        {options.map((option) => {
          const isActive = option.mode === viewMode;

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
              {option.icon === "hourglass" ? (
                <HourglassGlyph className="size-4" />
              ) : (
                <Timer className="size-4" />
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HourglassGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="hourglass-glyph-frame" x1="6" y1="2" x2="18" y2="22">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.92" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="hourglass-glyph-sand" x1="8.5" y1="6.5" x2="15.5" y2="17.5">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.94" />
        </linearGradient>
      </defs>
      <path
        d="M8.2 3.25h7.6c.9 0 1.45.74 1.45 1.42v.42c0 2.06-.76 3.88-2.2 5.23l-1.28 1.2 1.28 1.2c1.44 1.35 2.2 3.17 2.2 5.23v.42c0 .68-.55 1.42-1.45 1.42H8.2c-.9 0-1.45-.74-1.45-1.42v-.42c0-2.06.76-3.88 2.2-5.23l1.28-1.2-1.28-1.2c-1.44-1.35-2.2-3.17-2.2-5.23v-.42c0-.68.55-1.42 1.45-1.42Z"
        stroke="url(#hourglass-glyph-frame)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 6.1h5.6c-.1 1.39-.7 2.63-1.75 3.61L12 10.7l-1.05-.99C9.9 8.73 9.3 7.49 9.2 6.1Z"
        fill="url(#hourglass-glyph-sand)"
      />
      <path
        d="M12 12.55c.94.98 1.53 2.13 1.7 3.55H10.3c.17-1.42.76-2.57 1.7-3.55Z"
        fill="url(#hourglass-glyph-sand)"
      />
      <path
        d="M9.45 17.45h5.1"
        stroke="url(#hourglass-glyph-sand)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClassicTimerDisplay({
  timeLabel,
  selectedSeconds,
  progress,
  visualState,
}: {
  timeLabel: string;
  selectedSeconds: number;
  progress: number;
  visualState: TimerVisualState;
}) {
  const isWarning = visualState === "warning";
  const isFinished = visualState === "finished";
  const isPaused = visualState === "paused";

  return (
    <motion.div
      animate={
        isWarning
          ? {
              boxShadow: [
                "0 24px 58px -34px rgba(251,191,36,0.18)",
                "0 28px 70px -34px rgba(251,191,36,0.34)",
                "0 24px 58px -34px rgba(251,191,36,0.18)",
              ],
            }
          : isFinished
            ? {
                boxShadow: [
                  "0 28px 70px -36px rgba(244,63,94,0.24)",
                  "0 32px 86px -36px rgba(244,63,94,0.42)",
                  "0 28px 70px -36px rgba(244,63,94,0.24)",
                ],
              }
            : undefined
      }
      transition={
        isWarning || isFinished
          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.24 }
      }
      className={`rounded-[28px] border p-6 ${
        isFinished
          ? "border-rose-300/34 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.18),rgba(15,23,42,0.92)_68%)]"
          : isWarning
            ? "border-amber-300/34 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),rgba(15,23,42,0.92)_68%)]"
            : isPaused
              ? "border-violet-300/24 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.12),rgba(15,23,42,0.92)_70%)]"
              : "border-white/10 bg-slate-950/72"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">
            Tempo rimanente
          </p>
          <motion.p
            animate={
              isWarning
                ? { scale: [1, 1.025, 1], opacity: [1, 0.82, 1] }
                : isFinished
                  ? { scale: [1, 1.05, 1] }
                  : { scale: 1, opacity: 1 }
            }
            transition={
              isWarning
                ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                : isFinished
                  ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.24 }
            }
            className={`font-heading mt-3 text-5xl font-semibold tracking-tight sm:text-6xl ${
              isFinished
                ? "text-rose-50"
                : isWarning
                  ? "text-amber-50"
                  : isPaused
                    ? "text-violet-50"
                    : "text-white"
            }`}
          >
            {timeLabel}
          </motion.p>
        </div>
        <div className="space-y-2 text-right">
          <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-white/42">
              Durata
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {selectedSeconds}s
            </p>
          </div>
          <div
            className={`inline-flex items-center justify-end rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              isFinished
                ? "border-rose-300/28 bg-rose-300/14 text-rose-50"
                : isWarning
                  ? "border-amber-300/30 bg-amber-300/14 text-amber-50"
                  : isPaused
                    ? "border-violet-300/28 bg-violet-300/12 text-violet-100"
                    : visualState === "running"
                      ? "border-cyan-300/26 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/6 text-white/66"
            }`}
          >
            {isFinished
              ? "Tempo finito"
              : isWarning
                ? "Ultimi secondi"
                : isPaused
                  ? "In pausa"
                  : visualState === "running"
                    ? "In corso"
                    : "Pronto"}
          </div>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className={`h-full rounded-full ${
            isFinished
              ? "bg-gradient-to-r from-rose-300 via-rose-400 to-amber-200"
              : isWarning
                ? "bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300"
                : isPaused
                  ? "bg-gradient-to-r from-violet-300 via-cyan-300 to-white"
                  : "bg-gradient-to-r from-emerald-300 via-cyan-300 to-white"
          }`}
          animate={{
            width: `${progress * 100}%`,
            opacity: isWarning ? [0.9, 1, 0.9] : 1,
          }}
          transition={{
            width: { duration: 0.22, ease: "easeOut" },
            opacity: isWarning
              ? { duration: 0.85, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.24 },
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/46">
        <span>
          {isFinished
            ? "Countdown completato"
            : isWarning
              ? "Scadenza imminente"
              : "Avanzamento"}
        </span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </motion.div>
  );
}

function HourglassDisplay({
  timeLabel,
  selectedSeconds,
  progress,
  isRunning,
  hasFinished,
  visualState,
}: {
  timeLabel: string;
  selectedSeconds: number;
  progress: number;
  isRunning: boolean;
  hasFinished: boolean;
  visualState: TimerVisualState;
}) {
  const isWarning = visualState === "warning";
  const isFinished = visualState === "finished";
  const isPaused = visualState === "paused";

  return (
    <motion.div
      animate={
        isWarning
          ? {
              boxShadow: [
                "0 24px 58px -34px rgba(251,191,36,0.18)",
                "0 28px 70px -34px rgba(251,191,36,0.34)",
                "0 24px 58px -34px rgba(251,191,36,0.18)",
              ],
            }
          : isFinished
            ? {
                boxShadow: [
                  "0 28px 70px -36px rgba(244,63,94,0.24)",
                  "0 32px 86px -36px rgba(244,63,94,0.42)",
                  "0 28px 70px -36px rgba(244,63,94,0.24)",
                ],
              }
            : undefined
      }
      transition={
        isWarning || isFinished
          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.24 }
      }
      className={`rounded-[28px] border p-6 ${
        isFinished
          ? "border-rose-300/34 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.18),rgba(15,23,42,0.92)_68%)]"
          : isWarning
            ? "border-amber-300/34 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),rgba(15,23,42,0.92)_68%)]"
            : isPaused
              ? "border-violet-300/24 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.12),rgba(15,23,42,0.92)_70%)]"
              : "border-white/10 bg-slate-950/72"
      }`}
    >
      <div className="mx-auto flex max-w-[280px] flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">
            Modalità clessidra
          </p>
          <motion.p
            animate={
              isWarning
                ? { scale: [1, 1.025, 1], opacity: [1, 0.82, 1] }
                : isFinished
                  ? { scale: [1, 1.05, 1] }
                  : { scale: 1, opacity: 1 }
            }
            transition={
              isWarning
                ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                : isFinished
                  ? { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.24 }
            }
            className={`font-heading mt-3 text-5xl font-semibold tracking-tight sm:text-6xl ${
              isFinished
                ? "text-rose-50"
                : isWarning
                  ? "text-amber-50"
                  : isPaused
                    ? "text-violet-50"
                    : "text-white"
            }`}
          >
            {timeLabel}
          </motion.p>
          <div
            className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
              isFinished
                ? "border-rose-300/28 bg-rose-300/14 text-rose-50"
                : isWarning
                  ? "border-amber-300/30 bg-amber-300/14 text-amber-50"
                  : isPaused
                    ? "border-violet-300/28 bg-violet-300/12 text-violet-100"
                    : visualState === "running"
                      ? "border-cyan-300/26 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/6 text-white/66"
            }`}
          >
            {isFinished
              ? "Tempo finito"
              : isWarning
                ? "Ultimi secondi"
                : isPaused
                  ? "In pausa"
                  : visualState === "running"
                    ? "In corso"
                    : "Pronto"}
          </div>
        </div>

        <motion.div
          animate={
            isWarning
              ? { scale: [1, 1.02, 1] }
              : isFinished
                ? { scale: [1, 1.04, 1] }
                : { scale: 1 }
          }
          transition={
            isWarning || isFinished
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.24 }
          }
        >
          <HourglassIllustration
            progress={progress}
            isRunning={isRunning}
            hasFinished={hasFinished}
          />
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
    </motion.div>
  );
}

function HourglassIllustration({
  progress,
  isRunning,
  hasFinished,
}: {
  progress: number;
  isRunning: boolean;
  hasFinished: boolean;
}) {
  const normalizedProgress = clamp(progress, 0, 1);
  const topAmount = 1 - normalizedProgress;
  const bottomAmount = normalizedProgress;
  const streamVisible =
    isRunning && !hasFinished && normalizedProgress > 0 && normalizedProgress < 1;

  const topSurfaceY = 62 + normalizedProgress * 74;
  const bottomSurfaceY = 248 - normalizedProgress * 70;
  const topSurfaceCurve = Math.max(2.2, topAmount * 6.6);
  const bottomMound = Math.max(2, 7 + bottomAmount * 12);

  const topSandPath = `M95 146 H145 V ${topSurfaceY.toFixed(2)} C137 ${(topSurfaceY + topSurfaceCurve * 0.55).toFixed(2)} 128 ${(topSurfaceY + topSurfaceCurve).toFixed(2)} 120 ${(topSurfaceY + topSurfaceCurve).toFixed(2)} C112 ${(topSurfaceY + topSurfaceCurve).toFixed(2)} 103 ${(topSurfaceY + topSurfaceCurve * 0.55).toFixed(2)} 95 ${topSurfaceY.toFixed(2)} Z`;
  const bottomSandPath = `M95 250 H145 V ${bottomSurfaceY.toFixed(2)} C137 ${(bottomSurfaceY - bottomMound * 0.45).toFixed(2)} 129 ${(bottomSurfaceY - bottomMound).toFixed(2)} 120 ${(bottomSurfaceY - bottomMound).toFixed(2)} C111 ${(bottomSurfaceY - bottomMound).toFixed(2)} 103 ${(bottomSurfaceY - bottomMound * 0.45).toFixed(2)} 95 ${bottomSurfaceY.toFixed(2)} Z`;

  return (
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
      <svg
        viewBox="0 0 240 360"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="h-full w-full overflow-visible drop-shadow-[0_18px_36px_rgba(0,0,0,0.36)]"
      >
        <defs>
          <linearGradient id="hourglass-frame" x1="66" y1="18" x2="176" y2="342">
            <stop offset="0%" stopColor="#263a5b" stopOpacity="0.96" />
            <stop offset="50%" stopColor="#13233c" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#0a1222" stopOpacity="0.98" />
          </linearGradient>
          <radialGradient id="hourglass-halo" cx="50%" cy="50%" r="52%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#67e8f9" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hourglass-glass" x1="92" y1="42" x2="152" y2="272">
            <stop offset="0%" stopColor="#f8fdff" stopOpacity="0.18" />
            <stop offset="22%" stopColor="#dbeafe" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f8fdff" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="hourglass-glass-core" x1="120" y1="46" x2="120" y2="270">
            <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.06" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0.015" />
            <stop offset="100%" stopColor="#eff6ff" stopOpacity="0.045" />
          </linearGradient>
          <linearGradient id="hourglass-edge" x1="120" y1="44" x2="120" y2="270">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="hourglass-highlight" x1="96" y1="46" x2="116" y2="262">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.46" />
            <stop offset="28%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hourglass-highlight-right" x1="144" y1="64" x2="132" y2="258">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="32%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hourglass-sand" x1="94" y1="60" x2="146" y2="252">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.98" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.97" />
          </linearGradient>
          <linearGradient id="hourglass-sand-shine" x1="104" y1="74" x2="126" y2="236">
            <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#fff7d6" stopOpacity="0" />
          </linearGradient>
          <filter id="hourglass-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <path
            id="hourglass-glass-shape"
            d="M108 42H132C144 42 152 51 152 64C152 104 139 127 126 148L122.6 153C121.7 154.4 121.7 155.6 122.6 157L126 162C139 183 152 206 152 246C152 259 144 268 132 268H108C96 268 88 259 88 246C88 206 101 183 114 162L117.4 157C118.3 155.6 118.3 154.4 117.4 153L114 148C101 127 88 104 88 64C88 51 96 42 108 42Z"
          />
          <clipPath id="hourglass-top-clip">
            <path d="M95 64C95 99 106 122 120 145C134 122 145 99 145 64C145 57 140 52 133 52H107C100 52 95 57 95 64Z" />
          </clipPath>
          <clipPath id="hourglass-bottom-clip">
            <path d="M120 169C106 188 95 212 95 246C95 253 100 258 107 258H133C140 258 145 253 145 246C145 212 134 188 120 169Z" />
          </clipPath>
        </defs>

        <ellipse
          cx="120"
          cy="182"
          rx="78"
          ry="108"
          fill="url(#hourglass-halo)"
          filter="url(#hourglass-soft-glow)"
        />

        <path
          d="M70 26C83 19 99 17 120 17C141 17 157 19 170 26L165 36C154 31 140 29 120 29C100 29 86 31 75 36Z"
          fill="url(#hourglass-frame)"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1.1"
        />
        <path
          d="M75 324C86 329 100 331 120 331C140 331 154 329 165 324L170 336C157 343 141 345 120 345C99 345 83 343 70 336Z"
          fill="url(#hourglass-frame)"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1.1"
        />
        <path
          d="M78 36C83 78 86 126 86 180C86 232 83 282 78 324"
          fill="none"
          stroke="url(#hourglass-frame)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M162 36C157 78 154 126 154 180C154 232 157 282 162 324"
          fill="none"
          stroke="url(#hourglass-frame)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <use href="#hourglass-glass-shape" fill="url(#hourglass-glass)" />
        <use href="#hourglass-glass-shape" fill="url(#hourglass-glass-core)" />

        {topAmount > 0.015 ? (
          <g clipPath="url(#hourglass-top-clip)">
            <path d={topSandPath} fill="url(#hourglass-sand)" />
            <path d={topSandPath} fill="url(#hourglass-sand-shine)" opacity="0.55" />
          </g>
        ) : null}

        {bottomAmount > 0.015 ? (
          <g clipPath="url(#hourglass-bottom-clip)">
            <path d={bottomSandPath} fill="url(#hourglass-sand)" />
            <path
              d={bottomSandPath}
              fill="url(#hourglass-sand-shine)"
              opacity="0.42"
            />
          </g>
        ) : null}

        {streamVisible ? (
          <>
            <motion.path
              d="M120 148C120 154 119.5 160 120 167C120.5 174 120 180 120 185"
              stroke="url(#hourglass-sand)"
              strokeWidth="2.6"
              strokeLinecap="round"
              animate={{ opacity: [0.3, 0.9, 0.45] }}
              transition={{
                duration: 0.62,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            {[0, 1, 2, 3].map((grain) => (
              <motion.circle
                key={grain}
                cx={120 + (grain - 1.5) * 1.6}
                cy={152}
                r={grain === 1 || grain === 2 ? 1.55 : 1.1}
                fill="#fde68a"
                animate={{
                  cy: [151, 165, 180],
                  opacity: [0, 0.92, 0],
                }}
                transition={{
                  duration: 0.78,
                  ease: "linear",
                  repeat: Infinity,
                  delay: grain * 0.13,
                }}
              />
            ))}
          </>
        ) : null}

        <path
          d="M95 64C95 99 106 122 120 145C134 122 145 99 145 64C145 57 140 52 133 52H107C100 52 95 57 95 64Z"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.1"
        />
        <path
          d="M120 169C106 188 95 212 95 246C95 253 100 258 107 258H133C140 258 145 253 145 246C145 212 134 188 120 169Z"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.1"
        />
        <path
          d="M116 147L118.7 151.2C119.6 152.5 119.6 153.8 118.7 155.3L116 159"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M124 147L121.3 151.2C120.4 152.5 120.4 153.8 121.3 155.3L124 159"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          d="M99 56C94 78 96 106 109 132C114 143 117 147 119 149"
          fill="none"
          stroke="url(#hourglass-highlight)"
          strokeWidth="4.8"
          strokeLinecap="round"
        />
        <path
          d="M142 72C141 98 138 115 132 132C128 142 125 146 123 149"
          fill="none"
          stroke="url(#hourglass-highlight-right)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <use
          href="#hourglass-glass-shape"
          fill="none"
          stroke="url(#hourglass-edge)"
          strokeWidth="2.1"
        />
      </svg>
    </motion.div>
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
  const warningThresholdMs = Math.min(
    10_000,
    Math.max(5_000, Math.round(selectedDurationMs * 0.18)),
  );
  const isPaused =
    !isRunning && !hasFinished && remainingMs > 0 && remainingMs < selectedDurationMs;
  const isEnding =
    isRunning && remainingMs > 0 && remainingMs <= warningThresholdMs;
  const visualState = getTimerVisualState({
    isRunning,
    hasFinished,
    isPaused,
    isEnding,
  });
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

        // A short three-note chime keeps the notification clear without feeling harsh.
        const tones = [
          {
            frequency: 784,
            startOffset: 0,
            duration: 0.18,
            gain: 0.11,
            type: "sine",
          },
          {
            frequency: 1046.5,
            startOffset: 0.15,
            duration: 0.24,
            gain: 0.14,
            type: "triangle",
          },
          {
            frequency: 1318.5,
            startOffset: 0.32,
            duration: 0.28,
            gain: 0.1,
            type: "sine",
          },
        ];

        tones.forEach((tone) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const startTime = context.currentTime + tone.startOffset;
          const endTime = startTime + tone.duration;

          oscillator.type = tone.type as OscillatorType;
          oscillator.frequency.setValueAtTime(tone.frequency, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(tone.gain, startTime + 0.02);
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
          window.navigator.vibrate?.([110, 60, 150]);
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
            </div>
          </ResponsiveControlPanel>
        </div>

        <div className="order-1 space-y-5 lg:order-2">
          {viewMode === "classic" ? (
            <ClassicTimerDisplay
              timeLabel={timeLabel}
              selectedSeconds={selectedSeconds}
              progress={progress}
              visualState={visualState}
            />
          ) : (
            <HourglassDisplay
              timeLabel={timeLabel}
              selectedSeconds={selectedSeconds}
              progress={progress}
              isRunning={isRunning}
              hasFinished={hasFinished}
              visualState={visualState}
            />
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              icon={<Play className="size-4" />}
              onClick={startTimer}
              disabled={isRunning}
              className="w-full"
            >
              {hasFinished ? "Ricomincia" : isPaused ? "Riprendi" : "Avvia"}
            </Button>
            <Button
              variant="secondary"
              icon={<Pause className="size-4" />}
              onClick={pauseTimer}
              disabled={!isRunning}
              className="w-full"
            >
              Pausa
            </Button>
            <Button
              variant="secondary"
              icon={<RotateCcw className="size-4" />}
              onClick={resetTimer}
              className="w-full"
            >
              Reset
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={visualState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className={`rounded-[24px] border p-4 ${
                hasFinished
                  ? "border-rose-300/28 bg-rose-300/10"
                  : isEnding
                    ? "border-amber-300/24 bg-amber-300/10"
                    : isPaused
                      ? "border-violet-300/20 bg-violet-300/8"
                      : isRunning
                        ? "border-cyan-300/18 bg-cyan-300/[0.08]"
                        : "border-white/10 bg-white/6"
              }`}
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-10 items-center justify-center rounded-2xl ${
                    hasFinished
                      ? "bg-rose-300/12 text-rose-100"
                      : isEnding
                        ? "bg-amber-300/12 text-amber-100"
                        : isPaused
                          ? "bg-violet-300/12 text-violet-100"
                          : isRunning
                            ? "bg-cyan-300/12 text-cyan-100"
                            : "bg-white/8 text-white/64"
                  }`}
                >
                  <BellRing className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {hasFinished
                      ? "Tempo scaduto"
                      : isEnding
                        ? `Ultimi ${Math.max(remainingSeconds, 1)} secondi`
                        : isRunning
                          ? "Countdown in corso"
                          : isPaused
                            ? "Timer in pausa"
                            : "Pronto a partire"}
                  </p>
                  <p className="text-sm leading-7 text-white/62">
                    {hasFinished
                      ? "Il timer è arrivato a zero. Il suono finale parte subito e puoi ricominciare con un tocco."
                      : isEnding
                        ? "Il countdown entra nella fase finale: il display si scalda e l'urgenza cresce in modo graduale."
                        : isRunning
                          ? viewMode === "hourglass"
                            ? "La clessidra resta sincronizzata in tempo reale con il countdown e continua a scorrere finché non metti in pausa."
                            : "Il countdown procede in tempo reale e diventa più evidente man mano che si avvicina allo zero."
                          : isPaused
                            ? "Il tempo è congelato esattamente dove ti sei fermato. Puoi riprendere subito oppure resettare."
                            : "Scegli i secondi, passa da timer classico a clessidra quando vuoi e avvia il conto alla rovescia."}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">
                    {hasFinished
                      ? "Stato finale"
                      : isEnding
                        ? "Avviso progressivo attivo"
                        : isPaused
                          ? "Sessione sospesa"
                          : isRunning
                            ? "Sessione attiva"
                            : "In attesa"}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <ResponsiveControlPanel
            title="Spiegazioni"
            summary="Come funziona il timer"
          >
            <div className="space-y-3 text-sm leading-7 text-white/62">
              <p>
                Scegli i secondi, imposta la visualizzazione che preferisci e
                avvia subito il countdown.
              </p>
              <div className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-100">
                  <Volume2 className="size-4" />
                </div>
                <p className="text-sm leading-7 text-white/62">
                  Il suono finale parte solo allo scadere del timer e non viene
                  attivato durante pausa o reset. Negli ultimi secondi il timer
                  aggiunge un feedback visivo progressivo per segnalare che il
                  tempo sta finendo.
                </p>
              </div>
            </div>
          </ResponsiveControlPanel>
        </div>
      </div>
    </Card>
  );
}
