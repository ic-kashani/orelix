# Deploy checklist (Orelix site)

## GitHub

1. Create an **empty** repo in the org (no README / .gitignore / license):
   [Create repository in kashani-studio](https://github.com/organizations/kashani-studio/repositories/new)

   - Name: `orelix-site`
   - Visibility: Public (recommended) or Private

2. Push locally (from this folder):

   ```powershell
   cd C:\Users\SinaKashani\Documents\dev\clients\orelix
   git remote remove origin 2>$null
   git remote add origin https://github.com/kashani-studio/orelix-site.git
   git push -u origin main
   ```

## Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

2. Authorize GitHub and select repo `kashani-studio/orelix-site`.

3. Build settings:

   | Field | Value |
   |-------|--------|
   | Framework preset | Astro (or None) |
   | Build command | `pnpm install && pnpm build` |
   | Build output directory | `dist` |
   | Root directory | `/` (default) |

4. Environment variables (recommended):

   - `PUBLIC_SITE_URL` = `https://orelix.be`
   - `RESEND_API_KEY` = your Resend API key (encrypted; powers contact form + auto-reply)

5. Deploy.

## Custom domain (later)

When `orelix.com` is configured at your registrar: in the Cloudflare project → **Custom domains** → add the domain. Then set **`PUBLIC_SITE_URL`** to `https://orelix.com` and redeploy.
