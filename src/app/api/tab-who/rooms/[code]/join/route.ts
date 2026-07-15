import { NextResponse } from "next/server";

import {
  joinRoom,
  TabWhoRoomError,
} from "@/server/tab-who-room-store";
import {
  sanitizePlayerName,
  type TabWhoRoomJoinPayload,
} from "@/features/games/tab-who-shared";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const body = (await request.json()) as Partial<TabWhoRoomJoinPayload>;
    const playerName = sanitizePlayerName(body.playerName);

    const result = joinRoom(code, playerName);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof TabWhoRoomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Impossibile entrare nella stanza." },
      { status: 500 },
    );
  }
}
