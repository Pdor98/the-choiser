"use client";

import { Smartphone, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/55">
              Modalita TAB-WHO?
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Scegli se giocare da solo o in stanza.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              La versione classica resta immediata. La stanza locale aggiunge
              codice condiviso e sincronizzazione tra piu dispositivi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={activeMode === "solo" ? "primary" : "ghost"}
              icon={<Smartphone className="size-4" />}
              onClick={() => setMode("solo")}
            >
              Solo rapido
            </Button>
            {roomModeEnabled ? (
              <Button
                type="button"
                variant={activeMode === "room" ? "primary" : "ghost"}
                icon={<Users className="size-4" />}
                onClick={() => setMode("room")}
              >
                Stanza locale
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {activeMode === "solo" ? <TabWhoGame /> : <TabWhoRoomGame />}
    </div>
  );
}
