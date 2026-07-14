import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion, isSmallScreen } from "./env";

// Pin the services section and translate the track horizontally as the user
// scrolls vertically. On small screens / reduced-motion we leave the native
// vertical (or scroll-snap) layout untouched.
let initialized = false;

export function initServicesScroll(): void {
  const section = document.querySelector<HTMLElement>("[data-services]");
  const track = document.querySelector<HTMLElement>("[data-services-track]");
  if (!section || !track) return;

  if (initialized) {
    ScrollTrigger.refresh();
    return;
  }

  if (prefersReducedMotion() || isSmallScreen()) {
    section.classList.add("services--stacked");
    initialized = true;
    return;
  }

  const getScrollDistance = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollDistance() + window.innerHeight * 0.4}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // Per-card parallax on the imagery as panels move through the viewport.
  gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card) => {
    const img = card.querySelector<HTMLElement>(".service-card-img");
    if (!img) return;
    gsap.fromTo(
      img,
      { scale: 1.18, xPercent: -4 },
      {
        scale: 1.02,
        xPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: "left right",
          end: "right left",
          scrub: true,
        },
      }
    );
  });

  // progress bar
  const bar = section.querySelector<HTMLElement>("[data-services-progress]");
  if (bar) {
    gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance() + window.innerHeight * 0.4}`,
        scrub: true,
      },
    });
  }

  ScrollTrigger.refresh();
  initialized = true;

  // Image dimensions and late font loading can change the track width after
  // the initial setup. Refresh once more when the page is fully ready.
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
