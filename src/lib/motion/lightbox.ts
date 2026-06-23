import { gsap } from "gsap";
import { prefersReducedMotion } from "./env";
import { getLenis } from "./smooth";

type Slide = { src: string; alt: string; cat: string; loc: string };

// Accessible portfolio lightbox with clip-path reveal + prev/next/keyboard.
export function initLightbox(): void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-lightbox]")
  );
  if (items.length === 0) return;

  const slides: Slide[] = items.map((el) => ({
    src: el.getAttribute("data-lb-src") || el.querySelector("img")?.getAttribute("src") || "",
    alt: el.querySelector("img")?.getAttribute("alt") || "",
    cat: el.getAttribute("data-lb-cat") || "",
    loc: el.getAttribute("data-lb-loc") || "",
  }));

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Realisatie weergave");
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Sluiten" data-cursor="Sluiten">&times;</button>
    <button class="lb-nav lb-prev" aria-label="Vorige">&larr;</button>
    <button class="lb-nav lb-next" aria-label="Volgende">&rarr;</button>
    <figure class="lb-figure">
      <div class="lb-imgwrap"><img class="lb-img" alt="" /></div>
      <figcaption class="lb-cap">
        <span class="lb-cat"></span>
        <span class="lb-loc"></span>
        <span class="lb-count"></span>
      </figcaption>
    </figure>`;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector<HTMLImageElement>(".lb-img")!;
  const wrap = overlay.querySelector<HTMLElement>(".lb-imgwrap")!;
  const catEl = overlay.querySelector<HTMLElement>(".lb-cat")!;
  const locEl = overlay.querySelector<HTMLElement>(".lb-loc")!;
  const countEl = overlay.querySelector<HTMLElement>(".lb-count")!;
  const reduce = prefersReducedMotion();

  let index = 0;
  let open = false;
  let lastFocus: HTMLElement | null = null;

  const render = () => {
    const s = slides[index];
    imgEl.src = s.src;
    imgEl.alt = s.alt;
    catEl.textContent = s.cat;
    locEl.textContent = s.loc;
    countEl.textContent = `${index + 1} / ${slides.length}`;
    if (!reduce) {
      gsap.fromTo(
        wrap,
        { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
        { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 0.7, ease: "power4.out" }
      );
    }
  };

  const show = (i: number) => {
    index = (i + slides.length) % slides.length;
    open = true;
    lastFocus = document.activeElement as HTMLElement;
    overlay.classList.add("is-open");
    document.body.classList.add("lb-open");
    getLenis()?.stop();
    if (!reduce) gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    render();
    (overlay.querySelector(".lb-close") as HTMLElement)?.focus();
  };

  const hide = () => {
    open = false;
    overlay.classList.remove("is-open");
    document.body.classList.remove("lb-open");
    getLenis()?.start();
    lastFocus?.focus();
  };

  const next = () => render2(index + 1);
  const prev = () => render2(index - 1);
  const render2 = (i: number) => {
    index = (i + slides.length) % slides.length;
    render();
  };

  items.forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      show(i);
    });
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(i);
      }
    });
  });

  overlay.querySelector(".lb-close")?.addEventListener("click", hide);
  overlay.querySelector(".lb-next")?.addEventListener("click", next);
  overlay.querySelector(".lb-prev")?.addEventListener("click", prev);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") hide();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });
}
