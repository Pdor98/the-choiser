"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScrollFocusSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  emphasis?: "hero" | "default";
};

export function ScrollFocusSection({
  children,
  className,
  emphasis = "default",
  ...props
}: ScrollFocusSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (shouldReduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0.08) {
          setHasEntered(true);
        }

        setIsFocused(entry.intersectionRatio >= 0.28);
      },
      {
        threshold: [0, 0.08, 0.18, 0.28, 0.42, 0.58, 0.74],
        rootMargin:
          emphasis === "hero" ? "-6% 0px -22% 0px" : "-14% 0px -24% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [emphasis, shouldReduceMotion]);

  const resolvedHasEntered = shouldReduceMotion ? true : hasEntered;
  const resolvedIsFocused = shouldReduceMotion ? true : isFocused;

  return (
    <section
      ref={ref}
      data-entered={resolvedHasEntered}
      data-focused={resolvedIsFocused}
      className={cn(
        "transition-[opacity,transform,filter] duration-700 ease-out will-change-transform",
        shouldReduceMotion
          ? "opacity-100"
          : resolvedHasEntered
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0",
        !shouldReduceMotion &&
          resolvedHasEntered &&
          !resolvedIsFocused &&
          "scale-[0.992] opacity-[0.78]",
        !shouldReduceMotion && resolvedIsFocused && "scale-100 opacity-100",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "transition-[filter,box-shadow,transform,opacity] duration-700 ease-out",
          !shouldReduceMotion &&
            !resolvedIsFocused &&
            resolvedHasEntered &&
            "brightness-[0.94] saturate-[0.92]",
          !shouldReduceMotion &&
            resolvedIsFocused &&
            "brightness-100 saturate-100 drop-shadow-[0_26px_80px_rgba(37,99,235,0.14)]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
