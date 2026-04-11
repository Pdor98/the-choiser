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
    <section className="space-y-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
        <SectionBadge>{badge}</SectionBadge>
        <div className="space-y-4">
          <h1 className="font-heading text-balance max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-8 text-white/76 sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      {aside ? <div className="mx-auto max-w-md">{aside}</div> : null}
    </section>
  );
}
