"use client";

import { Compass, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getActiveNavigation, navigationLinks } from "@/lib/site-content";

type PageExitBarProps = {
  title?: string;
  description?: string;
};

export function PageExitBar({
  title = "Hai finito qui?",
  description = "Torna subito alla home o passa a un altro modulo senza dover risalire tutta la pagina.",
}: PageExitBarProps) {
  const pathname = usePathname();
  const currentPage = getActiveNavigation(pathname);

  return (
    <Card className="p-5 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-200">
            <Compass className="size-5" />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Uscita rapida
            </p>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-slate-50">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300/84">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/#top"
            scroll
            className={buttonStyles({
              className: "bg-slate-950 text-white hover:bg-slate-800",
            })}
          >
            <House className="size-4" />
            <span>Torna alla Home</span>
          </Link>
        </div>

        <div className="flex justify-center">
          <div className="w-fit max-w-full overflow-x-auto rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,18,33,0.88),rgba(13,25,44,0.88))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:rounded-[26px] md:p-2">
            <div className="inline-flex min-w-max snap-x snap-mandatory items-center justify-center gap-1.5 md:flex-wrap md:gap-2">
            {navigationLinks.map((link) => {
              const isActive = currentPage.href === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 snap-center items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition duration-300 md:min-h-12 md:px-4 md:text-sm",
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
        </div>
      </div>
    </Card>
  );
}
