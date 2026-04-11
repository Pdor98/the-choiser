import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="rounded-[30px] border border-[var(--stroke-strong)] bg-[linear-gradient(180deg,rgba(10,17,31,0.92),rgba(7,12,24,0.86))] px-5 py-4 shadow-[0_28px_85px_-48px_rgba(2,8,23,0.96),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
