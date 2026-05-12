"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
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
  available: boolean;
  badge?: string;
}> = [
  {
    value: "normal",
    label: "Normale",
    description: "Prompt più leggeri, sociali e adatti al gruppo.",
    available: true,
  },
  {
    value: "spicy",
    label: "Piccante 🔥",
    description: "Più audace e diretto. Tornerà disponibile in una fase successiva.",
    available: false,
    badge: "Presto",
  },
];

const promptTypeOptions: Array<{
  value: TruthOrDarePromptType;
  label: string;
  description: string;
}> = [
  {
    value: "truth",
    label: "Verità",
    description: "Domande dirette, sincere e più personali.",
  },
  {
    value: "dare",
    label: "Obbligo",
    description: "Sfide rapide da fare sul momento.",
  },
];

function SelectionGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
  accent = "cyan",
}: {
  label: string;
  options: Array<{
    value: T;
    label: string;
    description: string;
    available?: boolean;
    badge?: string;
  }>;
  value: T;
  onSelect: (nextValue: T, isAvailable: boolean) => void;
  accent?: "cyan" | "fuchsia";
}) {
  const activeClassName =
    accent === "fuchsia"
      ? "border-fuchsia-200/28 bg-fuchsia-300/12 text-white shadow-[0_20px_45px_-28px_rgba(217,70,239,0.55)]"
      : "border-cyan-200/28 bg-cyan-300/10 text-white shadow-[0_20px_45px_-28px_rgba(34,211,238,0.48)]";

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/42">
        {label}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {options.map((option) => {
          const isActive = value === option.value;
          const isAvailable = option.available ?? true;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value, isAvailable)}
              aria-pressed={isActive}
              className={`rounded-[22px] border px-4 py-4 text-left transition duration-300 ${
                isActive
                  ? activeClassName
                  : "border-white/10 bg-white/6 text-white/68 hover:border-white/16 hover:bg-white/10 hover:text-white"
              } ${!isAvailable ? "opacity-82" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold">{option.label}</p>
                {option.badge ? (
                  <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/62">
                    {option.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-6 opacity-75">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TruthOrDareGame() {
  const [mode, setMode] = useState<TruthOrDareMode>("normal");
  const [promptType, setPromptType] = useState<TruthOrDarePromptType>("truth");
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [promptVersion, setPromptVersion] = useState(0);
  const [spicyBannerVisible, setSpicyBannerVisible] = useState(false);

  const promptPool = truthOrDarePrompts[mode][promptType];
  const modeLabel = mode === "spicy" ? "Piccante 🔥" : "Normale";
  const promptTypeLabel = promptType === "truth" ? "Verità" : "Obbligo";

  const helperCopy = useMemo(() => {
    if (promptType === "truth") {
      return "Domande spontanee, profonde e giocabili per sbloccare la conversazione.";
    }

    return "Sfide divertenti e sociali da fare subito insieme, senza allungare troppo il turno.";
  }, [promptType]);

  function handleModeSelect(nextMode: TruthOrDareMode) {
    if (nextMode === "spicy") {
      setSpicyBannerVisible(true);
      return;
    }

    setSpicyBannerVisible(false);
    setMode("normal");
    setCurrentPrompt(null);
  }

  function revealPrompt() {
    if (promptPool.length === 0) {
      return;
    }

    const nextPrompt = pickPrompt(promptPool, currentPrompt);
    setCurrentPrompt(nextPrompt);
    setPromptVersion((current) => current + 1);
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-fuchsia-300/16 via-rose-300/8 to-transparent" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">
              Gioco party
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Obbligo o Verità 🔥
            </h2>
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
                      "Scegli verità o obbligo, imposta il tono del turno e poi tocca Nuova domanda."}
                  </motion.p>
                </AnimatePresence>

              </div>
            </div>
          </div>

          <div className="order-2 space-y-4 lg:order-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5">
              <div className="space-y-5">
                <SelectionGroup
                  label="Scelta"
                  options={promptTypeOptions}
                  value={promptType}
                  onSelect={(nextType) => {
                    setPromptType(nextType);
                    setCurrentPrompt(null);
                  }}
                />

                <SelectionGroup
                  label="Intensità"
                  options={modeOptions}
                  value={mode}
                  accent="fuchsia"
                  onSelect={(nextMode, isAvailable) => {
                    if (!isAvailable) {
                      setSpicyBannerVisible(true);
                      return;
                    }

                    handleModeSelect(nextMode);
                  }}
                />

                {spicyBannerVisible ? (
                  <div className="rounded-[22px] border border-amber-200/20 bg-amber-300/10 px-4 py-4 text-sm leading-6 text-amber-50">
                    <div className="flex items-start gap-3">
                      <Flame className="mt-0.5 size-4 shrink-0 text-amber-200/90" />
                      <p>La modalità Piccante arriverà più avanti. Per ora puoi continuare a usare la modalità Normale senza interrompere il turno.</p>
                    </div>
                  </div>
                ) : null}

                <Button
                  type="button"
                  className="w-full"
                  icon={<Shuffle className="size-4" />}
                  onClick={revealPrompt}
                >
                  Nuova domanda
                </Button>

                <p className="text-xs leading-6 text-white/40">
                  Prompt pronti: {promptPool.length} per {modeLabel.toLowerCase()} ·{" "}
                  {promptTypeLabel.toLowerCase()}.
                </p>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                    Come funziona
                  </p>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-white/62">
                    <p>
                      Scegli prima tra verità e obbligo, poi imposta la
                      modalità disponibile per il turno.
                    </p>
                    <p>{helperCopy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
