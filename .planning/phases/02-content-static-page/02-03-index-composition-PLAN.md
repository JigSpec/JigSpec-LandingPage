---
id: 02-03
phase: 02-content-static-page
plan: 03
type: execute
wave: 3
depends_on: [02-01, 02-02]
files_modified:
  - src/pages/index.astro
autonomous: true
requirements: [TECH-04, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07]
tags: [astro, composition, index-page, narrative-order]
must_haves:
  truths:
    - "src/pages/index.astro replaces the Phase 1 'coming soon' placeholder"
    - "index.astro is composition-only — Base + Nav + 4 sections + Footer in narrative order, with `getCollection('products')` as the only data hook"
    - "Sections render in fixed narrative order: Hero → AgenticAIExplainer → ProductGrid → ProblemPitchSection"
    - "ProductGrid receives a `products` array sorted by frontmatter `order` ascending — buggerd first (order=1), delegate last (order=6)"
    - "Footer (existing Phase 1) renders unchanged at the end (CONTENT-07)"
    - "`npm run build` produces `dist/index.html` containing all 6 product names + all 6 stage badges + the 'Tell us a problem' section heading"
    - "The home page contains zero `<form action=...>` (Phase 2 forms are placeholders) and zero `posthog` references (Phase 3 wires PostHog)"
  artifacts:
    - path: src/pages/index.astro
      provides: "Composition-only home page in narrative order"
      contains: "ProductGrid products"
  key_links:
    - from: "src/pages/index.astro"
      to: "src/content.config.ts (via getCollection('products'))"
      via: "import { getCollection } from 'astro:content'"
      pattern: "getCollection\\('products'\\)"
    - from: "src/pages/index.astro"
      to: "src/components/sections/*.astro"
      via: "component imports"
      pattern: "import (Hero|AgenticAIExplainer|ProductGrid|ProblemPitchSection)"
    - from: "src/pages/index.astro"
      to: "src/components/global/{Nav,Footer}.astro"
      via: "component imports (Phase 1 carryover)"
      pattern: "import (Nav|Footer)"
---

<objective>
Replace the Phase 1 "coming soon" placeholder at `src/pages/index.astro` with the composition-only narrative page that satisfies TECH-04: imports section components in narrative order, fetches products via `getCollection('products')`, sorts by frontmatter `order` field, and passes the sorted array to ProductGrid. Zero business logic, zero inline data, zero copy strings beyond the page title/description.

Purpose: TECH-04 is one of Phase 2's load-bearing rules — the home page is composition-only so future plans can swap individual sections (e.g., reorder, add a Diagram in Phase 4) without rewriting the page. This plan also closes the user-facing acceptance criteria from CONTENT-01 through CONTENT-07 by virtue of rendering all the section components Plan 02-02 created.

Output: `src/pages/index.astro` is composition-only and the live `dist/index.html` (after `npm run build`) contains every Phase 2 narrative element in order.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/02-content-static-page/02-RESEARCH.md
@.planning/phases/02-content-static-page/02-01-content-collection-PLAN.md
@.planning/phases/02-content-static-page/02-02-section-and-card-components-PLAN.md
@CLAUDE.md
@src/content.config.ts
@src/pages/index.astro
@src/layouts/Base.astro
@src/components/global/Nav.astro
@src/components/global/Footer.astro

<interfaces>
<!-- All components consumed by index.astro. Already shipped by 02-01 + 02-02 + Phase 1. -->

```typescript
// From src/content.config.ts (Plan 02-01):
import { getCollection } from 'astro:content';
const products = await getCollection('products');
// products is CollectionEntry<'products'>[]; .data has {name, tagline, stage, order, cta, headline}.

// From src/components/sections/* (Plan 02-02):
// - Hero.astro                  — no props
// - AgenticAIExplainer.astro    — no props
// - ProductGrid.astro           — Props: { products: CollectionEntry<'products'>[] }
// - ProblemPitchSection.astro   — no props (renders ProblemPitchForm internally)

// From src/layouts/Base.astro (Phase 1):
// - Base.astro                  — Props: { title?: string; description?: string; }; renders <slot />.

// From src/components/global/* (Phase 1, unchanged):
// - Nav.astro    — no props
// - Footer.astro — no props
```

Phase 1 already-shipped index.astro (THIS file is being REPLACED, not modified):
```astro
--- 
import Base from '../layouts/Base.astro';
import Nav from '../components/global/Nav.astro';
import Footer from '../components/global/Footer.astro';
--- 
<Base title="JigSpec — coming soon" description="...">
  <Nav />
  <main class="flex-1 px-6 py-32 max-w-3xl mx-auto">
    <h1 class="font-display text-5xl md:text-6xl tracking-tight text-fg">
      JigSpec — coming soon
    </h1>
    <p class="mt-6 text-lg text-muted">...</p>
  </main>
  <Footer />
</Base>
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite src/pages/index.astro as composition-only narrative</name>
  <files>src/pages/index.astro</files>
  <read_first>
    - src/pages/index.astro (current Phase 1 "coming soon" content — this file is being REPLACED)
    - src/content.config.ts (Plan 02-01 schema — getCollection('products') return type)
    - src/components/sections/Hero.astro (Plan 02-02 — no props)
    - src/components/sections/AgenticAIExplainer.astro (Plan 02-02 — no props)
    - src/components/sections/ProductGrid.astro (Plan 02-02 — accepts products prop)
    - src/components/sections/ProblemPitchSection.astro (Plan 02-02 — renders form internally)
    - src/components/global/Nav.astro (Phase 1 — `#products` anchor target lands on ProductGrid)
    - src/components/global/Footer.astro (Phase 1 — closes CONTENT-07)
    - src/layouts/Base.astro (Phase 1 — title/description props)
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 3 lines 305-345 composition-only index)
    - .planning/REQUIREMENTS.md (TECH-04 zero business logic constraint)
  </read_first>
  <action>
Overwrite `src/pages/index.astro` (currently the Phase 1 "coming soon" placeholder) with EXACTLY this composition:

```astro
--- 
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Nav from '../components/global/Nav.astro';
import Footer from '../components/global/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import AgenticAIExplainer from '../components/sections/AgenticAIExplainer.astro';
import ProductGrid from '../components/sections/ProductGrid.astro';
import ProblemPitchSection from '../components/sections/ProblemPitchSection.astro';

// Sort by frontmatter `order` (Zod schema guarantees it's an int 1..6).
// This is the single permitted data-marshaling line per Pattern 3 — keeps ProductGrid presentational.
const products = (await getCollection('products')).sort(
  (a, b) => a.data.order - b.data.order
);
--- 

<Base
  title="JigSpec — agentic AI that ships"
  description="JigSpec is the company-level studio behind agentic AI products that ship with reliability and autonomy."
>
  <Nav />
  <main class="flex-1">
    <Hero />
    <AgenticAIExplainer />
    <ProductGrid products={products} />
    <ProblemPitchSection />
  </main>
  <Footer />
</Base>
```

Locked rules from TECH-04 + Pattern 3:
1. The ONLY business-logic line allowed is `(await getCollection('products')).sort(...)` — Pattern 3 explicitly permits this as data marshaling, NOT business logic.
2. NO inline strings beyond `title` + `description` Base props.
3. NO inline component definitions (e.g., no inline JSX-style markup creating cards or sections).
4. NO `<script>` tags, NO `<style>` tags — Phase 1 chrome (Base.astro) handles globals.
5. NO `posthog` references — Phase 3 wires PostHog. A grep for `posthog` in this file MUST return zero.
6. NO `action=` attributes — forms are inside ProblemPitchSection (which renders ProblemPitchForm with no action per 02-02). A grep for `action=` in this file MUST return zero.
7. Section narrative order is FIXED: Hero → AgenticAIExplainer → ProductGrid → ProblemPitchSection (per CONTENT-01..06 sequence in REQUIREMENTS.md).
8. The home page does NOT include a MermaidDiagram. The diagram component exists for Phase 4. The 02-RESEARCH.md research note ("Phase 2's MermaidDiagram should accept a code prop ... Recommended: dashed-border placeholder matching the sketch comparison") is honored by the COMPONENT existing (Plan 02-02), but the home composition does NOT render it — Phase 4 inserts diagram instances into the explainer or as a standalone section. This keeps Phase 2's "structure + placeholder copy, no diagrams yet" boundary clean.

Title and description copy:
- `title="JigSpec — agentic AI that ships"` (concrete, falsifiable per CONTENT-01 spirit; replaces the Phase 1 "coming soon").
- `description="JigSpec is the company-level studio behind agentic AI products that ship with reliability and autonomy."` (concrete; matches Base.astro's default but overrides for the home page specifically).
  </action>
  <verify>
    <automated>grep -q "import { getCollection } from 'astro:content'" src/pages/index.astro && grep -q "import Base from '../layouts/Base.astro'" src/pages/index.astro && grep -q "import Nav from '../components/global/Nav.astro'" src/pages/index.astro && grep -q "import Footer from '../components/global/Footer.astro'" src/pages/index.astro && grep -q "import Hero from '../components/sections/Hero.astro'" src/pages/index.astro && grep -q "import AgenticAIExplainer from '../components/sections/AgenticAIExplainer.astro'" src/pages/index.astro && grep -q "import ProductGrid from '../components/sections/ProductGrid.astro'" src/pages/index.astro && grep -q "import ProblemPitchSection from '../components/sections/ProblemPitchSection.astro'" src/pages/index.astro && grep -q "getCollection('products')" src/pages/index.astro && grep -q "a.data.order - b.data.order" src/pages/index.astro && grep -q "<Hero />" src/pages/index.astro && grep -q "<AgenticAIExplainer />" src/pages/index.astro && grep -q "<ProductGrid products={products} />" src/pages/index.astro && grep -q "<ProblemPitchSection />" src/pages/index.astro && grep -q "<Nav />" src/pages/index.astro && grep -q "<Footer />" src/pages/index.astro && ! grep -E 'posthog' src/pages/index.astro && ! grep -E 'action=' src/pages/index.astro && ! grep -q "coming soon" src/pages/index.astro && ! grep -q "<script>" src/pages/index.astro && ! grep -q "<style>" src/pages/index.astro && [ "$(grep -cE '^[a-zA-Z]' src/pages/index.astro | head -n1)" != "" ] && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - File contains all 8 imports verbatim (Base, Nav, Footer, Hero, AgenticAIExplainer, ProductGrid, ProblemPitchSection, getCollection from 'astro:content') — each grep returns 1 match
    - File calls `getCollection('products')` exactly once
    - File sorts products by `a.data.order - b.data.order` (grep)
    - Section components render in narrative order — verify by reading the file: Hero appears before AgenticAIExplainer appears before ProductGrid appears before ProblemPitchSection (sequential grep line numbers)
    - File contains `<Nav />` and `<Footer />` (Phase 1 chrome wrap)
    - File contains NO `posthog` references: `! grep -E 'posthog' src/pages/index.astro`
    - File contains NO `action=` attributes: `! grep -E 'action=' src/pages/index.astro`
    - File contains NO `<script>` tags: `! grep -q '<script>' src/pages/index.astro`
    - File contains NO `<style>` tags: `! grep -q '<style>' src/pages/index.astro`
    - File no longer contains "coming soon" text: `! grep -q 'coming soon' src/pages/index.astro`
    - Title is `JigSpec — agentic AI that ships` and description matches the locked string (grep both)
  </acceptance_criteria>
  <done>`src/pages/index.astro` is composition-only with Base + Nav + 4 sections + Footer in narrative order. `getCollection('products')` + sort is the only business-logic line. No PostHog references, no action attributes, no inline scripts/styles, no "coming soon" placeholder.</done>
</task>

<task type="auto">
  <name>Task 2: Build the site and verify the rendered home page contains every Phase 2 narrative element</name>
  <files>(no source files modified — verification only)</files>
  <read_first>
    - src/pages/index.astro (just rewritten in Task 1)
    - .planning/REQUIREMENTS.md (CONTENT-01..07 acceptance verbatim)
    - .planning/ROADMAP.md (Phase 2 SC#1 — preview URL serves home page end-to-end)
  </read_first>
  <action>
Run the production build and verify the rendered HTML contains every Phase 2 narrative element. This is a verification task — no source files are modified.

```bash
# Clean build
rm -rf dist/
npm run build 2>&1 | tee /tmp/02-03-build.log

# Verify build succeeded
grep -qE 'Astro v6\.' /tmp/02-03-build.log
! grep -qiE 'error' /tmp/02-03-build.log

# Verify dist/index.html exists
test -f dist/index.html

# Verify it's a real composition (not the Phase 1 "coming soon")
! grep -q 'coming soon' dist/index.html

# Verify hero element rendered (CONTENT-01)
grep -q 'JigSpec — agentic AI that ships' dist/index.html       # title set on the page

# Verify all 6 product names appear (CONTENT-03 narrative order)
grep -q 'buggerd' dist/index.html
grep -q 'Scientific paper agent' dist/index.html
grep -q 'Triage + router bot' dist/index.html
grep -q 'Always-on recorder + extractor' dist/index.html
grep -q 'Agentic Employees' dist/index.html
grep -q 'Delegate' dist/index.html

# Verify each product appears in the correct narrative order in the HTML stream
node -e 'const fs = require("fs"); const html = fs.readFileSync("dist/index.html","utf8"); const idxs = ["buggerd","Scientific paper agent","Triage + router bot","Always-on recorder + extractor","Agentic Employees","Delegate"].map(n => html.indexOf(n)); console.log(idxs.join(",")); process.exit(idxs.every((v,i,a) => v >= 0 && (i === 0 || v > a[i-1])) ? 0 : 1);'

# Verify all 3 stage badges appear (CONTENT-04)
grep -q '>Shipping<' dist/index.html
grep -q '>Probe<'    dist/index.html
grep -q '>Sibling<'  dist/index.html

# Verify exactly 1 Shipping badge, 4 Probe badges, 1 Sibling badge
test "$(grep -oE '>Shipping<' dist/index.html | wc -l)" = "1"
test "$(grep -oE '>Probe<'    dist/index.html | wc -l)" = "4"
test "$(grep -oE '>Sibling<'  dist/index.html | wc -l)" = "1"

# Verify the agentic-ai explainer section anchor (CONTENT-02)
grep -q 'id="agentic-ai"' dist/index.html

# Verify the products section anchor (CONTENT-03)
grep -q 'id="products"' dist/index.html

# Verify the problem-pitch section anchor (CONTENT-06)
grep -q 'id="problem-pitch"' dist/index.html

# Verify the block-link card anchors point correctly (CONTENT-05)
# buggerd → external https://buggerd.com with target=_blank + rel=noopener
grep -E 'href="https://buggerd\.com"[^>]*target="_blank"[^>]*rel="noopener noreferrer"' dist/index.html

# 5 concept cards → /products/[slug]
grep -q 'href="/products/scientific-paper-agent"' dist/index.html
grep -q 'href="/products/triage-router-bot"'      dist/index.html
grep -q 'href="/products/recorder-extractor"'     dist/index.html
grep -q 'href="/products/agentic-employees"'      dist/index.html
grep -q 'href="/products/delegate"'               dist/index.html

# Verify data-event attributes (Phase 3 wiring hook — CONTENT-05 verbatim)
test "$(grep -oE 'data-event="card:open"' dist/index.html | wc -l)" = "5"
test "$(grep -oE 'data-event="card:cta_external_click"' dist/index.html | wc -l)" = "1"

# Verify the home page does NOT contain an InterestForm (DEMAND-01: forms are on /products/[slug] only)
! grep -q 'data-form="interest"' dist/index.html

# Verify the home page DOES contain a ProblemPitchForm placeholder (CONTENT-06)
grep -q 'data-form="problem-pitch"' dist/index.html

# Verify Footer (CONTENT-07) — already shipped Phase 1, sanity check it lands on the home page
grep -q 'hi@jigspec.com' dist/index.html
grep -q 'github.com/JigSpec' dist/index.html

# Verify NO posthog references in the rendered HTML (Phase 3 boundary)
! grep -qiE 'posthog' dist/index.html

echo "Build verification PASSED"
```

If any line of the verification fails, the executor MUST iterate on the underlying component or composition until it passes — do NOT modify the verification commands. Specifically:
- If a product name is missing → check the relevant `src/content/products/*.md` `name` field against the literal in the verification grep.
- If badge counts are wrong → check `src/content/products/*.md` stage values: 1 Shipping, 4 Probe, 1 Sibling.
- If `/products/[slug]` href is missing → check ProductCard's `${product.id}` interpolation against actual filenames.
- If the `coming soon` text persists → re-confirm `src/pages/index.astro` was overwritten, not appended-to.
  </action>
  <verify>
    <automated>rm -rf dist/ && npm run build 2>&1 | tee /tmp/02-03-build.log | grep -qE 'Astro v6\.' && ! grep -qi 'error' /tmp/02-03-build.log && test -f dist/index.html && ! grep -q 'coming soon' dist/index.html && grep -q 'buggerd' dist/index.html && grep -q 'Scientific paper agent' dist/index.html && grep -q 'Triage + router bot' dist/index.html && grep -q 'Always-on recorder + extractor' dist/index.html && grep -q 'Agentic Employees' dist/index.html && grep -q 'Delegate' dist/index.html && grep -q '>Shipping<' dist/index.html && grep -q '>Probe<' dist/index.html && grep -q '>Sibling<' dist/index.html && [ "$(grep -oE '>Shipping<' dist/index.html | wc -l)" = "1" ] && [ "$(grep -oE '>Probe<' dist/index.html | wc -l)" = "4" ] && [ "$(grep -oE '>Sibling<' dist/index.html | wc -l)" = "1" ] && grep -q 'id="agentic-ai"' dist/index.html && grep -q 'id="products"' dist/index.html && grep -q 'id="problem-pitch"' dist/index.html && grep -E 'href="https://buggerd\.com"' dist/index.html | grep -q 'target="_blank"' && grep -q 'href="/products/scientific-paper-agent"' dist/index.html && grep -q 'href="/products/delegate"' dist/index.html && [ "$(grep -oE 'data-event="card:open"' dist/index.html | wc -l)" = "5" ] && [ "$(grep -oE 'data-event="card:cta_external_click"' dist/index.html | wc -l)" = "1" ] && ! grep -q 'data-form="interest"' dist/index.html && grep -q 'data-form="problem-pitch"' dist/index.html && grep -q 'hi@jigspec.com' dist/index.html && grep -q 'github.com/JigSpec' dist/index.html && ! grep -qi 'posthog' dist/index.html && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `npm run build` exits 0 with `Astro v6.` in the log and no "error" lines
    - `dist/index.html` exists and does not contain "coming soon"
    - All 6 product names appear in the rendered HTML in narrative order (buggerd → Scientific paper agent → Triage + router bot → Always-on recorder + extractor → Agentic Employees → Delegate)
    - Stage badge counts: exactly 1 Shipping, 4 Probe, 1 Sibling
    - Section anchors `id="agentic-ai"`, `id="products"`, `id="problem-pitch"` all present (CONTENT-02 / 03 / 06)
    - Buggerd's anchor has `href="https://buggerd.com"` + `target="_blank"` + `rel="noopener noreferrer"` (CONTENT-05)
    - All 5 concept cards have `href="/products/{slug}"` for their respective slugs
    - data-event count: exactly 5 `data-event="card:open"` and exactly 1 `data-event="card:cta_external_click"`
    - Home page contains NO `data-form="interest"` (DEMAND-01: per-card forms only on detail pages)
    - Home page DOES contain `data-form="problem-pitch"` (CONTENT-06)
    - Footer items render (`hi@jigspec.com`, `github.com/JigSpec`) — CONTENT-07 carryover
    - No PostHog references anywhere in the rendered HTML (Phase 3 boundary)
  </acceptance_criteria>
  <done>The production build is green and the rendered `dist/index.html` contains every Phase 2 narrative element in the correct order, with the correct stage-badge counts, the correct external-vs-interest CTA wiring, and the correct Phase 2/3 boundary markers.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time content fetch → static HTML | `getCollection('products')` runs at `astro build`; any schema validation failure fails the build. |
| home page → user browser | All page state is HTML — no client-side state machine, no PostHog yet. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-02-14 | Tampering | Composition order drift | Low | mitigate | Task 2 verifies narrative order via byte-offset comparison in rendered HTML. Failing test forces fix. |
| T-02-15 | Information Disclosure | Inline business logic in index.astro | Low | mitigate | TECH-04 enforces composition-only; Task 1 acceptance grep-blocks `<script>`, `<style>`, `posthog`, `action=`. |
| T-02-16 | Denial of Service | Build fails on missing component import | Low | mitigate | Task 2's `npm run build` is the gate; failure fails the wave. |
| T-02-17 | Spoofing | Wrong CTA destination on buggerd card | Medium | mitigate | Task 2 verifies `href="https://buggerd.com"` + `target="_blank"` + `rel="noopener noreferrer"` literally in rendered HTML. |
| T-02-18 | Repudiation | Phase 3 PostHog wiring expects 1 `card:cta_external_click` + 5 `card:open` data-events | Low | mitigate | Task 2 counts data-events exactly; mismatch fails verification. |
</threat_model>

<verification>
After both tasks complete:

```bash
# Source hygiene
grep -c "getCollection('products')" src/pages/index.astro    # exactly 1
! grep -E '<script>|<style>|posthog|action=' src/pages/index.astro

# Build green
npm run build 2>&1 | tail -20

# Rendered HTML smoke
grep -c 'data-event=' dist/index.html                        # exactly 6 (5 open + 1 external)
grep -c 'data-form=' dist/index.html                         # exactly 1 (problem-pitch)
grep -c 'data-product-id=' dist/index.html                   # exactly 6 (one per card)
```
</verification>

<success_criteria>
- `src/pages/index.astro` is composition-only and 20-30 lines total (TECH-04)
- All Phase 2 narrative elements render on the home page (CONTENT-01..06)
- ProductGrid renders 6 cards in correct narrative order with correct stage badges (CONTENT-03/04)
- Buggerd card opens externally; concept cards link to `/products/[slug]` (CONTENT-05)
- ProblemPitchSection renders with form-shaped placeholder (CONTENT-06)
- Footer renders (CONTENT-07 carryover)
- Build is clean (no errors); rendered HTML contains zero PostHog references
</success_criteria>

<output>
After completion, create `.planning/phases/02-content-static-page/02-03-index-composition-SUMMARY.md` documenting:
- Final line count of `src/pages/index.astro`
- The exact narrative order verified in the rendered HTML
- Build log (relevant excerpt)
- Any deviations (e.g., title/description text adjusted)
</output>
