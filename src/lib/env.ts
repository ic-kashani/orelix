import type { APIContext } from "astro";

/** Server-only secrets from Cloudflare (dashboard Variables / .dev.vars). */
export function readSecret(key: string, locals?: APIContext["locals"]): string | undefined {
  const runtimeEnv = locals?.runtime?.env as Record<string, string | undefined> | undefined;
  const value = runtimeEnv?.[key];
  return typeof value === "string" && value ? value : undefined;
}
