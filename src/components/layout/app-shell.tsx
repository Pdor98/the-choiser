import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.62),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(196,181,253,0.34),transparent_22%),radial-gradient(circle_at_50%_120%,rgba(167,243,208,0.28),transparent_25%),linear-gradient(180deg,#f4f9ff_0%,#edf5fd_38%,#e8f1fb_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_44%,transparent_90%)] opacity-45" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-sky-300/22 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-16 h-[24rem] w-[24rem] rounded-full bg-indigo-300/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[88rem] flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6 lg:px-8">
        <SiteHeader />
        <main className="flex-1 pb-8 pt-1 sm:pt-2">{children}</main>
      </div>
    </div>
  );
}
