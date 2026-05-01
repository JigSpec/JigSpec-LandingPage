---
phase: 02-content-static-page
plan: 04
subsystem: dynamic-route
tags: [astro, dynamic-route, content-collections, getStaticPaths, product-detail]

requires:
  - phase: 02-01
    provides: src/content.config.ts with discriminated cta union (filter on cta.type === 'interest')
  - phase: 02-02
    provides: InterestForm.astro component (Props { productId: string }) for embedding on detail pages
  - phase: 01
    provides: Base.astro layout, Nav.astro, Footer.astro
provides:
  - Single dynamic-route template generating 5 concept-stage product detail pages at /products/{slug}
  - Build-time guarantee that buggerd is excluded (Pitfall 7 closed by discriminated-union filter)
  - Phase 3 wiring hooks present: data-form="interest" + data-product-id={slug} + data-event="nav:link_click" on back link
affects: [02-05-doc-drift-and-phase-verification, all-Phase-3-wiring, all-Phase-4-polish]

tech-stack:
  added: []
  patterns:
    - "Astro 6 dynamic-route template at src/pages/products/[slug].astro with literal-bracket filename"
    - "getStaticPaths satisfies GetStaticPaths from 'astro' for compile-time return-shape check"
    - "params: { slug: product.id } — Astro 6 (.id replaces removed .slug from Astro 5)"
    - "await render(product) — Astro 6 (replaces legacy product.render() removed in 6.x)"
    - "Hand-styled markdown wrapper with Tailwind 4 [&_h2]: arbitrary-selector syntax — NO @tailwindcss/typography (deferred per Open Question 3)"

key-files:
  created:
    - "src/pages/products/[slug].astro (~53 lines)"
  modified: []

key-decisions:
  - "Hand-styled markdown wrapper using Tailwind 4 arbitrary-selector syntax `[&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-8` rather than installing @tailwindcss/typography. Phase 2 keeps the dependency surface tight (research Open Question 3 path locked); Phase 4 polish can install Typography if bodies grow unwieldy."
  - "Back-to-home link uses data-event='nav:link_click' matching the typed Phase 3 taxonomy ANALYTICS-03 will define. Bespoke event names would have required Phase 3 to special-case the back-link handler."
  - "Detail page chrome is max-w-3xl essay-narrow (matches Hero + ProblemPitchSection + AgenticAIExplainer). Wider chrome would clash visually with the bracketed-placeholder bodies (200-400 words don't need a 6xl column)."

patterns-established:
  - "Astro 6 dynamic route filename uses literal brackets: src/pages/products/[slug].astro"
  - "Discriminated-union filter at getStaticPaths is the build-time enforcement boundary for variant-shaped collections (cta.type === 'interest' here; analogous patterns will reuse this)"
  - "Phase 2 stub pattern for forms: data-form + data-product-id attributes on the form element; Phase 3 reads via single delegated listener — zero coupling between the placeholder and its eventual wiring"
  - "Markdown body styling without @tailwindcss/typography: scoped utilities on a wrapper div using Tailwind 4 [&_TAG]: arbitrary-selector syntax"

requirements-completed: [CONTENT-09]

duration: 6 min
completed: 2026-04-30
---

# Phase 02 Plan 04: Product Detail Route — Summary

**Single dynamic-route template at `src/pages/products/[slug].astro` generates exactly 5 concept-stage detail pages at build time. The discriminated-union filter `cta.type === 'interest'` excludes buggerd before `getStaticPaths` returns its path list, so `dist/products/buggerd/` is never created — Pitfall 7's 6-vs-5 off-by-one bug is closed at compile time, not runtime. Each detail page renders the product's stage badge, headline, italic sub-line, hand-styled Markdown body via `await render(product)`, an embedded `<InterestForm productId={product.id} />` placeholder, and a back-to-home link with the Phase 3 wiring hook `data-event="nav:link_click"`. Phase 1's Nav + Footer chrome wraps unchanged.**

## Performance

- **Duration:** ~6 min (plan was tight; build verified all acceptance criteria first try)
- **Started:** 2026-04-30 (after 02-03 wrap-up commit `e252fef`)
- **Completed:** 2026-04-30
- **Tasks:** 2 of 2 completed
- **Files created:** 1
- **Files modified:** 0

## Accomplishments

- **CONTENT-09 satisfied:** every concept card on the home page now navigates to a per-concept detail page rendered by a single template. Adding a 7th concept card requires creating one markdown file under `src/content/products/`; no template changes needed.
- **Pitfall 7 closed at build time:** `getStaticPaths` filters by `cta.type === 'interest'` BEFORE returning its path list. Build log shows 6 pages built (1 home + 5 detail); `dist/products/buggerd/` does not exist; `dist/products/buggerd/index.html` does not exist. Verified in Task 2.
- **Astro 6 APIs verbatim:**
  - `import { getCollection, render } from 'astro:content'` (NOT the legacy `entry.render()`)
  - `params: { slug: product.id }` (NOT `.slug`, which was removed in Astro 5)
  - `satisfies GetStaticPaths` for compile-time return-shape check
- **All 5 detail pages have correct embedded form:** `data-form="interest"` + `data-product-id="{slug}"` on each. Verified slug-by-slug in Task 2.
- **Sibling badge appears only on the delegate page:** verified that `dist/products/delegate/index.html` is the only file under `dist/products/` containing `>Sibling<`.
- **Phase 3 wiring hooks present:** `data-event="nav:link_click"` on the back-to-home link (matches the typed taxonomy ANALYTICS-03 will define in Phase 3); `data-form="interest"` + `data-product-id="{slug}"` on each InterestForm.
- **Hand-styled markdown wrapper works as designed:** Tailwind 4's `[&_h2]:font-display [&_h2]:text-2xl` arbitrary-selector syntax extracts and renders correctly. No `@tailwindcss/typography` installed (Open Question 3 path locked).
- **Phase 3 boundary clean:** zero `posthog` references in any of the 5 generated detail page HTML files. Zero "coming soon" placeholder text.

## Task Commits

1. **Task 1: dynamic-route template** — `08ac632` (feat)
2. **Task 2: build verification** — verification-only, no commit (no source changes; build green first try)

**Plan metadata:** appended on the next `docs(02-04): complete plan` commit.

## Files Created / Modified

### Created

- **`src/pages/products/[slug].astro`** (~53 lines). Single dynamic route. Imports: `getCollection` + `render` + `GetStaticPaths` + Base + Nav + Footer + InterestForm. `getStaticPaths` filters and maps over the products collection. Page body wraps stage label + h1 headline + italic sub-line + hand-styled markdown wrapper + InterestForm + back-to-home link inside a `max-w-3xl` essay-narrow chrome.

### Modified

None.

## Decisions Made

- See `key-decisions` in frontmatter. Three notable calls:
  - Hand-styled markdown wrapper rather than `@tailwindcss/typography`. Saves a dep, keeps Phase 2 surface tight, defers a styling decision to Phase 4 polish if bodies grow.
  - Back-link `data-event="nav:link_click"` matches the typed taxonomy ANALYTICS-03 will lock in Phase 3 — better than a bespoke event name that would force Phase 3 to special-case it.
  - Detail page chrome is `max-w-3xl` (essay-narrow) to match the surrounding home-page sections that aren't ProductGrid. Bracketed-placeholder bodies don't need a `max-w-6xl` column; wider chrome would feel hollow.

## Deviations from Plan

None.

The plan's task acceptance criteria all passed first try. The discriminated-union filter at `getStaticPaths` ran exactly as specified; the `params: { slug: product.id }` mapping produced the expected slug filenames; `await render(product)` returned the `Content` component; the InterestForm rendered with the correct productId on each page.

## Issues Encountered

None.

## Next Plan Readiness

**Ready for Plan 02-05 (doc-drift fix + honesty audit + phase verification).** 02-05 will:
- Fix the `src/content/config.ts` → `src/content.config.ts` doc drift in REQUIREMENTS.md TECH-02 + ROADMAP.md Phase 2 SC#4 (the only Phase 2 plan that touches docs).
- Codify the honesty audit as `npm run honesty-audit` with the regex blocklist documented in 02-RESEARCH.md.
- Run the full phase verification chain end-to-end (`astro check` + `npm run build` + dist-tree shape + honesty audit + Phase 3 boundary greps).
- Self-conduct the cold-read 60-second test from ROADMAP SC#5 (or invite a real cold-read reviewer if the user opts to wait — Plan 02-05 ends with a blocking human-verify checkpoint).

After 02-05, Phase 2 is complete: all 12 requirements (TECH-02/03/04 + CONTENT-01..09) closed; the JigSpec landing page narrative is end-to-end at the live URL; the cold-read gate decides whether the messaging is clear before Phase 3's interactivity layer.
