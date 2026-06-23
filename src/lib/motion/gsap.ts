import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./smooth";

let registered = false;

export function initGsap(): typeof gsap {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger);

  const lenis = getLenis();
  if (lenis) {
    // Drive ScrollTrigger from Lenis so pinning + smooth scroll stay in sync.
    lenis.on("scroll", ScrollTrigger.update);
    // Guard the driver: a throw inside a ticker callback would otherwise break
    // GSAP's global RAF loop and freeze every animation (incl. the preloader).
    gsap.ticker.add((time: number) => {
      try {
        lenis.raf(time * 1000);
      } catch (err) {
        console.warn("[motion] lenis raf error:", err);
      }
    });
    gsap.ticker.lagSmoothing(0);
  }

  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };
