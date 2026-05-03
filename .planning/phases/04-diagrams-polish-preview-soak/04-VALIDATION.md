---
phase: 4
phase_slug: diagrams-polish-preview-soak
date: 2026-05-03
framework: None (manual verification + soak)
---

# Phase 4 Validation Strategy

## Framework Selection
**Framework:** None — Phase 4 is a soak/polish phase with no automated test surface to add.
**Rationale:** Diagram rendering, mobile legibility, Lighthouse perf, and cold-read are observation-only outcomes. Adding Vitest/Playwright fixtures for static markup would be ceremony without signal.

## Manual Verification Commands
| Check | Command / Action | Pass Threshold |
|---|---|---|
| Type check | `npx astro check` | exits 0 |
| Build | `npm run build` | exits 0 |
| Local preview | `npm run preview` then open http://localhost:4321/ | both diagrams render after scroll; no console errors |
| Mobile legibility | DevTools device-emulation @ 320, 375, 414px | both diagrams legible (horizontal scroll OK) |
| Lighthouse mobile | PSI URL `https://pagespeed.web.dev/report?url=<preview-url>&form_factor=mobile` | perf ≥95, a11y ≥95, SEO ≥95, best-practices ≥95 |
| Network gate | DevTools Network filter `mermaid` BEFORE scrolling to diagrams | zero requests for mermaid runtime |
| PostHog ingestion | PostHog dashboard → Live events during soak | zero ingestion warnings over 24h |
| Browser console | PostHog `$exception` toggle ON; live-events filter `$exception` over 24h | zero entries |
| Cold-read | VISUAL-05 protocol — see Plan 04-04 task 6 | reader articulates positioning within 60s |
| 16-item PITFALLS | Plan 04-04 SOAK-CHECKLIST.md — record numeric measurements | 16/16 verified |

## Validation Architecture
- **Unit / integration:** none — no testable JS modules in this phase (MermaidDiagram is a thin IO+import wrapper; logic-free).
- **E2E:** none — Playwright would test `mermaid` loaded after scroll which is already CI-uneconomic; manual DevTools observation suffices.
- **Acceptance:** human (cold-read VISUAL-05) + Lighthouse PSI numeric thresholds.
- **Soak:** ≥24h on long-lived preview URL with PostHog ingestion + browser-console + Lighthouse all green.

## Why no automated suite
This phase touches:
- 1 component rewrite (MermaidDiagram.astro) — pure dynamic-import wrapper, no branching logic worth a unit test.
- Static assets (og.png, favicons, robots.txt, sitemap) — testable only via build-output presence checks (already in plan acceptance_criteria via `test -f`).
- Page composition (`index.astro` adds 2 component instances) — visual-only, manual smoke.
- Cold-read + soak — by definition human + calendar-time gates.

A future automated check worth adding (out of scope for Phase 4): a Playwright test that asserts the Mermaid runtime is NOT in the network log on initial paint. File this as a backlog item, do not block Phase 4 on it.
