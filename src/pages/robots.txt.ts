import type { APIRoute } from "astro";
import settings from "../content/settings.json";

export const prerender = true;

const siteUrl = settings.site.url.replace(/\/$/, "");

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
