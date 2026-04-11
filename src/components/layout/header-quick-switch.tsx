"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getActiveNavigation, navigationLinks } from "@/lib/site-content";

export function HeaderQuickSwitch() {
  const pathname = usePathname();
  const currentPage = getActiveNavigation(pathname);

  return (
    <div className="space-y-3">
      <div className="space-y-1 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">
          Pagina attiva
        </p>
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {currentPage.headerTitle}
        </h2>
      </div>

      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-[24px] border border-white/10 bg-slate-950/58 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        {navigationLinks.map((link) => {
          const isActive = currentPage.href === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition duration-300",
                isActive
                  ? "border-cyan-200/45 bg-cyan-300/16 text-white shadow-[0_18px_40px_-30px_rgba(103,232,249,0.85)]"
                  : "border-white/8 bg-white/5 text-white/68 hover:border-white/14 hover:bg-white/10 hover:text-white",
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
