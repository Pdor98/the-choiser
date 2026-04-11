import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="rounded-[30px] border border-slate-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(243,248,255,0.82))] px-5 py-4 shadow-[0_24px_72px_-44px_rgba(59,130,246,0.16),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
