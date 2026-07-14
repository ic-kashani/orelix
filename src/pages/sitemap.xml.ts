import type { APIRoute } from "astro";
import settings from "../content/settings.json";

export const prerender = true;

const siteUrl = settings.site.url.replace(/\/$/, "");
const paths = [
  "/",
  "/vision",
  "/oplossingen",
  "/offerte-opvolging-automatiseren",
  "/e-mails-en-administratie-automatiseren",
  "/automatisatie-installatiebedrijven",
  "/how-we-work",
  "/over-orelix",
  "/privacy",
];

export const GET: APIRoute = () => {
  const urls = paths
    .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
