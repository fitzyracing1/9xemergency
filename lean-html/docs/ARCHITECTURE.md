# Lean Internet Architecture

## Goal

Build the cheapest, most resilient document and resource layer possible on top of the existing web, without requiring permission from browser vendors or breaking compatibility.

This is not a full internet replacement. It is the highest-leverage foundation that can be shipped today and extended later.

## Principles

1. **Additive, never breaking**  
   Every page remains valid HTML5. Unknown attributes are ignored by current browsers.

2. **Cost is a first-class constraint**  
   Prefer local and content-addressed resolution. Minimize repeated bytes and round-trips.

3. **Verifiability over trust**  
   Integrity and optional provenance let clients verify content instead of blindly trusting origins.

4. **User agency**  
   The client decides whether to honor local-first behavior. No forced intermediaries.

5. **Progressive enhancement**  
   Without the processing layer the page still works. With it, the cheaper path becomes available.

## Layers

```
┌─────────────────────────────────────────────┐
│  Applications & Sites                       │
│  (use Lean HTML attributes)                 │
├─────────────────────────────────────────────┤
│  Lean HTML Document Layer                   │
│  attributes + polyfill + conventions           │
├─────────────────────────────────────────────┤
│  Local-First Resolution                     │
│  Service Worker + Cache API + IndexedDB     │
├─────────────────────────────────────────────┤
│  Content-Addressed Store (optional)         │
│  hash → bytes  (later: Helia / IPFS / etc.) │
├─────────────────────────────────────────────┤
│  Existing Web (HTTP, DNS, browsers)         │
└─────────────────────────────────────────────┘
```

## Core Attributes (v0.1)

| Attribute          | Target elements              | Purpose                                      |
|--------------------|------------------------------|----------------------------------------------|
| `lean`             | `<html>` or sections         | Opt-in marker                                |
| `local-first`      | resources + content blocks   | Prefer local/content-addressed before network|
| `content-address`  | resources + content blocks   | Hash or CID of the expected bytes            |
| `integrity`        | resources + content blocks   | Cryptographic hash (SRI-compatible)          |
| `provenance`       | content blocks               | Claimed author / origin (DID or URL)         |

## Resolution Algorithm (simplified)

For any resource marked `local-first` with a `content-address`:

1. Look up the content-address in the local store (Cache API / IndexedDB / in-memory).
2. If found and integrity matches → use local bytes.
3. Otherwise fetch from the network URL.
4. On successful network fetch, optionally store under the content-address for future local hits.
5. Always respect `integrity` when present.

## What This Does Not Solve (yet)

- Video and large media economics
- Advertising incentive structure
- Last-mile bandwidth pricing
- Full peer-to-peer discovery at global scale

Those require complementary protocols and economic changes. Lean HTML makes the document layer ready for them.

## Evolution Path

1. **Now** – attributes + polyfill + service worker + local cache
2. **Next** – real content-addressed backend (Helia or equivalent)
3. **Later** – micropayment / value hints, stronger identity binding, standardized attributes
