---
phase: 02-content-static-page
plan: 03
subsystem: composition
tags: [astro, composition, index-page, narrative-order]

requires:
  - phase: 02-01
    provides: src/content.config.ts with getCollection('products') return type
  - phase: 02-02
    provides: 4 section components, ProductCard, form placeholders, Mermaid placeholder
  - phase: 01
    provides: Base.astro layout, Nav.astro, Footer.astro
provides:
  - Composition-only home page rendering all Phase 2 narrative sections in order
  - Single getCollection('products') data hook sorted by frontmatter order — no inline data, no per-card hardcoding
affects: [02-04-product-detail-route, 02-05-doc-drift-and-phase-verification, all-Phase-3-wiring, all-Phase-4-polish]

tech-stack:
  added: []
  patterns:
    - "Composition-only index.astro — 8 imports, 1 sort-by-order line, JSX-only body. No business logic, no inline data."
    - "Narrative order encoded structurally: Hero → AgenticAIExplainer → ProductGrid → ProblemPitchSection in <main>."
    - "Phase 3 boundary discipline: no posthog references anywhere in rendered HTML — bracketed placeholder copy uses 'analytics capture' / 'survey wiring' instead of the SDK name."

key-files:
  created: []
  modified:
    - "src/pages/index.astro (rewrote ~26 lines, replacing the Phase 1 'coming soon' placeholder)"
    - "src/components/forms/InterestForm.astro (placeholder copy rewrite — replace 'PostHog' with 'survey wiring' to keep Phase 3 boundary grep clean)"
    - "src/components/forms/ProblemPitchForm.astro (same — replaced 'posthog.capture' with 'capture wiring')"

key-decisions:
  - "Removed literal 'posthog' from InterestForm + ProblemPitchForm placeholder copy. The plan's acceptance criterion `! grep -qi 'posthog' dist/index.html` enforces Phase 3 boundary; placeholder strings mentioning the SDK by name would have failed the gate. Functional behavior unchanged — Phase 3 still wires posthog when it lands."

patterns-established:
  - "Phase 2 placeholders refer to Phase 3 wiring abstractly (analytics capture / survey wiring) — never by SDK name. Keeps the Phase 2 boundary grep simple and avoids leaking 'we're using PostHog' to anyone reading rendered source before launch."
  - "Composition-only verification: build the site + grep dist/index.html for product names + badge counts + section anchors — no manual visual review required for plan completion."

requirements-completed: [TECH-04, CONTENT-07]

duration: 8 min
completed: 2026-04-30
---

# Phase 02 Plan 03: Index Composition — Summary

**`src/pages/index.astro` rewritten as a 26-line composition-only file. Imports the 4 Phase 2 sections, the Phase 1 chrome (Nav + Footer + Base), and `getCollection('products')`; sorts products by frontmatter `order` field; passes the sorted array to ProductGrid; renders sections in fixed narrative order (Hero → AgenticAIExplainer → ProductGrid → ProblemPitchSection). Build is green; rendered `dist/index.html` contains all 6 product names in correct narrative order, all 6 stage badges (1 Shipping + 4 Probe + 1 Sibling), all 3 section anchors (`#agentic-ai`, `#products`, `#problem-pitch`), the buggerd external link with `target="_blank" rel="noopener noreferrer"`, all 5 concept-card `/products/[slug]` hrefs, the Phase 3 wiring hooks (5 `card:open` + 1 `card:cta_external_click` + 1 `data-form="problem-pitch"`), the footer items (`hi@jigspec.com` + `github.com/JigSpec`), and zero posthog references.**

## Performance

- **Duration:** ~8 min (1 task to write, 1 task to verify, 1 mini-fixup for the posthog boundary grep, ~3 minutes for SUMMARY)
- **Started:** 2026-04-30 (after 02-02 wrap-up commit `b6792a8`)
- **Completed:** 2026-04-30
- **Tasks:** 2 of 2 completed
- **Files created:** 0
- **Files modified:** 3 (index.astro, InterestForm.astro, ProblemPitchForm.astro)

## Accomplishments

- **TECH-04 satisfied:** index.astro is composition-only — 8 imports, 1 data-marshaling line (`(await getCollection('products')).sort(...)`), and a JSX-only body. No `<script>`, no `<style>`, no `action=`, no `posthog`, no inline component definitions.
- **Narrative order encoded structurally:** Hero (line 22) → AgenticAIExplainer (23) → ProductGrid (24) → ProblemPitchSection (25). Verified by byte-offset comparison in rendered HTML — all 6 product names appear at strictly ascending offsets in their narrative order.
- **CONTENT-01..06 satisfied via composition:** every Phase 2 narrative element renders on the home page because the corresponding section component renders. Hero (CONTENT-01), AgenticAIExplainer with 2-col contrast grid (CONTENT-02), ProductGrid with 6 cards in narrative order (CONTENT-03), stage badges 1/4/1 (CONTENT-04), block-link cards with external/interest CTAs (CONTENT-05), ProblemPitchSection with form-shaped placeholder (CONTENT-06).
- **CONTENT-07 satisfied via Phase 1 carryover:** Footer renders unchanged with all 4 required items (docs link, contact email, copyright with auto-year, GitHub org).
- **Phase 3 boundary clean:** zero posthog references in rendered `dist/index.html`. Required removing the literal SDK name from placeholder copy in both forms — see Deviation 1 below.
- **Block-link CTA wiring verified at the rendered level:**
  - Buggerd anchor: `href="https://buggerd.com" target="_blank" rel="noopener noreferrer" data-event="card:cta_external_click" data-product-id="buggerd"`
  - 5 concept anchors: `href="/products/{slug}"` for `scientific-paper-agent`, `triage-router-bot`, `recorder-extractor`, `agentic-employees`, `delegate`
  - data-event counts: exactly 5 `card:open` + 1 `card:cta_external_click` (Phase 3 wires both via single delegated listener)
- **DEMAND-01 boundary clean:** `data-form="interest"` does NOT appear on the home page (per-card forms are on /products/[slug] detail pages, which Plan 02-04 builds). `data-form="problem-pitch"` appears once.

## Task Commits

1. **Task 1 + 2: rewrite index.astro + verify build + posthog-boundary copy edit** — `017fd77` (feat)

The plan envisioned two separate task commits but the verification step required a small fix to the placeholder copy in two form components — bundling all three changes into one commit kept the audit trail tight (the form-copy edit is causally coupled to the index.astro composition's grep gate).

**Plan metadata:** appended on the next `docs(02-03): complete plan` commit.

## Files Created / Modified

### Modified

- **`src/pages/index.astro`** (26 lines, was 22 lines). Replaced the Phase 1 "coming soon" placeholder. New structure: 8 imports + 1 sort line + Base wrapping Nav + main(Hero, AgenticAIExplainer, ProductGrid, ProblemPitchSection) + Footer.
- **`src/components/forms/InterestForm.astro`** (~58 lines, unchanged structurally). Placeholder copy edits: `[Placeholder copy — replace in Phase 3 when PostHog Surveys wires up.]` → `[Placeholder copy — replace in Phase 3 when the survey wiring lands.]`. Frontmatter comment updated to drop SDK names.
- **`src/components/forms/ProblemPitchForm.astro`** (~52 lines, unchanged structurally). Same pattern: placeholder copy and frontmatter comment rewritten to use "analytics capture" / "capture wiring" instead of "posthog.capture" / "PostHog".

## Decisions Made

- **Bundle the form-copy edit into the same commit as the index composition.** The plan specified two separate task commits, but the form-copy fix is causally tied to Task 2's `! grep -qi 'posthog' dist/index.html` gate. Splitting into a third commit would have produced a two-commit pair where the first fails verification and the second fixes it — noisier audit trail. One commit captures both intent and outcome.
- **Did NOT render MermaidDiagram on the home page.** Plan 02-02 ships the component as a placeholder shell; Plan 02-03 has discretion to render it or omit it. Omitting keeps Phase 2's "structure + placeholder copy, no diagrams yet" boundary clean. Phase 4's astro-mermaid plan can add a diagram instance to AgenticAIExplainer or as a standalone section when it ships.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — boundary tightening] Placeholder copy in form components mentioned the literal SDK name "PostHog" / "posthog.capture"**
- **Found during:** Task 2's `! grep -qi 'posthog' dist/index.html` gate.
- **Issue:** ProblemPitchForm.astro's placeholder copy text contained the string `replace in Phase 3 when posthog.capture wiring lands`. InterestForm.astro had `replace in Phase 3 when PostHog Surveys wires up`. Both rendered into `dist/index.html` and tripped the Phase 3 boundary grep.
- **Fix:** Rewrote the bracketed-placeholder copy in both components to use generic terminology ("analytics capture wiring", "survey wiring") rather than the SDK name. Functional behavior unchanged — Phase 3 still wires posthog regardless of what the placeholder copy says.
- **Files modified:** `src/components/forms/InterestForm.astro`, `src/components/forms/ProblemPitchForm.astro`.
- **Verification:** Re-ran build + `! grep -qi 'posthog' dist/index.html` → passes. Plan 02-02 acceptance still passes (the form `data-form` attributes, disabled inputs, and `Wired in Phase 3` button text are all unchanged).
- **Committed in:** `017fd77` (bundled with Task 1).

---

**Total deviations:** 1 (boundary tightening — affected 2 sibling components from Plan 02-02 but not their structural behavior).
**Impact on plan:** zero on Plan 02-02 acceptance (still passes). Tightens Phase 2/3 boundary discipline for the rest of the project.

## Issues Encountered

None blocking. The placeholder-copy fix surfaced as part of normal verification and was resolved in <2 minutes.

## Next Plan Readiness

**Ready for Plan 02-04 (dynamic `/products/[slug]` route).** 02-04 will:
- Create `src/pages/products/[slug].astro` with `getStaticPaths` filtering `cta.type === 'interest'` (5 detail pages, NOT 6 — buggerd correctly excluded).
- Render each entry's body via `await render(entry)` and `<Content />`.
- Embed `<InterestForm productId={entry.id} />` below the rendered body — InterestForm is parameterized, so all 5 detail pages instantiate with their respective slug.
- Reuse Base + Nav + Footer for layout consistency.
- Build acceptance: `dist/products/{scientific-paper-agent,triage-router-bot,recorder-extractor,agentic-employees,delegate}/index.html` exist; `dist/products/buggerd/` does NOT exist.

After 02-04, Plan 02-05 closes the phase: doc-drift fix, codified honesty audit, full phase verification chain, and the cold-read 60s human checkpoint.
