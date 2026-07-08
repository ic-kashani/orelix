import type { APIContext } from "astro";

declare const __RESEND_API_KEY__: string | undefined;

/** Server-only Resend API key from Cloudflare Workers runtime. */
export async function getResendApiKey(
  locals?: APIContext["locals"],
): Promise<string | undefined> {
  try {
    const { env } = await import("cloudflare:workers");
    const key = env.RESEND_API_KEY;
    if (typeof key === "string" && key) return key;
  } catch {
    /* not on Workers runtime */
  }

  const runtimeEnv = locals?.runtime?.env as Record<string, unknown> | undefined;
  const fromRuntime = runtimeEnv?.RESEND_API_KEY;
  if (typeof fromRuntime === "string" && fromRuntime) return fromRuntime;

  if (typeof __RESEND_API_KEY__ === "string" && __RESEND_API_KEY__) {
    return __RESEND_API_KEY__;
  }

  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process;
  const fromProcess = proc?.env?.RESEND_API_KEY;
  if (typeof fromProcess === "string" && fromProcess) return fromProcess;

  return undefined;
}
