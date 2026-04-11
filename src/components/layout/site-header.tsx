import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/72 px-5 py-4 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
