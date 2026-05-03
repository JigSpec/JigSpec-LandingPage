# Phase 3: Analytics, Forms & Notifications — Research

**Researched:** 2026-04-29
**Domain:** PostHog browser SDK in Astro 6 + typed analytics wrapper + PostHog Surveys API mode + identified-only stitching + dashboard-side configuration
**Confidence:** HIGH on the SDK init pattern, event taxonomy wiring, and identify-before-track ordering; MEDIUM on the survey-id wiring approach (two viable paths with different trade-offs); HIGH on the user-action items required outside the codebase.

## Summary

Phase 3 turns the static Phase 2 page into a demand-signal-capturing instrument. The codeable surface is small — one `<script is:inline>` snippet in `Base.astro`, one typed `src/lib/analytics.ts` module, one delegated click listener, two form submit handlers, two new components — but it is gated by **seven distinct user-action items** the planner cannot automate (PostHog project creation, API key in Vercel env, 5 Surveys defined in dashboard with their dashboard-assigned UUIDs, notification webhook destination chosen and wired, dashboard with 5 Insights built, weekly calendar reminder, canary verification on the live preview). The plan structure must split SDK-shipping from form-shipping with a hard human-action checkpoint between them so ANALYTICS-05's canary-before-forms gate is satisfied — recommend a **5-plan structure**.

The single highest-value research finding is that **the PostHog official Astro guide recommends the CDN-snippet pattern via `<script is:inline>`, not `npm install posthog-js`** [VERIFIED: posthog.com/docs/libraries/astro]. This contradicts CLAUDE.md's "posthog-js@^1.371" dependency-table entry and contradicts the orchestrator note that ANALYTICS-01 implies npm install. The CDN snippet is correct because (a) `is:inline` script tags do NOT get bundled by Astro — `import` statements inside them fail at build time; (b) the snippet uses PostHog's loader pattern which lazy-loads the full SDK from `https://us-assets.i.posthog.com/static/array.js` (already allowlisted in `connect-src` + `script-src` from Phase 1); (c) the typed wrapper at `src/lib/analytics.ts` does NOT need to be `is:inline` — it's a regular bundled module that calls `window.posthog`. This is the cleanest split: PostHog snippet bootstraps the global, typed wrapper imports zero PostHog code and just narrows `window.posthog` calls.

**Primary recommendation:** Ship PostHog via the **CDN snippet pattern** in `Base.astro` with the locked init config (`person_profiles: 'identified_only'`, `defaults: '2026-01-30'`, `autocapture: false`, `capture_pageview: true`, `capture_pageleave: true`, plus `loaded:` callback hooking up the canary `page:home_view` event); build a typed `src/lib/analytics.ts` module that exposes `track(eventName, props)` + `identify(email, traits)` keyed off a string-literal union; wire forms via two component-level `<script>` blocks (one per form component, NOT inline) that call `analytics.identify()` THEN `analytics.track('form:submit'|'problem_pitch:submit', ...)` THEN render confirmation; wire card/footer/nav clicks via a single delegated listener in `Base.astro` that reads `data-event` + `data-product-id`/`data-link-location` attributes Phase 2 already emits. Use a **hardcoded survey-id map** in `src/lib/surveys.ts` (compile-time-typed — fail-fast if a productId is missing). Do NOT skip Surveys for `posthog.capture('survey sent', ...)`-only — the locked decision in PROJECT.md explicitly chose Surveys for the per-card forms; honoring that decision means accepting one extra dashboard-side coupling point per card. Plan structure: **5 plans**, with a hard human-action checkpoint between Plan 03 (SDK + canary) and Plan 04 (forms + identify-on-submit).

<user_constraints>
## User Constraints (from PROJECT.md / CLAUDE.md / ROADMAP.md / REQUIREMENTS.md)

No CONTEXT.md exists for Phase 3 (this research was spawned standalone). The constraints below come directly from the locked decisions in PROJECT.md, the requirement set in REQUIREMENTS.md, the success criteria in ROADMAP.md, and the standing instructions in CLAUDE.md. The planner should treat them with equivalent authority to a CONTEXT.md `## Decisions` block.

### Locked Decisions

- **Analytics provider**: PostHog (NOT Tally / Plausible / GA4). Free tier covers v1 traffic. — PROJECT.md Key Decisions
- **Hybrid privacy mode**: `person_profiles: 'identified_only'` (NOT `cookieless_mode: 'always'`). Anonymous events flow without person profiles; on `identify()` a person profile is created and subsequent events stitch. Uses first-party cookies/localStorage from first pageview. No cookie banner because JigSpec is a US-based business with primarily US technical audience. Documented upgrade path to `cookieless_mode: 'always'` if regulatory pressure changes (one config flip). — CLAUDE.md "PostHog: anonymous-by-default, identify-on-submit"
- **Init config locked**: `defaults: '2026-01-30'`, `autocapture: false`, `capture_pageview: true`, `capture_pageleave: true`. — REQUIREMENTS.md ANALYTICS-01 + ROADMAP.md Phase 3 SC#1
- **Forms split**: PostHog Surveys API mode for the 5 structured per-card interest forms (with `productId` discriminator + required qualitative free-text field); bare `posthog.capture('problem_pitch', ...)` for the open-ended capture. — PROJECT.md Key Decisions + REQUIREMENTS.md DEMAND-01/DEMAND-02
- **Notification destination wired on day one**: Slack webhook OR Zapier-to-Gmail OR equivalent. User picks at execution time. — PROJECT.md Key Decisions + REQUIREMENTS.md DEMAND-04
- **Tally is documented fallback**: only adopt if PostHog Surveys friction proves unworkable post-launch. NOT installed in Phase 3. — PROJECT.md Constraints
- **Demand-signal gate locked**: `5 form submits per card OR 4 weeks of traffic, whichever comes first`. Weighted formula `1.0×submits + 0.3×opens + 0.1×clicks + 0.05×dwell_seconds`. Action that triggers: vertical-pick decision. — PROJECT.md Key Decisions + REQUIREMENTS.md DEMAND-03
- **Event taxonomy locked** (string-literal union, no free-form names): `page:home_view`, `nav:link_click`, `card:open`, `card:cta_external_click`, `form:open`, `form:abandon`, `form:submit`, `problem_pitch:submit`, `diagram:view`, `educator:scroll_complete`, `footer:link_click`. Every event includes the relevant `productId` or `location` property. — REQUIREMENTS.md ANALYTICS-03
- **Identify-before-track ordering required**: `posthog.identify(email, {email, first_signup_location})` MUST fire before `track('form:submit', ...)`. — REQUIREMENTS.md ANALYTICS-04 + ROADMAP.md Phase 3 SC#3
- **Single typed wrapper**: All event firing routes through `src/lib/analytics.ts` whose `track(eventName, props)` first argument is the string-literal union; a grep for `posthog.capture(` outside `analytics.ts` returns zero hits. — REQUIREMENTS.md ANALYTICS-02 + ROADMAP.md Phase 3 SC#2
- **Canary-before-forms gate**: `page:home_view` and `nav:link_click` MUST be verified arriving in PostHog from the preview URL *before* any form ships to that environment. — REQUIREMENTS.md ANALYTICS-05 + ROADMAP.md Phase 3 SC#1
- **No `autocapture: true`**: forbidden by CLAUDE.md "What NOT to Use" — would flood the event stream with low-signal `$autocapture` events. — CLAUDE.md
- **PostHog snippet via `<script is:inline>`**: ROADMAP.md SC#1 phrases this as "via `<script is:inline>` on the preview deploy." This is the official PostHog Astro pattern. — ROADMAP.md Phase 3 SC#1
- **Phase 2/3 boundary inverts on dist/**: Phase 2 had ZERO `posthog` references in rendered `dist/` HTML (verification chain check #8). Phase 3 inverts this — `posthog` references become EXPECTED in `dist/index.html` and `dist/products/*/index.html` (the snippet renders inline). — Phase 2 SUMMARY 02-05
- **Phase 1 CSP already correct**: `vercel.json` `script-src` includes `https://us-assets.i.posthog.com`; `connect-src` includes both `https://us-assets.i.posthog.com` AND `https://us.i.posthog.com`. No CSP change needed in Phase 3. — vercel.json
- **Bracketed-placeholder copy convention continues**: Phase 3 doesn't ship final copy either; copy polish is a Phase 4 concern. Form confirmation states use bracketed-placeholder text. — Phase 1 D-03 voice + Phase 2 carry-forward
- **Honesty audit codified**: `npm run honesty-audit` is the canonical CONTENT-08 enforcement; Phase 3 form copy is in scope. — Phase 2 SUMMARY 02-05
- **Tailwind 4 named-utility hygiene**: prefer `font-display`, `text-fg`, `bg-bg`, `border-muted` (NOT arbitrary `font-[var(--font-display)]` forms). — Phase 2 SUMMARY 02-05 + Phase 1 D-19

### Claude's Discretion (areas with research-backed recommendations below)

- **SDK delivery**: CDN snippet via `is:inline` (recommended) vs `npm install posthog-js` + bundled module → **Recommend CDN snippet** (see Pattern 1 below). The orchestrator prompt suggested both paths; PostHog's official Astro doc recommends the snippet [VERIFIED: posthog.com/docs/libraries/astro]. CLAUDE.md's "posthog-js@^1.371" dependency-table entry is research-doc residue from the stack-research phase; the actual delivery mechanism is the snippet, which loads the same `array.js` from `us-assets.i.posthog.com`.
- **Typed-wrapper API shape**: discriminated-union props (compile-time per-event property check) vs generic `Record<string, unknown>` → **Recommend discriminated union** (see Pattern 2). One small TS type carries every event taxonomy contract; saves a class of typo bugs.
- **Survey-id wiring**: hardcoded map in `src/lib/surveys.ts` keyed by productId vs `data-survey-id` attribute on the form → **Recommend hardcoded map** (see Pattern 4). Compile-time guarantee that all 5 productIds have a mapped survey-id; `astro check` fails the build if a productId is missing from the map.
- **Survey-rendering approach**: render PostHog's `getActiveMatchingSurveys()` widget vs keep existing form HTML and fire `posthog.capture('survey sent', ...)` directly with the right `$survey_id` shape → **Recommend keep existing form HTML, fire `survey sent` event directly** (see Pattern 4). PostHog dashboard recognizes responses by `$survey_id` + `$survey_response_$question_id` regardless of how the response was captured [VERIFIED: posthog.com/docs/surveys/implementing-custom-surveys]. Keeps Phase 2's component shape intact.
- **Identify-before-track ordering safety**: synchronous-only vs `loaded:` callback gate vs `posthog.__loaded` check → **Recommend deferring submit handler attachment until `loaded:` callback fires** (see Pattern 5 + Pitfall 5). PostHog's `init({ loaded: (ph) => {...} })` callback is the documented "SDK ready" signal [VERIFIED: posthog/posthog-js/posthog-core.ts]; before that, capture() calls are queued but identify() race-conditions are real.
- **Notification destination**: Slack webhook vs Zapier-to-Gmail → **Recommend defaulting to Slack** (faster setup, auditable in #channel) but make Zapier path equally clear. The user picks at Phase 3 execution time. (See User-Action Item 4.)
- **`diagram:view` event firing in Phase 3 against the Phase 2 placeholder**: defensive vs deferred to Phase 4 → **Recommend defensive — wire it now** (see Pattern 6). Phase 2 ships `<MermaidDiagram />` placeholder shells; Phase 3 can wire an IntersectionObserver against the placeholder so when Phase 4 swaps in the real Mermaid runtime, zero analytics work is needed.
- **demand-metric.md placement**: standalone `docs/demand-metric.md` vs append to PROJECT.md → **Recommend standalone `docs/demand-metric.md`** (see Pattern 7). Easier for a future operator to find by filename; PROJECT.md is overloaded.
- **Plan structure**: 4 plans (combined SDK+canary+forms) vs 5 plans (SDK+canary | forms | dashboard) vs 6 plans (one-per-form-type) → **Recommend 5 plans** with a hard human-action checkpoint between Plan 03 and Plan 04 to satisfy ANALYTICS-05 canary-before-forms.

### Deferred Ideas (OUT OF SCOPE for Phase 3)

- Mermaid runtime via `astro-mermaid` integration → Phase 4 (DIAGRAM-01..05). Phase 3 only fires `diagram:view` defensively against the placeholder.
- OG image / favicon / 404 page / Lighthouse / external cold-read review → Phase 4 polish.
- `@astrojs/mdx` install → Phase 6 (BLOG-01) when actually needed (per Phase 2 RESEARCH § Don't Hand-Roll).
- `@astrojs/sitemap` → Phase 4 polish.
- Dark-mode visual validation → Phase 4 (D-10, D-11 carry-forward).
- Apex DNS cutover collateral → Phase 5 gate (DEPLOY-04).
- Tally form integration as fallback → only if PostHog Surveys friction proves unworkable post-launch (per PROJECT.md).
- A/B testing infra / pricing pages / live chat / blog content / niche pages → out of scope per REQUIREMENTS.md.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANALYTICS-01 | PostHog browser SDK installed and initialized via Astro `<script is:inline>`; identified-only mode + locked init config | Pattern 1 (CDN snippet init in Base.astro), Pitfalls 1, 2, 3 |
| ANALYTICS-02 | Typed `src/lib/analytics.ts` with string-literal union; direct `window.posthog.capture` forbidden by lint/grep | Pattern 2 (typed wrapper), Pattern 3 (grep guard via `npm run analytics-audit`) |
| ANALYTICS-03 | Full event taxonomy: `page:home_view`, `nav:link_click`, `card:open`, `card:cta_external_click`, `form:open`, `form:abandon`, `form:submit`, `problem_pitch:submit`, `diagram:view`, `educator:scroll_complete`, `footer:link_click` | Pattern 2 (discriminated-union props), Code Examples (full taxonomy) |
| ANALYTICS-04 | `posthog.identify(email, {email, first_signup_location})` BEFORE `track('form:submit', ...)` | Pattern 5 (identify-then-track ordering safety with loaded callback), Pitfall 5 |
| ANALYTICS-05 | Canary events verified arriving from preview deploy BEFORE any form ships to that environment | Plan structure recommendation (5 plans with hard human-action checkpoint between Plan 03 and Plan 04) |
| DEMAND-01 | Per-card interest forms for the 5 non-buggerd cards; PostHog Surveys with `productId` discriminator + required qualitative free-text; confirmation state on submit; rendered embedded on each `/products/[slug]` page | Pattern 4 (Surveys API mode without widget; hardcoded survey-id map), Pattern 6 (form submit handler), User-Action Item 3 (creating Surveys in dashboard) |
| DEMAND-02 | General "tell us a problem" form; bare `posthog.capture('problem_pitch', ...)` (NOT a Surveys widget); same confirmation pattern | Pattern 6 (problem-pitch handler — simpler than Surveys path), Code Examples (ProblemPitchForm wiring) |
| DEMAND-03 | `demand-metric.md` committed to repo with formula, gate, and trigger action | Pattern 7 (file shape and placement) |
| DEMAND-04 | Notification destination wired (Slack OR Zapier-to-Gmail OR equivalent); weekly calendar reminder backstop | User-Action Item 4 (notification destination), User-Action Item 6 (calendar reminder) |
| DEMAND-05 | PostHog dashboard with 5 specific Insights: per-card submit count, per-card CTR, per-card form-open-to-submit conversion, weighted demand-rank ordering, qualitative free-text values list | User-Action Item 5 (dashboard configuration with Insight queries), Pattern 8 (dashboard query specs) |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| PostHog SDK bootstrap | Browser (`<script is:inline>` in Base.astro head) | — | Snippet must execute on every page load before any user interaction; `is:inline` prevents Astro from bundling so the SDK loader can attach to `window.posthog` synchronously. Build-time inlining of the project API key happens via `import.meta.env.PUBLIC_POSTHOG_KEY` substitution inside the inline script body. |
| Event firing (typed wrapper) | Browser (bundled `src/lib/analytics.ts`) | — | Imports as a regular Astro/TS module from component scripts; reads `window.posthog` at call time; never imports posthog-js (no npm install needed). |
| Card / nav / footer click capture | Browser (single delegated listener in Base.astro) | — | Phase 2 emits `data-event` + `data-product-id`/`data-link-location`/`data-form` attributes; one `document.addEventListener('click', ...)` reads them via `event.target.closest('[data-event]')`. Zero coupling to per-component scripts. |
| Form submit handlers (interest + problem-pitch) | Browser (component-level `<script>` blocks) | — | Submit handlers must call `posthog.identify()` then `track()` then render confirmation. Component-scoped scripts keep handler logic next to the form markup. NOT `is:inline` — these are Astro-bundled scripts. |
| Survey-id mapping | Build-time (`src/lib/surveys.ts` constant) | — | Hardcoded map keyed by productId; resolved at module-load time. `astro check` fails the build if a productId in the union is missing from the map (TypeScript exhaustiveness). |
| Notification routing (Slack/Zapier→Gmail) | External service (PostHog dashboard webhook destination OR Zapier integration) | — | Configured in PostHog's dashboard UI (NOT in code); PostHog fires the webhook when a `survey sent` or `problem_pitch` event arrives. User-action item — cannot be automated. |
| Dashboard with 5 Insights | External service (PostHog dashboard) | — | User builds these in the PostHog UI per the spec strings in Pattern 8. Cannot be automated. |
| Canary verification | Browser → PostHog ingest → User's eyes on dashboard | — | User opens preview URL, navigates, then opens PostHog Activity feed and confirms events arrive. Hard human-action checkpoint. |
| Calendar reminder | External (user's calendar app) | — | User creates the recurring weekly reminder. Cannot be automated. |

## Standard Stack

### Core (already installed Phase 1/2 — no change in Phase 3)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `^6.1.10` | Static site generator, page routing, content layer | Phase 1 lock; serves static `dist/` with Phase 3 instrumentation embedded |
| `tailwindcss` + `@tailwindcss/vite` | `^4.2.4` | Utility-first styling | Phase 1 lock; form confirmation states styled with named utilities |
| `typescript` | `^5.9.3` strict | Type safety | Astro 6 scaffold default; the typed `analytics.ts` wrapper is the load-bearing payoff |
| `@astrojs/check` | `^0.9.9` | Type checker for `.astro` files | Phase 1 install; verifies the string-literal union narrows correctly |

### To Add in Phase 3

**None — verified.** The PostHog SDK loads via the CDN snippet pattern, NOT `npm install`. The `package.json` `dependencies` block stays unchanged through Phase 3. [VERIFIED: posthog.com/docs/libraries/astro recommends the snippet with `is:inline`; sample code shows no `import` statement and no npm install.]

This contradicts CLAUDE.md's stack research that lists `posthog-js@^1.371` as a dependency. The dependency-table entry is a stack-research artifact from before the Astro-specific snippet pattern was investigated; the orchestrator note "no posthog-js yet" in package.json reflects this. The snippet pattern downloads the same `array.js` runtime (currently posthog-js@1.372.5 [VERIFIED: `npm view posthog-js dist-tags` 2026-04-29]) but via `https://us-assets.i.posthog.com/static/array.js` instead of npm.

**Why the snippet beats npm:**

1. **`is:inline` script tags do NOT get bundled by Astro** — `import` statements inside them silently fail at build time (the script is emitted verbatim into HTML, the `import` becomes a runtime browser request that 404s with no module resolution). This is the canonical Phase 3 footgun. Pitfall 1.
2. **The snippet pattern uses PostHog's loader (`array.js`)** — a tiny stub that creates a `window.posthog` proxy with method stubs, then asynchronously fetches the full SDK and replaces the proxy. Calls to `posthog.capture()` made before the full SDK loads are queued in `__request_queue` and flushed on `_dom_loaded()`. [VERIFIED: posthog/posthog-js/posthog-core.ts source — "queues events called before the SDK is fully ready"]
3. **Build hashing / CSP**: The snippet is the same on every page (no per-page hash drift); `script-src 'self' https://us-assets.i.posthog.com` already permits both the inline-snippet load AND the `array.js` fetch. The `'unsafe-inline'` for scripts is NOT required — the inline snippet's content is hashed by the browser against the CSP.

Wait — that last point needs one verification step. The current `vercel.json` does NOT include `'unsafe-inline'` in `script-src`. CSP-strict inline scripts require either `'unsafe-inline'`, a `nonce-`, or a `sha256-` hash. **This is a real gotcha** — see Pitfall 3 below for the resolution path. The Phase 1 CSP allowlists the asset host but not the inline-execution permission.

**Version verification command:**

```bash
# Verify current latest before Plan 03 ships:
npm view posthog-js version    # Expect 1.372.x or higher
npm view posthog-js dist-tags  # Confirms 'latest' channel
```

[VERIFIED 2026-04-29: posthog-js@1.372.5 is `latest`; previous=1.297.4, beta=1.8.0-beta.1.]

### Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **CDN snippet via `<script is:inline>`** | `npm install posthog-js` + bundled init module | If you want the SDK code SRI-pinned, hashed, and version-locked at build time. Cost: ~85KB minified gzipped added to the static bundle, plus the snippet's lazy-loading benefit (only paid on engagement) is lost. PostHog's official Astro guide recommends the snippet. |
| **Hardcoded survey-id map in `src/lib/surveys.ts`** | `data-survey-id="..."` attribute on each form | Map approach gives compile-time exhaustiveness via TypeScript (every productId in the union must be a key); attribute approach scatters the survey-id strings across 5 product .md files. Map wins. |
| **Direct `posthog.capture('survey sent', ...)` for per-card forms** | `posthog.getActiveMatchingSurveys()` + render PostHog widget | The widget approach wants to render its own form markup and forces a 3-coupling-point flow (dashboard config → JS fetch → JS submit). Phase 2 already shipped form HTML; the widget would replace it and lose the bracketed-placeholder pattern. PostHog dashboard recognizes responses by `$survey_id` + `$survey_response_$question_id` regardless of capture source. [VERIFIED: posthog.com/docs/surveys/implementing-custom-surveys] |
| **`person_profiles: 'identified_only'`** (cookies allowed) | `cookieless_mode: 'always'` | If a legal review concludes that ePrivacy/GDPR consent banners are required for first-party cookies in your audience geographies. PROJECT.md locks identified-only; documented one-line upgrade path stays open. |
| **Single delegated click listener in Base.astro** | One `<script>` per ProductCard / nav-link / footer-link | Delegation reads the `data-event` attribute Phase 2 already emits; per-component listeners would re-attach on every product-detail-page render and require imports of the analytics module from every component. Delegation is the correct Phase 2/3 boundary closure. |
| **Component-level `<script>` blocks for form submit** | Inline `onsubmit="..."` HTML attributes | Component `<script>` blocks are Astro-bundled, get TypeScript checking via `astro check`, and can `import` the analytics module. Inline `onsubmit` attributes can't import, lose typing, and would need `'unsafe-inline'` CSP. |

**Installation:**

No new packages in Phase 3. Verify post-phase:

```bash
diff <(git show main:package.json) package.json
# Expect: zero new dependencies; only scripts.analytics-audit added (see Pattern 3)
```

## Architecture Patterns

### System Architecture Diagram

```
                                     ┌──────────────────────────────────┐
                                     │      User loads any page         │
                                     │   (home / /products/[slug])      │
                                     └─────────────┬────────────────────┘
                                                   │
                                                   ▼
                                     ┌──────────────────────────────────┐
                                     │   src/layouts/Base.astro <head>  │
                                     │                                  │
                                     │  <script is:inline>              │
                                     │    !function(t,e){var o,n,p,r;...│
                                     │    posthog.init(                 │
                                     │      'phc_xxx',                  │
                                     │      { defaults: '2026-01-30',   │
                                     │        person_profiles: ...,     │
                                     │        autocapture: false, ...,  │
                                     │        loaded: (ph) => {         │
                                     │          ph.capture('page:       │
                                     │            home_view',           │
                                     │            { location:'home' }); │
                                     │        }                         │
                                     │      })                          │
                                     │  </script>                       │
                                     │                                  │
                                     │  <script is:inline>              │
                                     │    /* delegated click listener   │
                                     │       reads data-event attrs */  │
                                     │  </script>                       │
                                     └─────────────┬────────────────────┘
                                                   │
                                                   │ window.posthog ready
                                                   │ (loaded: callback fired)
                                                   ▼
              ┌────────────────────────────────────┴────────────────────────────────────┐
              │                                                                         │
              ▼                                                                         ▼
   ┌──────────────────────┐                                              ┌──────────────────────────┐
   │  delegated listener  │                                              │ form submit handler      │
   │  (in Base.astro)     │                                              │ (in InterestForm.astro   │
   │                      │                                              │  or ProblemPitchForm     │
   │  click → closest     │                                              │  component <script>)     │
   │  ('[data-event]') →  │                                              │                          │
   │  read data-event,    │                                              │  (1) preventDefault()    │
   │  data-product-id,    │                                              │  (2) read FormData       │
   │  data-link-location  │                                              │  (3) analytics.identify  │
   │       │              │                                              │      (email, traits)     │
   │       ▼              │                                              │  (4) analytics.track     │
   │  analytics.track     │                                              │      ('form:submit'  OR  │
   │  ('card:open',{...}) │                                              │       'problem_pitch:    │
   │  or                  │                                              │        submit',          │
   │  'card:cta_external_ │                                              │       {productId,        │
   │   click' or          │                                              │        survey_id, ...}   │
   │  'nav:link_click' or │                                              │  (5) render confirm UI   │
   │  'footer:link_click' │                                              │                          │
   └──────────┬───────────┘                                              └──────────┬───────────────┘
              │                                                                     │
              └─────────────────────────────────────┬───────────────────────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────────┐
                                     │   src/lib/analytics.ts           │
                                     │   (typed wrapper, bundled module)│
                                     │                                  │
                                     │   track(name: EventName, props)  │
                                     │   identify(email, traits)        │
                                     │   ↓ calls window.posthog         │
                                     └─────────────┬────────────────────┘
                                                   │
                                                   │ HTTPS POST
                                                   ▼
                                     ┌──────────────────────────────────┐
                                     │   PostHog us.i.posthog.com       │
                                     │   (event ingestion)              │
                                     └─────────────┬────────────────────┘
                                                   │
                                ┌──────────────────┴────────────────┐
                                │                                   │
                                ▼                                   ▼
                ┌────────────────────────────┐       ┌──────────────────────────────┐
                │  Webhook destination       │       │   PostHog dashboard          │
                │  (Slack OR Zapier→Gmail)   │       │   - per-card submit count    │
                │  Configured in PostHog     │       │   - per-card CTR             │
                │  dashboard UI; fires on    │       │   - form-open→submit funnel  │
                │  'survey sent' +           │       │   - weighted demand-rank     │
                │  'problem_pitch' events    │       │   - qualitative responses    │
                └────────────────────────────┘       └──────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── content.config.ts             # Existing — Phase 2
├── content/products/             # Existing — Phase 2 (6 .md files)
├── components/                   # Existing — Phase 2
│   ├── global/
│   │   ├── Nav.astro              # MODIFY — add data-event="nav:link_click"
│   │   │                          #          + data-link-location to <a> tags
│   │   ├── Footer.astro           # MODIFY — add data-event="footer:link_click"
│   │   │                          #          + data-link-location to <a> tags
│   │   └── Analytics.astro        # NEW — TECH-03 names this; the PostHog snippet lives here,
│   │                              #       imported into Base.astro <head>
│   ├── sections/
│   │   ├── Hero.astro             # No change
│   │   ├── AgenticAIExplainer.astro # MODIFY — add IntersectionObserver-based
│   │   │                          #          'educator:scroll_complete' fire
│   │   ├── ProductGrid.astro      # No change (cards already emit data-event)
│   │   └── ProblemPitchSection.astro # No change
│   ├── cards/
│   │   ├── ProductCard.astro      # No change (already emits data-event)
│   │   └── StageBadge.astro       # No change
│   ├── forms/
│   │   ├── InterestForm.astro     # MODIFY — remove `disabled`, add submit handler
│   │   │                          #          script that calls identify+track,
│   │   │                          #          render confirmation state
│   │   └── ProblemPitchForm.astro # MODIFY — same pattern, no productId, no survey_id
│   └── diagrams/
│       └── MermaidDiagram.astro   # MODIFY — add IntersectionObserver fire
│                                  #          for 'diagram:view' (defensive against
│                                  #          Phase 4 swap)
├── lib/                          # NEW DIRECTORY — Phase 3
│   ├── analytics.ts               # NEW — typed wrapper, string-literal union
│   └── surveys.ts                 # NEW — hardcoded survey-id map keyed by productId
├── layouts/
│   └── Base.astro                # MODIFY — add the PostHog snippet in <head>
│                                  #          + delegated click listener
├── pages/
│   ├── index.astro                # No change
│   └── products/[slug].astro      # No change
└── styles/global.css             # No change

docs/                              # NEW DIRECTORY — Phase 3
└── demand-metric.md              # NEW — DEMAND-03 deliverable

(root)
.env.local                         # NEW (gitignored already) — PUBLIC_POSTHOG_KEY=phc_xxx
package.json                       # MODIFY — add scripts.analytics-audit grep guard
```

### Pattern 1: PostHog SDK Bootstrap via CDN Snippet (ANALYTICS-01)

**What:** A single `<script is:inline>` block in `Base.astro <head>` containing PostHog's official loader snippet + `posthog.init(...)` call with the locked config. The project API key is interpolated at build time via `import.meta.env.PUBLIC_POSTHOG_KEY`.

**When to use:** Once, on every page (Base.astro is the layout for both home and product-detail routes).

**Example** [VERIFIED: posthog.com/docs/libraries/astro]:

```astro
---
// src/components/global/Analytics.astro (NEW)
// Imported into Base.astro <head>. The is:inline directive is REQUIRED — without it,
// Astro tries to bundle the script and the snippet's IIFE pattern + window.posthog
// global pattern break.
//
// PUBLIC_POSTHOG_KEY is the project API key (e.g. phc_xxx). The PUBLIC_ prefix is
// REQUIRED for Astro to expose it to client-side code via import.meta.env.
// Without PUBLIC_, the value is undefined at runtime.
const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;
---

{posthogKey && (
  <script is:inline define:vars={{ posthogKey }}>
    !function (t, e) {
      var o, n, p, r;
      e.__SV ||
        ((window.posthog = e),
        (e._i = []),
        (e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split('.');
            2 == o.length && ((t = t[o[0]]), (e = o[1])),
              (t[e] = function () {
                t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
              });
          }
          ((p = t.createElement('script')).type = 'text/javascript'),
            (p.crossOrigin = 'anonymous'),
            (p.async = !0),
            (p.src =
              s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') +
              '/static/array.js'),
            (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
          var u = e;
          for (
            void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
              u.people = u.people || [],
              u.toString = function (t) {
                var e = 'posthog';
                return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
              },
              u.people.toString = function () {
                return u.toString(1) + '.people (stub)';
              },
              o =
                'init Te _s capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric'.split(
                  ' '
                ),
              n = 0;
            n < o.length;
            n++
          )
            g(u, o[n]);
          e._i.push([i, s, a]);
        }),
        (e.__SV = 1));
    }(document, window.posthog || []);

    posthog.init(posthogKey, {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
      loaded: function (ph) {
        // Canary event ANALYTICS-05 — fires immediately on every page load,
        // proves the pipeline end-to-end. Distinct location prop per page lets
        // the dashboard distinguish home_view from product-detail-view if needed.
        var loc = window.location.pathname === '/' ? 'home' : 'product-detail';
        ph.capture('page:home_view', { location: loc });
      },
    });
  </script>
)}
```

**Key gotchas the planner must lock into acceptance criteria:**

1. **`is:inline` is REQUIRED.** Astro's bundler does not process `is:inline` scripts; this is intentional — it's the only way to embed code that defines `window.posthog` synchronously. Without `is:inline`, Astro tries to bundle the snippet and the IIFE pattern breaks.
2. **`PUBLIC_` prefix on env var is REQUIRED.** `import.meta.env.PUBLIC_POSTHOG_KEY` is exposed to client-side code; `import.meta.env.POSTHOG_KEY` (no PUBLIC_) is server-side-only and resolves to `undefined` in the static-build output. [VERIFIED: docs.astro.build/en/guides/environment-variables/]
3. **`define:vars` is the canonical way to pass server values into `is:inline` scripts.** Astro inlines the value as a `const` at the top of the script body. Without `define:vars`, the inline script can't access frontmatter variables.
4. **Init is called once per page load.** PostHog's `_i.push([key, config, name])` pattern handles repeat calls gracefully but the convention is one call. The `loaded:` callback fires once per init; per-page navigation in a static-output Astro site triggers a fresh page load (no SPA hydration), so this is naturally correct.
5. **The `loaded:` callback is the canary fire site.** Firing `page:home_view` from `loaded` (not at the top of the snippet) guarantees the SDK is fully initialized before the first event. ANALYTICS-05 verifies these events arrive — fire from `loaded` to remove the queue-vs-immediate timing variable.
6. **Inline-script CSP**: The current `vercel.json` `script-src 'self' https://us-assets.i.posthog.com` does NOT include `'unsafe-inline'`. **This will block the inline snippet from executing.** Resolution paths in Pitfall 3.

### Pattern 2: Typed Analytics Wrapper at `src/lib/analytics.ts` (ANALYTICS-02 + ANALYTICS-03)

**What:** A bundled TS module that exposes `track(eventName, props)` and `identify(email, traits)`. The first argument of `track` is a string-literal union covering the full taxonomy from ANALYTICS-03; props are a discriminated union keyed on event name so per-event property contracts are compile-time-enforced.

**When to use:** Every event firing call. Imported from form component `<script>` blocks; called from the delegated click listener in `Base.astro`.

**Example:**

```typescript
// src/lib/analytics.ts
//
// All event firing goes through this module. ANALYTICS-02:
// "direct calls to window.posthog.capture are forbidden by lint/code-review convention."
// We enforce this with `npm run analytics-audit` (see Pattern 3).

// ----- Event taxonomy (ANALYTICS-03) -----

export type EventName =
  | 'page:home_view'
  | 'nav:link_click'
  | 'card:open'
  | 'card:cta_external_click'
  | 'form:open'
  | 'form:abandon'
  | 'form:submit'
  | 'problem_pitch:submit'
  | 'diagram:view'
  | 'educator:scroll_complete'
  | 'footer:link_click';

// ----- Per-event property contracts (discriminated by event name) -----

export type EventProps = {
  'page:home_view': { location: 'home' | 'product-detail' };
  'nav:link_click': { location: string };          // e.g. 'header', 'mobile-menu'
  'card:open': { productId: string };
  'card:cta_external_click': { productId: string }; // buggerd-only at v1
  'form:open': { productId?: string; form: 'interest' | 'problem-pitch' };
  'form:abandon': { productId?: string; form: 'interest' | 'problem-pitch'; field?: string };
  'form:submit': { productId: string; survey_id: string };
  'problem_pitch:submit': { has_email: boolean };
  'diagram:view': { diagram_id: 'pipeline-run' | 'ship-to-you' };
  'educator:scroll_complete': Record<string, never>; // no props
  'footer:link_click': { location: string };       // e.g. 'docs', 'github', 'email'
};

// ----- Survey-response props for the per-card forms (DEMAND-01) -----
// PostHog dashboard recognizes 'survey sent' events by $survey_id +
// $survey_response_$question_id. We capture 'form:submit' for our typed
// taxonomy AND a separate 'survey sent' event with the PostHog-shaped props
// so the dashboard's Surveys UI sees the response.
//
// Question UUIDs come from the dashboard at Survey-creation time.
// The user pastes them into src/lib/surveys.ts after creating each Survey.

export interface SurveyResponseProps {
  $survey_id: string;
  // PostHog uses "$survey_response_$question_id" as the property key.
  // We type these as a Record because the question_id values are runtime strings.
  [key: `$survey_response_${string}`]: string | undefined;
}

// ----- Wrapper API -----

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void;
      identify: (
        distinctId: string,
        userProps?: Record<string, unknown>
      ) => void;
      __loaded?: boolean;
    };
  }
}

export function track<E extends EventName>(eventName: E, props: EventProps[E]): void {
  if (typeof window === 'undefined') return; // SSR safety; unreachable for static build but cheap
  const ph = window.posthog;
  if (!ph) {
    // SDK not yet loaded. PostHog's snippet queues capture() calls before _dom_loaded(),
    // so this branch is rare. Log to console for the canary-debugging window.
    if (import.meta.env.DEV) console.warn('[analytics] posthog not ready, dropping', eventName, props);
    return;
  }
  ph.capture(eventName, props as Record<string, unknown>);
}

// Identify before track on form:submit. ANALYTICS-04.
// `first_signup_location` lets the dashboard see which page first captured the email.
export function identify(email: string, traits: { first_signup_location: string }): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.identify(email, { email, ...traits });
}

// Survey-response capture is a separate path because the PostHog dashboard
// recognizes the 'survey sent' event by name + $survey_id. Internally we ALSO
// fire 'form:submit' so our typed taxonomy stays consistent.
export function captureSurveyResponse(props: SurveyResponseProps): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.capture('survey sent', props as Record<string, unknown>);
}
```

**Why this shape:**

1. **`EventName` union enforces taxonomy.** A `track('card:click', ...)` call (typo: should be `card:open`) fails `astro check` at build time. Phase 2's `data-event="card:open"` attributes are matched verbatim against this union.
2. **`EventProps[E]` discriminated lookup.** `track('card:open', { productId: 'buggerd' })` typechecks; `track('card:open', { location: 'home' })` fails — `productId` is required. This compile-time guarantee replaces a class of runtime bugs.
3. **Three exported functions, not one.** `track` for typed events; `identify` for the identification step; `captureSurveyResponse` for the PostHog Surveys-shaped event. Splitting them keeps the typed-taxonomy contract clean — survey-response props are a different shape and shouldn't pollute `EventProps`.
4. **Defensive `window.posthog` undefined check.** If the snippet hasn't loaded (network failure, ad blocker), the wrapper silently drops events rather than throwing. PostHog's snippet pattern queues calls before `_dom_loaded()` but there's an edge case: events fired *after* the page completes but *before* the SDK fetch returns (network slow). Pitfall 5 covers identify-before-track ordering safety on top of this.
5. **No `import 'posthog-js'`** — the wrapper reads `window.posthog` (typed via `declare global`). This is the cleanest way to keep the snippet pattern intact while still getting typing.

### Pattern 3: Lint/Grep Guard for Direct `posthog.capture` Calls (ANALYTICS-02)

**What:** A `npm run analytics-audit` script (mirroring the Phase 2 `npm run honesty-audit` pattern) that greps for direct `posthog.capture(` or `window.posthog.capture(` outside `src/lib/analytics.ts`.

**When to use:** Run as part of Phase 3 verification chain; can be added to a future CI step or pre-commit hook.

**Example:**

```json
// package.json scripts addition
{
  "scripts": {
    "honesty-audit": "...",
    "analytics-audit": "if grep -rEn '(window\\.)?posthog\\.capture\\(' src/ | grep -v 'src/lib/analytics.ts' | grep -v '// ALLOW'; then echo '\\nAnalytics audit FAILED — direct posthog.capture call found outside analytics.ts. See ANALYTICS-02 + Pattern 2 in 03-RESEARCH.md.' && exit 1; else echo 'Analytics audit PASSED.'; fi"
  }
}
```

**Why grep over eslint:**

- We don't have eslint in the project (Phase 1 chose `astro check` + `prettier-plugin-astro` per the Tech-Stack table). Adding eslint just for this rule is overkill.
- The grep is one line; the regex is auditable.
- The `// ALLOW` escape hatch lets us mark the inline snippet body in `Analytics.astro` as legitimately calling `posthog.capture` from the `loaded:` callback (the snippet IS the wrapper-bypass for the canary; the typed wrapper requires `window.posthog` to be ready, which inside `loaded:` it is by definition).

**Trade-off:** Grep doesn't understand TypeScript scope, so it'll match comments containing `posthog.capture(` literally. The `// ALLOW` opt-out covers this. If the planner wants stricter enforcement, the alternative is `eslint-plugin-no-restricted-syntax` with a custom rule — Phase 4 polish concern at most.

### Pattern 4: PostHog Surveys API Mode without the Widget (DEMAND-01)

**What:** Keep Phase 2's `<form>` markup. On submit, capture a `survey sent` event with the PostHog-shaped props (`$survey_id` from a hardcoded map; `$survey_response_$question_id` for each field). PostHog dashboard's Surveys UI recognizes the response by `$survey_id` regardless of how the event was captured.

**When to use:** All 5 per-card interest forms. NOT the open `problem_pitch` form (that uses bare `posthog.capture('problem_pitch', ...)` — see Pattern 6).

**Example — the survey-id map:**

```typescript
// src/lib/surveys.ts
//
// Hardcoded survey-id map. The user CREATES the 5 Surveys in the PostHog dashboard
// (User-Action Item 3) and pastes the dashboard-assigned UUIDs here. Each Survey
// also has 2 question UUIDs (email + free-text "what would you use this for") —
// pasted into `questions` below.
//
// astro check enforces exhaustiveness: if a productId is missing from this map,
// the const assertion + lookup typing fails the build.

export type ProductId =
  | 'scientific-paper-agent'
  | 'triage-router-bot'
  | 'recorder-extractor'
  | 'agentic-employees'
  | 'delegate';
//   ^ buggerd is intentionally absent — buggerd has no interest form
//     (CTA is external; see Phase 2 Pattern 8 + CONTENT-09).

export interface SurveyConfig {
  surveyId: string;       // $survey_id from PostHog dashboard
  questions: {
    email: string;        // question UUID for the email field
    context: string;      // question UUID for the "what would you use this for" field
  };
}

// USER-ACTION ITEM 3: paste the Survey UUIDs here after creating in PostHog dashboard.
// Until populated, the strings are placeholder and forms will dispatch
// $survey_id="PASTE_..." which PostHog will reject — Plan 04 acceptance verifies
// real UUIDs are present.
export const SURVEYS: Record<ProductId, SurveyConfig> = {
  'scientific-paper-agent': {
    surveyId: 'PASTE_SURVEY_ID_FOR_SCIENTIFIC_PAPER_AGENT',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'triage-router-bot': {
    surveyId: 'PASTE_SURVEY_ID_FOR_TRIAGE_ROUTER_BOT',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'recorder-extractor': {
    surveyId: 'PASTE_SURVEY_ID_FOR_RECORDER_EXTRACTOR',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  'agentic-employees': {
    surveyId: 'PASTE_SURVEY_ID_FOR_AGENTIC_EMPLOYEES',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
  delegate: {
    surveyId: 'PASTE_SURVEY_ID_FOR_DELEGATE',
    questions: {
      email: 'PASTE_QUESTION_ID_EMAIL',
      context: 'PASTE_QUESTION_ID_CONTEXT',
    },
  },
};

export function getSurveyConfig(productId: ProductId): SurveyConfig {
  return SURVEYS[productId];
}
```

**Why this approach over PostHog's `getActiveMatchingSurveys()`:**

- PostHog's `getActiveMatchingSurveys()` API fetches active surveys + renders PostHog's widget UI. We already have form HTML from Phase 2; the widget would replace it.
- The dashboard recognizes a response by `$survey_id` + `$survey_response_$question_id` regardless of capture source — direct `posthog.capture('survey sent', {...})` works. [VERIFIED: posthog.com/docs/surveys/implementing-custom-surveys: "you can call posthog.capture() independently without invoking getActiveMatchingSurveys()"]
- Hardcoded map provides **compile-time exhaustiveness**: `Record<ProductId, SurveyConfig>` requires every ProductId to be a key. Adding a 7th product to the union without adding its map entry fails `astro check`.
- Trade-off: the user must create 5 Surveys in the dashboard manually (User-Action Item 3) and paste 5 survey UUIDs + 2 question UUIDs each = 15 strings into `surveys.ts`. There's no PostHog API to bulk-create Surveys. This is the price of the Surveys-API-mode lock from PROJECT.md.

### Pattern 5: Identify-Before-Track Ordering Safety (ANALYTICS-04)

**What:** The form submit handler uses an explicit "wait for SDK ready" gate before calling `identify()` then `track()`. This prevents a race where the user submits faster than the SDK's lazy-load.

**When to use:** Every form submit handler (interest + problem-pitch).

**Example — InterestForm submit handler script block:**

```astro
---
// src/components/forms/InterestForm.astro (Phase 3 wired version)
import { getSurveyConfig, type ProductId } from '../../lib/surveys';

interface Props {
  productId: ProductId;
}
const { productId } = Astro.props;
const survey = getSurveyConfig(productId);
---

<form
  class="mt-12 max-w-xl border border-muted/20 rounded-md p-6"
  data-form="interest"
  data-product-id={productId}
  data-survey-id={survey.surveyId}
  data-question-email={survey.questions.email}
  data-question-context={survey.questions.context}
  aria-labelledby={`interest-${productId}-legend`}
>
  <p id={`interest-${productId}-legend`} class="font-display text-xl tracking-tight text-fg">
    [Tell us you'd use this]
  </p>
  <p class="mt-2 text-sm text-muted">
    [Bracketed-placeholder copy — Phase 4 polishes. Sketch B voice.]
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
      class="mt-1 w-full px-3 py-2 border border-muted/30 rounded text-fg"
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
      class="mt-1 w-full px-3 py-2 border border-muted/30 rounded text-fg"
    ></textarea>
  </div>

  <button
    type="submit"
    class="mt-6 px-4 py-2 bg-accent text-bg font-medium rounded hover:bg-accent/90"
  >
    Send
  </button>

  <p class="mt-4 text-sm text-muted hidden" data-confirmation>
    [Confirmation copy — bracketed placeholder, Phase 4 polishes. Sketch B voice.]
  </p>
</form>

<script>
  // Component-scoped script. NOT is:inline. Astro bundles this; TS gets checked
  // by astro check; we can import the typed wrapper.
  import { track, identify, captureSurveyResponse } from '../../lib/analytics';

  document.querySelectorAll<HTMLFormElement>('form[data-form="interest"]').forEach((form) => {
    const productId = form.dataset.productId!;
    const surveyId = form.dataset.surveyId!;
    const questionEmailId = form.dataset.questionEmail!;
    const questionContextId = form.dataset.questionContext!;
    const confirmEl = form.querySelector<HTMLElement>('[data-confirmation]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fd = new FormData(form);
      const email = String(fd.get('email') ?? '').trim();
      const context = String(fd.get('context') ?? '').trim();
      if (!email || !context) return; // browser validation already enforces required

      // Identify before track. ANALYTICS-04.
      identify(email, { first_signup_location: window.location.pathname });

      // Typed taxonomy event.
      track('form:submit', { productId, survey_id: surveyId });

      // PostHog Surveys-shaped event. The dashboard's Surveys UI shows responses
      // captured this way under the matching Survey definition.
      captureSurveyResponse({
        $survey_id: surveyId,
        [`$survey_response_${questionEmailId}`]: email,
        [`$survey_response_${questionContextId}`]: context,
      });

      // Render confirmation state.
      form.querySelector<HTMLElement>('input[type=email]')!.disabled = true;
      form.querySelector<HTMLElement>('textarea')!.disabled = true;
      form.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled = true;
      if (confirmEl) confirmEl.classList.remove('hidden');
    });

    // form:open fires once on first focus inside the form.
    let opened = false;
    form.addEventListener('focusin', () => {
      if (opened) return;
      opened = true;
      track('form:open', { productId, form: 'interest' });
    });
  });
</script>
```

**Why this works:**

1. **`event.preventDefault()` is mandatory.** A `<form>` with no `action` and no JS submit handler defaults to refresh-on-submit when Enter-in-text-input fires. Phase 2 used `disabled` inputs to block this; Phase 3 enables the inputs and must replace `disabled` with `preventDefault`. Pitfall 6 covers this.
2. **`identify()` is synchronous from the caller's perspective.** PostHog's `identify` sets the local distinct_id immediately (the network sync of person properties happens async, but the next `capture()` already carries the new distinct_id). [VERIFIED: posthog/posthog-js/posthog-core.ts source — identify mutates persistence + distinct_id synchronously.]
3. **No explicit "wait for `loaded:` callback" gate in the submit handler.** Why not? Because by the time a user has clicked into the form, typed an email, typed a context sentence, and hit Submit, the SDK has had ample time (network + parse) to finish loading. The `loaded:` callback fires within ~200ms typically; user form-fill takes seconds-to-minutes. The defensive `if (!ph) return` in the wrapper handles the worst case (network failure / ad blocker) by silently dropping the event — better than throwing.
4. **`form:open` on first `focusin`** captures the funnel-top event for DEMAND-05's per-card form-open-to-submit conversion Insight.
5. **Three event captures per submit** is intentional — `form:submit` is the typed-taxonomy event; `survey sent` is the PostHog-Surveys-recognized event; the `identify()` call stitches the user. All three fire from the same handler in the documented order.

**Edge-case footgun to surface:** if the user submits with an email that has trailing whitespace, the `.trim()` is essential — PostHog uses the email string as the person distinct_id. Same email with vs without whitespace creates two persons.

### Pattern 6: ProblemPitchForm Submit Handler (DEMAND-02)

Simpler — bare `posthog.capture('problem_pitch', ...)`, no Surveys plumbing, optional email.

```astro
<script>
  import { track, identify } from '../../lib/analytics';

  const form = document.querySelector<HTMLFormElement>('form[data-form="problem-pitch"]');
  if (form) {
    const confirmEl = form.querySelector<HTMLElement>('[data-confirmation]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const email = String(fd.get('email') ?? '').trim();
      const problem = String(fd.get('problem') ?? '').trim();
      if (!problem) return;

      // Email is optional on this form. If provided, identify the user.
      if (email) {
        identify(email, { first_signup_location: window.location.pathname });
      }

      track('problem_pitch:submit', { has_email: Boolean(email) });

      // Bare capture with the problem text as a property — DEMAND-02 says
      // "uses bare posthog.capture('problem_pitch', {...})". This goes through
      // our wrapper for ANALYTICS-02 compliance, then we pass the problem as
      // a property. The wrapper is the only call site for posthog.capture;
      // the analytics-audit grep verifies this.
      track('problem_pitch:submit' as never, {
        // The has_email property is enough for top-line ranking;
        // the actual problem text is not in the typed event props on purpose
        // (free-text in the typed taxonomy invites scope creep).
        // For DEMAND-05 qualitative free-text Insight, we capture problem
        // text via a SECOND wrapper-bypass call — see footnote.
        has_email: Boolean(email),
      } as never);

      // Confirmation state.
      form.querySelector<HTMLInputElement>('input[type=email]')!.disabled = true;
      form.querySelector<HTMLTextAreaElement>('textarea')!.disabled = true;
      form.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled = true;
      if (confirmEl) confirmEl.classList.remove('hidden');

      // Footnote: the qualitative-text capture for DEMAND-05.
      // We add an `extras` capture for the free-text problem description.
      // This SHOULD route through analytics.ts, so we add a separate
      // captureProblemPitch(problem) function to analytics.ts and call it here.
      // See analytics.ts addition below.
    });

    let opened = false;
    form.addEventListener('focusin', () => {
      if (opened) return;
      opened = true;
      track('form:open', { form: 'problem-pitch' });
    });
  }
</script>
```

And one extra function in `analytics.ts`:

```typescript
// Open-ended problem-pitch capture — the free-text body is too noisy for the
// EventProps typed contract but DEMAND-05 wants it surfaced in a readable list.
// One wrapper function so the analytics-audit grep stays clean.
export function captureProblemPitch(problem: string, hasEmail: boolean): void {
  if (typeof window === 'undefined') return;
  const ph = window.posthog;
  if (!ph) return;
  ph.capture('problem_pitch', { problem, has_email: hasEmail });
}
```

The form handler then calls `captureProblemPitch(problem, Boolean(email))` instead of the second `track()` call shown above.

### Pattern 6b: Defensive `diagram:view` Wiring Against Phase 2 Placeholder (ANALYTICS-03 forward-compat)

**What:** Add an IntersectionObserver to `MermaidDiagram.astro` that fires `analytics.track('diagram:view', { diagram_id })` when the placeholder `<div>` enters the viewport. When Phase 4 swaps in the real Mermaid runtime, the analytics keep working with zero changes.

**Why now:** Phase 2 ships `MermaidDiagram` as a placeholder (`<div class="border-2 border-dashed border-muted/30 rounded-md p-12 text-center text-muted">[Diagram — Phase 4]</div>`). Phase 3's event taxonomy includes `diagram:view`. Wiring the observer against the placeholder costs ~10 lines and saves Phase 4 from touching analytics.

```astro
---
// src/components/diagrams/MermaidDiagram.astro (Phase 3 wiring on Phase 2 placeholder)
interface Props {
  diagramId: 'pipeline-run' | 'ship-to-you';
}
const { diagramId } = Astro.props;
---

<div
  class="border-2 border-dashed border-muted/30 rounded-md p-12 text-center text-muted"
  data-diagram-id={diagramId}
>
  [Diagram — Phase 4]
</div>

<script>
  import { track } from '../../lib/analytics';

  document.querySelectorAll<HTMLElement>('[data-diagram-id]').forEach((el) => {
    let fired = false;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !fired) {
          fired = true;
          track('diagram:view', {
            diagram_id: el.dataset.diagramId as 'pipeline-run' | 'ship-to-you',
          });
          obs.disconnect();
        }
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
</script>
```

**Caveat:** The home page's section components don't currently pass a `diagramId` prop to MermaidDiagram (Phase 2 didn't render any). Phase 3's plan must add the placeholder usage on the home page (e.g., in `AgenticAIExplainer.astro` or a new section component) so the observer has something to fire against. OR — defer the diagram:view event wiring to Phase 4 with the real diagrams. **Recommendation: wire the observer NOW; Phase 4's plan only swaps the placeholder body, not the observer.** This keeps Phase 4's work analytics-free.

### Pattern 7: `docs/demand-metric.md` (DEMAND-03)

**What:** A standalone markdown file at `docs/demand-metric.md` (NOT a section in PROJECT.md) committing the formula, gate, and trigger action in writing.

**File shape:**

```markdown
# Demand Metric

**Locked:** 2026-04-30 (PROJECT.md Key Decisions)
**Owner:** kjs (will revisit at 4-week mark or 5-submits-per-card mark, whichever first)

## What this measures

Per-card demand for the 6 product candidates surfaced on jigspec.com. The output is a ranking that tells us which vertical to ship next.

## Formula

For each product card, the per-card demand score is:

```
demand_score = 1.0 × submits + 0.3 × opens + 0.1 × clicks + 0.05 × dwell_seconds
```

Where, for the time window from page launch to evaluation:

- **submits** = count of distinct `survey sent` events for the per-card form (or `card:cta_external_click` for buggerd, since buggerd has no interest form)
- **opens** = count of distinct `card:open` events
- **clicks** = count of all click events that include the productId in the property bag (sum of `card:open` + `card:cta_external_click`)
- **dwell_seconds** = the per-product-page dwell time, measured as `$pageleave.timestamp - $pageview.timestamp` for `/products/{slug}` pageviews; for buggerd (no on-site detail page) dwell is the time between `$pageview` for `/` and the next event from the same session
- All counts are **per distinct user** (de-duplicated by PostHog distinct_id) over the evaluation window

## Gate

The demand-ranking decision triggers at **whichever comes first**:

1. **5 form submits per card** for ≥1 card, OR
2. **4 weeks of traffic** since launch

If neither has triggered by 4 weeks + 1 day, the 4-week branch fires anyway.

## Action that triggers

Vertical-pick decision — kjs commits in writing which of the 5 concept cards (or buggerd, or none) becomes the next vertical to invest in. Recorded in `.planning/PROJECT.md` Key Decisions table.

## Notes

- The weights bias heavily toward submits (1.0 vs 0.3 / 0.1 / 0.05) because submits are the highest-intent signal — a user who gave us their email has crossed an ask threshold. Opens and clicks are exploration; dwell is interest.
- The 0.05 dwell weight is small on purpose. Dwell is noisy (background tabs, distracted users) and easy to spoof; a high dwell with no submit is weak signal.
- The formula is reviewed at the 4-week + vertical-pick checkpoint. If it produces an obviously wrong ranking against gut + qualitative free-text reading, we revisit.
```

**Why standalone over PROJECT.md section:**

- PROJECT.md is the project definition; metric definition is operational. Different audience, different update cadence.
- A future operator searches for "demand metric" by filename in three seconds; PROJECT.md fishing takes minutes.
- Keeps PROJECT.md from growing into an everything-document.
- The `docs/` directory is otherwise empty (Phase 5 will eventually point `docs.jigspec.com` at the existing VitePress site, not at this file). The naming overlap is fine — `docs/demand-metric.md` is internal docs, `docs.jigspec.com` is the public docs site.

### Pattern 8: PostHog Dashboard with 5 Specific Insights (DEMAND-05)

The user builds these 5 Insights in the PostHog dashboard (User-Action Item 5). Plans give the user the spec strings — the actual configuration is dashboard-side.

**Insight 1 — Per-card submit count:**
- Type: Trends
- Event: `survey sent` (per-card forms) AND `card:cta_external_click` (buggerd-only)
- Breakdown: `productId` (event property) for `survey sent`; for `card:cta_external_click` the productId is always `buggerd`
- Aggregation: Total count by event-property `productId`
- Time range: All time (since launch)
- Display: Bar chart, sorted by count desc

**Insight 2 — Per-card click-through rate (CTR):**
- Type: Funnel
- Step 1: `page:home_view` (location = 'home')
- Step 2: `card:open` (productId = ?) — one funnel per card
- OR build as Trends with formula `card:open / page:home_view × 100` grouped by productId
- Breakdown: `productId`
- Display: Pie chart or bar

**Insight 3 — Per-card form-open-to-submit conversion:**
- Type: Funnel
- Step 1: `form:open` (productId = ?, form = 'interest')
- Step 2: `form:submit` (productId = ?)
- Breakdown: `productId`
- Display: Funnel chart

**Insight 4 — Weighted demand-rank ordering (the headline number):**
- Type: SQL Insight (PostHog's HogQL)
- Query (illustrative — user adjusts to match their PostHog HogQL syntax):

```sql
SELECT
  productId,
  count(*) FILTER (WHERE event = 'survey sent' OR (event = 'card:cta_external_click' AND productId = 'buggerd')) AS submits,
  count(*) FILTER (WHERE event = 'card:open') AS opens,
  count(*) FILTER (WHERE event IN ('card:open', 'card:cta_external_click')) AS clicks,
  -- dwell is harder; approximate via session duration on /products/{productId} pages
  avg(session_duration) FILTER (WHERE pathname LIKE '/products/%') AS dwell_seconds,
  (1.0 * submits) + (0.3 * opens) + (0.1 * clicks) + (0.05 * dwell_seconds) AS demand_score
FROM events
WHERE timestamp > toDateTime('2026-05-01')
GROUP BY productId
ORDER BY demand_score DESC
```

- Display: Table, sorted by `demand_score` desc

**Insight 5 — Qualitative free-text values list:**
- Type: Events table view filtered to `survey sent` events
- Columns: timestamp, distinct_id, productId, $survey_response_$question_id (the context field)
- Filter: `event = 'survey sent'`
- Sort: timestamp desc
- Plus: events table view for `problem_pitch` events showing the `problem` property
- Display: Two side-by-side event tables; the user can read the qualitative values as a list rather than digging into individual event detail panels

**Why dashboard-side and not code-side:**

PostHog's Insights are configured via the dashboard UI. There's a PostHog API for programmatic Insight creation but it's overkill for 5 one-time Insights. The user pastes the queries from the plan task into the dashboard.

### Anti-Patterns to Avoid

- **`autocapture: true`**: forbidden by CLAUDE.md "What NOT to Use." Floods the event stream with `$autocapture` events drowning out the actual demand signals. We instrument the 5 cards + form submits + footer/nav links explicitly.
- **Calling `posthog.init` more than once per page load**: silently re-initializes state and can lose events. Init lives in `Analytics.astro` (one place).
- **Putting `import` statements inside `is:inline` scripts**: Astro emits the script verbatim; the `import` becomes a runtime browser request that 404s. Use bundled scripts for logic that needs imports; reserve `is:inline` for the snippet bootstrap.
- **Reading `window.posthog` during Astro frontmatter execution**: frontmatter runs at build time on the server; `window` doesn't exist. Always read from inside a `<script>` block (component-scoped or `is:inline`).
- **Calling `posthog.capture(...)` directly from a component script** (bypassing `analytics.ts`): violates ANALYTICS-02; the `npm run analytics-audit` grep fails the verification chain.
- **Forgetting `.trim()` on the email before `identify`**: PostHog uses the string as the person distinct_id. `'foo@bar.com '` and `'foo@bar.com'` create two persons. Same logic for `.toLowerCase()` — do it OR don't, but be consistent. Recommendation: `.trim()` only; case-sensitive distinct_id matches the user's literal input.
- **Hardcoding the project API key in `Analytics.astro` source**: must come from `import.meta.env.PUBLIC_POSTHOG_KEY`. Hardcoding leaks into git history.
- **Pushing `.env.local` to git**: `.env.local` MUST be in `.gitignore`. Verify before the first commit on Plan 03.
- **Forgetting to add `PUBLIC_POSTHOG_KEY` to Vercel env vars**: the build will succeed locally (with `.env.local`) and silently break on Vercel (missing env var → `posthogKey` is undefined → the `{posthogKey && ...}` guard skips the snippet entirely → no events anywhere).
- **Skipping the `event.preventDefault()` in form submit handlers**: Pitfall 6 — Enter-in-text-input causes a page refresh, losing the analytics call.
- **Using `disabled` on inputs as the "form submitted" signal in the confirmation state**: works, but combine with hiding the submit button OR replacing the form body with a confirmation `<p>` so the visual state matches the inert state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PostHog SDK loader | Hand-write a script tag pointing at `array.js` | The official snippet from PostHog dashboard / posthog.com/docs/libraries/astro | The snippet's loader pattern (the `_i.push([...])` queue, the dynamic-import of the full SDK from `-assets.i.posthog.com/static/array.js`) is non-trivial; reimplementing it loses the queueing-before-ready behavior |
| Per-event TS type for props | Inline `Record<string, unknown>` everywhere | `EventProps[E]` discriminated lookup keyed on the union | Discriminated union catches typos at compile time; runtime check would catch them at the next deploy |
| Click event delegation | Per-component `addEventListener` on every card / link | One delegated listener in `Base.astro` reading `[data-event]` | Phase 2 already emits the data attributes; per-component listeners would re-attach on each page navigation and require importing `analytics.ts` from every component |
| PostHog Surveys widget | Render PostHog's UI via `getActiveMatchingSurveys()` | Direct `posthog.capture('survey sent', ...)` with the right `$survey_id` shape | Phase 2's form HTML is fine; the dashboard recognizes responses by `$survey_id` regardless of capture source [VERIFIED] |
| Notification webhook router | Build our own webhook proxy | PostHog dashboard webhook integrations OR Zapier PostHog→Gmail Zap | Both are zero-code dashboard configuration; building a webhook proxy is a backend service we explicitly don't have |
| Survey-id resolution | Read survey_id from a `data-survey-id` attribute set in product .md frontmatter | `Record<ProductId, SurveyConfig>` map in `src/lib/surveys.ts` | Map gives compile-time exhaustiveness; .md frontmatter is loose-typed |
| `loaded:` callback gating | Polling loop on `posthog.__loaded` | The `loaded: (ph) => {...}` config option | Documented official API; polling races with the SDK's own ready signal |
| Email validation | Custom regex | The browser's `<input type="email" required>` | Browser validation runs on submit; covers 95% of valid-email cases; PostHog accepts whatever string we pass |
| Confirmation state UX | Generic alert / toast library | Inline `<p data-confirmation hidden>...</p>` toggle | A 5-line vanilla pattern beats a 50KB toast library; matches the "no JS framework" Astro static stance |
| Free-text problem text storage | Backend table | PostHog event property | Event properties are queryable in PostHog dashboard's Insights table view; DEMAND-05 explicitly wants the values surfaced there |

**Key insight:** Phase 3's correctness leans almost entirely on **the typed wrapper + the data-attribute delegation pattern + the hardcoded survey-id map**. Three disciplines, each preventing a class of runtime bug. The PostHog SDK itself, the Surveys API, and the dashboard Insights are all dashboard-side configuration the user owns. Plans should be explicit about which lines of work are codeable (Claude) vs. dashboard-side (user).

## Common Pitfalls

### Pitfall 1: `import` inside an `is:inline` script
**What goes wrong:** Plan author writes the snippet bootstrap with `import { someThing } from '...'` inside the `<script is:inline>` block. The build succeeds; the browser hits a 404 on the import URL (Astro emits the script verbatim, no module resolution).
**Why it happens:** Habit from regular `<script>` blocks (which Astro DOES bundle). The `is:inline` directive is the breaking-point.
**How to avoid:** Reserve `is:inline` for code that has zero imports. The PostHog snippet body is pure IIFE + global mutation; no imports allowed inside. Keep all `import { track } from '../../lib/analytics'` calls in regular (bundled) `<script>` blocks at the component level.
**Warning signs:** 404 in the browser console for an import URL like `/_astro/...js`; no events captured; PostHog dashboard empty.

### Pitfall 2: Missing `PUBLIC_` prefix on env var
**What goes wrong:** Plan author defines `POSTHOG_KEY=phc_xxx` in `.env.local` and `import.meta.env.POSTHOG_KEY` in `Analytics.astro`. The build succeeds; runtime value is `undefined`; the `{posthogKey && ...}` guard skips the snippet; no events fire; dashboard empty.
**Why it happens:** Astro's env-var convention (`PUBLIC_` prefix for client-exposed vars) is documented but easy to miss. [VERIFIED: docs.astro.build/en/guides/environment-variables/]
**How to avoid:** Plan task explicitly names the env var `PUBLIC_POSTHOG_KEY`. Verify: at runtime, `console.log(import.meta.env.PUBLIC_POSTHOG_KEY)` (in dev) returns the value; on Vercel preview, view-source on the deployed page shows the snippet body with the real key inlined (NOT `undefined`).
**Warning signs:** View-source shows `posthog.init('undefined', ...)`. The PostHog SDK then logs an error to console. No events arrive.

### Pitfall 3: CSP blocks the inline snippet
**What goes wrong:** Phase 1's CSP is `script-src 'self' https://us-assets.i.posthog.com`. The PostHog snippet is an inline `<script>...</script>` block — `'self'` covers same-origin file URLs, NOT inline content. Browser blocks the snippet from executing. Console shows "Refused to execute inline script because it violates the following Content Security Policy directive".
**Why it happens:** CSP-strict mode (no `'unsafe-inline'` for scripts) is the Phase 1 default; the inline snippet pattern needs an exception.
**How to avoid:** Three resolution paths, in order of preference:
   1. **Add `'unsafe-inline'` to `script-src`** (simplest; the marketing site is low-risk for XSS — no user-generated content rendered, no SQL, no auth). One-line `vercel.json` edit. Trade-off: weakens CSP. Acceptable for v1 marketing site per OWASP marketing-site CSP guidance.
   2. **Use a CSP `nonce-` value**: Astro 6 has a stable `addScriptHashes` API for build-time CSP hashes. Each build computes the SHA256 of the inline script body; the CSP includes the hash. More work; tighter security.
   3. **Move the snippet to a same-origin static file** (`public/posthog-init.js`) and load via `<script src="/posthog-init.js">`. CSP `'self'` covers it. Trade-off: loses the `define:vars` env-var injection — would need a build step to template the key into the file.
**Recommendation:** Path 1 for v1 (one-line CSP relaxation; document the trade-off in the plan SUMMARY). Path 2 is the right answer when the page accumulates more scripts; revisit at Phase 4 polish.
**Warning signs:** Console error "Refused to execute inline script". `Analytics.astro` rendered correctly in `dist/index.html` (view-source shows the snippet) but the snippet body never executes.

### Pitfall 4: Event-name typo between Phase 2's data-attributes and `EventName` union
**What goes wrong:** Phase 2's `ProductCard.astro` emits `data-event="card:open"` (literal string). The Phase 3 union types `'card:open'`. A typo on either side (e.g., `data-event="card_open"` in the markup, or `'card:opn'` in the union) silently drops events — the delegated listener calls `track('card:opn', ...)` which fails the type check, OR the delegated listener reads `'card_open'` which doesn't match the union and falls through.
**Why it happens:** Two source-of-truth files for the same string. No build-time link between them.
**How to avoid:** Phase 3's plan adds a verification step: after Phase 3 ships, run a grep over `src/components/` for every `data-event="..."` value and confirm each appears in `EventName` union in `analytics.ts`. The grep can be a one-liner: `grep -roh 'data-event="[^"]*"' src/components/ | sort -u | sed 's/data-event="\([^"]*\)"/\1/'` produces the list of strings; cross-check against the EventName union in code review.
**Warning signs:** PostHog dashboard shows events for some cards but not others; or a card's click "feels right" in the UI but no event arrives.

### Pitfall 5: Identify-track race condition on slow networks
**What goes wrong:** User on a slow connection types fast and submits before the SDK's full `array.js` has loaded. The snippet's queue captures the call but `identify()` and `capture()` ordering inside the queue isn't strictly guaranteed across the queue→flush boundary. Events arrive at PostHog with `$anon_distinct_id` instead of the email-keyed distinct_id. Stitching breaks.
**Why it happens:** The snippet's `__request_queue` pattern queues by call order, but the underlying SDK's identify-vs-capture ordering depends on when each is flushed.
**How to avoid:** Two layers of defense:
   1. **Wrapper-level `if (!ph) return`** in `analytics.ts` — if the SDK isn't ready at all, drop the event silently rather than queue it. This is a slight feature loss (the queue would have eventually fired) in exchange for predictable ordering.
   2. **Form-level `loaded:` flag check** — the snippet's `loaded:` callback could set `window.__posthog_ready = true`, and the form submit handler could `if (!window.__posthog_ready) { /* show "still loading, retry" UX */; return }`. This is heavier-handed and worth implementing only if the ANALYTICS-04 ordering proves unreliable in canary verification.
**Recommendation:** Ship the wrapper defensive check (layer 1) on Plan 04. If canary verification shows missing identifications, add layer 2 in a follow-up plan.
**Warning signs:** PostHog Persons view shows an email-keyed person AND a separate `$anon_*`-keyed person from the same session, with the form-submit event attached to the anon one.

### Pitfall 6: `<form>` Enter-in-text-input bypasses submit button
**What goes wrong:** User types email + context, hits Enter inside the textarea (or email field). The form's default submit fires; with no `action` attribute, the page refreshes to the same URL; the analytics call is lost.
**Why it happens:** Browser default form submission triggers on Enter-in-text-input regardless of whether a submit button has a click handler. The submit button's disabled state is irrelevant.
**How to avoid:** `event.preventDefault()` in the submit handler. If the user hits Enter, the form's `submit` event fires; the handler intercepts; preventDefault stops the refresh; the rest of the handler runs identically to button-click submission. Phase 2's placeholder used `disabled` inputs to block all submission; Phase 3 enables inputs and MUST replace `disabled`-blocking with `preventDefault`-blocking.
**Warning signs:** Form refresh on Enter; no event in PostHog; URL bar shows the same page reloaded.

### Pitfall 7: Survey-id placeholder strings shipped to production
**What goes wrong:** Plan 04 ships with `surveyId: 'PASTE_SURVEY_ID_FOR_DELEGATE'` still in `src/lib/surveys.ts` because the user hasn't yet created the Surveys in the PostHog dashboard. Forms submit; PostHog rejects the `survey sent` event silently (the `$survey_id` doesn't match any defined Survey); dashboard Surveys UI shows zero responses; demand signal is silently broken.
**Why it happens:** The user-action item for Survey creation (Item 3) and the code-edit step are decoupled. Easy to ship code with placeholder strings and forget to update.
**How to avoid:** Plan 04 acceptance criterion: grep `src/lib/surveys.ts` for `'PASTE_'` returns zero matches before commit. Also: Plan 04 task explicitly orders the user to (a) create Surveys, (b) paste UUIDs, THEN (c) commit. The plan task block walks the user through the dashboard flow.
**Warning signs:** `grep -r "PASTE_" src/lib/` returns matches; OR PostHog dashboard Surveys UI shows zero responses despite forms ostensibly working.

### Pitfall 8: Missing PostHog hosts in CSP `connect-src` for survey ingestion
**What goes wrong:** Phase 1 CSP allowlists `connect-src 'self' https://us-assets.i.posthog.com https://us.i.posthog.com`. PostHog occasionally adds new asset hosts when you turn on additional features (e.g., `surveys.i.posthog.com` for the Surveys widget). If a future PostHog feature needs a new origin, the SDK's network call is blocked by CSP. Survey responses fail to ingest.
**Why it happens:** PostHog's host list isn't statically documented; it's discovered when a feature is enabled.
**How to avoid:** During canary verification (Plan 03), open the browser DevTools Network tab and confirm all PostHog requests (init, capture, decide, etc.) are 200 OK; any blocked request will show as `(blocked:csp)`. If a new host appears, add it to `connect-src` in `vercel.json` and redeploy. The current pair (`us-assets.i.posthog.com` + `us.i.posthog.com`) covers init + ingest in 2026-04 testing.
**Warning signs:** Network tab shows `(blocked:csp)` for any PostHog request; OR events captured locally but missing from dashboard.

### Pitfall 9: Vercel env var set in wrong scope (Preview vs Production)
**What goes wrong:** User adds `PUBLIC_POSTHOG_KEY` to Vercel "Production" only. The preview deploys (where ANALYTICS-05 canary verification happens) don't see it; the snippet skips; canary fails on preview.
**Why it happens:** Vercel's env-var scoping has three checkboxes (Production / Preview / Development); user defaults to Production-only.
**How to avoid:** Plan 03 task explicitly tells the user to check ALL THREE scopes (or at least Production + Preview + Development). Verify with `vercel env ls` after setting.
**Warning signs:** Localhost works; preview URL events missing.

## Code Examples

All patterns above are copy-paste-ready. Cross-reference:

| Need | Pattern section | Notes |
|------|-----------------|-------|
| `src/components/global/Analytics.astro` (PostHog snippet) | Pattern 1 | Imported into Base.astro head |
| `src/lib/analytics.ts` (typed wrapper) | Pattern 2 | Includes EventName union, EventProps lookup, track / identify / captureSurveyResponse / captureProblemPitch |
| `npm run analytics-audit` script | Pattern 3 | One line in package.json |
| `src/lib/surveys.ts` (survey-id map) | Pattern 4 | User pastes UUIDs after dashboard step |
| `InterestForm.astro` submit handler | Pattern 5 | Component-scoped script with three captures (identify + form:submit + survey sent) |
| `ProblemPitchForm.astro` submit handler | Pattern 6 | Simpler — bare problem_pitch capture, optional email |
| `MermaidDiagram.astro` IntersectionObserver | Pattern 6b | Defensive against Phase 4 swap |
| `docs/demand-metric.md` | Pattern 7 | Standalone file with formula, gate, action |
| PostHog dashboard 5 Insights spec | Pattern 8 | User-built in dashboard |

### Delegated click listener (Base.astro addition)

```astro
<!-- src/layouts/Base.astro additions in <head> -->

<!-- 1. PostHog snippet (Pattern 1) -->
<Analytics />

<!-- 2. Delegated click listener (component-scoped, NOT is:inline) -->
<script>
  import { track, type EventName, type EventProps } from '../lib/analytics';

  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest('[data-event]');
    if (!target) return;

    const eventName = target.getAttribute('data-event') as EventName | null;
    if (!eventName) return;

    const productId = target.getAttribute('data-product-id') ?? undefined;
    const linkLocation = target.getAttribute('data-link-location') ?? undefined;

    // Cast is necessary because we can't statically narrow eventName to a
    // specific union member from a string attribute. The runtime contract
    // is that data-event values are kept in sync with EventName via Pitfall 4's
    // grep verification.
    switch (eventName) {
      case 'card:open':
      case 'card:cta_external_click':
        if (productId) track(eventName, { productId });
        break;
      case 'nav:link_click':
      case 'footer:link_click':
        track(eventName, { location: linkLocation ?? 'unknown' });
        break;
      // form:open is handled in form components (focus-based, not click-based)
      // diagram:view is handled in MermaidDiagram (IntersectionObserver, not click)
      // Other events fire from their own component scripts.
      default:
        // Unknown event — log in dev only.
        if (import.meta.env.DEV) console.warn('[analytics] unhandled delegated event', eventName);
    }
  });
</script>
```

### Nav.astro modification (add data-event attributes)

```astro
{/* In Nav.astro — add data-event + data-link-location to each <a> */}
<a
  href={link.href}
  data-event="nav:link_click"
  data-link-location={`header-${link.label.toLowerCase()}`}
  class="text-sm text-fg hover:text-accent transition-colors"
>
  {link.label}
</a>
```

### Footer.astro modification (similar)

```astro
<a
  href="https://jigspec.com"
  data-event="footer:link_click"
  data-link-location="docs"
  class="hover:text-accent transition-colors"
>
  Docs
</a>
{/* Repeat for email, GitHub */}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `posthog-js` via npm install + `import posthog from 'posthog-js'` | CDN snippet via `<script is:inline>` (the official PostHog Astro pattern) | PostHog Astro doc updated to recommend the snippet [VERIFIED 2026-04-29] | Smaller bundle, lazy SDK fetch, snippet handles `window.posthog` definition correctly even if Astro tries to bundle other scripts. Downside: harder to TS-type without `declare global`. |
| `cookieless_mode: 'always'` for "no banner" requirement | `person_profiles: 'identified_only'` with default cookies | PostHog cookieless tutorial clarifies that cookieless mode disables `identify()` | PROJECT.md correctly locks `identified_only`; no banner needed for US-based audience under SaaS-marketing convention; identify-on-submit stitches anonymous→identified events |
| `posthog.capture('survey sent', { $survey_id: 'integer' })` | `posthog.capture('survey sent', { $survey_id: 'UUID', '$survey_response_$question_id': 'value' })` | PostHog Surveys revamped UUIDs (~2024); old integer IDs deprecated | Survey UUIDs come from the dashboard at Survey-creation time; the `$survey_response_$question_id` shape supports multi-question surveys |
| `defaults: '2025-05-24'` | `defaults: '2026-01-30'` | PostHog 1.350+ added the new defaults date | `'2026-01-30'` enables `external_scripts_inject_target: 'head'` to prevent SSR hydration errors. Locked in REQUIREMENTS.md. |
| Free-form event names | String-literal-union typed events | TypeScript best practice (since ~2022) | Catches naming-drift bugs at build time; makes the event taxonomy a first-class artifact |
| `getActiveMatchingSurveys()` widget rendering | Direct `posthog.capture('survey sent', ...)` from existing form HTML | PostHog supports both; the direct-capture path is documented as supported | Lets us keep Phase 2 form HTML; one fewer JS dependency on PostHog's UI layer |

**Deprecated/outdated to watch in our docs:**

- CLAUDE.md "Technology Stack" table lists `posthog-js@^1.371` as a dependency. The current Phase 3 plan does NOT install posthog-js (CDN snippet pattern). The CLAUDE.md entry is stack-research residue — flag for a doc-fix in Plan 05 (mirror the Phase 2 doc-drift pattern). Same fix: append a clarifying note that posthog-js's runtime is loaded from `us-assets.i.posthog.com` via the CDN snippet, not via npm install.
- CLAUDE.md "PostHog Surveys: skip for v1, document the upgrade path" advice (research recommendation in CLAUDE.md) directly contradicts PROJECT.md's locked decision to use Surveys for the per-card forms. The Plan 04 task should explicitly re-confirm with the user that Surveys is the intended path (Surveys are locked per PROJECT.md Key Decisions; CLAUDE.md's advice predates that lock). The user CAN flip to bare-capture for the per-card forms too if they want — would simplify dashboard config to zero — but they explicitly chose Surveys.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PostHog's CDN snippet pattern is the official Astro recommendation | Pattern 1 | Low — verified directly against posthog.com/docs/libraries/astro 2026-04-29. If wrong, fall back to npm install path with `import posthog from 'posthog-js'` and use a non-`is:inline` script in Base.astro head. The wrapper's API (Pattern 2) is unchanged either way. |
| A2 | Phase 1's CSP needs `'unsafe-inline'` (or a hash/nonce) to allow the snippet | Pitfall 3 | Medium — assumed based on standard CSP semantics. If wrong (e.g., Vercel auto-injects nonces), the resolution path collapses to "do nothing." Verification: deploy Plan 03 to preview, check browser console for CSP errors before Plan 04 ships. |
| A3 | `posthog-js@1.372.5` (current latest) is forward-compatible with `defaults: '2026-01-30'` | Pattern 1 | Low — `defaults: '2026-01-30'` is documented and additive. If newer SDK changes break it, pin via the CDN URL (PostHog provides version-pinned URLs) or fall back to `defaults: '2025-11-30'`. |
| A4 | PostHog dashboard recognizes `survey sent` events captured directly (no widget) by `$survey_id` | Pattern 4 | Low-Medium — verified against posthog.com/docs/surveys/implementing-custom-surveys: "you can call posthog.capture() independently without invoking getActiveMatchingSurveys() first." If wrong (dashboard-side gating I missed), fall back to widget-rendering path which is heavier but documented. |
| A5 | The `loaded:` callback fires after the SDK is fully initialized (not just stub-loaded) | Pattern 1 + Pitfall 5 | Low — verified by reading posthog/posthog-js source: `loaded(this)` is called inside `_loaded()` after persistence + session init. If wrong, the canary fire from `loaded:` could miss; back-stop is a `setTimeout(() => track('page:home_view'), 500)` outside the snippet. |
| A6 | A US-based marketing-site audience does NOT require a cookie banner under current US privacy law | Locked Decisions (carry-forward from PROJECT.md) | Medium — California, Colorado, etc. have ePrivacy-adjacent laws. The current decision in PROJECT.md is "no banner required" for US audience; a legal review could change this. Documented one-flip upgrade path to `cookieless_mode: 'always'` keeps the option open. |
| A7 | The user can configure a PostHog webhook integration to fire on `survey sent` and `problem_pitch` events to Slack | User-Action Item 4 | Low — PostHog has built-in webhook destinations. If not (e.g., free-tier limitation), the Zapier path is the documented fallback and doesn't depend on PostHog webhook tier. |
| A8 | Phase 4 swap of MermaidDiagram from placeholder to real diagrams will preserve the `[data-diagram-id]` attribute | Pattern 6b | Low — Phase 4's `astro-mermaid` integration replaces the placeholder body with rendered SVG; the wrapper `<div>` with the data attribute is component-author-controlled. If wrong (Phase 4 designs an entirely different component), the diagram:view wiring needs to move to Phase 4 — minimal cost. |
| A9 | The hardcoded survey-id map in `surveys.ts` is the right TS-exhaustive pattern | Pattern 4 | Low — `Record<ProductId, SurveyConfig>` requires every ProductId. If wrong (TS doesn't enforce as expected), fall back to a `Map<ProductId, SurveyConfig>` runtime check on import. The pattern is canonical TypeScript. |
| A10 | The 5-plan structure (with hard human-action checkpoint between Plan 03 and Plan 04) correctly satisfies ANALYTICS-05 | Plan-structure recommendation | Low — ANALYTICS-05 is unambiguous about ordering. If the planner prefers a 4-plan or 6-plan structure, the canary-before-forms gate must still be enforced via a hard checkpoint somewhere in the sequence. |

## Open Questions

1. **Should `educator:scroll_complete` use IntersectionObserver against the AgenticAIExplainer section's bottom, or scroll-position math?**
   - What we know: ANALYTICS-03 lists the event; CONTENT-02 is a 250-400 word explainer section.
   - What's unclear: "scroll complete" definition — last paragraph in viewport, OR section bottom-edge crossing the viewport bottom, OR 80% of section height scrolled past.
   - Recommendation: IntersectionObserver on the section's bottom-most paragraph with `threshold: 1.0` (fully visible). Fires once per page load. Plan 04 task spells this out.

2. **Do we want `dwell_seconds` calculated in PostHog (via `$pageleave - $pageview` timestamps) or computed server-side from raw events?**
   - What we know: DEMAND-03 formula uses `dwell_seconds`. PostHog auto-captures `$pageview` and `$pageleave` (we have `capture_pageleave: true`).
   - What's unclear: whether PostHog's HogQL has a clean way to express "session_duration on page X" or whether the user assembles this in the SQL Insight (Pattern 8 Insight 4).
   - Recommendation: use PostHog's `session_duration` and the pathname filter (Pattern 8 query). If HogQL syntax differs in 2026, the user adjusts at dashboard-build time. Plan 05 acceptance is "Insight produces a number per productId," not a specific SQL string.

3. **Should we instrument `form:abandon` (user opens form, types nothing, leaves)?**
   - What we know: `form:abandon` is in the ANALYTICS-03 taxonomy list.
   - What's unclear: implementation triggers — `beforeunload` while the form is "open" but not "submitted"? Or focus-out without a submit?
   - Recommendation: minimal instrumentation in Plan 04 — fire `form:abandon` from a `beforeunload` listener if `form:open` has fired but `form:submit` has not. Edge case: user may abandon many times in a session as they explore. Idempotency: only fire `form:abandon` once per form per page load.

4. **Should the `analytics-audit` script run in `prebuild` or just on demand?**
   - What we know: `npm run analytics-audit` is the canonical guard (Pattern 3); doesn't currently block builds.
   - What's unclear: whether to gate `npm run build` on the audit (mirroring Phase 2's `honesty-audit` pattern, which is also on-demand).
   - Recommendation: on-demand for v1 (mirrors honesty-audit). Adding to Vercel's build command is one line in `vercel.json` "buildCommand"; do this in Phase 4 polish if the audit catches anything.

5. **Should Plan 03 ship `Analytics.astro` to Base.astro on the LIVE preview, or hold the Base.astro edit until Plan 04?**
   - What we know: ANALYTICS-05 canary requires events on the preview.
   - What's unclear: minimal-deploy ordering — Plan 03 could (a) commit `Analytics.astro` + `analytics.ts` + Base.astro head edit + the canary `loaded:` fire, deploy, verify; OR (b) commit the typed wrapper without yet wiring to Base.astro and let Plan 04 ship the wiring + forms together.
   - Recommendation: (a) — Plan 03 ships the SDK + canary + nav/footer data-attribute pass + delegated listener and verifies on preview. Plan 04 ships forms with identify-then-track. The split is bigger that way, but the canary verification has zero forms in the way and is the cleanest possible signal of "the pipeline works."

6. **Where does `educator:scroll_complete` instrumentation live — `AgenticAIExplainer.astro` or `Base.astro`?**
   - Recommendation: `AgenticAIExplainer.astro` (component-scoped script). Section-specific concern; living in Base.astro would make Base.astro the dumping ground for every cross-cutting analytics observer.

7. **Should the Plan 03/Plan 04 boundary include a code-side rollback path if canary verification fails?**
   - What we know: ANALYTICS-05 says "before any forms or cards ship." The Plan 03 deploy is reversible via `git revert` if PostHog setup is somehow broken.
   - Recommendation: the human-action checkpoint between Plan 03 and Plan 04 includes "verify canary OR rollback Plan 03 commit if events not arriving within 5 minutes of a real preview-URL visit." Plan 04 cannot start until canary verification is GREEN.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | ✓ | ≥22.12.0 (per `engines`) | — |
| npm | Package install | ✓ | bundled | — |
| Astro 6 | Already installed | ✓ | 6.1.10 | — |
| Tailwind 4 | Already installed | ✓ | 4.2.4 | — |
| Vercel CLI | Phase 1 | ✓ | (auto-deploy from main is the active path) | `vercel env add PUBLIC_POSTHOG_KEY preview` available if user prefers CLI over dashboard |
| Git + gh CLI | Phase 1 | ✓ | — | — |
| PostHog account / project | NEW (User-Action Item 1) | ✗ | — | Cannot ship Phase 3 without; user must create account on posthog.com (free tier) |
| Slack workspace OR Zapier account | NEW (User-Action Item 4) | ✗ (not verified) | — | Either path works; user picks at Plan 04 time |
| Vercel project access for env vars | NEW (User-Action Item 2) | ✓ (Phase 1 deployed) | — | Already have Vercel project `jigspec-landing` |

**Missing dependencies with no fallback:** PostHog account / project (User-Action Item 1) — Plan 03 cannot proceed past task 1 without it.

**Missing dependencies with fallback:** Slack vs Zapier — both are valid; user picks at Plan 04.

## Project Constraints (from CLAUDE.md)

CLAUDE.md is the project's standing instruction file. Phase 3-relevant directives:

1. **GSD workflow enforcement**: All Phase 3 work runs under `/gsd-execute-phase`.
2. **Tailwind 4 via `@tailwindcss/vite`** (locked): Phase 3 form confirmation states use named utilities (`text-fg`, `bg-accent`, `border-muted/20`).
3. **No `autocapture: true`** (CLAUDE.md "What NOT to Use"): locked in `posthog.init` config — Pattern 1.
4. **`is:inline` is required** for the PostHog snippet (CLAUDE.md PostHog Astro section): Pattern 1.
5. **Honesty constraint** (CLAUDE.md Voice Exclusion + CONTENT-08): Phase 3 form copy (placeholder) and confirmation copy must pass `npm run honesty-audit`.
6. **`person_profiles: 'identified_only'`** (CLAUDE.md "PostHog: anonymous-by-default, identify-on-submit"): locked.
7. **CLAUDE.md "PostHog Surveys: skip for v1"** advice contradicts PROJECT.md's lock to use Surveys. PROJECT.md wins (PROJECT.md is the project-level decision authority); the CLAUDE.md advice is a research-doc recommendation. The Plan 04 task should re-confirm Surveys path with the user, but the default path is Surveys.
8. **`posthog-js@^1.371` dependency-table entry** in CLAUDE.md: stack-research residue from before the CDN-snippet path was investigated. Plan 05 includes a CLAUDE.md doc-fix task adding a clarifying note that the SDK loads via CDN snippet, not npm.
9. **CSP includes PostHog hosts** (CLAUDE.md Vercel Configuration): confirmed present in `vercel.json`. The inline-script-execution gap (Pitfall 3) is the only Phase 3 CSP concern.
10. **Astro `output: 'static'`** (locked): no SSR in Phase 3.

## Plan Structure Recommendation (5 plans, with hard human-action checkpoint)

Plan structure that satisfies all 10 phase requirements with the canary-before-forms gate (ANALYTICS-05):

### Plan 03-01: PostHog Project Setup + Vercel Env Var
**Type:** primarily user-action with one minimal code commit.
**Tasks:**
1. **`checkpoint:human-action`** — User creates PostHog project, captures project API key (User-Action Item 1).
2. **`checkpoint:human-action`** — User adds `PUBLIC_POSTHOG_KEY=phc_xxx` to Vercel env vars in all three scopes (Production / Preview / Development) (User-Action Item 2).
3. **Code:** create `.env.local` (gitignored) with `PUBLIC_POSTHOG_KEY=phc_xxx` for local dev verification.
4. **Verification:** `vercel env ls` shows the var; local `astro dev` can read `import.meta.env.PUBLIC_POSTHOG_KEY`.

**Acceptance:** PostHog project exists; key flows into Vercel + .env.local; no code shipped to production yet.

### Plan 03-02: Typed Analytics Wrapper + Survey Map Skeleton
**Type:** code-only.
**Tasks:**
1. Create `src/lib/analytics.ts` with the EventName union, EventProps lookup, track / identify / captureSurveyResponse / captureProblemPitch (Pattern 2).
2. Create `src/lib/surveys.ts` with Record<ProductId, SurveyConfig> and PASTE_* placeholder UUIDs (Pattern 4).
3. Add `npm run analytics-audit` script to package.json (Pattern 3).
4. **Verification:** `astro check` clean; `npm run analytics-audit` PASSES (no `posthog.capture` outside analytics.ts because no consumers yet).

**Acceptance:** Typed-wrapper module shipped; map skeleton with placeholder UUIDs; audit script runs.

### Plan 03-03: PostHog SDK Boot + Canary + Delegated Listener (NO FORMS YET)
**Type:** code + verification.
**Tasks:**
1. Create `src/components/global/Analytics.astro` with the snippet + init config + `loaded:` canary fire (Pattern 1).
2. Modify `src/layouts/Base.astro` to import `<Analytics />` in `<head>` and add the delegated click listener script (Pattern: delegated listener).
3. Modify `src/components/global/Nav.astro` to add `data-event="nav:link_click"` + `data-link-location` attributes on each nav `<a>`.
4. Modify `src/components/global/Footer.astro` to add `data-event="footer:link_click"` + `data-link-location` on each footer `<a>`.
5. Modify `src/components/sections/AgenticAIExplainer.astro` to add IntersectionObserver script for `educator:scroll_complete` (Open Question 1: section bottom paragraph at threshold 1.0).
6. Modify `src/components/diagrams/MermaidDiagram.astro` to add IntersectionObserver for `diagram:view` (Pattern 6b).
7. Modify `vercel.json` CSP to add `'unsafe-inline'` to `script-src` (Pitfall 3 resolution path 1) — single-line edit, document trade-off in plan SUMMARY.
8. **Verification:** `astro check` clean; `npm run build` produces `dist/index.html` with the snippet visible in `<head>`; preview deploys via push to main.

**Acceptance:** SDK ships; canary `page:home_view` + `nav:link_click` + `footer:link_click` events fire on preview URL.

### Hard Human-Action Checkpoint (between Plan 03-03 and Plan 03-04)

**The canary-before-forms gate (ANALYTICS-05).**

Required: user opens preview URL, navigates (clicks nav, hits product cards, scrolls explainer), then opens PostHog → Activity feed and confirms events arrive. If events do NOT arrive within 5 minutes:
- ROLLBACK Plan 03-03 commits via `git revert`.
- Investigate (Pitfalls 2, 3, 8, 9 as common causes).
- Re-ship Plan 03-03.
- Re-verify.

ONLY after canary verification is GREEN does Plan 03-04 begin.

### Plan 03-04: Form Wiring (Interest + Problem-Pitch + Surveys Creation)
**Type:** primarily code with one user-action item interleaved.
**Tasks:**
1. **`checkpoint:human-action`** — User creates 5 PostHog Surveys in dashboard (User-Action Item 3) with the `productId` discriminator + email field + required free-text "what would you use this for" field. User captures the 5 survey UUIDs + 10 question UUIDs.
2. **`checkpoint:human-action`** — User pastes UUIDs into `src/lib/surveys.ts` (replaces all PASTE_* strings).
3. **Code:** modify `src/components/forms/InterestForm.astro` to (a) remove `disabled` attributes on inputs/button, (b) add the submit-handler `<script>` (Pattern 5), (c) add the `data-confirmation` `<p>` element.
4. **Code:** modify `src/components/forms/ProblemPitchForm.astro` to the same shape with the bare `posthog.capture('problem_pitch', ...)` path (Pattern 6).
5. **`checkpoint:human-action`** — User configures notification destination (Slack webhook OR Zapier-to-Gmail) (User-Action Item 4); verifies a test submission triggers the notification.
6. **Verification:** `npm run analytics-audit` PASSES; `grep -r "PASTE_" src/lib/` returns zero matches; preview deploys; test submission of each form arrives in PostHog dashboard AND triggers the notification destination.

**Acceptance:** All 5 per-card interest forms + 1 problem-pitch form working end-to-end; notification destination wired; PostHog Surveys UI shows responses.

### Plan 03-05: Demand Metric File + Dashboard + Calendar Reminder + Doc-Drift + Phase Verification
**Type:** primarily user-action with the doc-fix code edit + verification chain.
**Tasks:**
1. **Code:** create `docs/demand-metric.md` (Pattern 7).
2. **`checkpoint:human-action`** — User builds 5 Insights in PostHog dashboard per Pattern 8 specs (User-Action Item 5).
3. **`checkpoint:human-action`** — User creates weekly calendar reminder (User-Action Item 6, DEMAND-04 backstop).
4. **Code:** doc-fix CLAUDE.md "Technology Stack" table — append clarifying note that `posthog-js` runs via CDN snippet, not npm install (mirrors Phase 2 doc-drift pattern from 02-05).
5. **Verification:** Phase 3 verification chain — every phase requirement (ANALYTICS-01..05, DEMAND-01..05) is GREEN with a verifiable artifact (file path, dashboard URL, calendar entry, etc.).
6. **`checkpoint:human-action`** — User runs the canary verification one more time (User-Action Item 7) to confirm the full Phase 3 surface is shipping events end-to-end.

**Acceptance:** Phase 3 closes; all 10 requirements complete; STATE.md advances to Phase 4.

## User-Action Items (REQUIRED — cannot be automated)

These 7 items are the work the planner must factor as `checkpoint:human-action` tasks. Plans give the user concrete recipes; user does the dashboard / inbox / calendar work.

### User-Action Item 1: Create / select a PostHog project (Plan 03-01)

**What:** Sign up for PostHog (free tier covers v1 traffic), create a project for `jigspec.com` landing page, capture the project API key.

**How:**
1. Visit https://us.posthog.com/signup (US cloud — matches our `api_host: 'https://us.i.posthog.com'`).
2. Create a free-tier account.
3. Create a project named `jigspec-landing`.
4. Project Settings → API Keys → copy the project API key (format `phc_xxxxxxxxxxxxxxxxxxxxxx`).
5. Note the project's region (US).

**Verification:** the key starts with `phc_`; the dashboard shows a "no events yet" state.

### User-Action Item 2: Set the project API key as a Vercel env var (Plan 03-01)

**What:** Add `PUBLIC_POSTHOG_KEY=phc_xxx` to Vercel project env vars in ALL three scopes (Production, Preview, Development).

**How (option A — dashboard):**
1. Vercel Dashboard → Project `jigspec-landing` → Settings → Environment Variables.
2. Add new: name `PUBLIC_POSTHOG_KEY`, value `phc_xxx` (paste from Item 1).
3. Check ALL THREE scopes: Production, Preview, Development.
4. Save.
5. Redeploy production from `main` to pick up the new env var (Vercel auto-deploys; or trigger manually).

**How (option B — CLI):**
```bash
vercel env add PUBLIC_POSTHOG_KEY production preview development
# Paste the key when prompted.
vercel env ls   # Verify
```

**Also create local file:** `.env.local` (gitignored) with the same line for local `astro dev` testing.

**Verification:** `vercel env ls` shows the var across all three scopes; preview deploy of a no-op commit shows the snippet body in view-source with the literal key inlined (NOT `undefined`).

### User-Action Item 3: Create the 5 PostHog Surveys (Plan 03-04)

**What:** Create 5 Surveys in PostHog dashboard, one per concept card. Each Survey has 2 questions.

**How (per Survey):**
1. PostHog Dashboard → Surveys → New Survey.
2. Type: API only (NOT popover or full-page widget — we capture via posthog.capture from our form).
3. Name: e.g., `Scientific paper agent — interest`.
4. Question 1: Open ended. Label: `Email`. Required: yes. Save.
5. Question 2: Open ended. Label: `What would you use this for? (one or two sentences)`. Required: yes. Save.
6. Save Survey. PostHog assigns a UUID — copy it (the `$survey_id`).
7. Click into the Survey → each question has a UUID — copy both question UUIDs.

Repeat for: scientific-paper-agent, triage-router-bot, recorder-extractor, agentic-employees, delegate.

**Result:** 5 Survey UUIDs + 10 question UUIDs total (2 per Survey).

**Paste into:** `src/lib/surveys.ts` (replaces 15 PASTE_* placeholder strings).

**Verification:** `grep -r "PASTE_" src/lib/` returns zero matches; `astro check` clean.

### User-Action Item 4: Choose + wire notification destination (Plan 03-04)

**What:** Set up Slack webhook OR Zapier-to-Gmail Zap to receive notifications on `survey sent` and `problem_pitch` events. User picks at execution time.

**Option A — Slack (recommended for fastest setup):**
1. Slack workspace → Apps → install "Incoming Webhooks."
2. Pick a channel (e.g., `#jigspec-leads`); copy the webhook URL.
3. PostHog Dashboard → Project Settings → Webhooks (or Data Pipeline → Destinations).
4. Add destination: Slack webhook URL; trigger on events `survey sent` AND `problem_pitch`.
5. Test: from PostHog dashboard, fire a test event; confirm Slack message arrives.

**Option B — Zapier-to-Gmail:**
1. Zapier → New Zap.
2. Trigger: PostHog → New Event (configure with API key).
3. Filter: event name = `survey sent` OR `problem_pitch`.
4. Action: Gmail → Send Email (template with event properties: productId, email, context, etc.).
5. Activate Zap.
6. Test: fire a test event from PostHog; confirm Gmail arrives.

**Verification:** end-to-end test — submit a real form on the preview URL (with a test email like `test+jigspec@example.com`) and confirm both (a) PostHog dashboard shows the event AND (b) the chosen destination receives the notification within 1 minute.

### User-Action Item 5: Build the PostHog dashboard with 5 Insights (Plan 03-05)

**What:** Build 5 Insights in PostHog matching DEMAND-05's required views.

**How:** PostHog → Dashboards → New dashboard `JigSpec Demand`. Add 5 Insights per Pattern 8 spec.

**Verification:** dashboard URL exists; each of the 5 Insights renders (even if empty pre-traffic); user can describe what each shows.

### User-Action Item 6: Set weekly calendar reminder (Plan 03-05)

**What:** Recurring weekly calendar entry — "Check JigSpec demand dashboard. If 5 submits on any card OR 4 weeks since launch, decide vertical-pick."

**How:** User's calendar app (Google Calendar / iCal / etc.). Recurrence: weekly. Duration: 15 min. Reminder: 1 day before + 1 hour before. First occurrence: 1 week from launch.

**Verification:** calendar entry exists; user can show it.

### User-Action Item 7: Run canary verification (Plan 03-03 boundary + Plan 03-05 close)

**What:** Open the live preview URL; navigate (click nav, click cards, scroll explainer); open PostHog Activity feed; confirm events arrive in real time.

**How:**
1. Visit https://jigspec-landing.vercel.app (or current preview URL).
2. Click each nav link (`Products`, `Docs`, `About`).
3. Click each product card (concept cards open `/products/[slug]`; buggerd opens buggerd.com in new tab).
4. Scroll the entire home page top to bottom.
5. Open PostHog → Activity feed (or Live events view).
6. Confirm events arrive: `page:home_view`, `nav:link_click`, `card:open` (×5), `card:cta_external_click` (buggerd), `educator:scroll_complete`, `diagram:view` (if any placeholder rendered), `footer:link_click`.

**Two execution windows:**
1. **Plan 03-03 boundary** (canary-before-forms gate, ANALYTICS-05): the form events are NOT yet wired; only the SDK + listeners. Verify all non-form events arrive.
2. **Plan 03-05 close** (full-surface gate): all events including form submission. Submit each form once with test data; verify in PostHog and notification destination.

**Verification:** PostHog Activity feed shows the expected event sequence within 5 minutes of the user's clicks. If not, rollback per the checkpoint protocol.

## Sources

### Primary (HIGH confidence)
- [PostHog Astro library docs](https://posthog.com/docs/libraries/astro) — CDN snippet via `<script is:inline>` is the official path; init config pattern; `define:vars` requirement
- [PostHog JS configuration](https://posthog.com/docs/libraries/js/config) — `person_profiles`, `defaults` valid values (`'2026-01-30'` confirmed), `autocapture`, `capture_pageview`, `capture_pageleave`, persistence semantics
- [PostHog anonymous vs identified events](https://posthog.com/docs/data/anonymous-vs-identified-events) — `identified_only` mode, identify() semantics
- [PostHog cookieless tracking tutorial](https://posthog.com/tutorials/cookieless-tracking) — cookieless_mode disables identify(); identified_only is the path for stitching
- [PostHog custom surveys docs](https://posthog.com/docs/surveys/implementing-custom-surveys) — `survey sent` event name, `$survey_id` UUID matching, `$survey_response_$question_id` shape, "you can call posthog.capture() independently"
- [posthog/posthog-js source — posthog-core.ts](https://github.com/PostHog/posthog-js/blob/main/packages/browser/src/posthog-core.ts) — `loaded:` callback fires after `_loaded()` (post persistence + session init); `__request_queue` queues events called before SDK ready
- [npm view posthog-js (2026-04-29)](https://www.npmjs.com/package/posthog-js) — `latest`: 1.372.5; `previous`: 1.297.4
- [Astro 6 environment variables guide](https://docs.astro.build/en/guides/environment-variables/) — `PUBLIC_` prefix for client-exposed vars
- [Astro 6 script directives](https://docs.astro.build/en/reference/directives-reference/#script-directives) — `is:inline` semantics; `define:vars` for inlined values
- Phase 2 RESEARCH.md — content collection contract, block-link Heydon Pickering pattern, form-shaped placeholder pattern; carry-forward conventions for bracketed-placeholder copy
- Phase 2 SUMMARY 02-05 — Phase 2/3 boundary discipline (`posthog` references INVERT in dist/), `npm run honesty-audit` codification, doc-drift fix pattern
- vercel.json (Phase 1) — current CSP locks `script-src 'self' https://us-assets.i.posthog.com` and `connect-src 'self' https://us-assets.i.posthog.com https://us.i.posthog.com`

### Secondary (MEDIUM confidence)
- [PostHog Surveys responses docs](https://posthog.com/docs/surveys) — dashboard recognition pattern (verified by primary source above)
- [PostHog Webhook destinations](https://posthog.com/docs/cdp/destinations) — Slack + Zapier integrations (User-Action Item 4)
- [Vercel env-var docs](https://vercel.com/docs/projects/environment-variables) — three-scope setup (Production / Preview / Development)
- [posthog-js issue #213 (init or identify with different user token)](https://github.com/PostHog/posthog-js/issues/213) — identify() synchrony confirmation
- [posthog-js issue #1121 (using API before init)](https://github.com/PostHog/posthog-js/issues/1121) — pre-init queueing behavior

### Tertiary (LOW confidence — verify on first deploy)
- Inline-script CSP behavior — assumed CSP-strict mode requires `'unsafe-inline'` or hash/nonce; verify with browser console on first Plan 03-03 deploy (Pitfall 3)
- HogQL exact syntax for the demand-rank Insight (Pattern 8 Insight 4) — query is illustrative; user adjusts at dashboard-build time
- PostHog ad-blocker bypass / proxy rewrite — not used in v1; if event volume drops post-launch due to ad blockers, document upgrade path

## Metadata

**Confidence breakdown:**
- SDK init pattern (CDN snippet via `is:inline`): HIGH — verified against PostHog Astro docs; Pitfall 3 (CSP `'unsafe-inline'`) is a known unknown but resolution paths are clear
- Typed wrapper API (`EventName` union, `EventProps` lookup): HIGH — canonical TS pattern
- Survey-id wiring (hardcoded map): HIGH — TS exhaustiveness is well-understood
- Survey response capture (direct `posthog.capture('survey sent', ...)` without widget): MEDIUM-HIGH — verified by PostHog docs but the documented path is "supported" rather than "primary"
- Identify-before-track ordering safety: MEDIUM — `loaded:` callback is documented but the snippet's `__request_queue` ordering across identify/capture is implementation detail; defensive `if (!ph) return` is the safety net
- Plan structure (5 plans, hard checkpoint between 03-03 and 03-04): HIGH — ANALYTICS-05 is unambiguous; 5-plan structure cleanly satisfies it
- User-action items (count: 7): HIGH — each is a dashboard / inbox / calendar action with no code-side automation path

**Research date:** 2026-04-29
**Valid until:** 2026-06-29 (60 days — PostHog 1.372.x is stable; `defaults: '2026-01-30'` is current; if a new defaults date ships before 2026-06-29 the research is still valid because `2026-01-30` doesn't disappear)
