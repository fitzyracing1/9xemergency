# Emergency Internet Architecture

## Stack

```
┌──────────────────────────────────────────────────────┐
│  Emergency Applications                              │
│  (status boards, safety alerts, coordination notes)  │
├──────────────────────────────────────────────────────┤
│  Emergency Profile (priorities, modes, policies)     │
├──────────────────────────────────────────────────────┤
│  Lean HTML Document Layer                            │
│  local-first • content-address • integrity           │
├──────────────────────────────────────────────────────┤
│  Local Store + Service Worker                        │
│  IndexedDB / Cache API / in-memory                   │
├──────────────────────────────────────────────────────┤
│  Optional Transports                                 │
│  HTTP (when available) • WebRTC • BroadcastChannel   │
│  later: mesh radio, LoRa, satellite, sneakernet      │
└──────────────────────────────────────────────────────┘
```

## Emergency Modes

| Mode | Behavior |
|------|----------|
| `normal` | Lean HTML defaults (prefer local, fall back to network) |
| `degraded` | Aggressive local preference, strip non-critical resources |
| `isolated` | No network assumptions; operate purely from local + nearby peers |
| `broadcast` | Prioritize outgoing critical messages; accept high latency |

## Priority Classes

1. **P0 – Life safety** (alerts, evacuation, medical)
2. **P1 – Coordination** (meeting points, resource status)
3. **P2 – Situational awareness** (maps, conditions, verified reports)
4. **P3 – General information**

Documents and resources can declare a priority so the system knows what to keep, share, or drop first under pressure.

## Key Attributes (Emergency Profile)

All Lean HTML attributes remain valid, plus:

| Attribute | Purpose |
|-----------|---------|
| `emergency` | Marks a document or section as emergency-relevant |
| `priority="0\|1\|2\|3"` | Life-safety → general |
| `ttl` | Optional time-to-live hint for stale data |
| `shareable` | Explicitly allowed for peer / proximity exchange |

## Resilience Rules

- Never require a round-trip to a distant origin for already-known content.
- Prefer verification over authority.
- When in doubt, keep P0/P1 data and drop decorative or tracking resources.
- Support offline authoring and later sync.
