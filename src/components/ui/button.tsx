import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-cyan-100/80 bg-[linear-gradient(135deg,rgba(247,252,255,0.99),rgba(222,244,255,0.98)_45%,rgba(164,226,255,0.96))] text-slate-950 shadow-[0_26px_65px_-30px_rgba(56,189,248,0.45)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:text-slate-950 hover:shadow-[0_30px_75px_-28px_rgba(125,211,252,0.62)] [&>*]:text-slate-950",
  secondary:
    "border border-white/14 bg-[linear-gradient(180deg,rgba(19,29,48,0.9),rgba(10,16,29,0.92))] text-white/94 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_22px_50px_-38px_rgba(2,8,23,0.92)] hover:-translate-y-0.5 hover:border-cyan-200/26 hover:bg-[linear-gradient(180deg,rgba(25,40,68,0.92),rgba(12,18,33,0.96))] hover:text-white",
  ghost:
    "border border-white/12 bg-white/[0.035] text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:-translate-y-0.5 hover:border-cyan-200/20 hover:bg-white/[0.07] hover:text-white",
};

export const primaryButtonReadableStyle: CSSProperties = {
  color: "#0f172a",
  WebkitTextFillColor: "#0f172a",
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
      style={variant === "primary" ? primaryButtonReadableStyle : undefined}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
