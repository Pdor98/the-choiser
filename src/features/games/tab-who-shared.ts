import type { TabWhoCard } from "@/features/games/tab-who-data";

export const durationOptions = [30, 60, 180] as const;

export type TabWhoDuration = (typeof durationOptions)[number];
export type TabWhoGameState = "idle" | "playing" | "finished";
export type TabWhoLastAction = "skip" | "correct" | "wrong" | null;
export type TabWhoRoomPhase = "lobby" | "playing" | "finished";

export type TabWhoRoomPlayer = {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
};

export type TabWhoRoomSnapshot = {
  code: string;
  phase: TabWhoRoomPhase;
  version: number;
  players: TabWhoRoomPlayer[];
  selectedDuration: TabWhoDuration;
  timeLeft: number;
  score: number;
  mistakes: number;
  cardsSeen: number;
  lastAction: TabWhoLastAction;
  currentCard: TabWhoCard | null;
  createdAt: number;
  updatedAt: number;
  startedAt: number | null;
  hostId: string;
};

export type TabWhoRoomCreatePayload = {
  playerName: string;
  selectedDuration: TabWhoDuration;
};

export type TabWhoRoomJoinPayload = {
  playerName: string;
};

export type TabWhoRoomActionType =
  | "start"
  | "correct"
  | "wrong"
  | "skip"
  | "finish"
  | "restart"
  | "return-to-lobby"
  | "set-duration"
  | "leave";

export type TabWhoRoomActionPayload = {
  type: TabWhoRoomActionType;
  playerId: string;
  selectedDuration?: TabWhoDuration;
};

export type TabWhoRoomMutationResponse = {
  room: TabWhoRoomSnapshot;
  playerId?: string;
};

export function isTabWhoDuration(value: unknown): value is TabWhoDuration {
  return (
    typeof value === "number" &&
    durationOptions.includes(value as TabWhoDuration)
  );
}

export function sanitizePlayerName(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

export function shuffleTabWhoDeck(cards: TabWhoCard[]) {
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
