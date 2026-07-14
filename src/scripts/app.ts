import { onReady } from "../lib/motion/env";
import { initSmoothScroll } from "../lib/motion/smooth";
import { initGsap } from "../lib/motion/gsap";
import { initContactForm } from "../lib/contact-form";
import { initUI } from "../lib/motion/ui";
import { initReveal } from "../lib/motion/reveals";
import { initServicesScroll } from "../lib/motion/services-scroll";
import { initLightbox } from "../lib/motion/lightbox";
import { initPreloader } from "../lib/motion/preloader";
import { playHeroIntro } from "../lib/motion/hero";

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

function initDeferredHeroWebGL(): void {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  const slowConnection = connection?.saveData || connection?.effectiveType === "2g";

  if (slowConnection || window.matchMedia("(max-width: 860px)").matches) return;

  const load = () => {
    import("../lib/motion/hero-webgl")
      .then(({ initHeroWebGL }) => initHeroWebGL())
      .catch((err) => console.error("[motion] webgl failed:", err));
  };

  const requestIdle = (window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }).requestIdleCallback;

  if (requestIdle) {
    requestIdle(load, { timeout: 2200 });
  } else {
    globalThis.setTimeout(load, 1200);
  }
}

export function initApp(): void {
  onReady(() => {
    const failsafe = window.setTimeout(forceRevealPage, 4000);

    safe("smooth", () => initSmoothScroll());
    safe("gsap", () => initGsap());
    safe("ui", () => initUI());
    safe("contact-form", () => initContactForm());
    safe("reveal", () => initReveal());
    safe("services", () => initServicesScroll());
    safe("lightbox", () => initLightbox());

    initDeferredHeroWebGL();

    initPreloader()
      .catch((err) => console.error("[motion] preloader failed:", err))
      .finally(() => {
        window.clearTimeout(failsafe);
        forceRevealPage();
        safe("hero-intro", () => playHeroIntro());
      });

    window.addEventListener("load", () => safe("services-refresh", () => initServicesScroll()), {
      once: true,
    });
  });
}
