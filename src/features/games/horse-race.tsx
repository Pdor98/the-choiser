"use client";

import { Flag, Minus, Play, Plus, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveControlPanel } from "@/components/ui/responsive-control-panel";

type RacePhase = "ready" | "running" | "finished";

type HorseProfile = {
  id: string;
  number: number;
  name: string;
  color: string;
  horseEmoji: string;
  jockeyEmoji: string;
  basePace: number;
};

type HorseSeed = {
  name: string;
  color: string;
  jockeyEmoji: string;
  basePace: number;
};

type RacePositions = Record<string, number>;
type RaceRhythms = Record<string, number>;

const minHorseCount = 2;
const maxHorseCount = 10;
const initialHorseCount = 4;
const tickMs = 95;
const racePaceFactor = 0.78;
const defaultRaceDistance = 100;
const raceDistanceOptions = [100, 300, 500, 1000];

const horseSeeds: HorseSeed[] = [
  { name: "Fulmine", color: "#e8b86d", jockeyEmoji: "🟡", basePace: 0.97 },
  { name: "Tempesta", color: "#7eb8f7", jockeyEmoji: "🔵", basePace: 0.98 },
  { name: "Fuoco", color: "#f47c7c", jockeyEmoji: "🔴", basePace: 0.96 },
  { name: "Vento", color: "#7de8a0", jockeyEmoji: "🟢", basePace: 0.97 },
  { name: "Ombra", color: "#c97ef7", jockeyEmoji: "🟣", basePace: 0.98 },
  { name: "Saetta", color: "#f7a75c", jockeyEmoji: "🟠", basePace: 0.99 },
  { name: "Nebbia", color: "#a8d8ea", jockeyEmoji: "🩵", basePace: 0.96 },
  { name: "Vulcano", color: "#f77c7c", jockeyEmoji: "❤️", basePace: 0.98 },
  { name: "Ciclone", color: "#f7e27c", jockeyEmoji: "💛", basePace: 0.97 },
  { name: "Fantasma", color: "#d0d0d0", jockeyEmoji: "🩶", basePace: 0.96 },
];

function clampHorseCount(value: number) {
  return Math.min(maxHorseCount, Math.max(minHorseCount, value));
}

function getDefaultHorseName(index: number) {
  return horseSeeds[index]?.name ?? `Cavallo ${index + 1}`;
}

function createHorseLineup(count: number): HorseProfile[] {
  return horseSeeds.slice(0, count).map((horse, index) => ({
    id: `horse-${index + 1}`,
    number: index + 1,
    name: horse.name,
    color: horse.color,
    horseEmoji: "🐎",
    jockeyEmoji: horse.jockeyEmoji,
    basePace: horse.basePace,
  }));
}

function createRacePositions(horses: HorseProfile[]): RacePositions {
  return Object.fromEntries(horses.map((horse) => [horse.id, 0]));
}

function createRaceRhythms(horses: HorseProfile[]): RaceRhythms {
  return Object.fromEntries(
    horses.map((horse) => [
      horse.id,
      Math.max(0.78, horse.basePace + (Math.random() - 0.5) * 0.18),
    ]),
  );
}

function withAlpha(color: string, alpha: string) {
  return `${color}${alpha}`;
}

function formatRaceDistance(distance: number) {
  return distance >= 1000 ? `${distance / 1000} km` : `${distance} m`;
}

function getRaceDistanceMood(distance: number) {
  if (distance <= 100) {
    return "Sprint";
  }

  if (distance <= 300) {
    return "Classica";
  }

  if (distance <= 500) {
    return "Endurance";
  }

  return "Notte lunga";
}

function getItalianPlacementLabel(rank: number) {
  const labels = [
    "primo posto",
    "secondo posto",
    "terzo posto",
    "quarto posto",
    "quinto posto",
    "sesto posto",
    "settimo posto",
    "ottavo posto",
    "nono posto",
    "decimo posto",
  ];

  return labels[rank] ?? `${rank + 1}º posto`;
}

const initialHorses = createHorseLineup(initialHorseCount);

export function HorseRaceGame() {
  const [horseCount, setHorseCount] = useState(initialHorseCount);
  const [raceDistance, setRaceDistance] = useState(defaultRaceDistance);
  const [horses, setHorses] = useState<HorseProfile[]>(initialHorses);
  const [positions, setPositions] = useState<RacePositions>(() =>
    createRacePositions(initialHorses),
  );
  const [racePhase, setRacePhase] = useState<RacePhase>("ready");
  const [leaderHorseId, setLeaderHorseId] = useState<string | null>(
    initialHorses[0].id,
  );
  const [winnerHorseId, setWinnerHorseId] = useState<string | null>(null);
  const [ranking, setRanking] = useState<string[]>([]);
  const [feedback, setFeedback] = useState(
    "Scegli quanti cavalli mettere in gara e lascia che la pista faccia il resto.",
  );

  const intervalRef = useRef<number | null>(null);
  const positionsRef = useRef<RacePositions>(createRacePositions(initialHorses));
  const rhythmsRef = useRef<RaceRhythms>(createRaceRhythms(initialHorses));
  const horsesRef = useRef<HorseProfile[]>(initialHorses);
  const finishOrderRef = useRef<string[]>([]);

  useEffect(() => {
    horsesRef.current = horses;
  }, [horses]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const winnerHorse =
    horses.find((horse) => horse.id === winnerHorseId) ?? null;
  const leaderHorse =
    horses.find((horse) => horse.id === leaderHorseId) ?? horses[0];
  const raceDistanceLabel = formatRaceDistance(raceDistance);
  const raceDistanceMood = getRaceDistanceMood(raceDistance);

  function stopRaceLoop() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function prepareRace(nextHorses: HorseProfile[], nextFeedback: string) {
    stopRaceLoop();

    const nextPositions = createRacePositions(nextHorses);
    positionsRef.current = nextPositions;
    rhythmsRef.current = createRaceRhythms(nextHorses);
    finishOrderRef.current = [];

    setPositions(nextPositions);
    setRacePhase("ready");
    setLeaderHorseId(nextHorses[0]?.id ?? null);
    setWinnerHorseId(null);
    setRanking([]);
    setFeedback(nextFeedback);
  }

  function handleHorseCountChange(nextCount: number) {
    if (racePhase === "running") {
      return;
    }

    const boundedCount = clampHorseCount(nextCount);
    const nextHorses = createHorseLineup(boundedCount).map((horse, index) => {
      const existingHorse = horses[index];

      if (!existingHorse) {
        return horse;
      }

      return {
        ...horse,
        name: existingHorse.name,
      };
    });

    setHorseCount(boundedCount);
    setHorses(nextHorses);
    prepareRace(
      nextHorses,
      `${boundedCount} cavalli ai box. La griglia e pronta per una corsa piena di sorpassi.`,
    );
  }

  function handleHorseNameChange(horseId: string, nextName: string) {
    if (racePhase === "running") {
      return;
    }

    setHorses((currentHorses) =>
      currentHorses.map((horse) =>
        horse.id === horseId ? { ...horse, name: nextName } : horse,
      ),
    );
  }

  function handleHorseNameBlur(horseId: string, horseIndex: number, nextName: string) {
    const normalizedName = nextName.trim() || getDefaultHorseName(horseIndex);

    setHorses((currentHorses) =>
      currentHorses.map((horse) =>
        horse.id === horseId ? { ...horse, name: normalizedName } : horse,
      ),
    );
  }

  function resetRace() {
    prepareRace(
      horses,
      racePhase === "running"
        ? "Gara interrotta. I cavalli tornano ai box e puoi cambiare distanza prima di ripartire."
        : `I cavalli tornano al cancelletto di partenza. Traguardo fissato a ${raceDistanceLabel}.`,
    );
  }

  function handleRaceDistanceChange(nextDistance: number) {
    if (racePhase === "running" || nextDistance === raceDistance) {
      return;
    }

    setRaceDistance(nextDistance);
    prepareRace(
      horses,
      `Traguardo impostato su ${formatRaceDistance(nextDistance)}. La gara e pronta per una corsa piu ${nextDistance > defaultRaceDistance ? "lunga" : nextDistance < defaultRaceDistance ? "secca" : "bilanciata"}.`,
    );
  }

  function startRace() {
    if (racePhase === "running") {
      return;
    }

    const nextPositions = createRacePositions(horses);
    positionsRef.current = nextPositions;
    rhythmsRef.current = createRaceRhythms(horses);
    finishOrderRef.current = [];

    stopRaceLoop();

    setPositions(nextPositions);
    setRacePhase("running");
    setLeaderHorseId(horses[0]?.id ?? null);
    setWinnerHorseId(null);
    setRanking([]);
    setFeedback(
      `Traguardo a ${raceDistanceLabel}: aspettati allunghi, frenate e sorpassi fino all'ultimo.`,
    );

    intervalRef.current = window.setInterval(() => {
      const currentPositions = positionsRef.current;
      const currentLeaderPosition = Math.max(...Object.values(currentPositions), 0);
      const finishPressureStart = raceDistance * 0.84;
      const finishTrigger = raceDistance * 0.99;
      const nextPositions: RacePositions = {};
      const nextRhythms: RaceRhythms = {};
      const nextFinishOrder = [...finishOrderRef.current];
      const horsesInRace = horsesRef.current;
      const finishersThisTick: Array<{ horseId: string; position: number }> = [];

      let nextLeaderId: string | null = horsesInRace[0]?.id ?? null;
      let nextLeaderPosition = -1;

      for (const horse of horsesInRace) {
        const currentPosition = currentPositions[horse.id] ?? 0;
        const currentRhythm = rhythmsRef.current[horse.id] ?? horse.basePace;
        const gapToLeader = currentLeaderPosition - currentPosition;
        const catchUpBoost =
          gapToLeader > 14 ? 0.2 : gapToLeader > 8 ? 0.11 : gapToLeader > 4 ? 0.05 : 0;
        const rhythmSwing = (Math.random() - 0.5) * 0.3;
        const burst = Math.random() > 0.93 ? 0.18 + Math.random() * 0.28 : 0;
        const finishPressure =
          currentPosition > finishPressureStart
            ? Math.random() * 0.12 - 0.04
            : 0;
        const nextRhythm = Math.min(
          2.1,
          Math.max(
            0.72,
            currentRhythm + rhythmSwing + catchUpBoost + finishPressure,
          ),
        );
        const strideVariance = (Math.random() - 0.5) * 0.18;
        const stride = Math.max(
          0.48,
          (nextRhythm + horse.basePace * 0.2 + burst + strideVariance) *
            racePaceFactor,
        );
        const nextPosition = Math.min(raceDistance, currentPosition + stride);

        nextRhythms[horse.id] = nextRhythm;
        nextPositions[horse.id] = nextPosition;

        if (nextPosition > nextLeaderPosition) {
          nextLeaderPosition = nextPosition;
          nextLeaderId = horse.id;
        }

        if (
          nextPosition >= finishTrigger &&
          !nextFinishOrder.includes(horse.id)
        ) {
          finishersThisTick.push({
            horseId: horse.id,
            position: nextPosition + Math.random() * 0.08,
          });
        }
      }

      finishersThisTick
        .sort((left, right) => right.position - left.position)
        .forEach(({ horseId }) => {
          if (!nextFinishOrder.includes(horseId)) {
            nextFinishOrder.push(horseId);
          }
        });

      positionsRef.current = nextPositions;
      rhythmsRef.current = nextRhythms;
      finishOrderRef.current = nextFinishOrder;

      setPositions(nextPositions);
      setLeaderHorseId(nextLeaderId);
      setRanking(nextFinishOrder);

      if (nextFinishOrder.length === horsesInRace.length) {
        stopRaceLoop();

        const nextWinnerId = nextFinishOrder[0] ?? null;
        const nextWinnerHorse = horsesInRace.find(
          (horse) => horse.id === nextWinnerId,
        );

        setRacePhase("finished");
        setWinnerHorseId(nextWinnerId);

        if (nextWinnerHorse) {
          setFeedback(
            `Ha vinto Cavallo ${nextWinnerHorse.number} - ${nextWinnerHorse.name}.`,
          );
        }
      }
    }, tickMs);
  }

  const statusToneClass =
    racePhase === "finished"
      ? "border-amber-300/18 bg-amber-300/[0.07]"
      : racePhase === "running"
        ? "border-cyan-300/18 bg-cyan-300/[0.07]"
        : "border-white/10 bg-white/[0.04]";

  const statusLabel =
    racePhase === "finished"
      ? "Risultato finale"
      : racePhase === "running"
        ? "Corsa in corso"
        : "Griglia pronta";

  const statusMeta =
    racePhase === "finished"
      ? winnerHorse
        ? `Vincitore: Cavallo ${winnerHorse.number}`
        : "Attesa risultato"
      : racePhase === "running"
        ? leaderHorse
          ? `In testa: Cavallo ${leaderHorse.number}`
          : "Partenza lanciata"
        : `${horseCount} cavalli ai box`;
  const finishLine = raceDistance;
  const trackHeight = Math.max(300, horses.length * 52);
  const trackStart = 18;
  const trackFinish = 86;
  const trackSpan = trackFinish - trackStart;
  const trackRightInset = `${100 - trackFinish}%`;
  const movingHorseMarkerOffset = racePhase === "running" ? 1.5 : 1.25;
  const finishLabelAnchor = `calc(${trackFinish}% - 4.25rem)`;

  return (
    <Card className="relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-amber-300/16 via-orange-300/10 to-transparent" />
      <div className="pointer-events-none absolute right-[-3rem] top-10 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
              Horse race
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white">
              Corsa dei cavalli
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/60">
              Una mini gara da salotto: prepara la griglia, guarda i sorpassi
              prendere ritmo e scopri chi taglia il traguardo per primo.
            </p>
          </div>
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-amber-200 shadow-[0_20px_44px_-28px_rgba(251,191,36,0.3)]">
            {racePhase === "finished" ? (
              <Trophy className="size-5" />
            ) : (
              <Flag className="size-5" />
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="space-y-4">
            {racePhase === "finished" && winnerHorse ? (
              <div className="relative rounded-[34px] border border-emerald-300/22 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(11,18,32,0.84))] p-4 shadow-[0_30px_60px_-36px_rgba(16,185,129,0.82)] backdrop-blur-sm sm:rounded-[38px] sm:p-5">
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.12),transparent_42%)]" />
                <div className="relative z-[1]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-100/70">
                        Vincitore
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full border border-emerald-200/22 bg-emerald-300/14 text-lg shadow-[0_0_26px_-10px_rgba(110,231,183,0.98)]">
                          {winnerHorse.horseEmoji}
                        </div>
                        <div>
                          <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                            Cavallo {winnerHorse.number}
                          </p>
                          <p className="text-base text-emerald-50/92 sm:text-lg">
                            {winnerHorse.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-full border border-emerald-200/20 bg-slate-950/38 text-emerald-100">
                      <Trophy className="size-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/74">
                    Ha tagliato il traguardo per primo. Puoi rilanciare subito una nuova corsa.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(15,23,42,0.34))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
              <div
                className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(13,27,21,0.94),rgba(10,20,16,0.98))]"
                style={{ height: `${trackHeight}px` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_36%,rgba(0,0,0,0.16))]" />
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_44px)] opacity-30" />
                <div className="pointer-events-none absolute inset-y-0 left-[18%] w-px bg-white/12" />
                <div
                  className="pointer-events-none absolute inset-y-0 w-[4px] rounded-full bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.94)_0px,rgba(255,255,255,0.94)_7px,rgba(15,23,42,0.92)_7px,rgba(15,23,42,0.92)_14px)] shadow-[0_0_22px_-10px_rgba(255,255,255,0.8)]"
                  style={{ left: `${trackFinish}%` }}
                />

                {horses.map((horse, index) => {
                  const progress = positions[horse.id] ?? 0;
                  const markerPosition =
                    trackStart + (Math.min(finishLine, progress) / finishLine) * trackSpan;
                  const isWinner = winnerHorseId === horse.id;
                  const isLeader =
                    racePhase === "running" && leaderHorseId === horse.id;
                  const horseRank = ranking.indexOf(horse.id);
                  const displayMarkerPosition =
                    racePhase === "finished" && horseRank >= 0
                      ? Math.max(trackStart + 10, trackFinish - horseRank * 2.2)
                      : markerPosition;
                  const laneCenter =
                    horses.length === 1
                      ? trackHeight / 2
                      : 32 + (index * (trackHeight - 64)) / (horses.length - 1);
                  const railWidth = Math.max(
                    0,
                    displayMarkerPosition - trackStart,
                  );
                  const zIndex = isWinner ? 40 : isLeader ? 30 : 10;

                  return (
                    <div key={horse.id}>
                      <div
                        className="pointer-events-none absolute text-[10px] uppercase tracking-[0.18em] text-white/42"
                        style={{
                          left: "3%",
                          top: `${laneCenter}px`,
                          transform: "translateY(-50%)",
                        }}
                      >
                        #{horse.number}
                      </div>

                      <div
                        className="pointer-events-none absolute left-[18%] h-px bg-white/10"
                        style={{ top: `${laneCenter}px`, right: trackRightInset }}
                      />

                      <div
                        className="pointer-events-none absolute left-[18%] h-[5px] -translate-y-1/2 rounded-full transition-[width] duration-150 ease-linear"
                        style={{
                          top: `${laneCenter}px`,
                          width: `${railWidth}%`,
                          background: `linear-gradient(90deg, ${withAlpha(horse.color, "00")}, ${withAlpha(horse.color, "92")} 55%, ${withAlpha(horse.color, "ff")})`,
                          boxShadow: `0 0 24px -10px ${withAlpha(horse.color, "aa")}`,
                        }}
                      />

                      <div
                        className="absolute transition-[left] duration-150 ease-linear"
                        style={{
                          left: `calc(${displayMarkerPosition}% - ${movingHorseMarkerOffset}rem)`,
                          top: `${laneCenter}px`,
                          transform: "translateY(-50%)",
                          zIndex,
                        }}
                      >
                        <div
                          className={`flex shrink-0 items-center justify-center rounded-full border bg-slate-950/92 leading-none shadow-[0_20px_34px_-24px_rgba(15,23,42,0.98)] backdrop-blur-sm transition-[width,height,font-size,box-shadow] duration-200 ${
                            racePhase === "running"
                              ? "size-12 text-[1.35rem]"
                              : "size-10 text-[1.1rem]"
                          }`}
                          style={{
                            borderColor: withAlpha(horse.color, isWinner ? "88" : "55"),
                            boxShadow:
                              racePhase === "running"
                                ? `0 0 0 1px ${withAlpha(horse.color, "35")}, 0 24px 40px -22px ${withAlpha(horse.color, "e2")}`
                                : isWinner
                                  ? `0 0 0 2px ${withAlpha(horse.color, "45")}, 0 20px 34px -24px ${withAlpha(horse.color, "dd")}`
                                  : `0 20px 34px -24px ${withAlpha(horse.color, "c8")}`,
                          }}
                        >
                          {horse.horseEmoji}
                        </div>
                      </div>

                      {racePhase === "finished" && horseRank >= 0 ? (
                        <div
                          className="absolute transition-[left,opacity] duration-200 ease-linear"
                          style={{
                            left: finishLabelAnchor,
                            top: `${laneCenter}px`,
                            transform: "translate(-100%, -50%)",
                            zIndex: zIndex + 1,
                          }}
                        >
                          <div
                            className={`flex min-w-[128px] items-center justify-end gap-2 rounded-full border px-2.5 py-2 text-right text-white shadow-[0_24px_40px_-28px_rgba(15,23,42,0.95)] backdrop-blur-sm transition-all duration-300 sm:min-w-[144px] ${
                              isWinner
                                ? "bg-slate-900/96 ring-2 ring-emerald-300/45"
                                : "bg-slate-950/90"
                            }`}
                            style={{
                              borderColor: withAlpha(horse.color, isWinner ? "88" : "66"),
                              boxShadow: isWinner
                                ? `0 28px 50px -24px ${withAlpha(horse.color, "ff")}, 0 0 0 1px ${withAlpha(horse.color, "55")}`
                                : `0 24px 40px -28px ${withAlpha(horse.color, "cc")}`,
                            }}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center justify-end gap-1.5">
                                <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-white/84">
                                  {horse.name}
                                </p>
                                <span className="text-[11px] leading-none">
                                  {horse.jockeyEmoji}
                                </span>
                              </div>
                              <div className="mt-0.5 flex flex-wrap items-center justify-end gap-1.5 text-[10px] text-white/50">
                                <span>{getItalianPlacementLabel(horseRank)}</span>
                              </div>
                            </div>
                            <span
                              className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                                isWinner
                                  ? "border-emerald-200/26 bg-emerald-300/14 text-emerald-50"
                                  : "border-white/12 bg-white/6 text-white/72"
                              }`}
                            >
                              P{horseRank + 1}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={startRace}
                disabled={racePhase === "running"}
                icon={<Play className="size-4" />}
                className="w-full"
              >
                {racePhase === "finished" ? "Nuova corsa" : "Inizia la corsa"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetRace}
                icon={<RotateCcw className="size-4" />}
                className="w-full sm:max-w-[12rem]"
              >
                {racePhase === "running" ? "Ferma e resetta" : "Reset gara"}
              </Button>
            </div>

            <div
              className={`rounded-[28px] border p-4 sm:p-5 ${statusToneClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/48">
                    {statusLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/82">
                    {statusMeta}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/58">
                  {horseCount} cavalli
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/72">{feedback}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-[18px] border border-white/8 bg-slate-950/42 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">
                    Griglia
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/82">
                    {horseCount} cavalli in pista
                  </p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-slate-950/42 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">
                    Traguardo
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/82">
                    {raceDistanceLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ResponsiveControlPanel
              key={racePhase === "ready" ? "horse-race-setup-open" : "horse-race-setup-closed"}
              title="Setup gara"
              summary={`${horseCount} cavalli · ${raceDistanceLabel}`}
              defaultOpenMobile={racePhase === "ready"}
            >
              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Numero di cavalli
                      </p>
                      <p className="mt-1 text-xs leading-6 text-white/52">
                        Da {minHorseCount} a {maxHorseCount}, per una gara party rapida e leggibile anche su mobile.
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/62 px-3 py-1 text-sm font-semibold text-white/78">
                      {horseCount}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleHorseCountChange(horseCount - 1)}
                      disabled={racePhase === "running" || horseCount <= minHorseCount}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/82 text-white/72 transition duration-300 hover:border-white/18 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      aria-label="Riduci il numero di cavalli"
                    >
                      <Minus className="size-4" />
                    </button>

                    <input
                      type="range"
                      min={minHorseCount}
                      max={maxHorseCount}
                      step={1}
                      value={horseCount}
                      onChange={(event) =>
                        handleHorseCountChange(Number(event.target.value))
                      }
                      disabled={racePhase === "running"}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-300 disabled:cursor-not-allowed"
                      aria-label="Seleziona il numero di cavalli"
                    />

                    <button
                      type="button"
                      onClick={() => handleHorseCountChange(horseCount + 1)}
                      disabled={racePhase === "running" || horseCount >= maxHorseCount}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/82 text-white/72 transition duration-300 hover:border-white/18 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      aria-label="Aumenta il numero di cavalli"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Distanza del traguardo
                      </p>
                      <p className="mt-1 text-xs leading-6 text-white/52">
                        Scegli quanto vuoi tirarla lunga: sprint veloce o gara con piu suspense.
                      </p>
                    </div>
                    <div className="flex min-w-[102px] flex-col items-center justify-center rounded-[24px] border border-amber-300/18 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(15,23,42,0.74))] px-3 py-2 text-center shadow-[0_20px_40px_-32px_rgba(251,191,36,0.9)]">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-amber-100/48">
                        Selezionata
                      </p>
                      <p className="mt-1 whitespace-nowrap text-base font-semibold text-white/88">
                        {raceDistanceLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[20px] border border-white/8 bg-slate-950/36 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">
                          Ritmo gara
                        </p>
                        <p className="mt-1 text-sm font-medium text-white/72">
                          {raceDistanceMood}
                        </p>
                      </div>
                      <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(251,191,36,0.18),rgba(255,255,255,0.04))]" />
                      <div className="rounded-full border border-amber-300/16 bg-amber-300/8 px-3 py-1 text-[11px] font-medium text-amber-100/80">
                        {raceDistanceLabel}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {raceDistanceOptions.map((distance) => {
                      const isSelected = raceDistance === distance;
                      const optionMood = getRaceDistanceMood(distance);

                      return (
                        <button
                          key={distance}
                          type="button"
                          onClick={() => handleRaceDistanceChange(distance)}
                          disabled={racePhase === "running"}
                          className={`relative overflow-hidden rounded-[20px] border px-3 py-3 text-left transition duration-300 ${
                            isSelected
                              ? "border-amber-300/35 bg-[linear-gradient(180deg,rgba(251,191,36,0.13),rgba(15,23,42,0.84))] text-white shadow-[0_24px_44px_-30px_rgba(251,191,36,0.9)]"
                              : "border-white/10 bg-slate-950/72 text-white/72 hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                          } disabled:cursor-not-allowed disabled:opacity-55`}
                        >
                          {isSelected ? (
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_42%)]" />
                          ) : null}
                          <div className="relative z-[1]">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase tracking-[0.18em] text-white/42">
                                {optionMood}
                              </span>
                              {isSelected ? (
                                <span className="rounded-full border border-amber-200/18 bg-amber-300/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-amber-100/78">
                                  attiva
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-3 whitespace-nowrap text-base font-semibold text-white/90">
                              {formatRaceDistance(distance)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">Cavalli in pista</p>
                  <p className="mt-1 text-xs leading-6 text-white/52">
                    La griglia e pronta: quando vuoi, fai partire la gara e guarda come si compone il finale.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-2">
                    {horses.map((horse, index) => (
                      <div
                        key={horse.id}
                        className="relative overflow-hidden rounded-[22px] border px-3 py-3 text-left shadow-[0_20px_36px_-30px_rgba(15,23,42,0.95)]"
                        style={{
                          borderColor: withAlpha(horse.color, "30"),
                          background: `linear-gradient(135deg, ${withAlpha(horse.color, "18")}, rgba(15,23,42,0.82) 42%, rgba(2,6,23,0.9))`,
                          boxShadow: `0 20px 36px -30px ${withAlpha(horse.color, "b8")}`,
                        }}
                      >
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-80"
                          style={{
                            background: `linear-gradient(180deg, ${withAlpha(horse.color, "1f")}, transparent)`,
                          }}
                        />
                        <div className="relative flex items-center gap-2">
                          <span
                            className="flex size-8 items-center justify-center rounded-full border text-lg leading-none"
                            style={{
                              borderColor: withAlpha(horse.color, "55"),
                              background: withAlpha(horse.color, "14"),
                              boxShadow: `0 0 0 1px ${withAlpha(horse.color, "14")}`,
                            }}
                          >
                            {horse.horseEmoji}
                          </span>
                        </div>
                        <label className="relative mt-3 block">
                          <span className="sr-only">Nome del cavallo {horse.number}</span>
                          <input
                            type="text"
                            value={horse.name}
                            onChange={(event) =>
                              handleHorseNameChange(horse.id, event.target.value)
                            }
                            onBlur={(event) =>
                              handleHorseNameBlur(horse.id, index, event.target.value)
                            }
                            disabled={racePhase === "running"}
                            maxLength={20}
                            className="w-full border-none bg-transparent p-0 text-sm font-semibold text-white outline-none placeholder:text-white/24 disabled:cursor-not-allowed disabled:opacity-70"
                            style={{ caretColor: horse.color }}
                            aria-label={`Nome del cavallo ${horse.number}`}
                          />
                        </label>
                        <div className="relative mt-2 flex items-center gap-2">
                          <span
                            className="size-3 rounded-full shadow-[0_0_16px_-4px_currentColor]"
                            style={{
                              backgroundColor: horse.color,
                              color: horse.color,
                              boxShadow: `0 0 14px -4px ${withAlpha(horse.color, "ee")}`,
                            }}
                          />
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: withAlpha(horse.color, "d8") }}
                          >
                            Jockey {horse.jockeyEmoji}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResponsiveControlPanel>
          </div>
        </div>
      </div>
    </Card>
  );
}
