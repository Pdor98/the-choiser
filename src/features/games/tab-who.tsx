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

const turnDuration = 60;

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
  const [timeLeft, setTimeLeft] = useState(turnDuration);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const currentCard = deck[cardIndex] ?? deck[0];
  const progress = (timeLeft / turnDuration) * 100;
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
    setTimeLeft(turnDuration);
    setLastAction(null);
    setGameState("playing");
  }

  function restartGame() {
    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
    setScore(0);
    setMistakes(0);
    setTimeLeft(turnDuration);
    setLastAction(null);
    setGameState("playing");
  }

  function resetToIntro() {
    setDeck(createPreparedDeck(currentCard?.parola));
    setCardIndex(0);
    setScore(0);
    setMistakes(0);
    setTimeLeft(turnDuration);
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
    <Card className="relative overflow-hidden border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.96),rgba(14,28,48,0.92))] p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-cyan-300/16 via-indigo-300/8 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/12 blur-3xl" />

      <div className="relative space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className={gameState === "idle" ? "space-y-2" : "space-y-1.5 sm:space-y-2"}>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/66">
              Word challenge
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              TAB-WHO ?
            </h1>
            <p
              className={`max-w-2xl text-sm leading-6 text-slate-300 sm:text-base ${
                gameState === "idle" ? "" : "hidden sm:block"
              }`}
            >
              Fai indovinare la parola principale senza usare i 5 taboo. Turno
              rapido da 60 secondi, punteggio live e controllo anche per carta
              sbagliata o taboo pronunciato.
            </p>
          </div>

          <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-300/16 bg-white/6 text-cyan-200">
            <MessageCircle className="size-5" />
          </div>
        </div>

        <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,23,40,0.98)_0%,rgba(16,31,54,0.96)_100%)] p-4 text-slate-50 shadow-[0_40px_90px_-52px_rgba(37,99,235,0.3)] sm:p-5">
          {gameState === "idle" ? (
            <div className="space-y-5">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm">
                  <ShieldBan className="size-4 text-rose-500" />
                  <span>{parole.length} carte pronte</span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                    Intro game
                  </p>
                  <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
                    TAB-WHO ?
                  </h2>
                  <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300">
                    Avvia il turno, descrivi la parola e non farti scappare i
                    taboo. Prima di partire puoi cambiare la carta pronta quante
                    volte vuoi.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,31,53,0.94),rgba(11,22,39,0.92))] p-5 shadow-[0_20px_50px_-36px_rgba(37,99,235,0.22)]">
                  <div className="space-y-3 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
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
                        className="rounded-2xl border border-rose-400/18 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-50"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Regole rapide
                    </p>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      <p>Corretto: +1 punto e nuova carta.</p>
                      <p>Sbagliata: nessun punto e carta persa.</p>
                      <p>Salta: passi oltre senza segnare.</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Per The Choiser
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Mini-gioco party, rapido da avviare e facile da estendere
                      con nuove carte nel dataset.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
                <Button
                  type="button"
                  icon={<Play className="size-4" />}
                  onClick={startGame}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  Inizia Gioco
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<Shuffle className="size-4" />}
                  onClick={loadPreviewCard}
                  className="border-white/10 bg-white/6 text-slate-50 hover:bg-white/10"
                >
                  Nuova Parola
                </Button>
                <Link
                  href="/"
                  className={buttonStyles({
                    variant: "ghost",
                    className:
                      "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-slate-50",
                  })}
                >
                  <House className="size-4" />
                  <span>Torna a The Choiser</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-32 md:pb-0">
              {gameState === "playing" ? (
                <div className="sticky top-[5.1rem] z-10 md:hidden">
                  <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.96),rgba(14,28,48,0.94))] p-3 shadow-[0_24px_54px_-38px_rgba(15,23,42,0.62)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Timer
                        </p>
                        <p className="font-heading mt-1 text-3xl font-semibold text-slate-50">
                          {timeLeft}s
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        icon={<Square className="size-4" />}
                        onClick={finishTurn}
                        className="min-h-10 px-3 text-[13px]"
                      >
                        Termina
                      </Button>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-slate-200/12">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-[18px] border border-white/8 bg-white/6 px-3 py-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          Punti
                        </p>
                        <p className="font-heading mt-1 text-2xl font-semibold text-slate-50">
                          {score}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-white/6 px-3 py-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          Errori
                        </p>
                        <p className="font-heading mt-1 text-2xl font-semibold text-rose-300">
                          {mistakes}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-white/8 bg-white/6 px-3 py-2.5 text-center">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          Carte
                        </p>
                        <p className="font-heading mt-1 text-2xl font-semibold text-slate-50">
                          {cardsSeen}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-white/8 bg-white/6 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
                      <Clock3 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
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

                <div className="rounded-[22px] border border-white/8 bg-white/6 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Punteggio
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold">
                    {score}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    +1 per ogni risposta corretta.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/6 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Sbagliate
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-rose-600">
                    {mistakes}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Carte perse per errore o taboo.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/6 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Stato turno
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-50">
                    {gameState === "finished" ? "Tempo finito!" : "Turno attivo"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
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
                  className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,21,37,0.96),rgba(15,29,50,0.94))] p-4 shadow-[0_30px_70px_-50px_rgba(37,99,235,0.22)] sm:p-5"
                >
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
                    <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,31,53,0.96)_0%,rgba(12,24,42,0.94)_100%)] p-4 sm:p-6">
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-center sm:gap-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                          Parola principale
                        </p>
                        <h3 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl xl:text-7xl">
                          {currentCard.parola}
                        </h3>
                        <p className="max-w-md text-sm leading-5 text-slate-300 sm:leading-6">
                          Descrivila senza mai pronunciare le parole nella colonna
                          a destra.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-rose-400/18 bg-rose-400/10 p-3.5 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500 text-white">
                          <ShieldBan className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
                            Parole proibite
                          </p>
                          <p className="mt-1 text-sm text-rose-100/80">
                            Se ne usi una, premi Sbagliata.
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-1">
                        {currentCard.taboo.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-rose-400/18 bg-rose-50/10 px-3 py-2.5 text-sm font-semibold text-rose-50 shadow-sm"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
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
                  className="w-full justify-center border-white/10 bg-white/6 text-slate-50 hover:bg-white/10"
                >
                  Salta
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={<Square className="size-4" />}
                  onClick={finishTurn}
                  disabled={gameState !== "playing"}
                  className="w-full justify-center border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-slate-50"
                >
                  Termina turno
                </Button>
              </div>

              {gameState === "playing" ? (
                <div className="fixed inset-x-3 bottom-3 z-30 md:hidden">
                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,20,35,0.96),rgba(13,24,42,0.94))] p-3 shadow-[0_26px_70px_-38px_rgba(15,23,42,0.78)] backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        icon={<CheckCircle2 className="size-4" />}
                        onClick={handleCorrect}
                        disabled={gameState !== "playing"}
                        className="min-h-[3.2rem] w-full justify-center px-2 text-[13px] bg-emerald-500 text-white hover:bg-emerald-400"
                      >
                        Corretto
                      </Button>
                      <Button
                        type="button"
                        icon={<TriangleAlert className="size-4" />}
                        onClick={handleWrong}
                        disabled={gameState !== "playing"}
                        className="min-h-[3.2rem] w-full justify-center px-2 text-[13px] bg-rose-500 text-white hover:bg-rose-400"
                      >
                        Taboo
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        icon={<SkipForward className="size-4" />}
                        onClick={handleSkip}
                        disabled={gameState !== "playing"}
                        className="min-h-[3.2rem] w-full justify-center px-2 text-[13px] border-white/10 bg-white/6 text-slate-50 hover:bg-white/10"
                      >
                        Salta
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 xl:grid-cols-3">
                <div className="rounded-[22px] border border-white/8 bg-white/5 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Regole rapide
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Corretto fa punto. Sbagliata segna errore. Salta non da ne
                    toglie punti.
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-white/5 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Round stats
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
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
                <div className="rounded-[22px] border border-white/8 bg-white/5 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Dataset
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
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
            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/48 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full max-w-lg rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,21,37,0.98),rgba(15,29,50,0.96))] p-6 text-center shadow-[0_32px_80px_-48px_rgba(37,99,235,0.28)]"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
                <Trophy className="size-6" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-400">
                Fine turno
              </p>
              <h3 className="font-heading mt-3 text-4xl font-semibold text-slate-50">
                Tempo finito!
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Hai chiuso il round con questo riepilogo:
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Punti
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-slate-50">
                    {score}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Sbagliate
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-rose-600">
                    {mistakes}
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Carte viste
                  </p>
                  <p className="font-heading mt-2 text-4xl font-semibold text-slate-50">
                    {cardsSeen}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:justify-center">
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
                >
                  Nuova partita
                </Button>
                <Link
                  href="/games"
                  className={buttonStyles({
                    variant: "ghost",
                    className:
                      "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-slate-50",
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
