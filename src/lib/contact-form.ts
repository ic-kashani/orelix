import { showContactThanks } from "./motion/ui";

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const errorEl = form.querySelector<HTMLElement>(".form-error");
  const defaultLabel = submitBtn?.textContent ?? "Book a Discovery Call";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!submitBtn) return;

    errorEl?.setAttribute("hidden", "");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      showContactThanks(form);
    } catch (err) {
      if (errorEl) {
        errorEl.textContent =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        errorEl.removeAttribute("hidden");
      }
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
  });
}
