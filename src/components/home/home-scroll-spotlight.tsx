"use client";

import { Dices, Gamepad2, Sparkles, TimerReset } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

const spotlightSteps = [
  {
    eyebrow: "01 / Random",
    title: "Quando nessuno vuole scegliere.",
    description:
      "Il primo momento si accende sul caso: una risposta rapida, leggibile, pronta a sbloccare il gruppo.",
    icon: Dices,
    accent: "text-cyan-200",
  },
  {
    eyebrow: "02 / Games",
    title: "Quando serve ritmo.",
    description:
      "La scena cambia sui giochi: card più presenti, movimento più deciso, tutto pensato per partire subito.",
    icon: Gamepad2,
    accent: "text-violet-200",
  },
  {
    eyebrow: "03 / Tools",
    title: "Quando vuoi controllo.",
    description:
      "Il percorso si chiude sugli strumenti: timer, dadi e utility restano chiari mentre la serata continua.",
    icon: TimerReset,
    accent: "text-emerald-200",
  },
];

export function HomeScrollSpotlight() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 88%", "end 18%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 82,
    damping: 22,
    mass: 0.42,
  });

  const visualY = useTransform(progress, [0, 0.5, 1], [80, -10, -76]);
  const visualScale = useTransform(progress, [0, 0.48, 1], [0.9, 1.04, 0.95]);
  const visualRotate = useTransform(progress, [0, 0.5, 1], [-7, 0, 5]);
  const visualOpacity = useTransform(progress, [0, 0.12, 0.9, 1], [0.42, 1, 1, 0.72]);
  const haloX = useTransform(progress, [0, 0.5, 1], ["-18%", "8%", "24%"]);
  const haloOpacity = useTransform(progress, [0, 0.5, 1], [0.28, 0.64, 0.34]);
  const railScaleX = useTransform(progress, [0, 1], [0.08, 1]);

  const randomOpacity = useTransform(progress, [0, 0.12, 0.32, 0.46], [0.28, 1, 1, 0.34]);
  const gamesOpacity = useTransform(progress, [0.28, 0.43, 0.66, 0.8], [0.28, 1, 1, 0.34]);
  const toolsOpacity = useTransform(progress, [0.62, 0.78, 1], [0.28, 1, 1]);

  const randomY = useTransform(progress, [0, 0.24, 0.46], [30, 0, -20]);
  const gamesY = useTransform(progress, [0.28, 0.52, 0.8], [42, 0, -18]);
  const toolsY = useTransform(progress, [0.62, 0.86, 1], [46, 0, -10]);

  const randomX = useTransform(progress, [0, 0.24, 0.46], [-44, 0, 24]);
  const gamesX = useTransform(progress, [0.28, 0.52, 0.8], [42, 0, -18]);
  const toolsX = useTransform(progress, [0.62, 0.86, 1], [-34, 0, 0]);
  const orbitScale = useTransform(progress, [0, 0.5, 1], [0.8, 1.22, 0.96]);
  const orbitOpacity = useTransform(progress, [0, 0.5, 1], [0.22, 0.55, 0.28]);
  const badgeOpacity = useTransform(progress, [0.14, 0.5, 0.92], [0.3, 1, 0.42]);
  const badgeX = useTransform(progress, [0, 0.5, 1], [24, 0, -20]);

  const imageLayers = [
    {
      label: "Random",
      copy: "Una scelta netta quando il gruppo gira a vuoto.",
      opacity: randomOpacity,
      x: randomX,
      y: randomY,
      className: "left-5 top-14 border-cyan-200/20 bg-cyan-200/[0.08]",
    },
    {
      label: "Games",
      copy: "Il gioco giusto entra al centro della scena.",
      opacity: gamesOpacity,
      x: gamesX,
      y: gamesY,
      className: "right-5 top-32 border-violet-200/20 bg-violet-200/[0.08]",
    },
    {
      label: "Tools",
      copy: "Timer e dadi restano ordinati sotto controllo.",
      opacity: toolsOpacity,
      x: toolsX,
      y: toolsY,
      className: "bottom-7 left-[11%] w-[78%] border-emerald-200/20 bg-emerald-200/[0.08]",
    },
  ];

  const stepOpacities = [randomOpacity, gamesOpacity, toolsOpacity];
  const stepYs = [randomY, gamesY, toolsY];

  return (
    <section
      ref={sectionRef}
      data-motion="scroll-spotlight"
      className="relative min-h-[178vh] overflow-visible lg:min-h-[235vh]"
      aria-label="Esperienza di scroll Choiser"
    >
      <div className="lg:sticky lg:top-28">
        <div className="relative isolate overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(6,12,22,0.98),rgba(9,16,29,0.96))] px-5 py-8 shadow-[0_34px_100px_-62px_rgba(8,47,73,0.95)] sm:px-7 sm:py-10 lg:px-10 lg:py-12">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-10 h-[42%] w-[58%] rounded-full bg-cyan-300/18 blur-3xl"
            style={reduceMotion ? undefined : { opacity: haloOpacity, x: haloX }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/24 to-transparent" />

          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="order-2 space-y-7 lg:order-1 lg:pr-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-100/54">
                  Scroll experience
                </p>
                <h2 className="font-heading mt-5 max-w-xl text-balance text-[clamp(2.4rem,6vw,4.25rem)] font-semibold tracking-[-0.055em] text-slate-50">
                  Il sito reagisce mentre lo percorri.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Non è una comparsa: è una scena guidata dallo scroll. Il
                  focus passa da Random a Games a Tools mentre il visual cambia
                  ritmo, scala e posizione.
                </p>
              </div>

              <div className="origin-left overflow-hidden rounded-full bg-white/8">
                <motion.div
                  data-spotlight="progress"
                  className="h-1.5 origin-left rounded-full bg-gradient-to-r from-cyan-200 via-violet-200 to-emerald-200"
                  style={reduceMotion ? undefined : { scaleX: railScaleX }}
                />
              </div>

              <div className="space-y-3">
                {spotlightSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.div
                      key={step.title}
                      className="rounded-[28px] border border-white/8 bg-white/[0.035] p-4 shadow-[0_20px_70px_-56px_rgba(15,23,42,0.85)] backdrop-blur"
                      style={
                        reduceMotion
                          ? undefined
                          : {
                              opacity: stepOpacities[index],
                              y: stepYs[index],
                            }
                      }
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8",
                            step.accent,
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">
                            {step.eyebrow}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-50">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              data-spotlight="visual"
              className="relative order-1 mx-auto h-[390px] w-full max-w-[620px] sm:h-[470px] lg:order-2 lg:h-[560px]"
              style={
                reduceMotion
                  ? undefined
                  : {
                      opacity: visualOpacity,
                      rotate: visualRotate,
                      scale: visualScale,
                      y: visualY,
                    }
              }
            >
              <div className="absolute inset-0 rounded-[42px] border border-white/10 bg-[linear-gradient(150deg,rgba(15,23,42,0.96),rgba(8,13,24,0.98))] p-3 shadow-[0_36px_120px_-70px_rgba(56,189,248,0.8)]">
                <div className="relative h-full overflow-hidden rounded-[32px] border border-white/8 bg-[#07101d]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(103,232,249,0.18),transparent_35%),radial-gradient(circle_at_82%_72%,rgba(167,139,250,0.16),transparent_40%)]" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-full border border-white/8 bg-white/[0.045] px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.32em] text-cyan-100/70">
                      Choiser
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.32em] text-slate-500">
                      Live path
                    </span>
                  </div>

                  <motion.div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/14"
                    style={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: orbitOpacity,
                            scale: orbitScale,
                          }
                    }
                  />

                  {imageLayers.map((layer) => (
                    <motion.div
                      key={layer.label}
                      className={cn(
                        "absolute max-w-[260px] rounded-[26px] border p-4 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.95)] backdrop-blur-xl",
                        layer.className,
                      )}
                      style={
                        reduceMotion
                          ? undefined
                          : {
                              opacity: layer.opacity,
                              x: layer.x,
                              y: layer.y,
                            }
                      }
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                        {layer.label}
                      </p>
                      <p className="mt-3 font-heading text-[1.65rem] font-semibold leading-tight tracking-[-0.04em] text-slate-50 sm:text-3xl">
                        {layer.copy}
                      </p>
                    </motion.div>
                  ))}

                  <motion.div
                    className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-cyan-100/12 bg-cyan-100/[0.06] px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100/72"
                    style={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: badgeOpacity,
                            x: badgeX,
                          }
                    }
                  >
                    <Sparkles className="size-3.5" />
                    Scroll linked
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
