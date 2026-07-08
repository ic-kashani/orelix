import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // Per klant overschreven via env var of build-config bij de host (Cloudflare Pages).
  site: process.env.PUBLIC_SITE_URL ?? "https://example.com",

  trailingSlash: "ignore",

  build: {
    format: "directory",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  adapter: cloudflare(),

  vite: {
    define: {
      __RESEND_API_KEY__: JSON.stringify(process.env.RESEND_API_KEY ?? ""),
    },
  },
});