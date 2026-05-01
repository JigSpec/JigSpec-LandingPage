---
id: 02-04
phase: 02-content-static-page
plan: 04
type: execute
wave: 3
depends_on: [02-01, 02-02]
files_modified:
  - src/pages/products/[slug].astro
autonomous: true
requirements: [CONTENT-09]
tags: [astro, dynamic-route, content-collections, product-detail, getStaticPaths]
must_haves:
  truths:
    - "src/pages/products/[slug].astro exists as a single dynamic-route template"
    - "getStaticPaths filters to products where cta.type === 'interest' (excludes buggerd)"
    - "After `npm run build`, dist/products/ contains EXACTLY 5 directories: scientific-paper-agent, triage-router-bot, recorder-extractor, agentic-employees, delegate"
    - "dist/products/buggerd/ does NOT exist (off-by-one bug Pitfall 7 is closed at build time)"
    - "Each detail page renders: stage label + frontmatter.headline + Markdown body via render(entry) + InterestForm placeholder + back-to-home link + Nav + Footer"
    - "The detail page uses Astro 6's `await render(entry)` API — NOT the legacy `entry.render()`"
    - "InterestForm placeholder is embedded on each detail page parameterized with productId (DEMAND-01: forms render on detail pages, NOT modals on home page)"
    - "Back-to-home link points to `/` and is visually distinct from the form CTA"
  artifacts:
    - path: src/pages/products/[slug].astro
      provides: "Single dynamic-route template for 5 concept-stage product detail pages"
      contains: "getStaticPaths"
  key_links:
    - from: "src/pages/products/[slug].astro"
      to: "src/content/products/*.md (via getCollection + render)"
      via: "import { getCollection, render } from 'astro:content'"
      pattern: "await render\\(product\\)"
    - from: "src/pages/products/[slug].astro"
      to: "src/components/forms/InterestForm.astro"
      via: "component import"
      pattern: "import InterestForm"
    - from: "src/pages/products/[slug].astro"
      to: "discriminated cta union (filter)"
      via: ".filter(p => p.data.cta.type === 'interest')"
      pattern: "cta.type === 'interest'"
---

<objective>
Build the single dynamic-route template at `src/pages/products/[slug].astro` that renders all 5 concept-stage product detail pages from the same content collection. The template uses `getStaticPaths` filtered to `cta.type === 'interest'` so buggerd (the only `external` cta) is excluded — closing the 6-vs-5 off-by-one bug surfaced as Pitfall 7 in 02-RESEARCH.md. Each detail page renders the product's headline + Markdown body + an embedded InterestForm placeholder + a back-to-home link, all inside the existing Phase 1 Nav/Footer chrome.

Purpose: CONTENT-09 is the single requirement closing here. The user-visible outcome is that clicking any concept card on the home page navigates to a per-concept detail page; clicking the buggerd card goes to buggerd.com (already wired by ProductCard's `target="_blank"` external branch). This plan is the only place the dynamic-route is defined; both the route and the form-embedding pattern are reused verbatim by Phase 3 (which only swaps the form's wiring) and Phase 4 (which only adjusts visual polish).

Output: Five build-time-generated detail pages (`/products/{slug}/index.html`) with form-shaped placeholders and zero buggerd detail page.
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
@src/layouts/Base.astro
@src/components/global/Nav.astro
@src/components/global/Footer.astro
@src/components/forms/InterestForm.astro

<interfaces>
<!-- Astro 6 dynamic-route + content rendering surface area. -->

```typescript
// From 'astro:content' (Astro 6 — NOT 'astro:content' for z anymore):
import { getCollection, render } from 'astro:content';
// render(entry) returns { Content, headings, remarkPluginFrontmatter } — Astro 6 API.
// NOT entry.render() — that was removed in Astro 6 (Pitfall 1).

// From 'astro':
import type { GetStaticPaths } from 'astro';
// getStaticPaths must return Array<{ params: { [key]: string }, props?: any }>.

// CollectionEntry<'products'> shape (from 02-01 schema):
// .id     — file basename minus .md (e.g., 'scientific-paper-agent')
// .slug   — REMOVED IN ASTRO 5/6. Use .id instead. (Pitfall: anti-pattern in 02-RESEARCH.md)
// .data   — typed frontmatter { name, tagline, stage, order, cta, headline }
// .data.cta is a discriminated union — narrowing on .type lets TS know whether .url exists.

// Existing components consumed:
// - InterestForm.astro    — Props: { productId: string }
// - Base.astro            — Props: { title?, description? }
// - Nav.astro             — no props
// - Footer.astro          — no props
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create the dynamic-route template at src/pages/products/[slug].astro</name>
  <files>src/pages/products/[slug].astro</files>
  <read_first>
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 8 lines 547-606 dynamic route template; Pitfall 1 line 636-640 Astro 6 API drift; Pitfall 7 line 672-676 5-not-6 detail pages; Open Question 3 line 793-796 prose vs hand-styled markdown)
    - src/content.config.ts (the schema — discriminated cta union, headline field, products narrative order)
    - src/components/forms/InterestForm.astro (Plan 02-02 — productId prop)
    - src/components/global/Nav.astro and Footer.astro (Phase 1 chrome reused)
    - src/layouts/Base.astro (title/description props)
    - .planning/REQUIREMENTS.md (CONTENT-09 verbatim)
  </read_first>
  <action>
Create `src/pages/products/[slug].astro` with the EXACT following content (Pattern 8 from 02-RESEARCH.md, with the Open-Question-3 hand-styled markdown wrapper since `@tailwindcss/typography` is NOT installed):

```astro
--- 
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import Base from '../../layouts/Base.astro';
import Nav from '../../components/global/Nav.astro';
import Footer from '../../components/global/Footer.astro';
import InterestForm from '../../components/forms/InterestForm.astro';

export const getStaticPaths = (async () => {
  const products = await getCollection('products');
  // CRITICAL filter — Pitfall 7. cta.type === 'interest' excludes buggerd (which is 'external').
  // Result: 5 detail pages, NOT 6. dist/products/buggerd/ MUST NOT exist.
  return products
    .filter((p) => p.data.cta.type === 'interest')
    .map((product) => ({
      params: { slug: product.id },     // .id, NOT .slug — Astro 6 (Pitfall 1)
      props: { product },
    }));
}) satisfies GetStaticPaths;

const { product } = Astro.props;
const { Content } = await render(product); // Astro 6 API — NOT product.render() (Pitfall 1)
--- 

<Base
  title={`${product.data.name} — JigSpec`}
  description={product.data.tagline}
>
  <Nav />
  <main class="flex-1">
    <article class="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p class="text-sm uppercase tracking-widest text-accent">{product.data.stage}</p>
      <h1 class="font-display text-4xl md:text-5xl tracking-tight text-fg mt-4 leading-tight">
        {product.data.headline}
      </h1>
      <p class="mt-6 text-xl italic text-muted">{product.data.tagline}</p>

      <!-- Hand-styled markdown wrapper — @tailwindcss/typography is NOT installed (deferred to Phase 4 polish). -->
      <!-- Selectors target the elements rendered by <Content />. Tailwind 4 supports the [&_h2] arbitrary-selector syntax. -->
      <div class="mt-10 space-y-5 text-fg/90 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:text-fg [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:text-fg [&_p]:text-fg/90 [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
        <Content />
      </div>

      <InterestForm productId={product.id} />

      <a
        href="/"
        class="mt-12 inline-block text-accent hover:underline"
        data-event="nav:link_click"
        data-link-location="product-detail-back-home"
      >
        ← Back to home
      </a>
    </article>
  </main>
  <Footer />
</Base>
```

Locked rules:
1. **File path is `src/pages/products/[slug].astro`** (the brackets are literal — Astro's dynamic-route syntax). NOT `src/pages/products/{slug}.astro` or other variants.
2. **`getStaticPaths` MUST filter by `cta.type === 'interest'`** — this is the off-by-one fix from Pitfall 7. After build, `dist/products/buggerd/` must not exist.
3. **Use `params: { slug: product.id }`** — `.id` is the file basename in Astro 6 (e.g., `'scientific-paper-agent'`). `.slug` was removed in Astro 5 (Pitfall 1 anti-pattern list).
4. **Use `await render(product)` not `product.render()`** — Astro 6 API. The legacy form throws "render is not a function" at runtime (Pitfall 1).
5. **Hand-styled markdown wrapper using Tailwind 4 arbitrary-selector syntax `[&_h2]:`** — `@tailwindcss/typography` (the `prose` utility) is NOT installed. Open Question 3 in 02-RESEARCH.md confirms this hand-styled approach for Phase 2; Phase 4 polish can install Typography if bodies grow.
6. **Embed InterestForm with `productId={product.id}`** — DEMAND-01 says forms render on detail pages, not modals on home page. Plan 02-02 already shipped the disabled-input form-shaped placeholder.
7. **Back-to-home link is `<a href="/">`** — simple, no JS. The `data-event="nav:link_click"` and `data-link-location` attributes are Phase 3 wiring hooks (the typed taxonomy in ANALYTICS-03 includes `nav:link_click`).
8. **Title and description** come from product frontmatter: `title={\`${product.data.name} — JigSpec\`}` and `description={product.data.tagline}`.
9. **NAMED Tailwind utilities only** for everything outside the arbitrary-selector wrapper. `font-display`, `text-fg`, `text-muted`, `text-accent`, `text-fg/90`, `bg-bg` — never `font-[var(--font-display)]` (Pitfall 6).
10. The `data-event` on the back link is `nav:link_click` — matches the typed taxonomy ANALYTICS-03 will define. NOT `card:open` or anything bespoke.
  </action>
  <verify>
    <automated>test -f 'src/pages/products/[slug].astro' && grep -q "import { getCollection, render } from 'astro:content'" 'src/pages/products/[slug].astro' && grep -q "import type { GetStaticPaths } from 'astro'" 'src/pages/products/[slug].astro' && grep -q "import InterestForm from '../../components/forms/InterestForm.astro'" 'src/pages/products/[slug].astro' && grep -q "filter((p) => p.data.cta.type === 'interest')" 'src/pages/products/[slug].astro' && grep -q "params: { slug: product.id }" 'src/pages/products/[slug].astro' && grep -q "satisfies GetStaticPaths" 'src/pages/products/[slug].astro' && grep -q "const { Content } = await render(product)" 'src/pages/products/[slug].astro' && grep -q "<InterestForm productId={product.id} />" 'src/pages/products/[slug].astro' && grep -q "<Content />" 'src/pages/products/[slug].astro' && grep -q 'href="/"' 'src/pages/products/[slug].astro' && grep -q 'data-event="nav:link_click"' 'src/pages/products/[slug].astro' && ! grep -E "product\.render\(\)" 'src/pages/products/[slug].astro' && ! grep -E "params: \{ slug: product\.slug" 'src/pages/products/[slug].astro' && ! grep -E 'font-\[var\(' 'src/pages/products/[slug].astro' && ! grep -q 'prose' 'src/pages/products/[slug].astro' && npx astro check 2>&1 | tee /tmp/02-04-task1-check.log | grep -qE 'Result \(.*\): 0 errors' && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - File exists at exact path `src/pages/products/[slug].astro` (with literal brackets)
    - Imports `getCollection` AND `render` from `'astro:content'` in a single line (grep)
    - Imports `GetStaticPaths` type from `'astro'` (grep)
    - `getStaticPaths` filters with `cta.type === 'interest'` (grep)
    - Uses `params: { slug: product.id }` — NOT `product.slug` (grep first; negative grep second)
    - Uses `await render(product)` — NOT `product.render()` (negative grep `product.render(`)
    - Embeds `<InterestForm productId={product.id} />` (grep)
    - Renders `<Content />` from the destructured render result (grep)
    - Back-to-home link is `<a href="/">` with `data-event="nav:link_click"` (both grep)
    - Hand-styled markdown wrapper uses `[&_h2]:` arbitrary-selector syntax (grep `\[&_h2\]:`)
    - Does NOT use `prose` Tailwind utility (`! grep -q 'prose' src/pages/products/[slug].astro`) — confirmed Open Question 3 path
    - NO arbitrary `font-[var(...)]` forms (Pitfall 6)
    - `npx astro check` reports 0 errors with the schema + components + this template
  </acceptance_criteria>
  <done>The dynamic-route template uses Astro 6 APIs verbatim, filters out buggerd, embeds the InterestForm placeholder with the productId prop, and hand-styles the rendered Markdown without `@tailwindcss/typography`. Type-checks clean.</done>
</task>

<task type="auto">
  <name>Task 2: Build and verify exactly 5 product detail pages exist (NOT 6) with embedded forms and correct content</name>
  <files>(no source files modified — verification only)</files>
  <read_first>
    - src/pages/products/[slug].astro (just created)
    - src/content/products/ (the 6 markdown files from 02-01)
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pitfall 7 verbatim — verify dist/products/buggerd/ does NOT exist)
    - .planning/REQUIREMENTS.md (CONTENT-09 acceptance verbatim)
  </read_first>
  <action>
Run the production build and verify the dynamic route generated exactly 5 detail pages (not 6) with all required content elements. This is a verification task — no source files modified.

```bash
# Clean build
rm -rf dist/
npm run build 2>&1 | tee /tmp/02-04-build.log

# Build is green
grep -qE 'Astro v6\.' /tmp/02-04-build.log
! grep -qi 'error' /tmp/02-04-build.log

# Verify dist/products/ has EXACTLY 5 directories (Pitfall 7 — 5, NOT 6)
test -d dist/products
PRODUCT_DIRS=$(ls -d dist/products/*/ 2>/dev/null | wc -l | tr -d ' ')
test "$PRODUCT_DIRS" = "5"

# Verify each of the 5 expected detail pages exists
test -f dist/products/scientific-paper-agent/index.html
test -f dist/products/triage-router-bot/index.html
test -f dist/products/recorder-extractor/index.html
test -f dist/products/agentic-employees/index.html
test -f dist/products/delegate/index.html

# Verify dist/products/buggerd/ does NOT exist (the off-by-one fix)
test ! -e dist/products/buggerd
test ! -e dist/products/buggerd/index.html

# Sample one detail page (scientific-paper-agent) and verify its content elements
SP_HTML=dist/products/scientific-paper-agent/index.html
grep -q '>Probe<'                                $SP_HTML       # stage label rendered
grep -q '<title>Scientific paper agent — JigSpec</title>' $SP_HTML  # title set from frontmatter
grep -q '<h1'                                    $SP_HTML       # headline rendered
grep -q 'data-form="interest"'                   $SP_HTML       # InterestForm rendered
grep -q 'data-product-id="scientific-paper-agent"' $SP_HTML     # productId passed correctly
grep -q 'href="/"'                               $SP_HTML       # back-to-home link
grep -q 'Back to home'                           $SP_HTML       # back-to-home link copy
grep -q 'data-event="nav:link_click"'            $SP_HTML       # back-link Phase 3 hook
grep -q 'hi@jigspec.com'                         $SP_HTML       # Footer rendered (CONTENT-07)
grep -q 'github.com/JigSpec'                     $SP_HTML       # Footer GitHub link

# Verify each of the OTHER 4 detail pages also has the InterestForm with the correct productId
for slug in triage-router-bot recorder-extractor agentic-employees delegate; do
  grep -q "data-product-id=\"$slug\"" "dist/products/$slug/index.html"
  grep -q 'data-form="interest"' "dist/products/$slug/index.html"
done

# Verify Sibling stage label rendered ONLY on delegate detail page
grep -q '>Sibling<' dist/products/delegate/index.html

# Verify NO PostHog references on any detail page (Phase 3 boundary)
! grep -riq 'posthog' dist/products/

# Verify no detail page has the 'coming soon' placeholder
! grep -rq 'coming soon' dist/products/

echo "Detail-page verification PASSED: 5 pages built, buggerd correctly excluded, all forms + back-links present"
```

If verification fails:
- 6 dirs instead of 5 → check `getStaticPaths` filter is `cta.type === 'interest'` and that buggerd's frontmatter has `cta.type: "external"`.
- Missing form on a page → check the `InterestForm` import path and `productId` prop interpolation.
- Missing detail page → check the corresponding `src/content/products/{slug}.md` exists and has valid frontmatter.
- Title not set → check `title={\`${product.data.name} — JigSpec\`}` in `[slug].astro`.
  </action>
  <verify>
    <automated>rm -rf dist/ && npm run build 2>&1 | tee /tmp/02-04-build.log | grep -qE 'Astro v6\.' && ! grep -qi 'error' /tmp/02-04-build.log && test -d dist/products && [ "$(ls -d dist/products/*/ 2>/dev/null | wc -l | tr -d ' ')" = "5" ] && test -f dist/products/scientific-paper-agent/index.html && test -f dist/products/triage-router-bot/index.html && test -f dist/products/recorder-extractor/index.html && test -f dist/products/agentic-employees/index.html && test -f dist/products/delegate/index.html && test ! -e dist/products/buggerd && grep -q '>Probe<' dist/products/scientific-paper-agent/index.html && grep -q '<title>Scientific paper agent — JigSpec</title>' dist/products/scientific-paper-agent/index.html && grep -q 'data-form="interest"' dist/products/scientific-paper-agent/index.html && grep -q 'data-product-id="scientific-paper-agent"' dist/products/scientific-paper-agent/index.html && grep -q 'data-event="nav:link_click"' dist/products/scientific-paper-agent/index.html && grep -q '>Sibling<' dist/products/delegate/index.html && grep -q 'data-product-id="delegate"' dist/products/delegate/index.html && grep -q 'data-product-id="triage-router-bot"' dist/products/triage-router-bot/index.html && grep -q 'data-product-id="recorder-extractor"' dist/products/recorder-extractor/index.html && grep -q 'data-product-id="agentic-employees"' dist/products/agentic-employees/index.html && ! grep -riq 'posthog' dist/products/ && ! grep -rq 'coming soon' dist/products/ && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `npm run build` exits 0 with `Astro v6.` in log and no "error" lines
    - `dist/products/` contains EXACTLY 5 subdirectories (count check)
    - All 5 expected detail pages exist as `dist/products/{slug}/index.html` (one per concept-stage product)
    - `dist/products/buggerd` and `dist/products/buggerd/index.html` do NOT exist (Pitfall 7 closed)
    - Sample detail page (scientific-paper-agent): title is `<title>Scientific paper agent — JigSpec</title>`, contains `>Probe<` stage label, contains InterestForm placeholder with `data-product-id="scientific-paper-agent"`, contains back-to-home link with `data-event="nav:link_click"`, contains Footer items
    - Each of the 5 detail pages has its InterestForm with the correct `data-product-id="{slug}"`
    - delegate detail page is the ONLY page with `>Sibling<` stage label
    - NO `posthog` references on any detail page (Phase 3 boundary)
    - NO "coming soon" text on any detail page
  </acceptance_criteria>
  <done>Production build is green and `dist/products/` contains exactly 5 detail pages (no buggerd page); each page has the correct title, stage label, InterestForm with productId, back-to-home link, and Footer. Pitfall 7 is closed at build time by the discriminated-union filter.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time getStaticPaths → static page tree | The filter on `cta.type === 'interest'` is the only thing that prevents `dist/products/buggerd/index.html` from being generated. Pitfall 7 is build-time-enforced. |
| Markdown body → rendered HTML | `await render(product)` runs at build; markdown source is author-controlled (no user-supplied input). |
| Detail page → external links inside markdown body | If a body contains an external link, the `[&_a]:text-accent [&_a]:underline` styling applies but no `target=_blank` / `rel=noopener` is added — markdown links are author-vetted. Acceptable risk in Phase 2; Phase 4 polish can audit. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-02-19 | Spoofing | buggerd detail page accidentally generated | High | mitigate | `getStaticPaths` filter `cta.type === 'interest'` + Task 2 verifies `dist/products/buggerd` does NOT exist. Build-time enforcement is stronger than runtime check. |
| T-02-20 | Tampering | Astro 6 API drift (`product.render()` vs `render(product)`) | Medium | mitigate | Acceptance grep negative-checks `product.render(`; positive-checks `await render(product)`. Build would fail anyway, but explicit grep catches drift in code review. |
| T-02-21 | Information Disclosure | Frontmatter `headline` field exposed in `<h1>` even if it contains placeholder bracketed text | Low | accept | All Phase 2 copy is bracketed-placeholder per D-03; Phase 4 polish revises. |
| T-02-22 | Repudiation | InterestForm productId mismatch (e.g., kebab-case vs slug drift) | Low | mitigate | Task 2 verifies each detail page's `data-product-id` matches its slug. Phase 3's PostHog wiring depends on this match. |
| T-02-23 | Information Disclosure | External link inside markdown body opens without `rel="noopener"` | Low | accept | Markdown bodies are author-controlled; Phase 4 polish can add a remark plugin if external links proliferate. Phase 2 placeholder bodies have no external links. |
| T-02-24 | Denial of Service | Hand-styled markdown wrapper `[&_h2]:` syntax not extracted by Tailwind 4 | Low | mitigate | Tailwind 4 supports arbitrary-selector syntax (Open Question 3 confirms). If extraction fails, fallback is to install `@tailwindcss/typography` in Phase 4. |
</threat_model>

<verification>
After both tasks complete:

```bash
# Source hygiene
test -f 'src/pages/products/[slug].astro'
grep -q "cta.type === 'interest'" 'src/pages/products/[slug].astro'
grep -q "await render(product)" 'src/pages/products/[slug].astro'
! grep -q "product.render(" 'src/pages/products/[slug].astro'

# Build asymmetry
ls -d dist/products/*/ 2>/dev/null | wc -l         # exactly 5
test ! -e dist/products/buggerd

# Form embedding
for slug in scientific-paper-agent triage-router-bot recorder-extractor agentic-employees delegate; do
  grep -q "data-product-id=\"$slug\"" "dist/products/$slug/index.html"
done
```
</verification>

<success_criteria>
- `src/pages/products/[slug].astro` exists with Astro 6 APIs verbatim (CONTENT-09)
- After build, `dist/products/` has 5 subdirectories — buggerd is excluded (Pitfall 7 fix)
- Each detail page renders: stage label + headline + Markdown body + InterestForm w/ productId + back-to-home link + Footer
- No PostHog references on any detail page
- `npx astro check` passes; `npm run build` is green
- Hand-styled markdown wrapper used instead of `@tailwindcss/typography` (deferred per Open Question 3)
</success_criteria>

<output>
After completion, create `.planning/phases/02-content-static-page/02-04-product-detail-route-SUMMARY.md` documenting:
- Confirmed count: 5 detail page directories under `dist/products/`, no buggerd
- Each detail page's title, stage, and form-embedding verified
- Hand-styled markdown wrapper note (Open Question 3 path locked)
- Any deviations
</output>
