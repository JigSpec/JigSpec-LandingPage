# Project Research Summary

**Project:** JigSpec Landing Page
**Domain:** Company-level marketing landing page for an agentic-AI product studio, structured as a demand-discovery instrument (1 shipping product + 4 concept probes), replacing the apex docs site
**Researched:** 2026-04-27
**Confidence:** HIGH

## Executive Summary

This is a marketing landing page that is *structurally* a survey instrument: every section either earns the visitor's right to engage with the 5 product cards, or captures the demand signal those cards generate. The locked stack (Astro 6 + Tailwind 4 + PostHog + Mermaid + Vercel/Cloudflare) is exactly the 2026-converged path for content-shaped marketing sites that need to grow into a blog. Research converged strongly on the build path: a static-first Astro site with one file per product in a typed content collection, a single typed analytics wrapper enforcing event taxonomy, lazy-loaded (or build-time-rendered) Mermaid diagrams, and a strict separation between deploy and DNS cutover.

The page's *primary job* is producing a clean per-card demand ranking after 4–8 weeks of traffic. Two cross-cutting findings make that job load-bearing for the architecture: (1) the PostHog event taxonomy must be designed before any forms or cards are built, because event names are how the demand signal becomes legible — a single typo or naming drift corrupts the ranking; and (2) the buggerd post-mortem (visitors didn't realize buggerd was agentic AI) is the dominant copy/IA risk and shapes the entire above-the-fold sequence (hero → educational explainer → diagram 1 → cards). All four researchers independently flagged these as critical. The recommended approach is a 9-phase build that puts copy/voice and visual sketches early-and-parallel, instruments analytics *before* forms, treats the cutover as its own gated phase, and explicitly defers anything that distracts from demand-signal capture.

The top risk is not a stack choice — it's *signal contamination from execution drift*: an under-polished editorial aesthetic (Pitfall 7) reads as "junk drawer" (Pitfall 2), card stage labels missing or inconsistent muddy the ranking (Pitfall 4), an unwired PostHog notification destination loses the launch-window leads (Pitfall 5), and a DNS swap without a redirect map permanently damages the developer-docs audience (Pitfall 3). The roadmap must treat each of these as a phase gate, not a polish item.

## Key Findings

### Recommended Stack

The locked stack (per PROJECT.md) is correct and current. The non-obvious decisions live one layer down: use the `@tailwindcss/vite` plugin (NOT the deprecated `@astrojs/tailwind` integration), skip the `@astrojs/vercel` adapter for v1 (pure static deploys directly), and use Astro 6's built-in Fonts API to self-host typography (eliminates the external font CDN from CSP). MDX, sitemap, and content-collections schemas should be installed in v1 so the deferred blog ships without a re-platform.

**Core technologies:**
- **Astro 6 (`^6.1`)** — static site generator, content collections, page routing — released March 2026 with stable Fonts API and Content Security Policy support; forward-compatible with the deferred blog
- **Tailwind 4 via `@tailwindcss/vite` (`^4.2`)** — utility-first styling — Lightning CSS engine; the official Astro path since 5.2
- **`posthog-js` (`^1.371`)** — anonymous analytics + identify-on-submit — `cookieless_mode` solves no-banner; custom events give per-card ranking; `autocapture: false` prevents low-signal noise
- **`astro-mermaid` (`^2.0.1`)** — client-rendered Mermaid — auto-discovers fences in `.md`/`.mdx`/`.astro`; lazy-loads ~760KB runtime; theme-aware (build-time SVG is conflict-zone, see Conflicts)
- **Vercel + Cloudflare** — auto-deploy from `main`; mirror buggerd's `vercel.json` with PostHog hosts in CSP

**Forbidden in v1:** `@astrojs/tailwind` (deprecated), Tailwind CDN, PostHog `autocapture: true`, `@astrojs/vercel` adapter, eager Mermaid, Mermaid CDN, blog content (folder reserved), `pages/docs/` (don't pre-stage deferred docs).

### Expected Features

**Must have (table stakes — 11 items):**
- TS-1 Apex hero with falsifiable contrastive sub-line
- TS-2 "What is agentic AI" educational section, ~250–400 words, structurally treated
- TS-3 5-card product grid (equal visual footprint)
- TS-4 Per-card interest form (email + REQUIRED qualitative free-text field)
- TS-5 "Tell us a problem" general capture
- TS-6 PostHog analytics in hybrid mode (no `autocapture`)
- TS-7 Mermaid Diagram 1 (pipeline runtime, MUST visibly show review gates)
- TS-8 Mermaid Diagram 2 (ship-to-you process)
- TS-9 Footer with docs link + contact
- TS-10 Mobile-responsive layout (diagrams need explicit mobile redesign)
- TS-11 Apex DNS cutover (final, gated)

**Should have (differentiators):**
- D-1 Three-state honesty pills (`Shipping` / `Probe` / `Sibling`)
- D-2 Editorial / tech-publication aesthetic (distinct from buggerd)
- D-7 Spec-first / reliability copy thread
- D-8 "The page is the methodology" copy beat

**Defer (v1.x or v2+):** blog content, niche landing pages, A/B testing, newsletter signup, customer testimonials, hosted docs subdomain content migration (subdomain *hosting* is a Phase 9 prerequisite — see Conflicts), authentication, live demo.

**Anti-features (full list of 17 in FEATURES.md):** no testimonials/logos, no fabricated metrics, no live demo, no pricing page, no auth, no mega-menu, no sticky CTA, no auto-personalization, no Lottie hero, no live chat, no cookie banner, no Notion runtime dependency.

### Architecture Approach

Single-page static Astro site with three runtime concerns delegated to third parties (PostHog, Mermaid, Vercel). Everything else is build-time: data lives as typed content collections (one `.md` per product), layout lives as `.astro` components, the index page composes section components in narrative order. All event firing routes through a single typed `lib/analytics.ts` wrapper whose first argument is a string-literal union — direct calls to `window.posthog.capture` are forbidden by convention.

**Major components:**
1. **`src/content/products/*.md`** — one file per product, Zod-validated; `cta.kind` discriminated union (`external` | `interest`)
2. **`src/components/sections/`** — page-section components in `index.astro` reading order
3. **`src/components/cards/ProductCard.astro`** + **`forms/InterestForm.astro`** — single form primitive parameterized by `productId`
4. **`src/components/diagrams/MermaidDiagram.astro`** — lazy island via IntersectionObserver + dynamic `import('mermaid')`
5. **`src/lib/analytics.ts`** — typed `track(eventName, props)` + `identify()`; single source of truth for event taxonomy
6. **`src/components/global/Analytics.astro`** — PostHog inline snippet, requires `is:inline`

### Critical Pitfalls (Top 5, ranked by impact-to-core-value)

1. **Demand-signal contamination (Pitfall 4)** — three-state stage labels, required qualitative field on every form, demand-ranking metric committed in writing pre-launch
2. **Buggerd recognition failure repeated at company scope (Pitfall 1)** — educational section structurally treated (200–400 words with contrast table); falsifiable hero claim; review gates visible in Diagram 1; cold-read external validation before launch
3. **Apex cutover collateral damage (Pitfall 3)** — docs subdomain live BEFORE cutover; Cloudflare redirect map deployed; persistent header banner for 4–8 weeks; ≥3 docs users validate preview deploy; 404 monitoring active day 1
4. **PostHog Surveys notification gap (Pitfall 5)** — wire Slack or Zapier-to-Gmail webhook on day one (15 min); filter to non-empty qualitative fields; document Tally fallback trigger condition
5. **Editorial aesthetic landing at 70% — worse than minimal at 95% (Pitfall 7)** — explicit "editorial 90%+ vs. minimal-tech-distinct-from-buggerd 95%" pre-build call; visual sketch comparison parallel to copy sketch; 3-element typographic scale + 4-color palette before layout; external designer review

## Cross-Cutting Findings

| Finding | Confirmed by | Implication |
|---------|--------------|-------------|
| PostHog event taxonomy must be designed before any cards or forms | STACK + ARCHITECTURE + PITFALLS | Phase ordering: analytics scaffolding precedes forms; event names in TypeScript union from day 1 |
| Buggerd post-mortem informs entire above-the-fold sequence | FEATURES + PITFALLS | Educational explainer is structural, not decorative; cold-read is launch gate |
| Mermaid diagrams are load-bearing positioning | FEATURES + ARCHITECTURE + PITFALLS | Diagrams need styling budget, mobile-redesign budget, caption fallback |
| Single typed analytics wrapper non-negotiable | STACK + ARCHITECTURE + PITFALLS | Direct `window.posthog.capture` forbidden |
| Cutover is a separate, gated phase | ARCHITECTURE + PITFALLS | Phase 9 gate criteria are checklist items, not a date |
| Equal visual footprint, unequal CTA posture | FEATURES + ARCHITECTURE + PITFALLS | Visual equality in *footprint*, not in *call-to-action* |
| Don't pre-stage docs migration in this codebase | ARCHITECTURE + PITFALLS | No `pages/docs/`; reserve only `pages/blog/` |

## Conflicts That Need Resolution

1. **PostHog Surveys vs. `posthog.capture`** — PROJECT.md says Surveys; STACK recommends bare `posthog.capture`; PITFALLS notes Surveys notification gap is closeable on free tier. **Recommended:** Surveys + Slack webhook.

2. **Docs migration: "deferred dependency" vs. "partially required before cutover"** — PROJECT.md treats as deferred; PITFALLS notes hosting location is a hard cutover prerequisite. **Recommended:** split into (a) "where do docs live post-cutover?" (decide now) and (b) "when is content migration done?" (defer). Phase 9 gates on (a).

3. **Mermaid: lazy-load vs. build-time SVG** — STACK and ARCHITECTURE lean lazy-load; PITFALLS argues build-time SVG. **Recommended:** start lazy-load; migrate to build-time SVG if mobile-perf gate fails.

4. **Designer availability for editorial aesthetic** — surfaced by PITFALLS, not addressed in PROJECT.md. **Recommended:** explicit pre-build call; viable fallback is minimal-tech-but-distinct-from-buggerd.

## Unified Build Order

### Phase 1: Scaffold + Sketches (parallel tracks)
**Rationale:** Scaffold first so every subsequent phase ships a real preview URL. Sketches in parallel because Phase 2 needs both decisions.
**Delivers:** Deployed empty Astro site; two voice candidates rendered; two visual treatments rendered; "editorial 90%+ or minimal-tech 95%" decision documented.
**Avoids:** Pitfalls 1, 7.

### Phase 2: Layout shell + IA/wireframe
**Rationale:** Anchors visual identity before content; locks card chrome and badges for Pitfall 2 prevention.
**Delivers:** `Base.astro`, `Nav.astro`, `Footer.astro`, typography scale, palette tokens, `index.astro` with placeholder section blocks; documented card chrome + badge system.
**Avoids:** Pitfall 2.

### Phase 3: Content collections + product data
**Rationale:** Schema before components; copy editing parallel-safe once schemas exist.
**Delivers:** `src/content/config.ts` Zod schemas for `products` and placeholder `blog`; 5 product `.md` files validated; `site.json`; empty `pages/blog/` reserved (NOT `pages/docs/`).

### Phase 4: Section components (no analytics, no forms)
**Rationale:** Page exists end-to-end as static document; stakeholder review possible.
**Delivers:** Hero, WhatIsAgenticAI, ProductGrid, ProductCard, ProblemPitchSection (placeholder), Pipeline+ShipToYou diagrams (placeholders), Nav, Footer.
**Avoids:** Pitfall 1 (cold-read validation).

### Phase 5: Analytics scaffolding (BEFORE forms)
**Rationale:** Forms need `track()`; canary events prove pipeline before high-stakes UI fires.
**Delivers:** PostHog snippet in head; `lib/analytics.ts` with full event-name union, typed `track()` + `identify()`; `nav:link_click` and `page:home_view` canary events; PostHog receiving events from preview verified.
**Avoids:** Pitfall 4 (event-naming drift).

### Phase 6: Forms + PostHog notification destination
**Rationale:** Highest-stakes event source; notification wires HERE, not later.
**Delivers:** `InterestForm`, `ProblemPitchForm`, `FormStatus`; per-card forms with `productId` prop; `identify(email)` then `track()`; webhook destination wired and verified; weekly calendar reminder set; Tally fallback trigger documented.
**Avoids:** Pitfalls 4 (qualitative field required), 5 (notification gap closed).

### Phase 7: Mermaid diagrams (lazy-load OR build-time SVG decision)
**Rationale:** 700KB dependency last; analytics already verifies `diagram:view`.
**Delivers:** `MermaidDiagram.astro` lazy island + two diagrams; mobile rendering verified at 320/375/414px; one-sentence caption under each diagram.
**Avoids:** Pitfall 6.

### Phase 8: Polish + soak
**Rationale:** Combines architecture researcher's "Polish" and "Deploy + soak" — same gate criteria.
**Delivers:** Responsive QA, OG image, favicon, custom 404, copy passes, a11y audit, Lighthouse ≥95, production build on `jigspec.vercel.app`, 24–48h soak with no errors, demand-ranking metric committed in writing, "Looks Done But Isn't" 16-item checklist verified, external designer review (Pitfall 7) and external cold-read (Pitfall 1) completed.
**Avoids:** Pitfalls 1, 4, 7 verification gates.

### Phase 9: Cutover (gated)
**Rationale:** Atomic and irreversible-on-internet.
**Delivers:** DNS swap; jigspec.com serves marketing page; persistent header banner deployed; 404 monitoring active.
**Gate criteria (ALL required):**
- (a) `docs.jigspec.com` (or chosen subdomain) live and serving VitePress content
- (b) Cloudflare Page Rules / Bulk Redirects redirect map deployed
- (c) Persistent header banner deployed in code
- (d) ≥3 known docs users validated preview deploy
- (e) 404 monitoring alert configured

### Phase Ordering Rationale
- Topological sort: forms need analytics, components need content, content needs schemas, schemas need a project
- Sketches in Phase 1 because Phase 2 needs both decisions
- Analytics before forms because forms are highest-stakes event source
- Diagrams in Phase 7 (after forms) because diagrams fire `diagram:view`
- Cutover as its own phase because DNS rollback ≠ code rollback

### Research Flags
- **Phase 1 (Sketches):** Editorial visual aesthetic references and typographic scale need designer-grade research
- **Phase 7 (Diagrams):** Build-time SVG migration via `@rendermaid/core` if perf gate fails
- **Phase 9 (Cutover):** Cloudflare Bulk Redirects vs. Page Rules; legacy URL pattern list; docs subdomain hosting choice

Standard patterns (skip deeper research): Phases 2, 3, 4, 5, 6, 8.

## Open Questions for User Resolution

1. **PostHog Surveys vs. `posthog.capture` API decision** — Recommended: Surveys + Slack/Zapier webhook
2. **Docs subdomain commitment** — Recommended: `docs.jigspec.com` now; pointing existing VitePress build there before content migration completes
3. **Demand-ranking metric definition** — Recommended: adopt FEATURES.md formula; commit N=5 submissions/card threshold and 4-week minimum window
4. **Designer availability for editorial aesthetic** — Recommended: explicit pre-build call; minimal-tech-distinct-from-buggerd is viable fallback

## Stack Snapshot (Phase 1 Reference)

```bash
npm create astro@latest -- --template minimal --typescript strict
npm install tailwindcss @tailwindcss/vite
npm install astro-mermaid mermaid
npx astro add mdx
npx astro add sitemap
npm install posthog-js
```

`astro.config.mjs`: `site: 'https://jigspec.com'`, `output: 'static'`, integrations `[mermaid({theme:'default',autoTheme:true}), mdx(), sitemap()]` (mermaid MUST be first), `vite.plugins:[tailwindcss()]`, Fonts API for Inter (sans) + Crimson Pro (serif).

`vercel.json`: mirror buggerd; CSP `script-src` adds `https://us-assets.i.posthog.com`; `connect-src` adds both PostHog hosts; `cleanUrls: true`, `trailingSlash: false`; redirect `/.planning/(.*)` → `/404`.

PostHog: `<script is:inline>` REQUIRED; init with `person_profiles: 'identified_only'`, `defaults: '2026-01-30'`, `capture_pageview: true`, `capture_pageleave: true`, `autocapture: false`.

Form pattern: submit handler calls `posthog.identify(email, {email, first_signup_location})` THEN `posthog.capture('email_signup', {location, email})`.

`tsconfig.json`: strict; alias `@/*` → `src/*`.

## Feature MVP

**Minimum to produce signal at all:** TS-3, TS-4 (with required qualitative field), TS-5, TS-6, TS-9, TS-10.

**Required for *quality* signal (without these, signal is contaminated):** TS-1 (falsifiable contrastive claim), TS-2 (structural educational section), TS-7 (Diagram 1 with visible review gates), D-1 (honesty pills), TS-8 (Diagram 2 ship process).

**Polish that improves signal-to-noise but not strictly MVP:** D-2, D-7, D-8.

**TS-11 (apex DNS cutover) is NOT MVP** — gated final step after MVP ships at preview URL.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official docs late April 2026; one MEDIUM-HIGH on Surveys-vs-capture (opinionated simplification) |
| Features | HIGH | Grounded in PROJECT.md, buggerd post-mortem, competitor analysis, strategy notes |
| Architecture | HIGH | Astro patterns from official docs; PostHog from posthog.com; pattern matched against buggerd reference |
| Pitfalls | HIGH | Project-specific, not generic; PostHog notification gap correction verified |

**Overall confidence:** HIGH

### Gaps to Address

- Visual aesthetic execution risk → designer time-budget decision before Phase 2
- Demand-ranking metric weights and threshold → written commitment before launch (Phase 8 deliverable)
- Docs subdomain hosting decision → research flag on Phase 9
- Mermaid build-time SVG fallback path → research flag on Phase 7 if perf gate fails
- Card order rationale → Phase 3 decision when product `.md` files authored

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`
- `.planning/PROJECT.md`
- [Astro 6 release post](https://astro.build/blog/astro-6/)
- [Tailwind CSS install for Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [PostHog Astro docs](https://posthog.com/docs/libraries/astro)
- [PostHog event naming best practices](https://posthog.com/questions/best-practices-naming-convention-for-event-names-and-properties)
- [PostHog Surveys webhook docs](https://posthog.com/docs/surveys/webhook)
- [astro-mermaid GitHub](https://github.com/joesaby/astro-mermaid)
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections)

### Secondary (MEDIUM confidence)
- `/Users/kjs/Documents/Business/Buggerd/index.html` and `vercel.json`
- `/Users/kjs/Documents/Business/jigspec/competitor_angles.md`
- `/Users/kjs/Documents/Business/jigspec-strategy-notes.md`
- [Rick Strahl — Lazy Loading Mermaid](https://weblog.west-wind.com/posts/2025/May/10/Lazy-Loading-the-Mermaid-Diagram-Library)
- [@rendermaid/core](https://jsr.io/@rendermaid/core) and [headless-mermaid](https://github.com/muhammadmuzzammil1998/headless-mermaid)
- [Cloudflare apex DNS docs](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-zone-apex/)

### Tertiary (LOW confidence)
- CSP example values — verify on actual deploy
- Demand-ranking formula weights — calibrate after first 200 sessions
- Mermaid bundle size estimates — verify on actual build

---
*Research completed: 2026-04-27*
*Ready for roadmap: yes*
