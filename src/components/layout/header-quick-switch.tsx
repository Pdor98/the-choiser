"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getActiveNavigation, navigationLinks } from "@/lib/site-content";

export function HeaderQuickSwitch() {
  const pathname = usePathname();
  const currentPage = getActiveNavigation(pathname);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/58">
            Navigation hub
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            {currentPage.headerTitle}
          </h2>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-300 sm:inline-flex">
          Pagina attiva
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl items-center justify-start gap-2 overflow-x-auto rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,18,33,0.88),rgba(13,25,44,0.88))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
        {navigationLinks.map((link) => {
          const isActive = currentPage.href === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-300",
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
      </div>
    </div>
  );
}
