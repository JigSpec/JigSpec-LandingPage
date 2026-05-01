# Phase 2: Content & Static Page — Research

**Researched:** 2026-04-29
**Domain:** Astro 6 content collections + Tailwind 4 components + accessible block-link cards
**Confidence:** HIGH on Astro/Zod APIs and accessibility pattern; MEDIUM on stage-badge + form-placeholder visual choices (taste-driven within locked palette).

## Summary

Phase 2 turns Phase 1's empty Astro shell into a complete, reviewable static document at `https://jigspec-landing.vercel.app`. The phase is structurally simple — six section components composed in narrative order on `pages/index.astro`, plus a single dynamic-route template for the five concept cards — but it is gated by three load-bearing technical decisions that must land in the plan correctly: (1) the **content collection contract** with a Zod discriminated `cta` union; (2) the **whole-card-clickable accessibility pattern**; and (3) the **boundary between Phase 2 placeholders and Phase 3/4 wiring** so we don't accidentally commit to runtime behavior we'll redo later.

Two conventions changed in Astro 6 vs. earlier-version habits and **must** be respected: the content config file lives at `src/content.config.ts` (not `src/content/config.ts` — the legacy path was removed in v6) [VERIFIED: docs.astro.build/en/guides/upgrade-to/v6/], and rendering uses `await render(entry)` imported from `astro:content` (not `entry.render()`) [VERIFIED: same source]. Both differ from what currently appears in REQUIREMENTS.md and ROADMAP.md, which mention `src/content/config.ts` — surfaced below as a documentation drift the planner should patch via plan acceptance criteria.

**Primary recommendation:** Build the content collection with `loader: glob({ pattern: '**/*.md', base: './src/content/products' })` and a Zod discriminated-union `cta` schema; render product detail pages with `getStaticPaths` over `getCollection('products')` and the `await render(entry)` API; make cards clickable via the **Heydon Pickering pattern** (link wraps the heading, pseudo-element stretches across the card); ship `<form>` markup that is structurally complete but lacks an `action` attribute and uses a disabled "Coming in Phase 3" submit button so cold-readers can confirm the form exists without it being submittable. Skip `@astrojs/mdx` entirely — the requirement set explicitly says `.md`, plain Markdown works without it, and adding it triggers a peer-dependency warning that's not worth the cost when Phase 2 doesn't need component embedding inside Markdown.

<user_constraints>
## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for Phase 2 (this research was spawned via `/gsd-research-phase` standalone or `/gsd-plan-phase` integrated, without a separate discuss session). The constraints below come directly from REQUIREMENTS.md, ROADMAP.md, and the locked Key Decisions in PROJECT.md, and the planner should treat them with equivalent authority to a CONTEXT.md `## Decisions` block.

### Locked Decisions (from REQUIREMENTS.md / ROADMAP.md / PROJECT.md)

- **Content collection path**: `src/content/products/{slug}.md` (one Markdown file per product) — REQUIREMENTS.md TECH-02
- **Six products in narrative order**: buggerd, scientific-paper-agent, triage-router-bot, recorder-extractor, agentic-employees, delegate — REQUIREMENTS.md CONTENT-03 (corrected order from PROJECT.md key decisions D-23)
- **Stage badges**: `Shipping` for buggerd, `Probe` for the four concept-stage products, `Sibling` for delegate — REQUIREMENTS.md CONTENT-04
- **Discriminated CTA union**: `external` for buggerd → `https://buggerd.com` (target=_blank); `interest` for the other 5 → `/products/[slug]` — REQUIREMENTS.md CONTENT-05/CONTENT-09
- **Whole-card clickable**: entire surface of every card navigates to its destination — REQUIREMENTS.md CONTENT-05
- **Per-concept landing pages**: `/products/[slug]` rendered by a single `pages/products/[slug].astro` template, includes 200–400 word body + interest-form placeholder + back-to-home link, reuses Nav/Footer — REQUIREMENTS.md CONTENT-09
- **`pages/index.astro` is composition-only**: imports section components in narrative order, zero business logic, zero inline data — REQUIREMENTS.md TECH-04
- **`blog` collection schema reserved**: empty schema in `content.config.ts` so v2 ships without re-platform — ROADMAP.md Phase 2 success criterion 4
- **Component layout fixed**: `src/components/sections/`, `src/components/cards/ProductCard.astro`, `src/components/forms/InterestForm.astro` (parameterized by `productId`), `src/components/diagrams/MermaidDiagram.astro`, plus existing `src/components/global/{Nav,Footer}.astro` — REQUIREMENTS.md TECH-03
- **Single `InterestForm` primitive**: parameterized by `productId`, used on each `/products/[slug]` page (NOT modals on the home page) — REQUIREMENTS.md TECH-03 + DEMAND-01
- **Honesty constraint**: no testimonials, no "trusted by" logos, no fabricated metrics, no "industry-leading" superlatives — REQUIREMENTS.md CONTENT-08
- **Bracketed-placeholder copy convention** (continuing Phase 1): copy may be placeholder text wrapped in `[...]` for cold-read review; final copy can land later in-phase or be deferred to Phase 4 polish — ROADMAP.md Phase 2 acceptance language ("every CTA visible (but not yet functional)")
- **Falsifiable hero sub-line**: hero must include a sub-line that is *falsifiable* (e.g. "agents that pass your existing CI before they ship a change," not "the future of work") — REQUIREMENTS.md CONTENT-01
- **Educational section structure**: 250–400 word "What is agentic AI" section with heading + body + a contrast element (small table or two-column layout) — REQUIREMENTS.md CONTENT-02
- **Footer items unchanged from Phase 1**: docs link (initially → existing VitePress site at jigspec.com, flips to docs.jigspec.com at cutover), contact email (`hi@jigspec.com`), copyright, GitHub org link (`https://github.com/JigSpec`) — REQUIREMENTS.md CONTENT-07; Phase 1 already shipped this exact footer
- **Visual identity locked from Phase 1**: Crimson Pro 600 display + Inter 400/500 body, palette = `--color-bg #FAFAF8` / `--color-fg #18181B` / `--color-muted #71717A` / `--color-accent #6366F1` — PROJECT.md Phase 1 key decisions, `src/styles/global.css`

### Claude's Discretion (areas with research-backed recommendations below)

- Whether to install `@astrojs/mdx` in Phase 2 → **Recommend skip** (see § Don't Hand-Roll, § Standard Stack)
- Card grid responsive breakpoint pattern (3×2 vs 2×3 vs 1-up at mobile) → **Recommend 1-col / 2-col / 3-col at sm/md/lg**
- Stage badge visual treatment within the locked palette → **Recommend three-tier hierarchy: Shipping = filled accent, Probe = muted outline, Sibling = micro-uppercase muted text-only**
- Card grid section width — does the grid section break out of the essay-narrow `max-w-3xl`/`max-w-5xl` chrome? → **Recommend yes, use `max-w-6xl` for the grid section only**
- Form placeholder shape (disabled button vs. visible non-submittable form vs. coming-soon banner) → **Recommend structurally-complete `<form>` with no `action`, real `<label>`s, and a disabled submit button with copy "Wired in Phase 3"**
- Card-click analytics stub approach → **Recommend declarative `data-event="card:open"` + `data-product-id="..."` attributes, NO inline JS in Phase 2** (Phase 3 reads them with one delegated listener)

### Deferred Ideas (OUT OF SCOPE for Phase 2)

- PostHog browser SDK installation → Phase 3 (ANALYTICS-01)
- PostHog Surveys form widget rendering → Phase 3 (DEMAND-01)
- Real form `action` URL + submit handler → Phase 3
- `astro-mermaid` integration + actual Mermaid rendering → Phase 4 (DIAGRAM-01..05)
- `@astrojs/sitemap` → Phase 4 polish
- OG image generation → Phase 4 polish
- Custom 404 page → Phase 4 polish
- Lighthouse perf optimization → Phase 4
- External cold-read review → Phase 4 (VISUAL-05)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TECH-02 | Content collection + Zod schema with discriminated `cta` union; reserved blog schema | § Standard Stack (Astro content layer), § Architecture Patterns (Pattern 1: Content Collection Contract) |
| TECH-03 | Component directory layout: `sections/`, `cards/`, `forms/`, `diagrams/`, plus existing `global/` | § Architecture Patterns (Pattern 2: Component Layout) |
| TECH-04 | `pages/index.astro` is composition-only — no business logic, no inline data | § Architecture Patterns (Pattern 3: Composition-only Page) |
| CONTENT-01 | Hero with falsifiable sub-line | § Code Examples (Hero structure) |
| CONTENT-02 | 250–400w "What is agentic AI" educational section with contrast element | § Code Examples (Explainer + contrast table) |
| CONTENT-03 | 6-card grid, equal visual footprint, narrative order | § Architecture Patterns (Pattern 4: Card Grid Layout) |
| CONTENT-04 | Stage badges Shipping / Probe / Sibling | § Code Examples (Stage Badge), § Architecture Patterns (Pattern 5: Badge Variants) |
| CONTENT-05 | Whole-card clickable; analytics events stubbed (`card:open`, `card:cta_external_click`) | § Architecture Patterns (Pattern 6: Block-Link Card), § Don't Hand-Roll (analytics stub) |
| CONTENT-06 | "Tell us a problem we should solve" section with form-shaped placeholder | § Architecture Patterns (Pattern 7: Form Placeholder) |
| CONTENT-07 | Footer: docs / contact email / copyright / GitHub | Already shipped Phase 1 — § Component Inventory confirms no changes needed |
| CONTENT-08 | Honesty audit — no testimonials/metrics/superlatives | § Common Pitfalls (Pitfall 4: voice creep), § Honesty Audit Checklist |
| CONTENT-09 | Per-concept landing pages at `/products/[slug]` rendered by one dynamic-route template | § Architecture Patterns (Pattern 8: Dynamic Route), § Code Examples (`[slug].astro`) |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Product data validation (schema enforcement) | Build (Astro content layer + Zod) | — | Static product list with no runtime mutation; Zod runs at `astro build` time and produces TypeScript types; validation failures fail the build, not a runtime request |
| Markdown → HTML rendering | Build (Astro content layer) | — | `await render(entry)` produces a `<Content />` component that compiles at build; same reasoning as above |
| Page composition (index + product pages) | Build (Astro SSG) | — | All routes prerender to static HTML — `output: 'static'` is locked Phase 1 |
| Click-to-navigate (concept cards) | Browser (native `<a href>` navigation) | — | Standard same-origin link; no JS required for the click itself |
| Click-to-navigate (buggerd external) | Browser (`<a href target=_blank>`) | — | External link with `rel="noopener"` (defense in depth); no JS needed |
| Analytics event capture | Phase 3 (browser, PostHog) | — | Phase 2 ships `data-event` attribute markup only; runtime listener attaches in Phase 3 |
| Mobile nav toggle | Browser (existing Nav.astro `<script>`) | — | Already shipped Phase 1 — no Phase 2 change |
| Diagram rendering | Phase 4 (browser, lazy `import('mermaid')`) | — | Phase 2 ships only a placeholder `<MermaidDiagram>` component shell (or a static "Diagram coming in Phase 4" notice) |

## Standard Stack

### Core (already installed Phase 1 — no change in Phase 2)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `^6.1.10` | Static site generator + content layer + page routing | Content collections are first-party in Astro 6; the content layer + Zod integration is the canonical pattern for typed Markdown content [VERIFIED: docs.astro.build/en/guides/content-collections] |
| `tailwindcss` + `@tailwindcss/vite` | `^4.2.4` | Utility-first styling | Locked Phase 1; CSS-first `@theme` block in `src/styles/global.css` already drives the palette |
| `typescript` | `^5.9.3` strict | Type safety | Astro 6 scaffold default; `astro check` runs in CI |
| `@astrojs/check` | `^0.9.9` | Type checker for `.astro` files | Already installed Phase 1 |

### To Add in Phase 2

**None.** Phase 2 ships entirely with the Phase 1 dependency set. Specifically:

- `@astrojs/mdx` is **NOT** added (see § Don't Hand-Roll). Plain `.md` files work in content collections without it [VERIFIED: docs.astro.build/en/guides/markdown-content/].
- `@astrojs/sitemap` is deferred to Phase 4 polish per the existing deferred list.
- `posthog-js` is deferred to Phase 3.
- `astro-mermaid` + `mermaid` are deferred to Phase 4.

This contradicts a sentence in the orchestrator's "Stack snapshot from Phase 1" prompt that said *"Phase 2 must add: @astrojs/mdx"*. **Recommendation: do not add it.** Justification under § Don't Hand-Roll. The planner should treat the orchestrator note as a soft suggestion, not a locked decision — REQUIREMENTS.md TECH-02 only mandates "Markdown file per product," and ROADMAP.md does not require MDX. CLAUDE.md does say "install MDX now to avoid re-platforming when blog ships," but that's a v1 forward-compat argument, not a Phase 2 requirement; the cost of waiting until BLOG-01 ships is one `npm install` line. Flag as decision for the planner to confirm.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Build-time content collections | Live content collections (new in Astro 6) | Live collections fetch at runtime — useful for CMS-backed data with frequent updates, but our 6 products are static markdown files. Build-time wins on perf, caching, and zero runtime cost. [VERIFIED: astro.build/blog/live-content-collections-deep-dive] |
| Plain `.md` files | `.mdx` files (with `@astrojs/mdx`) | MDX lets us embed Astro components inside Markdown bodies (e.g. `<InterestForm productId={frontmatter.slug} />`). For Phase 2 the form lives **outside** the Markdown body as a sibling component on the page (per CONTENT-09 + DEMAND-01), so MDX buys nothing. Adding it later is one dependency install. |
| Heydon Pickering pseudo-element block-link pattern | Wrapping the entire card in `<a>` | Wrapping concatenates all child text into one screen-reader announcement (verbose) and can place block elements inside an inline anchor (HTML5 allows it but is unconventional); the pseudo-element pattern keeps the heading-link as the announced label. [CITED: inclusive-components.design/cards] |
| Disabled-submit form placeholder | "Coming soon" static `<div>` with no form markup | A real `<form>` with disabled submit lets us validate the structural HTML now (label associations, fieldset legends, focus order) and lets cold-read reviewers confirm the form *exists* — a static div doesn't deliver that signal. |

**Installation:**

No new packages in Phase 2. To verify nothing is incidentally added:

```bash
# After Phase 2 work completes:
diff <(git show main:package.json) package.json
# Expect: empty diff, OR only stylistic/script changes — no new dependencies
```

**Version verification command** (run during Wave 0 to re-confirm — versions drift):

```bash
npm view astro version             # Expect ^6.1.x or higher
npm view @astrojs/mdx version      # If we DO end up adding MDX: 5.0.4 as of 2026-04-29
npm view @astrojs/sitemap version  # 3.7.2 — when added in Phase 4
```

[VERIFIED: `npm view` 2026-04-29 — astro@6.2.1 latest, @astrojs/mdx@5.0.4 with peer `astro: ^6.0.0` — the earlier @astrojs/mdx@5.0.0 peer-dep bug (alpha pin) is fixed in 5.0.4]

## Architecture Patterns

### System Architecture Diagram

```
                                  ┌──────────────────────────────────┐
                                  │      src/content/products/       │
                                  │  buggerd.md    delegate.md       │
                                  │  triage-router-bot.md   ...      │
                                  └─────────────┬────────────────────┘
                                                │
                                          glob('**/*.md')
                                                │
                                                ▼
                                  ┌──────────────────────────────────┐
                                  │   src/content.config.ts          │
                                  │   - defineCollection(products)   │
                                  │   - Zod schema with z.discrimin- │
                                  │     atedUnion('type', [...])     │
                                  │     for cta field                │
                                  │   - empty blog collection        │
                                  └─────────────┬────────────────────┘
                                                │
                            ┌───────────────────┴────────────────────┐
                            │                                        │
                            │ getCollection('products')              │
                            │                                        │
                            ▼                                        ▼
   ┌─────────────────────────────────────┐    ┌─────────────────────────────────────┐
   │       pages/index.astro             │    │   pages/products/[slug].astro       │
   │  (composition-only, TECH-04)        │    │   (single dynamic template)         │
   │                                     │    │                                     │
   │   <Base>                            │    │   getStaticPaths():                 │
   │     <Nav />                         │    │     filter products where           │
   │     <Hero />                        │    │       cta.type === 'interest'       │
   │     <AgenticAIExplainer />          │    │     → params: { slug }              │
   │     <ProductGrid                    │    │                                     │
   │       products={getCollection(...)} │    │   const { Content } = await         │
   │     />                              │    │     render(entry)                   │
   │     <ProblemPitchSection />         │    │                                     │
   │     <Footer />                      │    │   <Base>                            │
   │   </Base>                           │    │     <Nav />                         │
   │                                     │    │     <h1>{frontmatter.headline}</h1> │
   │                                     │    │     <Content />                     │
   │                                     │    │     <InterestForm                   │
   │                                     │    │       productId={entry.id} />       │
   │                                     │    │     <a href="/">Back to home</a>    │
   │                                     │    │     <Footer />                      │
   │                                     │    │   </Base>                           │
   └─────────────────────────────────────┘    └─────────────────────────────────────┘
                            │                                        │
                            ▼                                        ▼
                    Browser navigates from index ProductCard         Browser renders product detail page
                      - buggerd card  → buggerd.com (target=_blank)  Per-card form embedded (placeholder Phase 2,
                      - others        → /products/[slug]              wired Phase 3)
```

### Recommended Project Structure

```
src/
├── content.config.ts             # Astro 6 content collection schema (NEW)
├── content/
│   └── products/
│       ├── buggerd.md            # cta: { type: 'external', url: 'https://buggerd.com' }
│       ├── scientific-paper-agent.md   # cta: { type: 'interest' }
│       ├── triage-router-bot.md
│       ├── recorder-extractor.md
│       ├── agentic-employees.md
│       └── delegate.md
├── components/
│   ├── global/                   # Existing Phase 1
│   │   ├── Nav.astro
│   │   └── Footer.astro
│   ├── sections/                 # NEW — TECH-03
│   │   ├── Hero.astro
│   │   ├── AgenticAIExplainer.astro
│   │   ├── ProductGrid.astro
│   │   └── ProblemPitchSection.astro
│   ├── cards/                    # NEW — TECH-03
│   │   └── ProductCard.astro
│   ├── forms/                    # NEW — TECH-03 (placeholders only in Phase 2)
│   │   ├── InterestForm.astro
│   │   └── ProblemPitchForm.astro
│   └── diagrams/                 # NEW — TECH-03 (placeholder shell only in Phase 2)
│       └── MermaidDiagram.astro
├── layouts/
│   └── Base.astro                # Existing Phase 1
├── pages/
│   ├── index.astro               # Phase 2 replaces "coming soon" placeholder
│   └── products/
│       └── [slug].astro          # NEW — CONTENT-09
└── styles/
    └── global.css                # Existing Phase 1 — no changes Phase 2
```

### Pattern 1: Content Collection Contract (TECH-02)

**What:** Single content collection `products` with Zod-validated frontmatter and discriminated `cta` union; companion `blog` collection reserved as empty schema.

**When to use:** This is the load-bearing pattern for Phase 2 — every product card and every detail page is keyed off it.

**Example** [VERIFIED: docs.astro.build/en/guides/content-collections + docs.astro.build/en/guides/upgrade-to/v6/]:

```typescript
// src/content.config.ts
// IMPORTANT: file is at src/content.config.ts (Astro 6) — NOT src/content/config.ts (legacy, removed)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';   // NOT 'astro:content' — z was removed from astro:content in v6

const stage = z.enum(['Shipping', 'Probe', 'Sibling']);

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),                  // "buggerd", "Scientific paper agent", ...
    tagline: z.string(),               // 1-line card description (placeholder OK in Phase 2)
    stage,                             // 'Shipping' | 'Probe' | 'Sibling'
    order: z.number(),                 // 1..6 — controls narrative order on the grid
    cta: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('external'),
        url: z.string().url(),         // e.g. 'https://buggerd.com'
        label: z.string().default('Visit'),
      }),
      z.object({
        type: z.literal('interest'),
        // No url — destination is computed as `/products/${entry.id}` in templates
        label: z.string().default('Tell us'),
      }),
    ]),
    headline: z.string(),              // h1 for the /products/[slug] page (separate from card name)
  }),
});

// Reserve blog collection so v2 ships without re-platform — ROADMAP Phase 2 SC#4
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { products, blog };
```

**Key gotchas the planner must lock into acceptance criteria:**

1. **File path:** `src/content.config.ts`. NOT `src/content/config.ts`. ROADMAP.md and REQUIREMENTS.md TECH-02 currently say `src/content/config.ts` — this is a documentation drift; the planner should write the correct path into the plan task and add a "fix REQUIREMENTS.md path" follow-up to the plan or punt it as a doc-fix follow-up.
2. **Zod import:** `from 'astro/zod'` — NOT `from 'astro:content'`. Astro 6 deprecated `z` from `astro:content` [VERIFIED: docs.astro.build/en/guides/upgrade-to/v6/].
3. **`z.discriminatedUnion` requires the discriminator to be a `z.literal(...)`** — `z.string()` would silently fall through. The planner should write a dedicated negative-test acceptance criterion: a malformed product file (e.g., `cta: { type: 'foo' }`) MUST cause `astro build` to fail with a Zod error; demonstrate this once during plan execution and revert.
4. **`order` field over filesystem ordering:** filesystem glob order is stable but not semantically meaningful; sort `getCollection('products')` by `data.order` in `ProductGrid.astro` so a future product reorder is one-line frontmatter change.

### Pattern 2: Component Layout (TECH-03)

Already documented in § Recommended Project Structure above. The TECH-03 spec is exhaustive — no extra components or directories. The planner should write a single Wave 0 task that creates the empty directories and an `index` README to commit them (or just creates them as side-effects of the first component file landing in each).

### Pattern 3: Composition-only Index Page (TECH-04)

**What:** `pages/index.astro` imports section components and the data hook for products; the page-level frontmatter is the *only* place `getCollection('products')` is called (passed down to `ProductGrid` as a prop).

**When to use:** This is a hard rule — TECH-04 success criterion #4 says "zero business logic, zero inline data."

**Example:**

```astro
---
// pages/index.astro
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Nav from '../components/global/Nav.astro';
import Footer from '../components/global/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import AgenticAIExplainer from '../components/sections/AgenticAIExplainer.astro';
import ProductGrid from '../components/sections/ProductGrid.astro';
import ProblemPitchSection from '../components/sections/ProblemPitchSection.astro';

// Sort by `order` field; Zod schema guarantees `order` is a number
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

**The single business-logic concession:** `(await getCollection('products')).sort(...)` is data marshaling, not business logic. The planner can either accept this in `index.astro` or push the sort into `ProductGrid`'s prop processing — recommended to keep the sort in `index.astro` so `ProductGrid` is a pure presentational component (one hop from data → DOM).

### Pattern 4: Card Grid Layout (CONTENT-03)

**What:** Six-card responsive grid with equal visual footprint; the grid section is wider than the surrounding essay-narrow chrome.

**When to use:** The grid is the visual centerpiece — cards must look identical at all breakpoints.

**Example:**

```astro
---
// src/components/sections/ProductGrid.astro
import type { CollectionEntry } from 'astro:content';
import ProductCard from '../cards/ProductCard.astro';

interface Props {
  products: CollectionEntry<'products'>[];
}
const { products } = Astro.props;
---

<section id="products" class="border-t border-muted/20 py-20 md:py-24">
  <div class="max-w-6xl mx-auto px-6">
    <p class="text-sm uppercase tracking-widest text-muted">[Eyebrow — Products]</p>
    <h2 class="font-display text-3xl md:text-4xl mt-4 text-fg">
      [Six bets, one shipping. Click to vote with your email.]
    </h2>
    <ul class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <li class="contents">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  </div>
</section>
```

**Decisions baked in:**

- **`max-w-6xl` for the grid section only.** Hero, explainer, and problem-pitch use `max-w-3xl` (essay-narrow per Sketch B). The grid breaks out to give 3-up cards enough room at lg.
- **Breakpoints**: 1 col at `<md` (mobile), 2 col at `md` (tablet, ~768px), 3 col at `lg` (desktop, ~1024px). At `lg` this gives 3×2 — visually balanced for 6 cards.
- **`<ul>` semantics**: cards are a list of products; screen readers announce "list with 6 items." [CITED: inclusive-components.design/cards recommends list semantics for card grids.]
- **`class="contents"` on the `<li>`**: lets the `<li>` participate in the parent grid layout without itself being a grid item with intrinsic styling. Tailwind 4 supports this via the `contents` utility.

### Pattern 5: Stage Badge Variants Within the Locked Palette (CONTENT-04)

**What:** Three visually distinct stage labels (`Shipping`, `Probe`, `Sibling`) using only the four locked colors (`bg`, `fg`, `muted`, `accent`).

**When to use:** Every card. The visual distinction is essential — readers must see at a glance which products are real vs. probes vs. siblings.

**Recommended hierarchy (3 tiers of visual weight):**

| Stage | Visual treatment | Tailwind classes (illustrative) | Why this tier |
|-------|------------------|--------------------------------|---------------|
| `Shipping` | **Filled accent** — solid `bg-accent` background, `text-bg` text (white-ish on indigo) | `bg-accent text-bg px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-sm` | Highest visual weight — buggerd is the only shipping product, the badge should pop |
| `Probe` | **Outline accent** — `border border-accent/40` + `text-accent` text on transparent | `border border-accent/40 text-accent px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-sm` | Medium weight — there are 4 probes; outline keeps the page calm while still using accent |
| `Sibling` | **Muted text-only** — `text-muted` micro caps, no border, no fill | `text-muted px-1 text-xs uppercase tracking-wider font-semibold` | Lowest weight — Delegate is sibling, not a JigSpec product; muted treatment communicates "related but separate" |

This uses **opacity stops on the locked accent** for the Probe outline (`/40`) which Tailwind 4 supports natively — no new palette colors introduced. **Confidence MEDIUM-HIGH** on the visual treatment (taste-driven within the constraint); **HIGH** on the implementation pattern.

### Pattern 6: Block-Link Card (CONTENT-05) — THE Heydon Pickering Pattern

**What:** Whole card surface is clickable, but the markup uses a heading-wrapped anchor + a stretching pseudo-element. Body text remains selectable; screen readers announce only the heading text as the link label.

**When to use:** Every `ProductCard.astro`. Required by CONTENT-05.

**Example** [CITED: inclusive-components.design/cards]:

```astro
---
// src/components/cards/ProductCard.astro
import type { CollectionEntry } from 'astro:content';
import StageBadge from './StageBadge.astro';   // Or inline; small enough either way

interface Props {
  product: CollectionEntry<'products'>;
}
const { product } = Astro.props;
const { name, tagline, stage, cta } = product.data;

// Discriminated union: TypeScript narrows cta.url vs no-url
const href = cta.type === 'external' ? cta.url : `/products/${product.id}`;
const isExternal = cta.type === 'external';
const eventName = isExternal ? 'card:cta_external_click' : 'card:open';
---

<article class="group relative flex flex-col h-full p-6 border border-muted/20 rounded-md transition-colors hover:border-accent/60 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
  <header class="flex items-baseline justify-between gap-3">
    <h3 class="font-display text-2xl tracking-tight text-fg">
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        data-event={eventName}
        data-product-id={product.id}
        class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
      >
        {name}
      </a>
    </h3>
    <StageBadge stage={stage} />
  </header>
  <p class="mt-3 text-muted">{tagline}</p>
  <footer class="mt-auto pt-4 text-sm text-accent">
    {isExternal ? `Visit ${new URL(cta.url).hostname} →` : 'Tell us →'}
  </footer>
</article>
```

**Why this is correct:**

1. **Heading-wrapped anchor** = the anchor's accessible label is just `{name}` (e.g. "buggerd"), not the whole card body (which would announce as "buggerd Shipping Auto-fixes failing CI Visit buggerd.com").
2. **`after:absolute after:inset-0`** = pseudo-element stretches across the card (parent has `relative`). Whole surface is clickable.
3. **`focus-within:ring-2`** on the parent = the anchor focus state is visible on the entire card border, not just on the heading text — solves the "where am I" problem when a keyboard user tabs to it.
4. **`focus:outline-none`** on the anchor = the focus ring is moved to the parent (otherwise you get a double ring around the heading text). The visible focus indicator is the parent's ring.
5. **`data-event` + `data-product-id`** = Phase 3 PostHog wiring is one delegated listener (`document.addEventListener('click', ...)`), zero changes to this component.
6. **Text selection** = body text (`<p>`) can still be selected because it's *behind* the pseudo-element, but the pseudo-element's `inset-0` only triggers click events on whitespace — selection inside the `<p>` works because the user's mousedown originates inside the text node, not on the pseudo-element. (Heydon's note about the JS timing trick applies only when text is *fully* covered by the pseudo-element; in our card, padding around the text means selection works fine.)

**Edge case warning:** if a *secondary* link is added to the card body later (e.g. an inline "learn more" link), it must use `position: relative` (`class="relative"` in Tailwind) to escape the pseudo-element overlay. CONTENT-05 doesn't require any secondary links, so we don't need to plan for this — but the planner should add a verification criterion: the rendered card has exactly one anchor element.

### Pattern 7: Form-Shaped Placeholder (CONTENT-06, CONTENT-09 form portion)

**What:** A real `<form>` with proper labels, no `action`, no `method`, and a disabled submit button labeled with the Phase-3 wiring promise. Cold-readers can confirm the form exists; no actual submission happens; Phase 3 changes only the `action`/handler/button-text and the form is wired.

**Example:**

```astro
---
// src/components/forms/InterestForm.astro
interface Props {
  productId: string;
}
const { productId } = Astro.props;
---

<form
  class="mt-12 max-w-xl border border-muted/20 rounded-md p-6"
  data-form="interest"
  data-product-id={productId}
  aria-labelledby={`interest-${productId}-legend`}
>
  <p id={`interest-${productId}-legend`} class="font-display text-xl tracking-tight text-fg">
    Tell us you'd use this
  </p>
  <p class="mt-2 text-sm text-muted">
    [Placeholder copy — replace in Phase 3 when PostHog Surveys wires up.]
  </p>

  <div class="mt-6">
    <label for={`interest-${productId}-email`} class="block text-sm font-medium text-fg">
      Email
    </label>
    <input
      id={`interest-${productId}-email`}
      type="email"
      name="email"
      required
      disabled
      class="mt-1 w-full px-3 py-2 border border-muted/30 rounded text-fg disabled:bg-muted/5 disabled:cursor-not-allowed"
      placeholder="you@example.com"
    />
  </div>

  <div class="mt-4">
    <label for={`interest-${productId}-context`} class="block text-sm font-medium text-fg">
      What would you use this for? (one or two sentences)
    </label>
    <textarea
      id={`interest-${productId}-context`}
      name="context"
      rows="3"
      required
      disabled
      class="mt-1 w-full px-3 py-2 border border-muted/30 rounded text-fg disabled:bg-muted/5 disabled:cursor-not-allowed"
    ></textarea>
  </div>

  <button
    type="submit"
    disabled
    class="mt-6 px-4 py-2 bg-accent text-bg font-medium rounded disabled:bg-muted/30 disabled:cursor-not-allowed"
  >
    Wired in Phase 3
  </button>
</form>
```

**Why this shape:**

- **Real `<label>` + `for=` association** = accessibility audit passes now (Phase 4 won't have to add anything).
- **`required` + `disabled`** on inputs = visually communicates "this is a real form" without permitting submission. `disabled` removes the input from form submission and tab order; `required` doesn't fire because submission is disabled.
- **No `action`** = if a user somehow enables the button (devtools), the default form submission goes nowhere (same-origin no-op). No data leak risk.
- **`data-form="interest"` + `data-product-id={productId}`** = Phase 3 wiring hook (one delegated listener). Zero changes to this component beyond removing `disabled` and the placeholder copy.
- **Disabled button copy `Wired in Phase 3`** = explicit phase-boundary signal; cold-readers don't ask "is this form broken?"

The `ProblemPitchForm.astro` follows the same shape with one textarea field for the problem description and one email field, no `productId`.

### Pattern 8: Dynamic Route Template (CONTENT-09)

**What:** Single `pages/products/[slug].astro` template renders one page per concept-stage product (5 pages total — buggerd is excluded because its CTA is `external`).

**Example** [VERIFIED: docs.astro.build/en/guides/content-collections + docs.astro.build/en/guides/upgrade-to/v6/]:

```astro
---
// pages/products/[slug].astro
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import Base from '../../layouts/Base.astro';
import Nav from '../../components/global/Nav.astro';
import Footer from '../../components/global/Footer.astro';
import InterestForm from '../../components/forms/InterestForm.astro';

export const getStaticPaths = (async () => {
  const products = await getCollection('products');
  return products
    .filter((p) => p.data.cta.type === 'interest')   // Excludes buggerd
    .map((product) => ({
      params: { slug: product.id },
      props: { product },
    }));
}) satisfies GetStaticPaths;

const { product } = Astro.props;
const { Content } = await render(product);   // Astro 6 API — NOT product.render()
---

<Base
  title={`${product.data.name} — JigSpec`}
  description={product.data.tagline}
>
  <Nav />
  <main class="flex-1">
    <article class="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p class="text-sm uppercase tracking-widest text-accent">{product.data.stage}</p>
      <h1 class="font-display text-4xl md:text-5xl tracking-tight text-fg mt-4">
        {product.data.headline}
      </h1>
      <div class="mt-8 prose prose-zinc max-w-none">
        <Content />
      </div>
      <InterestForm productId={product.id} />
      <a href="/" class="mt-12 inline-block text-accent hover:underline">
        ← Back to home
      </a>
    </article>
  </main>
  <Footer />
</Base>
```

**Key gotchas:**

1. **`render(product)` not `product.render()`** — Astro 6 changed this. Old-pattern muscle memory will produce a runtime error: `entry.render is not a function`.
2. **`product.id` vs. `product.slug`** — Astro 6 entries have `.id` (the file basename minus extension); `.slug` was removed in v5. Use `params: { slug: product.id }`.
3. **`prose` Tailwind utility** — comes from `@tailwindcss/typography`. **NOT installed in Phase 1.** The planner has two choices: (a) install `@tailwindcss/typography` plugin in Phase 2 (one extra dep), or (b) hand-style the rendered Markdown with a few utilities. Recommend (b) for Phase 2 — Markdown bodies are 200–400 words; bare `<p>`, `<h2>`, `<h3>` styling can be done in `[slug].astro`'s wrapper div with a few utilities. Adding Typography plugin is a Phase 4 polish concern. Flag for planner decision.
4. **Buggerd has no detail page** — by design (CONTENT-09 explicit). The `getStaticPaths` filter (`cta.type === 'interest'`) makes this a build-time guarantee. If buggerd's frontmatter ever changes to `interest`, a detail page appears automatically; the converse is also automatic. This is the *correct* coupling.

### Anti-Patterns to Avoid

- **Wrapping the entire `<article>` in an `<a>`:** screen readers announce all child text as the link label. Use the heading-anchor + pseudo-element pattern instead. [CITED: inclusive-components.design/cards]
- **`onclick` handlers on `<div>`s as the click target:** breaks keyboard navigation, breaks middle-click-to-open-in-new-tab, breaks Cmd-click. Always use `<a href>`.
- **Inline `style` attributes in components:** use Tailwind utilities; Tailwind 4's compile-time extraction means inline styles defeat the optimization. (Two exceptions allowed: dynamic computed values that can't be expressed in utilities, e.g., `style={`grid-template-columns: repeat(${n}, 1fr)`}` — but Phase 2 has no such case.)
- **Calling `getCollection('products')` from anywhere except `pages/index.astro` and `pages/products/[slug].astro`:** TECH-04 forbids business logic in components. ProductGrid, ProductCard, etc. receive `products` (or `product`) as props.
- **Using `entry.slug`:** removed in Astro 5/6. Use `entry.id`.
- **Importing `z` from `astro:content`:** removed in Astro 6. Import from `astro/zod`.
- **Defining the config at `src/content/config.ts`:** removed in Astro 6. Use `src/content.config.ts`. (Legacy `legacy.collectionsBackwardsCompat` flag exists but is a temporary migration aid — don't use it for new code.)
- **Adding `@astrojs/mdx`:** Phase 2 doesn't need it. See § Don't Hand-Roll.
- **Inline JS for analytics events in Phase 2:** every `addEventListener('click', () => posthog.capture(...))` written now will need to be deleted in Phase 3 when the typed `analytics.ts` wrapper lands. Use `data-event` + `data-product-id` attributes only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown frontmatter parsing | Manual `gray-matter` + filesystem reads | `defineCollection` + `glob` loader | Astro content layer handles frontmatter, validates with Zod, generates TS types, caches between builds [VERIFIED: docs.astro.build/en/guides/content-collections] |
| Frontmatter type definitions | Hand-written `interface ProductFrontmatter` | Zod schema + `CollectionEntry<'products'>` inferred type | Schema drift is a real bug class; Zod-derived types are auto-synced [VERIFIED: same] |
| Dynamic-route slug generation | Manual filesystem walking + URL building | `getStaticPaths` over `getCollection(...)` | Astro builds the routes, handles URL encoding, fails the build on duplicate slugs [VERIFIED: docs.astro.build/en/guides/routing] |
| MDX integration in Phase 2 | Install `@astrojs/mdx` "for future" | Plain `.md` files; install MDX in Phase 6 (BLOG-01) when actually needed | The Phase 2 form lives outside the Markdown body (DEMAND-01: "embedded on each `/products/[slug]` page" means as a sibling component, not inside the Markdown). Adding MDX now: extra peer dep, Vite plugin slot, build-time MDX transform, ~3MB node_modules. Adding it in Phase 6: one `npm install`, one config line, zero refactor of Phase 2 work. [VERIFIED: docs.astro.build/en/guides/markdown-content/ — plain Markdown works in collections without MDX] |
| Whole-card click via JS handler | `onclick` on `<div>` | Heading anchor + `::after` pseudo-element | Native `<a>` preserves middle-click, Cmd-click, hover-preview-URL, keyboard nav, screen-reader announcement. JS handler reimplements all four poorly. [CITED: inclusive-components.design/cards] |
| Phase 2 analytics stub | Console-log inside `<script>` block on each card | `data-event` + `data-product-id` attributes (no JS in Phase 2) | Phase 3 attaches one delegated `document.addEventListener('click', ...)` that reads the attributes. Zero per-card script tags, zero refactor of Phase 2 cards when Phase 3 lands. |
| Stage badge component | Inline conditional `{stage === 'Shipping' ? <span>...</span> : ...}` repeated per card | One `StageBadge.astro` component receiving `stage` prop | Three visual variants in three places (card, detail page header, possibly Phase 4 OG image) — single source of truth |
| Form submission stub | `<form action="javascript:void(0)">` or `onsubmit="return false"` | Disabled inputs + disabled submit + no `action` attribute | `disabled` is the canonical "this control is intentionally inert" signal — keyboard tab skips it, screen reader announces "disabled," no devtools workaround risk |

**Key insight:** Every line of code Phase 2 writes that Phase 3 or Phase 4 must edit-or-delete is a leak. The single consistent rule: **declarative-attributes-now, runtime-behavior-later**. The `data-event="card:open"` pattern is the cleanest expression of this rule. The disabled-form pattern is the second cleanest.

## Common Pitfalls

### Pitfall 1: Astro 5/6 Content Collection API drift
**What goes wrong:** Plan author writes `import { z } from 'astro:content'` (works in Astro 4) or `entry.render()` (works in Astro 4) and the build fails with cryptic errors.
**Why it happens:** Training data + community blog posts + StackOverflow answers are dominated by Astro 4-era examples. Astro 5 (Dec 2024) changed `z` to `astro/zod` and `entry.render()` to `await render(entry)`; Astro 6 (March 2026) made these breaking — the legacy paths are removed.
**How to avoid:** Pin acceptance criteria to the Astro 6 API: imports must be `import { z } from 'astro/zod'` and rendering must be `await render(entry)`. The planner should add a grep verification: `grep -r "from 'astro:content'" src/ | grep -v "import {"` should return clean (no `z` lingering); `grep -r "entry.render(" src/` should return zero matches.
**Warning signs:** Build errors mentioning "z is not exported" or "render is not a function on type CollectionEntry."

### Pitfall 2: Config file at `src/content/config.ts`
**What goes wrong:** The collection isn't picked up; `getCollection('products')` returns `[]`; pages 404.
**Why it happens:** Astro 6 moved the config to `src/content.config.ts`. ROADMAP.md and REQUIREMENTS.md TECH-02 still say `src/content/config.ts` — that's documentation drift in our own project from before we picked Astro 6.
**How to avoid:** Plan task explicitly creates `src/content.config.ts` (not `src/content/config.ts`). Verify: `ls src/content.config.ts` exists, `ls src/content/config.ts` does NOT exist (legacy file would silently be ignored in Astro 6 stable but is forbidden in our setup). Add a follow-up doc-fix task to update REQUIREMENTS.md and ROADMAP.md, OR accept the drift and let the SUMMARY note it.
**Warning signs:** `getCollection('products')` returns empty array at build time despite Markdown files existing under `src/content/products/`.

### Pitfall 3: Discriminated union without literal discriminator
**What goes wrong:** Plan author writes `cta: z.object({ type: z.string(), url: z.string().optional() })` instead of a true discriminated union. TypeScript narrowing breaks; templates have to nullcheck `cta.url` everywhere; `cta.url` for `interest`-type cards becomes a runtime concern when Zod should make it impossible at the type level.
**Why it happens:** `z.discriminatedUnion` syntax is less ergonomic than plain `z.object`; copy-paste-from-blog laziness.
**How to avoid:** Use `z.discriminatedUnion('type', [z.object({type: z.literal('external'), ...}), z.object({type: z.literal('interest'), ...})])`. Verify by intentionally writing a malformed product file and confirming `astro build` fails with a Zod validation error. Add a TypeScript check: `if (cta.type === 'external') cta.url` should narrow without a `?` or non-null assertion.
**Warning signs:** TS errors of the form "Property 'url' does not exist on type" requiring `?` chaining or `as` casts in templates.

### Pitfall 4: Voice-creep into superlatives
**What goes wrong:** Bracketed-placeholder copy gets replaced with phrases like "industry-leading reliability," "trusted by hundreds of teams," "the only agentic AI that actually ships." CONTENT-08 violation.
**Why it happens:** Marketing-copy training data is saturated with these patterns; Claude generating placeholder text "naturally" reaches for them; the bracketed-placeholder convention provides cover ("it's just a placeholder, I'll fix it later") that delays the audit until late.
**How to avoid:** Add a CI grep step (or a manual checklist in the SUMMARY) that searches for forbidden phrases. Concrete blocklist (case-insensitive): `industry-leading|trusted by|fortune 500|enterprise-grade|world-class|cutting-edge|revolutionary|game-changing|unparalleled|best-in-class`. Run as part of `astro check` or as a separate npm script `npm run honesty-audit`. Run on every Phase 2 plan completion. Phase 4 polish revisits this with the cold-read review.
**Warning signs:** Any superlative without a falsifiable concrete claim attached. Example fail: "the most reliable agentic AI." Example pass: "agents that pass your existing CI before they ship a change."

### Pitfall 5: Card grid widening collides with essay-narrow chrome
**What goes wrong:** Hero is `max-w-3xl` (essay narrow, ~768px wide), explainer is `max-w-3xl`, then the 6-card grid is `max-w-6xl` (~1152px). The visual jump from narrow → wide → narrow creates a "spread" pattern that can feel inconsistent if the section transitions aren't deliberate.
**Why it happens:** Essay-narrow looks great for prose but kills card grids — at 768px wide a 3-up grid gives each card ~250px width which is too cramped for headline + tagline + badge.
**How to avoid:** The grid section MUST have a clear section break — top + bottom borders (`border-t border-muted/20`), an eyebrow label ("Products"), and a section heading. The width change becomes a deliberate editorial gesture rather than an accidental layout drift. Alternative considered and rejected: keep everything `max-w-3xl` and use a 2×3 grid — too vertical, dilutes the "six bets" visual density.
**Warning signs:** Cold-read reviewer comments "the page feels like two different layouts mashed together." Mitigated by deliberate section transitions.

### Pitfall 6: Tailwind 4 arbitrary-class footgun on `var(--font-display)`
**What goes wrong:** Plan author writes `font-[var(--font-display)]` (arbitrary class). Tailwind 4 in `--single-pass` mode may not extract this if the variable isn't statically resolvable. The element renders in body font.
**Why it happens:** Phase 1 SUMMARY (01-04) flags this exact issue. Tailwind 4's compile-time extraction prefers named utilities (`font-display`) over arbitrary forms.
**How to avoid:** Use named utilities. The Phase 1 `@theme` block defines `--font-display`, which Tailwind 4 statically extracts into a `font-display` utility. Use `class="font-display"`, NOT `class="font-[var(--font-display)]"`. Same rule for `text-fg`, `bg-bg`, `text-accent`, `text-muted`, `border-muted/20` — all of which work because they're named utilities derived from `@theme`.
**Warning signs:** Component renders in Inter when it should be in Crimson Pro. Visual regression detectable by side-by-side screenshot comparison.

### Pitfall 7: The 6-card detail-page asymmetry (5 pages, not 6)
**What goes wrong:** Plan author writes `getStaticPaths` returning all 6 products. The build generates `/products/buggerd` page — which contradicts CONTENT-09 ("Buggerd has no such page on this site").
**Why it happens:** The asymmetry isn't visually obvious — 6 cards on the home page, but only 5 detail pages. It's enforced by the discriminated `cta` union (`external` vs `interest`) but it's easy to miss.
**How to avoid:** `getStaticPaths` filter `.filter(p => p.data.cta.type === 'interest')`. Verify: after `astro build`, `dist/products/` has 5 directories (one per concept), no `dist/products/buggerd/`. Add as plan acceptance criterion.
**Warning signs:** Visiting `/products/buggerd` returns a real page (should 404).

### Pitfall 8: `<form>` submit fires despite disabled button
**What goes wrong:** Plan author writes a working-looking form, removes `disabled` from inputs but leaves it on the button, then user hits Enter inside the email field. Form submits to default `action` (current page URL) — a refresh fires, and if PostHog ever lands and the form isn't re-locked, anonymous data leaks during the gap.
**Why it happens:** A `<form>` with no `action` and no JS will submit to the current URL on Enter-in-text-input. The disabled submit button does NOT prevent this — Enter-submit doesn't trigger the button click handler.
**How to avoid:** Either (a) `disabled` on every input (also blocks Enter-submit because disabled inputs can't be focused or typed in), OR (b) add `<form onsubmit="event.preventDefault(); return false;">`. Recommended: (a) — disabled inputs make the placeholder shape clearer to cold readers. The example in Pattern 7 above uses (a).
**Warning signs:** Pressing Enter in a form field causes a page refresh.

## Code Examples

All patterns in § Architecture Patterns above are copy-paste-ready. The planner should reference the patterns directly in plan task descriptions; here's the consolidated cross-reference:

| Need | Pattern section | Lines |
|------|-----------------|-------|
| `src/content.config.ts` | Pattern 1 | full file |
| `pages/index.astro` (composition only) | Pattern 3 | full file |
| `src/components/sections/ProductGrid.astro` | Pattern 4 | full file |
| Stage badge variants table | Pattern 5 | table |
| `src/components/cards/ProductCard.astro` | Pattern 6 | full file |
| `src/components/forms/InterestForm.astro` | Pattern 7 | full file |
| `pages/products/[slug].astro` | Pattern 8 | full file |

### Hero structure (CONTENT-01)

```astro
---
// src/components/sections/Hero.astro
---
<section class="border-b border-muted/20">
  <div class="max-w-3xl mx-auto px-6 py-24 md:py-32">
    <p class="text-sm uppercase tracking-widest text-accent">[Eyebrow — replace in Phase 2]</p>
    <h1 class="font-display mt-4 text-5xl md:text-6xl leading-tight tracking-tight text-fg">
      [Falsifiable headline — e.g. "Most agentic AI doesn't ship. Here's what we do differently."]
    </h1>
    <p class="mt-6 text-xl italic text-muted">
      [Falsifiable sub-line — e.g. "Agents that pass your existing CI before they ship a change."]
    </p>
  </div>
</section>
```

### Explainer with contrast element (CONTENT-02)

```astro
---
// src/components/sections/AgenticAIExplainer.astro
---
<section id="agentic-ai" class="border-b border-muted/20">
  <div class="max-w-3xl mx-auto px-6 py-20 md:py-24">
    <p class="text-sm uppercase tracking-widest text-muted">[What is agentic AI]</p>
    <h2 class="font-display text-3xl md:text-4xl mt-4 text-fg">
      [Section headline — plain-English working definition]
    </h2>
    <div class="mt-8 space-y-5 text-fg/90 leading-relaxed">
      <p>[Paragraph 1 — what an agent is and isn't, ~80 words]</p>
      <p>[Paragraph 2 — the reliability/autonomy claim, ~80 words]</p>
      <p>[Paragraph 3 — what makes JigSpec's recipe different, ~80 words]</p>
    </div>

    <!-- Contrast element: two-column compare-table per CONTENT-02 -->
    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-muted/30 rounded-md p-6">
      <div>
        <p class="text-sm uppercase tracking-widest text-muted">[A chatbot]</p>
        <p class="mt-2 text-fg">[1-line contrast — what a chatbot does]</p>
      </div>
      <div>
        <p class="text-sm uppercase tracking-widest text-accent">[An agent]</p>
        <p class="mt-2 text-fg">[1-line contrast — what an agent does differently]</p>
      </div>
    </div>
  </div>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `src/content/config.ts` | `src/content.config.ts` | Astro 6.0 (March 2026) | All collections silently fail to load if the legacy path is used; legacy.collectionsBackwardsCompat flag is the temporary migration aid (don't use for new projects). [VERIFIED: docs.astro.build/en/guides/upgrade-to/v6/] |
| `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` | Astro 5.0 → enforced in Astro 6 | TS errors at compile time. [VERIFIED: docs.astro.build/en/guides/upgrade-to/v6/] |
| `await entry.render()` | `await render(entry)` (imported from `astro:content`) | Astro 5.0 → enforced in Astro 6 | Runtime error: "render is not a function". [VERIFIED: docs.astro.build/en/guides/upgrade-to/v6/] |
| `entry.slug` | `entry.id` | Astro 5.0 | URL generation breaks. [VERIFIED: docs.astro.build/en/guides/upgrade-to/v5/] |
| Legacy collections (auto-detect `src/content/`) | Explicit collections via `defineCollection` + `glob` | Astro 5.0 (deprecated) → Astro 6.0 (removed) | If `src/content.config.ts` is missing, no collections exist regardless of `src/content/` contents. [VERIFIED: same] |
| `@astrojs/mdx@^4` (per CLAUDE.md) | `@astrojs/mdx@^5.0.4` (when actually needed) | March 2026 (peer-dep alpha-pin bug fixed in 5.0.4) | CLAUDE.md says `^4`, npm says `5.0.4` is current. CLAUDE.md is stale on this version pin. Not blocking Phase 2 because we're not installing it; flag for Phase 6 (blog) plan. |
| `@astrojs/tailwind` | `@tailwindcss/vite` | Tailwind 4 (early 2025) | Already correct in Phase 1 — no Phase 2 change. |

**Deprecated/outdated to watch in our docs:**

- REQUIREMENTS.md TECH-02 says `src/content/config.ts` — should be `src/content.config.ts`. Drift. Propose doc-fix task in Phase 2 plan or post-Phase 2.
- ROADMAP.md Phase 2 SC#4 says `src/content/config.ts` — same drift. Same fix.
- CLAUDE.md says `@astrojs/mdx@^4` — should be `^5` when adopted. Not Phase 2 blocking.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `prose` Tailwind utility is NOT available in Phase 1 (Phase 1 didn't install `@tailwindcss/typography`) | Pattern 8 | Low — verified by reading package.json. If wrong, the `<Content />` rendering needs hand-styled wrapper utilities (already recommended). |
| A2 | The `class="contents"` Tailwind utility works in Tailwind 4 the same way it did in Tailwind 3 | Pattern 4 | Low — well-known behavior, but I didn't verify against Tailwind 4 docs in this session. If wrong, drop the `<li class="contents">` wrapper and just put cards directly in the `<ul>` with proper grid item styling. |
| A3 | Pseudo-element `::after` block-link approach works alongside `data-event` attributes for click delegation | Pattern 6 | Low-Medium — the click event bubbles from the `::after` (which is part of the anchor's render box) up through the anchor; `event.target` is the anchor. Phase 3 listener can read `data-event` from the anchor or its parent `<article>`. If wrong, Phase 3 just reads `event.target.closest('[data-event]')` which works regardless. |
| A4 | The "Sibling" stage badge rendering as muted text-only is sufficiently distinct from "Probe" | Pattern 5 | Medium — taste-driven within constraint. If cold-readers can't visually distinguish Sibling from Probe, the planner can iterate (e.g., add a small dotted border to Sibling) without changing the schema. |
| A5 | A real `<form>` with all-disabled inputs is the right placeholder shape for cold-read review | Pattern 7 | Medium — UX call. Alternative is a static "Coming soon: drop your email here" div. The disabled-form approach validates the structural HTML now (label/input associations) which the static-div approach defers to Phase 3. If cold-readers find disabled inputs confusing, swap to the static-div approach with a one-component change in Phase 3. |
| A6 | The `data-event` + `data-product-id` declarative pattern is the lowest-coupling Phase 2/3 boundary | § Don't Hand-Roll | Low — Phase 3's typed `analytics.ts` will need a delegated listener regardless; reading from data-attrs vs. having Phase 2 components import the analytics module is strictly less coupling. |
| A7 | Adding `@astrojs/mdx` is not justified by Phase 2 requirements alone | § Standard Stack | Medium — orchestrator prompt suggested adding it; CLAUDE.md says install in v1 for forward-compat. Counter: Phase 2 doesn't need it, the cost of adding it later is one `npm install`, and Phase 2 is supposed to ship the smallest possible diff for cold-read review. The planner can flip this if they want to lock the forward-compat now — note as a discussion point. |
| A8 | Honesty audit can be a grep step, not a CI gate | § Common Pitfalls Pitfall 4 | Low — the grep blocklist is a checklist; running it via `npm run honesty-audit` is sufficient. CI gating is overkill for a marketing site with one writer (Claude). |

## Open Questions

1. **Should `@astrojs/mdx` be installed in Phase 2 anyway, for forward-compat?**
   - What we know: Phase 2 requirements don't need it; CLAUDE.md says install it in v1 for the deferred blog; Phase 6 (BLOG-01) will need it.
   - What's unclear: whether the planner wants to lock the forward-compat dependency now or wait for the blog phase.
   - Recommendation: skip in Phase 2; revisit at the BLOG-01 plan. If the planner wants to lock it, add a single Wave 0 task: `npm install @astrojs/mdx@^5` + add to `integrations: [mdx()]` array. Verifies clean. Cost: one task, one extra dep.

2. **Do REQUIREMENTS.md and ROADMAP.md need a doc-fix update for `src/content.config.ts`?**
   - What we know: both currently say `src/content/config.ts`; Astro 6 requires `src/content.config.ts`.
   - What's unclear: whether the planner wants to fix this in Phase 2 (an extra task) or accept the drift and let the SUMMARY document it.
   - Recommendation: include a small doc-fix task in the Phase 2 plan to update both files; cost is ~5 minutes; benefit is preventing a future re-read confusion.

3. **Does the dynamic-route page need `@tailwindcss/typography` for `<Content />` body styling?**
   - What we know: not installed; `prose` utilities won't work; Markdown bodies are 200–400 words.
   - What's unclear: how much hand-styling is acceptable.
   - Recommendation: skip the plugin in Phase 2; hand-style with utilities on the wrapper div: `<div class="space-y-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-8 [&_p]:text-fg/90 [&_a]:text-accent [&_a]:underline">`. Tailwind 4 supports this arbitrary-selector syntax. If the bodies grow longer, add Typography in Phase 4 polish.

4. **Cold-read 60-second test — does Phase 2 itself need to satisfy this, or only Phase 4?**
   - What we know: ROADMAP.md Phase 2 SC#5 says "A cold-read reviewer ... can articulate within 60 seconds what JigSpec does ... if not, hero / explainer / card framing is iterated before Phase 3 begins." VISUAL-05 in Phase 4 also requires an external cold-read.
   - What's unclear: whether the Phase 2 cold-read is a real external user or a Claude-driven pseudo-cold-read (read-the-page-fresh after a break).
   - Recommendation: Phase 2 SC#5 is best satisfied by a self-cold-read (Claude reads the page after a 30-min context break); Phase 4 VISUAL-05 is the "real human" gate. Note in plan acceptance.

5. **Should buggerd's product page be a redirect to buggerd.com, or simply not exist?**
   - What we know: CONTENT-09 says "Buggerd has no such page on this site." `getStaticPaths` filter excludes it → /products/buggerd 404s.
   - What's unclear: whether a 404 is the right UX, or whether `/products/buggerd` should redirect to `https://buggerd.com`.
   - Recommendation: 404 (do nothing). If a user types the URL directly they're not going through the card click flow; the card click flow goes to buggerd.com via the card's `<a target="_blank">`. A redirect would require either Vercel rewrites in `vercel.json` or a manual redirect file — extra surface for no gain. If we want to be polite, a Phase 4 polish task can add a 410 Gone or a "buggerd lives at buggerd.com" page.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | ✓ | ≥22.12.0 (per `engines` in package.json) | — |
| npm | Package install | ✓ | bundled with Node | — |
| Astro 6 | Already installed | ✓ | 6.1.10 | — |
| Tailwind 4 | Already installed | ✓ | 4.2.4 | — |
| Vercel CLI | Already used Phase 1 | ✓ | (auto-deploy from main is the active path; CLI not strictly needed) | — |
| Git + gh CLI | Already used Phase 1 | ✓ | — | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None — Phase 2 ships with the Phase 1 dependency set unchanged.

## Project Constraints (from CLAUDE.md)

CLAUDE.md is the project's standing instruction file. Phase 2-relevant directives:

1. **GSD workflow enforcement**: "Before using Edit, Write, or other file-changing tools, start work through a GSD command." Phase 2 work is gated by `/gsd-execute-phase` per the GSD workflow. The planner ensures plans run under this entry point.
2. **Tailwind 4 via `@tailwindcss/vite`** (locked in CLAUDE.md): no `@astrojs/tailwind`. Confirmed Phase 1 setup matches.
3. **No Tailwind CDN**: confirmed Phase 1 setup matches; no change in Phase 2.
4. **`@astrojs/tailwind` forbidden** (CLAUDE.md "What NOT to Use"): confirmed.
5. **Astro `output: 'static'`** (CLAUDE.md "What NOT to Use" forbids `output: 'server'` for v1): confirmed `astro.config.mjs` uses `'static'`. No Phase 2 change.
6. **No fake social proof / metrics / "trusted by"** (CLAUDE.md voice exclusion): mirrors CONTENT-08; surfaced as Pitfall 4.
7. **Two voice candidates resolved to Sketch B (Engineering-Blog Pragmatic)** (CLAUDE.md "Voice" + PROJECT.md key decisions): all Phase 2 placeholder copy continues this voice; bracketed-placeholder convention is explicit.
8. **PostHog `autocapture: true` forbidden** (CLAUDE.md "What NOT to Use"): not relevant in Phase 2 (no PostHog yet); flag for Phase 3 plan.
9. **`z` import from `astro:content` is forbidden** (CLAUDE.md "What NOT to Use" — `z import from astro:content`): confirmed; use `astro/zod`. Already in Pattern 1 above.
10. **`@astrojs/mdx@^4`** (CLAUDE.md): version is stale — current is `^5`. Not blocking Phase 2 because we're not installing it. Flag for the Phase 6 blog plan.

The planner does NOT need to add a separate "verify CLAUDE.md compliance" task — directives 1-9 are already covered by the patterns and pitfalls above. Directive 10 is a doc-drift note for a future phase.

## Honesty Audit Checklist (CONTENT-08)

Run on every Phase 2 plan completion (and again before Phase 4 cold-read). Plain-English checklist; the planner can wrap as a script if desired.

- [ ] No instances of "trusted by" / "Fortune 500" / "industry-leading" / "world-class" / "best-in-class" / "cutting-edge" / "revolutionary" / "game-changing" / "unparalleled" / "enterprise-grade"
- [ ] No fake numbers ("10,000 users," "85% reduction in...") unless backed by a citable source
- [ ] No fabricated testimonials or quoted endorsements
- [ ] No customer logos that aren't actually JigSpec customers (currently zero)
- [ ] Every superlative claim has a falsifiable concrete claim attached (e.g., "most reliable" → "passes your existing CI before shipping")
- [ ] The hero sub-line is falsifiable per CONTENT-01

Optional automated grep (add as `npm run honesty-audit`):

```bash
grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/ && exit 1 || exit 0
```

(This will fire on the bracketed-placeholder copy if a placeholder accidentally uses one of these phrases — useful as a safety net.)

## Component Inventory — What Phase 2 Creates and What's Reused

### Reused unchanged from Phase 1

- `src/layouts/Base.astro` — slot-based, font preload, data-theme bootstrap. No Phase 2 changes.
- `src/components/global/Nav.astro` — wordmark + 3 anchors (Products, Docs, About) + mobile hamburger. **Confirm** the existing `#products` anchor target lands on the new ProductGrid section. The `#docs` and `#about` anchors currently point to non-existent IDs — Phase 2 adds the IDs (or punt to Phase 4 polish).
- `src/components/global/Footer.astro` — docs / contact / GitHub / copyright. Already matches CONTENT-07 exactly. **No changes Phase 2.**
- `src/styles/global.css` — palette + type scale via `@theme`. No Phase 2 changes.
- `astro.config.mjs` — fonts + Tailwind Vite plugin. **One Phase 2 change pending decision**: whether to add `@astrojs/mdx` to `integrations: []`. Recommendation: leave empty.

### Created in Phase 2

- `src/content.config.ts` — Pattern 1
- `src/content/products/buggerd.md`
- `src/content/products/scientific-paper-agent.md`
- `src/content/products/triage-router-bot.md`
- `src/content/products/recorder-extractor.md`
- `src/content/products/agentic-employees.md`
- `src/content/products/delegate.md`
- `src/components/sections/Hero.astro`
- `src/components/sections/AgenticAIExplainer.astro`
- `src/components/sections/ProductGrid.astro`
- `src/components/sections/ProblemPitchSection.astro`
- `src/components/cards/ProductCard.astro`
- `src/components/cards/StageBadge.astro` (small but distinct enough to extract)
- `src/components/forms/InterestForm.astro`
- `src/components/forms/ProblemPitchForm.astro`
- `src/components/diagrams/MermaidDiagram.astro` (placeholder shell only — empty `<div class="border-2 border-dashed border-muted/30 rounded-md p-12 text-center text-muted">[Diagram — Phase 4]</div>`)
- `src/pages/products/[slug].astro` — Pattern 8

### Modified in Phase 2

- `src/pages/index.astro` — Pattern 3 (replaces the "coming soon" placeholder)
- `package.json` — **expected diff: zero new dependencies** (verify post-phase)

## Sources

### Primary (HIGH confidence)
- [Astro 6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/) — content.config.ts location, `astro/zod` import, `render(entry)` API, legacy.collectionsBackwardsCompat flag
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — defineCollection, glob loader, getCollection/getEntry, render
- [Astro Markdown Content](https://docs.astro.build/en/guides/markdown-content/) — plain `.md` works in collections without MDX integration
- [Astro Routing](https://docs.astro.build/en/guides/routing/) — getStaticPaths pattern for dynamic content
- [Inclusive Components — Cards](https://inclusive-components.design/cards/) — Heydon Pickering whole-card-clickable pattern, pseudo-element stretching, screen-reader implications
- [package.json @ commit 2c51207](file:///Users/kjs/Documents/Business/JigSpec-LandingPage/package.json) — current dependency set
- [astro.config.mjs](file:///Users/kjs/Documents/Business/JigSpec-LandingPage/astro.config.mjs) — current integrations + fonts + Vite plugins
- [src/styles/global.css](file:///Users/kjs/Documents/Business/JigSpec-LandingPage/src/styles/global.css) — locked palette + type scale via @theme
- npm view (verified 2026-04-29): `astro@6.2.1`, `@astrojs/mdx@5.0.4` (peer `astro: ^6.0.0`), `@astrojs/sitemap@3.7.2`

### Secondary (MEDIUM confidence)
- [Astro Live Content Collections deep dive](https://astro.build/blog/live-content-collections-deep-dive/) — build vs live collection guidance
- [Inhaq's Astro 6 Content Collections 2026 Guide](https://inhaq.com/blog/getting-started-with-astro-content-collections) — third-party 2026-dated tutorial confirming the `astro/zod` + `render(entry)` patterns
- [Skill: Astro v6 Upgrade — Content Collections](https://github.com/ascorbic/skills/blob/main/skills/astro-v6-upgrade/content-collections.md) — community-maintained migration notes
- Tailwind 4 badge implementations from Preline / FlyonUI / Catalyst — pattern reference for outline/filled/text-only variants

### Tertiary (LOW confidence)
- [GitHub issue #15924](https://github.com/withastro/astro/issues/15924) — peer-dep bug for @astrojs/mdx@5.0.0 against stable Astro 6.x; reported fixed in 5.0.4 (verified by `npm view` peerDeps showing `astro: ^6.0.0`); flagged here in case the planner sees an alpha-pin error at install time

## Metadata

**Confidence breakdown:**
- Standard stack (Astro/Tailwind/no-new-deps): HIGH — verified against current docs + npm registry
- Architecture patterns (content collection, dynamic route, block-link card): HIGH — patterns are canonical and verified against Astro 6 + inclusive-components.design
- Stage badge visual treatment: MEDIUM-HIGH — the three-tier hierarchy is reasoned within constraint; cold-read may still iterate
- Form-shaped placeholder pattern: MEDIUM — UX call defensible but taste-dependent
- Honesty audit grep blocklist: HIGH — the blocklist is canonical SaaS-marketing fail-words
- Pitfalls (API drift, config-path, discriminated union): HIGH — verified against migration guide

**Research date:** 2026-04-29
**Valid until:** 2026-06-29 (60 days — Astro 6 is stable, Tailwind 4 is stable, the patterns above are core API surface)
