import type { APIContext } from "astro";
import { env as workerEnv } from "cloudflare:workers";

/** Server-only secrets from Cloudflare (dashboard Secrets / .dev.vars). */
export function readSecret(key: string, locals?: APIContext["locals"]): string | undefined {
  const fromWorkers = workerEnv[key as keyof typeof workerEnv];
  if (typeof fromWorkers === "string" && fromWorkers) return fromWorkers;

  const runtimeEnv = locals?.runtime?.env as Record<string, string | undefined> | undefined;
  const fromRuntime = runtimeEnv?.[key];
  if (typeof fromRuntime === "string" && fromRuntime) return fromRuntime;

  return undefined;
}
