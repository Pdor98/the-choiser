"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getActiveNavigation, navigationLinks } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const currentPage = getActiveNavigation(pathname);

  return (
    <nav
      aria-label="Primary"
      className="touch-scroll-x flex w-full min-w-0 items-center justify-start overflow-x-auto rounded-full border border-white/8 bg-slate-950/75 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:w-auto md:justify-end"
    >
      <div className="flex min-w-max items-center gap-1.5">
        {navigationLinks.map((link) => {
          const isActive = currentPage.href === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              style={isActive ? { color: "#020617" } : undefined}
              className={cn(
                "group inline-flex min-w-fit items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                isActive
                  ? "border-white/70 bg-white text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.24),0_18px_40px_-26px_rgba(255,255,255,0.75)]"
                  : "border-transparent text-white/72 hover:border-white/10 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full transition duration-300",
                  isActive
                    ? "bg-slate-950 shadow-[0_0_12px_rgba(15,23,42,0.35)]"
                    : "bg-white/18 group-hover:bg-white/40",
                )}
              />
              <span style={isActive ? { color: "#020617" } : undefined}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
