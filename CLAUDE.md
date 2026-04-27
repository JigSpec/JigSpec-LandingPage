<!-- GSD:project-start source:PROJECT.md -->
## Project

**JigSpec Landing Page**

The company-level marketing site for JigSpec — the proprietary agentic-AI runtime and product studio behind the open `.pipe.yaml` spec and individual products like `buggerd`. The site introduces JigSpec as a company, explains agentic AI in plain English (anchoring our positioning that *our* agentic recipe is more reliable and autonomous than what's already out there), and surfaces a grid of product candidates — one shipping (buggerd) plus five concept-stage probes — so click and email signal can tell us which vertical to build next. The intended visitor is anyone with a repetitive or research-heavy task they suspect could be done by an autonomous agent: technical founders, ops leads, researchers, freelancers, knowledge workers. This page replaces `jigspec.com` (currently a VitePress docs site) as the apex; the docs migration to a separate subdomain is a known deferred dependency.

**Core Value:** **Generate enough company-level credibility and product-candidate signal that we can confidently pick which vertical to ship next.** Every other section serves that: the agentic-AI explainer earns the visitor's trust to engage with the cards; the cards capture the demand signal; the "tell us a problem we should solve" capture extends the signal beyond our pre-defined options. If the page looks beautiful but doesn't produce a clear demand ranking after 4–8 weeks of traffic, it has failed.

### Constraints

- **Tech stack**: Astro + Tailwind CSS — Chosen so the site can grow into a blog without re-platforming and can co-host docs in the same repo if the future requires it. Mermaid renders client-side.
- **Hosting**: Vercel + Cloudflare DNS — Same pattern as buggerd; auto-deploy from `main`. Apex DNS swap from current VitePress site is gated on a separate docs-migration phase.
- **Repo**: GitHub under the existing JigSpec org (parallel to `JigSpec/buggerd`).
- **Analytics**: PostHog free tier, hybrid privacy mode — anonymous events by default, identify on form submit. No persistent cookies pre-submit, no cookie banner required.
- **Forms**: Hybrid — PostHog Surveys for the 5 structured per-card interest forms (with a Slack/Zapier-to-Gmail webhook destination wired on day one to close the inbox-notification gap), and bare `posthog.capture('problem_pitch', ...)` for the general "tell us a problem we should solve" free-text capture. Tally is the documented fallback if PostHog Surveys friction proves unworkable post-launch.
- **Visual identity**: Bolder & editorial — tech-publication aesthetic. Strong typography, magazine-like hierarchy, opinionated colors. Distinct from buggerd's tighter zinc/emerald/monospace look so the company brand isn't read as a derivative of one of its own products. **Designer of record: Claude (this assistant) — no human-designer hours budgeted.** Pitfall 7 from research is partially accepted: visual taste limitations are mitigated by sketching multiple treatments early and external cold-read review at launch gate.
- **Voice**: Two candidate voices in tension — (1) Confident & direct ("we built this, here's why it works") and (2) Pragmatic / engineering-blog ("here's the problem, here's our pipeline, click to vote"). Resolution: produce sketch comparisons in a sketch phase before locking copy. Both candidates avoid breathless-AI tone.
- **Voice exclusion**: No fake social proof, no fabricated metrics, no "trusted by Fortune 500" copy patterns. The honesty constraint that runs through the buggerd and Delegate landings carries here.
- **No backend** in v1 — Astro static output, all dynamic surfaces (forms, analytics) handled by third parties.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Executive Summary
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | `^6.1` (currently 6.1.9) | Static site generator, page routing, content collections | Released March 2026 with redesigned dev server, stable Content Security Policy API, stable live content collections, and built-in Fonts API. Build content collections still power blogs (the future v2 path), so picking Astro 6 now is forward-compatible with the deferred blog. ([Astro 6 release post](https://astro.build/blog/astro-6/)) |
| **Tailwind CSS** | `^4.2` (currently 4.2.4) | Utility-first styling | Tailwind 4 is the current major; `@tailwindcss/vite` plugin replaces the deprecated `@astrojs/tailwind` integration. Lightning CSS engine is dramatically faster than v3. Zero-config Vite plugin matches Astro 6's Vite-Environment-API dev server. ([Tailwind v4 install for Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)) |
| **`@tailwindcss/vite`** | `^4.2` | Tailwind 4 Vite plugin | The official path for Tailwind 4 in Astro since Astro 5.2. Do **not** use `@astrojs/tailwind` — it is the v3 integration and is deprecated for v4 use. ([Astro Tailwind integration changelog](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/CHANGELOG.md)) |
| **posthog-js** | `^1.371` (currently 1.371.1) | Anonymous analytics + identify-on-submit | Industry-standard product analytics. Free tier covers JigSpec's expected v1 traffic. Built-in `cookieless_mode` solves the no-banner requirement directly. Custom events (`posthog.capture`) give per-card click ranking with no extra infra. ([posthog-js npm](https://www.npmjs.com/package/posthog-js)) |
| **astro-mermaid** | `^2.0.1` (March 2026) | Client-rendered Mermaid diagrams from `mermaid` code fences | Auto-discovers `mermaid` code fences in `.md`, `.mdx`, AND `.astro` files. Auto-switches theme based on `data-theme` attribute. Lazy-loads Mermaid (~760KB minified) client-side so initial paint isn't blocked. Compatible with Astro 4+, including Astro 6. ([joesaby/astro-mermaid](https://github.com/joesaby/astro-mermaid)) |
### Supporting Libraries (install during initial scaffold)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`@astrojs/mdx`** | `^4` (matches Astro 6) | MDX support for blog + rich landing sections | Required if you want to embed Astro components inside markdown — needed for the future blog and useful even for the v1 page if any content section gets long enough to be worth authoring as MDX. Install now to avoid a re-platform when blog ships. ([@astrojs/mdx docs](https://docs.astro.build/en/guides/integrations-guide/mdx/)) |
| **`@astrojs/sitemap`** | `^3` | Auto-generated `sitemap.xml` | Free SEO win on a marketing site. Set once in config, ignore forever. |
| **`mermaid`** | `^11` | Diagram runtime | Peer dependency of `astro-mermaid`. The integration handles loading; you do not import it directly. |
### Deferred (do NOT install in v1)
| Library | When to add |
|---------|-------------|
| `@astrojs/vercel` | Only if you adopt Vercel Image Optimization, Web Analytics, or move any route to SSR. Pure static output deploys to Vercel without it. ([@astrojs/vercel docs](https://docs.astro.build/en/guides/integrations-guide/vercel/)) |
| `satori` + `@vercel/og` + `sharp` | Only when blog ships and per-post OG images become useful. v1 marketing page can use a single hand-crafted static `og.png` in `/public`. |
| `@astrojs/rss` | When blog ships. |
| Tally form embeds | Only if PostHog Surveys (or the simpler `posthog.capture` pattern) proves unworkable. PROJECT.md explicitly names Tally as the documented fallback. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **TypeScript (strict)** | Type safety | Astro 6's scaffold defaults to strict TS. Keep it. |
| **Prettier + `prettier-plugin-astro`** | Formatting | Standard Astro project tooling. |
| **`astro check`** | Type checking | Runs in CI before deploy; catches type errors and missing props. |
| **Vercel CLI (`vercel`)** | Local preview deploys | Optional. The default GitHub-integration auto-deploy from `main` is sufficient for the v1 workflow described in PROJECT.md. |
## Installation
# Scaffold
# Tailwind 4 via Vite plugin (NOT the deprecated integration)
# Mermaid client-side rendering
# MDX (so blog can ship later without re-platforming)
# Sitemap (free SEO win)
# PostHog browser SDK
## Concrete Code-Level Patterns
### PostHog: anonymous-by-default, identify-on-submit (THE pattern)
| Approach | What it does | Trade-off |
|----------|--------------|-----------|
| **A. `cookieless_mode: 'always'`** | No cookies, no localStorage, ever. Daily-rotating salt-hashed pseudo-IDs. **`identify()` is disabled.** | Cleanest privacy story (truly cookieless, no banner anywhere). Cannot stitch a person's pre-submit clicks to their post-submit email. Each day the same browser looks like a new visitor. ([PostHog cookieless tutorial](https://posthog.com/tutorials/cookieless-tracking)) |
| **B. `person_profiles: 'identified_only'`** with default persistence (cookie + localStorage) | Anonymous events get sent without creating person profiles; on `identify()`, a person profile is created and subsequent events stitch to that person. | Uses cookies/localStorage from the first pageview, so in strict EU/GDPR readings you'd technically still need a banner. Gives you per-person funnels post-submit. ([PostHog anonymous vs identified events](https://posthog.com/docs/data/anonymous-vs-identified-events)) |
- The "no cookie banner" requirement in PROJECT.md is a UX preference, not an EU compliance line — JigSpec is a US-based business surveying primarily US technical audiences. PostHog's first-party-domain cookies + a privacy policy link are how 90%+ of comparable SaaS marketing sites handle this in 2026.
- Demand-ranking (the page's core value) wants stitching: "this visitor clicked the recorder card 3 times then submitted email about a triage problem" is a much richer signal than two disconnected event streams.
- You retain the option to flip to `cookieless_mode: 'always'` later by changing one config value if regulatory pressure changes.
### Mermaid: lazy-loaded, theme-aware
### PostHog Surveys: skip for v1, document the upgrade path
- Surveys API mode requires defining each survey in the PostHog dashboard, then calling `getActiveMatchingSurveys()` from the page, then `posthog.capture('survey sent', { $survey_id, $survey_response })`. That's three coupling points (dashboard config, JS fetch, JS submit) for what is fundamentally just "log an event with an email property." ([PostHog custom surveys docs](https://posthog.com/docs/surveys/implementing-custom-surveys))
- Custom events show up in the same Insights/Funnels/Cohorts UI as Survey responses. The "Surveys" surface in PostHog is mostly value-add when you want their UI for response analysis or popover targeting — neither of which JigSpec needs in v1.
- The Tally fallback path is the same complexity either way (form `action` to a Tally URL).
### Static OG image (skip Satori for v1)
## Vercel Configuration
- `script-src` adds `https://us-assets.i.posthog.com` (PostHog's CDN for the array.js loader).
- `connect-src` adds both PostHog hosts (event ingestion + asset loading).
- `style-src` no longer needs the Tailwind CDN — Tailwind 4 is built at compile time, served from same-origin.
- Astro Fonts API self-hosts fonts, so no `fonts.googleapis.com` / `fonts.gstatic.com` entries are required.
- The Mermaid runtime is bundled by `astro-mermaid` and served same-origin, so no CDN entry needed.
- Vercel Pro + Cloudflare DNS pattern is identical to buggerd; auto-deploy from `main`.
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Tailwind 4 via `@tailwindcss/vite`** | Tailwind 3 + `@astrojs/tailwind` | Only if you have a strong dependency on a v3-era plugin that hasn't been ported to v4. None apply here. |
| **`astro-mermaid`** (client-render) | `rehype-mermaid` (build-time SSG via Playwright) | Pre-render to SVG if you need diagrams visible without JS (true SSR / search-engine-rendered). Trade-off: Playwright in your build pipeline, slower CI. The educational diagrams here aren't SEO-critical content — client render is fine. |
| **`posthog.capture()` custom events** | PostHog Surveys (API mode) | When you want PostHog's built-in survey response UI, multi-step questions, NPS/CSAT scoring, or response targeting/throttling. None apply to v1. |
| **`person_profiles: 'identified_only'` (cookies allowed)** | `cookieless_mode: 'always'` | If a legal review later concludes that ePrivacy/GDPR consent banners are required for first-party cookies in your audience geographies. Easy switch later. |
| **No Vercel adapter (pure static)** | `@astrojs/vercel` | When you start using Vercel Image Optimization, Web Analytics, or any SSR route. Not needed for v1 marketing page. |
| **Astro built-in Fonts API** | `astro-font` (community pkg), or external Google Fonts CDN | The 6.x built-in covers what `astro-font` was created to do, with no third-party dep. External CDN means an extra origin in CSP and worse first paint. |
| **Single static `og.png` in `/public`** | Satori + `@vercel/og` build-time generation | When the blog ships and per-post OG images become a content-velocity multiplier. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`@astrojs/tailwind` (any version)** | Deprecated for Tailwind 4. Pulls in the v3 PostCSS pipeline which conflicts with the v4 Vite plugin if both are installed. | `@tailwindcss/vite` |
| **Tailwind CDN (`https://cdn.tailwindcss.com`)** | The buggerd page uses this, but it ships ~50KB JIT compiler to every visitor and forbids per-class purging. Acceptable for a one-file static, wrong for an Astro project. | Tailwind 4 build-time via Vite plugin (kilobytes, not tens of kilobytes) |
| **PostHog `autocapture: true` on a marketing page** | Will flood your event stream with low-signal `$autocapture` events for every link/button on the page, drowning out the actual demand signals (`product_card_click`, `email_signup`). | Disable autocapture; instrument the 5 cards + form submits explicitly. PostHog default is autocapture on, so you must opt out: `autocapture: false` in `init()`. |
| **Mermaid via `<script src="cdn.jsdelivr.net/...">` in HTML** | No version pinning, no lazy-load, blocks initial paint, breaks if CDN is down or CSP doesn't allow it. | `astro-mermaid` integration |
| **Astro `output: 'server'` for v1** | Adds Vercel adapter dependency, runtime cost, cold starts — for zero benefit when the entire site is static content. | `output: 'static'` (default in Astro 6) |
| **Two Astro integrations both consuming the same code fences** (e.g., both `astro-mermaid` and `rehype-mermaid` configured) | Double-processing breaks MDX. The `astro-mermaid` README explicitly warns to put it FIRST in the integrations array and not stack other mermaid processors. | Pick one. `astro-mermaid` is the right one for client-render. |
| **`z` import from `astro:content`** | Deprecated in Astro 6; legacy collections were removed by default. | `import { z } from 'astro/zod'` if you ever validate frontmatter (relevant when blog ships). |
## Stack Patterns by Variant
- Skip MDX initially? — **No, install it now anyway.** Cost is one dependency; it eliminates a re-platform when the deferred blog ships.
- Skip OG image automation. One static `og.png` in `/public`.
- No stack change. Each card is a `<ProductCard cardId="..." />` instance; the per-card analytics event is parameterized.
- Keep PostHog for analytics. Add Tally as a secondary form `action` URL on each CTA form. Both can coexist — PostHog captures the event, Tally captures the email to inbox notifications. Add `https://tally.so` to `connect-src` and `form-action` in CSP.
- Astro 6 + Starlight is the obvious docs path; both can live in the same monorepo or in adjacent repos. `astro-mermaid` is Starlight-compatible, so any landing-page diagrams can be re-used in docs verbatim.
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@^6` | `@tailwindcss/vite@^4` | Use the Vite plugin; do not install `@astrojs/tailwind`. |
| `astro@^6` | `@astrojs/mdx@^4` | MDX 4 ships with Astro 6 scaffold via `astro add mdx`. |
| `astro@^6` | `astro-mermaid@^2` | astro-mermaid declares `astro >=4` peer; works on Astro 6. v2.0.1 (March 2026) is the current line. |
| `astro@^6` | `@astrojs/vercel@^10` | Only relevant if the adapter is installed. v10.0.5 adds `staticHeaders` for prerendered pages. |
| `mermaid@^11` | `astro-mermaid@^2` | Mermaid 11 is the current line; astro-mermaid v2 expects it. |
| `posthog-js@^1.371` | All modern browsers | `defaults: '2026-01-30'` config opts into the current default behaviors and forward-compat surface. |
## Confidence Assessment
| Area | Confidence | What Would Lower It |
|------|------------|---------------------|
| Astro 6 + Tailwind 4 + Vite plugin | **HIGH** | Verified against official Tailwind framework guide and Astro 5.2 release notes. Pattern is the documented default path. |
| `@tailwindcss/vite` over `@astrojs/tailwind` | **HIGH** | Confirmed in Tailwind's own framework guide and the `@astrojs/tailwind` changelog (deprecated for v4). |
| `astro-mermaid` v2.0.1 as the right Mermaid integration | **HIGH** | Latest release March 2026, supports `.astro` files (most others don't), explicit Astro 6 demo project. |
| PostHog `cookieless_mode: 'always'` semantics | **HIGH** | Verified directly against PostHog cookieless tutorial. Important nuance: `cookieless_mode` disables `identify()`, so the recommended path is `person_profiles: 'identified_only'` instead. |
| `posthog.capture` over Surveys for v1 | **MEDIUM-HIGH** | Verified the Surveys API surface area; the recommendation is an opinionated simplification, not a forced choice. PROJECT.md explicitly names Surveys, so flag this as a documented deviation when reviewing the roadmap. |
| Static deploy without `@astrojs/vercel` adapter | **HIGH** | Confirmed in current Astro Vercel adapter docs ("only need this adapter if you are using additional Vercel services"). |
| Astro 6 Fonts API stability | **HIGH** | Released stable in Astro 6 (March 2026). Self-hosting + fallback metrics are documented behaviors. |
| `posthog-js@1.371.1` as current | **HIGH** | npm latest at time of research. Will drift; pin a minor and let dependabot bump. |
| CSP example values | **MEDIUM** | Verified PostHog hosts; the CSP needs to be re-tested in browser devtools when the actual deploy happens because PostHog occasionally adds new asset hosts (e.g., `surveys.i.posthog.com`) when you turn on additional features. |
## Sources
- [Astro 6 release post (March 2026)](https://astro.build/blog/astro-6/) — version, Fonts API, Content Security Policy, live content collections
- [Astro Vercel adapter docs](https://docs.astro.build/en/guides/integrations-guide/vercel/) — adapter not required for static; v10.0.5
- [Astro Fonts API docs](https://docs.astro.build/en/guides/fonts/) — `astro:font` syntax, self-hosting, fallbacks
- [Tailwind CSS install for Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — `@tailwindcss/vite` is the v4 path
- [`@astrojs/tailwind` changelog](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/CHANGELOG.md) — deprecated for v4
- [Tailwind v4.2.4 npm](https://www.npmjs.com/package/tailwindcss?activeTab=versions) — current latest, April 2026
- [PostHog Astro docs](https://posthog.com/docs/libraries/astro) — `is:inline` requirement, snippet pattern
- [PostHog anonymous vs identified events](https://posthog.com/docs/data/anonymous-vs-identified-events) — `person_profiles: 'identified_only'` semantics
- [PostHog cookieless tracking tutorial](https://posthog.com/tutorials/cookieless-tracking) — `cookieless_mode: 'always'`, identify-disabled trade-off
- [PostHog custom surveys docs](https://posthog.com/docs/surveys/implementing-custom-surveys) — Surveys API mode complexity
- [posthog-js npm](https://www.npmjs.com/package/posthog-js) — current version 1.371.1
- [astro-mermaid GitHub](https://github.com/joesaby/astro-mermaid) — v2.0.1 March 2026, .astro file support, theme switching
- [Astro content collections (2026 guide for Astro 6)](https://docs.astro.build/en/guides/content-collections/) — build vs live collections, `glob()` loader, `astro/zod`
- [@astrojs/mdx integration docs](https://docs.astro.build/en/guides/integrations-guide/mdx/) — MDX 4 with Astro 6
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
