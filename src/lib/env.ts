import type { APIContext } from "astro";

/** Server-only secrets from Cloudflare (dashboard Secrets, build vars, or .dev.vars). */
export function readSecret(key: string, locals?: APIContext["locals"]): string | undefined {
  const runtimeEnv = locals?.runtime?.env as Record<string, unknown> | undefined;
  const fromRuntime = runtimeEnv?.[key];
  if (typeof fromRuntime === "string" && fromRuntime) return fromRuntime;

  const fromProcess = process.env[key];
  if (typeof fromProcess === "string" && fromProcess) return fromProcess;

  const fromMeta = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof fromMeta === "string" && fromMeta) return fromMeta;

  return undefined;
}
