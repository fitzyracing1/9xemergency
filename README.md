# Emergency Internet

**A resilient information layer for when the normal internet fails.**

Emergency Internet is a local-first, priority-aware, verifiable document system for degraded and disconnected conditions. It keeps life-safety and coordination information available even when global connectivity is gone.

Built on **Lean HTML** principles: content-addressed resources, integrity verification, and local-first resolution.

---

## Quick start

```bash
git clone https://github.com/fitzyracing1/emergency-internet.git
cd emergency-internet
npx serve .
```

Open `/public/` in your browser.

- Switch modes: **Normal → Degraded → Isolated → Broadcast**
- Watch low-priority content yield under pressure
- Enable the Service Worker for offline caching

---

## What it provides

| Feature | Purpose |
|---------|---------|
| **Emergency modes** | `normal` / `degraded` / `isolated` / `broadcast` |
| **Priority classes** | P0 life-safety → P3 general |
| **Local-first by default** | Especially in degraded & isolated modes |
| **Content-addressed store** | IndexedDB-backed |
| **Integrity & shareable markers** | Verifiable, peer-ready content |
| **Service Worker** | Aggressive offline caching |
| **Same-origin broadcast bus** | Simple local coordination between tabs |

---

## Core attributes

```html
<html emergency lean>

<article emergency
         priority="0"
         content-address="em-p0-evacuation-v1"
         local-first
         integrity="sha256-…"
         shareable>
  Critical message here
</article>
```

- `emergency` — marks critical content  
- `priority="0|1|2|3"` — life safety → general  
- `local-first` / `content-address` / `integrity` — Lean HTML foundation  
- `shareable` — allowed for proximity / peer exchange  

---

## Project structure

```
emergency-internet/
├── README.md
├── LICENSE
├── package.json
├── docs/
│   ├── VISION.md
│   └── ARCHITECTURE.md
├── src/
│   ├── emergency.js      # runtime (modes, priorities, store)
│   └── sw.js             # offline-first service worker
├── public/
│   ├── index.html        # live emergency board demo
│   └── offline.html      # offline fallback
└── lean-html/            # foundation layer (cheaper everyday internet)
    ├── README.md
    ├── docs/
    ├── src/
    └── public/
```

---

## Design stance

- Assume the network can disappear at any moment
- Keep P0/P1 data first
- Prefer verification over authority
- Stay compatible with ordinary browsers
- Remain small enough to deploy quickly

This is not a full mesh radio stack. It is the open, browser-reachable foundation that can sit on stronger transports later (mesh, LoRa, satellite, sneakernet).

---

## Lean HTML foundation

The `lean-html/` directory contains the everyday document layer this project builds on:

- Additive attributes for local-first and content-addressed resources
- Integrity and provenance markers
- Progressive enhancement (works without the script)

See `lean-html/README.md` and `lean-html/docs/ARCHITECTURE.md`.

---

## License

MIT
