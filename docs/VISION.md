# Emergency Internet

## Purpose

Build a resilient information and communication layer that continues to function when the normal internet is degraded, partitioned, censored, or unavailable.

This is not a replacement for the global internet.  
It is the fallback that keeps critical communication and knowledge alive.

## Design Constraints (Emergency Mode)

1. **Assume the network is hostile or missing**
2. **Prefer local and nearby over distant**
3. **Minimize bytes and energy**
4. **Verify before trust**
5. **Work on low-end devices and intermittent links**
6. **Remain compatible with ordinary browsers when possible**

## Core Capabilities

| Capability | Why it matters in an emergency |
|------------|--------------------------------|
| Local-first by default | Information stays available after connectivity is lost |
| Content-addressed storage | Same facts can be shared from any node without central servers |
| Integrity + provenance | Reduces risk of injected false information |
| Extreme prioritization | Critical messages (status, safety, coordination) take precedence |
| Peer / proximity sharing | Nearby devices can exchange data without the global internet |
| Graceful degradation | Something useful still works when almost everything is broken |

## Relationship to Lean HTML

Lean HTML provides the document and resource layer (local-first, content-address, integrity).  
Emergency Internet adds the operational profile, prioritization, offline defaults, and resilience patterns on top of that foundation.

## What “Emergency Internet” is not

- A full mesh radio stack (though it can sit above one)
- A guaranteed censorship-resistant global network
- A replacement for licensed emergency services

It is the open, browser-reachable, local-first layer that can be deployed quickly and extended later with stronger transport (LoRa, mesh radios, satellite, sneakernet, etc.).
