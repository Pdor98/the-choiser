"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, Stars } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionBadge } from "@/components/ui/section-badge";
import { adviceLeadIns, randomActivities } from "@/lib/site-content";

function getDayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
}

function getAdvice(exclude?: string) {
  if (randomActivities.length === 1) {
    return randomActivities[0];
  }

  let nextAdvice = randomActivities[getDayIndex() % randomActivities.length];

  if (!exclude) {
    return nextAdvice;
  }

  while (nextAdvice === exclude) {
    nextAdvice =
      randomActivities[Math.floor(Math.random() * randomActivities.length)];
  }

  return nextAdvice;
}

function getLeadIn(exclude?: string) {
  if (adviceLeadIns.length === 1) {
    return adviceLeadIns[0];
  }

  let nextLeadIn = adviceLeadIns[getDayIndex() % adviceLeadIns.length];

  if (!exclude) {
    return nextLeadIn;
  }

  while (nextLeadIn === exclude) {
    nextLeadIn = adviceLeadIns[Math.floor(Math.random() * adviceLeadIns.length)];
  }

  return nextLeadIn;
}

type AdviceState = {
  text: string;
  leadIn: string;
  version: number;
};

export function DailyAdvicePanel() {
  const shouldReduceMotion = useReducedMotion();
  const [advice, setAdvice] = useState<AdviceState>(() => ({
    text: getAdvice(),
    leadIn: getLeadIn(),
    version: 0,
  }));

  function handleGenerateAdvice() {
    setAdvice((currentAdvice) => ({
      text: getAdvice(currentAdvice.text),
      leadIn: getLeadIn(currentAdvice.leadIn),
      version: currentAdvice.version + 1,
    }));
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0.78, y: 14 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-cyan-300/18 bg-[linear-gradient(135deg,rgba(8,16,30,0.99),rgba(9,21,39,0.98)_26%,rgba(12,29,49,0.97)_54%,rgba(18,38,66,0.96)_82%,rgba(26,48,84,0.94))] px-5 py-6 shadow-[0_40px_110px_-54px_rgba(37,99,235,0.5)] sm:px-8 sm:py-7 lg:px-10 lg:py-8">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-65"
          style={{
            backgroundImage:
              "linear-gradient(118deg, rgba(34,211,238,0.1), rgba(59,130,246,0.03) 24%, transparent 46%, rgba(99,102,241,0.13) 64%, rgba(34,211,238,0.08))",
            backgroundSize: "180% 180%",
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  backgroundPosition: [
                    "0% 50%",
                    "100% 50%",
                    "0% 50%",
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-cyan-400/16 via-sky-400/9 to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-indigo-300/14 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/36 to-transparent" />

        <div className="relative mx-auto max-w-5xl space-y-5 text-center sm:space-y-6">
          <motion.div
            className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-[20px] border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-cyan-100 shadow-[0_18px_34px_-24px_rgba(34,211,238,0.42)] sm:size-14"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    boxShadow: [
                      "0 16px 36px -24px rgba(34,211,238,0.42)",
                      "0 24px 42px -24px rgba(59,130,246,0.56)",
                      "0 16px 36px -24px rgba(34,211,238,0.42)",
                    ],
                  }
            }
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="size-5 sm:size-6" />
              <Stars className="absolute -right-2.5 -top-1.5 size-3 text-cyan-200/72" />
            </div>
          </motion.div>

          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <SectionBadge className="border-cyan-300/18 bg-white/6 text-cyan-100/82 shadow-[0_12px_24px_-22px_rgba(56,189,248,0.34)]">
                Consiglio del giorno
              </SectionBadge>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400/72 sm:text-[11px]">
                Un solo spunto, subito utile
              </p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={advice.version}
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: 10, filter: "blur(6px)" }
                }
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: -8, filter: "blur(6px)" }
                }
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-3"
              >
                <p className="text-[12px] font-medium tracking-[0.04em] text-cyan-100/58 sm:text-[13px]">
                  {advice.leadIn}
                </p>
                <p
                  aria-live="polite"
                  className="mx-auto max-w-4xl text-balance font-heading text-[1.62rem] font-semibold leading-[1.22] text-slate-50 sm:text-[2.1rem] sm:leading-[1.18] lg:text-[2.62rem] lg:leading-[1.12]"
                >
                  {advice.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3">
            <Button
              icon={
                <Sparkles className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              }
              onClick={handleGenerateAdvice}
              className="group min-h-[3.2rem] w-full px-6 text-[15px] shadow-[0_22px_52px_-30px_rgba(56,189,248,0.36)] sm:w-auto sm:min-w-[12rem]"
            >
              Genera nuovo
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
