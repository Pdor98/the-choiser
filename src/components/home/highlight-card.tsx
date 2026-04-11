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
    <Card className="h-full border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,249,255,0.88))] p-5">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-sky-100/80 bg-white/84 text-sky-700">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-sm leading-7 text-slate-700">{description}</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-sky-200/80 via-slate-200/70 to-transparent" />
      </div>
    </Card>
  );
}
