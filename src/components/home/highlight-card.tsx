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
    <Card className="h-full border-white/12 bg-slate-900/76 p-5">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] text-white">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm leading-7 text-white/76">{description}</p>
        </div>
      </div>
    </Card>
  );
}
