import type { ReactNode } from "react";

import { SectionBadge } from "@/components/ui/section-badge";

type PageHeroProps = {
  badge: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHero({
  badge,
  title,
  description,
  aside,
}: PageHeroProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
      <div className="space-y-5">
        <SectionBadge>{badge}</SectionBadge>
        <div className="space-y-4">
          <h1 className="font-heading text-balance max-w-5xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      {aside ? <div className="w-full max-w-md xl:justify-self-end">{aside}</div> : null}
    </section>
  );
}
