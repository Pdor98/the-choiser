import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.24),_transparent_28%),radial-gradient(circle_at_82%_10%,_rgba(252,211,77,0.18),_transparent_26%),linear-gradient(180deg,_#091321_0%,_#0b1726_42%,_#07101a_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black_48%,transparent_92%)] opacity-24" />
      <div className="pointer-events-none absolute left-1/2 top-[-9rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-300/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-14rem] right-[-9rem] h-[28rem] w-[28rem] rounded-full bg-amber-300/12 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6 lg:px-8">
        <SiteHeader />
        <main className="flex-1 pb-8 pt-1 sm:pt-2">{children}</main>
      </div>
    </div>
  );
}
