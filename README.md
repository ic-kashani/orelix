# Orelix — Website

Static website for Orelix — intelligent AI employees for modern teams.
Built on `@kashani-studio/template-classic`.

## Run locally

```powershell
pnpm install
pnpm dev          # http://localhost:4321
```

## Production build

```powershell
pnpm build        # output in dist/
pnpm preview      # serve the build locally
```

## What to customize

All brand and business data lives in **one** file:

```
src/content/settings.json
```

Capability cards:

```
src/content/services/*.md
```

Images go in:

```
public/uploads/
```

## Deploy

Via Cloudflare Pages, connected to the Git repo.
Build command: `pnpm build`
Output dir: `dist`

## Contact form

Submissions use [Resend](https://resend.com) via `/api/contact` on the Cloudflare Worker.

1. Verify **orelix.be** in Resend (DNS records in Cloudflare)
2. Create an **API key** in Resend
3. Add **`RESEND_API_KEY`** (encrypted) in Cloudflare → orelix Worker → Settings → Variables
4. Redeploy (push to GitHub triggers auto-deploy)

Each submission sends:
- Notification to **info@orelix.be**
- Auto-reply confirmation to the visitor

**Local testing:** copy `.dev.vars.example` → `.dev.vars` and add your key, then `pnpm preview`.
