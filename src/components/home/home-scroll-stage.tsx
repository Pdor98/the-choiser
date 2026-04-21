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

    const isMobile = window.innerWidth < 768;
    const thresholds = [0, 0.08, 0.16, 0.28, 0.4, 0.56];

    const updateSectionState = (entry: IntersectionObserverEntry) => {
      const viewportHeight = window.innerHeight || 1;
      const focalTop = viewportHeight * (isMobile ? 0.24 : 0.22);
      const focalBottom = viewportHeight * (isMobile ? 0.84 : 0.76);
      const hasPresence = entry.isIntersecting || entry.intersectionRatio > 0.05;
      const isInFocusBand =
        entry.boundingClientRect.top <= focalBottom &&
        entry.boundingClientRect.bottom >= focalTop;

      if (hasPresence) {
        setHasEntered(true);
      }

      setIsActive(hasPresence && isInFocusBand);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const nextEntry = entries[0];

        if (nextEntry) {
          updateSectionState(nextEntry);
        }
      },
      {
        threshold: thresholds,
        rootMargin: isMobile ? "0px 0px -8% 0px" : "0px 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
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
        } as CSSProperties)
      : style;

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
