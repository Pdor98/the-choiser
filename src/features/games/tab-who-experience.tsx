"use client";

import { Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TabWhoGame } from "@/features/games/tab-who";
import { TabWhoRoomGame } from "@/features/games/tab-who-room";

type TabWhoMode = "solo" | "room";
const roomModeEnabled = process.env.NEXT_PUBLIC_TABWHO_ROOM_ENABLED !== "false";

export function TabWhoExperience() {
  const searchParams = useSearchParams();
  const hasRoom = roomModeEnabled && Boolean(searchParams.get("room"));
  const [mode, setMode] = useState<TabWhoMode>(
    roomModeEnabled && hasRoom ? "room" : "solo",
  );
  const activeMode =
    roomModeEnabled && hasRoom ? "room" : roomModeEnabled ? mode : "solo";

  return (
    <div className="space-y-5">
      {roomModeEnabled && !hasRoom ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant={activeMode === "room" ? "secondary" : "ghost"}
            icon={<Users className="size-4" />}
            onClick={() => setMode(activeMode === "room" ? "solo" : "room")}
            className="min-h-10 px-4 text-xs"
          >
            {activeMode === "room" ? "Torna al gioco" : "Gioca con altri"}
          </Button>
        </div>
      ) : null}

      {activeMode === "solo" ? <TabWhoGame /> : <TabWhoRoomGame />}
    </div>
  );
}
