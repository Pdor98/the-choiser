import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 sm:top-4">
      <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.9),rgba(13,26,46,0.88))] px-5 py-4 shadow-[0_24px_72px_-44px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-6">
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
