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
    "border border-sky-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(228,245,255,0.98)_46%,rgba(186,230,253,0.96))] text-slate-950 shadow-[0_24px_55px_-28px_rgba(125,211,252,0.48)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:text-slate-950 hover:shadow-[0_28px_70px_-28px_rgba(125,211,252,0.58)] [&>*]:text-slate-950",
  secondary:
    "border border-slate-200/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,255,0.96))] text-slate-800 shadow-[0_18px_42px_-32px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:border-sky-200/75 hover:bg-white hover:text-slate-900",
  ghost:
    "border border-slate-200/72 bg-white/55 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] hover:-translate-y-0.5 hover:border-sky-200/70 hover:bg-white/80 hover:text-slate-900",
};

export const primaryButtonReadableStyle: CSSProperties = {
  color: "#0f2747",
  WebkitTextFillColor: "#0f2747",
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
