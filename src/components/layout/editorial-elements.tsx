import type { Route } from "next";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

export function EditorialSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-heading text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function EditorialCTAButton({
  href,
  children,
  variant = "primary",
  onClick,
  ariaControls,
}: {
  href: Route;
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  ariaControls?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-controls={ariaControls}
      className={
        variant === "primary"
          ? "relative z-[1] inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-full border border-violet-300/28 bg-[linear-gradient(135deg,rgba(168,85,247,0.22),rgba(99,102,241,0.2)_44%,rgba(59,130,246,0.22))] px-6 text-sm font-semibold text-slate-50 shadow-[0_22px_56px_-30px_rgba(168,85,247,0.52)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/36 hover:shadow-[0_26px_72px_-30px_rgba(168,85,247,0.62)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40"
          : "relative z-[1] inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/[0.06] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      }
    >
      {children}
    </Link>
  );
}

export function EditorialFooter() {
  return (
    <footer className="border-t border-white/8 pt-8">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-400">
        <Link href="/" className="transition duration-300 hover:text-slate-100">
          Home
        </Link>
        <Link
          href="/random"
          className="transition duration-300 hover:text-slate-100"
        >
          Random
        </Link>
        <Link
          href="/games"
          className="transition duration-300 hover:text-slate-100"
        >
          Games
        </Link>
        <Link
          href="/tools"
          className="transition duration-300 hover:text-slate-100"
        >
          Tools
        </Link>
      </nav>
      <p className="mt-5 text-center text-xs uppercase tracking-[0.24em] text-slate-500">
        Choiser - Perche ogni serata merita un buon inizio.
      </p>
    </footer>
  );
}
