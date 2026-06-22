# Fin-Lumen v35.1 — UI + Full-Universe NVE Hardening

## Changes

- Visible chart selector button strip in expanded stock card.
- Chart-specific replay preview remains available for every candidate chart.
- Main table can continue to use the best current astro-match.
- Strong language is capped when TRM/replay/natal reliability do not support it.
- Action badges use compact labels to avoid layout spillover.
- `GET /api/natal-validation?all=1` returns automated NVE scoring across the built-in universe.
- No composite charts are created.

## Language cap

Do not print strong rerating or strong forward-leader language when any of these are true:

- TRM expression score below 60
- sector fit below 45
- replay memory absent or weak
- natal reliability below 60
- TRM class is pressure / weak / background

## Full universe

The v35.1 endpoint can score all available chart candidates in the registry. This is a fast chart-selection readiness pass. Deep event-level replay can still be run stock-by-stock or added later as a heavier batch job.
