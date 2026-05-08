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

4. Environment variables (aanbevolen):

   - `PUBLIC_SITE_URL` = de **exacte** publieke URL van deze deploy (inclusief `https://`), bv. `https://merati-site.kashaibv.workers.dev` of `https://merati-site.pages.dev`.

   Dit overschrijft `site.url` in `settings.json` bij build-time voor `og:url` en voor de Web3Forms redirect (`/?sent=1`). Zonder deze variabele wordt `src/content/settings.json` gebruikt.

5. Deploy. Cloudflare kan een URL geven op **`*.workers.dev`** (Workers) of **`*.pages.dev`** (Pages) — beide zijn geldig.

## Custom domain (later)

Wanneer `meratitegelwerken.be` bij jouw registrar staat: in het Cloudflare-project → **Custom domains** → domein toevoegen. Zet daarna **`PUBLIC_SITE_URL`** op `https://meratitegelwerken.be` en deploy opnieuw (of werk `site.url` in `settings.json` bij en push).

Update ook **`site.url`** in `src/content/settings.json` als je geen build-time env gebruikt, zodat het contactformulier na verzenden terugstuurt naar het juiste domein.
