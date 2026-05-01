---
phase: 02-content-static-page
plan: 02
subsystem: components
tags: [astro, components, sections, cards, forms, accessibility, block-link, placeholder]

requires:
  - phase: 02-01
    provides: src/content.config.ts schema with discriminated cta union; CollectionEntry<'products'> typing
  - phase: 01
    provides: Tailwind 4 @theme tokens (paper/ink/muted/indigo + Crimson Pro/Inter), Base.astro slot pattern
provides:
  - 9 component files satisfying TECH-03 directory layout under src/components/{sections,cards,forms,diagrams}/
  - Heydon Pickering block-link card pattern (whole-card-clickable with ::after pseudo-element)
  - Discriminated narrowing for cta — TS guarantees rel="noopener noreferrer" only on external links
  - data-event + data-product-id declarative attributes for Phase 3 to consume (zero-coupling boundary)
  - Form-shaped placeholders: real <form> markup, disabled inputs, no action attribute (Phase 3 wires)
affects: [02-03-index-composition, 02-04-product-detail-route, 02-05-doc-drift-and-phase-verification, phase-3-posthog-wiring, phase-4-mermaid-polish]

tech-stack:
  added: []
  patterns:
    - "Heydon Pickering block-link card: heading-wrapped <a> + after:absolute after:inset-0 + parent focus-within:ring-2"
    - "Discriminated cta narrowing: TS forces rel/target only on cta.type === 'external' branch"
    - "Phase 2/3 zero-coupling boundary: data-event + data-product-id attributes on cards; Phase 3 reads via single delegated listener"
    - "Form-shaped placeholder: real <form> + disabled inputs + disabled submit + no action — closes Pitfall 8 (Enter-key submit trap)"
    - "Stage badge variants within locked palette: Shipping=filled, Probe=outlined, Sibling=muted-text-only — no new colors"

key-files:
  created:
    - "src/components/cards/StageBadge.astro (3-tier variants)"
    - "src/components/cards/ProductCard.astro (block-link, ~40 lines)"
    - "src/components/sections/Hero.astro (max-w-3xl, font-display h1)"
    - "src/components/sections/AgenticAIExplainer.astro (3-paragraph + 2-col contrast grid)"
    - "src/components/sections/ProductGrid.astro (max-w-6xl, 1/2/3-col responsive)"
    - "src/components/sections/ProblemPitchSection.astro (max-w-3xl, embeds ProblemPitchForm)"
    - "src/components/forms/InterestForm.astro (parameterized by productId, disabled placeholder)"
    - "src/components/forms/ProblemPitchForm.astro (open form, disabled placeholder)"
    - "src/components/diagrams/MermaidDiagram.astro (Phase 4 placeholder shell)"
  modified: []

key-decisions:
  - "<li class=\"contents\"> in ProductGrid keeps the <ul> semantic intact while letting cards participate in the parent grid layout. Astro emitted no warning; Tailwind 4 supports this. If future polish surfaces issues, swap to direct grid item with role attributes."
  - "MermaidDiagram.astro shipped but NOT rendered on any Phase 2 page. Exists in TECH-03's directory enumeration so Phase 4's astro-mermaid swap is a single-file change. Plan 02-03 honors the planner's discretion to omit it from index composition."
  - "InterestForm renders ONLY on /products/[slug] (Plan 02-04), never on home page index — DEMAND-01 explicit boundary. Plan 02-03's index.astro acceptance enforces the boundary via negative grep."
  - "Stage badge Sibling tier uses muted-text-only (no fill, no border) — accepted Medium-severity threat T-02-13 risk that reviewers may miss it. Plan 02-05 self-cold-read backstops; if signal is weak, swap to a third visual variant in Phase 4 polish."

patterns-established:
  - "Component imports use relative paths within src/components/ (./StageBadge.astro from cards; ../cards/ProductCard.astro from sections; ../forms/ProblemPitchForm.astro from sections)"
  - "Atomic per-task commits feat(02-02): one for cards, one for sections+diagrams, one for forms — ~50–115 lines each"
  - "Form data-attributes for Phase 3: data-form (interest|problem-pitch) + data-product-id on InterestForm only"

requirements-completed: [TECH-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-08]

duration: 18 min
completed: 2026-04-30
---

# Phase 02 Plan 02: Sections + Card Components — Summary

**Nine component files shipped under the locked TECH-03 directory layout. ProductCard implements the Heydon Pickering block-link pattern verbatim (heading-wrapped `<a>` with `::after` stretched across the parent `<article>`, parent `focus-within:ring-2` for visible focus). Form-shaped placeholders (InterestForm + ProblemPitchForm) ship with real `<form>` markup, all inputs disabled, no `action` attribute — Phase 3 wires real behavior. Stage badges render 3 visual tiers within Phase 1's locked 4-color palette. `npx astro check`: 16 files, 0 errors, 0 warnings, 1 hint (existing `z.string().url()` deprecation from 02-01).**

## Performance

- **Duration:** ~18 min (3 tasks across 9 files; one false-positive grep escaping bug surfaced + recovered in <1 min)
- **Started:** 2026-04-30 (after 02-01 wrap-up commit `379db29`)
- **Completed:** 2026-04-30
- **Tasks:** 3 of 3 completed
- **Files created:** 9

## Accomplishments

- **TECH-03 directory layout satisfied:** 4 files in `sections/`, 2 in `cards/`, 2 in `forms/`, 1 in `diagrams/` — exact structural match.
- **ProductCard block-link pattern verbatim:** heading-wrapped anchor with `after:absolute after:inset-0` pseudo-element stretching across the card surface; parent article uses `focus-within:ring-2 focus-within:ring-accent/30` for visible focus indicator; `focus:outline-none` on the anchor prevents double-rings.
- **Discriminated cta narrowing in TypeScript:** `target="_blank"` and `rel="noopener noreferrer"` only emitted on `cta.type === 'external'` branch (the buggerd card). The discriminated-union schema from 02-01 makes this a compile-time guarantee — TS won't compile if the rel is omitted on the external branch.
- **Phase 2/3 zero-coupling boundary:** every product card carries `data-event` (`'card:cta_external_click'` for buggerd, `'card:open'` for the 5 interest cards) and `data-product-id={product.id}`. Phase 3 wires a single delegated listener that reads these attributes — no inline JS, no per-card click handlers.
- **Stage badges within the locked palette:** Shipping → filled `bg-accent text-bg`; Probe → outlined `border-accent/40 text-accent`; Sibling → muted-text-only `text-muted`. No new colors. Three weights of visual emphasis emerge from fg/bg inversion + opacity stops + border style.
- **Form-shaped placeholders are real `<form>` markup:** InterestForm (parameterized by `productId`) + ProblemPitchForm (open) ship with proper `<label for>` ↔ `<input id>` associations, ARIA `aria-labelledby`, all inputs disabled, submit button disabled, NO `action` attribute, NO `method` attribute. Submit button text reads "Wired in Phase 3" so cold-readers don't think the form is broken. Pitfall 8 (Enter-key submission past a disabled-only-button) closed via input-level `disabled`.
- **MermaidDiagram placeholder shell:** dashed-border `<figure>` + `<figcaption>`, accepts `{code, caption}` props for forward-compat. NOT rendered on any Phase 2 page.
- **All Tailwind utilities are named** (`font-display`, `text-fg`, `bg-bg`, `text-muted`, `text-accent`, `border-muted`, `border-accent`, `bg-accent`). Zero arbitrary `font-[var(...)]` forms — honors the Phase 1 lesson where the arbitrary form misroutes to font-weight in Tailwind 4.
- **Honesty audit clean across `src/components/`:** zero matches for `trusted by | fortune 500 | industry-leading | world-class | best-in-class | cutting-edge | revolutionary | game-changing | unparalleled | enterprise-grade`.

## Task Commits

1. **Task 1: StageBadge + ProductCard (block-link)** — `4f8efcb` (feat)
2. **Task 2: 4 sections + MermaidDiagram placeholder** — `be44227` (feat)
3. **Task 3: InterestForm + ProblemPitchForm** — `29aef7c` (feat)

**Plan metadata:** appended on the next `docs(02-02): complete plan` commit.

## Files Created / Modified

### Created — `src/components/cards/`

- **`StageBadge.astro`** (12 lines, props: `{ stage: 'Shipping'|'Probe'|'Sibling' }`). Variant lookup table inline; `aria-label="Stage: ${stage}"` for screen readers.
- **`ProductCard.astro`** (~40 lines, props: `{ product: CollectionEntry<'products'> }`). Block-link pattern; imports StageBadge; emits Phase-3 `data-event` + `data-product-id`. Uses `new URL(cta.url).hostname` to derive the visit-link copy from the external URL.

### Created — `src/components/sections/`

- **`Hero.astro`** (~15 lines, no props). `max-w-3xl` essay-narrow chrome; `font-display` h1; bracketed-placeholder copy for headline + sub-line.
- **`AgenticAIExplainer.astro`** (~30 lines, no props). `id="agentic-ai"`; `max-w-3xl` chrome; 3 paragraphs in `space-y-5`; 2-column compare grid as the contrast element required by CONTENT-02.
- **`ProductGrid.astro`** (~25 lines, props: `{ products: CollectionEntry<'products'>[] }`). `id="products"` (Phase 1 Nav's `#products` lands here); `max-w-6xl` wide chrome (intentional break from the surrounding essay-narrow sections, Pitfall 5); `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` responsive progression; `<ul>` with `<li class="contents">` so cards participate in the parent grid layout while keeping list semantics.
- **`ProblemPitchSection.astro`** (~17 lines, no props). `id="problem-pitch"`; `max-w-3xl` essay chrome; framing copy + embedded ProblemPitchForm.

### Created — `src/components/forms/`

- **`InterestForm.astro`** (~58 lines, props: `{ productId: string }`). Real `<form data-form="interest" data-product-id={productId}>`; dynamic ID prefix `interest-${productId}-{email,context}` to avoid collisions when multiple instances render; `aria-labelledby` for screen readers. Email input + textarea, both `required` (Phase 3 will respect this) AND `disabled` (Phase 2 inert). Submit button disabled, text "Wired in Phase 3".
- **`ProblemPitchForm.astro`** (~52 lines, no props). Real `<form data-form="problem-pitch">`; static IDs (`problem-pitch-{email,problem}`) — only one instance ever renders. Email optional, problem textarea required. Same disabled + no-action pattern.

### Created — `src/components/diagrams/`

- **`MermaidDiagram.astro`** (~17 lines, props: `{ code?: string; caption?: string }`). Dashed-border `<figure>` placeholder; accepts `code` prop for forward-compat with Phase 4's astro-mermaid wiring. Default caption when none provided.

### Modified

None.

## Decisions Made

- See `key-decisions` in frontmatter. Three notable calls:
  - `<li class="contents">` rather than swapping to a CSS Grid item with role attributes. The `contents` value is well-supported in modern browsers and keeps the `<ul>` semantic for screen reader navigation.
  - MermaidDiagram component shipped to satisfy TECH-03's enumeration but NOT rendered on any Phase 2 page. Phase 4 swaps the implementation; a future task can choose to render a single instance on the home page if Phase 4's polish gate wants it.
  - Sibling stage badge uses muted-text-only treatment (no fill, no border). Accepted as Medium-severity T-02-13 — relies on Plan 02-05 self-cold-read + Phase 4 external cold-read to validate that reviewers can distinguish the three tiers. Cheap to swap a fourth visual treatment if the signal is weak.

## Deviations from Plan

### Auto-handled

**1. [Rule 1 — minor] Trailing-space frontmatter delimiter not used (continued from 02-01)**
- **Found during:** All 3 tasks.
- **Issue:** Plan code-fenced examples used `--- ` (trailing space) for SDK-parser reasons. Files I created use clean `---`.
- **Fix:** None — plan-checker confirmed Astro 6 tolerates either.
- **Verification:** All `<verify>` greps in the plan target content (e.g., `grep -q "after:absolute after:inset-0"`, `grep -q "data-form=\"interest\""`); they all pass.

**2. [Rule 1 — informational] Same `z.string().url()` deprecation hint persists**
- **Found during:** Task 1 + Task 3 `astro check`.
- **Issue:** The hint surfaced in 02-01 still appears (the schema source hasn't changed). Build still green.
- **Fix:** None — tracked in 02-01 SUMMARY for a future Zod modernization pass.

---

**Total deviations:** 2 (1 stylistic continuation from 02-01; 1 informational hint).
**Impact on plan:** zero on artifacts.

## Issues Encountered

A grep-escape false positive surfaced during Task 1 + Task 3 verification — backslash-backtick handling inside single-quoted shell strings. Verified content correctness via `grep -F` (literal/fixed-string mode) instead. Cost ~1 minute; no rework needed.

## Next Plan Readiness

**Ready for Plan 02-03 (composition-only `index.astro`).** 02-03 will:
- Rewrite `src/pages/index.astro` to compose `<Base>` + `<Nav />` + `<Hero />` + `<AgenticAIExplainer />` + `<ProductGrid products={...} />` + `<ProblemPitchSection />` + `<Footer />` in narrative order.
- Call `getCollection('products')` once in the index frontmatter, sort by `data.order`, pass the array to `<ProductGrid>`.
- Acceptance gates enforce composition-only: zero inline product data, zero PostHog imports, zero Mermaid imports, zero `<section>` tags directly in index, single `<h1>` only allowed (the Hero's).

**Ready for Plan 02-04 (dynamic `/products/[slug]` route) in parallel with 02-03.** Wave 3 has both plans modifying disjoint files. 02-04 will:
- Create `src/pages/products/[slug].astro` with `getStaticPaths` filtering `cta.type === 'interest'` (5 detail pages, NOT 6).
- Render each entry's body via `await render(entry)` and `<Content />`.
- Embed `<InterestForm productId={entry.id} />` below the rendered body.
- Reuse Base + Nav + Footer for layout consistency.
- Build acceptance: `dist/products/{scientific-paper-agent,triage-router-bot,recorder-extractor,agentic-employees,delegate}/index.html` exist; `dist/products/buggerd/` does NOT exist.
