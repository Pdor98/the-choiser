"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Flame,
  MessageCircle,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  truthOrDarePrompts,
  type TruthOrDareMode,
  type TruthOrDarePromptType,
} from "@/features/games/truth-or-dare-data";

function pickPrompt(pool: readonly string[], currentPrompt?: string | null) {
  if (!currentPrompt) {
    return pool[Math.floor(Math.random() * pool.length)] ?? "";
  }

  if (pool.length <= 1) {
    return pool[0] ?? "";
  }

  let nextPrompt = currentPrompt ?? "";

  while (nextPrompt === currentPrompt) {
    nextPrompt = pool[Math.floor(Math.random() * pool.length)] ?? "";
  }

  return nextPrompt;
}

const modeOptions: Array<{
  value: TruthOrDareMode;
  label: string;
  description: string;
}> = [
  {
    value: "normal",
    label: "Normale",
    description: "Prompt piu leggeri, sociali e adatti al gruppo.",
  },
  {
    value: "spicy",
    label: "Spicy 🔥",
    description: "Verita e obblighi piu audaci, sempre mischiati senza ordine fisso.",
  },
];

const promptTypeOptions: Array<{
  value: TruthOrDarePromptType;
  label: string;
  description: string;
}> = [
  {
    value: "truth",
    label: "Verita",
    description: "Domande dirette, sincere e piu personali.",
  },
  {
    value: "dare",
    label: "Obbligo",
    description: "Sfide rapide da fare sul momento.",
  },
];

export function TruthOrDareGame() {
  const [mode, setMode] = useState<TruthOrDareMode>("normal");
  const [promptType, setPromptType] = useState<TruthOrDarePromptType>("truth");
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [promptVersion, setPromptVersion] = useState(0);
  const [openPanel, setOpenPanel] = useState<"mode" | "type" | null>(null);
  const [spicyBannerVisible, setSpicyBannerVisible] = useState(false);

  const promptPool = truthOrDarePrompts[mode][promptType];
  const modeLabel = mode === "spicy" ? "Spicy 🔥" : "Normale";
  const promptTypeLabel = promptType === "truth" ? "Verita" : "Obbligo";
  const isSpicyLocked = mode === "spicy";

  const helperCopy = useMemo(() => {
    if (promptType === "truth") {
      return "Domande spontanee, profonde e giocabili per sbloccare la conversazione.";
    }

    return "Sfide divertenti e sociali da fare subito insieme, senza allungare troppo il turno.";
  }, [promptType]);

  function handleModeSelect(nextMode: TruthOrDareMode) {
    if (nextMode === "spicy") {
      setSpicyBannerVisible(true);
      setMode("spicy");
      setCurrentPrompt(null);
      setOpenPanel(null);
      return;
    }

    setSpicyBannerVisible(false);
    setMode("normal");
    setCurrentPrompt(null);
    setOpenPanel(null);
  }

  function revealPrompt() {
    if (isSpicyLocked || promptPool.length === 0) {
      return;
    }

    const nextPrompt = pickPrompt(promptPool, currentPrompt);
    setCurrentPrompt(nextPrompt);
    setPromptVersion((current) => current + 1);
    setOpenPanel(null);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-fuchsia-300/16 via-rose-300/8 to-transparent" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">
              Party prompt
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Obbligo o Verita 🔥
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              Un solo gioco, due scelte chiare. Decidi prima tra verita e
              obbligo, poi scegli la modalita disponibile per il turno.
            </p>
          </div>

          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-fuchsia-200">
            <MessageCircle className="size-5" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <div className="order-1 rounded-[28px] border border-white/10 bg-slate-950/62 p-5 lg:order-1 lg:p-6">
            <div className="flex min-h-[248px] items-center justify-center rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.11),transparent_62%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.78))] px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[280px] sm:px-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/52">
                  <Sparkles className="size-3.5 text-cyan-200/80" />
                  <span>
                    {modeLabel} · {promptTypeLabel}
                  </span>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${mode}-${promptType}-${promptVersion}-${currentPrompt ?? "placeholder"}`}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                    transition={{ duration: 0.26, ease: "easeOut" }}
                    className="mx-auto max-w-[20ch] text-balance font-heading text-[clamp(1.6rem,2.6vw,2.35rem)] font-semibold leading-[1.22] tracking-tight text-white"
                  >
                    {currentPrompt ??
                      (isSpicyLocked
                        ? "La modalita Spicy e in lavorazione. Torna presto per provarla."
                        : "Scegli modalita e tipo, poi premi Mostra domanda per far partire il turno.")}
                  </motion.p>
                </AnimatePresence>

                <p className="mx-auto max-w-xl text-sm leading-6 text-white/50">
                  {helperCopy}
                </p>
              </div>
            </div>
          </div>

          <div className="order-2 space-y-4 lg:order-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <div className="space-y-5">
                <div className="space-y-3 lg:hidden">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPanel((current) =>
                          current === "mode" ? null : "mode",
                        )
                      }
                      className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-left transition duration-300 hover:border-white/16 hover:bg-white/10"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                          Scelta
                        </p>
                        <p className="mt-1 text-base font-semibold text-white">
                          {promptTypeLabel}
                        </p>
                      </div>
                      <ChevronDown
                        className={`size-4 text-white/56 transition duration-300 ${
                          openPanel === "mode" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openPanel === "mode" ? (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="grid gap-3"
                        >
                          {promptTypeOptions.map((option) => {
                            const isActive = promptType === option.value;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setPromptType(option.value);
                                  setCurrentPrompt(null);
                                  setOpenPanel("type");
                                }}
                                className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
                                  isActive
                                    ? "border-cyan-200/28 bg-cyan-300/10 text-white shadow-[0_20px_45px_-28px_rgba(34,211,238,0.48)]"
                                    : "border-white/10 bg-white/6 text-white/68 hover:border-white/16 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <p className="text-base font-semibold">{option.label}</p>
                                <p className="mt-1 text-sm leading-6 opacity-75">
                                  {option.description}
                                </p>
                              </button>
                            );
                          })}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPanel((current) =>
                          current === "type" ? null : "type",
                        )
                      }
                      className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-left transition duration-300 hover:border-white/16 hover:bg-white/10"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                          Intensita
                        </p>
                        <p className="mt-1 text-base font-semibold text-white">
                          {modeLabel}
                        </p>
                      </div>
                      <ChevronDown
                        className={`size-4 text-white/56 transition duration-300 ${
                          openPanel === "type" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openPanel === "type" ? (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="grid gap-3"
                        >
                          {modeOptions.map((option) => {
                            const isActive = mode === option.value;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  handleModeSelect(option.value);
                                  setCurrentPrompt(null);
                                }}
                                className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
                                  isActive
                                    ? "border-fuchsia-200/28 bg-fuchsia-300/12 text-white shadow-[0_20px_45px_-28px_rgba(217,70,239,0.55)]"
                                    : "border-white/10 bg-white/6 text-white/68 hover:border-white/16 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <p className="text-base font-semibold">{option.label}</p>
                                <p className="mt-1 text-sm leading-6 opacity-75">
                                  {option.description}
                                </p>
                              </button>
                            );
                          })}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="hidden space-y-3 lg:block">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                      Scelta
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {promptTypeOptions.map((option) => {
                        const isActive = promptType === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setPromptType(option.value);
                              setCurrentPrompt(null);
                            }}
                            className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
                              isActive
                                ? "border-cyan-200/28 bg-cyan-300/10 text-white shadow-[0_20px_45px_-28px_rgba(34,211,238,0.48)]"
                                : "border-white/10 bg-white/6 text-white/68 hover:border-white/16 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <p className="text-base font-semibold">{option.label}</p>
                            <p className="mt-1 text-sm leading-6 opacity-75">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                      Intensita
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {modeOptions.map((option) => {
                        const isActive = mode === option.value;

                        return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                handleModeSelect(option.value);
                                setCurrentPrompt(null);
                              }}
                              className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
                                isActive
                                  ? "border-fuchsia-200/28 bg-fuchsia-300/12 text-white shadow-[0_20px_45px_-28px_rgba(217,70,239,0.55)]"
                                : "border-white/10 bg-white/6 text-white/68 hover:border-white/16 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <p className="text-base font-semibold">{option.label}</p>
                            <p className="mt-1 text-sm leading-6 opacity-75">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {spicyBannerVisible ? (
                  <div className="rounded-[22px] border border-amber-200/20 bg-amber-300/10 px-4 py-4 text-sm leading-6 text-amber-50">
                    <div className="flex items-start gap-3">
                      <Flame className="mt-0.5 size-4 shrink-0 text-amber-200/90" />
                      <p>Stiamo lavorando per offrirti una modalita Spicy fatta al meglio.</p>
                    </div>
                  </div>
                ) : null}

                <Button
                  type="button"
                  className="w-full"
                  icon={<Shuffle className="size-4" />}
                  onClick={revealPrompt}
                  disabled={isSpicyLocked}
                >
                  Mostra domanda
                </Button>

                <p className="text-xs leading-6 text-white/40">
                  Prompt pronti: {promptPool.length} per {modeLabel.toLowerCase()} ·{" "}
                  {promptTypeLabel.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
