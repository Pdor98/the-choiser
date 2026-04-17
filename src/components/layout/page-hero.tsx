import type { ReactNode } from "react";

import { SectionBadge } from "@/components/ui/section-badge";

type PageHeroProps = {
  badge: string;
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function PageHero({
  badge,
  title,
  description,
  aside,
}: PageHeroProps) {
  return (
    <section className="grid gap-5 sm:gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_360px] min-[1180px]:items-end">
      <div className="space-y-4 sm:space-y-5">
        <SectionBadge>{badge}</SectionBadge>
        <div className="space-y-4">
          <h1 className="font-heading max-w-5xl text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl xl:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {aside ? (
        <div className="w-full max-w-full min-[1180px]:max-w-md min-[1180px]:justify-self-end">
          {aside}
        </div>
      ) : null}
    </section>
  );
}
