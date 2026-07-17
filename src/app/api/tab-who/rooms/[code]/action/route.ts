import { NextResponse } from "next/server";

import {
  performRoomAction,
  TabWhoRoomError,
} from "@/server/tab-who-room-store";
import {
  isTabWhoDuration,
  type TabWhoRoomActionPayload,
} from "@/features/games/tab-who-shared";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const body = (await request.json()) as Partial<TabWhoRoomActionPayload>;

    if (!body.playerId) {
      throw new TabWhoRoomError("Giocatore mancante.");
    }

    if (!body.type) {
      throw new TabWhoRoomError("Azione mancante.");
    }

    const room = performRoomAction(
      code,
      body.playerId,
      body.type,
      isTabWhoDuration(body.selectedDuration) ? body.selectedDuration : undefined,
      body.targetPlayerId,
    );

    return NextResponse.json({ room });
  } catch (error) {
    if (error instanceof TabWhoRoomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Impossibile aggiornare la stanza." },
      { status: 500 },
    );
  }
}
