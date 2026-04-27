# Phase 1: Scaffold, Sketches & Visual Shell - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers a **deployed-but-empty preview URL** with the chosen visual identity (typography scale, palette, nav, footer, responsive shell) committed — and the editorial-vs-minimal-tech aesthetic call made *before* any content lands, so subsequent phases cannot drift into 70%-editorial territory.

In scope: Astro project scaffold, Tailwind 4 wired via `@tailwindcss/vite`, self-hosted typography via Astro Fonts API, two visual sketches, `Base.astro` + `Nav.astro` + `Footer.astro`, `vercel.json` mirroring buggerd's headers (with PostHog hosts allowlisted in CSP even though PostHog itself ships in Phase 3), responsive at 320 / 375 / 414 / desktop, GitHub repo + Vercel project + auto-deploy on `main`.

Out of scope (later phases): All page content (Phase 2), product cards/grid (Phase 2), `/products/[slug]` pages (Phase 2), PostHog SDK init (Phase 3), forms (Phase 3), analytics wrapper (Phase 3), Mermaid integration + diagrams (Phase 4), polish/cold-read/Lighthouse gate (Phase 4), apex DNS swap (Phase 5).

</domain>

<decisions>
## Implementation Decisions

User delegated all Phase 1 implementation decisions to Claude ("you make these decisions"). Decisions below are Claude's calls — locked unless the user overrides during planning or execution.

### Sketch medium & review
- **D-01:** Two visual sketches produced as **standalone static HTML files** at `.planning/sketches/sketch-a-confident-direct.html` and `.planning/sketches/sketch-b-engineering-blog-pragmatic.html`. Each is **fully self-contained** — Tailwind via CDN script tag, no build step, no shared assets. They are throwaway artifacts and explicitly NOT part of the production Astro project (which forbids the Tailwind CDN per STACK.md).
- **D-02:** Each sketch renders **the same placeholder content** (Hero block + one product card + a placeholder for the diagram-1 area + minimal nav + minimal footer) at desktop width with a brief mobile-width section below for visual reference. Differences between sketches are limited to **typography, color, layout chrome, hero copy posture** — not content choices.
- **D-03:** Sketch placeholder content **must not be Phase 2 final copy** (to avoid coupling design review with copy review). Use deliberately-bracketed placeholder text like `[Headline goes here — falsifiable claim]` and `[Sub-line — 1 sentence]`.
- **D-04:** **Review mechanism**: Claude includes inline screenshot prompts in chat after committing the sketches (e.g. "open `.planning/sketches/sketch-a-confident-direct.html` and `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` in your browser; tell me which direction"). Sketches are NOT deployed to the live Vercel project — keeps the production site clean and avoids accidental indexing. User picks one direction; the choice is logged as a Key Decision in PROJECT.md and the rejected sketch is left in place as a record (not deleted).
- **D-05:** **Sketch tool**: handwritten HTML+Tailwind, NOT the `/gsd-sketch` skill flow. Reason: those two voice/visual treatments are highly specific and Claude has tighter control over the comparison if it writes them directly; we get one consistent comparator instead of stylistic drift between two `/gsd-sketch` invocations.

### Visual references / inspiration (anchors for the editorial direction)
- **D-06:** **Primary references** (sites whose vibe Claude is anchoring on, in priority order): Anthropic homepage (typography hierarchy, generous whitespace, single accent color) → Posthog homepage and blog (friendly-technical, illustrative, opinionated copy posture) → Stratechery (serif body, narrow content column where appropriate, calm chrome).
- **D-07:** **Anti-references** (explicit "don't look like this"): Vercel.com (too dense / Vercel-clone), Linear.app (too SaaS-motion / dark-mode-default), n8n.io (too feature-flag-heavy / busy), buggerd's own landing (this site must read as the company, not a derivative product), magazine sites like The Verge (too news-busy).
- **D-08:** **Typography candidates for sketch comparison**: sketch A uses a confident grotesque sans (Inter Tight 700 display, Inter 400 body) for declarative-claim feel; sketch B uses a serif display + grotesque body (Crimson Pro 600 display, Inter 400 body) for essay-like feel. Both faces are available via Astro Fonts API (Bunny Fonts / Google Fonts). Final pick gates the production typography in TECH-05.
- **D-09:** **Palette candidates for sketch comparison**: sketch A uses a near-monochrome palette with a single warm accent (e.g. amber-500 or coral) on a near-white background (`#FAFAF8` or similar) — explicitly NOT emerald (buggerd's color). Sketch B uses a near-monochrome with a cool accent (e.g. indigo-500 or a desaturated teal — but NOT teal-emerald-adjacent). Both palettes have ≤4 colors total: background, body text, muted text, accent.

### Dark mode
- **D-10:** **System-preference auto, no toggle UI** in v1. The page respects `prefers-color-scheme: dark` via the `<html data-theme="dark">` attribute and Tailwind's `media` darkMode strategy (NOT `class`). No toggle button ships in v1. Reason: editorial aesthetic reads best in light mode for content density; respecting OS dark mode is good citizenship at zero UI cost; Mermaid (Phase 4) wires off the same `data-theme` attribute, so theming "comes for free." If demand for an explicit toggle emerges post-launch, add then.
- **D-11:** **Dark theme palette is NOT designed in Phase 1.** Sketches are light-only. The dark theme is auto-derived (background → near-black, body text → light, accent unchanged) and validated visually only in Phase 4 polish. If the auto-derivation looks bad, dark mode is dropped from v1 (light-only fallback). This trade-off is intentional: editorial light-mode is the priority.

### Repo & Vercel naming + access
- **D-12:** **Repo name**: `jigspec-landing` under the existing `JigSpec` GitHub org. Parallel to `JigSpec/buggerd`. Rejected alternatives: `site` (too generic), `marketing` (misleading once docs eventually absorb here), `www` (DNS-shaped, confusing for repo name).
- **D-13:** **Vercel project name**: `jigspec-landing` (matches repo). Default preview URL `jigspec-landing.vercel.app` is fine for the soak phase (Phase 4); the apex `jigspec.com` swap is Phase 5.
- **D-14:** **Repo + Vercel creation is user-owned, not Claude-owned.** Claude initializes the local Astro project + commits, but the user (or a `gh repo create JigSpec/jigspec-landing --public` invocation the user runs) creates the GitHub remote, and the user clicks "import project" in Vercel to wire auto-deploy. This is the same pattern as buggerd. **Plan should produce explicit setup-step instructions** for the user, not attempt to create the remote/Vercel project from inside the executor.
- **D-15:** **Branch protection**: Mirror buggerd — `main` protected from force-push only (no required PR reviews — solo project, would create friction). Vercel still creates preview deploys on PRs automatically.
- **D-16:** **Repo visibility**: Public (matches buggerd, matches the OSS-friendly stance of the JigSpec runtime).

### Scaffolding specifics
- **D-17:** **Astro init command**: `npm create astro@latest -- --template minimal --typescript strict --install --git --no` (the `--no` after git suppresses any "would you like to..." prompts; alternatively use the interactive flow if the executor prefers). TypeScript `strict` is non-negotiable (locked by TECH-01 and STACK.md).
- **D-18:** **Initial dependency install (Phase 1 only — Phase 3/4 add more later)**: `tailwindcss @tailwindcss/vite` for styling. **NOT installed in Phase 1**: `posthog-js` (Phase 3), `astro-mermaid mermaid` (Phase 4), `@astrojs/mdx` (Phase 2 — content collections will need it), `@astrojs/sitemap` (Phase 4 polish). Rationale: minimize Phase 1 surface area so the visual shell ships fast; later phases install what they need when they need it.
- **D-19:** **Astro config (`astro.config.mjs`) for Phase 1**: `site: 'https://jigspec.com'` (the eventual apex, even though we deploy to vercel.app), `output: 'static'`, `vite.plugins: [tailwindcss()]`, no integrations array yet (mermaid+mdx+sitemap arrive in their respective phases). Astro Fonts API config for the chosen display + body faces (locked after sketch pick).
- **D-20:** **`vercel.json`**: Direct copy of buggerd's `/Users/kjs/Documents/Business/Buggerd/vercel.json` as starting point, then amended:
  - CSP `script-src` adds `https://us-assets.i.posthog.com`
  - CSP `connect-src` adds both PostHog hosts (`https://us-assets.i.posthog.com` and `https://us.i.posthog.com`)
  - Add `cleanUrls: true` and `trailingSlash: false`
  - Add `.planning/(.*)` → `/404` redirect (matches buggerd defense-in-depth)
- **D-21:** **`.vercelignore`**: exclude `.planning/`, `.git/`, `node_modules/`, and `.claude/` from deploy artifact.
- **D-22:** **Repo-root files in Phase 1**: `README.md` (replaces existing one — brief project description + "see .planning/PROJECT.md for context" pointer), `LICENSE` (keep existing — already MIT-ish per repo), `.gitignore` (Node + Astro defaults).

### Layout shell specifics
- **D-23:** **Component layout (Phase 1 ships these three only)**:
  - `src/layouts/Base.astro` — HTML document, `<head>` with meta tags, font loading, theme attribute, Tailwind reset; renders `<slot />`
  - `src/components/global/Nav.astro` — sticky-or-not header with JigSpec wordmark/logo (text-only logo in v1, no SVG), 2-3 placeholder nav links (e.g. "Products", "Docs", "About") that anchor-link to non-existent sections; mobile hamburger collapses to a vertical menu at <768px
  - `src/components/global/Footer.astro` — footer with placeholder docs link, contact email placeholder, copyright, GitHub org link
- **D-24:** **`pages/index.astro` in Phase 1**: contains a single `<h1>` placeholder ("JigSpec — coming soon" or similar) inside `<Base>` with `<Nav>` and `<Footer>`. NO hero, NO cards, NO sections. The page exists only to verify the shell renders end-to-end on the preview URL. Phase 2 fills index.astro with real composition.
- **D-25:** **Mobile breakpoints**: stick to Tailwind defaults (sm/md/lg/xl/2xl at 640/768/1024/1280/1536). Manual verification at 320 / 375 / 414 widths through Chrome DevTools device emulation, no test framework wired in Phase 1.

### Claude's Discretion
The user said "you make these decisions" for all four discussed gray areas. The following are also at Claude's discretion within the locked constraints:
- Exact CSS variable names and Tailwind config values
- File naming conventions inside `src/` (sticking to Astro conventions)
- Exact wording of the placeholder copy in sketches and `index.astro`
- Sketch HTML structure (single section, multiple sections, etc.) as long as both sketches present comparable surface area
- The 3rd nav link choice (Docs / About / Pricing-placeholder / etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level (locked decisions feeding Phase 1)
- `.planning/PROJECT.md` — full project context; Constraints + Key Decisions tables are load-bearing for Phase 1 (especially the visual-identity, designer-of-record, and tech-stack rows)
- `.planning/REQUIREMENTS.md` §v1 Requirements / Tech, Visual, Deploy — the 9 requirements assigned to Phase 1 (TECH-01, TECH-05, VISUAL-01..04, DEPLOY-01..03)
- `.planning/ROADMAP.md` §Phase 1 — goal + success criteria + dependencies

### Research (read before planning)
- `.planning/research/STACK.md` — Astro 6 + Tailwind 4 install path, `@tailwindcss/vite` over deprecated `@astrojs/tailwind`, Astro Fonts API for self-hosted typography, vercel.json template with PostHog CSP additions
- `.planning/research/ARCHITECTURE.md` §Folder layout, §Pattern 1 (typed content collection), §Pattern 4 (typed analytics wrapper) — relevant for forward-compat even though only Base/Nav/Footer ship in Phase 1
- `.planning/research/PITFALLS.md` §Pitfall 7 (editorial-aesthetic execution risk) — directly governs sketch comparison quality bar
- `.planning/research/SUMMARY.md` §Stack Snapshot (Phase 1 Reference) — executable install commands

### External patterns (read for style anchoring)
- `/Users/kjs/Documents/Business/Buggerd/index.html` — sibling landing's static-HTML pattern (we are intentionally distinct in aesthetic but mirror its security/CSP structure)
- `/Users/kjs/Documents/Business/Buggerd/vercel.json` — direct base for our `vercel.json` (D-20)
- `/Users/kjs/Documents/Business/Buggerd/.vercelignore` — direct base for our `.vercelignore` (D-21)

### External docs (read on demand for syntax/version verification)
- [Astro 6 release notes](https://astro.build/blog/astro-6/) — verify any 6.x-specific config syntax during scaffold
- [Tailwind 4 install for Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — verify `@tailwindcss/vite` invocation
- [Astro Fonts API](https://docs.astro.build/en/guides/fonts/) — verify font config syntax for Inter Tight + Inter (sketch A) or Crimson Pro + Inter (sketch B)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`/Users/kjs/Documents/Business/Buggerd/vercel.json`** — direct base for our `vercel.json`. Mirror security headers (HSTS, X-Frame-Options DENY, full CSP, Permissions-Policy), `cleanUrls: true`, `trailingSlash: false`, `.planning/` 404 redirect. Then amend CSP with PostHog hosts.
- **`/Users/kjs/Documents/Business/Buggerd/.vercelignore`** — direct base; exclude `.planning/`, `.git/`, `node_modules/`, `archive/`-equivalents.
- **`/Users/kjs/Documents/Business/Buggerd/index.html`** — reference for the *style-distinct* version (different typeface, different accent — NOT emerald-600). Inspect the `<head>` security/meta pattern.

### Established Patterns
- **JigSpec org GitHub workflow**: each repo is its own Vercel project, auto-deploy from `main`, Cloudflare DNS handles apex CNAME flattening. Phase 1 reuses this pattern.
- **No-build static deploys are normal in this org** (buggerd is one HTML file). We're departing here only because Phase 2+ need content collections + dynamic routes.
- **Honesty constraint in copy** (carries from buggerd, Delegate, PROJECT.md): no testimonials, no fabricated metrics, no "trusted by" patterns. Even Phase 1 placeholder copy in `index.astro` and the sketches respects this.

### Integration Points
- **Vercel ↔ Cloudflare DNS**: same setup as `buggerd.com`. Apex CNAME flattening, gray-cloud (DNS-only). Phase 1 doesn't touch DNS — Phase 5 does.
- **PostHog CSP allowlist in `vercel.json`**: shipped in Phase 1 even though PostHog SDK is added in Phase 3. Avoids a CSP-only deploy in Phase 3.
- **Astro Fonts API**: replaces a Google Fonts CDN. Removes one origin from CSP. Locked by D-19.

</code_context>

<specifics>
## Specific Ideas

- **Sketch A — Confident & Direct vibe anchor**: imagine the front page of a well-designed engineering company that has shipped something opinionated. Headline like "We build agentic AI that ships." (placeholder), one card showing a real product, no breathless setup. Inter Tight 700 for the headline.
- **Sketch B — Engineering-Blog Pragmatic vibe anchor**: imagine the lede paragraph of a Stratechery or Casey-Newton-on-Platformer post. Headline like "Most agentic AI doesn't ship. Here's what we do differently." (placeholder), serif display, more setup, more like an essay. Crimson Pro 600 for the headline.
- **Both sketches show the same single product card** — pick `buggerd` because it's the only real product. Card shows wordmark, one-line description, "Shipping" badge, a CTA arrow. Visually equal between the two sketches except for the typography/palette/chrome treatment around it.
- **Diagram-1 placeholder in sketches**: a hand-drawn-style ASCII-or-SVG box with text "Diagram 1 (Mermaid) — pipeline runtime view, ships in Phase 4" so the user can see the visual scale without us pre-designing the diagram.
- **Co-existence with the existing repo `README.md`**: replace it (current content is just `# JigSpec-LandingPage / Company description` which was a placeholder anyway). Keep `LICENSE` untouched.

</specifics>

<deferred>
## Deferred Ideas

- **Explicit dark-mode toggle UI** — deferred to v2 if user demand emerges post-launch. v1 is system-preference auto only (D-10).
- **Logo / wordmark SVG** — Phase 1 ships text-only wordmark (D-23). Custom logo design is out of scope; if a logo is desired pre-launch, capture as a Phase 4 polish item.
- **Mobile hamburger menu animation polish** — Phase 1 ships a functional mobile menu (D-23). Animations / transitions are Phase 4.
- **Sketch C+** — only two sketches in Phase 1 per VISUAL-01. If the user rejects both, iterate on one rather than expanding to three+.
- **Brand color exploration beyond "warm" (sketch A) vs "cool" (sketch B)** — these two cover the editorial-aesthetic decision space well enough; deeper palette work happens after the direction is locked, in Phase 4 polish.
- **Storybook / component dev environment** — Delegate uses it; this project doesn't need it for v1 scope. Defer to v2 if blog/component growth justifies it.
- **Test framework wiring (Vitest, Playwright)** — Delegate has them installed-but-unused. Same answer here: visual + manual QA is the verification surface for v1; test framework can wait.

</deferred>

---

*Phase: 1-Scaffold, Sketches & Visual Shell*
*Context gathered: 2026-04-27*
