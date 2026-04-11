import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="rounded-[28px] border border-white/12 bg-slate-950/84 px-5 py-4 shadow-[0_30px_70px_-46px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
