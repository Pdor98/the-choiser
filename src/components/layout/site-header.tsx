"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";
import { cn } from "@/lib/utils";

const RESET_SCROLL_THRESHOLD = 48;
const DIRECTIONAL_SCROLL_THRESHOLD = 18;
const SCROLL_DELTA_THRESHOLD = 6;

export function SiteHeader() {
  const pathname = usePathname();
  const [isRaised, setIsRaised] = useState(false);
  const lastScrollYRef = useRef(0);
  const directionAnchorRef = useRef(0);
  const isRaisedRef = useRef(false);

  useEffect(() => {
    isRaisedRef.current = isRaised;
  }, [isRaised]);

  useEffect(() => {
    const resetHeader = () => {
      const scrollY = window.scrollY;
      lastScrollYRef.current = scrollY;
      directionAnchorRef.current = scrollY;
      isRaisedRef.current = false;
      setIsRaised(false);
    };

    resetHeader();

    let frameId = 0;

    const syncHeaderState = (nextRaised: boolean, scrollY: number) => {
      if (isRaisedRef.current === nextRaised) {
        directionAnchorRef.current = scrollY;
        return;
      }

      isRaisedRef.current = nextRaised;
      directionAnchorRef.current = scrollY;
      setIsRaised(nextRaised);
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollYRef.current;
        const distanceFromAnchor = Math.abs(scrollY - directionAnchorRef.current);

        if (scrollY <= RESET_SCROLL_THRESHOLD) {
          syncHeaderState(false, scrollY);
        } else if (
          delta > SCROLL_DELTA_THRESHOLD &&
          distanceFromAnchor >= DIRECTIONAL_SCROLL_THRESHOLD
        ) {
          syncHeaderState(true, scrollY);
        } else if (
          delta < -SCROLL_DELTA_THRESHOLD &&
          distanceFromAnchor >= DIRECTIONAL_SCROLL_THRESHOLD
        ) {
          syncHeaderState(false, scrollY);
        }

        lastScrollYRef.current = scrollY;
        frameId = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 isolate pt-[max(env(safe-area-inset-top),0px)] transition-transform duration-300 ease-out [transform:translateZ(0)] will-change-transform",
        isRaised && "-translate-y-[calc(100%+0.75rem)] sm:-translate-y-[calc(100%+1rem)]",
      )}
    >
      <div
        className={cn(
          "rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.92),rgba(13,26,46,0.9))] px-4 py-3 shadow-[0_18px_44px_-34px_rgba(37,99,235,0.22),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-shadow duration-300 [backface-visibility:hidden] sm:rounded-[30px] sm:px-6 sm:py-4 sm:shadow-[0_24px_72px_-44px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] sm:backdrop-blur-xl",
          isRaised && "shadow-[0_12px_28px_-28px_rgba(37,99,235,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]",
        )}
      >
        <HeaderQuickSwitch />
      </div>
    </header>
  );
}
