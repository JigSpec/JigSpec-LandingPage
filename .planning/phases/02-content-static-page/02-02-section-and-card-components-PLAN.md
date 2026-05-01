---
id: 02-02
phase: 02-content-static-page
plan: 02
type: execute
wave: 2
depends_on: [02-01]
files_modified:
  - src/components/sections/Hero.astro
  - src/components/sections/AgenticAIExplainer.astro
  - src/components/sections/ProductGrid.astro
  - src/components/sections/ProblemPitchSection.astro
  - src/components/cards/ProductCard.astro
  - src/components/cards/StageBadge.astro
  - src/components/forms/InterestForm.astro
  - src/components/forms/ProblemPitchForm.astro
  - src/components/diagrams/MermaidDiagram.astro
autonomous: true
requirements: [TECH-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-08]
tags: [astro, components, sections, cards, forms, accessibility, block-link]
must_haves:
  truths:
    - "All 9 component files exist under the locked TECH-03 directory layout (`sections/`, `cards/`, `forms/`, `diagrams/`)"
    - "ProductCard.astro renders the Heydon Pickering block-link pattern: heading-wrapped <a> with after:absolute after:inset-0, parent has focus-within:ring-2"
    - "ProductCard renders exactly one <a> element per card (verified by future grep on rendered HTML in 02-05)"
    - "ProductCard sets target=\"_blank\" + rel=\"noopener noreferrer\" only when cta.type === 'external'"
    - "ProductCard emits data-event=\"card:cta_external_click\" for buggerd, data-event=\"card:open\" for interest cards, data-product-id={product.id} on every card (Phase 3 wiring hook)"
    - "StageBadge renders 3 visual variants by stage prop: Shipping → filled accent, Probe → outlined accent, Sibling → muted text-only"
    - "InterestForm has real <label for=> + <input id=> + disabled inputs + disabled submit + NO action attribute (form-shaped placeholder per Pattern 7)"
    - "ProblemPitchForm follows the same disabled-form-shaped placeholder pattern (no action, disabled inputs, disabled submit)"
    - "Hero renders falsifiable bracketed-placeholder headline + sub-line in font-display + max-w-3xl chrome (CONTENT-01)"
    - "AgenticAIExplainer has a heading + 3-paragraph body + a 2-column contrast element (CONTENT-02)"
    - "ProductGrid renders cards in a 1/2/3-col responsive grid at sm/md/lg breakpoints, max-w-6xl chrome (the wide section)"
    - "ProblemPitchSection contains the bracketed-placeholder copy framing the form as 'tell us a problem we should solve' + an embedded ProblemPitchForm placeholder (CONTENT-06)"
    - "MermaidDiagram.astro is a placeholder shell — dashed-border div labeled '[Diagram — Phase 4]' (Phase 4 wires astro-mermaid)"
    - "All visible copy is bracketed `[...]` placeholder per D-03 — no final copy, no superlatives"
    - "All Tailwind utilities are named (font-display, text-fg, bg-bg, text-accent, border-muted, etc.) — NO `font-[var(...)]` arbitrary forms (Pitfall 6)"
  artifacts:
    - path: src/components/cards/ProductCard.astro
      provides: "Block-link card component (Heydon Pickering pattern)"
      contains: "after:absolute after:inset-0"
    - path: src/components/cards/StageBadge.astro
      provides: "3-tier stage badge component"
      contains: "Shipping"
    - path: src/components/sections/Hero.astro
      provides: "Hero section with falsifiable sub-line"
      contains: "font-display"
    - path: src/components/sections/AgenticAIExplainer.astro
      provides: "Educational section with contrast element"
      contains: "contrast"
    - path: src/components/sections/ProductGrid.astro
      provides: "6-card responsive grid section"
      contains: "max-w-6xl"
    - path: src/components/sections/ProblemPitchSection.astro
      provides: "Open-ended demand-probe section"
      contains: "ProblemPitchForm"
    - path: src/components/forms/InterestForm.astro
      provides: "Per-product interest-form placeholder (disabled inputs, no action)"
      contains: "disabled"
    - path: src/components/forms/ProblemPitchForm.astro
      provides: "Open-ended problem-pitch form placeholder"
      contains: "disabled"
    - path: src/components/diagrams/MermaidDiagram.astro
      provides: "Phase 4 mermaid placeholder shell"
      contains: "Phase 4"
  key_links:
    - from: "src/components/cards/ProductCard.astro"
      to: "astro:content CollectionEntry<'products'>"
      via: "import type { CollectionEntry } from 'astro:content'"
      pattern: "CollectionEntry<'products'>"
    - from: "src/components/sections/ProductGrid.astro"
      to: "src/components/cards/ProductCard.astro"
      via: "component import"
      pattern: "import ProductCard"
    - from: "src/components/sections/ProblemPitchSection.astro"
      to: "src/components/forms/ProblemPitchForm.astro"
      via: "component import"
      pattern: "import ProblemPitchForm"
    - from: "src/components/cards/ProductCard.astro"
      to: "src/components/cards/StageBadge.astro"
      via: "component import"
      pattern: "import StageBadge"
---

<objective>
Build every Phase 2 component the home page and product detail pages compose: 4 section components (Hero, AgenticAIExplainer, ProductGrid, ProblemPitchSection), the block-link ProductCard with its StageBadge, the two form-shaped placeholder forms (InterestForm, ProblemPitchForm), and the MermaidDiagram placeholder shell. All visible copy is bracketed-placeholder Sketch B voice; all interactive surfaces are static or disabled — Phase 3 wires real behavior, Phase 4 wires Mermaid.

Purpose: This plan ships 9 distinct components in one wave because they form a single semantic boundary (Phase 2 = "structure + placeholder copy, no runtime behavior"). Splitting into per-component plans would 3x the planning overhead with no parallelism gain. The composition step (Plan 02-03) and the dynamic route (Plan 02-04) consume these components directly without modification.

Output: A complete component library satisfying TECH-03 and ready for composition by 02-03 (`index.astro`) and 02-04 (`/products/[slug].astro`).
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
@.planning/phases/01-scaffold-sketches-visual-shell/01-04-deploy-repo-vercel-SUMMARY.md
@CLAUDE.md
@src/content.config.ts
@src/styles/global.css
@src/layouts/Base.astro
@src/components/global/Nav.astro
@src/components/global/Footer.astro

<interfaces>
<!-- Locked Phase 1 visual tokens — use NAMED utilities (font-display, text-fg, bg-bg, etc.). -->
<!-- Phase 1 04-SUMMARY documents that arbitrary `font-[var(--font-display)]` forms break under Tailwind 4 single-pass extraction. Use `font-display` instead. -->

```
Tailwind utilities resolved from @theme (do NOT use arbitrary [var(...)] forms — Pitfall 6):
  font-display    -> Crimson Pro 600 (display)
  font-body       -> Inter 400/500 (body)
  text-fg         -> #18181B (body color)
  bg-bg           -> #FAFAF8 (page background)
  text-muted      -> #71717A (muted body)
  text-accent     -> #6366F1 (accent text)
  bg-accent       -> #6366F1 (accent fill)
  border-muted    -> #71717A (use with /20 or /30 opacity stops for hairlines)
  border-accent   -> #6366F1
```

Phase 1 already-shipped chrome (do NOT modify):
- `src/components/global/Nav.astro` — `max-w-5xl` page chrome, `#products / #docs / #about` anchor targets. ProductGrid section MUST have `id="products"` so Nav's `#products` anchor lands here.
- `src/components/global/Footer.astro` — already matches CONTENT-07 verbatim. No changes.
- `src/layouts/Base.astro` — slot-based, font preload, data-theme bootstrap.

Astro 6 imports the components will need:
```typescript
import type { CollectionEntry } from 'astro:content';
// CollectionEntry<'products'> is auto-derived from the schema in src/content.config.ts.
// .id is the file basename minus extension (e.g. 'buggerd', 'scientific-paper-agent').
// .data is the typed frontmatter (name, tagline, stage, order, cta, headline).
// .data.cta is the discriminated union — TS narrows .data.cta.url only when cta.type === 'external'.
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create StageBadge.astro and ProductCard.astro (the block-link pattern)</name>
  <files>src/components/cards/StageBadge.astro, src/components/cards/ProductCard.astro</files>
  <read_first>
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 5 lines 393-407 for badge variants; Pattern 6 lines 409-467 for block-link card; Pitfall 6 line 666-670 for Tailwind 4 named-utility rule)
    - src/content.config.ts (the schema — CollectionEntry<'products'> shape)
    - src/components/global/Nav.astro (existing Phase 1 chrome — max-w-5xl, font-display, text-fg patterns to mirror)
    - src/styles/global.css (locked palette + type scale tokens)
  </read_first>
  <action>
**Create `src/components/cards/StageBadge.astro`** (imported by ProductCard):

```astro
--- 
interface Props {
  stage: 'Shipping' | 'Probe' | 'Sibling';
}
const { stage } = Astro.props;

// Three visual tiers per Pattern 5 — within the locked palette only.
// Shipping = filled accent (highest weight, only buggerd qualifies)
// Probe   = outlined accent (medium weight, 4 cards)
// Sibling = muted text-only (lowest weight, only delegate qualifies)
const variants = {
  Shipping: 'bg-accent text-bg px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-sm',
  Probe: 'border border-accent/40 text-accent px-2 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-sm',
  Sibling: 'text-muted px-1 text-xs uppercase tracking-wider font-semibold',
} as const;
--- 
<span class={variants[stage]} aria-label={`Stage: ${stage}`}>{stage}</span>
```

**Create `src/components/cards/ProductCard.astro`** — the Heydon Pickering block-link pattern (research Pattern 6, full file):

```astro
--- 
import type { CollectionEntry } from 'astro:content';
import StageBadge from './StageBadge.astro';

interface Props {
  product: CollectionEntry<'products'>;
}
const { product } = Astro.props;
const { name, tagline, stage, cta } = product.data;

// Discriminated union: TypeScript narrows cta.url only when cta.type === 'external'.
const isExternal = cta.type === 'external';
const href = isExternal ? cta.url : `/products/${product.id}`;
const eventName = isExternal ? 'card:cta_external_click' : 'card:open';
const ctaCopy = isExternal
  ? `Visit ${new URL(cta.url).hostname} →`
  : 'Tell us →';
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
    {ctaCopy}
  </footer>
</article>
```

Locked rules:
1. Heading-wrapped anchor — the `<a>` is INSIDE `<h3>`, NOT wrapping the whole `<article>`. Screen readers announce only `{name}` as the link label (Pattern 6 rationale 1).
2. `after:absolute after:inset-0` on the anchor + `position: relative` on the parent `<article>` (via `relative` class) — pseudo-element stretches across card surface.
3. `focus-within:ring-2 focus-within:ring-accent/30` on the `<article>` — visible focus indicator on the whole card border.
4. `focus:outline-none` on the anchor — prevents double ring around just the heading text.
5. `data-event` + `data-product-id` — Phase 3 wiring hook. NO inline `onclick` JS.
6. External cta gets `target="_blank" rel="noopener noreferrer"`. Interest cta gets neither.
7. NAMED Tailwind utilities only — `font-display`, `text-fg`, `text-muted`, `text-accent`, `border-muted`, `border-accent`, `bg-accent`. Never `font-[var(--font-display)]` (Pitfall 6).
8. Exactly ONE `<a>` element per card — secondary links would need `class="relative"` to escape the pseudo-element (Pattern 6 edge case warning).
  </action>
  <verify>
    <automated>test -f src/components/cards/StageBadge.astro && test -f src/components/cards/ProductCard.astro && grep -q "stage: 'Shipping' | 'Probe' | 'Sibling'" src/components/cards/StageBadge.astro && grep -q "bg-accent text-bg" src/components/cards/StageBadge.astro && grep -q "border border-accent/40 text-accent" src/components/cards/StageBadge.astro && grep -q "text-muted px-1" src/components/cards/StageBadge.astro && grep -q "after:absolute after:inset-0" src/components/cards/ProductCard.astro && grep -q "focus-within:ring-2" src/components/cards/ProductCard.astro && grep -q "data-event=" src/components/cards/ProductCard.astro && grep -q "data-product-id={product.id}" src/components/cards/ProductCard.astro && grep -q "rel={isExternal ? 'noopener noreferrer'" src/components/cards/ProductCard.astro && grep -q "import StageBadge" src/components/cards/ProductCard.astro && grep -q "import type { CollectionEntry } from 'astro:content'" src/components/cards/ProductCard.astro && ! grep -E 'font-\[var\(' src/components/cards/StageBadge.astro src/components/cards/ProductCard.astro && npx astro check 2>&1 | tee /tmp/02-02-task1-check.log | grep -qE 'Result \(.*\): 0 errors' && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - Both files exist at exact paths
    - StageBadge has the three variants table verbatim (grep each variant string)
    - ProductCard has `after:absolute after:inset-0` on the anchor (grep)
    - ProductCard has `focus-within:ring-2` on the parent article (grep)
    - ProductCard has `data-event={eventName}` and `data-product-id={product.id}` on the anchor (both grep)
    - ProductCard imports `CollectionEntry` from `'astro:content'` (grep)
    - ProductCard imports StageBadge from `./StageBadge.astro` (grep)
    - ProductCard's anchor uses `target={isExternal ? '_blank' : undefined}` and `rel={isExternal ? 'noopener noreferrer' : undefined}` (both grep)
    - NO arbitrary `font-[var(...)]` forms anywhere: `! grep -E 'font-\\[var\\(' src/components/cards/`
    - `npx astro check` reports 0 errors after these files exist (the existing 02-01 schema + these components type-check together)
    - Exactly one `<a>` element in ProductCard.astro (`grep -c '<a' src/components/cards/ProductCard.astro` returns `1`)
  </acceptance_criteria>
  <done>StageBadge and ProductCard implement the locked patterns from 02-RESEARCH.md verbatim — block-link card with focus-within ring, three-tier badge variants, declarative analytics attributes, named Tailwind utilities only.</done>
</task>

<task type="auto">
  <name>Task 2: Create the 4 section components (Hero, AgenticAIExplainer, ProductGrid, ProblemPitchSection) and MermaidDiagram placeholder</name>
  <files>src/components/sections/Hero.astro, src/components/sections/AgenticAIExplainer.astro, src/components/sections/ProductGrid.astro, src/components/sections/ProblemPitchSection.astro, src/components/diagrams/MermaidDiagram.astro</files>
  <read_first>
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 4 lines 351-391 ProductGrid; Pattern 7 lines 471-543 form placeholder; § Code Examples lines 698-748 Hero + Explainer; Pitfall 5 lines 660-664 essay-narrow vs grid-wide chrome; Pitfall 6 lines 666-670)
    - src/components/cards/ProductCard.astro (just created — ProductGrid imports it)
    - src/components/global/Nav.astro (chrome reference: max-w-5xl, font-display)
    - .planning/REQUIREMENTS.md (CONTENT-01 falsifiable hero; CONTENT-02 250-400w explainer with contrast; CONTENT-03 6-card equal-footprint grid; CONTENT-06 problem-pitch section)
  </read_first>
  <action>
**Create `src/components/sections/Hero.astro`** (CONTENT-01 — falsifiable headline + sub-line in essay-narrow chrome):

```astro
--- 
// Hero — CONTENT-01. Bracketed placeholder copy in Sketch B voice.
// Essay-narrow max-w-3xl chrome (matches Phase 1 Sketch B selection).
--- 
<section class="border-b border-muted/20">
  <div class="max-w-3xl mx-auto px-6 py-24 md:py-32">
    <p class="text-sm uppercase tracking-widest text-accent">[Eyebrow — JigSpec]</p>
    <h1 class="font-display mt-4 text-5xl md:text-6xl leading-tight tracking-tight text-fg">
      [Falsifiable headline — e.g. "Most agentic AI doesn't ship. Here's what we do differently."]
    </h1>
    <p class="mt-6 text-xl italic text-muted">
      [Falsifiable sub-line — e.g. "Agents that pass your existing CI before they ship a change."]
    </p>
  </div>
</section>
```

**Create `src/components/sections/AgenticAIExplainer.astro`** (CONTENT-02 — 250-400w "What is agentic AI" + contrast element):

```astro
--- 
// AgenticAIExplainer — CONTENT-02. 250-400 word body + 2-column contrast element.
// Direct response to the buggerd post-mortem (visitors didn't realize what it was).
--- 
<section id="agentic-ai" class="border-b border-muted/20">
  <div class="max-w-3xl mx-auto px-6 py-20 md:py-24">
    <p class="text-sm uppercase tracking-widest text-muted">[What is agentic AI]</p>
    <h2 class="font-display text-3xl md:text-4xl mt-4 text-fg">
      [Section headline — plain-English working definition]
    </h2>
    <div class="mt-8 space-y-5 text-fg/90 leading-relaxed">
      <p>[Paragraph 1 — what an agent is and isn't, ~80 words. Bracketed-placeholder Sketch B voice. Avoid superlatives per CONTENT-08.]</p>
      <p>[Paragraph 2 — the reliability/autonomy claim, ~80 words. Frame against "breathless agentic-AI noise." No fabricated metrics.]</p>
      <p>[Paragraph 3 — what makes JigSpec's recipe different, ~80 words. Reference review-gates, falsifiable claims, the .pipe.yaml spec posture.]</p>
    </div>

    <!-- Contrast element per CONTENT-02 — 2-column compare table. -->
    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-muted/30 rounded-md p-6">
      <div>
        <p class="text-sm uppercase tracking-widest text-muted">[A chatbot]</p>
        <p class="mt-2 text-fg">[1-line contrast — e.g. "responds when you ask. waits between messages. forgets after the session."]</p>
      </div>
      <div>
        <p class="text-sm uppercase tracking-widest text-accent">[An agent]</p>
        <p class="mt-2 text-fg">[1-line contrast — e.g. "runs your loop end-to-end. picks up tools. checks its own work before it reports back."]</p>
      </div>
    </div>
  </div>
</section>
```

**Create `src/components/sections/ProductGrid.astro`** (CONTENT-03 — 6-card equal-footprint responsive grid in max-w-6xl wide chrome):

```astro
--- 
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
    <ul class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
      {products.map((product) => (
        <li class="contents">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  </div>
</section>
```

Locked rules:
- Section has `id="products"` so Nav's `#products` anchor lands here (Phase 1 Nav already targets this).
- `max-w-6xl` here is INTENTIONAL — wider than the surrounding `max-w-3xl` essay sections per Pitfall 5 ("the grid section MUST have a clear section break"). The `border-t` provides that break.
- `<ul>` semantics for the card list (inclusive-components.design recommendation).
- `<li class="contents">` lets the card participate in the parent grid layout (Tailwind 4 supports `contents`; if Astro 6 / Tailwind 4 emit a warning here, the executor may swap to a CSS Grid item directly without the wrapper `<li>` — both are acceptable).
- `list-none p-0` because `<ul>` defaults add browser-bullet styling that conflicts with the grid layout.

**Create `src/components/sections/ProblemPitchSection.astro`** (CONTENT-06 — open-ended demand probe with embedded form-shaped placeholder):

```astro
--- 
import ProblemPitchForm from '../forms/ProblemPitchForm.astro';
--- 
<section id="problem-pitch" class="border-t border-muted/20 py-20 md:py-24">
  <div class="max-w-3xl mx-auto px-6">
    <p class="text-sm uppercase tracking-widest text-muted">[Eyebrow — Tell us]</p>
    <h2 class="font-display text-3xl md:text-4xl mt-4 text-fg">
      [Tell us a problem we should solve.]
    </h2>
    <p class="mt-4 text-lg text-fg/90 leading-relaxed">
      [Framing copy — bracketed-placeholder Sketch B voice. Frame as soliciting demand signal beyond our preconceived cards. NOT a contact form. NOT "subscribe to our newsletter." This is the open-ended bet on what we should ship next. Two to three sentences.]
    </p>
    <ProblemPitchForm />
  </div>
</section>
```

**Create `src/components/diagrams/MermaidDiagram.astro`** (placeholder shell — Phase 4 wires astro-mermaid):

```astro
--- 
// Phase 2 placeholder — Phase 4 wires astro-mermaid. Accepts a `code` prop for forward-compat.
interface Props {
  code?: string;
  caption?: string;
}
const { caption = '[Diagram caption — Phase 4 swaps in real Mermaid render]' } = Astro.props;
--- 

<figure class="my-12">
  <div class="border-2 border-dashed border-muted/30 rounded-md p-12 text-center">
    <p class="font-display text-2xl text-muted">[Diagram — Phase 4]</p>
    <p class="mt-2 text-sm text-muted">[astro-mermaid lazy-loads here — see Phase 4 plan]</p>
  </div>
  <figcaption class="mt-3 text-sm text-muted text-center italic">{caption}</figcaption>
</figure>
```

The MermaidDiagram component is NOT used by Phase 2 sections (the home page composition in 02-03 doesn't include diagrams — they ship in Phase 4). The component exists in Phase 2 only to satisfy TECH-03's "Component layout" enumeration and to give Phase 4 a stable filename to swap implementations under. Plan 02-03 may choose to render a single placeholder MermaidDiagram in the home composition for visual scale, OR omit it entirely and let Phase 4 add it; the planner has explicitly delegated this discretion.
  </action>
  <verify>
    <automated>test -f src/components/sections/Hero.astro && test -f src/components/sections/AgenticAIExplainer.astro && test -f src/components/sections/ProductGrid.astro && test -f src/components/sections/ProblemPitchSection.astro && test -f src/components/diagrams/MermaidDiagram.astro && grep -q "max-w-3xl" src/components/sections/Hero.astro && grep -q "font-display" src/components/sections/Hero.astro && grep -q "id=\"agentic-ai\"" src/components/sections/AgenticAIExplainer.astro && grep -q "grid-cols-1 md:grid-cols-2" src/components/sections/AgenticAIExplainer.astro && grep -q "id=\"products\"" src/components/sections/ProductGrid.astro && grep -q "max-w-6xl" src/components/sections/ProductGrid.astro && grep -q "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" src/components/sections/ProductGrid.astro && grep -q "import ProductCard" src/components/sections/ProductGrid.astro && grep -q "id=\"problem-pitch\"" src/components/sections/ProblemPitchSection.astro && grep -q "import ProblemPitchForm" src/components/sections/ProblemPitchSection.astro && grep -q "border-dashed" src/components/diagrams/MermaidDiagram.astro && grep -q "Phase 4" src/components/diagrams/MermaidDiagram.astro && ! grep -rE 'font-\[var\(' src/components/sections/ src/components/diagrams/ && ! grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/components/sections/ src/components/diagrams/ && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - All 5 files exist at exact paths
    - Hero uses `max-w-3xl` essay-narrow chrome and `font-display` for `<h1>` (both grep)
    - Hero contains a sub-line under `<p class="mt-6 text-xl italic text-muted">` (grep)
    - AgenticAIExplainer has `id="agentic-ai"`, three `<p>` paragraphs in `space-y-5` body, and a 2-col contrast grid using `grid-cols-1 md:grid-cols-2`
    - ProductGrid has `id="products"`, `max-w-6xl` chrome, and `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` breakpoint progression (all grep)
    - ProductGrid imports `ProductCard` from `'../cards/ProductCard.astro'` (grep)
    - ProductGrid declares `products: CollectionEntry<'products'>[]` Props interface (grep)
    - ProblemPitchSection has `id="problem-pitch"` and imports `ProblemPitchForm` (both grep)
    - MermaidDiagram is a placeholder using `border-dashed` + `[Diagram — Phase 4]` text (grep)
    - NO arbitrary `font-[var(...)]` forms anywhere in `src/components/sections/` or `src/components/diagrams/`
    - Honesty audit grep passes for all section files (no superlatives in bracketed copy)
    - All visible copy is bracketed `[...]` placeholder per D-03 (sample: `grep -c '\[' src/components/sections/Hero.astro` ≥ 3)
  </acceptance_criteria>
  <done>4 section components + the MermaidDiagram placeholder shell exist with the locked layouts (essay-narrow Hero/Explainer/ProblemPitch, wide ProductGrid), correct anchors for Nav (`#products`), bracketed-placeholder copy in Sketch B voice, and named Tailwind utilities throughout.</done>
</task>

<task type="auto">
  <name>Task 3: Create the two form-shaped placeholder forms (InterestForm + ProblemPitchForm)</name>
  <files>src/components/forms/InterestForm.astro, src/components/forms/ProblemPitchForm.astro</files>
  <read_first>
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 7 lines 471-543 form-shaped placeholder; Pitfall 8 lines 678-682 disabled-form-Enter-key trap)
    - .planning/REQUIREMENTS.md (CONTENT-06 problem pitch; CONTENT-09 interest forms embedded on detail pages; DEMAND-01 interest form is parameterized by productId — used Phase 3)
    - src/components/global/Nav.astro (Phase 1 chrome conventions — labels, focus styles)
  </read_first>
  <action>
**Create `src/components/forms/InterestForm.astro`** (DEMAND-01 placeholder, parameterized by productId — Phase 3 wires real PostHog Surveys):

```astro
--- 
// Phase 2: form-shaped placeholder — disabled inputs, no action attribute, disabled submit.
// Phase 3 will: remove `disabled` from inputs/button, add submit handler that calls
// posthog.identify() then posthog.capture('form:submit', {productId, ...}).
// Pattern 7 + Pitfall 8 — disabled inputs prevent Enter-key submit (the disabled button alone
// would NOT prevent Enter-in-text-input from firing form submission).
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
    [Tell us you'd use this]
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

**Create `src/components/forms/ProblemPitchForm.astro`** (CONTENT-06 / DEMAND-02 placeholder — bare event capture in Phase 3, no Surveys widget):

```astro
--- 
// Phase 2: form-shaped placeholder for the open-ended "tell us a problem" capture.
// Phase 3 will swap to bare posthog.capture('problem_pitch', {email, problem}).
// No productId — the open form is general.
--- 

<form
  class="mt-8 border border-muted/20 rounded-md p-6"
  data-form="problem-pitch"
  aria-labelledby="problem-pitch-legend"
>
  <p id="problem-pitch-legend" class="font-display text-xl tracking-tight text-fg">
    [Pitch us a problem]
  </p>
  <p class="mt-2 text-sm text-muted">
    [Placeholder copy — replace in Phase 3 when posthog.capture wiring lands. Frame as: tell us about a repetitive or research-heavy task you think could be done by an autonomous agent. Email is optional but helps us follow up.]
  </p>

  <div class="mt-6">
    <label for="problem-pitch-email" class="block text-sm font-medium text-fg">
      Email (optional)
    </label>
    <input
      id="problem-pitch-email"
      type="email"
      name="email"
      disabled
      class="mt-1 w-full px-3 py-2 border border-muted/30 rounded text-fg disabled:bg-muted/5 disabled:cursor-not-allowed"
      placeholder="you@example.com"
    />
  </div>

  <div class="mt-4">
    <label for="problem-pitch-problem" class="block text-sm font-medium text-fg">
      What problem should we look at?
    </label>
    <textarea
      id="problem-pitch-problem"
      name="problem"
      rows="4"
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

Locked rules from Pattern 7 + Pitfall 8:
1. Real `<form>` markup with proper label/input id+for associations.
2. Every input has `disabled` (NOT just the submit button — `disabled` on inputs blocks Enter-key submission, which a disabled button alone does NOT prevent).
3. NO `action` attribute and NO `method` — Phase 3 adds these.
4. Submit button reads `Wired in Phase 3` so cold-readers don't think the form is broken.
5. `data-form="interest"` / `data-form="problem-pitch"` and (for InterestForm) `data-product-id={productId}` — Phase 3 wiring hook.
6. NAMED Tailwind utilities only.
7. The InterestForm is rendered ONLY on `/products/[slug]` pages in 02-04 — NOT on `index.astro` per DEMAND-01 ("Forms render embedded on each `/products/[slug]` page, not as modals on the home page").
8. The ProblemPitchForm is rendered ONLY inside ProblemPitchSection on `index.astro` — never on detail pages.
  </action>
  <verify>
    <automated>test -f src/components/forms/InterestForm.astro && test -f src/components/forms/ProblemPitchForm.astro && grep -q "interface Props" src/components/forms/InterestForm.astro && grep -q "productId: string" src/components/forms/InterestForm.astro && grep -q "data-form=\"interest\"" src/components/forms/InterestForm.astro && grep -q "data-product-id={productId}" src/components/forms/InterestForm.astro && grep -q "data-form=\"problem-pitch\"" src/components/forms/ProblemPitchForm.astro && ! grep -E 'action=' src/components/forms/InterestForm.astro && ! grep -E 'action=' src/components/forms/ProblemPitchForm.astro && ! grep -E 'method=' src/components/forms/InterestForm.astro && ! grep -E 'method=' src/components/forms/ProblemPitchForm.astro && [ "$(grep -c 'disabled' src/components/forms/InterestForm.astro)" -ge 3 ] && [ "$(grep -c 'disabled' src/components/forms/ProblemPitchForm.astro)" -ge 3 ] && grep -q "Wired in Phase 3" src/components/forms/InterestForm.astro && grep -q "Wired in Phase 3" src/components/forms/ProblemPitchForm.astro && grep -q 'for={`interest-${productId}-email`}' src/components/forms/InterestForm.astro && ! grep -E 'font-\[var\(' src/components/forms/InterestForm.astro src/components/forms/ProblemPitchForm.astro && npx astro check 2>&1 | tee /tmp/02-02-task3-check.log | grep -qE 'Result \(.*\): 0 errors' && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - Both files exist at exact paths
    - InterestForm declares `interface Props { productId: string; }` (grep)
    - InterestForm has `data-form="interest"` and `data-product-id={productId}` on the `<form>` (both grep)
    - ProblemPitchForm has `data-form="problem-pitch"` (grep)
    - Neither form has an `action=` attribute: `! grep -E 'action=' src/components/forms/`
    - Neither form has a `method=` attribute: `! grep -E 'method=' src/components/forms/`
    - InterestForm has at least 3 `disabled` occurrences (input email, textarea, submit button)
    - ProblemPitchForm has at least 3 `disabled` occurrences (one of which is on a `required` textarea)
    - Submit button text is exactly `Wired in Phase 3` in both forms (grep)
    - InterestForm has dynamic id template `interest-${productId}-email` for label association (grep)
    - NO arbitrary `font-[var(...)]` forms in either file
    - `npx astro check` reports 0 errors over the project after these files exist
  </acceptance_criteria>
  <done>Both form-shaped placeholders exist with the disabled-input + no-action + bracketed-placeholder pattern. Phase 3 will swap `disabled` removal + handler wiring; no Phase 2 artifact needs deletion.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Card click → external destination | Only `cta.type === 'external'` can produce a `target=_blank` link to a third-party origin. The `rel="noopener noreferrer"` mitigation is enforced. |
| Form markup → user browser | Forms are present in DOM but disabled at every input — no submission path exists in Phase 2. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-02-07 | Tampering | ProductCard external link | Low | mitigate | `rel="noopener noreferrer"` on every `target=_blank` link. Enforced via discriminated-union narrowing — TS won't compile if the rel is omitted on external cta branch. |
| T-02-08 | Spoofing | Form-shaped placeholder accepts no input but appears submittable | Low | mitigate | Disabled inputs + no `action` + Pitfall 8's Enter-key trap closed — even devtools-enabled submission goes nowhere (same-origin no-op). |
| T-02-09 | Information Disclosure | data-product-id attributes leak product slugs to anyone viewing source | Low | accept | Slugs already appear in URLs (`/products/scientific-paper-agent`); no incremental disclosure. |
| T-02-10 | Denial of Service | Card grid layout shift (CLS) | Low | mitigate | `flex flex-col h-full` on cards plus fixed-grid breakpoints — cards have predictable footprints. Phase 4 polish has the Lighthouse CLS gate. |
| T-02-11 | Tampering | Bracketed-placeholder copy reaches production with forbidden words | Low | mitigate | Honesty grep in Plan 02-05 pre-merge gate; Phase 4 cold-read review backstops. |
| T-02-12 | Repudiation | data-event attributes claim phase-3 wiring promise that's never fulfilled | Low | accept | Plan 03 has explicit task to wire delegated listener reading these attributes. If Plan 03 lands without wiring, Phase 3 verification fails. |
| T-02-13 | Spoofing | StageBadge "Sibling" muted-text-only badge could be missed visually | Medium | accept | Pattern 5 design call (Assumption A4 in 02-RESEARCH.md). Mitigated by Plan 02-05 self-cold-read; Phase 4 external cold-read backstops. If reviewers can't distinguish Sibling, swap visual treatment in Plan 02-05 or Phase 4 polish without schema change. |
</threat_model>

<verification>
After all 3 tasks complete:

```bash
# All 9 components exist
ls src/components/sections/ | sort                 # 4 files: AgenticAIExplainer, Hero, ProblemPitchSection, ProductGrid
ls src/components/cards/    | sort                 # 2 files: ProductCard, StageBadge
ls src/components/forms/    | sort                 # 2 files: InterestForm, ProblemPitchForm
ls src/components/diagrams/ | sort                 # 1 file: MermaidDiagram

# Type-checks (depends on 02-01 schema)
npx astro check                                    # 0 errors

# Tailwind 4 named-utility hygiene (Pitfall 6)
! grep -rE 'font-\[var\(' src/components/

# Block-link card pattern smoke
grep -q "after:absolute after:inset-0" src/components/cards/ProductCard.astro
grep -q "focus-within:ring-2" src/components/cards/ProductCard.astro

# Forms have no action attribute (Phase 2 boundary)
! grep -rE 'action=' src/components/forms/

# Honesty audit (component placeholder copy)
! grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/components/

# Anchor #products in ProductGrid + #agentic-ai in Explainer + #problem-pitch in ProblemPitchSection
grep -q 'id="products"'      src/components/sections/ProductGrid.astro
grep -q 'id="agentic-ai"'    src/components/sections/AgenticAIExplainer.astro
grep -q 'id="problem-pitch"' src/components/sections/ProblemPitchSection.astro
```
</verification>

<success_criteria>
- All 9 component files exist under TECH-03 directory layout (sections/, cards/, forms/, diagrams/)
- ProductCard implements the Heydon Pickering block-link pattern verbatim from Pattern 6
- StageBadge renders 3 visual tiers (filled / outlined / muted) within the locked palette
- Both forms are structurally complete but Phase-2-inert (no action, all inputs disabled, disabled submit)
- Section components use the correct chrome widths (max-w-3xl for essay sections, max-w-6xl for ProductGrid)
- Honesty audit passes for all bracketed-placeholder copy
- `npx astro check` reports 0 errors with the schema from 02-01 + these components
- No arbitrary `font-[var(...)]` Tailwind forms anywhere
</success_criteria>

<output>
After completion, create `.planning/phases/02-content-static-page/02-02-section-and-card-components-SUMMARY.md` documenting:
- Each component's exact final size (lines) and props interface
- Confirmation `astro check` passes with all 9 components plus the schema from 02-01
- Confirmation honesty grep returns 0 hits across `src/components/`
- Confirmation no arbitrary Tailwind forms exist
- Any deviations (e.g., `<li class="contents">` swapped for direct grid item — note in deviations)
- Verification of the 6 anchor stage badges that will appear on the home page (5 will be Probe + Sibling on grid; buggerd is Shipping)
</output>
