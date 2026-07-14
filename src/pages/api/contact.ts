import type { APIRoute } from "astro";
import settings from "../../content/settings.json";
import { getResendApiKey } from "../../lib/env";

export const prerender = false;

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  message?: string;
  website?: string;
}

async function sendResendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Resend error ${res.status}`);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const apiKey = await getResendApiKey(locals);
  if (!apiKey) {
    return Response.json({ error: "E-mailservice is nog niet geconfigureerd" }, { status: 503 });
  }

  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  if (data.website?.trim()) {
    return Response.json({ ok: true });
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";
  const phone = data.phone?.trim() || "-";
  const company = data.company?.trim() || "-";
  const interest = data.interest?.trim() || "-";

  if (!name || !email || !message) {
    return Response.json(
      { error: "Naam, e-mail en bericht zijn verplicht" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
  }

  const from = settings.forms.fromEmail;
  const notify = settings.contact.email;
  const firstName = name.split(/\s+/)[0] || name;

  const inquiryText = [
    `Naam: ${name}`,
    `E-mail: ${email}`,
    `Telefoon: ${phone}`,
    `Bedrijf: ${company}`,
    `Onderwerp: ${interest}`,
    "",
    message,
  ].join("\n");

  const subjectSuffix =
    company !== "-" ? ` - ${name} (${company})` : ` - ${name}`;

  const confirmationText = `Dag ${firstName},

Bedankt voor uw bericht aan ${settings.business.name}. We hebben uw aanvraag goed ontvangen en komen binnen een werkdag bij u terug.

Is het dringend? Bel ons gerust via ${settings.contact.phoneDisplay || settings.contact.phone}.

Het ${settings.business.name}-team`;

  try {
    await sendResendEmail(apiKey, {
      from,
      to: [email],
      reply_to: notify,
      subject: `We hebben uw bericht ontvangen - ${settings.business.name}`,
      text: confirmationText,
    });

    const runtime = locals.runtime as { ctx?: { waitUntil?: (promise: Promise<unknown>) => void } } | undefined;
    const notifyPromise = sendResendEmail(apiKey, {
      from,
      to: [notify],
      reply_to: email,
      subject: `Nieuwe aanvraag${subjectSuffix}`,
      text: inquiryText,
    });

    if (runtime?.ctx?.waitUntil) {
      runtime.ctx.waitUntil(
        notifyPromise.catch((err) => {
          console.error("[contact notify]", err);
        }),
      );
    } else {
      await notifyPromise;
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json(
      { error: "De e-mailprovider heeft het bericht geweigerd" },
      { status: 502 },
    );
  }
};
