import { gsap } from "gsap";
import { isTouch, prefersReducedMotion } from "./env";

// Custom cursor: a small dot that tracks instantly + a trailing ring that
// eases behind it and grows over interactive / data-cursor elements.
export function initCursor(): void {
  if (isTouch() || prefersReducedMotion()) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const label = document.createElement("span");
  label.className = "cursor-label";
  ring.appendChild(label);
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.body.classList.add("has-custom-cursor");

  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

  window.addEventListener(
    "pointermove",
    (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    },
    { passive: true }
  );

  document.addEventListener("pointerdown", () => ring.classList.add("is-down"));
  document.addEventListener("pointerup", () => ring.classList.remove("is-down"));

  const interactive = 'a, button, [data-cursor], input, textarea, select, .gallery-item';
  document.querySelectorAll<HTMLElement>(interactive).forEach((el) => {
    el.addEventListener("pointerenter", () => {
      ring.classList.add("is-hover");
      const text = el.getAttribute("data-cursor");
      if (text) {
        ring.classList.add("is-labelled");
        label.textContent = text;
      }
    });
    el.addEventListener("pointerleave", () => {
      ring.classList.remove("is-hover", "is-labelled");
      label.textContent = "";
    });
  });

  // Magnetic effect for opted-in elements.
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.getAttribute("data-magnetic") || "0.35");
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      xTo(mx * strength);
      yTo(my * strength);
    });
    el.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}
