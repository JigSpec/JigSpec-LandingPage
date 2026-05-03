# Phase 4: Diagrams, Polish & Preview Soak — Pattern Map

**Mapped:** 2026-04-30
**Files analyzed:** 9 (5 modified, 3 new code, 1 new asset family)
**Analogs found:** 9 / 9 (every file has a strong in-repo analog — no Phase 4 file is unprecedented)
**Codebase:** Astro 6.1.10 + Tailwind 4.2.4 + TypeScript strict, static output, no test runner.

## Scope Note (read first)

Phase 4 is overwhelmingly a **modify** phase, not a build phase. The five Phase-3 plans already shipped the analytics-wrapper, the placeholder `MermaidDiagram.astro`, the `Base.astro` head structure, the index composition, and the delegated-listener architecture. Phase 4 adds Mermaid runtime mechanics behind those existing surfaces, plus four standalone polish artifacts (404, OG image, sitemap integration, soak summary).

**The most load-bearing analog is `src/components/sections/AgenticAIExplainer.astro`** (after Phase 3 lands its `educator:scroll_complete` IO observer) — it is the canonical "Astro component with an IntersectionObserver in a component-scoped `<script>` block that imports `track` from `../../lib/analytics`". Phase 4's `MermaidDiagram.astro` is structurally a sibling of that pattern, just with two additional concerns layered on (dynamic `import('mermaid')` and an SVG-injection success path).

**Important sequencing note:** Phase 3 has shipped its plans (per repo state) but Phase 3 plan execution has not necessarily happened yet (`src/lib/analytics.ts` does not exist on disk as of pattern-map time). All "as it will exist after Phase 3" references below are derived from the Phase 3 PLAN files (`03-02-PLAN.md`, `03-03-PLAN.md`), not from currently-shipped code. The planner should treat the Phase 3 PLAN contracts as source-of-truth for `src/lib/analytics.ts` exports and the `data-diagram-id` attribute survival.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/diagrams/MermaidDiagram.astro` | component (lazy island) | event-driven (IO + dynamic import + DOM injection) | `src/components/sections/AgenticAIExplainer.astro` (Phase 3 IO observer pattern) + current `MermaidDiagram.astro` (frontmatter Props shape, figure+figcaption skeleton) | exact (composite of two siblings) |
| `src/pages/index.astro` | route (page composition) | request-response (static render) | itself (current 28-line composition file) — additive only | exact (modify in place) |
| `src/layouts/Base.astro` | layout (shell) | request-response (static render) | itself (current 56-line layout) — additive only | exact (modify in place) |
| `src/pages/404.astro` | route (page composition) | request-response (static render) | `src/pages/index.astro` (Base layout consumer + Nav/Footer + main wrapper pattern) | role-match (different content, identical scaffolding) |
| `astro.config.mjs` | config | build-time | itself (current 33-line config) — add `integrations: [sitemap()]` to existing array | exact (modify in place) |
| `public/og.png` | static asset | n/a | `public/favicon.svg`, `public/favicon.ico` (existing brand assets in `/public/` root, served same-origin) | role-match |
| `public/favicon.*` (additional sizes) | static asset | n/a | `public/favicon.svg`, `public/favicon.ico` (existing) | exact (already present — Phase 4 may add `apple-touch-icon.png`, `favicon-32x32.png`) |
| `vercel.json` (optional rewrite) | config | build-time | itself (current 21-line config) — only modify if soak proves Vercel doesn't auto-route to 404.html | exact (modify in place) |
| `.planning/phases/04-diagrams-polish-preview-soak/04-NN-SUMMARY.md` | doc artifact | n/a | `.planning/phases/02-content-static-page/02-05-doc-drift-and-phase-verification-SUMMARY.md` (sibling phase soak/verification SUMMARY) | role-match |

## Pattern Assignments

### `src/components/diagrams/MermaidDiagram.astro` (component, event-driven — REWRITTEN)

**Primary analog:** This file's own current state (Phase 2 placeholder + Phase 3 IO observer addition) PLUS `src/components/sections/AgenticAIExplainer.astro` for the IO-observer-with-track-import pattern.

**Existing skeleton to preserve** (from current `src/components/diagrams/MermaidDiagram.astro` lines 1-16):
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

**Research-mandated rewrite** (from `04-RESEARCH.md` Pattern 1, lines 188-280): replace the placeholder body with an IO-gated dynamic-import island. Key transformations:
- Frontmatter Props goes from `{ code?, caption? }` (both optional) → `{ diagramId: 'pipeline-run' | 'ship-to-you'; source: string; caption: string }` (all required) per Pattern 1 lines 191-198 of RESEARCH.md.
- Figure/figcaption outer structure preserved verbatim (`my-12`, `figcaption mt-3 text-sm text-muted text-center italic`).
- Inner placeholder body ("Loading diagram…") preserved as the pre-render skeleton — same dashed border styling.
- `data-diagram-id={diagramId}` MUST remain on the wrapper element so Phase 3's already-shipped observer in this file still works (Phase 3 PLAN 03-03 task 5 lines 392-411 wires that observer; Phase 4 either replaces it or coexists with it per Open Question 3 in RESEARCH).

**IO observer pattern** — this is the key existing analog the planner should reference for the `<script>` block structure:

**Source:** `src/components/sections/AgenticAIExplainer.astro` after Phase 3 task 4 lands (per `.planning/phases/03-analytics-forms-notifications/03-03-PLAN.md` lines 336-358):
```astro
<script>
  import { track } from '../../lib/analytics';

  const sentinel = document.querySelector<HTMLElement>('[data-educator-end]');
  if (sentinel) {
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired) {
            fired = true;
            track('educator:scroll_complete', {});
            obs.disconnect();
          }
        }
      },
      { threshold: 1.0 }
    );
    obs.observe(sentinel);
  }
</script>
```

**Phase 4's adaptation** (per RESEARCH Pattern 1):
- Replace `threshold: 1.0` with `rootMargin: '200px 0px'` so render starts BEFORE the diagram is fully visible.
- Replace single sentinel with `document.querySelectorAll<HTMLElement>('.mermaid-slot')` loop — multiple instances per page.
- Replace direct `track(...)` call with the full async render path (`getMermaid()` → `mermaid.render()` → `slot.innerHTML = svg` → optional track call).
- Keep the `fired`/idempotency pattern via `io.disconnect()` on first intersection.
- Add a single shared module-scope `mermaidPromise` so multiple instances reuse one `import('mermaid')` call.

**Shared-module-promise pattern** (from RESEARCH Pattern 1 lines 219-237):
```typescript
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => {
      const mermaid = m.default;
      const isDark = document.documentElement.dataset.theme === 'dark';
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'strict',
        fontFamily: 'inherit',
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}
```

**Theme integration** — the `Base.astro` `<script is:inline>` block (lines 35-51) already reflects `prefers-color-scheme` into `document.documentElement.dataset.theme`. Phase 4 reads that exact value (`document.documentElement.dataset.theme === 'dark'`). No new theme wiring required.

**Error handling pattern** (from RESEARCH lines 247-252):
```typescript
try {
  const mermaid = await getMermaid();
  const renderId = `mermaid-render-${slot.id}`;
  const { svg } = await mermaid.render(renderId, source);
  slot.innerHTML = svg;
  track('diagram:view', { diagram_id: diagramId as 'pipeline-run' | 'ship-to-you' });
} catch (err) {
  console.error(`[MermaidDiagram] render failed for ${diagramId}:`, err);
  slot.innerHTML = '<p class="text-sm text-muted text-center italic">Diagram failed to load. <a href="/">Refresh the page</a> to retry.</p>';
}
```

**Phase 3 observer reconciliation** (Open Question 3 in RESEARCH): the planner must pick — (A) keep Phase 3's placeholder observer firing `diagram:view` on viewport entry, do NOT fire from Phase 4's render success path (recommended in RESEARCH A5/A8); OR (B) remove Phase 3's observer in this plan, fire only on render success. Pattern 1 in RESEARCH shows path B; the Open Question recommends path A. **Decision belongs to the plan, not the pattern map.**

**Accessibility pattern** (RESEARCH line 287): `role="img"` + `aria-label={`Diagram: ${caption}`}` on the slot wrapper. Caption-as-label means Mermaid's internal SVG nodes are not exposed to assistive tech (correct — Mermaid SVGs are not screen-reader-navigable). This matches the `aria-label="Stage: ..."` pattern already used in `src/components/cards/StageBadge.astro` line 13.

---

### `src/pages/index.astro` (route, request-response — MODIFY)

**Analog:** Itself (current state).

**Imports pattern** (lines 1-9):
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

const products = (await getCollection('products')).sort(
  (a, b) => a.data.order - b.data.order
);
---
```

**Composition pattern** (lines 16-28):
```astro
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

**Phase 4 modification (additive only):**
1. Add import: `import MermaidDiagram from '../components/diagrams/MermaidDiagram.astro';` (the path is already correct — no path drift from Phase 2; verified from `src/pages/products/[slug].astro` import style line 7 `import InterestForm from '../../components/forms/InterestForm.astro';`).
2. Insert `<MermaidDiagram diagramId="pipeline-run" source={...} caption="..." />` after `<AgenticAIExplainer />` (per RESEARCH line 160 component-responsibilities table).
3. Insert `<MermaidDiagram diagramId="ship-to-you" source={...} caption="..." />` between `<ProductGrid />` and `<ProblemPitchSection />` OR right before `<ProblemPitchSection />` (per RESEARCH line 160 — "before the 'tell us a problem' capture for DIAGRAM-02").
4. Diagram source strings can be inline `\`...\`` template literals or imported from a separate `src/diagrams/*.ts` constants file. Recommendation per RESEARCH line 167 directory note: keep them inline in `index.astro` for v1 (only 2 diagrams; pulling them into a constants file is over-engineering at this scale). Diagram-source content per RESEARCH lines 609-631.

**Composition-only constraint** (TECH-04, satisfied by Phase 2 SC#4): index.astro must remain composition-only — no business logic, no inline data. Diagram source strings are content, not logic, and inline-string literals ARE the existing convention (cf. `description="..."` literal on `<Base>` line 18). If the planner wants to keep index.astro pristine, the diagram source can move into the MermaidDiagram component itself as a `diagramId`-keyed lookup — but RESEARCH Pattern 1 shows the source-as-prop approach as preferred.

---

### `src/layouts/Base.astro` (layout — MODIFY)

**Analog:** Itself (current state).

**Existing head pattern** (lines 16-52):
```astro
<!doctype html>
<html lang="en" data-theme="auto">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>

    <!-- Self-hosted via Astro Fonts API (TECH-05: zero external font CDN) -->
    <Font cssVariable="--font-display" preload />
    <Font cssVariable="--font-body" preload />

    <!--
      Plumbing for Phase 4 dark-mode validation (D-10, D-11).
      Tailwind 4 already drives palette via @media (prefers-color-scheme: dark) in global.css.
      This script just reflects the user's preference into a data-theme attribute so
      the Phase 4 diagram runtime can read it without a second media query.
    -->
    <script is:inline>
      (function () {
        try {
          const mq = window.matchMedia('(prefers-color-scheme: dark)');
          const apply = () => {
            document.documentElement.setAttribute(
              'data-theme',
              mq.matches ? 'dark' : 'light'
            );
          };
          apply();
          mq.addEventListener('change', apply);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })();
    </script>
  </head>
```

**Phase 4 additions (additive only — between `<title>` and the `<Font>` tags or after the dark-mode `<script is:inline>`)**:

OG / Twitter / canonical meta block (per RESEARCH Code Examples lines 658-669, with absolute URLs because relative paths break on Slack/Twitter unfurlers):
```astro
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content="https://jigspec.com/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content={`https://jigspec.com${Astro.url.pathname}`} />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://jigspec.com/og.png" />
<link rel="canonical" href={`https://jigspec.com${Astro.url.pathname}`} />
<link rel="sitemap" type="application/xml" href="/sitemap-index.xml" />
```

Favicon meta block (current public/ has `favicon.ico` and `favicon.svg` only — no `<link rel="icon">` is currently emitted by Base.astro because Astro doesn't auto-inject one):
```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

**Existing convention to follow:** Base.astro uses simple HTML5 self-closing tags with absolute paths from site root for static assets (cf. how `<Font>` is used). New meta tags follow the same shape.

**Props expansion needed:** Current Props interface (lines 5-13) is `{ title?, description? }`. If the planner wants per-page OG images (e.g., a future `/products/[slug]` could pass `ogImage="..."`), expand to `{ title?, description?, ogImage? }` with default `ogImage = '/og.png'`. RESEARCH defers per-page OG to v2 (line 36, 711) — for v1, keep the OG image hardcoded to `/og.png`.

**CSP impact:** None. `og.png` is same-origin (`/og.png` resolves to `https://jigspec.com/og.png`), so no `img-src` change needed. Sitemap is same-origin XML. No new external hosts.

---

### `src/pages/404.astro` (route, NEW)

**Closest analog:** `src/pages/index.astro` (composition pattern with Base + Nav + main + Footer) and `src/pages/products/[slug].astro` (article-narrow content with Base + Nav + main + Footer + back-to-home link).

**Imports pattern** (mirroring `src/pages/index.astro` lines 2-5):
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/global/Nav.astro';
import Footer from '../components/global/Footer.astro';
---
```

**Composition pattern** — the **back-to-home link styling is already established** in `src/pages/products/[slug].astro` lines 42-48:
```astro
<a
  href="/"
  class="mt-12 inline-block text-accent hover:underline"
  data-event="nav:link_click"
  data-link-location="product-detail-back-home"
>
  ← Back to home
</a>
```

**Phase 4 404 body** (synthesized from RESEARCH Pattern 9 lines 439-451 + the back-link analog above):
```astro
<Base
  title="Not found · JigSpec"
  description="That page doesn't exist on JigSpec."
>
  <Nav />
  <main class="flex-1">
    <article class="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
      <p class="text-sm uppercase tracking-widest text-accent">404</p>
      <h1 class="font-display text-5xl md:text-6xl mt-4 text-fg leading-tight">
        Not found
      </h1>
      <p class="mt-6 text-xl italic text-muted">
        That page doesn't exist on JigSpec.
      </p>
      <a
        href="/"
        class="mt-12 inline-block text-accent hover:underline"
        data-event="nav:link_click"
        data-link-location="404-back-home"
      >
        ← Back to home
      </a>
    </article>
  </main>
  <Footer />
</Base>
```

**Pattern notes:**
- `max-w-3xl mx-auto px-6` matches the narrow content shell used in Hero, AgenticAIExplainer, ProblemPitchSection — consistent across the page.
- `data-event="nav:link_click"` + `data-link-location` — matches the convention established by Phase 3 PLAN 03-03 + the existing `[slug].astro` back-link (line 45-46). The delegated click listener in `Base.astro` (added by Phase 3) auto-fires `track('nav:link_click', { location: 'lookup-from-data-attr' })` — no per-page wiring needed.
- Eyebrow + display-headline + italic-muted-subline + back-link sequence is the established hero pattern (cf. `Hero.astro` lines 7-12, `AgenticAIExplainer.astro` lines 7-9, `[slug].astro` lines 30-34).
- No `text-center` is otherwise used in narrative sections — but `text-center` IS used in the existing `MermaidDiagram.astro` placeholder (line 11). 404 is a justified text-center context (single-purpose page).

**Vercel routing:** `vercel.json` already has `cleanUrls: true` and `trailingSlash: false` (lines 19-20). Per RESEARCH Pattern 9 lines 453-461 + Pitfall 4 lines 567-574, this combo serves `dist/404.html` automatically in 2026-04 Vercel — no `errorPage` directive needed unless soak proves otherwise. The existing `redirects` block (line 17) already routes `/.planning/(.*)` to `/404` with statusCode 404, so the 404 page IS already exercised by that redirect.

---

### `astro.config.mjs` (config — MODIFY)

**Analog:** Itself (current state, lines 1-33).

**Existing pattern** (verbatim):
```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jigspec.com',
  output: 'static',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [ /* ... */ ],
});
```

**Phase 4 modification** (per RESEARCH Code Examples lines 635-645):
```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jigspec.com',
  output: 'static',
  integrations: [sitemap()],  // <-- only change
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [ /* unchanged */ ],
});
```

**Pattern notes:**
- `site: 'https://jigspec.com'` is already set (line 7), which `@astrojs/sitemap` requires.
- `integrations: []` is already an array (line 9) — Phase 4 fills it for the first time.
- `npx astro add sitemap` will scaffold the import + integration entry automatically; planner can use that or hand-edit.
- Sitemap auto-discovers all routes including `/`, `/404`, `/products/[slug]` (5 product pages). No exclusion config needed for v1 (all routes are intended public).
- The current `redirects` block in `vercel.json` excludes `.planning/*` — this is irrelevant to sitemap because `.planning/` is excluded from the build artifact via `.vercelignore` (per DEPLOY-03).

**`public/robots.txt`:** Does not currently exist (verified: `ls public/` shows only `favicon.ico` + `favicon.svg`). Phase 4 may want to add `public/robots.txt` per RESEARCH lines 651-654:
```
User-agent: *
Allow: /

Sitemap: https://jigspec.com/sitemap-index.xml
```
This is a same-origin static asset (no CSP impact) and follows the existing `public/` asset convention.

---

### `public/og.png` and favicon family (assets, NEW)

**Existing convention:**
- Brand assets live at `public/` root (not `public/images/` or `public/static/`).
- Two favicons already shipped: `public/favicon.ico` (655 bytes) and `public/favicon.svg` (749 bytes).
- Same-origin via Vercel's static-asset CDN; no special headers needed.

**Phase 4 additions:**
- `public/og.png` — 1200×630, ≤300KB, editorial wordmark per RESEARCH line 31 + CLAUDE.md `Visual identity: Bolder & editorial`.
- `public/apple-touch-icon.png` — 180×180 PNG (matches `<link rel="apple-touch-icon">` in Base.astro patch).
- Optional: `public/favicon-32x32.png`, `public/favicon-16x16.png` for legacy browser support — current `favicon.svg` covers modern browsers; these legacy sizes are nice-to-have, not soak gates.

**No analog for asset CREATION (the actual image content):** Pattern map cannot extract a "how to draw an OG image" pattern from existing files. The plan must produce the asset itself; this pattern map only documents WHERE the file goes (`public/` root) and WHAT meta tags reference it (Base.astro patch above).

**Asset reference convention:** Absolute URLs for OG (`https://jigspec.com/og.png`) per RESEARCH line 671; root-relative for favicon (`/favicon.svg`) per existing convention.

---

### `vercel.json` (config — POTENTIAL MODIFY, only if soak fails)

**Analog:** Itself (current state, lines 1-21).

**Existing pattern:** see Read above. CSP is locked, `cleanUrls: true`, `trailingSlash: false`, plus a `redirects` block that already maps `.planning/*` to `/404`.

**Phase 4 conditional modification** — per RESEARCH Pattern 9 lines 463-468 + Pitfall 4: ONLY add a 404 routing fix to `vercel.json` if soak verification step proves Vercel serves its default 404 instead of `dist/404.html`. The default behavior in 2026-04 IS to serve `dist/404.html`, so this should be untouched. If soak fails, add:
```json
"errorPage": { "404": "/404" }
```
(Or — riskier — a catch-all `rewrites` rule, which RESEARCH explicitly warns against unless the simpler `errorPage` doesn't work.)

**CSP unchanged:** RESEARCH explicitly confirms (lines 22-23) that Phase 4 ships no new external hosts. Mermaid is bundled (same-origin), `og.png` is same-origin, sitemap is same-origin XML. The current `script-src 'self' https://us-assets.i.posthog.com` (line 12) and `connect-src 'self' https://us-assets.i.posthog.com https://us.i.posthog.com` are sufficient.

**Phase 3 will already have added** `'unsafe-inline'` to `script-src` (per `03-03-PLAN.md` task 6 lines 432-449). Phase 4 inherits that and does not need to modify CSP further.

---

### `.planning/phases/04-diagrams-polish-preview-soak/04-NN-SUMMARY.md` (artifact, NEW)

**Closest analog:** `.planning/phases/02-content-static-page/02-05-doc-drift-and-phase-verification-SUMMARY.md` (16980 bytes) — the canonical "phase verification + soak-style summary" precedent in this repo. Other SUMMARY files in `02-content-static-page/` are more like task-completion records; the `02-05` one is closest to the soak protocol artifact Phase 4 produces.

**Convention from existing summaries (reading file metadata; the planner should Read the file directly when authoring the soak summary):**
- File naming: `{padded-phase}-{padded-plan}-{slug}-SUMMARY.md` (e.g., `02-05-doc-drift-and-phase-verification-SUMMARY.md`).
- Phase 4 plans should follow the same pattern: `04-NN-{slug}-SUMMARY.md` with NN = plan number, slug = plan name.
- One SUMMARY per plan (sibling to PLAN files); for the soak gate specifically, the LAST plan's SUMMARY records the 16-item PITFALLS measurements.

**No code excerpt to extract** — this is a doc artifact, not a code file. The plan should record actual numerical measurements (Lighthouse score numbers, ingestion-warning count, console-error count) per RESEARCH line 564.

## Shared Patterns

### Component-scoped `<script>` block convention (NOT `is:inline`)

**Source:** `src/components/sections/AgenticAIExplainer.astro` (after Phase 3 task 4) + `src/components/global/Nav.astro` lines 61-78 (currently shipped):

```astro
<script>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      // ...
    });
  }
</script>
```

**Apply to:** `MermaidDiagram.astro` (Phase 4 rewrite).

**Rule (per Phase 3 PLAN 03-03 task 2 lines 251-253):** Component scripts that import from `src/lib/` MUST NOT use `is:inline`. `is:inline` is reserved for `Analytics.astro` (PostHog snippet only). All other scripts are bundled by Astro/Vite, can use TypeScript and ES imports, and run module-scoped on the page they appear on.

### Analytics integration pattern

**Source:** `src/lib/analytics.ts` (will exist after Phase 3 plan 03-02 lands; per `03-02-PLAN.md` lines 25-28, exports `EventName`, `EventProps`, `track`, `identify`, `captureSurveyResponse`, `captureProblemPitch`).

**Apply to:** `MermaidDiagram.astro` only (the only Phase 4 file that fires events directly). Other Phase 4 files (Base.astro patch, 404, og.png, sitemap) emit no events.

**Import path convention:** `import { track } from '../../lib/analytics';` from any `src/components/**/*.astro` (verified across `AgenticAIExplainer.astro` task 4 line 338, `MermaidDiagram.astro` task 5 line 394, `Base.astro` task 2 line 265 of `03-03-PLAN.md`).

**Event-firing rule (ANALYTICS-02):** Direct `posthog.capture(...)` calls are forbidden outside `src/lib/analytics.ts`. The grep guard `npm run analytics-audit` enforces this (per `03-02-PLAN.md` line 255). Phase 4 honors this by routing all firing through `track('diagram:view', ...)`.

### Aria-label-with-template-literal pattern

**Source:** `src/components/cards/StageBadge.astro` line 13:
```astro
<span class={variants[stage]} aria-label={`Stage: ${stage}`}>{stage}</span>
```

**Apply to:** `MermaidDiagram.astro` slot wrapper:
```astro
<div ... role="img" aria-label={`Diagram: ${caption}`}>
```

Single announcement to assistive tech; no per-node SVG navigation. Justified per RESEARCH line 287.

### Eyebrow + display-headline + italic-muted-subline narrative pattern

**Source:** `src/components/sections/Hero.astro` lines 7-11, `src/components/sections/AgenticAIExplainer.astro` lines 7-9, `src/pages/products/[slug].astro` lines 30-34:
```astro
<p class="text-sm uppercase tracking-widest text-accent">[Eyebrow text]</p>
<h1 class="font-display mt-4 text-5xl md:text-6xl leading-tight tracking-tight text-fg">
  [Headline]
</h1>
<p class="mt-6 text-xl italic text-muted">
  [Sub-line]
</p>
```

**Apply to:** `src/pages/404.astro` content shell (mirrors the convention exactly). Diagrams use figure+figcaption (already in MermaidDiagram skeleton) — different visual idiom, no overlap.

### `data-event` + delegated-listener pattern

**Source:** `src/components/cards/ProductCard.astro` lines 26-27:
```astro
data-event={eventName}
data-product-id={product.id}
```

And `src/pages/products/[slug].astro` lines 45-46:
```astro
data-event="nav:link_click"
data-link-location="product-detail-back-home"
```

**Apply to:** `src/pages/404.astro` back-to-home link uses `data-event="nav:link_click"` + `data-link-location="404-back-home"`. The Base.astro delegated click listener (Phase 3 PLAN 03-03 task 2) auto-fires the typed `track()` call — no per-page handler.

### Same-origin static asset convention

**Source:** `public/favicon.svg`, `public/favicon.ico` (existing), referenced in HTML as `/favicon.svg`.

**Apply to:** `public/og.png` (referenced as absolute URL `https://jigspec.com/og.png` in OG meta — exception to the root-relative rule, justified by social-unfurler bugs per RESEARCH line 671), `public/apple-touch-icon.png`, optional `public/robots.txt`.

### Site-wide narrow-content shell pattern

**Source:** `src/components/sections/Hero.astro`, `src/components/sections/AgenticAIExplainer.astro`, `src/components/sections/ProblemPitchSection.astro`, `src/pages/products/[slug].astro` all use:
```astro
<div class="max-w-3xl mx-auto px-6 py-{N} md:py-{M}">
```

Or for grids/cards: `max-w-5xl` (Nav, Footer) / `max-w-6xl` (ProductGrid). Narrow content (essay-style) is `max-w-3xl`.

**Apply to:** `src/pages/404.astro` `<article class="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">`. Diagrams INSIDE `<MermaidDiagram>` should NOT impose their own max-width — they live inside the section that wraps them (the index.astro composition determines width).

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| (none) | — | — | Every Phase 4 file has at least one strong analog in this codebase. |

The closest "no analog" candidate would be the OG image (visual asset), but the *reference pattern* (where the file goes, how it's referenced) is fully covered by the existing favicon convention.

## Forward Markers (for the planner)

| Concern | Where to read | Decision needed |
|---------|---------------|-----------------|
| Phase 3 observer vs Phase 4 render-success observer for `diagram:view` | RESEARCH Open Question 3 (lines 714-718) + this map's `MermaidDiagram.astro` section | Plan must pick A (keep Phase 3 observer, Phase 4 doesn't fire) or B (remove Phase 3 observer, Phase 4 fires from render success). RESEARCH recommends A. |
| Source-as-prop vs lookup-by-id for diagram source | RESEARCH Pattern 1 lines 188-198 vs alternative | Plan should pick source-as-prop (Pattern 1 default) for v1 simplicity. |
| Whether to install `eslint-plugin-jsx-a11y` for Pattern 6 | RESEARCH Pattern 6 lines 366-396 | Optional; v1 does not require automated a11y lint. Manual a11y soak is the gate. |
| Per-page OG image override | This map's Base.astro section | Defer to v2 blog phase. v1 hardcodes `/og.png`. |

## Metadata

**Analog search scope:**
- `/src/components/**/*.astro` (5 directories: cards, diagrams, forms, global, sections)
- `/src/pages/**/*.astro` (index + products/[slug])
- `/src/layouts/Base.astro`
- `/src/styles/global.css`
- `/src/content.config.ts`
- `/public/`
- Phase 3 PLAN files (`03-02-PLAN.md`, `03-03-PLAN.md`) for the analytics-wrapper + IO-observer contracts that are Phase-3-shipped-but-not-yet-on-disk

**Files scanned:** 18 source files + 3 config files + 4 phase-3 plan files = 25 files

**Pattern extraction date:** 2026-04-30

**Confidence:** HIGH for code patterns (every Phase 4 file has a strong sibling); MEDIUM-HIGH for Phase-3-derived contracts (read from PLAN files, not yet on disk — slightly higher drift risk than reading shipped code).
