import { parole } from "@/features/games/tab-who-data";
import {
  durationOptions,
  type TabWhoDuration,
  type TabWhoLastAction,
  type TabWhoRoomPlayer,
  type TabWhoRoomSnapshot,
  shuffleTabWhoDeck,
} from "@/features/games/tab-who-shared";

type InternalRoom = {
  code: string;
  version: number;
  createdAt: number;
  updatedAt: number;
  hostId: string;
  players: TabWhoRoomPlayer[];
  activePlayerId: string | null;
  selectedDuration: TabWhoDuration;
  phase: "lobby" | "playing" | "finished";
  startedAt: number | null;
  deck: typeof parole;
  cardIndex: number;
  score: number;
  mistakes: number;
  lastAction: TabWhoLastAction;
};

const ROOM_TTL_MS = 1000 * 60 * 60 * 6;
const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

declare global {
  var __tabWhoRoomStore: Map<string, InternalRoom> | undefined;
}

const roomStore = globalThis.__tabWhoRoomStore ?? new Map<string, InternalRoom>();

if (!globalThis.__tabWhoRoomStore) {
  globalThis.__tabWhoRoomStore = roomStore;
}

export class TabWhoRoomError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "TabWhoRoomError";
    this.status = status;
  }
}

function cleanupExpiredRooms() {
  const now = Date.now();

  for (const [code, room] of roomStore) {
    if (now - room.updatedAt > ROOM_TTL_MS) {
      roomStore.delete(code);
    }
  }
}

function createPreparedDeck(excludeWord?: string) {
  const nextDeck = shuffleTabWhoDeck(parole);

  if (
    excludeWord &&
    nextDeck.length > 1 &&
    nextDeck[0]?.parola === excludeWord
  ) {
    [nextDeck[0], nextDeck[1]] = [nextDeck[1], nextDeck[0]];
  }

  return nextDeck;
}

function generateRoomCode() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let code = "";

    for (let index = 0; index < 6; index += 1) {
      const charIndex = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
      code += ROOM_CODE_ALPHABET[charIndex];
    }

    if (!roomStore.has(code)) {
      return code;
    }
  }

  throw new TabWhoRoomError("Impossibile generare una stanza libera.", 500);
}

function clonePlayers(players: TabWhoRoomPlayer[]) {
  return players.map((player) => ({ ...player }));
}

function createGuestName(players: TabWhoRoomPlayer[]) {
  const existingNames = new Set(
    players.map((player) => player.name.toLowerCase()),
  );
  let guestNumber = 2;

  while (existingNames.has(`giocatore ${guestNumber}`)) {
    guestNumber += 1;
  }

  return `Giocatore ${guestNumber}`;
}

function getElapsedSeconds(room: InternalRoom) {
  if (room.phase !== "playing" || !room.startedAt) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - room.startedAt) / 1000));
}

function getTimeLeft(room: InternalRoom) {
  if (room.phase === "lobby") {
    return room.selectedDuration;
  }

  return Math.max(0, room.selectedDuration - getElapsedSeconds(room));
}

function syncRoomPhase(room: InternalRoom) {
  if (room.phase !== "playing") {
    return;
  }

  if (getTimeLeft(room) > 0) {
    return;
  }

  room.phase = "finished";
  room.lastAction = null;
  room.updatedAt = Date.now();
  room.version += 1;
}

function getRoomOrThrow(code: string) {
  cleanupExpiredRooms();

  const room = roomStore.get(code.toUpperCase());

  if (!room) {
    throw new TabWhoRoomError("Stanza non trovata o scaduta.", 404);
  }

  syncRoomPhase(room);
  return room;
}

function getPlayerOrThrow(room: InternalRoom, playerId: string) {
  const player = room.players.find((entry) => entry.id === playerId);

  if (!player) {
    throw new TabWhoRoomError("Giocatore non riconosciuto in questa stanza.", 403);
  }

  return player;
}

function buildSnapshot(room: InternalRoom): TabWhoRoomSnapshot {
  syncRoomPhase(room);

  return {
    code: room.code,
    phase: room.phase,
    version: room.version,
    players: clonePlayers(room.players),
    activePlayerId: room.activePlayerId,
    selectedDuration: room.selectedDuration,
    timeLeft: getTimeLeft(room),
    score: room.score,
    mistakes: room.mistakes,
    cardsSeen: room.phase === "lobby" ? 0 : room.cardIndex + 1,
    lastAction: room.lastAction,
    currentCard: room.deck[room.cardIndex] ?? null,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    startedAt: room.startedAt,
    hostId: room.hostId,
  };
}

function moveToNextCard(room: InternalRoom) {
  const currentWord = room.deck[room.cardIndex]?.parola;

  if (room.cardIndex + 1 < room.deck.length) {
    room.cardIndex += 1;
    return;
  }

  room.deck = createPreparedDeck(currentWord);
  room.cardIndex = 0;
}

function getNextPlayerId(room: InternalRoom, currentPlayerId?: string | null) {
  if (room.players.length === 0) {
    return null;
  }

  const activeId = currentPlayerId ?? room.activePlayerId;
  const currentIndex = room.players.findIndex((player) => player.id === activeId);

  if (currentIndex < 0) {
    return room.players[0]?.id ?? null;
  }

  const nextIndex = (currentIndex + 1) % room.players.length;
  return room.players[nextIndex]?.id ?? null;
}

function assertLobby(room: InternalRoom) {
  if (room.phase !== "lobby") {
    throw new TabWhoRoomError("Questa azione e disponibile solo nella lobby.");
  }
}

function assertPlaying(room: InternalRoom) {
  syncRoomPhase(room);

  if (room.phase !== "playing") {
    throw new TabWhoRoomError("Il round non e attivo.", 409);
  }
}

function assertHost(room: InternalRoom, playerId: string) {
  if (room.hostId !== playerId) {
    throw new TabWhoRoomError("Solo l'host puo fare questa azione.", 403);
  }
}

function assertRoundController(room: InternalRoom, playerId: string) {
  if (room.hostId === playerId || room.activePlayerId === playerId) {
    return;
  }

  throw new TabWhoRoomError(
    "Solo l'host o il giocatore attivo possono gestire questo turno.",
    403,
  );
}

export function createRoom(playerName: string, selectedDuration: TabWhoDuration) {
  cleanupExpiredRooms();

  if (!durationOptions.includes(selectedDuration)) {
    throw new TabWhoRoomError("Durata non valida.");
  }

  const name = playerName.trim();

  if (!name) {
    throw new TabWhoRoomError("Inserisci un nickname per creare la stanza.");
  }

  const playerId = crypto.randomUUID();
  const code = generateRoomCode();
  const now = Date.now();

  const room: InternalRoom = {
    code,
    version: 1,
    createdAt: now,
    updatedAt: now,
    hostId: playerId,
    players: [
      {
        id: playerId,
        name,
        isHost: true,
        joinedAt: now,
      },
    ],
    activePlayerId: playerId,
    selectedDuration,
    phase: "lobby",
    startedAt: null,
    deck: createPreparedDeck(),
    cardIndex: 0,
    score: 0,
    mistakes: 0,
    lastAction: null,
  };

  roomStore.set(code, room);
  return { room: buildSnapshot(room), playerId };
}

export function joinRoom(code: string, playerName: string) {
  const room = getRoomOrThrow(code);
  const name = playerName.trim() || createGuestName(room.players);

  const existing = room.players.find(
    (player) => player.name.toLowerCase() === name.toLowerCase(),
  );

  if (existing) {
    throw new TabWhoRoomError("Questo nickname e gia presente nella stanza.");
  }

  const playerId = crypto.randomUUID();

  room.players.push({
    id: playerId,
    name,
    isHost: false,
    joinedAt: Date.now(),
  });

  room.updatedAt = Date.now();
  room.version += 1;

  return { room: buildSnapshot(room), playerId };
}

export function getRoomSnapshot(code: string) {
  return buildSnapshot(getRoomOrThrow(code));
}

export function performRoomAction(
  code: string,
  playerId: string,
  action:
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
  selectedDuration?: TabWhoDuration,
  targetPlayerId?: string,
) {
  const room = getRoomOrThrow(code);
  getPlayerOrThrow(room, playerId);

  switch (action) {
    case "set-duration": {
      assertLobby(room);
      assertHost(room, playerId);

      if (!selectedDuration || !durationOptions.includes(selectedDuration)) {
        throw new TabWhoRoomError("Durata non valida.");
      }

      room.selectedDuration = selectedDuration;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "start": {
      assertLobby(room);
      assertHost(room, playerId);
      room.phase = "playing";
      room.startedAt = Date.now();
      room.score = 0;
      room.mistakes = 0;
      room.lastAction = null;
      room.cardIndex = 0;
      room.deck = createPreparedDeck(room.deck[room.cardIndex]?.parola);
      room.activePlayerId =
        room.activePlayerId && room.players.some((player) => player.id === room.activePlayerId)
          ? room.activePlayerId
          : room.hostId;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "restart": {
      assertHost(room, playerId);
      room.phase = "playing";
      room.startedAt = Date.now();
      room.score = 0;
      room.mistakes = 0;
      room.lastAction = null;
      room.cardIndex = 0;
      room.deck = createPreparedDeck(room.deck[room.cardIndex]?.parola);
      room.activePlayerId =
        room.activePlayerId && room.players.some((player) => player.id === room.activePlayerId)
          ? room.activePlayerId
          : room.hostId;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "finish": {
      assertPlaying(room);
      assertRoundController(room, playerId);
      room.phase = "finished";
      room.lastAction = null;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "return-to-lobby": {
      assertHost(room, playerId);
      room.phase = "lobby";
      room.startedAt = null;
      room.score = 0;
      room.mistakes = 0;
      room.lastAction = null;
      room.cardIndex = 0;
      room.deck = createPreparedDeck(room.deck[room.cardIndex]?.parola);
      room.activePlayerId =
        room.activePlayerId && room.players.some((player) => player.id === room.activePlayerId)
          ? room.activePlayerId
          : room.hostId;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "set-active-player": {
      assertHost(room, playerId);

      if (!targetPlayerId) {
        throw new TabWhoRoomError("Giocatore attivo mancante.");
      }

      getPlayerOrThrow(room, targetPlayerId);
      room.activePlayerId = targetPlayerId;
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "advance-player": {
      assertHost(room, playerId);
      room.activePlayerId = getNextPlayerId(room);
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "correct": {
      assertPlaying(room);
      assertRoundController(room, playerId);
      room.score += 1;
      room.lastAction = "correct";
      moveToNextCard(room);
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "wrong": {
      assertPlaying(room);
      assertRoundController(room, playerId);
      room.mistakes += 1;
      room.lastAction = "wrong";
      moveToNextCard(room);
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "skip": {
      assertPlaying(room);
      assertRoundController(room, playerId);
      room.lastAction = "skip";
      moveToNextCard(room);
      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    case "leave": {
      const nextPlayers = room.players.filter((player) => player.id !== playerId);

      if (nextPlayers.length === 0) {
        roomStore.delete(room.code);
        throw new TabWhoRoomError("Stanza chiusa.", 410);
      }

      if (!nextPlayers.some((player) => player.id === room.hostId)) {
        const nextHost = nextPlayers[0];
        room.hostId = nextHost.id;
        room.players = nextPlayers.map((player) => ({
          ...player,
          isHost: player.id === nextHost.id,
        }));
      } else {
        room.players = nextPlayers;
      }

      if (!room.players.some((player) => player.id === room.activePlayerId)) {
        room.activePlayerId = getNextPlayerId(room, playerId) ?? room.hostId;
      }

      room.updatedAt = Date.now();
      room.version += 1;
      break;
    }

    default: {
      const neverAction: never = action;
      throw new TabWhoRoomError(`Azione non supportata: ${neverAction}`);
    }
  }

  return buildSnapshot(room);
}
