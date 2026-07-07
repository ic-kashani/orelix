/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
}

declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}

type RuntimeEnv = {
  RESEND_API_KEY?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<RuntimeEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
