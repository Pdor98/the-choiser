import Link from "next/link";

import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";
import { MainNav } from "@/components/layout/main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/92 px-5 py-4 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.95)] backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/78 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-300/90 via-white to-amber-300/90 text-lg font-bold text-slate-950 shadow-[0_18px_40px_-24px_rgba(34,211,238,0.9)]">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-lg font-semibold tracking-tight text-white">
              Choiser
            </p>
            <p className="truncate text-sm text-white/45">
              Interactive choice engine
            </p>
          </div>
        </Link>

        <div className="w-full md:w-auto md:max-w-full">
          <MainNav />
        </div>
      </div>

      <div className="mt-3 rounded-[28px] border border-white/10 bg-slate-950/72 px-5 py-4 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
