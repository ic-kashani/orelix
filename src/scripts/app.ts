import { onReady } from "../lib/motion/env";
import { initSmoothScroll } from "../lib/motion/smooth";
import { initGsap } from "../lib/motion/gsap";
import { initUI } from "../lib/motion/ui";
import { initReveal } from "../lib/motion/reveals";
import { initServicesScroll } from "../lib/motion/services-scroll";
import { initLightbox } from "../lib/motion/lightbox";
import { initPreloader } from "../lib/motion/preloader";
import { playHeroIntro } from "../lib/motion/hero";
import { initHeroWebGL } from "../lib/motion/hero-webgl";

function safe(label: string, fn: () => void): void {
  try {
    fn();
  } catch (err) {
    console.error(`[motion] ${label} failed:`, err);
  }
}

function forceRevealPage(): void {
  document.body.classList.remove("is-loading");
  const pre = document.querySelector<HTMLElement>("[data-preloader]");
  if (pre) {
    pre.dataset.done = "1";
    pre.style.display = "none";
  }
}

export function initApp(): void {
  onReady(() => {
    const failsafe = window.setTimeout(forceRevealPage, 4000);

    safe("smooth", () => initSmoothScroll());
    safe("gsap", () => initGsap());
    safe("ui", () => initUI());
    safe("reveal", () => initReveal());
    safe("services", () => initServicesScroll());
    safe("lightbox", () => initLightbox());

    initHeroWebGL().catch((err) => console.error("[motion] webgl failed:", err));

    initPreloader()
      .catch((err) => console.error("[motion] preloader failed:", err))
      .finally(() => {
        window.clearTimeout(failsafe);
        forceRevealPage();
        safe("hero-intro", () => playHeroIntro());
      });
  });
}
