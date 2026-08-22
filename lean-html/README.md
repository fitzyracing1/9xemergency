# Lean HTML

**Building a cheaper internet, starting at the document layer.**

Lean HTML is an additive, parse-compatible extension to HTML.  
It adds a small set of attributes and a processing layer that let documents prefer local and content-addressed resources, verify integrity, and reduce unnecessary network cost.

Existing browsers ignore the new attributes.  
When the Lean layer is present, the cheaper path becomes available.

---

## Why this exists

Most of the cost of the modern web comes from:

- Repeated downloads of the same bytes
- Heavy client-side JavaScript
- Forced trust in centralized origins and CDNs
- Attention-extracting economic models layered on top of documents

We cannot rewrite the entire internet tomorrow.  
We can make the document and resource layer cheaper and more resilient *today*.

## Core idea

```html
<html lean>
  <link rel="stylesheet"
        href="https://cdn.example.com/app.css"
        content-address="sha256-…"
        integrity="sha256-…"
        local-first>

  <article content-address="sha256-…"
           integrity="sha256-…"
           provenance="did:key:…"
           local-first>
    …
  </article>
</html>
```

- `local-first` — try local store before the network  
- `content-address` — identify by hash / CID  
- `integrity` — verify the bytes  
- `provenance` — claimed origin / author  

## Project structure

```
lean-html/
├── README.md
├── package.json
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── lean-html.js      # core processing layer + IndexedDB store
│   └── sw.js             # service worker for local-first caching
└── public/
    └── index.html        # live demo
```

## Quick start

```bash
cd lean-html
npx serve .
```

Open the public demo.  
Open the browser console — you should see `[Lean HTML] ready`.

Click the button on the demo page to register the Service Worker for basic local-first caching.

## What works today

- Attribute scanning and progressive enhancement
- IndexedDB-backed content-addressed store
- Service Worker that caches successful responses
- Integrity / provenance markers on elements
- Fully valid HTML5 — no parser changes required

## What comes next

1. Real content-addressed networking (Helia / IPFS or equivalent)
2. Actual resource swapping when a local hit occurs
3. Stronger integrity verification (full SRI + streaming)
4. Optional micropayment / value hints
5. Benchmarks that quantify bandwidth savings
6. Upstream proposals if the attributes prove valuable

## Design principles

1. Additive, never breaking
2. Cost is a first-class constraint
3. Verifiability over blind trust
4. User agency at the client
5. Progressive enhancement

## Relationship to a full internet rebuild

Lean HTML is the practical document-layer foundation.  
It does not solve video economics, advertising incentives, or last-mile pricing by itself.  
It makes the web ready for better protocols and incentives by removing the assumption that every byte must come from a trusted origin every time.

See `docs/ARCHITECTURE.md` for the layered model.

## License

MIT
