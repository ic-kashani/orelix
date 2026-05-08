# Merati Tegelwerken - Website

Statische website voor Merati Tegelwerken (Behrouz Merati, Dessel).
Gebouwd op `@kashani-studio/template-classic`.

## Lokaal draaien

```powershell
pnpm install
pnpm dev          # http://localhost:4321
```

## Build voor productie

```powershell
pnpm build        # output in dist/
pnpm preview      # lokaal de build serveren
```

## Wat aanpassen

Alle merk- en bedrijfsdata zit in **EEN** bestand:

```
src/content/settings.json
```

Foto's gaan in:

```
public/uploads/
```

Dienst- en project-pagina's:

```
src/content/services/*.md
src/content/projects/*.md
```

## Deploy

Via Cloudflare Pages, gekoppeld aan de Git-repo.
Build command: `pnpm build`
Output dir: `dist`

## Domain

`https://meratitegelwerken.be` - geconfigureerd via Cloudflare Pages -> Custom Domains.

## Contactformulier

Form-submissions lopen via [Web3Forms](https://web3forms.com).
Access key staat in `src/content/settings.json` -> `forms.web3formsKey`.