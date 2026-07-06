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

Form submissions run through [Web3Forms](https://web3forms.com).
Set your access key in `src/content/settings.json` → `forms.web3formsKey`.
Without a key, the contact section shows a mailto fallback.
