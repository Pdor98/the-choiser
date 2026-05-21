"use client";

import {
  motion,
  type HTMLMotionProps,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type Ref,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type AnimatedSectionProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  intensity?: "normal" | "strong";
};

type StaggerContainerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
};

type AnimatedCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  motionIndex?: number;
};

type ScrollHeroProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  glowClassName?: string;
};

function useIsMobileMotion() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return isMobile;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  (ref as MutableRefObject<T | null>).current = value;
}

export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(
  function AnimatedSection(
    {
      children,
      className,
      intensity = "normal",
      style,
      ...props
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const isMobile = useIsMobileMotion();
    const reduceMotion = shouldReduceMotion ?? false;
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 104%", "start 42%"],
    });
    const progress = useSpring(scrollYProgress, {
      stiffness: 95,
      damping: 24,
      mass: 0.34,
    });
    const distance = isMobile ? 42 : intensity === "strong" ? 104 : 82;
    const opacity = useTransform(progress, [0, 0.22, 0.76], [0, 0.64, 1]);
    const y = useTransform(progress, [0, 0.76], [distance, 0]);
    const scale = useTransform(
      progress,
      [0, 0.76],
      [isMobile ? 0.97 : 0.94, 1],
    );
    const filter = useTransform(
      progress,
      [0, 0.76],
      [isMobile ? "blur(3px)" : "blur(8px)", "blur(0px)"],
    );

    const setRefs = (node: HTMLElement | null) => {
      localRef.current = node;
      assignRef(forwardedRef, node);
    };

    return (
      <motion.section
        ref={setRefs as never}
        data-motion="animated-section"
        style={
          reduceMotion
            ? style
            : ({
                ...style,
                opacity,
                filter,
                scale,
                y,
              } as HTMLMotionProps<"section">["style"])
        }
        className={cn("will-change-transform", className)}
        {...props}
      >
        {children}
      </motion.section>
    );
  },
);

AnimatedSection.displayName = "AnimatedSection";

export function StaggerContainer({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.08,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      data-motion="stagger-container"
      className={className}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child as ReactElement<AnimatedCardProps>, {
          motionIndex: index + Math.round(delayChildren / Math.max(staggerChildren, 0.01)),
        });
      })}
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className,
  motionIndex = 0,
  style,
  ...props
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileMotion();
  const reduceMotion = shouldReduceMotion ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 104%", "start 46%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 24,
    mass: 0.3,
  });
  const staggerStart = Math.max(Math.min(motionIndex * 0.1, 0.34), 0.001);
  const staggerEnd = Math.min(staggerStart + 0.58, 1);
  const yDistance = isMobile ? 34 : 62;
  const xDirection = motionIndex % 3 === 0 ? -1 : motionIndex % 3 === 1 ? 1 : 0;
  const xDistance = isMobile ? xDirection * 14 : xDirection * 34;
  const opacity = useTransform(
    progress,
    [0, staggerStart, staggerEnd],
    [0, 0, 1],
  );
  const y = useTransform(
    progress,
    [0, staggerStart, staggerEnd],
    [yDistance, yDistance, 0],
  );
  const x = useTransform(
    progress,
    [0, staggerStart, staggerEnd],
    [xDistance, xDistance, 0],
  );
  const scale = useTransform(
    progress,
    [0, staggerStart, staggerEnd],
    [isMobile ? 0.97 : 0.94, isMobile ? 0.97 : 0.94, 1],
  );
  const filter = useTransform(
    progress,
    [0, staggerStart, staggerEnd],
    [
      isMobile ? "blur(2px)" : "blur(7px)",
      isMobile ? "blur(2px)" : "blur(7px)",
      "blur(0px)",
    ],
  );

  return (
    <motion.div
      ref={ref}
      data-motion="animated-card"
      style={
        reduceMotion
          ? style
          : ({
              ...style,
              filter,
              opacity,
              scale,
              x,
              y,
            } as HTMLMotionProps<"div">["style"])
      }
      className={cn("min-w-0 will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollHero({
  children,
  className,
  glowClassName,
  style,
  ...props
}: ScrollHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileMotion();
  const reduceMotion = shouldReduceMotion ?? false;
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 22,
    mass: 0.36,
  });
  const y = useTransform(progress, [0, 1], [0, isMobile ? -52 : -112]);
  const scale = useTransform(
    progress,
    [0, 1],
    [1, isMobile ? 0.94 : 0.88],
  );
  const opacity = useTransform(
    progress,
    [0, 1],
    [1, isMobile ? 0.74 : 0.52],
  );
  const glowOpacity = useTransform(progress, [0, 1], [0.7, 0.04]);
  const glowScale = useTransform(progress, [0, 1], [0.94, 1.42]);
  const glowY = useTransform(progress, [0, 1], [0, isMobile ? 34 : 78]);

  return (
    <motion.section
      ref={heroRef as never}
      data-motion="scroll-hero"
      className={cn("relative will-change-transform", className)}
      style={
        reduceMotion
          ? style
          : ({
              ...style,
              opacity,
              scale,
              y,
            } as HTMLMotionProps<"section">["style"])
      }
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-[8%] top-6 h-40 rounded-full blur-3xl",
          glowClassName ?? "bg-cyan-300/18",
        )}
        style={
          reduceMotion
            ? undefined
            : { opacity: glowOpacity, scale: glowScale, y: glowY }
        }
      />
      {children}
    </motion.section>
  );
}
