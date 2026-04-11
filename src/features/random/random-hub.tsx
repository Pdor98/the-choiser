"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Dice5, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { randomActivities } from "@/lib/site-content";

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function getRandomActivity(previous?: string) {
  if (randomActivities.length === 1) {
    return randomActivities[0];
  }

  let next = randomActivities[Math.floor(Math.random() * randomActivities.length)];

  while (next === previous) {
    next = randomActivities[Math.floor(Math.random() * randomActivities.length)];
  }

  return next;
}

function AnimatedValue({
  value,
  emptyState,
}: {
  value: string | number | null;
  emptyState: string;
}) {
  const isNumeric = typeof value === "number";

  return (
    <div className="relative min-h-28 overflow-hidden rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,249,255,0.92))] p-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={String(value ?? emptyState)}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex min-h-[72px] items-center justify-center text-center"
        >
          {value ? (
            <p
              className={
                isNumeric
                  ? "font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
                  : "max-w-lg text-base leading-8 text-slate-800 sm:text-lg"
              }
            >
              {value}
            </p>
          ) : (
            <p className="max-w-md text-sm leading-7 text-slate-500">{emptyState}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function RandomHub() {
  const [number, setNumber] = useState<number | null>(null);
  const [activity, setActivity] = useState<string | null>(null);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="relative overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,248,255,0.9))] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-sky-200/80 to-transparent" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-700/70">
                Random number
              </p>
              <h2 className="font-heading mt-2 text-2xl font-semibold text-slate-900">
                Numero casuale da 1 a 100
              </h2>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl border border-sky-200/80 bg-white/82 text-sky-700">
              <Dice5 className="size-5" />
            </div>
          </div>

          <AnimatedValue
            value={number}
            emptyState="Premi genera e lascia decidere al caso."
          />

          <div className="flex flex-wrap gap-3">
            <Button
              icon={<Sparkles className="size-4" />}
              onClick={() => setNumber(getRandomNumber())}
            >
              Genera numero
            </Button>
            <Button variant="secondary" onClick={() => setNumber(null)}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,248,255,0.9))] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-amber-200/70 to-transparent" />
        <div className="relative space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-700/72">
                Today prompt
              </p>
              <h2 className="font-heading mt-2 text-2xl font-semibold text-slate-900">
                Cosa dovrei fare oggi?
              </h2>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-200/80 bg-white/82 text-amber-700">
              <Wand2 className="size-5" />
            </div>
          </div>

          <AnimatedValue
            value={activity}
            emptyState="Serve un'idea? Il prossimo suggerimento è a un click."
          />

          <div className="flex flex-wrap gap-3">
            <Button
              icon={<RefreshCw className="size-4" />}
              onClick={() => setActivity(getRandomActivity(activity ?? undefined))}
            >
              Genera idea
            </Button>
            <Button variant="secondary" onClick={() => setActivity(null)}>
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
