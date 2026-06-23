import Lenis from "lenis";
import { prefersReducedMotion } from "./env";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

// Smooth inertia scroll. Returns the instance so gsap.ts can drive
// ScrollTrigger from Lenis' own RAF loop (single source of truth).
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
  });

  // In-page anchor links should ride the smooth scroll.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href*="/#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const raw = a.getAttribute("href") || "";
      const hashIndex = raw.indexOf("#");
      if (hashIndex === -1) return;
      const id = raw.slice(hashIndex);
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return; // cross-page anchor: let it navigate normally
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  return lenis;
}
