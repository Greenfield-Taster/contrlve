# КОНТРЛВЕ — show website

A one-page site for the Ukrainian comedy show **КОНТРЛВЕ**, built to replace the show's current site at `contrlve.com.ua`. The show's logo is a line of selected text — Ctrl+V — and the whole page is built around that one idea.

- **Live:** https://contrlve.pages.dev
- **Design spec:** [`docs/superpowers/specs/2026-08-17-contrlve-site-design.md`](docs/superpowers/specs/2026-08-17-contrlve-site-design.md)

## Overview

The page covers everything a first-time viewer needs: the rules of the game, the host and the resident players, a strip of guests from twenty episodes, the iPhone app, a "three words" form, and social links with follower counts.

There is no backend. The three-words form copies the words to the clipboard; nothing is sent anywhere and nothing is stored.

## Highlights

- **No animation library.** Every effect is a CSS transition, a CSS animation or an `IntersectionObserver`. `prefers-reduced-motion: reduce` turns all of it off.
- **Typed content.** Everything that changes lives in `frontend/src/data/`. A new episode is one line in `episodes.ts`; follower counts are numbers in `socials.ts`.
- **No invented facts.** Follower counts, app ratings and episode counts come only from the data files. If a number is missing, the element renders without it.
- **Static build.** The site is a folder of files on Cloudflare Pages.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19, TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Tests | Vitest 4, Testing Library, jsdom |
| Lint | oxlint |
| Local orchestration | .NET Aspire AppHost (optional) |

## Getting started

Requirements: Node.js 22 or newer. For the Aspire path you also need the .NET 10 SDK and the Aspire CLI.

Frontend only:

```bash
cd frontend
npm install
npm run dev
```

Everything together, through Aspire:

```bash
aspire start
```

The AppHost starts the Vite dev server next to the .NET server. The site itself never calls that server; it is kept only for local orchestration.

## Scripts

Run these from `frontend/`.

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and build to `frontend/dist` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit tests once |
| `npm run test:watch` | Run the unit tests in watch mode |
| `npm run lint` | oxlint |

## Project structure

```
contrlve/
├── frontend/                 # the site; the only folder that ships
│   └── src/
│       ├── components/       # page sections and UI pieces
│       ├── data/             # all changeable content (see below)
│       ├── hooks/
│       ├── lib/
│       ├── App.tsx
│       └── main.tsx
├── WebStarter.AppHost/       # .NET Aspire AppHost for local runs
├── WebStarter.Server/        # ASP.NET Core server; not used by the site
└── docs/                     # design spec
```

### Content files

| File | Holds |
|---|---|
| `data/episodes.ts` | Episodes and their guests. Add an episode by adding one entry. |
| `data/hosts.ts` | The host and the resident players |
| `data/rules.ts` | Rules of the game |
| `data/socials.ts` | Social links and follower counts |
| `data/app.ts` | The iPhone app card |
| `data/randomWords.ts` | The word pool for the three-words form |

## Brand

Colours, type and imagery follow the existing `contrlve.com.ua`: yellow `#FAE913`, marker `#FDC20E`, black `#0a0a0a`, red call-to-action `#e5091a`, and Social Gothic Bold for display type. The show's logo is text selected with markers, that is, Ctrl+V, and the page keeps that metaphor throughout.

## Deployment

The site is a static build on Cloudflare Pages.

```bash
cd frontend
npm run build      # → frontend/dist
```

Cloudflare Pages settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

## License

[MIT](LICENSE)
