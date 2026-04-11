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
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-700/66">
            Navigation hub
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {currentPage.headerTitle}
          </h2>
        </div>
        <div className="hidden rounded-full border border-slate-200/80 bg-white/72 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-600 sm:inline-flex">
          Pagina attiva
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl items-center justify-start gap-2 overflow-x-auto rounded-[26px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,248,255,0.88))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center">
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
                  ? "border-sky-200/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(223,244,255,0.96)_55%,rgba(186,230,253,0.92))] text-slate-900 shadow-[0_18px_44px_-30px_rgba(125,211,252,0.52)]"
                  : "border-slate-200/80 bg-white/62 text-slate-700 hover:border-sky-200/80 hover:bg-white/86 hover:text-slate-900",
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
