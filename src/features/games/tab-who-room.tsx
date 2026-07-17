"use client";

import {
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Crown,
  DoorOpen,
  Link2,
  LoaderCircle,
  Play,
  QrCode,
  RefreshCcw,
  Share2,
  SkipForward,
  TriangleAlert,
  Trophy,
  Users,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type TabWhoDuration,
  type TabWhoRoomMutationResponse,
  type TabWhoRoomSnapshot,
} from "@/features/games/tab-who-shared";

const DEFAULT_ROOM_DURATION: TabWhoDuration = 60;
type ShareMode = "manual" | "qr";

type ApiError = {
  error?: string;
};

function roomStorageKey(code: string) {
  return `tabwho-room:${code}:playerId`;
}

function normalizeRoomCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as T | ApiError | null;

  if (!response.ok) {
    throw new Error(
      (payload as ApiError | null)?.error ?? "Richiesta non riuscita.",
    );
  }

  return payload as T;
}

export function TabWhoRoomGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = normalizeRoomCode(searchParams.get("room") ?? "");

  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState(roomCode);
  const [room, setRoom] = useState<TabWhoRoomSnapshot | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMode, setShareMode] = useState<ShareMode>("manual");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const autoCreateStartedRef = useRef(false);

  useEffect(() => {
    setJoinCode(roomCode);

    if (!roomCode) {
      setPlayerId(null);
      setRoom(null);
      return;
    }

    const storedPlayerId = window.localStorage.getItem(roomStorageKey(roomCode));
    setPlayerId(storedPlayerId);
  }, [roomCode]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  useEffect(() => {
    if (!roomCode) {
      return undefined;
    }

    let cancelled = false;

    async function refreshRoom() {
      try {
        const payload = await requestJson<{ room: TabWhoRoomSnapshot }>(
          `/api/tab-who/rooms/${roomCode}`,
          { method: "GET" },
        );

        if (!cancelled) {
          setRoom(payload.room);
          setError(null);
        }
      } catch (refreshError) {
        if (cancelled) {
          return;
        }

        setRoom(null);
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Stanza non disponibile.",
        );
      }
    }

    void refreshRoom();
    const intervalId = window.setInterval(refreshRoom, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [roomCode]);

  const me = useMemo(
    () => room?.players.find((player) => player.id === playerId) ?? null,
    [playerId, room],
  );
  const activePlayer = useMemo(
    () =>
      room?.players.find((player) => player.id === room.activePlayerId) ?? null,
    [room],
  );

  const isHost = me?.id === room?.hostId;
  const isActivePlayer = Boolean(me && room && me.id === room.activePlayerId);
  const canControlRound = Boolean(room && (isHost || isActivePlayer));
  const shareUrl =
    typeof window !== "undefined" && roomCode
      ? `${window.location.origin}/games/tab-who?room=${roomCode}`
      : "";
  const shareHint =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "Sugli altri dispositivi apri Choiser con l'indirizzo di rete del computer host, poi inserisci questo codice stanza."
      : "Se tutti usano questo stesso indirizzo, puoi condividere il link o il codice stanza.";

  useEffect(() => {
    let cancelled = false;

    if (!shareUrl) {
      setQrDataUrl("");
      return undefined;
    }

    void QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 240,
      color: {
        dark: "#0b1628",
        light: "#f7fbff",
      },
    })
      .then((dataUrl) => {
        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shareUrl]);

  const statusCopy = useMemo(() => {
    if (!room) {
      return "Crea una stanza o entra con un codice per sincronizzare il gioco su piu dispositivi.";
    }

    if (room.phase === "lobby") {
      return activePlayer
        ? `La stanza e pronta. Tocca a ${activePlayer.name} iniziare quando l'host avvia il round.`
        : "La stanza e pronta. L'host avvia il round quando siete pronti.";
    }

    if (room.phase === "finished") {
      return activePlayer
        ? `Round concluso. Potete rigiocare subito o passare il turno a ${activePlayer.name}.`
        : "Round concluso. Potete rigiocare subito o tornare in lobby.";
    }

    if (room.lastAction === "correct") {
      return "Parola corretta: punto segnato e carta successiva caricata.";
    }

    if (room.lastAction === "wrong") {
      return "Carta persa per errore o taboo pronunciato.";
    }

    if (room.lastAction === "skip") {
      return "Carta saltata. Il gruppo passa subito oltre.";
    }

    return "Ogni telefono vede lo stesso round aggiornato in tempo reale.";
  }, [activePlayer, room]);

  const goToRoom = useCallback(async (nextCode: string, nextPlayerId: string) => {
    window.localStorage.setItem(roomStorageKey(nextCode), nextPlayerId);
    setPlayerId(nextPlayerId);
    router.replace(`/games/tab-who?room=${nextCode}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (roomCode || autoCreateStartedRef.current) {
      return undefined;
    }

    autoCreateStartedRef.current = true;
    setBusy("auto-create");
    setError(null);

    void requestJson<TabWhoRoomMutationResponse>("/api/tab-who/rooms", {
      method: "POST",
      body: JSON.stringify({
        playerName: "Host",
        selectedDuration: DEFAULT_ROOM_DURATION,
      }),
    })
      .then((payload) => {
        setRoom(payload.room);

        if (payload.playerId) {
          void goToRoom(payload.room.code, payload.playerId);
        }
      })
      .catch((createError) => {
        setError(
          createError instanceof Error
            ? createError.message
            : "Impossibile creare automaticamente la stanza.",
        );
      })
      .finally(() => {
        setBusy(null);
      });
  }, [goToRoom, roomCode, router]);

  async function handleJoinRoom() {
    const nextCode = normalizeRoomCode(joinCode || roomCode);

    if (!nextCode) {
      setError("Inserisci un codice stanza valido.");
      return;
    }

    try {
      setBusy("join");
      setError(null);

      const payload = await requestJson<TabWhoRoomMutationResponse>(
        `/api/tab-who/rooms/${nextCode}/join`,
        {
          method: "POST",
          body: JSON.stringify({
            playerName: joinName,
          }),
        },
      );

      setRoom(payload.room);

      if (payload.playerId) {
        await goToRoom(nextCode, payload.playerId);
      }
    } catch (joinError) {
      setError(
        joinError instanceof Error
          ? joinError.message
          : "Impossibile entrare nella stanza.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleAction(
    type:
      | "start"
      | "correct"
      | "wrong"
      | "skip"
      | "finish"
      | "restart"
      | "return-to-lobby"
      | "set-duration"
      | "set-active-player"
      | "advance-player"
      | "leave",
    nextDuration?: TabWhoDuration,
    targetPlayerId?: string,
  ) {
    if (!roomCode || !playerId) {
      setError("Devi essere dentro una stanza per inviare azioni.");
      return;
    }

    try {
      setBusy(type);
      setError(null);

      const payload = await requestJson<{ room: TabWhoRoomSnapshot }>(
        `/api/tab-who/rooms/${roomCode}/action`,
        {
          method: "POST",
          body: JSON.stringify({
            type,
            playerId,
            selectedDuration: nextDuration,
            targetPlayerId,
          }),
        },
      );

      setRoom(payload.room);
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "Impossibile aggiornare il round.";

      if (type === "leave" || message === "Stanza chiusa.") {
        if (roomCode) {
          window.localStorage.removeItem(roomStorageKey(roomCode));
        }

        setRoom(null);
        setPlayerId(null);
        router.replace("/games/tab-who", { scroll: false });
      }

      setError(message);
    } finally {
      setBusy(null);
    }
  }

  async function handleCopyRoom() {
    try {
      if (!shareUrl) {
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setError("Non sono riuscito a copiare il link della stanza.");
    }
  }

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-cyan-300/10 bg-[linear-gradient(180deg,rgba(7,18,33,0.96),rgba(9,22,39,0.92))] p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-cyan-300/10 via-sky-400/8 to-transparent" />
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/62">
                Stanza locale
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                TAB-WHO? multi-dispositivo
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Create una stanza, condividete il codice e sincronizzate il round
                su piu telefoni.
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.07] text-cyan-100">
              <Wifi className="size-5" />
            </div>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-rose-400/18 bg-rose-500/8 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {!roomCode ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex items-center gap-3 rounded-[26px] border border-cyan-300/14 bg-cyan-300/[0.045] p-5">
                <LoaderCircle className="size-5 shrink-0 animate-spin text-cyan-200" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    La stanza si crea automaticamente
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Appena pronta compariranno codice, link e QR da condividere.
                  </p>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Entra con codice
                </p>
                <div className="mt-4 space-y-3">
                  <Input
                    value={joinName}
                    onChange={(event) => setJoinName(event.target.value)}
                    placeholder="Il tuo nickname"
                    maxLength={24}
                  />
                  <Input
                    value={joinCode}
                    onChange={(event) =>
                      setJoinCode(normalizeRoomCode(event.target.value))
                    }
                    placeholder="Codice stanza"
                    maxLength={6}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    icon={
                      busy === "join" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <DoorOpen className="size-4" />
                      )
                    }
                    onClick={handleJoinRoom}
                    disabled={busy !== null}
                    className="w-full justify-center"
                  >
                    Entra nella stanza
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {roomCode && !playerId ? (
            <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                Entra nella stanza {roomCode}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <Input
                  value={joinName}
                  onChange={(event) => setJoinName(event.target.value)}
                  placeholder="Il tuo nickname"
                  maxLength={24}
                />
                <Button
                  type="button"
                  variant="secondary"
                  icon={
                    busy === "join" ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <DoorOpen className="size-4" />
                    )
                  }
                  onClick={handleJoinRoom}
                  disabled={busy !== null}
                  className="w-full justify-center"
                >
                  Entra adesso
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {room ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/55">
                    Room code
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-heading text-4xl font-semibold tracking-[0.18em] text-white">
                      {room.code}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      icon={<Share2 className="size-4" />}
                      onClick={() => setShareOpen((current) => !current)}
                      className="min-h-10 px-4"
                    >
                      {shareOpen ? "Chiudi" : "Condividi"}
                    </Button>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    {statusCopy}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                    Stato
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {room.phase === "lobby"
                      ? "Lobby"
                      : room.phase === "playing"
                        ? "Round attivo"
                        : "Round concluso"}
                  </p>
                </div>
              </div>

              {shareOpen ? (
                <div className="mt-5 rounded-[26px] border border-cyan-300/14 bg-cyan-300/[0.045] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">
                        Condividi la stanza
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        Scegli come far entrare gli altri giocatori.
                      </p>
                    </div>

                    <div className="inline-flex w-fit rounded-full border border-white/10 bg-slate-950/45 p-1">
                      <button
                        type="button"
                        aria-pressed={shareMode === "manual"}
                        onClick={() => setShareMode("manual")}
                        className={[
                          "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition",
                          shareMode === "manual"
                            ? "bg-white text-slate-950"
                            : "text-slate-300 hover:text-white",
                        ].join(" ")}
                      >
                        <Link2 className="size-3.5" />
                        Manuale
                      </button>
                      <button
                        type="button"
                        aria-pressed={shareMode === "qr"}
                        onClick={() => setShareMode("qr")}
                        className={[
                          "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition",
                          shareMode === "qr"
                            ? "bg-cyan-200 text-slate-950"
                            : "text-slate-300 hover:text-white",
                        ].join(" ")}
                      >
                        <QrCode className="size-3.5" />
                        QR code
                      </button>
                    </div>
                  </div>

                  {shareMode === "manual" ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                      <Input value={shareUrl} readOnly aria-label="Link della stanza" />
                      <Button
                        type="button"
                        variant="secondary"
                        icon={<Copy className="size-4" />}
                        onClick={handleCopyRoom}
                        className="w-full justify-center md:w-auto"
                      >
                        {copied ? "Copiato" : "Copia link"}
                      </Button>
                      <p className="text-xs leading-5 text-slate-400 md:col-span-2">
                        {shareHint}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-5 rounded-[22px] border border-white/10 bg-slate-950/35 p-4 md:grid-cols-[240px_minmax(0,1fr)] md:items-center">
                      <div className="mx-auto rounded-2xl bg-white p-3">
                        {qrDataUrl ? (
                          <Image
                            src={qrDataUrl}
                            alt="QR code per entrare nella stanza"
                            width={192}
                            height={192}
                            unoptimized
                            className="size-48"
                          />
                        ) : (
                          <div className="flex size-48 items-center justify-center text-center text-xs text-slate-500">
                            Generazione QR...
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <QrCode className="size-4 text-cyan-200" />
                          Scansiona per entrare
                        </div>
                        <p className="text-sm leading-6 text-slate-300">
                          Chi scansiona il codice apre direttamente questa stanza
                          sul proprio dispositivo.
                        </p>
                        <p className="text-xs leading-5 text-slate-400">
                          Se il QR non viene letto, usa il codice stanza{" "}
                          <span className="font-semibold tracking-[0.18em] text-cyan-100">
                            {room.code}
                          </span>{" "}
                          manualmente.
                        </p>
                        <p className="text-xs leading-5 text-cyan-100/65">
                          {shareHint}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <MetricCard
                  icon={<Users className="size-4" />}
                  label="Giocatori"
                  value={String(room.players.length)}
                  text="Tutti vedono lo stesso round."
                />
                <MetricCard
                  icon={<Clock3 className="size-4" />}
                  label="Timer"
                  value={`${room.timeLeft}s`}
                  text="Tempo del round"
                />
                <MetricCard
                  icon={<Trophy className="size-4" />}
                  label="Punti"
                  value={String(room.score)}
                  text="Aggiornati per tutti"
                />
                <MetricCard
                  icon={<Users className="size-4" />}
                  label="Turno attivo"
                  value={activePlayer?.name ?? "Host"}
                  text={
                    room.phase === "playing"
                      ? "Solo host o giocatore attivo comandano il round."
                      : "L'host puo scegliere chi parte."
                  }
                />
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-100">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Partecipanti
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    L&apos;host avvia il round, tutti possono seguirlo in tempo reale.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {room.players.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() =>
                      isHost && player.id !== room.activePlayerId
                        ? void handleAction("set-active-player", undefined, player.id)
                        : null
                    }
                    disabled={!isHost || busy !== null || player.id === room.activePlayerId}
                    className={`flex items-center justify-between rounded-[22px] border px-4 py-3 text-left transition duration-300 ${
                      player.id === room.activePlayerId
                        ? "border-cyan-300/28 bg-cyan-300/10"
                        : "border-white/10 bg-white/[0.04]"
                    } ${isHost ? "hover:border-white/18 hover:bg-white/[0.06]" : ""} disabled:cursor-default disabled:opacity-100`}
                  >
                    <div className="flex items-center gap-2 text-sm text-white">
                      <span>{player.name}</span>
                      {player.id === playerId ? (
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cyan-100">
                          Tu
                        </span>
                      ) : null}
                      {player.id === room.activePlayerId ? (
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-100">
                          Attivo
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {player.isHost ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-100/85">
                          <Crown className="size-3.5" />
                          Host
                        </span>
                      ) : null}
                      {isHost && player.id !== room.activePlayerId ? (
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/36">
                          Tocca qui
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-slate-300">
                {isHost
                  ? "Puoi scegliere chi descrive cliccando un partecipante. Durante il round il giocatore attivo e l'host possono segnare le carte."
                  : activePlayer?.id === playerId
                    ? "Tocca a te descrivere: puoi segnare corretto, taboo o passare alla prossima carta."
                    : activePlayer
                      ? `Adesso descrive ${activePlayer.name}. Tu puoi seguire il round dal tuo telefono.`
                      : "Aspetta che l'host assegni il primo giocatore."}
              </div>

              <Button
                type="button"
                variant="ghost"
                icon={
                  busy === "leave" ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <DoorOpen className="size-4" />
                  )
                }
                onClick={() => void handleAction("leave")}
                disabled={busy !== null}
                className="mt-5 w-full justify-center"
              >
                Esci dalla stanza
              </Button>
            </Card>
          </div>

          {room.phase === "lobby" ? (
            <Card className="p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/55">
                    Prima del round
                  </p>
                  <h3 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Tutti dentro, poi si parte.
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {isHost
                      ? "Decidi chi inizia e avvia il turno. Gli altri dispositivi si sincronizzano da soli."
                      : activePlayer?.id === playerId
                        ? "Tocca a te iniziare appena l'host avvia il round."
                        : activePlayer
                          ? `Aspetta che l'host avvii il round: il primo a descrivere sara ${activePlayer.name}.`
                          : "Aspetta che l'host avvii il round. Quando parte, la carta e il timer si aggiornano su tutti i device."}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="mt-4 rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">
                      Giocatore iniziale
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {activePlayer?.name ?? "Host"}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {isHost
                        ? "Puoi cambiarlo dalla lista partecipanti prima di partire."
                        : "Solo l'host puo cambiare chi descrive per primo."}
                    </p>
                  </div>

                  <Button
                    type="button"
                    icon={
                      busy === "start" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Play className="size-4" />
                      )
                    }
                    onClick={() => void handleAction("start")}
                    disabled={!isHost || busy !== null}
                    className="mt-5 w-full justify-center"
                  >
                    Avvia round condiviso
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="relative overflow-hidden p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-cyan-300/10 via-sky-300/8 to-transparent" />

              <div className="relative space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={<Clock3 className="size-4" />}
                    label="Timer"
                    value={`${room.timeLeft}s`}
                    text="Tempo del round"
                  />
                  <MetricCard
                    icon={<Trophy className="size-4" />}
                    label="Punteggio"
                    value={String(room.score)}
                    text="Corretto: +1"
                  />
                  <MetricCard
                    icon={<TriangleAlert className="size-4" />}
                    label="Errori"
                    value={String(room.mistakes)}
                    text="Taboo o parola persa"
                  />
                  <MetricCard
                    icon={<Users className="size-4" />}
                    label="Carte viste"
                    value={String(room.cardsSeen)}
                    text={`Versione ${room.version}`}
                  />
                </div>

                {room.currentCard ? (
                  <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.35)] sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Sta descrivendo
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                          {activePlayer?.id === playerId
                            ? "Tocca a te"
                            : activePlayer?.name ?? "Host"}
                        </p>
                      </div>
                      {isHost ? (
                        <Button
                          type="button"
                          variant="ghost"
                          icon={
                            busy === "advance-player" ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <ArrowRightLeft className="size-4" />
                            )
                          }
                          onClick={() => void handleAction("advance-player")}
                          disabled={busy !== null}
                          className="min-h-10 px-4 !border !border-slate-200 !bg-white !text-slate-700 hover:!bg-slate-100 hover:!text-slate-950"
                        >
                          Prossimo giocatore
                        </Button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
                      <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_100%)] p-4 sm:p-6">
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                            Parola principale
                          </p>
                          <h3 className="font-heading text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                            {room.currentCard.parola}
                          </h3>
                          <p className="max-w-md text-sm leading-6 text-slate-600">
                            {activePlayer?.id === playerId
                              ? "Descrivila tu senza usare le parole proibite."
                              : activePlayer
                                ? `${activePlayer.name} sta descrivendo questa carta adesso.`
                                : "Il gruppo vede la stessa carta su ogni dispositivo."}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500 text-white">
                            <TriangleAlert className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
                              Parole proibite
                            </p>
                            <p className="mt-1 text-sm text-rose-700">
                              Se ne esce una, segnate Errore / Taboo.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                          {room.currentCard.taboo.map((item) => (
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
                  </div>
                ) : null}

                {room.phase === "playing" && !canControlRound ? (
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/72 px-4 py-3 text-sm leading-6 text-white/72">
                    {activePlayer
                      ? `Solo ${activePlayer.name} o l'host possono usare i controlli di questo turno.`
                      : "Aspetta che l'host assegni il giocatore attivo."}
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Button
                    type="button"
                    icon={
                      busy === "correct" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )
                    }
                    onClick={() => void handleAction("correct")}
                    disabled={room.phase !== "playing" || busy !== null || !canControlRound}
                    className="w-full justify-center bg-emerald-500 text-white hover:bg-emerald-400"
                  >
                    Corretto
                  </Button>
                  <Button
                    type="button"
                    icon={
                      busy === "wrong" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <TriangleAlert className="size-4" />
                      )
                    }
                    onClick={() => void handleAction("wrong")}
                    disabled={room.phase !== "playing" || busy !== null || !canControlRound}
                    className="w-full justify-center bg-rose-500 text-white hover:bg-rose-400"
                  >
                    Errore / Taboo
                  </Button>
                  <Button
                    type="button"
                    icon={
                      busy === "skip" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <SkipForward className="size-4" />
                      )
                    }
                    onClick={() => void handleAction("skip")}
                    disabled={room.phase !== "playing" || busy !== null || !canControlRound}
                    className="w-full justify-center bg-slate-950 text-white hover:bg-slate-800"
                  >
                    Prossima parola
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    icon={
                      busy === "finish" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="size-4" />
                      )
                    }
                    onClick={() =>
                      void handleAction(
                        room.phase === "playing" ? "finish" : "return-to-lobby",
                      )
                    }
                    disabled={busy !== null || (room.phase === "playing" && !canControlRound)}
                    className="w-full justify-center"
                  >
                    {room.phase === "playing" ? "Chiudi round" : "Torna in lobby"}
                  </Button>
                </div>

                {room.phase === "finished" ? (
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/72 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Fine turno
                    </p>
                    <h3 className="font-heading mt-3 text-3xl font-semibold tracking-tight">
                      Round condiviso concluso.
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                      Se siete pronti per un altro giro, l&apos;host puo far ripartire
                      tutto da qui o riportare il gruppo in lobby.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        icon={
                          busy === "advance-player" ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <ArrowRightLeft className="size-4" />
                          )
                        }
                        onClick={() => void handleAction("advance-player")}
                        disabled={!isHost || busy !== null}
                      >
                        Passa il turno
                      </Button>
                      <Button
                        type="button"
                        icon={
                          busy === "restart" ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Play className="size-4" />
                          )
                        }
                        onClick={() => void handleAction("restart")}
                        disabled={!isHost || busy !== null}
                      >
                        Rigioca round
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        icon={<RefreshCcw className="size-4" />}
                        onClick={() => void handleAction("return-to-lobby")}
                        disabled={!isHost || busy !== null}
                      >
                        Torna in lobby
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950/70 text-cyan-100">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/40">
            {label}
          </p>
          <p className="font-heading mt-1 text-3xl font-semibold text-white">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}
