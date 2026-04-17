"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getActiveNavigation, navigationLinks } from "@/lib/site-content";

export function HeaderQuickSwitch() {
  const pathname = usePathname();
  const currentPage = getActiveNavigation(pathname);

  return (
    <div className="space-y-2.5 sm:space-y-4">
      <div className="relative flex flex-col items-center gap-2.5 text-center sm:gap-3">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/58 sm:text-[11px] sm:tracking-[0.3em]">
            Navigation hub
          </p>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-slate-50 sm:text-3xl">
            {currentPage.headerTitle}
          </h2>
        </div>

        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-300 md:absolute md:right-0 md:top-1/2 md:inline-flex md:-translate-y-1/2">
          Pagina attiva
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="w-full overflow-x-auto px-1.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-2">
          <div className="flex min-w-full items-center justify-center">
            <nav
              aria-label="Primary"
              className="flex w-max min-w-max items-center justify-center gap-1.5 rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,18,33,0.88),rgba(13,25,44,0.88))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:gap-2 md:rounded-[26px] md:p-2.5"
            >
              {navigationLinks.map((link) => {
                const isActive = currentPage.href === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition duration-300 md:min-h-12 md:px-4 md:py-2.5 md:text-sm",
                      isActive
                        ? "border-cyan-300/26 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(59,130,246,0.3)_55%,rgba(99,102,241,0.24))] text-slate-50 shadow-[0_18px_44px_-30px_rgba(56,189,248,0.36)]"
                        : "border-white/8 bg-white/5 text-slate-300 hover:border-cyan-300/22 hover:bg-white/8 hover:text-slate-50",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
