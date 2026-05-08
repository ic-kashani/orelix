# Deploy checklist (Merati site)

## GitHub

1. Maak een **lege** repo in de org (geen README / .gitignore / license):
   [Create repository in kashani-studio](https://github.com/organizations/kashani-studio/repositories/new)

   - Name: `merati-site`
   - Visibility: Public (aanbevolen voor portfolio) of Private

2. Lokaal pushen (vanuit deze map):

   ```powershell
   cd C:\Users\SinaKashani\Documents\dev\clients\merati
   git remote remove origin 2>$null
   git remote add origin https://github.com/kashani-studio/merati-site.git
   git push -u origin main
   ```

   Bij een loginprompt: gebruik het GitHub-account dat **access** heeft tot `kashani-studio` (liefst `ic-kashani`).

## Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

2. Autoriseer GitHub en kies repo `kashani-studio/merati-site`.

3. Build settings:

   | Field | Value |
   |-------|--------|
   | Framework preset | Astro (of None) |
   | Build command | `pnpm install && pnpm build` |
   | Build output directory | `dist` |
   | Root directory | `/` (default) |

4. Environment variables (optional):

   - `PUBLIC_SITE_URL` = `https://<your-pages-subdomain>.pages.dev` (later vervangen door `https://meratitegelwerken.be` wanneer het domein live is)

5. Deploy. De eerste URL is iets als `merati-site.pages.dev`.

## Custom domain (later)

Wanneer `meratitegelwerken.be` bij jouw registrar staat: **Pages project** → **Custom domains** → voeg domein toe en volg DNS-instructies (meestal CNAME naar `*.pages.dev`).
