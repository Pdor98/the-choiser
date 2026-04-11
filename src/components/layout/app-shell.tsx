import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(129,140,248,0.14),transparent_22%),radial-gradient(circle_at_50%_120%,rgba(110,231,183,0.1),transparent_24%),linear-gradient(180deg,#060b14_0%,#08101b_38%,#050912_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_46%,transparent_90%)] opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(125,211,252,0.08),transparent)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-16 h-[24rem] w-[24rem] rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-emerald-300/8 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[88rem] flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6 lg:px-8">
        <SiteHeader />
        <main className="flex-1 pb-8 pt-1 sm:pt-2">{children}</main>
      </div>
    </div>
  );
}
