# Jhin Landing Page

Marketing site for [Jhin](https://jhin.ai) — a self-hosted, open-source platform for running hierarchical teams of autonomous AI agents.

Built with Next.js 16, Tailwind CSS v4, GSAP (ScrollTrigger), and Three.js. Fonts are self-hosted via Fontsource. Fully static — no server-side logic.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Structure

- `app/page.tsx` — single landing page, composed of sections
- `components/Hero.tsx` + `HeroScene.tsx` — Three.js isometric cube constellation with mouse parallax
- `components/OrgChart.tsx` — interactive org tree (tap a node for its permission profile)
- `components/Features.tsx` — feature grid with pointer-follow glow
- `components/Workflow.tsx` — scroll-scrubbed ticket-to-merge timeline
- `components/Install.tsx` — animated terminal with the install command
- `lib/site.ts` — **edit this** to change the GitHub URL and install command

## Theming

Light/dark follows system preference with a manual toggle (persisted in `localStorage`). All colors are CSS variables in `app/globals.css`, derived from the Pastel Skies palette: `#e5d9f2`, `#f5efff`, `#cdc1ff`, `#a594f9`, `#7371fc`.

Animations respect `prefers-reduced-motion`.
