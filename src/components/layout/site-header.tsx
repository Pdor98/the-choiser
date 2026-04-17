import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 pt-[max(env(safe-area-inset-top),0px)]">
      <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.92),rgba(13,26,46,0.9))] px-4 py-3 shadow-[0_24px_72px_-44px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:rounded-[30px] sm:px-6 sm:py-4">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
