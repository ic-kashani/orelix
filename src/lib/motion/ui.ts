import { gsap } from "gsap";
import { prefersReducedMotion } from "./env";
import { getLenis } from "./smooth";

// Mobile nav, sticky/auto-hiding header, footer year, form success state.
export function showContactThanks(form: HTMLFormElement): void {
  if (!form.parentNode) return;

  const thanks = document.createElement("div");
  thanks.className = "form-thanks";
  thanks.innerHTML =
    "<strong>Thank you — we received your message.</strong><br />We'll get back to you within one business day. Check your inbox for a confirmation email.";
  form.parentNode.insertBefore(thanks, form);
  form.style.display = "none";

  if (!prefersReducedMotion()) {
    gsap.from(thanks, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" });
  }

  thanks.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function initUI(): void {
  // year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // mobile menu
  const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
  const navLinks = document.querySelector<HTMLElement>(".nav-links");
  if (menuToggle && navLinks) {
    const setMenuOpen = (open: boolean) => {
      navLinks.classList.toggle("is-open", open);
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-menu-open", open);
    };
    menuToggle.addEventListener("click", () =>
      setMenuOpen(!navLinks.classList.contains("is-open"))
    );
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setMenuOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) setMenuOpen(false);
    });
  }

  // header scroll state + auto-hide
  const header = document.querySelector<HTMLElement>(".site-header");
  if (header) {
    let lastY = 0;
    const update = (y: number) => {
      header.classList.toggle("is-scrolled", y > 12);
      const goingDown = y > lastY && y > 240;
      header.classList.toggle("is-hidden", goingDown && !document.body.classList.contains("nav-menu-open"));
      lastY = y;
    };
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", ({ scroll }: { scroll: number }) => update(scroll));
    } else {
      window.addEventListener("scroll", () => update(window.scrollY), { passive: true });
    }
    update(window.scrollY);
  }

  // contact form success (legacy redirect)
  if (window.location.search.indexOf("sent=1") !== -1) {
    const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
    if (form) showContactThanks(form);
  }
}
