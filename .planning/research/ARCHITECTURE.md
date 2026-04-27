# Architecture Research

**Domain:** Astro + Tailwind marketing site for an agentic-AI company shipping multiple product candidates (1 real product + 4 concept probes), with PostHog analytics, Mermaid diagrams, multi-form capture, and explicit blog/docs growth paths.
**Researched:** 2026-04-27
**Confidence:** HIGH (Astro + PostHog patterns sourced from official docs via Context7 and posthog.com; ecosystem pattern matched against the buggerd reference implementation in the sibling repo)

## Standard Architecture

### System Overview

The site is a static-first, single-page-in-v1 Astro build with three runtime concerns delegated to third parties (PostHog for analytics + form capture, Mermaid for diagram render, Vercel for hosting + previews). Everything not delegated is a build-time concern: data lives as typed content collections, layout lives as `.astro` components, the index page composes those components in order.

```
┌──────────────────────────────────────────────────────────────────┐
│                         Build Time (Astro)                       │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ src/pages/ │  │ src/layouts/ │  │ src/components/sections/ │  │
│  │ index.astro│→ │ Base.astro   │→ │ Hero / Cards / Forms ... │  │
│  └────────────┘  └──────────────┘  └────────┬─────────────────┘  │
│                                             │ reads typed data   │
│                                  ┌──────────▼──────────────┐     │
│                                  │ src/content/products/   │     │
│                                  │ src/content/site.json   │     │
│                                  └─────────────────────────┘     │
├──────────────────────────────────────────────────────────────────┤
│                  Static Output (HTML + CSS + tiny JS)            │
│              dist/ → Vercel Edge → Cloudflare DNS                │
├──────────────────────────────────────────────────────────────────┤
│                          Runtime (Browser)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ posthog.js      │  │ mermaid.js       │  │ form handlers   │  │
│  │ (head, inline)  │  │ (client:visible, │  │ (per-card,      │  │
│  │  pageview +     │  │  lazy, dynamic   │  │  PostHog Surveys│  │
│  │  capture API)   │  │  import)         │  │  primary path)  │  │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `pages/index.astro` | Apex route. Composes section components in narrative order; passes data into them. No business logic. | `.astro` page, ~80–120 lines, mostly `<Section />` invocations |
| `layouts/Base.astro` | `<html>` shell, `<head>` (meta, OG, fonts, PostHog snippet), `<body>` wrapper, footer. Single layout in v1; blog will get a sibling `BlogPost.astro` later. | `.astro` layout |
| `components/global/Nav.astro` | Sticky top nav with anchor links to sections (Lean Labs menu pattern) and a CTA jump to the demand-signal form. | `.astro`, no JS framework |
| `components/global/Footer.astro` | Footer with link to interim docs URL, contact email, copyright. Reads link targets from `site.json`. | `.astro` |
| `components/sections/Hero.astro` | Apex hero — tagline, sub-line, primary CTA. | `.astro` |
| `components/sections/WhatIsAgenticAI.astro` | Educational section. Plain-language definition; anchors the reliability/autonomy claim. | `.astro` (mostly typography) |
| `components/sections/PipelineDiagram.astro` | Mermaid Diagram 1 wrapper (input → agent → tools → review → output). Lazy-loaded. | `.astro` shell + `<MermaidDiagram />` island |
| `components/sections/ProductGrid.astro` | The 5-card grid. Iterates `products` collection, renders one `<ProductCard />` per entry. Equal visual weight enforced here, not per-card. | `.astro`, reads `getCollection('products')` |
| `components/cards/ProductCard.astro` | One card. Accepts a typed product entry as prop. Renders title, blurb, status badge, CTA button. CTA behavior branches on `card.cta.kind`: `external` (buggerd, Delegate) opens link; `interest` opens an inline `<InterestForm />`. | `.astro` + minimal `<script>` for click capture |
| `components/forms/InterestForm.astro` | Per-card "tell us you're interested" form. PostHog Survey wrapper. Accepts `productId` prop so submit events are attributed. | `.astro` + `<script>` calling `posthog.capture` |
| `components/forms/ProblemPitchForm.astro` | The open-ended "tell us a problem to solve" capture. Email + free-text. Same pattern as `InterestForm` but un-attributed to a card. | `.astro` + `<script>` |
| `components/sections/ShipToYouDiagram.astro` | Mermaid Diagram 2 (your problem → we design → build → you use). Lazy-loaded. | `.astro` shell + `<MermaidDiagram />` island |
| `components/diagrams/MermaidDiagram.astro` | Generic mermaid-render island. Takes a diagram string as prop, renders inline to a `<div>`, dynamically imports `mermaid` only when in viewport via `client:visible`. | `.astro` with `client:visible` framework component (or a vanilla `<script>` using IntersectionObserver if avoiding a UI framework) |
| `components/global/Analytics.astro` | The PostHog inline snippet. One file. Lives in `<head>` via `Base.astro`. | `.astro` with `<script is:inline>` |
| `lib/analytics.ts` | Typed wrapper over `posthog.capture`. Exports `track(eventName, props)` with the event taxonomy enumerated as a string union. Source of truth for what events exist. | `.ts` module imported by client `<script>` blocks |
| `lib/products.ts` (optional) | Helper functions over the `products` collection (e.g., `getProductById`). | `.ts` module |

**Boundary discipline:** sections never read products directly — they always go through the collection API. Cards never know about other cards' state. Forms never own the product data they reference; they accept it as a prop.

## Recommended Project Structure

```
JigSpec-LandingPage/
├── astro.config.mjs              # Astro + integrations (tailwind, sitemap)
├── tailwind.config.mjs           # Tailwind 4 config; editorial type scale lives here
├── tsconfig.json                 # Strict mode; path alias @/* → src/*
├── vercel.json                   # Headers, redirects, mirror buggerd's pattern
├── package.json
├── .env.example                  # PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST
├── public/                       # Static assets served as-is
│   ├── favicon.svg
│   ├── og-image.png              # OpenGraph preview
│   └── robots.txt
└── src/
    ├── pages/
    │   ├── index.astro           # The single landing page (v1)
    │   ├── 404.astro             # Custom 404 (cheap win)
    │   └── blog/                 # RESERVED — empty in v1, schema set up in v1
    │       └── .gitkeep          # so the route shape exists
    ├── layouts/
    │   ├── Base.astro            # html/head/body + Nav + Footer + PostHog
    │   └── BlogPost.astro        # RESERVED — stub for v2 blog (commented or empty)
    ├── components/
    │   ├── global/
    │   │   ├── Nav.astro
    │   │   ├── Footer.astro
    │   │   └── Analytics.astro   # PostHog inline snippet, head-injected
    │   ├── sections/             # Page-section components, one per index.astro slot
    │   │   ├── Hero.astro
    │   │   ├── WhatIsAgenticAI.astro
    │   │   ├── PipelineDiagram.astro
    │   │   ├── ProductGrid.astro
    │   │   ├── ProblemPitchSection.astro
    │   │   └── ShipToYouDiagram.astro
    │   ├── cards/
    │   │   └── ProductCard.astro # Takes product entry as prop
    │   ├── forms/
    │   │   ├── InterestForm.astro      # Per-card interest capture
    │   │   ├── ProblemPitchForm.astro  # Open-ended problem capture
    │   │   └── FormStatus.astro        # Shared success/error state UI
    │   └── diagrams/
    │       └── MermaidDiagram.astro    # Lazy-loaded mermaid renderer
    ├── content/
    │   ├── config.ts             # defineCollection() + zod schemas
    │   ├── products/             # ONE FILE PER PRODUCT — easy to edit, easy to PR-review
    │   │   ├── buggerd.md        # md (or .json) — frontmatter is the data
    │   │   ├── scientific-paper-agent.md
    │   │   ├── triage-router-bot.md
    │   │   ├── recorder-extractor.md
    │   │   └── delegate.md
    │   ├── site.json             # Site-level config (nav links, footer links, contact email)
    │   └── blog/                 # RESERVED — empty in v1, schema declared
    │       └── .gitkeep
    ├── lib/
    │   ├── analytics.ts          # Typed track() wrapper + event-name enum
    │   ├── products.ts           # Helpers over the products collection
    │   └── env.ts                # Runtime env validation (zod-parsed import.meta.env)
    ├── styles/
    │   └── global.css            # @tailwind directives + the editorial type scale,
    │                             # CSS custom properties for the palette
    └── assets/                   # Optimized images (Astro <Image /> handles them)
        └── ...
```

### Structure Rationale

- **`src/content/products/` as one file per product** — the explicit requirement. Editing a card (changing copy, status, or CTA target) means editing exactly one Markdown file with frontmatter. Adding a 6th product means adding a 6th file. No section component needs to change.
- **`src/content/site.json` for site-level config** — the docs link target, the contact email, the nav items. These change when `jigspec.com` cuts over and when the docs URL stabilizes. Keeping them out of components prevents copy-paste-edit-three-files mistakes.
- **`src/components/sections/` matches `index.astro` reading order** — when a designer says "move the diagram above the cards," the change is two `<Section />` reorderings in `index.astro` and zero files moved.
- **`cards/`, `forms/`, `diagrams/` as siblings of `sections/`** — these are reusable primitives the sections compose. Sections own page layout; cards/forms/diagrams own one-job concerns.
- **`pages/blog/` and `content/blog/` exist as empty placeholders in v1** — the v2 blog can land without a folder restructure; the route `/blog/[...slug]` and the collection schema are the only things needed to turn it on.
- **`docs/` is NOT pre-staged in v1** — the docs migration is explicitly deferred and may end up at a subdomain (`docs.jigspec.com`) rather than `/docs`. Reserving a folder for it would be premature. The architecture does not preclude it: an Astro project can host `/docs` either via a `pages/docs/[...slug].astro` content collection or by shipping the existing VitePress build into `public/docs/` as a static escape hatch.
- **`lib/analytics.ts` as the only file that calls `posthog.capture`** — single source of truth for the event taxonomy. New event? Add to the union, then call `track()`. Cards never call `posthog.capture` directly.
- **`public/` is for already-finished assets** (favicon, OG image, robots.txt). Anything Astro should optimize lives in `src/assets/`.

## Architectural Patterns

### Pattern 1: Typed Content Collection for Product Cards

**What:** Product cards are not hard-coded in any `.astro` file. They live as one Markdown file per product in `src/content/products/`, validated by a Zod schema in `src/content/config.ts`. The grid component iterates `getCollection('products')`.

**When to use:** Every list-shaped surface where adding/removing/editing items should not require editing a layout component. Apply to products in v1; apply to blog posts in v2; apply to anything pluralizable later.

**Trade-offs:**
- (+) Adding a card = adding a file. No layout changes.
- (+) Schema validation catches "you forgot the CTA link" at build time, not in production.
- (+) Same primitive that powers the v2 blog, so v2 isn't a re-architecture.
- (−) One layer of indirection vs. inlining the data. Worth it for ≥3 items.

**Example:**

`src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.md' }),
  schema: z.object({
    id: z.string(),                    // matches filename slug; used in analytics events
    title: z.string(),
    blurb: z.string(),                 // 1–2 sentence card body
    status: z.enum(['shipping', 'concept']),
    order: z.number(),                 // controls grid position; equal visual weight, but order matters
    cta: z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('external'), label: z.string(), url: z.string().url() }),
      z.object({ kind: z.literal('interest'), label: z.string(), surveyId: z.string() }),
    ]),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { products, blog };
```

`src/content/products/buggerd.md`:
```markdown
---
id: buggerd
title: buggerd
blurb: CI bugs, fixed and PR'd. Your real users find the bugs; buggerd ships the fix.
status: shipping
order: 1
cta:
  kind: external
  label: Visit buggerd.com
  url: https://buggerd.com
---

(Optional longer body for future card-detail pages — unused in v1)
```

`src/content/products/scientific-paper-agent.md`:
```markdown
---
id: scientific-paper-agent
title: Scientific paper agent
blurb: A pipeline that ingests a research question and returns a literature-backed brief.
status: concept
order: 2
cta:
  kind: interest
  label: I'd use this — tell us
  surveyId: ph_survey_paper_agent
---
```

`src/components/sections/ProductGrid.astro`:
```astro
---
import { getCollection } from 'astro:content';
import ProductCard from '../cards/ProductCard.astro';

const products = (await getCollection('products')).sort(
  (a, b) => a.data.order - b.data.order
);
---
<section id="products" class="...">
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((p) => <ProductCard product={p} />)}
  </div>
</section>
```

### Pattern 2: Typed Analytics Wrapper as the Event-Name Source of Truth

**What:** `src/lib/analytics.ts` exports a `track()` function whose first argument is a string-literal union of allowed event names. Every place that wants to fire an event imports from here. Direct calls to `window.posthog.capture` are forbidden by convention (and findable with a single grep).

**When to use:** The moment you have ≥3 events in a single product surface. PostHog's own taxonomy guidance is "create a dedicated list of allowed verbs and don't deviate from it" — a TypeScript union enforces that mechanically.

**Trade-offs:**
- (+) Misnamed events (`product_clicked` vs. `product_card_click`) become compile errors.
- (+) Onboarding a new contributor = read one file to see the entire event surface.
- (+) Refactoring an event name is a rename-with-confidence.
- (−) Slight friction adding a new event (must edit the union). That friction is the point.

**Example:**
```typescript
// src/lib/analytics.ts
export type AnalyticsEvent =
  | 'page:home_view'
  | 'product_card:click'
  | 'product_card:cta_click'
  | 'interest_form:open'
  | 'interest_form:submit'
  | 'interest_form:error'
  | 'problem_pitch:open'
  | 'problem_pitch:submit'
  | 'problem_pitch:error'
  | 'nav:link_click'
  | 'diagram:view';

interface AnalyticsProps {
  product_id?: string;          // 'buggerd' | 'scientific-paper-agent' | ...
  cta_kind?: 'external' | 'interest';
  cta_label?: string;
  section?: string;             // 'hero' | 'product_grid' | 'problem_pitch' | 'footer'
  destination_url?: string;
  diagram_id?: 'pipeline' | 'ship_to_you';
  has_email?: boolean;          // boolean prefix per PostHog convention
  error_message?: string;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === 'undefined') return;
  const ph = (window as any).posthog;
  if (!ph) return;
  ph.capture(event, props);
}

export function identify(email: string) {
  if (typeof window === 'undefined') return;
  const ph = (window as any).posthog;
  if (!ph) return;
  ph.identify(email, { email, has_email: true });
}
```

Then in any component `<script>`:
```astro
<script>
  import { track } from '@/lib/analytics';
  document.querySelectorAll('[data-product-card]').forEach((el) => {
    el.addEventListener('click', () => {
      track('product_card:click', {
        product_id: el.getAttribute('data-product-id') ?? undefined,
        section: 'product_grid',
      });
    });
  });
</script>
```

### Pattern 3: Lazy-Loaded Mermaid Island

**What:** `MermaidDiagram.astro` defers loading the `mermaid` library until the diagram is in (or near) the viewport. Two implementations are viable; pick one based on whether you want a UI framework dependency:

- **Option A (preferred for this repo):** Plain `.astro` component with a `<script>` that uses `IntersectionObserver` to dynamically `import('mermaid')` only when the diagram element is near the viewport. Zero framework dependency.
- **Option B:** A React/Preact island wrapped with `client:visible`. Astro handles intersection and hydration; you write the mermaid call in the framework component. Adds the framework runtime to your bundle.

**When to use:** Always for Mermaid on a marketing page — `mermaid` is ~700KB minified. Eager-loading it in `<head>` would tank LCP.

**Trade-offs:**
- (+) Mermaid bytes never download for visitors who bounce above the fold.
- (+) `client:visible` makes the intent obvious in the markup.
- (−) Slight perceived delay when scrolling to the diagram (≤200ms on broadband). Mitigate with a placeholder `<div>` of the diagram's intrinsic dimensions to prevent layout shift.

**Example (Option A — no framework dependency):**
```astro
---
// src/components/diagrams/MermaidDiagram.astro
const { id, code } = Astro.props as { id: string; code: string };
---
<div
  class="mermaid-container min-h-[280px]"
  data-mermaid
  data-diagram-id={id}
  data-code={code}
>
  <noscript><pre>{code}</pre></noscript>
</div>

<script>
  import { track } from '@/lib/analytics';

  const render = async (el: HTMLElement) => {
    const code = el.dataset.code ?? '';
    const id = el.dataset.diagramId ?? '';
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    const { svg } = await mermaid.render(`mmd-${id}`, code);
    el.innerHTML = svg;
    track('diagram:view', { diagram_id: id as 'pipeline' | 'ship_to_you' });
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        render(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '200px' });

  document.querySelectorAll<HTMLElement>('[data-mermaid]').forEach((el) => io.observe(el));
</script>
```

### Pattern 4: Per-Card Form Component, Shared by Composition

**What:** Every concept card and the open-ended problem-pitch section use the same `<InterestForm />` (or its sibling `<ProblemPitchForm />`) primitive. The form takes a `productId` prop so submit events are attributed correctly. UI is identical across cards by design (consistency makes the demand-signal comparison fair).

**When to use:** Whenever the same UI shows up in multiple places with one varying prop. The forbidden alternative is hand-coding the form in each card, which guarantees they drift.

**Trade-offs:**
- (+) Visual consistency by default, not by discipline.
- (+) Submit-event schema is identical across cards; PostHog dashboards are clean.
- (+) Changing form copy/styling is one edit.
- (−) Designing the abstraction takes 30 extra minutes upfront. (Worth it.)

**Example sketch:**
```astro
---
// src/components/forms/InterestForm.astro
const { productId, surveyId, ctaLabel } = Astro.props;
---
<form data-interest-form data-product-id={productId} data-survey-id={surveyId}>
  <input type="email" name="email" required placeholder="you@company.com" />
  <button type="submit">{ctaLabel}</button>
  <div data-status hidden></div>
</form>

<script>
  import { track, identify } from '@/lib/analytics';
  document.querySelectorAll<HTMLFormElement>('[data-interest-form]').forEach((form) => {
    const productId = form.dataset.productId!;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      try {
        identify(email);
        track('interest_form:submit', { product_id: productId, has_email: true });
        // Hand off to PostHog Survey or Tally fallback
        // ...
        form.querySelector('[data-status]')!.textContent = 'Thanks — we\'ll be in touch.';
      } catch (err) {
        track('interest_form:error', { product_id: productId, error_message: String(err) });
      }
    });
  });
</script>
```

## Data Flow

### Build-time data flow

```
src/content/products/*.md
    ↓ (zod validates)
content collection (typed)
    ↓ (getCollection in ProductGrid)
ProductCard props (typed)
    ↓
static HTML in dist/
```

### Runtime event flow

```
[user clicks a card / submits a form / scrolls to diagram]
    ↓
component <script> handler
    ↓
lib/analytics.ts → track(eventName, props)
    ↓
window.posthog.capture(...)
    ↓
PostHog ingestion (us.i.posthog.com)
    ↓
PostHog dashboard (demand ranking by product_id)
```

### Form submission flow

```
[email + optional free text]
    ↓
posthog.identify(email, { email })   // anonymous → identified
    ↓
track('interest_form:submit', { product_id, has_email: true })
    ↓
PostHog Survey API (primary) OR Tally POST (fallback)
    ↓
success/error UI state
```

## PostHog Event Taxonomy

Naming follows PostHog's documented `category:object_action` framework: lowercase, snake_case, present-tense verbs, and a fixed verb list (`view`, `click`, `open`, `submit`, `error`). Properties follow `object_adjective` with `is_`/`has_` for booleans.

### Event Catalog

| Event Name | When Fired | Required Properties | Optional Properties | Notes |
|------------|-----------|--------------------|--------------------|-------|
| `page:home_view` | Page load (once per session, dedup'd) | — | `referrer` | Auto via PostHog pageview, but explicit so we can rename later |
| `product_card:click` | Visitor clicks anywhere on a product card | `product_id`, `section: 'product_grid'` | — | Fires on the whole card, not just the CTA |
| `product_card:cta_click` | Visitor clicks the CTA button on a card | `product_id`, `cta_kind`, `cta_label` | `destination_url` (only when `cta_kind === 'external'`) | Distinguishes intent (full-card click) from action (CTA click) |
| `interest_form:open` | Inline interest form is revealed (concept cards) | `product_id` | — | Fires on first visibility, not every render |
| `interest_form:submit` | Visitor submits the per-card interest form | `product_id`, `has_email: true` | — | Triggers `posthog.identify(email)` |
| `interest_form:error` | Form submission fails (network, validation) | `product_id`, `error_message` | — | Validates the fallback path is needed |
| `problem_pitch:open` | The "tell us a problem" section becomes visible | — | — | One-shot per session |
| `problem_pitch:submit` | Visitor submits the open-ended problem-pitch form | `has_email: true` | `problem_length` (chars) | Triggers identify; no `product_id` because it's the demand probe beyond the cards |
| `problem_pitch:error` | Submission fails | `error_message` | — | |
| `nav:link_click` | Visitor clicks a nav anchor | `destination_section` | — | Validates which sections the nav drives traffic to |
| `diagram:view` | A Mermaid diagram enters the viewport and renders | `diagram_id` | — | Validates the diagrams are seen, not just shipped |

### Property Catalog

| Property | Type | Allowed Values | Notes |
|----------|------|----------------|-------|
| `product_id` | string | `buggerd` \| `scientific-paper-agent` \| `triage-router-bot` \| `recorder-extractor` \| `delegate` | Matches filename of `src/content/products/{id}.md` |
| `section` | string | `hero` \| `what_is_agentic_ai` \| `pipeline_diagram` \| `product_grid` \| `problem_pitch` \| `ship_to_you_diagram` \| `footer` | Section identifier; matches anchor IDs |
| `cta_kind` | string | `external` \| `interest` | Discriminator from the product schema |
| `cta_label` | string | (free text from product frontmatter) | Lets us rename the button without losing event continuity (event name is stable, label is metadata) |
| `destination_url` | string (URL) | (free) | Only set on external CTAs |
| `diagram_id` | string | `pipeline` \| `ship_to_you` | Two diagrams in v1 |
| `has_email` | boolean | true \| false | PostHog convention prefix; always `true` on submits, useful filter |
| `problem_length` | number | (chars in textarea) | Quality proxy for the open-ended form |
| `error_message` | string | (free) | Truncate to ≤200 chars to avoid PII leakage |
| `referrer` | string | (URL) | Auto-captured by PostHog |

### Identification

- **Anonymous by default.** PostHog hybrid mode (no persistent cookies pre-submit, no banner required).
- **Identify on email submit only.** Both `interest_form:submit` and `problem_pitch:submit` call `posthog.identify(email, { email })` so historical anonymous events get stitched to the identified person.
- **Never identify on a `_view` or `_click`.** Identification is gated on consent (giving an email).

### Dashboards to build (post-deploy, not pre-deploy)

1. **Demand ranking:** count of `product_card:cta_click` grouped by `product_id`, last 30 days.
2. **Funnel per concept:** `product_card:click` → `interest_form:open` → `interest_form:submit`, grouped by `product_id`. Shows where attention drops off.
3. **Problem-pitch quality:** `problem_pitch:submit` count + median `problem_length`. Validates the open-ended capture is producing real signal vs. spam.
4. **Diagram engagement:** `diagram:view` rate among home-viewers. Tells us if the diagrams are doing educational work.

## Suggested Build Order

The dependency graph below drives the recommended phase ordering. Each phase ends with a deployable artifact; nothing is left half-built across a phase boundary.

| # | Phase | Why this order | Deliverable | Blocks what comes after |
|---|-------|---------------|-------------|-----------------------|
| 1 | **Scaffold** — `npm create astro`, Tailwind, Vercel link, `vercel.json` mirroring buggerd, `tsconfig.json` strict, path aliases, `.env.example` | Everything else assumes a building project. Doing this first means every subsequent phase ships a real preview URL. | A deployed empty site at a Vercel preview URL | All other phases |
| 2 | **Layout shell** — `Base.astro`, `Nav.astro`, `Footer.astro`, `global.css` typography scale, palette tokens, `index.astro` with placeholder section blocks | Anchors the visual identity before content goes in; lets the design conversation happen against a real shell, not a Figma file. | A deployed shell with empty sections | Sections, content |
| 3 | **Content collections + product data** — `src/content/config.ts` schemas for `products` and (placeholder) `blog`; one Markdown file per product; `site.json`. Empty `pages/blog/` dir reserved. | Editing copy can begin in parallel with everything else once schemas exist. Defining schemas before writing components means the components are typed correctly from line 1. | Five product files validated by zod | ProductGrid, cards |
| 4 | **Section components (no analytics, no forms)** — `Hero`, `WhatIsAgenticAI`, `ProductGrid` + `ProductCard`, `ProblemPitchSection` (with form-shaped placeholder), `PipelineDiagram` and `ShipToYouDiagram` (placeholders, not yet rendered) | The page exists end-to-end as a static document. Stakeholder review on actual layout becomes possible. | A complete-looking page with non-functional CTAs | Forms, analytics, diagrams |
| 5 | **Analytics scaffolding** — `Analytics.astro` PostHog snippet in `Base.astro`, `lib/analytics.ts` with the typed `track()` wrapper and full event-name union, `nav:link_click` and `page:home_view` wired as the canary. Verify events appear in PostHog. | Forms in the next phase need `track()` to exist. Fixing analytics-pipeline bugs *before* there's signal-bearing UI to fire events is much easier. | PostHog receiving canary events from the deployed preview | Forms, diagrams (which both fire events) |
| 6 | **Forms** — `InterestForm`, `ProblemPitchForm`, `FormStatus`. Wire each `interest`-kind card to its form. Verify `interest_form:submit` and `problem_pitch:submit` appear in PostHog with correct `product_id`. | Forms are the core conversion path; gets the longest tail of "this works in dev but not in prod" issues; deserves its own phase to test cross-browser. | All forms functional, identify-on-submit working | Polish |
| 7 | **Mermaid diagrams** — `MermaidDiagram.astro` lazy island + the two diagrams. Verify `diagram:view` fires. | Mermaid is a 700KB dependency; doing it last keeps the bundle clean during earlier dev cycles. Doing it after analytics means we measure that diagrams are actually viewed. | Both diagrams render on scroll; bundle audit clean | Polish |
| 8 | **Polish** — responsive QA, OG image, favicon, 404, copy passes, accessibility audit (focus rings, alt text, semantic landmarks), Lighthouse run | Everything is in; now it gets shippable. | Lighthouse ≥95 on perf/a11y/SEO/best-practices | Cutover |
| 9 | **Deploy + soak** — Production-mode build on a long-lived non-apex Vercel URL (e.g. `jigspec.vercel.app` or a temporary subdomain). Internal traffic for 24–48h. | Catches PostHog config mismatches, CSP violations, form submission failures that only surface under real-world load. | Soak passes; no errors in PostHog or browser console | Cutover |
| 10 | **Cutover** — DNS swap. Cloudflare A/CNAME records changed from VitePress site to the Vercel deployment. Old VitePress site preserved at `docs.jigspec.com` (or another holding URL) per the deferred docs-migration plan. | Atomic. The site that's live before the swap is the docs site; the site live after is this marketing page. The two never coexist on the apex. | jigspec.com serves the new marketing page | — |

### Why this order respects dependencies

- **Scaffold → Layout → Content → Sections → Analytics → Forms → Diagrams → Polish → Deploy → Cutover** is a strict topological sort of the constraint graph: forms need analytics, components need content, content needs schemas, schemas need a project to live in. Reordering would create a phase where work was either uninspectable or had to be redone.
- **Analytics before forms** specifically because the forms are the highest-stakes event source. Wiring `track()` against a lower-stakes event (`nav:link_click`) first proves the pipeline before the pipeline becomes the conversion measurement.
- **Cutover as its own phase** because rolling back a DNS change is materially different from rolling back a code deploy. The phase exists to make "we noticed at 9pm and rolled back at 9:05" a planned-for outcome.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–1k visitors / month | Current architecture is right. Vercel Pro free tier covers it. PostHog free tier covers it. No optimizations needed. |
| 1k–10k / month | Same architecture. Monitor PostHog event volume against the 1M-events/month free-tier ceiling; we're nowhere near it. |
| 10k–100k / month | Still fine. Consider moving the PostHog snippet to a deferred load (`afterInteractive` equivalent) only if Lighthouse perf drops below 90. Add an `og-image` generator if blog grows. |
| 100k+ / month | Re-evaluate. At this scale we probably have product-market fit signal; the architecture would not be the bottleneck — the next blocker would be content-management workflow (ad hoc Markdown editing breaks down with multiple authors). Consider a headless CMS at that point, but only then. |

### What breaks first

1. **Editorial bottleneck (not technical):** As more cards/blog posts/landing variants accumulate, "edit a Markdown file in git" becomes a friction point for non-technical contributors. Mitigation: stay disciplined about the schema — a CMS bolt-on (Tina, Decap) can read these same content collections without rewriting them.
2. **PostHog dashboard sprawl:** With 11 events × multiple `product_id` values, dashboards get noisy. Mitigation: name events from day 1 per the taxonomy above; resist ad hoc events; prune unused ones quarterly.
3. **Mermaid diagram count:** Two diagrams are fine. Five would still be fine. Twenty would justify pre-rendering them at build time via a server-side Mermaid call. Crosses that threshold roughly at "we made this a docs site."

## Anti-Patterns

### Anti-Pattern 1: Inlining product-card data in the page or component

**What people do:** Hard-code the five product cards as a JS array in `index.astro` (or worse, as five hand-written `<ProductCard ... />` invocations with literal props). The buggerd index.html does this and gets away with it because it has no list-shaped surfaces.
**Why it's wrong:** Adding a card touches a layout file. Renaming a CTA touches a layout file. Reordering cards touches a layout file. Three months in, the diff for "add the 6th card" is unreviewable because copy and structure are tangled.
**Do this instead:** One file per product in `src/content/products/`. Layout iterates the typed collection. The layout file changes only when *layout* changes.

### Anti-Pattern 2: Eager-loading Mermaid in the head

**What people do:** Drop `<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>` in `<head>` and let `mermaid.initialize({ startOnLoad: true })` find the diagrams.
**Why it's wrong:** ~700KB of JS blocks first paint for diagrams that are below the fold. Marketing-page LCP suffers; Lighthouse perf score drops 15–20 points; mobile users on cellular bear the brunt.
**Do this instead:** Lazy load via `IntersectionObserver` + dynamic `import('mermaid')` (Pattern 3 above). The diagrams render the moment they're scrolled into view; visitors who never scroll never pay the byte tax.

### Anti-Pattern 3: Ad-hoc `posthog.capture` calls scattered through components

**What people do:** Each component imports `posthog` directly and calls `posthog.capture('whatever_string_came_to_mind', {...})`. Six months later the dashboard has `cardClick`, `card_clicked`, `product-card-click`, and `productCardClicked` all firing for the same action.
**Why it's wrong:** Demand ranking — the *one job* of the analytics on this site — silently produces wrong numbers. There is no compile-time check that a typo isn't being shipped.
**Do this instead:** All event firing routes through `lib/analytics.ts`. The event name parameter is a TypeScript union literal. Adding an event = editing the union = a deliberate, reviewable act.

### Anti-Pattern 4: Mixing forms behavior across cards

**What people do:** Each card hand-rolls its own form because "this card needs slightly different copy." Buttons drift in styling. Submit handlers diverge. One card identifies the user, another doesn't. The PostHog dashboard for `product_card_4` looks different from `product_card_3` for reasons no one remembers.
**Why it's wrong:** Cross-card comparison — the entire reason for surfacing five equally-weighted cards — gets corrupted by unequal instrumentation.
**Do this instead:** Single `<InterestForm />` primitive parameterized by `productId`. Copy variation lives in the product's frontmatter (`cta.label`), not in the form component. If a card "needs" a different form, that is a signal to either (a) rethink whether the card belongs in this grid, or (b) add a typed variant to the form, not a fork.

### Anti-Pattern 5: Pre-staging the docs migration before the docs migration is decided

**What people do:** Build a `pages/docs/[...slug].astro` route, port some VitePress pages, leave it half-finished "just in case."
**Why it's wrong:** The docs migration is explicitly deferred. Pre-staging it (a) burns time on a milestone not in scope, (b) commits us to a docs-on-the-same-domain decision that may not survive the actual migration phase, and (c) inflates the bundle and the cognitive surface of the project.
**Do this instead:** Reserve nothing for docs. The Astro architecture does not preclude a `/docs` route or a `docs.jigspec.com` subdomain — both are easy to add when the docs migration phase actually happens. Reserve the `pages/blog/` route only because blog is a documented near-term v2 deliverable; docs is not.

### Anti-Pattern 6: Coupling the cutover to the deploy

**What people do:** Push to `main`, watch Vercel deploy, and "while we're at it" flip the DNS in the same sitting.
**Why it's wrong:** A deploy bug and a DNS bug have different rollback procedures, different mean-time-to-detection, and different blast radii. Compounding them means a deploy-time bug becomes a public-apex bug.
**Do this instead:** Cutover is its own phase, gated on a soak period at a non-apex URL. The DNS change is a single, reviewed Cloudflare action — not a side effect of `git push`.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **PostHog** | Inline `<script is:inline>` in `<head>` via `Analytics.astro`; typed `track()` wrapper in `lib/analytics.ts` | Use US instance (`us.i.posthog.com`). Keep snippet inline (not bundled) so it loads first. Set `defaults: '2026-01-30'` per current PostHog Astro docs. |
| **PostHog Surveys** | Per-card forms POST to PostHog Survey API; `surveyId` lives in product frontmatter | Free tier covers expected volume. Trade-off acknowledged: no inbox notifications, dashboard-checking required. |
| **Tally** (fallback) | Same per-card form pattern as PostHog Surveys, but POSTs to a Tally form endpoint per the buggerd reference | Documented fallback only. Switch is a one-line change in `InterestForm` if PostHog Survey UX disappoints. |
| **Mermaid** | Dynamic `import('mermaid')` from `MermaidDiagram.astro` triggered by IntersectionObserver | Pin a version in `package.json`. Don't use the CDN — bundle ensures version stability and CSP simplicity. |
| **Vercel** | Auto-deploy from `main`; preview deploys on PRs; `vercel.json` mirrors buggerd's CSP, security headers, and `cleanUrls`/`trailingSlash` config | Update CSP `connect-src` to include `us.i.posthog.com` and `tally.so` (if used) before first deploy. |
| **Cloudflare DNS** | Apex A/CNAME pointed at Vercel — only changed during the cutover phase, not during dev | Pre-cutover the site lives at `*.vercel.app`. |
| **buggerd.com** | External link from the buggerd product card | No deeper integration. Tracked via `product_card:cta_click` with `destination_url`. |
| **Delegate landing** | External link from the Delegate product card if/when its landing is live; otherwise an `interest`-kind CTA | Same pattern as buggerd; the card's CTA `kind` switches based on Delegate's readiness. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `pages/index.astro` ↔ section components | Astro slots / props | Page passes nothing into sections that the sections couldn't fetch themselves; sections own their data dependencies. |
| Section components ↔ content collections | `getCollection()` | Sections read collections directly; never via a wrapper unless a transformation is needed. |
| `cards/` ↔ `forms/` | Composition (card renders the form, passes `productId`) | Card never knows what the form does internally; form never knows what other cards exist. |
| Components ↔ PostHog | Through `lib/analytics.ts` only | Direct `window.posthog.capture` calls are forbidden. Enforced by code review + grep. |
| `Base.astro` ↔ everything | One layout in v1 | Blog in v2 will introduce `BlogPost.astro` as a sibling, not a fork. |

## Sources

- [Astro — Project Structure](https://docs.astro.build/en/basics/project-structure/) — canonical `src/` folder conventions; only `pages/` is reserved (HIGH confidence)
- [Astro — Content Collections (via Context7 `/llmstxt/astro_build_llms-full_txt`)](https://docs.astro.build/en/guides/content-collections) — `defineCollection`, `glob` and `file` loaders, Zod schemas, and the `discriminatedUnion` pattern used for the CTA shape (HIGH confidence)
- [Astro — Content Loader Reference (via Context7)](https://docs.astro.build/en/reference/content-loader-reference) — `file()` loader for JSON data, supporting the `site.json` choice (HIGH confidence)
- [Astro — Islands Architecture / Client Directives](https://docs.astro.build/en/concepts/islands/) — `client:visible` semantics that motivate Pattern 3 (HIGH confidence)
- [PostHog — Astro Integration](https://posthog.com/docs/libraries/astro) — exact `posthog.astro` snippet, `is:inline` directive requirement, layout integration pattern, `defaults: '2026-01-30'` (HIGH confidence)
- [PostHog — Best Practices for Event/Property Naming](https://posthog.com/questions/best-practices-naming-convention-for-event-names-and-properties) — `category:object_action` framework, lowercase + snake_case + present-tense rules, `is_`/`has_` boolean prefixes (HIGH confidence)
- [PostHog — Taxonomy](https://posthog.com/docs/cdp/transformations/taxonomy-plugin) — taxonomy-plugin guidance corroborating the naming approach (MEDIUM confidence; reference doc only)
- [Rick Strahl — Lazy Loading the Mermaid Diagram Library](https://weblog.west-wind.com/posts/2025/May/10/Lazy-Loading-the-Mermaid-Diagram-Library) — concrete IntersectionObserver + dynamic-import pattern for Mermaid that informs Pattern 3 Option A (MEDIUM confidence; community source, but mechanism is standard)
- `/Users/kjs/Documents/Business/Buggerd/index.html` — sibling reference implementation; informs the `vercel.json` mirroring, the form-handler pattern, and Anti-Pattern 1 (the buggerd page is the example of "inlined data is fine for one page, breaks for many")
- `/Users/kjs/Documents/Business/Buggerd/vercel.json` — CSP and headers pattern to mirror, modulo `connect-src` additions for PostHog
- `/Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/PROJECT.md` — authoritative scope, constraints, and the deferred-docs decision

---
*Architecture research for: Astro + Tailwind multi-product marketing landing page (JigSpec)*
*Researched: 2026-04-27*
