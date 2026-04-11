import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

type HighlightCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function HighlightCard({
  title,
  description,
  icon: Icon,
}: HighlightCardProps) {
  return (
    <Card className="h-full border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.94),rgba(15,29,50,0.9))] p-5">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-300/16 bg-white/6 text-cyan-200">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-semibold text-slate-50">
            {title}
          </h3>
          <p className="text-sm leading-7 text-slate-300">{description}</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-cyan-300/24 via-white/8 to-transparent" />
      </div>
    </Card>
  );
}
