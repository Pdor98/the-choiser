import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-slate-950 shadow-[0_20px_50px_-24px_rgba(255,255,255,0.9)] hover:bg-slate-100",
  secondary:
    "border border-white/12 bg-white/8 text-white hover:bg-white/12",
  ghost: "text-white/72 hover:bg-white/8 hover:text-white",
};

export function buttonStyles({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50",
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
