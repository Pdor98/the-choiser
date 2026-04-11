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
    <Card className="h-full p-5">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-100/12 bg-[linear-gradient(180deg,rgba(18,31,52,0.96),rgba(8,15,28,0.92))] text-cyan-100">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm leading-7 text-white/80">{description}</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-cyan-100/18 via-white/8 to-transparent" />
      </div>
    </Card>
  );
}
