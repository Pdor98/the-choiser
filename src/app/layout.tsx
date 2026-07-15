import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Choiser",
  description: "Non sai cosa scegliere? Ti aiutiamo noi.",
};

const headerBehaviorScript = `
(() => {
  if (window.__choiserHeaderBehavior) return;
  window.__choiserHeaderBehavior = true;

  const threshold = 72;
  const delta = 4;
  let lastY = window.scrollY || document.documentElement.scrollTop || 0;
  let touchY = null;

  const getY = () =>
    window.scrollY ||
    document.scrollingElement?.scrollTop ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  const setMode = (mode) => {
    const header = document.querySelector(".site-header");
    if (!header || header.getAttribute("data-header-mode") === mode) return;
    header.setAttribute("data-header-mode", mode);
  };

  const sync = (direction) => {
    const y = getY();

    if (y <= threshold) {
      setMode("full");
      lastY = y;
      return;
    }

    if (direction === "down") {
      setMode("hidden");
      lastY = y;
      return;
    }

    if (direction === "up") {
      setMode("compact");
      lastY = y;
      return;
    }

    const difference = y - lastY;

    if (difference > delta) setMode("hidden");
    if (difference < -delta) setMode("compact");
    lastY = y;
  };

  window.addEventListener("scroll", () => sync(), { passive: true });
  document.addEventListener("scroll", () => sync(), {
    capture: true,
    passive: true,
  });
  window.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > delta) {
        sync(event.deltaY > 0 ? "down" : "up");
      }
    },
    { passive: true },
  );
  window.addEventListener(
    "touchstart",
    (event) => {
      touchY = event.touches[0]?.clientY ?? null;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (event) => {
      const currentY = event.touches[0]?.clientY ?? null;
      if (currentY == null || touchY == null) {
        touchY = currentY;
        return;
      }

      const touchDelta = touchY - currentY;
      if (Math.abs(touchDelta) > delta) {
        sync(touchDelta > 0 ? "down" : "up");
      }
      touchY = currentY;
    },
    { passive: true },
  );
  window.addEventListener("resize", () => sync());
  window.setInterval(() => sync(), 120);
  window.setTimeout(() => sync(), 0);
  window.setTimeout(() => sync(), 250);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
        <script dangerouslySetInnerHTML={{ __html: headerBehaviorScript }} />
      </body>
    </html>
  );
}
