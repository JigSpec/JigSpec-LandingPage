---
phase: 02-content-static-page
plan: 01
subsystem: content-collections
tags: [astro, content-collections, zod, schema, products]

requires:
  - phase: 01
    provides: scaffolded Astro 6 + Tailwind 4 project, working npx astro check, dist/index.html builds
provides:
  - Typed content collection at src/content.config.ts (Astro 6 path) with discriminated cta union
  - 6 product markdown files validated by Zod at build time
  - Reserved blog collection schema (v2 readiness per ROADMAP Phase 2 SC#4)
affects: [02-02-section-and-card-components, 02-03-index-composition, 02-04-product-detail-route, 02-05-doc-drift-and-phase-verification]

tech-stack:
  added: []
  patterns:
    - "Astro 6 content collection at src/content.config.ts (NOT src/content/config.ts — legacy path removed)"
    - "z imported from 'astro/zod' (NOT 'astro:content' — deprecated/removed in Astro 6)"
    - "z.discriminatedUnion('type', [z.literal('external')|...interest...]) for variant-shaped frontmatter"
    - "glob({ pattern, base }) loader from 'astro/loaders' (the new collection loader API)"

key-files:
  created:
    - "src/content.config.ts (40 lines, products + reserved blog)"
    - "src/content/products/buggerd.md (cta=external, https://buggerd.com)"
    - "src/content/products/scientific-paper-agent.md (cta=interest, Probe)"
    - "src/content/products/triage-router-bot.md (cta=interest, Probe)"
    - "src/content/products/recorder-extractor.md (cta=interest, Probe)"
    - "src/content/products/agentic-employees.md (cta=interest, Probe — Marblism-overlap card)"
    - "src/content/products/delegate.md (cta=interest, Sibling)"
  modified: []

key-decisions:
  - "z.string().url() retained per plan (deprecation hint surfaced; z.url() is the newer canonical form). Will revisit at next dependency bump or in Plan 02-05's doc-drift task. Non-blocking — astro check exits 0."
  - "buggerd.md body is full bracketed-placeholder copy (254 words) for schema authoring symmetry, even though it's never rendered (CONTENT-09 / 02-04 filters cta.type === 'interest'). Promoting a Probe to Shipping later only requires changing two lines in frontmatter, not also writing a body."
  - "Marblism reference in agentic-employees.md framed neutrally (no endorsement, no comparison) to honor CONTENT-08 honesty constraint and the implicit Probe/Sibling overlap-resolution intent in PROJECT.md key decisions."

patterns-established:
  - "Bracketed-placeholder copy convention from Phase 1 D-03 carries forward into product bodies: every visible string is enclosed in [ ... ] until the polish copy pass replaces them; honesty-audit grep blocklist passes against bracketed text"
  - "Atomic per-task commits prefixed with feat(02-01):"

requirements-completed: [TECH-02]

duration: 12 min
completed: 2026-04-30
---

# Phase 02 Plan 01: Content Collection — Summary

**Astro 6 content collection at `src/content.config.ts` defines a `products` collection with a Zod-validated discriminated `cta` union (`external` for buggerd, `interest` for the 5 concept cards) plus a reserved `blog` collection for v2 readiness. Six product markdown files (`buggerd`, `scientific-paper-agent`, `triage-router-bot`, `recorder-extractor`, `agentic-employees`, `delegate`) ship with bracketed-placeholder bodies (254-315 words each) in the locked Sketch B voice; honesty audit clean. `astro check` 0 errors / 0 warnings / 1 deprecation hint; `npm run build` produces dist/index.html.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-30 (Phase 2 begin-phase commit)
- **Completed:** 2026-04-30
- **Tasks:** 2 of 2 completed
- **Files created:** 7 (1 config + 6 markdown)

## Accomplishments

- `src/content.config.ts` lands at the correct Astro 6 path. Legacy path `src/content/config.ts` does not exist (negative grep enforced in acceptance).
- Discriminated cta union is correct: `z.literal('external')` (buggerd only) | `z.literal('interest')` (5 concept cards). The Plan 02-04 `getStaticPaths` filter on `cta.type === 'interest'` will compile-time-guarantee 5 detail pages.
- Stage enum `['Shipping', 'Probe', 'Sibling']` matches CONTENT-04. Order field `1..6` enforces the locked narrative order from CONTENT-03.
- All 6 product files validate at build time. `npm run build` exits 0; build log contains no Zod errors and no `Invalid frontmatter` messages.
- Honesty audit clean: case-insensitive grep across the directory for `trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade` returns zero matches.
- Bracketed-placeholder copy convention from Phase 1 D-03 honored across all 6 bodies. Each body is 254-315 words (target 200-400). Voice is Sketch B / Engineering-Blog Pragmatic — describes the agent's loop, the reliability claim, and the audience without breathless-AI superlatives.
- Reserved `blog` collection schema is present so v2 ships without re-platform (ROADMAP Phase 2 SC#4). No `src/content/blog/` directory created — Astro resolves the empty glob to an empty collection at build time.

## Task Commits

1. **Task 1: src/content.config.ts** — `b956c39` (feat)
2. **Task 2: 6 product markdown files** — `6d19676` (feat)

**Plan metadata:** appended on the next `docs(02-01): complete plan` commit.

## Files Created / Modified

### Created

- `src/content.config.ts` — 40 lines. Two collections (products + blog), Zod schemas with strict typing, glob loader pointing at `./src/content/{products,blog}`. `z` imported from `'astro/zod'` per Astro 6 convention.
- `src/content/products/buggerd.md` — Shipping, order 1, cta external (`https://buggerd.com`). Body never rendered on jigspec.com (filtered out by `cta.type === 'interest'` in Plan 02-04's `getStaticPaths`); kept for schema completeness.
- `src/content/products/scientific-paper-agent.md` — Probe, order 2, cta interest. 278-word body on the research-paper-extraction loop with citation-back-to-source reliability claim.
- `src/content/products/triage-router-bot.md` — Probe, order 3, cta interest. 280-word body on the support-inbox triage loop with confidence-threshold and audit-log reliability claims.
- `src/content/products/recorder-extractor.md` — Probe, order 4, cta interest. 277-word body on the meeting-recording extraction loop with opt-in-per-meeting and on-device-transcription privacy boundaries.
- `src/content/products/agentic-employees.md` — Probe, order 5, cta interest. 298-word body on the named-AI-roles model with explicit Marblism reference (neutral framing) and explicit Delegate-overlap callout (the demand signal across cards 5+6 resolves whether they're two products or one).
- `src/content/products/delegate.md` — Sibling, order 6, cta interest. 315-word body on the operations-as-outcomes framing, contrasting it with Agentic Employees' named-roles framing.

### Modified

None.

## Decisions Made

- See `key-decisions` in frontmatter. Three calls of note:
  - Retain `z.string().url()` despite the deprecation hint in newer Zod versions. Plan-as-written specifies this form; updating to `z.url()` would be an out-of-scope change to a working schema. Tracked for a future Zod modernization pass.
  - Authored full bodies for buggerd despite the `getStaticPaths` filter excluding it. Costs ~20 lines of placeholder text; saves a future "promote a Probe to Shipping" workflow from doubling up writing.
  - Framed the Marblism reference in `agentic-employees.md` neutrally per the honesty constraint — describing the conceptual model without endorsing or comparing.

## Deviations from Plan

### Auto-handled

**1. [Rule 1 — minor] Trailing-space frontmatter delimiter not used**
- **Found during:** Task 1 + Task 2 file authoring.
- **Issue:** Plan code-fenced examples used `--- ` (with trailing space) as an SDK-parser workaround for the plan file itself. Files I created use clean `---` (no trailing space) per Phase 1 conventions.
- **Fix:** None — the plan-checker explicitly verified Astro 6 tolerates either form, and the actual files take the cleaner shape that matches Phase 1's `Base.astro` / `Nav.astro` / `Footer.astro` convention.
- **Files modified:** N/A.
- **Verification:** All `<verify>` greps in the plan target content (`grep -q "type: \"external\""`, etc.) — they pass against either delimiter form.

**2. [Rule 1 — informational] Zod deprecation hint on `z.string().url()`**
- **Found during:** `npx astro check` after Task 2.
- **Issue:** `astro check` emitted `ts(6385) — 'z.string().url()' is deprecated`, suggesting the newer `z.url()` form. This is a hint, not a warning or error; build succeeds.
- **Fix:** None — plan specifies `z.string().url()` verbatim. Tracked in this SUMMARY's key-decisions for future Zod cleanup.
- **Verification:** `npx astro check` final line: `0 errors - 0 warnings - 1 hint`.

---

**Total deviations:** 2 (1 stylistic, 1 informational).
**Impact on plan:** zero on artifacts or downstream plans.

## Issues Encountered

None.

## Next Plan Readiness

**Ready for Plan 02-02 (section + card components).** 02-02 will:
- Create `src/components/sections/` (Hero, AgenticAIExplainer, ProductGrid, ProblemPitch)
- Create `src/components/cards/ProductCard.astro` — consumes `CollectionEntry<'products'>` from this plan's schema
- Create `src/components/forms/InterestForm.astro` + `ProblemPitchForm.astro` — form-shaped placeholders, no runtime behavior
- Create `src/components/diagrams/MermaidDiagram.astro` — Phase 4 placeholder shell
- Wire the Heydon Pickering block-link pattern (`::after` pseudo-element) on ProductCard with `data-event` + `data-product-id` attributes for Phase 3 to consume

The `cta.type === 'interest'` filter that 02-04 needs is enforceable now that the discriminator literal is in place. The `getCollection('products')` API in 02-03's index composition has typed entries to consume.
