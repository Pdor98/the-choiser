import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_84%_14%,rgba(99,102,241,0.18),transparent_22%),radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.16),transparent_26%),linear-gradient(180deg,#07111d_0%,#0a1524_42%,#0d1b2e_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_44%,transparent_90%)] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(15,23,42,0.28),transparent)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-sky-400/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-16 h-[24rem] w-[24rem] rounded-full bg-indigo-400/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[88rem] flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6 lg:px-8">
        <SiteHeader />
        <main className="flex-1 pb-8 pt-1 sm:pt-2">{children}</main>
      </div>
    </div>
  );
}
