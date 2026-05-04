---
phase: "03"
plan: "03"
subsystem: analytics
tags: [posthog, sdk, analytics, csp, delegated-listener, intersection-observer, canary]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [posthog-sdk-initialized, canary-events, nav-footer-instrumented, explainer-scroll-tracking]
  affects: [Base.astro, Analytics.astro, Nav.astro, Footer.astro, AgenticAIExplainer.astro, vercel.json]
tech_stack:
  added: []
  patterns:
    - PostHog CDN snippet via is:inline + define:vars (Pattern 1)
    - Delegated click listener reading data-event attributes from any child element
    - IntersectionObserver with threshold 1.0 for scroll-complete tracking
decisions:
  - "CSP: added 'unsafe-inline' to script-src (Pitfall 3 path 1) — acceptable for v1 marketing site with no UGC or auth; revisit Phase 4 with CSP nonces via Astro 6 addScriptHashes"
  - "diagram:view tracking deferred to Phase 4 — MermaidDiagram.astro not in use in index.astro; event type removed from analytics.ts per orchestrator direction"
  - "mermaid@11 installed as runtime dep to resolve TypeScript module declaration error in MermaidDiagram.astro"
key_files:
  created:
    - src/components/global/Analytics.astro
  modified:
    - src/layouts/Base.astro
    - src/components/global/Nav.astro
    - src/components/global/Footer.astro
    - src/components/sections/AgenticAIExplainer.astro
    - src/components/diagrams/MermaidDiagram.astro
    - vercel.json
    - package.json
metrics:
  completed: "2026-05-04"
  tasks_completed: 7
  tasks_total: 8
  files_created: 1
  files_modified: 7
---

# Phase 03 Plan 03: PostHog SDK Initialization + Analytics Rails Summary

PostHog SDK bootstrapped via is:inline snippet in Analytics.astro, wired into Base.astro for all pages; nav, footer, card, and explainer scroll events instrumented via delegated listener and IntersectionObserver pattern.

## What Was Built

### Files Created

- **src/components/global/Analytics.astro** (35 lines) — PostHog CDN snippet + posthog.init with locked Phase 3 config. Canary `page:home_view` fires from the `loaded:` callback. Conditional render on `posthogKey` (fails closed on missing env var). `define:vars={{ posthogKey }}` injects `PUBLIC_POSTHOG_KEY` correctly (verified: `const posthogKey = "phc_..."` appears in dist/index.html).

### Files Modified

- **src/layouts/Base.astro** — Imports and renders `<Analytics />` as first child of `<head>`; adds component-scoped delegated click listener handling `card:open`, `card:cta_external_click`, `nav:link_click`, `footer:link_click` via `data-event` attribute reads.
- **src/components/global/Nav.astro** — All 3 `<a>` tags (home logo, desktop link, mobile menu link) carry `data-event="nav:link_click"` + `data-link-location` (header-home, header-products, mobile-menu-products).
- **src/components/global/Footer.astro** — All 3 `<a>` tags carry `data-event="footer:link_click"` + `data-link-location` (docs, email, github).
- **src/components/sections/AgenticAIExplainer.astro** — Last `<p>` tagged `data-educator-end`; component-scoped script adds IntersectionObserver (threshold 1.0, fires once via `fired` flag + `obs.disconnect()`).
- **src/components/diagrams/MermaidDiagram.astro** — diagram:view tracking script removed (see Deviations); `data-diagram-id` attribute preserved on wrapper div.
- **vercel.json** — `script-src` patched to `'self' 'unsafe-inline' https://us-assets.i.posthog.com`; all other CSP directives unchanged.
- **package.json** — `mermaid@^11` added as runtime dep to fix TypeScript module declaration error.

## Boundary Inversion Verified

`dist/index.html` posthog occurrence count (after build with env var): **2**

Phase 2 invariant was `! grep -ri 'posthog' dist/` (zero). Phase 3 inverts to expecting posthog presence. Both `npm run analytics-audit` and `npm run honesty-audit` pass.

Key injection pattern: `const posthogKey = "phc_xHS9qnkZehwYdcNmA3BUmCD7KFCDYATX8qVcaugPFxZM"` followed by `posthog.init(posthogKey, {...})` — variable injection via `define:vars`, not string literal. Correct per Pitfall 2.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed diagram:view tracking from MermaidDiagram.astro**
- **Found during:** Pre-execution check (astro check showed type error)
- **Issue:** `track('diagram:view', ...)` in MermaidDiagram.astro referenced `'diagram:view'` which was absent from the `EventName` union in analytics.ts. This caused a TypeScript compilation error. The orchestrator context note confirmed: "diagram:view tracking has been REMOVED from analytics.ts — Do NOT wire any diagram:view tracking."
- **Fix:** Removed the tracking `<script>` block from MermaidDiagram.astro. `data-diagram-id` attribute preserved on the wrapper `<div>` for Phase 4 forward-compat.
- **Files modified:** src/components/diagrams/MermaidDiagram.astro
- **Commit:** 2b6314f

**2. [Rule 3 - Blocking] Installed mermaid@11 to fix TypeScript module declaration error**
- **Found during:** Pre-execution check (astro check showed `Cannot find module 'mermaid'`)
- **Issue:** MermaidDiagram.astro contains `import('mermaid')` dynamic import. The mermaid package was not in package.json dependencies, causing a TypeScript error that prevented astro check from passing.
- **Fix:** `npm install mermaid` added `mermaid@^11` to dependencies.
- **Commit:** 2b6314f

**3. [Rule 1 - Bug] .env.local not present in worktree**
- **Found during:** Task 7 build verification
- **Issue:** The worktree was missing `.env.local`. Build produced a page with posthog found but key was rendered as variable. Creating `.env.local` with `PUBLIC_POSTHOG_KEY` in the worktree resolved this for local build verification.
- **Fix:** Created `.env.local` in worktree (gitignored; not committed).

## CSP Trade-off Acknowledgment

`'unsafe-inline'` in `script-src` weakens the Content Security Policy. Accepted for v1:
- No user-generated content rendered on this site
- No SQL, no auth, no admin surface
- The PostHog `<script is:inline>` snippet cannot use a `src` attribute (it's an IIFE that self-modifies the DOM to load array.js)

**Phase 4 upgrade path:** Astro 6's `addScriptHashes` CSP API can emit per-script `sha256-` hashes, replacing `'unsafe-inline'` with content-addressed hashes. Tracked as Phase 4 polish item.

## Phase 4 Forward Marker

The `data-diagram-id` attribute is preserved on MermaidDiagram.astro's wrapper `<div>`. When Phase 4 restores diagrams to the page and re-adds `'diagram:view'` to the EventName union in analytics.ts, the tracking script should be re-added to MermaidDiagram.astro using the Pattern 6b template from 03-RESEARCH.md (lines 862-880). The Phase 4 plan must preserve `data-diagram-id` on the wrapper element.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | d55d661 | feat(03-03): create Analytics.astro with PostHog snippet + canary fire |
| Task 2 | cb7f4f1 | feat(03-03): wire Analytics into Base.astro + delegated click listener |
| Task 3 | 4486d00 | feat(03-03): add data-event + data-link-location to Nav and Footer anchors |
| Task 4 | d69400e | feat(03-03): add educator:scroll_complete IntersectionObserver to explainer |
| Task 5 | 2b6314f | chore(03-03): install mermaid dep; defer diagram:view tracking to Phase 4 |
| Task 6 | 3230de8 | fix(03-03): patch vercel.json CSP script-src with 'unsafe-inline' |
| Task 7 | — | Build verification (no file changes; dist/ is gitignored) |

## Canary Verification (Task 8 — PENDING)

Task 8 is a blocking `checkpoint:human-action`. Plan 03-04 cannot start until the user:
1. Pushes to `main` → Vercel auto-deploys
2. Visits the preview URL with DevTools open
3. Confirms `page:home_view`, `nav:link_click`, `card:open`, `educator:scroll_complete` appear in PostHog Activity feed within 5 minutes
4. Reports `canary green` with PostHog Activity-feed URL or screenshot

Canary timestamp and Activity-feed URL: **PENDING — Task 8 not yet completed.**

## Self-Check

### Created files exist
- [x] src/components/global/Analytics.astro — exists, 35 lines

### Commits exist
- [x] d55d661 — Task 1
- [x] cb7f4f1 — Task 2
- [x] 4486d00 — Task 3
- [x] d69400e — Task 4
- [x] 2b6314f — Task 5
- [x] 3230de8 — Task 6

## Self-Check: PASSED
