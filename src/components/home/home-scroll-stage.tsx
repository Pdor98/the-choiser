"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type HomeScrollStageProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
  children: ReactNode;
  variant?: "default" | "hero";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HomeScrollStage({
  as = "section",
  children,
  className,
  style,
  variant = "default",
  ...props
}: HomeScrollStageProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [hasEntered, setHasEntered] = useState(variant === "hero");
  const [isActive, setIsActive] = useState(variant === "hero");
  const [heroProgress, setHeroProgress] = useState(0);
  const [presence, setPresence] = useState(variant === "hero" ? 1 : 0);
  const [focusStrength, setFocusStrength] = useState(variant === "hero" ? 1 : 0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    let frameId: number | null = null;

    const measure = () => {
      frameId = null;

      const viewportHeight = window.innerHeight || 1;
      const isMobile = window.innerWidth < 768;
      const rect = element.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const stageHeight = Math.max(rect.height, 1);
      const normalizedHeight = Math.min(stageHeight, viewportHeight * (isMobile ? 0.96 : 0.9));
      const nextPresence = clamp(visibleHeight / Math.max(normalizedHeight, 1), 0, 1);
      const stageCenter = rect.top + rect.height / 2;
      const focalPoint = viewportHeight * (isMobile ? 0.5 : 0.48);
      const focusRange = viewportHeight * (isMobile ? 0.72 : 0.78);
      const nextFocusStrength = clamp(
        1 - Math.abs(stageCenter - focalPoint) / Math.max(focusRange, 1),
        0,
        1,
      );
      const nextHasPresence =
        nextPresence > 0.08 || (rect.top < viewportHeight * 0.82 && rect.bottom > 0);
      const nextIsActive = nextPresence > 0.12 && nextFocusStrength > (isMobile ? 0.5 : 0.56);

      if (nextHasPresence) {
        setHasEntered(true);
      }

      setPresence((currentPresence) =>
        Math.abs(currentPresence - nextPresence) > 0.01 ? nextPresence : currentPresence,
      );
      setFocusStrength((currentFocusStrength) =>
        Math.abs(currentFocusStrength - nextFocusStrength) > 0.01
          ? nextFocusStrength
          : currentFocusStrength,
      );
      setIsActive(nextIsActive);
    };

    const requestMeasure = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(measure);
    };

    requestMeasure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [variant]);

  useEffect(() => {
    if (variant !== "hero" || typeof window === "undefined") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const range = window.innerWidth < 768 ? 180 : 320;
    let frameId: number | null = null;

    const measure = () => {
      frameId = null;

      setHeroProgress((currentProgress) => {
        const nextProgress = clamp(window.scrollY / range, 0, 1);

        return Math.abs(nextProgress - currentProgress) > 0.01
          ? nextProgress
          : currentProgress;
      });
    };

    const requestMeasure = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(measure);
    };

    requestMeasure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, [variant]);

  const Component = as;
  const mergedStyle =
    variant === "hero"
      ? ({
          ...style,
          "--home-hero-progress": heroProgress,
          "--home-scroll-presence": presence,
          "--home-scroll-focus": focusStrength,
        } as CSSProperties)
      : ({
          ...style,
          "--home-scroll-presence": presence,
          "--home-scroll-focus": focusStrength,
        } as CSSProperties);

  return (
    <Component
      ref={ref as never}
      className={cn(
        "home-scroll-stage",
        variant === "hero" && "home-scroll-stage-hero",
        className,
      )}
      data-home-scroll-entered={hasEntered ? "true" : "false"}
      data-home-scroll-active={isActive ? "true" : "false"}
      data-home-scroll-variant={variant}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
