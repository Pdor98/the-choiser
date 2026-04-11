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
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/56">
            Navigation hub
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {currentPage.headerTitle}
          </h2>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 sm:inline-flex">
          Pagina attiva
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl items-center justify-start gap-2 overflow-x-auto rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,11,22,0.92),rgba(10,16,30,0.82))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
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
                  ? "border-cyan-100/28 bg-[linear-gradient(135deg,rgba(89,197,255,0.26),rgba(114,230,255,0.12))] text-white shadow-[0_18px_40px_-28px_rgba(103,232,249,0.72)]"
                  : "border-white/10 bg-white/[0.035] text-white/88 hover:border-cyan-100/18 hover:bg-white/[0.07] hover:text-white",
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
