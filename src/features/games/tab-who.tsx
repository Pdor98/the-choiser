"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  House,
  MessageCircle,
  Play,
  RotateCcw,
  ShieldBan,
  Shuffle,
  SkipForward,
  Square,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parole, type TabWhoCard } from "@/features/games/tab-who-data";

const durationOptions = [30, 60, 180] as const;
const lightActionButtonStyle = {
  color: "#0f172a",
  WebkitTextFillColor: "#0f172a",
  background: "#ffffff",
  borderColor: "#e2e8f0",
};

function shuffleDeck(cards: TabWhoCard[]) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextCards[index], nextCards[swapIndex]] = [
      nextCards[swapIndex],
      nextCards[index],
    ];
  }

  return nextCards;
}

function createPreparedDeck(excludeWord?: string) {
  const nextDeck = shuffleDeck(parole);

  if (excludeWord && nextDeck.length > 1 && nextDeck[0]?.parola === excludeWord) {
    [nextDeck[0], nextDeck[1]] = [nextDeck[1], nextDeck[0]];
  }

  return nextDeck;
}

type GameState = "idle" | "playing" | "finished";
type LastAction = "skip" | "correct" | "wrong" | null;

export function TabWhoGame() {
  const [deck, setDeck] = useState(() => createPreparedDeck());
  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedDuration, setSelectedDuration] =
    useState<(typeof durationOptions)[number]>(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const currentCard = deck[cardIndex] ?? deck[0];
  const progress = (timeLeft / selectedDuration) * 100;
  const cardsSeen = gameState === "idle" ? 0 : cardIndex + 1;

  const statusCopy = useMemo(() => {
    if (gameState === "finished") {
      return "Tempo finito! Il turno e concluso.";
    }

    if (lastAction === "correct") {
      return "Parola indovinata. Punto assegnato e carta successiva caricata.";
    }

    if (lastAction === "wrong") {
      return "Carta sbagliata o taboo pronunciato. Nessun punto assegnato.";
    }

    if (lastAction === "skip") {
      return "Carta saltata. Passi subito alla parola successiva.";
    }

    return "Descrivi la parola grande senza pronunciare nessuna delle 5 parole proibite.";
  }, [gameState, lastAction]);

  useEffect(() => {
    if (gameState !== "playing") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(intervalId);
          setGameState("finished");
          setLastAction(null);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [gameState]);

  function finishTurn() {
    setGameState("finished");
    setLastAction(null);
  }

  function moveToNextCard() {
    if (cardIndex + 1 < deck.length) {
      setCardIndex(cardIndex + 1);
      return;
    }

    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
  }

  function loadPreviewCard() {
    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
    setLastAction(null);
  }

  function startGame() {
    setScore(0);
    setMistakes(0);
    setTimeLeft(selectedDuration);
    setLastAction(null);
    setGameState("playing");
  }

  function restartGame() {
    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
    setScore(0);
    setMistakes(0);
    setTimeLeft(selectedDuration);
    setLastAction(null);
    setGameState("playing");
  }

  function resetToIntro() {
    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
    setScore(0);
    setMistakes(0);
    setTimeLeft(selectedDuration);
    setLastAction(null);
    setGameState("idle");
  }

  function handleSkip() {
    if (gameState !== "playing") {
      return;
    }

    setLastAction("skip");
    moveToNextCard();
  }

  function handleCorrect() {
    if (gameState !== "playing") {
      return;
    }

    setScore((currentScore) => currentScore + 1);
    setLastAction("correct");
    moveToNextCard();
  }

  function handleWrong() {
    if (gameState !== "playing") {
      return;
    }

    setMistakes((currentMistakes) => currentMistakes + 1);
    setLastAction("wrong");
    moveToNextCard();
  }

  if (!currentCard) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-amber-300/16 via-rose-300/10 to-transparent" />

      <div className="relative space-y-4 pb-28 sm:pb-32 lg:pb-0">
        <div
          className={`flex flex-wrap items-start justify-between gap-4 ${
            gameState === "playing" ? "hidden sm:flex" : ""
          }`}
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-100/72">
              Word challenge
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              TAB-WHO ?
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/64 sm:text-base">
              Fai indovinare la parola principale senza usare i 5 taboo. Turno
              rapido da 60 secondi, punteggio live e controllo anche per carta
              sbagliata o taboo pronunciato.
            </p>
          </div>

          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-amber-100">
            <MessageCircle className="size-5" />
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,253,249,1)_0%,rgba(255,246,232,0.99)_100%)] p-4 text-slate-950 shadow-[0_40px_90px_-50px_rgba(245,158,11,0.5)] sm:p-5">
          {gameState === "idle" ? (
            <div className="space-y-5">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <ShieldBan className="size-4 text-rose-500" />
                  <span>{parole.length} carte pronte</span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                    Intro game
                  </p>
                  <h2 className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
                    TAB-WHO ?
                  </h2>
                  <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
                    Scegli il tempo del round, controlla la carta pronta e fai
                    partire il turno quando vuoi.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-stretch">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="space-y-3 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Carta pronta
                    </p>
                    <h3 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                      {currentCard.parola}
                    </h3>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {currentCard.taboo.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-slate-800"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Durata turno
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {durationOptions.map((option) => {
                        const isActive = selectedDuration === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSelectedDuration(option);
                              setTimeLeft(option);
                            }}
                            className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition duration-300 ${
                              isActive
                                ? "border-amber-300 bg-amber-50 text-slate-950 shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {option}s
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Scegli un round rapido da 30 secondi, classico da 60 o piu
                      lungo da 180.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Prima di partire
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Puoi cambiare la carta pronta tutte le volte che vuoi
                      prima di avviare il round.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={startGame}
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  Inizia Gioco
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<Shuffle className="size-4" />}
                  onClick={loadPreviewCard}
                  className="!border-slate-200 !bg-white !text-slate-900 shadow-sm hover:!bg-slate-100 hover:!text-slate-950"
                  style={lightActionButtonStyle}
                >
                  Nuova Parola
                </Button>
                <Link
                  href="/"
                  className={buttonStyles({
                    variant: "ghost",
                    className:
                      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                  })}
                >
                  <House className="size-4" />
                  <span>Torna a The Choiser</span>
                </Link>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Regole rapide
                  </p>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    <p>Corretto: +1 punto e nuova carta.</p>
                    <p>Sbagliata: nessun punto e carta persa.</p>
                    <p>Prossima parola: passi oltre senza segnare.</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Per The Choiser
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Mini-gioco party, rapido da avviare e facile da estendere
                    con nuove carte nel dataset.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="sticky top-3 z-20 -mx-1 rounded-[24px] border border-slate-200/80 bg-white/92 p-3 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:hidden">
                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-[18px] border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Timer
                    </p>
                    <p className="font-heading mt-1 text-2xl font-semibold">
                      {timeLeft}s
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Punti
                    </p>
                    <p className="font-heading mt-1 text-2xl font-semibold">
                      {score}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Errori
                    </p>
                    <p className="font-heading mt-1 text-2xl font-semibold text-rose-600">
                      {mistakes}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={finishTurn}
                    disabled={gameState !== "playing"}
                    className="rounded-[18px] border border-slate-200 bg-white/90 px-3 py-2 text-left shadow-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Turno
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Termina
                    </p>
                  </button>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Clock3 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Timer
                      </p>
                      <p className="font-heading mt-1 text-3xl font-semibold">
                        {timeLeft}s
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Punteggio
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold">
                    {score}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    +1 per ogni risposta corretta.
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Sbagliate
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-rose-600">
                    {mistakes}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Carte perse per errore o taboo.
                  </p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Stato turno
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {gameState === "finished" ? "Tempo finito!" : "Turno attivo"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {statusCopy}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentCard.parola}-${cardIndex}-${gameState}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.35)] sm:p-5"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
                    <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_100%)] p-4 sm:p-6">
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Parola principale
                        </p>
                        <h3 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                          {currentCard.parola}
                        </h3>
                        <p className="max-w-md text-sm leading-6 text-slate-600 sm:hidden">
                          Descrivila senza usare i taboo.
                        </p>
                        <p className="hidden max-w-md text-sm leading-6 text-slate-600 sm:block">
                          Descrivila senza mai pronunciare le parole nella colonna
                          a destra.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500 text-white">
                          <ShieldBan className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
                            Parole proibite
                          </p>
                          <p className="mt-1 text-sm text-rose-700">
                            Se ne usi una, premi Sbagliata.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        {currentCard.taboo.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
                <Button
                  type="button"
                  icon={<CheckCircle2 className="size-4" />}
                  onClick={handleCorrect}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center bg-emerald-500 text-white hover:bg-emerald-400"
                >
                  Corretto
                </Button>
                <Button
                  type="button"
                  icon={<TriangleAlert className="size-4" />}
                  onClick={handleWrong}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center bg-rose-500 text-white hover:bg-rose-400"
                >
                  Sbagliata / Taboo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<SkipForward className="size-4" />}
                  onClick={handleSkip}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center !border-slate-200 !bg-white !text-slate-900 shadow-sm hover:!bg-slate-100 hover:!text-slate-950"
                >
                  Prossima parola
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<Square className="size-4" />}
                  onClick={finishTurn}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center !border !border-slate-200 !bg-white !text-slate-700 shadow-sm hover:!bg-slate-100 hover:!text-slate-950"
                >
                  Termina turno
                </Button>
              </div>

              <div className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 gap-3 rounded-[28px] border border-slate-200/80 bg-white/92 p-3 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:hidden">
                <Button
                  type="button"
                  icon={<CheckCircle2 className="size-4" />}
                  onClick={handleCorrect}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center bg-emerald-500 text-white hover:bg-emerald-400"
                >
                  Corretto
                </Button>
                <Button
                  type="button"
                  icon={<TriangleAlert className="size-4" />}
                  onClick={handleWrong}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center bg-rose-500 text-white hover:bg-rose-400"
                >
                  Taboo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<SkipForward className="size-4" />}
                  onClick={handleSkip}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center !border-slate-200 !bg-white !text-slate-900 shadow-sm hover:!bg-slate-100 hover:!text-slate-950"
                >
                  Prossima
                </Button>
              </div>

              <div className="hidden gap-3 lg:grid lg:grid-cols-3">
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Regole rapide
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Corretto fa punto. Sbagliata segna errore. Salta non da ne
                    toglie punti.
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Round stats
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Carte viste: <span className="font-semibold">{cardsSeen}</span>
                    <br />
                    Ultimo esito:{" "}
                    <span className="font-semibold">
                      {lastAction === "correct"
                        ? "Corretta"
                        : lastAction === "wrong"
                          ? "Sbagliata"
                          : lastAction === "skip"
                            ? "Saltata"
                            : "Nessuno"}
                    </span>
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/82 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Dataset
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {parole.length} carte iniziali, con 5 taboo per parola e
                    categorie miste per partite veloci.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {gameState === "finished" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-950/95 p-6 text-center shadow-[0_40px_100px_-60px_rgba(0,0,0,0.95)]"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-300/14 text-amber-100">
                <Trophy className="size-6" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-white/45">
                Fine turno
              </p>
              <h3 className="font-heading mt-3 text-4xl font-semibold text-white">
                Tempo finito!
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/64">
                Hai chiuso il round con questo riepilogo:
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Punti
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-white">
                    {score}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Sbagliate
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-rose-200">
                    {mistakes}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Carte viste
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-white">
                    {cardsSeen}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={restartGame}
                >
                  Rigioca
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<RotateCcw className="size-4" />}
                  onClick={resetToIntro}
                  className="!border-white/16 !bg-white !text-slate-950 shadow-sm hover:!bg-slate-100 hover:!text-slate-950"
                  style={lightActionButtonStyle}
                >
                  Nuova partita
                </Button>
                <Link
                  href="/games"
                  className={buttonStyles({
                    variant: "ghost",
                    className:
                      "border border-white/10 bg-white/6 text-white/78 hover:bg-white/10 hover:text-white",
                  })}
                >
                  <ArrowLeft className="size-4" />
                  <span>Torna ai giochi</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
