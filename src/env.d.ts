/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type RuntimeEnv = {
  RESEND_API_KEY?: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<RuntimeEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}