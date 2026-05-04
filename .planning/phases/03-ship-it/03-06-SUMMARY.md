---
phase: 03-ship-it
plan: "06"
subsystem: diagrams
tags: [mermaid, lazy-load, intersection-observer, dynamic-import, vite-chunking, sitemap, analytics-stub]

# Dependency graph
requires:
  - phase: 02-content-static-page
    provides: "MermaidDiagram.astro Phase 2 placeholder, index.astro composition shell"
provides:
  - "mermaid@^11.4.1 installed as devDependency — Vite code-splits into separate chunk"
  - "@astrojs/sitemap@^3.7.2 installed as devDependency — Plan 03-08 wires into astro.config.mjs"
  - "MermaidDiagram.astro rewritten: IO-gated dynamic import with securityLevel strict (DIAGRAM-03)"
  - "src/lib/analytics.ts stub — Plan 03-02 (wave 2) replaces with full typed wrapper"
  - "index.astro: placeholder MermaidDiagram instances added so Vite emits the chunk"
affects:
  - "03-07 (can now compose <MermaidDiagram diagramId=... source=... caption=...> instances)"
  - "03-08 (can now import sitemap from '@astrojs/sitemap' in astro.config.mjs)"
  - "03-02 (analytics.ts stub exists; wave 2 replaces it with full typed wrapper)"
  - "03-03 (Phase 3 diagram:view observer block preserved verbatim in MermaidDiagram.astro)"

# Tech tracking
tech-stack:
  added:
    - "mermaid@11.14.0 (range ^11.4.1) — installed as devDependency, bundled via dynamic import"
    - "@astrojs/sitemap@3.7.2 — installed as devDependency"
  patterns:
    - "IO-gated dynamic import: single mermaidPromise cache shared across all slots on the page"
    - "Render-then-inject pattern: mermaid.render(id, source) → slot.innerHTML = svg"
    - "Two-observer structure: Phase 4 script (lazy-load) + Phase 3 script (diagram:view) in same file"
    - "Props interface tightening: from optional {code?, caption?} to required {diagramId, source, caption}"

key-files:
  created:
    - "src/lib/analytics.ts (stub — Plan 03-02 replaces)"
  modified:
    - "package.json (mermaid + @astrojs/sitemap devDependencies added)"
    - "package-lock.json (471 packages resolved)"
    - "src/components/diagrams/MermaidDiagram.astro (rewritten — 16 lines Phase 2 → 116 lines Phase 4)"
    - "src/pages/index.astro (placeholder MermaidDiagram instances added to force chunk emission)"

key-decisions:
  - "analytics.ts stub created as deviation (Rule 3 - blocking): Phase 3's diagram:view observer block imports track(), which requires the module to exist for astro check to pass; Plan 03-02 (wave 2) will replace the stub with the full typed wrapper"
  - "Placeholder MermaidDiagram usage added to index.astro (deviation Rule 2): without component usage, Vite won't emit the mermaid chunk, failing DIAGRAM-03 acceptance criterion; Plan 03-07 (wave 2) will replace placeholder source strings with real diagram content"
  - "Phase 3 observer block included in this file (not waiting for Plan 03-03 wave 3): both blocks required by must_haves verification (exactly 1 track call, exactly 2 script blocks, exactly 2 IO observers)"
  - "astro.config.mjs intentionally NOT modified — Plan 03-08 wires @astrojs/sitemap integration"
  - "mermaid installed as devDependency (not dependency): consumed via dynamic import inside Vite bundle, never top-level imported in frontmatter"

patterns-established:
  - "Pattern: MermaidDiagram lazy-load island — IO at rootMargin '200px 0px', single shared mermaidPromise, securityLevel strict"
  - "Pattern: Two-script structure for diagram analytics ownership — Phase 4 script owns render, Phase 3 script owns diagram:view event"
  - "Pattern: Stub-then-replace for cross-wave dependencies — create minimal type-satisfying stub; replace in the wave that owns the full implementation"

requirements-completed: [DIAGRAM-03]

# Metrics
duration: 4min
completed: 2026-05-04
---

# Phase 03 Plan 06: Mermaid Install + Lazy-Load Island Summary

**mermaid@11.14.0 installed; MermaidDiagram.astro rewritten with IntersectionObserver + dynamic import('mermaid') so the 601KB runtime loads only on viewport entry (DIAGRAM-03)**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-04T14:04:17Z
- **Completed:** 2026-05-04T14:07:55Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Installed `mermaid@^11.4.1` (resolved: 11.14.0) and `@astrojs/sitemap@^3.7.2` as devDependencies
- Rewrote `MermaidDiagram.astro` from 16-line Phase 2 placeholder to 116-line Phase 4 lazy-load island
- Vite emits `mermaid.core.Bw4c4Izl.js` (601KB raw / ~145KB gzipped) only when component is used — visitors who never scroll never download it
- Phase 3's `diagram:view` observer preserved verbatim at file bottom (exactly 1 `track('diagram:view'` call)
- `astro check` passes with 0 errors; `npm run build` completes successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Install mermaid + @astrojs/sitemap as dev dependencies** - `c7e9c03` (chore)
2. **Task 2: Rewrite MermaidDiagram.astro with IO-gated lazy-load** - `31f9088` (feat)

**Plan metadata:** [committed with SUMMARY in final docs commit]

## Resolved Versions

| Package | Requested | Resolved |
|---------|-----------|----------|
| `mermaid` | `^11.4.1` | `11.14.0` |
| `@astrojs/sitemap` | `^3.7.2` | `3.7.2` |

## File Statistics

| File | Before | After |
|------|--------|-------|
| `src/components/diagrams/MermaidDiagram.astro` | 16 lines (Phase 2 placeholder) | 116 lines (Phase 4 island) |
| `src/lib/analytics.ts` | (did not exist) | 39 lines (stub) |
| `src/pages/index.astro` | 28 lines | 39 lines (placeholder diagrams added) |

## Mermaid Chunk

- **Filename:** `dist/_astro/mermaid.core.Bw4c4Izl.js`
- **Size:** 601 KB raw / ~145 KB gzipped
- **Emission verified:** `ls dist/_astro/ | grep -iE 'mermaid'` returns 1 match

## Phase 3 Observer Invariant Proof

```
$ grep -c "track('diagram:view'" src/components/diagrams/MermaidDiagram.astro
1
```

Exactly one `track('diagram:view'` call — the Phase 3 line, unchanged. Phase 4 does NOT add a second call.

## Structural Verification

| Check | Result |
|-------|--------|
| `track('diagram:view')` count | 1 (Phase 3 line) |
| `import('mermaid')` count | 1 (dynamic import in getMermaid()) |
| `new IntersectionObserver` count | 2 (Phase 4 + Phase 3) |
| `<script>` tag count | 2 (Phase 4 + Phase 3) |
| Static `import ... from 'mermaid'` | 0 (forbidden — would break DIAGRAM-03) |
| `astro-mermaid` in package.json | 0 (explicitly banned) |
| `securityLevel: 'loose'` | 0 (forbidden — XSS risk) |
| `astro check` errors | 0 |
| Mermaid chunk in `dist/_astro/` | YES |
| `astro.config.mjs` modified | NO (Plan 03-08 owns this) |
| `vercel.json` modified | NO (CSP unchanged, Mermaid is same-origin) |

## Files Created/Modified

- `package.json` — added mermaid@^11.4.1 and @astrojs/sitemap@^3.7.2 to devDependencies
- `package-lock.json` — 471 packages resolved (464 new for mermaid, 7 new for sitemap)
- `src/components/diagrams/MermaidDiagram.astro` — rewrote from Phase 2 placeholder to Phase 4 lazy-load island; Props tightened to required {diagramId, source, caption}
- `src/lib/analytics.ts` — created minimal stub (11-event EventName union + track/identify functions) so Phase 3 observer block passes type check; Plan 03-02 will replace
- `src/pages/index.astro` — added MermaidDiagram import and two placeholder instances so Vite emits the mermaid chunk; Plan 03-07 will replace placeholder source strings with real diagram content

## Decisions Made

1. **analytics.ts stub (Rule 3 - Blocking):** Phase 3's `diagram:view` observer imports `track` from `../../lib/analytics`. Without that module, `astro check` fails with "Cannot find module". Created a minimal 39-line stub that defines the required `EventName` union and `track` function. Plan 03-02 (wave 2) will replace this stub with the full typed wrapper including `identify`, `captureSurveyResponse`, etc.

2. **Placeholder diagram usage in index.astro (Rule 2 - Missing Critical):** Without any `<MermaidDiagram>` instances in any page, Vite's tree-shaker eliminates the dynamic import and no mermaid chunk is emitted. Added two placeholder instances with minimal valid Mermaid source to force chunk emission (satisfying DIAGRAM-03's `ls dist/_astro/ | grep -iE 'mermaid'` verification). Plan 03-07 will replace placeholder source strings with real DIAGRAM-01 and DIAGRAM-02 content.

3. **Both script blocks included now:** The plan's must_haves verification requires exactly 2 `<script>` blocks and exactly 1 `track('diagram:view'` call. Since Phase 3 plan 03-03 (wave 3) is the one that normally adds the Phase 3 observer block, but this plan is wave 1 and must pass verification, both blocks were included in the initial write. Plan 03-03 should detect the observer block is already present and skip adding it.

4. **astro.config.mjs left untouched:** Plan 03-08 owns the sitemap integration wire-up. Installed @astrojs/sitemap via plain `npm install` (not `npx astro add sitemap`) to avoid premature config modification.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created analytics.ts stub to satisfy astro check**
- **Found during:** Task 2 (MermaidDiagram.astro rewrite)
- **Issue:** Phase 3's observer block (preserved verbatim per must_haves) imports `{ track } from '../../lib/analytics'`, but that file doesn't exist in this worktree yet (Plan 03-02 wave 2 creates it). `astro check` reported: "Cannot find module '../../lib/analytics'" — 1 error.
- **Fix:** Created `src/lib/analytics.ts` with a minimal stub defining the 11-event `EventName` union and `track`/`identify` functions, satisfying the type check without replacing Plan 03-02's full implementation.
- **Files modified:** `src/lib/analytics.ts` (created)
- **Verification:** `npx astro check` reports 0 errors after stub creation
- **Committed in:** `31f9088` (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added placeholder MermaidDiagram usage to force Vite chunk emission**
- **Found during:** Task 2 verification (after build, `ls dist/_astro/ | grep -iE 'mermaid'` returned empty)
- **Issue:** Without any `<MermaidDiagram>` instances on any page, Vite tree-shakes the dynamic import and the mermaid chunk is never emitted — DIAGRAM-03's post-build verification fails.
- **Fix:** Added `import MermaidDiagram from '../components/diagrams/MermaidDiagram.astro'` and two placeholder instances (with minimal valid Mermaid source strings) to `src/pages/index.astro`.
- **Files modified:** `src/pages/index.astro`
- **Verification:** After rebuild, `ls dist/_astro/ | grep -iE 'mermaid'` returns `mermaid.core.Bw4c4Izl.js`
- **Committed in:** `31f9088` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both auto-fixes were necessary for correctness. The stub will be overwritten by Plan 03-02; the placeholder usage will be replaced by Plan 03-07. No scope creep.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None — no external service configuration required for this plan.

## Next Phase Readiness

**Plan 03-07 unblocked:** Can now `import MermaidDiagram from '../components/diagrams/MermaidDiagram.astro'` (already done) and update the placeholder source strings with real DIAGRAM-01 and DIAGRAM-02 Mermaid source. Props interface: `{ diagramId: 'pipeline-run' | 'ship-to-you'; source: string; caption: string }`.

**Plan 03-08 unblocked:** Can now `import sitemap from '@astrojs/sitemap'` and add `sitemap()` to `integrations: []` in `astro.config.mjs`.

**Plan 03-02 aware:** `src/lib/analytics.ts` stub exists; Plan 03-02 should overwrite it with the full typed wrapper. The stub's `EventName` union and `track` function signature are compatible with what Plan 03-02 will define (same 11 events, same function signature shape).

**Plan 03-03 aware:** Phase 3's `diagram:view` observer block is already present at the bottom of `MermaidDiagram.astro` (lines 97-115). Plan 03-03 task 5 should detect this and skip re-adding the identical block.

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| `analytics.ts` minimal implementation | `src/lib/analytics.ts` | 1-39 | Plan 03-02 (wave 2) replaces with full typed wrapper + EventProps discriminated union + 4 exported functions |
| Placeholder Mermaid source | `src/pages/index.astro` | 25-37 | Plan 03-07 (wave 2) replaces with real DIAGRAM-01 and DIAGRAM-02 source strings |

## Threat Flags

No new external CSP hosts. Mermaid is bundled same-origin. No threat flags raised beyond those documented in the plan's threat model (T-04-01-01 through T-04-01-06).

---
*Phase: 03-ship-it*
*Completed: 2026-05-04*
