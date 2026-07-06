import { gsap } from "gsap";
import { prefersReducedMotion } from "./env";

// One-time intro curtain. Counts to 100, then wipes up to reveal the hero.
// Returns a promise that resolves when the page is interactive so the hero
// intro can chain after it.
export function initPreloader(): Promise<void> {
  const el = document.querySelector<HTMLElement>("[data-preloader]");
  if (!el) return Promise.resolve();

  const seen = sessionStorage.getItem("orelix-intro") === "1";
  if (seen || prefersReducedMotion()) {
    el.remove();
    document.body.classList.remove("is-loading");
    return Promise.resolve();
  }

  document.body.classList.add("is-loading");
  const num = el.querySelector<HTMLElement>("[data-preloader-num]");
  const bar = el.querySelector<HTMLElement>("[data-preloader-bar]");

  return new Promise<void>((resolve) => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("orelix-intro", "1");
        el.dataset.done = "1";
        el.remove();
        document.body.classList.remove("is-loading");
        resolve();
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.v);
        if (num) num.textContent = String(v).padStart(3, "0");
        if (bar) bar.style.transform = `scaleX(${counter.v / 100})`;
      },
    })
      .to(el.querySelectorAll("[data-preloader-fade]"), {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      });
  });
}
