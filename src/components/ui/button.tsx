import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,254,255,0.96)_48%,rgba(253,230,138,0.9))] text-slate-950 shadow-[0_24px_60px_-28px_rgba(250,204,21,0.65)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_28px_70px_-28px_rgba(255,255,255,0.8)] [&>*]:text-slate-950",
  secondary:
    "border border-white/14 bg-slate-900/76 text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:border-cyan-200/28 hover:bg-slate-800/90 hover:text-white",
  ghost:
    "border border-white/10 bg-white/[0.045] text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.08] hover:text-white",
};

export function buttonStyles({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return cn(
    "inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold leading-none whitespace-nowrap transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:shrink-0 [&>svg]:text-current [&>span]:text-current",
    variantClasses[variant],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, className })}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
