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
        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm leading-7 text-white/62">{description}</p>
        </div>
      </div>
    </Card>
  );
}
