# Requirements: JigSpec Landing Page

**Defined:** 2026-04-27
**Core Value:** Generate enough company-level credibility and product-candidate signal that we can confidently pick which vertical to ship next.

## v1 Requirements

Requirements for the initial release. Each maps to roadmap phases (filled by roadmapper). REQ-IDs come in seven categories: CONTENT, DEMAND, ANALYTICS, DIAGRAM, VISUAL, TECH, DEPLOY.

### Content (the page's narrative payload)

- [ ] **CONTENT-01**: Visitor reads a hero with a tagline and one-sentence sub-line that distinguishes JigSpec's reliability + autonomy claim from the breathless agentic-AI noise; the sub-line is *falsifiable* (e.g. "agents that pass your existing CI before they ship a change," not "the future of work")
- [ ] **CONTENT-02**: Visitor reads a 250–400 word "What is agentic AI" educational section that gives a non-expert a working definition in under 90 seconds, structurally treated (heading + body + a contrast element like a small table or two-column layout) — direct response to the buggerd post-mortem
- [ ] **CONTENT-03**: Visitor sees a 6-card product grid with **equal visual footprint** for every card, in narrative order: buggerd, scientific paper agent, triage + router bot, always-on recorder + extractor, Agentic Employees, Delegate
- [ ] **CONTENT-04**: Each product card displays a one-state stage badge (`Shipping` for buggerd, `Probe` for the 4 concept-stage products including Agentic Employees, `Sibling` for Delegate) so visitors can read what's real vs. what's being measured without leaving the grid
- [ ] **CONTENT-05**: Each product card has a clear primary action: buggerd's CTA links externally to `https://buggerd.com`; the other 5 open the per-card interest form (DEMAND-01)
- [ ] **CONTENT-06**: Visitor sees a "Tell us a problem we should solve" section with copy that frames the form as soliciting demand signal beyond our preconceived cards (not a contact form)
- [ ] **CONTENT-07**: Page footer contains: link to docs (initially the existing VitePress site at jigspec.com or its preview equivalent; flips to `docs.jigspec.com` at cutover), contact email, copyright, and a link to the GitHub org
- [ ] **CONTENT-08**: All copy avoids fabricated social proof (no testimonials, no "trusted by" logos, no fake metrics, no "industry-leading" superlatives) — honesty constraint inherited from buggerd and Delegate landings

### Demand (the signal-capture mechanism — primary job of the page)

- [ ] **DEMAND-01**: Per-card interest forms exist for all 5 non-buggerd cards (scientific paper agent, triage + router bot, recorder + extractor, Agentic Employees, Delegate); each form is built on PostHog Surveys with a `productId` discriminator, captures email + a **required** qualitative free-text field (one to two sentences on what the visitor would actually use it for), and shows a confirmation state on submit
- [ ] **DEMAND-02**: The general "Tell us a problem we should solve" form exists separately from the per-card forms; uses bare `posthog.capture('problem_pitch', {...})` (not a Surveys widget); captures email + free-text problem description; same confirmation state pattern
- [ ] **DEMAND-03**: A demand-ranking metric is committed in writing in the repo (e.g. `docs/demand-metric.md` or in PROJECT.md) before launch, specifying: (a) the formula `1.0×submits + 0.3×opens + 0.1×clicks + 0.05×dwell_seconds`, (b) the gate condition `5 form submits per card OR 4 weeks of traffic, whichever comes first`, and (c) the action that triggers (vertical-pick decision)
- [ ] **DEMAND-04**: Notification destination wired on day one — Slack webhook OR Zapier-to-Gmail OR equivalent — for both PostHog Surveys submissions and the `problem_pitch` event; weekly calendar reminder also set as a backstop so leads can't accumulate unseen
- [ ] **DEMAND-05**: PostHog dashboard exists with: per-card submit count, per-card click-through rate, per-card form-open-to-submit conversion, weighted demand-rank ordering, and the qualitative free-text values surfaced in a readable list (not buried in event properties)

### Analytics (the instrumentation enabling DEMAND)

- [ ] **ANALYTICS-01**: PostHog browser SDK is installed and initialized via Astro `<script is:inline>`; `person_profiles: 'identified_only'`, `defaults: '2026-01-30'`, `autocapture: false`, `capture_pageview: true`, `capture_pageleave: true` — hybrid privacy mode confirmed (no persistent cookies pre-submit, identified-only after submit)
- [ ] **ANALYTICS-02**: A typed `src/lib/analytics.ts` module exposes `track(eventName, props)` and `identify(email, traits)`; `eventName` is a string-literal union covering every event the page fires (no free-form event names allowed); direct calls to `window.posthog.capture` are forbidden by lint/code-review convention
- [ ] **ANALYTICS-03**: The event taxonomy includes at minimum: `page:home_view`, `nav:link_click`, `card:open` (per-card click), `card:cta_external_click` (buggerd-only), `form:open`, `form:abandon`, `form:submit`, `problem_pitch:submit`, `diagram:view` (each), `educator:scroll_complete`, `footer:link_click`; every event includes the relevant `productId` or `location` property
- [ ] **ANALYTICS-04**: On any form submit, the page calls `posthog.identify(email, {email, first_signup_location})` *before* the corresponding `track('form:submit', ...)` so the user is stitched cleanly to prior anonymous activity
- [ ] **ANALYTICS-05**: Canary events (`page:home_view`, `nav:link_click`) are verified to flow into PostHog from the preview deploy *before* any forms or cards ship to that environment, so the pipeline is proven end-to-end before high-stakes events fire

### Diagrams (load-bearing positioning visuals)

- [ ] **DIAGRAM-01**: Mermaid Diagram 1 ("How an agentic pipeline runs") renders inline in the page, shows input → agent steps → tool calls → **review gates (visible)** → output, and is captioned with one sentence that ties it to the reliability claim from CONTENT-01
- [ ] **DIAGRAM-02**: Mermaid Diagram 2 ("How JigSpec ships a product to you") renders inline, shows your-problem → we-design-pipeline → we-build → you-use-it (4–5 nodes max), and is captioned with one sentence
- [ ] **DIAGRAM-03**: Both diagrams are lazy-loaded via IntersectionObserver + dynamic `import('mermaid')` so the ~700KB Mermaid runtime does not block initial paint; visitors who never scroll to the diagram never download Mermaid
- [ ] **DIAGRAM-04**: Both diagrams render legibly at 320px / 375px / 414px viewport widths (mobile); horizontal scroll on the diagram element is acceptable, illegible nodes are not — verify on real device or browser device-emulation
- [ ] **DIAGRAM-05**: A build-time-SVG fallback path is documented (`@rendermaid/core` or `mmdc`) and triggers if the lazy-load approach fails the Lighthouse mobile-perf gate (LCP > 2.5s, CLS > 0.1, or first-load JS budget exceeded by Mermaid)

### Visual (editorial aesthetic, distinct from buggerd)

- [ ] **VISUAL-01**: Two visual sketches are produced as throwaway HTML (`/gsd-sketch` artifacts in `.planning/sketches/`) — one for each candidate voice (Confident & Direct, Engineering-Blog Pragmatic) — both rendering hero + one card + diagram-1 area; the user reviews and picks one before the layout phase commits
- [ ] **VISUAL-02**: The chosen visual treatment uses a 3-element typographic scale (display, body, micro) with a serif or grotesque sans display face *different* from buggerd's `ui-monospace` system stack; palette is 4 colors max (background, body text, accent, muted)
- [ ] **VISUAL-03**: Visual identity is verifiably distinct from buggerd at first glance — different display typeface, different accent color (not buggerd's emerald-600), different chrome treatment — confirmed by a side-by-side screenshot review at the polish gate
- [ ] **VISUAL-04**: Layout is mobile-responsive with desktop-first content density; hero and card grid reflow legibly at 320px; nav collapses appropriately
- [ ] **VISUAL-05**: External cold-read review (≥1 person who has not seen the page in development, ideally the non-technical co-founder) completed at the polish gate; reader is asked to describe what JigSpec does in their own words within 60 seconds — if they cannot, CONTENT-02 / VISUAL choices need iteration before launch

### Tech (stack scaffold)

- [ ] **TECH-01**: Astro 6 project scaffolded with TypeScript strict mode; Tailwind 4 wired via `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind`); `astro-mermaid` v2 + `mdx` + `sitemap` integrations installed; integration order respects `astro-mermaid` first
- [ ] **TECH-02**: `src/content/products/` content collection with one Markdown file per product, validated by a Zod schema with discriminated-union `cta` field (`external` for buggerd, `interest` for the others); `src/content/config.ts` also reserves an empty `blog` collection schema so v2 blog ships without re-platform
- [ ] **TECH-03**: Component layout: `src/components/sections/` (page-narrative blocks), `src/components/cards/ProductCard.astro`, `src/components/forms/InterestForm.astro` (single primitive parameterized by `productId`), `src/components/diagrams/MermaidDiagram.astro`, `src/components/global/Nav.astro` + `Footer.astro` + `Analytics.astro`
- [ ] **TECH-04**: `pages/index.astro` is composition only — imports section components in narrative order, contains no business logic, no inline data
- [ ] **TECH-05**: Astro Fonts API self-hosts the chosen typefaces (zero external font CDN); CSP in `vercel.json` does not require font-CDN allowlisting

### Deploy (preview, repo, cutover)

- [ ] **DEPLOY-01**: GitHub repo created under the JigSpec org parallel to JigSpec/buggerd (working name: `JigSpec/jigspec-landing` or similar); main branch protected at minimum from force-push
- [ ] **DEPLOY-02**: Vercel project connected; auto-deploy from `main`; preview deploys on every PR; production preview URL `jigspec.vercel.app` (or similar) serves the site for ≥24h before any consideration of cutover
- [ ] **DEPLOY-03**: `vercel.json` mirrors buggerd's pattern (security headers — HSTS, X-Frame-Options DENY, CSP including PostHog hosts `https://us-assets.i.posthog.com` script and both PostHog hosts in `connect-src`, Permissions-Policy); `cleanUrls: true`; `trailingSlash: false`; `.planning/` and `.git/` excluded from deploy artifact via `.vercelignore`
- [ ] **DEPLOY-04**: Apex DNS cutover from current VitePress site to this site (final, gated phase) — gate criteria ALL required: (a) `docs.jigspec.com` live and serving the existing VitePress content, (b) Cloudflare Bulk Redirects or Page Rules redirect map deployed for legacy docs paths, (c) header banner deployed informing visitors of the apex change with a link to docs.jigspec.com (visible for ≥4 weeks post-cutover), (d) ≥3 known docs users have validated the preview deploy, (e) 404 monitoring alert configured on Vercel/PostHog

## v2 Requirements

Deferred. Tracked but not in current roadmap.

### Blog
- **BLOG-01**: Blog index page at `/blog` listing all posts in reverse chronological order
- **BLOG-02**: Individual blog post pages at `/blog/[slug]` rendering MDX content
- **BLOG-03**: RSS feed for the blog
- **BLOG-04**: Blog posts can include Mermaid diagrams (already supported by stack)

### Niche landing pages
- **NICHE-01**: Per-vertical landing pages (e.g. `/for-research`, `/for-ops`) once a vertical is picked
- **NICHE-02**: Vertical pages can be added without restructuring the apex

### Docs migration content
- **DOCS-01**: Existing VitePress content fully migrated to `docs.jigspec.com` (hosting decision is locked at `docs.jigspec.com` per PROJECT.md key decisions; v1 may serve VitePress build temporarily)
- **DOCS-02**: Long-term docs platform reconsidered (stay on VitePress vs. migrate to Astro Starlight or other) — outside this milestone

## Out of Scope

| Feature | Reason |
|---------|--------|
| Live agentic-AI demo embedded in the page | Risks looking like vaporware if it fails; diagrams + buggerd CTA carry the demo load (PROJECT.md) |
| Customer testimonials / "trusted by" logos | No shipped customers; fabricating credibility contradicts honesty constraint (FEATURES.md AF) |
| Pricing pages or paid tiers | No products are monetized through this page; buggerd has its own funnel; concepts are pre-product (PROJECT.md) |
| Authentication / dashboards / "platform for managing agentic agents" | Explicitly deferred — strategy notes say infrastructure + audience + funding come first |
| OSS/runtime documentation on the marketing site | That's the docs site's job; this site sits above it (PROJECT.md) |
| A/B testing infrastructure (split tests, variant routing) | v1 traffic too low to power useful tests; complexity outweighs benefit (FEATURES.md AF) |
| Newsletter signup separate from "tell us a problem" | Two competing email asks confuse the funnel; one capture per visitor is the right ask |
| Mega-menu / multi-level nav | Single-page in v1 — single sticky-or-not nav suffices; mega-menus are anti-pattern at this scope |
| Lottie / video hero animation | Page-load cost without measurable lift; Mermaid diagrams already carry visual weight (PITFALLS) |
| Live chat widget | Direct contact via the form is the path; chat would imply staffing we don't have |
| Cookie consent banner | Hybrid PostHog mode is identified-only — no persistent cookies pre-submit, no banner required (ANALYTICS-01) |
| Notion runtime dependency | Notion MCP wasn't wired into the session; eliminating it removes a session-dependency risk (PROJECT.md) |
| External design agency / contractor | User explicit: "you make the decisions for editorial and implement" (PROJECT.md key decisions) |
| Re-platforming the existing VitePress docs site itself | Out of scope this milestone; locked destination is `docs.jigspec.com` (PROJECT.md key decisions) |

## Traceability

Empty. Filled by roadmapper in the next phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CONTENT-01 | TBD | Pending |
| CONTENT-02 | TBD | Pending |
| CONTENT-03 | TBD | Pending |
| CONTENT-04 | TBD | Pending |
| CONTENT-05 | TBD | Pending |
| CONTENT-06 | TBD | Pending |
| CONTENT-07 | TBD | Pending |
| CONTENT-08 | TBD | Pending |
| DEMAND-01 | TBD | Pending |
| DEMAND-02 | TBD | Pending |
| DEMAND-03 | TBD | Pending |
| DEMAND-04 | TBD | Pending |
| DEMAND-05 | TBD | Pending |
| ANALYTICS-01 | TBD | Pending |
| ANALYTICS-02 | TBD | Pending |
| ANALYTICS-03 | TBD | Pending |
| ANALYTICS-04 | TBD | Pending |
| ANALYTICS-05 | TBD | Pending |
| DIAGRAM-01 | TBD | Pending |
| DIAGRAM-02 | TBD | Pending |
| DIAGRAM-03 | TBD | Pending |
| DIAGRAM-04 | TBD | Pending |
| DIAGRAM-05 | TBD | Pending |
| VISUAL-01 | TBD | Pending |
| VISUAL-02 | TBD | Pending |
| VISUAL-03 | TBD | Pending |
| VISUAL-04 | TBD | Pending |
| VISUAL-05 | TBD | Pending |
| TECH-01 | TBD | Pending |
| TECH-02 | TBD | Pending |
| TECH-03 | TBD | Pending |
| TECH-04 | TBD | Pending |
| TECH-05 | TBD | Pending |
| DEPLOY-01 | TBD | Pending |
| DEPLOY-02 | TBD | Pending |
| DEPLOY-03 | TBD | Pending |
| DEPLOY-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 0 (filled by roadmapper)
- Unmapped: 36 ⚠️ (will become 0 after roadmap)

---
*Requirements defined: 2026-04-27*
*Last updated: 2026-04-27 after initial definition*
