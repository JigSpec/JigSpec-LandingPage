# Roadmap: JigSpec Landing Page

## Overview

The JigSpec landing page is built in five phases that move strictly from "scaffold + visual decisions" to "static document anyone can read" to "instrumented + lead-capturing" to "polished + soaked at preview" to "cutover at the apex." Each phase exists to gate a specific class of failure: Phase 1 gates the editorial-aesthetic execution risk (Pitfall 7) by forcing a sketch comparison before any layout commits; Phase 2 gates the agentic-recognition failure (Pitfall 1) and junk-drawer read (Pitfall 2) by producing a complete static document that a cold-read reviewer can evaluate before any form/analytics/diagram noise; Phase 3 gates demand-signal contamination (Pitfall 4) and the PostHog notification gap (Pitfall 5) by wiring analytics *before* forms and the webhook destination on day one; Phase 4 gates Mermaid degradation (Pitfall 6) and final polish (Pitfall 7); Phase 5 gates apex-cutover collateral damage (Pitfall 3) with five concrete sub-criteria from DEPLOY-04. The page must exist as a real preview URL from end of Phase 1; the apex must not move until every Phase 5 gate criterion is checked.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Scaffold, Sketches & Visual Shell** - Astro/Tailwind/Vercel project building; two voice/visual sketches compared and one direction picked; layout shell with typography scale, palette, and responsive nav/footer deployed to a preview URL.
- [ ] **Phase 2: Content & Static Page** - Typed content collections, six product Markdown files, all home-page section components (hero, explainer, card grid with whole-card-clickable navigation, problem-pitch, diagram placeholders, footer) rendering end-to-end as a reviewable static document; per-concept landing pages at `/products/[slug]` rendered from the same content collection via a single dynamic-route template; no analytics, no working forms, no Mermaid runtime yet.
- [ ] **Phase 3: Analytics, Forms & Notifications** - PostHog snippet + typed analytics wrapper with full event-name union; canary events verified end-to-end on preview; per-card interest forms + general problem-pitch capture wired with identify-on-submit; notification destination (Slack or Zapier-to-Gmail) wired and proven by a test submission; PostHog dashboard live; demand-ranking metric committed in writing.
- [ ] **Phase 4: Diagrams, Polish & Preview Soak** - Mermaid lazy-load island + two diagrams rendering; mobile rendering verified at 320/375/414px; OG image, favicon, custom 404, accessibility audit, Lighthouse ≥95; external cold-read review completed; production preview URL serving without errors for ≥24h.
- [ ] **Phase 5: Apex DNS Cutover (Gated)** - jigspec.com swapped from the existing VitePress site to this Astro site, gated on five concrete prerequisites (docs subdomain live, redirect map deployed, header banner deployed, ≥3 docs users validated, 404 monitoring configured).

## Phase Details

### Phase 1: Scaffold, Sketches & Visual Shell
**Goal**: A real preview URL exists with the chosen visual identity (typography scale, palette, nav, footer, responsive shell) committed — and the editorial-vs-minimal-tech aesthetic decision is made *before* any content lands, so the rest of the build cannot drift into 70%-editorial territory.
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, TECH-05, VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. A Vercel preview URL serves the empty Astro shell over HTTPS, auto-deployed from `main` of the new `JigSpec/jigspec-landing` (or similarly-named) GitHub repo, with `vercel.json` mirroring buggerd's security headers (HSTS, X-Frame-Options DENY, CSP including the PostHog hosts in `script-src` and `connect-src`, Permissions-Policy) and `cleanUrls: true` / `trailingSlash: false`.
  2. Two sketch artifacts exist in `.planning/sketches/` — one Confident-&-Direct, one Engineering-Blog-Pragmatic — each rendering hero + one card + diagram-1 area; the user has reviewed both and the chosen direction (and the explicit "editorial 90%+ vs. minimal-tech 95%" call) is recorded as a Key Decision in PROJECT.md.
  3. The shell uses a 3-element typographic scale (display / body / micro) with a self-hosted display face via Astro's Fonts API (no external font CDN), a palette of ≤4 colors, and is verifiably distinct from buggerd at first glance (different typeface, different accent — not emerald-600 — different chrome) when screenshot side-by-side.
  4. The shell renders legibly at 320px / 375px / 414px / desktop with a working nav (collapses appropriately on mobile) and footer, all from `Base.astro` + `Nav.astro` + `Footer.astro`.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Content & Static Page
**Goal**: A complete, reviewable static document exists at the preview URL — every section rendered, every card present with its stage badge, every CTA visible (but not yet functional) — so a cold-read reviewer can tell us whether the page communicates "agentic-AI studio with a reliability claim" before we wire up any noise.
**Depends on**: Phase 1
**Requirements**: TECH-02, TECH-03, TECH-04, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-08, CONTENT-09
**Success Criteria** (what must be TRUE):
  1. The preview URL serves the home page end-to-end with hero (falsifiable contrastive sub-line), 250–400-word "What is agentic AI" educational section (with a contrast element), 6-card product grid with equal visual footprint and `Shipping` / `Probe` / `Sibling` badges, "Tell us a problem we should solve" section with form-shaped placeholder, and footer (docs link, contact email, GitHub org link, copyright).
  2. The 6 product cards (buggerd, scientific-paper-agent, triage-router-bot, recorder-extractor, agentic-employees, delegate) each load from `src/content/products/{slug}.md` validated by a Zod schema with a discriminated `cta` union (`external` for buggerd → buggerd.com, `interest` for the other 5); adding a 7th card would require adding only one Markdown file.
  3. The whole surface of every card is a clickable link (not just an inline button); clicking buggerd opens `https://buggerd.com` in a new tab, clicking any concept card navigates to `/products/[slug]` on this site. Each `/products/[slug]` page is rendered by a single dynamic-route template (`pages/products/[slug].astro`) that pulls headline + 200–400 word longer-form description + a placeholder for the embedded interest form (Phase 3 wires the form) from the same content collection, and reuses Nav/Footer.
  4. `pages/index.astro` is composition-only — imports section components in narrative order, contains zero business logic and zero inline data; `src/content/config.ts` also reserves an empty `blog` collection schema so v2 ships without re-platform.
  5. A cold-read reviewer (someone who has not seen the page in development) can articulate within 60 seconds what JigSpec does and how it differs from generic agentic-AI noise; if not, hero / explainer / card framing is iterated before Phase 3 begins.
  6. All copy passes the honesty audit — no testimonials, no "trusted by" logos, no fabricated metrics, no "industry-leading" superlatives.
**Plans:** 5 plans
Plans:
- [x] 02-01-content-collection-PLAN.md — Astro 6 content collection (src/content.config.ts) + 6 product markdown files with discriminated cta union
- [x] 02-02-section-and-card-components-PLAN.md — 9 components: 4 sections, 2 cards (block-link), 2 form-shaped placeholders, 1 Mermaid placeholder shell
- [x] 02-03-index-composition-PLAN.md — Composition-only src/pages/index.astro rendering Hero → Explainer → Grid → ProblemPitch in narrative order
- [x] 02-04-product-detail-route-PLAN.md — Single dynamic route src/pages/products/[slug].astro generating 5 detail pages (buggerd excluded by cta-type filter)
- [ ] 02-05-doc-drift-and-phase-verification-PLAN.md — Patch src/content.config.ts path drift in REQUIREMENTS/ROADMAP, wire npm run honesty-audit, full Phase 2 verification chain + human cold-read checkpoint
**UI hint**: yes

### Phase 3: Analytics, Forms & Notifications
**Goal**: The page captures clean, attributable demand signal — every event flows through one typed wrapper with no naming drift, every form submission identifies the user before the event fires and triggers an external notification, and the demand-ranking metric the page is built to produce is committed in writing before the first real visitor.
**Depends on**: Phase 2
**Requirements**: ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, ANALYTICS-04, ANALYTICS-05, DEMAND-01, DEMAND-02, DEMAND-03, DEMAND-04, DEMAND-05
**Success Criteria** (what must be TRUE):
  1. PostHog browser SDK is initialized via `<script is:inline>` on the preview deploy with `person_profiles: 'identified_only'`, `defaults: '2026-01-30'`, `autocapture: false`, `capture_pageview: true`, `capture_pageleave: true`; the canary events `page:home_view` and `nav:link_click` are verified arriving in PostHog from the preview URL *before* any form ships to that environment.
  2. All event firing routes through `src/lib/analytics.ts` whose `track(eventName, props)` first argument is a string-literal union covering the full taxonomy (`page:home_view`, `nav:link_click`, `card:open`, `card:cta_external_click`, `form:open`, `form:abandon`, `form:submit`, `problem_pitch:submit`, `diagram:view`, `educator:scroll_complete`, `footer:link_click`); a grep for `posthog.capture(` outside `analytics.ts` returns zero hits.
  3. Submitting any per-card interest form (PostHog Surveys, with a `productId` discriminator and a *required* qualitative free-text field) calls `posthog.identify(email, {email, first_signup_location})` *before* `track('form:submit', ...)`, shows a confirmation state, and triggers a Slack/Zapier/Gmail webhook notification verified by an end-to-end test submission; submitting the general "tell us a problem" form (bare `posthog.capture('problem_pitch', ...)`) does the same.
  4. A PostHog dashboard exists showing per-card submit count, per-card click-through rate, per-card form-open-to-submit conversion, weighted demand-rank ordering, and the qualitative free-text values surfaced in a readable list; a weekly calendar reminder is also set as a backstop so leads can't accumulate unseen.
  5. A `demand-metric.md` (or equivalent section in PROJECT.md) is committed to the repo specifying the formula `1.0×submits + 0.3×opens + 0.1×clicks + 0.05×dwell_seconds`, the gate condition `5 form submits per card OR 4 weeks of traffic, whichever comes first`, and the action that triggers (vertical-pick decision).
**Plans**: TBD

### Phase 4: Diagrams, Polish & Preview Soak
**Goal**: The page is shippable — both Mermaid diagrams render cleanly without tanking initial paint, every "Looks Done But Isn't" item is verified, an external cold-read confirms the positioning lands, and the production build has soaked at the preview URL for ≥24h with no errors in PostHog or browser console.
**Depends on**: Phase 3
**Requirements**: DIAGRAM-01, DIAGRAM-02, DIAGRAM-03, DIAGRAM-04, DIAGRAM-05, VISUAL-05
**Success Criteria** (what must be TRUE):
  1. Diagram 1 ("How an agentic pipeline runs", input → agent steps → tool calls → *visible* review gates → output, captioned to tie to the reliability claim) and Diagram 2 ("How JigSpec ships a product to you", 4–5 nodes max, captioned) render inline on the preview URL; visiting the page fires `diagram:view` for each only when the diagram enters the viewport.
  2. Both diagrams are lazy-loaded via IntersectionObserver + dynamic `import('mermaid')` so the ~700KB Mermaid runtime does not block initial paint; the page still meets Lighthouse mobile-perf gate (LCP ≤ 2.5s, CLS ≤ 0.1, first-load JS within budget); a build-time-SVG fallback path (`@rendermaid/core` or `mmdc`) is documented and ready to swap in if the gate fails post-soak.
  3. Both diagrams render legibly at 320px / 375px / 414px viewport widths verified on a real device or browser device-emulation — illegible nodes are not acceptable; horizontal scroll on the diagram element is.
  4. An external cold-read reviewer (≥1 person who has not seen the page in development, ideally the non-technical co-founder) is asked to describe what JigSpec does in their own words within 60 seconds; if they cannot, copy / visual choices are iterated before cutover is considered.
  5. The production build serves at the long-lived preview URL (e.g. `jigspec.vercel.app`) for ≥24h with: zero browser-console errors, zero PostHog ingestion errors, custom 404 page in place, OG image and favicon shipped, accessibility audit passed (focus rings, alt text, semantic landmarks), Lighthouse ≥95 on perf/a11y/SEO/best-practices, and the "Looks Done But Isn't" 16-item checklist from PITFALLS.md verified.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Apex DNS Cutover (Gated)
**Goal**: jigspec.com serves this Astro marketing site at the apex without losing the developer-docs audience, breaking inbound links from tutorials/READMEs/external blog posts, or surfacing 404s on legacy docs paths. The DNS swap is the *last* deploy that touches production, gated on five hard prerequisites — not a date.
**Depends on**: Phase 4
**Requirements**: DEPLOY-04
**Success Criteria** (what must be TRUE — verbatim from DEPLOY-04, ALL required before DNS swap):
  1. `docs.jigspec.com` is live and serving the existing VitePress content.
  2. Cloudflare Bulk Redirects or Page Rules redirect map is deployed for legacy docs paths (`/guide/*`, `/reference/*`, `/api/*`, etc.) pointing at `docs.jigspec.com` at the same paths.
  3. A persistent header banner is deployed in code informing visitors of the apex change with a link to `docs.jigspec.com`, visible for ≥4 weeks post-cutover.
  4. ≥3 known docs users have validated the preview deploy and explicitly confirmed they can find what they need.
  5. A 404 monitoring alert is configured on Vercel/PostHog so a 404 spike on legacy docs paths fires a notification within minutes of cutover.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold, Sketches & Visual Shell | 0/TBD | Not started | - |
| 2. Content & Static Page | 0/5 | Not started | - |
| 3. Analytics, Forms & Notifications | 0/TBD | Not started | - |
| 4. Diagrams, Polish & Preview Soak | 0/TBD | Not started | - |
| 5. Apex DNS Cutover (Gated) | 0/TBD | Not started | - |
