# Fin-Lumen v35.3 — Thesis Strength + New Stock Natal Entry

Micro-patch only. Core astrology logic is intentionally frozen for watch/test mode.

## Locked doctrine

`2026–28 Thesis Strength = horizon conviction`

`Current Capital Usability = timing discipline`

A stock may therefore remain `EXTREME` on the 2026–28 thesis while still showing `Watch`, `Stagger`, or `Protect / restraint` for the current window.

## Display change

Old:

`Long-range cycle potential: EXTREME. Current usability: watch.`

New:

`2026–28 Thesis Strength: EXTREME. Current Capital Usability: Watch.`

This preserves the original multibagger research without turning every high-thesis stock into an immediate add signal.

## New stocks and natal data

The app still supports adding a new stock from the top input.

After adding a stock, use the Natal Registry Editor to enter:

- symbol
- company name
- chart type
- chart ID
- natal date
- natal time
- city/place
- confidence/source notes

Saving natal data writes to Supabase `natal_registry`.

v35.3 changes the save behavior so additional chart candidates are appended/updated rather than replacing existing candidates. New charts become available to:

- Natal Validation Engine
- Chart Selector
- replay / replay-lab chart selection
- full-universe NVE readiness scoring

No composite charts are created.
