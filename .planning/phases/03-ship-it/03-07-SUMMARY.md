---
phase: 03-ship-it
plan: "07"
subsystem: diagrams
tags: [diagrams, mermaid, content, composition, mobile, checkpoint]

# Dependency graph
requires:
  - phase: 03-ship-it
    plan: "06"
    provides: "MermaidDiagram.astro rewritten with IO-gated lazy-load; placeholder diagram instances in index.astro"
provides:
  - "DIAGRAM-01 source string (flowchart TD, review-gate hexagons) in index.astro"
  - "DIAGRAM-02 source string (flowchart LR, 4 nodes) in index.astro"
  - "Real captions tied to CONTENT-01 reliability claim and review-gate discipline echo"
affects:
  - "03-08 (index.astro composition finalized)"
  - "04-04 (soak verification can now verify real diagram content)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline diagram source strings in index.astro (TECH-04 preserved: composition-only page)"
    - "Mermaid flowchart TD with hexagon review-gate nodes for DIAGRAM-01"
    - "Mermaid flowchart LR with 4 nodes for DIAGRAM-02"

key-files:
  created: []
  modified:
    - "src/pages/index.astro — placeholder source strings replaced with real DIAGRAM-01 + DIAGRAM-02 content"

key-decisions:
  - "DIAGRAM-01 uses flowchart TD (top-down) per RESEARCH Open Question 1 recommendation: ship flowchart first"
  - "Review gates rendered as {{...}} hexagon nodes (Gate1, Gate2), NOT edge labels — satisfies 'visible review gates' requirement"
  - "DIAGRAM-02 uses flowchart LR with 4 nodes — satisfies ≤5-node constraint with one node to spare"
  - "Source strings kept inline in index.astro per PATTERNS § index.astro section: over-engineering to extract for v1"

# Metrics
duration: ~17min
completed: 2026-05-04
---

# Phase 03 Plan 07: Mermaid Diagram Source Strings + Home Page Composition Summary

**Real DIAGRAM-01 (review-gate pipeline) and DIAGRAM-02 (ship-to-you flow) source strings authored and placed at canonical narrative positions in index.astro; build succeeds; DIAGRAM-04 mobile checkpoint reached**

## Performance

- **Duration:** ~17 min
- **Started:** ~2026-05-04T19:10:00Z
- **Completed:** 2026-05-04T19:26:57Z
- **Tasks:** 1 complete (Task 2 is checkpoint:human-verify — awaiting human verification)
- **Files modified:** 1

## Accomplishments

- Replaced placeholder Mermaid source strings in `src/pages/index.astro` with real DIAGRAM-01 and DIAGRAM-02 content
- DIAGRAM-01 (`flowchart TD`): 8 nodes including two visible review-gate hexagons (`Gate1{{Review Gate 1<br/>spec match?}}`, `Gate2{{Review Gate 2<br/>output valid?}}`); satisfies "visible review gates" requirement
- DIAGRAM-02 (`flowchart LR`): 4 nodes (Spec → Run → Review → Ship); satisfies ≤5-node constraint
- DIAGRAM-01 caption: "Each step runs against a review gate before it ships — agents that pass your existing CI before they touch production." — ties to CONTENT-01 reliability claim
- DIAGRAM-02 caption: "One spec, one runtime, the same review-gate discipline behind every product on this page." — echoes review-gate framing
- TECH-04 preserved: source strings inline (no extracted constants, no conditionals, no fetches)
- `astro check`: 0 errors; `npm run build`: Complete!
- Built `dist/index.html` carries both `data-diagram-id="pipeline-run"` and `data-diagram-id="ship-to-you"` attributes
- Mermaid chunk still emitted: `mermaid.core.Bw4c4Izl.js`

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author DIAGRAM-01 + DIAGRAM-02 source strings | `145baf4` | `src/pages/index.astro` |
| 2 | DIAGRAM-04 mobile legibility checkpoint | — | (awaiting human verification) |

## Final Diagram Source Strings

### DIAGRAM-01 (verbatim)

```
flowchart TD
  Input([Input: ticket / claim / draft]) --> Agent[Agent + Tools]
  Agent --> Gate1{{Review Gate 1<br/>spec match?}}
  Gate1 -->|fail| Agent
  Gate1 -->|pass| Step2[Sub-task]
  Step2 --> Gate2{{Review Gate 2<br/>output valid?}}
  Gate2 -->|fail| Step2
  Gate2 -->|pass| Output([Output])
```

### DIAGRAM-02 (verbatim)

```
flowchart LR
  Spec[.pipe.yaml spec] --> Run[JigSpec runtime runs the spec]
  Run --> Review[Review gates verify output]
  Review --> Ship[Product ships to you]
```

## Final Captions (verbatim)

- **DIAGRAM-01:** "Each step runs against a review gate before it ships — agents that pass your existing CI before they touch production."
- **DIAGRAM-02:** "One spec, one runtime, the same review-gate discipline behind every product on this page."

## Final Composition Order in index.astro `<main>`

```astro
<Hero />
<AgenticAIExplainer />
<MermaidDiagram diagramId="pipeline-run" source={...} caption="..." />
<ProductGrid products={products} />
<MermaidDiagram diagramId="ship-to-you" source={...} caption="..." />
<ProblemPitchSection />
```

## DIAGRAM-04 Mobile Checkpoint Result

**Status: AWAITING HUMAN VERIFICATION**

The checkpoint requires manual DevTools testing at 320 / 375 / 414 px viewports. Task 2 is a `type="checkpoint:human-verify"` gate — the executor paused here and returned the checkpoint message.

Expected verification protocol:
1. `npm run dev`
2. Open `http://localhost:4321` in Chrome/Firefox DevTools device toolbar
3. Test at 320×568, 375×667, 414×896
4. Verify both diagrams render, node labels are legible (≥14px), horizontal scroll contained to diagram slot
5. Resume signal: `approved 320/375/414`

Viewport results: **320: PENDING / 375: PENDING / 414: PENDING**

## Structural Verification

| Check | Result |
|-------|--------|
| `import MermaidDiagram` present | YES |
| `<MermaidDiagram` instance count | 2 (3 total `MermaidDiagram` occurrences inc. import) |
| `diagramId="pipeline-run"` | YES |
| `diagramId="ship-to-you"` | YES |
| `flowchart TD` (DIAGRAM-01 syntax) | YES |
| `flowchart LR` (DIAGRAM-02 syntax) | YES |
| `Review Gate 1` as hexagon node | YES (`Gate1{{Review Gate 1...}}`) |
| `Review Gate 2` as hexagon node | YES (`Gate2{{Review Gate 2...}}`) |
| `JigSpec runtime runs the spec` | YES |
| `pass your existing CI` (CONTENT-01 alignment) | YES |
| `review-gate discipline` (DIAGRAM-02 echo) | YES |
| No extracted constants (`const [A-Z]+`) | YES (none) |
| `astro check` errors | 0 |
| `npm run build` | Complete! |
| `data-diagram-id="pipeline-run"` in dist | YES |
| `data-diagram-id="ship-to-you"` in dist | YES |
| Mermaid chunk in `dist/_astro/` | YES (`mermaid.core.Bw4c4Izl.js`) |
| Composition order correct | YES (Hero < Explainer < pipeline-run < ProductGrid < ship-to-you < ProblemPitch) |

## Deviations from Plan

None — plan executed exactly as written. The placeholder source strings from Plan 03-06 were replaced with the real DIAGRAM-01 and DIAGRAM-02 content per spec. The MermaidDiagram import already existed (added by Plan 03-06 as a deviation), so no import edit was needed.

## Known Stubs

None introduced by this plan. The `analytics.ts` stub from Plan 03-06 is still pending Plan 03-02 (wave 2) replacement — not introduced by this plan.

## Threat Flags

No new external CSP hosts or new security surfaces introduced. Diagram source strings are repo-committed content strings with no executable code. `securityLevel: 'strict'` (Plan 03-06) sanitizes any accidental HTML. No threat flags beyond those documented in the plan's threat model (T-04-02-01 through T-04-02-03).

## Next Phase Readiness

**Plan 04-04 unblocked** (soak verification): Both real diagram source strings are now in index.astro. The soak gate item 2 ("Mermaid diagrams legible at 320/375/414/768/1024+ px") can now be verified against real content.

**DIAGRAM-04 checkpoint gate**: Must be human-verified before this plan is considered fully complete.

---
*Phase: 03-ship-it*
*Completed: 2026-05-04 (Task 1 complete; Task 2 checkpoint awaiting human verification)*
