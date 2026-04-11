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
    "border border-cyan-300/26 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(59,130,246,0.3)_52%,rgba(99,102,241,0.26))] text-slate-50 shadow-[0_24px_58px_-30px_rgba(56,189,248,0.36)] hover:-translate-y-0.5 hover:brightness-[1.06] hover:text-white hover:shadow-[0_30px_72px_-30px_rgba(59,130,246,0.46)] [&>*]:text-slate-50",
  secondary:
    "border border-white/10 bg-[linear-gradient(180deg,rgba(18,31,53,0.94),rgba(12,24,43,0.92))] text-slate-100 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.48),inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:border-cyan-300/24 hover:bg-[linear-gradient(180deg,rgba(20,36,61,0.96),rgba(13,27,49,0.94))] hover:text-white",
  ghost:
    "border border-white/10 bg-white/4 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-0.5 hover:border-cyan-300/22 hover:bg-white/8 hover:text-white",
};

export const primaryButtonReadableStyle: CSSProperties = {
  color: "#f8fbff",
  WebkitTextFillColor: "#f8fbff",
};

export function buttonStyles({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return cn(
    "inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold leading-none whitespace-nowrap transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:shrink-0 [&>svg]:text-current [&>span]:text-current",
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
