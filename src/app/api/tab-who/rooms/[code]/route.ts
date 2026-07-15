import { NextResponse } from "next/server";

import {
  getRoomSnapshot,
  TabWhoRoomError,
} from "@/server/tab-who-room-store";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    return NextResponse.json({ room: getRoomSnapshot(code) });
  } catch (error) {
    if (error instanceof TabWhoRoomError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Impossibile leggere la stanza." },
      { status: 500 },
    );
  }
}
