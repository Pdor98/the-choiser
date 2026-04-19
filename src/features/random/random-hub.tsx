"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dice5, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instantAnswers, randomActivities } from "@/lib/site-content";

function getDayIndex() {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor((today - start) / oneDay);
}

function getNextRandomItem(items: string[], previous?: string) {
  if (items.length === 1) {
    return items[0];
  }

  let nextItem = items[Math.floor(Math.random() * items.length)];

  if (!previous) {
    return nextItem;
  }

  while (nextItem === previous) {
    nextItem = items[Math.floor(Math.random() * items.length)];
  }

  return nextItem;
}

function getTodayPrompt(previous?: string) {
  const dailyPrompt = randomActivities[getDayIndex() % randomActivities.length];

  if (!previous) {
    return dailyPrompt;
  }

  if (dailyPrompt !== previous) {
    return dailyPrompt;
  }

  return getNextRandomItem(randomActivities, previous);
}

function getInstantAnswer(previous?: string) {
  return getNextRandomItem(instantAnswers, previous);
}

function getDailyInstantAnswer() {
  return instantAnswers[getDayIndex() % instantAnswers.length];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const INSTANT_ANSWER_STORAGE_KEY = "choiser-random-instant-answer";

function ResponseViewport({
  value,
  emptyText,
}: {
  value: string | null;
  emptyText: string;
}) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,31,53,0.9),rgba(11,22,39,0.9))] px-3.5 py-4 text-sm text-slate-300 sm:mt-7 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[5.5rem] w-40 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

      <div className="relative flex min-h-[132px] items-center justify-center sm:min-h-[148px] lg:min-h-[164px]">
        <div className="w-full max-w-[14.5rem] rounded-[22px] border border-white/8 bg-white/[0.045] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:max-w-[16.5rem] sm:px-5 sm:py-5 lg:max-w-[18rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value ?? "idle"}
              initial={{ opacity: 0, y: 10, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="flex h-[92px] items-center justify-center sm:h-[104px] lg:h-[112px]"
            >
              <p className="mx-auto max-w-full text-balance break-words font-heading text-[clamp(1rem,0.9rem+0.8vw,1.35rem)] font-semibold leading-[1.38] text-slate-100">
                {value ?? emptyText}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RandomModuleHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex min-h-[7.75rem] flex-col text-center sm:min-h-[8.25rem] lg:min-h-[8.75rem]">
      <div className="mx-auto flex size-12 items-center justify-center rounded-[20px] border border-cyan-300/16 bg-white/6 p-3 text-cyan-200 shadow-[0_18px_42px_-30px_rgba(56,189,248,0.24)]">
        {icon}
      </div>

      <div className="mt-4 flex flex-1 flex-col space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
          {eyebrow}
        </p>
        <h2 className="font-heading text-[clamp(1.55rem,1.1rem+1vw,1.85rem)] font-semibold tracking-tight text-slate-50">
          {title}
        </h2>
      </div>
    </div>
  );
}

function RandomPrimaryCard({
  icon,
  eyebrow,
  title,
  description,
  children,
  buttonLabel,
  buttonIcon,
  onAction,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  buttonLabel: string;
  buttonIcon: ReactNode;
  onAction: () => void;
}) {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.94),rgba(14,28,48,0.9))] p-4 sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-200/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/26 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-300/14 blur-3xl" />

      <div className="relative flex h-full flex-col">
        <RandomModuleHeader
          icon={icon}
          eyebrow={eyebrow}
          title={title}
        />

        <div className="flex-1">{children}</div>

        <Button icon={buttonIcon} onClick={onAction} className="mt-6 w-full">
          {buttonLabel}
        </Button>

        <p className="mt-4 text-center text-sm leading-7 text-slate-300/88">
          {description}
        </p>
      </div>
    </Card>
  );
}

export function RandomHub() {
  const [todayPrompt, setTodayPrompt] = useState(() => getTodayPrompt());
  const [instantAnswer, setInstantAnswer] = useState(() => getDailyInstantAnswer());
  const [number, setNumber] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedAnswer = window.localStorage.getItem(
        INSTANT_ANSWER_STORAGE_KEY,
      );

      if (storedAnswer && instantAnswers.includes(storedAnswer)) {
        const frameId = window.requestAnimationFrame(() => {
          setInstantAnswer(storedAnswer);
        });

        return () => window.cancelAnimationFrame(frameId);
      }
    } catch {
      // Ignore localStorage issues and keep the daily fallback.
    }
  }, []);

  function handleInstantAnswer() {
    const nextAnswer = getInstantAnswer(instantAnswer ?? undefined);
    setInstantAnswer(nextAnswer);

    try {
      window.localStorage.setItem(INSTANT_ANSWER_STORAGE_KEY, nextAnswer);
    } catch {
      // Ignore storage issues and keep the in-memory value.
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 min-[1120px]:grid-cols-2 xl:gap-6">
        <RandomPrimaryCard
          icon={<Wand2 className="size-6" />}
          eyebrow="Today prompt"
          title="Cosa fare oggi?"
          description="Un suggerimento semplice e realistico per darti una direzione oggi senza pensarci troppo."
          buttonLabel="Genera nuovo"
          buttonIcon={<RefreshCw className="size-4" />}
          onAction={() =>
            setTodayPrompt((currentPrompt) => getTodayPrompt(currentPrompt))
          }
        >
          <ResponseViewport
            value={todayPrompt}
            emptyText="Un piccolo suggerimento utile per orientare la giornata."
          />
        </RandomPrimaryCard>

        <RandomPrimaryCard
          icon={<Sparkles className="size-6" />}
          eyebrow="Libro delle risposte"
          title="Ricevi la tua risposta"
          description="Pensa a una domanda e lascia che il libro delle risposte apra una pagina per te."
          buttonLabel="Ricevi risposta"
          buttonIcon={<Sparkles className="size-4" />}
          onAction={handleInstantAnswer}
        >
          <ResponseViewport
            value={instantAnswer}
            emptyText="Pensa a una domanda e lascia che arrivi una risposta."
          />
        </RandomPrimaryCard>
      </div>

      <Card className="relative overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(9,18,33,0.9),rgba(12,24,42,0.88))] p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-cyan-300/10 to-transparent" />

        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/58">
                  Extra random
                </p>
                <h3 className="font-heading mt-2 text-xl font-semibold text-slate-50 sm:text-2xl">
                  Numero casuale da 1 a 100
                </h3>
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-300/14 bg-white/6 text-cyan-200">
                <Dice5 className="size-5" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,28,48,0.94),rgba(10,20,35,0.92))] p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Risultato
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={String(number ?? "empty")}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-4 flex min-h-[72px] items-center"
                >
                  {number ? (
                    <p className="font-heading text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                      {number}
                    </p>
                  ) : (
                    <p className="max-w-lg text-sm leading-7 text-slate-400">
                      Se ti serve un numero rapido, qui lo ottieni senza
                      distrazioni.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid gap-3 sm:flex sm:flex-wrap xl:flex-col xl:items-stretch">
            <Button
              icon={<Sparkles className="size-4" />}
              onClick={() => setNumber(getRandomNumber())}
              className="w-full sm:min-w-[12rem] xl:min-w-[14rem]"
            >
              Genera numero
            </Button>
            <Button
              variant="secondary"
              onClick={() => setNumber(null)}
              className="w-full sm:min-w-[12rem] xl:min-w-[14rem]"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
