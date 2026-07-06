import type { APIContext } from "astro";

/** Server-only secrets — build-time (CI) or runtime (dashboard / .dev.vars). */
export function readSecret(key: string, locals?: APIContext["locals"]): string | undefined {
  const fromMeta = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof fromMeta === "string" && fromMeta) return fromMeta;

  const runtimeEnv = locals?.runtime?.env as Record<string, string | undefined> | undefined;
  const fromRuntime = runtimeEnv?.[key];
  if (typeof fromRuntime === "string" && fromRuntime) return fromRuntime;

  return undefined;
}
