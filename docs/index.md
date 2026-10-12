# Emergency Internet (repo: 9xemergency)

Emergency Internet is a local-first, priority-aware, verifiable document layer meant for times when normal connectivity is degraded or gone. It is browser JavaScript (ES modules) with a Service Worker, built on the "Lean HTML" ideas in `lean-html/`. The npm package name is `emergency-internet` v0.1.0.

## Getting started

```bash
git clone https://github.com/fitzyracing1/9xemergency.git && cd 9xemergency
npm start        # = npx serve .
# open /public/ ; or: npm run demo  (= npx serve public)
```

The README clone URL points to `emergency-internet.git`. This repo is published as `9xemergency`.

## Usage

- Modes: `normal`, `degraded`, `isolated`, `broadcast`
- Priority classes: P0 (life safety) to P3 (general)
- Markup attributes: `emergency`, `priority="0..3"`, `content-address`, `local-first`, `integrity="sha256-…"`, `shareable` on elements, and `<html emergency lean>`

## Files

| Path | Role |
|---|---|
| `src/emergency.js` | main module: modes, priority, IndexedDB content-addressed store, integrity, broadcast bus |
| `src/sw.js` | Service Worker for offline caching |
| `public/index.html`, `public/offline.html` | demo pages |
| `lean-html/` | Lean HTML sub-project (`src/lean-html.js`, `src/sw.js`, its own README and architecture doc) |
| `docs/ARCHITECTURE.md`, `docs/VISION.md` | existing architecture and vision docs |

The repo has no tests and no CI.

MIT License. Copyright (c) 2026 Joshua Almeida
