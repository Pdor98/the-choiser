import { NextResponse } from "next/server";

import {
  createRoom,
  TabWhoRoomError,
} from "@/server/tab-who-room-store";
import {
  isTabWhoDuration,
  sanitizePlayerName,
  type TabWhoRoomCreatePayload,
} from "@/features/games/tab-who-shared";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TabWhoRoomCreatePayload>;
    const playerName = sanitizePlayerName(body.playerName);

    if (!isTabWhoDuration(body.selectedDuration)) {
      throw new TabWhoRoomError("Seleziona una durata valida.");
    }

    const result = createRoom(playerName, body.selectedDuration);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof TabWhoRoomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Impossibile creare la stanza adesso." },
      { status: 500 },
    );
  }
}
