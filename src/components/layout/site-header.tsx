"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { HeaderQuickSwitch } from "@/components/layout/header-quick-switch";
import { cn } from "@/lib/utils";

const FULL_HEADER_THRESHOLD = 72;
const REVEAL_DELTA = 4;

export function SiteHeader() {
  const pathname = usePathname();
  const keepHeaderReachable = pathname.replace(/\/+$/, "").endsWith("/games/tab-who");
  const [mode, setMode] = useState<"full" | "hidden" | "compact">("full");
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const lastTouchYRef = useRef<number | null>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ||
      document.scrollingElement?.scrollTop ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const setNextMode = (nextMode: typeof mode) => {
      if (modeRef.current === nextMode) {
        return;
      }

      modeRef.current = nextMode;
      headerRef.current?.setAttribute("data-header-mode", nextMode);
      setMode(nextMode);
    };

    let intervalId = 0;

    const syncHeader = () => {
      const scrollY = getScrollY();
      const delta = scrollY - lastScrollYRef.current;

      if (keepHeaderReachable) {
        setNextMode(scrollY <= FULL_HEADER_THRESHOLD ? "full" : "compact");
        lastScrollYRef.current = scrollY;
        return;
      }

      if (scrollY <= FULL_HEADER_THRESHOLD) {
        setNextMode("full");
      } else if (delta > REVEAL_DELTA) {
        setNextMode("hidden");
      } else if (delta < -REVEAL_DELTA) {
        setNextMode("compact");
      } else if (modeRef.current === "full") {
        setNextMode("hidden");
      }

      lastScrollYRef.current = scrollY;
    };

    const syncFromDirection = (direction: "down" | "up") => {
      const scrollY = getScrollY();

      if (keepHeaderReachable) {
        setNextMode(scrollY <= FULL_HEADER_THRESHOLD ? "full" : "compact");
        lastScrollYRef.current = scrollY;
        return;
      }

      if (scrollY <= FULL_HEADER_THRESHOLD) {
        setNextMode("full");
      } else {
        setNextMode(direction === "down" ? "hidden" : "compact");
      }

      lastScrollYRef.current = scrollY;
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= REVEAL_DELTA) {
        return;
      }

      syncFromDirection(event.deltaY > 0 ? "down" : "up");
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY;
      const lastTouchY = lastTouchYRef.current;

      if (currentTouchY == null || lastTouchY == null) {
        lastTouchYRef.current = currentTouchY ?? null;
        return;
      }

      const deltaY = lastTouchY - currentTouchY;

      if (Math.abs(deltaY) > REVEAL_DELTA) {
        syncFromDirection(deltaY > 0 ? "down" : "up");
      }

      lastTouchYRef.current = currentTouchY;
    };

    const initialScrollY = getScrollY();
    lastScrollYRef.current = initialScrollY;
    setNextMode(initialScrollY <= FULL_HEADER_THRESHOLD ? "full" : "compact");

    const scrollElement = document.scrollingElement;
    const timeoutIds = [
      window.setTimeout(syncHeader, 0),
      window.setTimeout(syncHeader, 160),
      window.setTimeout(syncHeader, 420),
    ];

    window.addEventListener("scroll", syncHeader, { passive: true });
    scrollElement?.addEventListener("scroll", syncHeader, { passive: true });
    document.addEventListener("scroll", syncHeader, {
      capture: true,
      passive: true,
    });
    document.body.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", syncHeader);
    intervalId = window.setInterval(syncHeader, 80);

    return () => {
      window.removeEventListener("scroll", syncHeader);
      scrollElement?.removeEventListener("scroll", syncHeader);
      document.removeEventListener("scroll", syncHeader, { capture: true });
      document.body.removeEventListener("scroll", syncHeader);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", syncHeader);
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.clearInterval(intervalId);
    };
  }, [keepHeaderReachable]);

  function handleBackToTop() {
    window.history.replaceState(null, "", window.location.pathname);
    const scrollTarget = document.scrollingElement ?? document.documentElement;

    if (typeof scrollTarget.scrollTo === "function") {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollTarget.scrollTop = 0;
    }

    if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    modeRef.current = "full";
    headerRef.current?.setAttribute("data-header-mode", "full");
    setMode("full");
  }

  return (
    <header
      ref={headerRef}
      data-header-mode={mode}
      className={cn(
        "site-header z-50 isolate pt-[max(env(safe-area-inset-top),0px)] transition-[transform,opacity] duration-300 ease-out [transform:translateZ(0)]",
        mode === "hidden" &&
          "pointer-events-none -translate-y-[calc(100%+0.85rem)] opacity-0",
      )}
    >
      <div
        className={cn(
          "site-header-shell mx-auto border border-white/8 bg-[linear-gradient(180deg,rgba(10,20,35,0.92),rgba(13,26,46,0.9))] shadow-[0_18px_44px_-34px_rgba(37,99,235,0.22),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-[max-width,border-radius,padding,box-shadow,background-color] duration-300 [backface-visibility:hidden] sm:shadow-[0_24px_72px_-44px_rgba(37,99,235,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] sm:backdrop-blur-xl",
          mode === "compact"
            ? "max-w-[11.75rem] rounded-full px-1.5 py-1.5"
            : "max-w-5xl rounded-[28px] px-4 py-3 sm:rounded-[30px] sm:px-6 sm:py-4",
        )}
      >
        <HeaderQuickSwitch onBackToTop={handleBackToTop} />
      </div>
    </header>
  );
}
