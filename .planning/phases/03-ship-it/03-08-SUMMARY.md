---
phase: 03-ship-it
plan: 08
subsystem: seo
tags: [astro, sitemap, og-image, 404, favicon, robots-txt, seo, polish]

# Dependency graph
requires:
  - phase: 03-ship-it/03-04
    provides: "@astrojs/sitemap dev dependency installed"
  - phase: 03-ship-it/03-01
    provides: "Base.astro layout with Astro Fonts API and dark-mode script"
provides:
  - "Sitemap auto-emits on every build via @astrojs/sitemap integration"
  - "OG meta block + canonical + sitemap + favicon links in Base.astro <head>"
  - "Custom branded 404 page at src/pages/404.astro -> dist/404.html"
  - "og.png 1200x630 editorial wordmark composition (50KB)"
  - "apple-touch-icon.png 180x180 brand mark on cream background"
  - "robots.txt with User-agent: * + Sitemap directive"
  - "DIAGRAM-05: documented mmdc build-time SVG fallback recipe"
affects: [04-diagrams-polish-preview-soak, seo, social-share]

# Tech tracking
tech-stack:
  added: ["@astrojs/sitemap (integrated into Astro build)"]
  patterns:
    - "Absolute og:image URL hardcoded to https://jigspec.com/og.png (never relative)"
    - "canonicalURL computed from Astro.site + Astro.url.pathname (production-first)"
    - "404 page mirrors [slug].astro Base+Nav+main+Footer scaffold"
    - "Phase 3 delegated click capture via data-event + data-link-location attributes"

key-files:
  created:
    - src/pages/404.astro
    - public/og.png
    - public/apple-touch-icon.png
    - public/robots.txt
    - docs/diagram-fallback-recipe.md
  modified:
    - astro.config.mjs
    - src/layouts/Base.astro

key-decisions:
  - "og:image hardcoded as absolute URL https://jigspec.com/og.png — relative paths break Slack/Twitter unfurlers"
  - "canonicalURL computed from Astro.site so preview deploys still point canonical to production (intentional — don't index preview URLs)"
  - "og.png authored via sharp SVG rasterization at 1200x630; editorial wordmark composition with accent stripe, JigSpec mark, tagline, supporting line"
  - "DIAGRAM-05 satisfied by documented recipe — fallback NOT implemented unless soak Lighthouse < 95"
  - "robots.txt has no Disallow: directives — entire site is public marketing content"

patterns-established:
  - "Absolute og:image URL: always https://jigspec.com/og.png, never relative"
  - "404 page scaffold: Base + Nav + main.flex-1 + article.text-center + Footer"
  - "Delegated click capture: data-event=nav:link_click + data-link-location on all back-links"

requirements-completed: [DIAGRAM-05]

# Metrics
duration: 4min
completed: 2026-05-04
---

# Phase 03 Plan 08: SEO + Polish Polish Summary

**Sitemap auto-emit, full OG meta block in Base.astro, custom 404 page, og.png 1200x630 + apple-touch-icon.png 180x180 + robots.txt — all soak gate artifacts in place**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-04T19:26:08Z
- **Completed:** 2026-05-04T19:29:51Z
- **Tasks:** 5
- **Files modified/created:** 7

## Accomplishments

- Wired `@astrojs/sitemap` integration — `npm run build` now emits `dist/sitemap-index.xml` + `dist/sitemap-0.xml` with homepage and all product detail pages
- Extended `Base.astro` head with 12 new link/meta elements: canonical, sitemap discovery, favicon set (SVG/ICO/apple-touch-icon), full OG block (title, description, image, width, height, url, type), Twitter card — every page inherits automatically
- Authored custom branded 404 page using Base+Nav+Footer scaffold, eyebrow `404`, headline `Not found`, italic body, back-link with Phase 3 delegated capture attributes
- Created `og.png` (1200x630, 50KB) via sharp SVG rasterization — editorial wordmark with cream background, accent stripe, JigSpec mark + "JigSpec" wordmark + "Agentic AI that ships." tagline + supporting line
- Created `apple-touch-icon.png` (180x180, 3.5KB) — JigSpec mark on cream background with 12px inset padding for iOS corner-rounding mask
- DIAGRAM-05 satisfied: `docs/diagram-fallback-recipe.md` documents the mmdc recipe verbatim (136 lines) — not implemented, invoke only if soak Lighthouse fails

## Task Commits

1. **Task 1: Wire @astrojs/sitemap** - `e31984a` (chore)
2. **Task 2: Extend Base.astro head** - `eecbdbe` (feat)
3. **Task 3: Author 404.astro** - `86df140` (feat)
4. **Task 4: og.png + apple-touch-icon.png + robots.txt** - `49227bf` (feat)
5. **Task 5: DIAGRAM-05 mmdc fallback recipe** - `6415a0e` (docs)

## Files Created/Modified

- `astro.config.mjs` — Added `import sitemap from '@astrojs/sitemap'` + `integrations: [sitemap()]`
- `src/layouts/Base.astro` — Added `canonicalURL` computation + 12-element link/meta block after `<title>` (dark-mode script, Font calls, slot all preserved)
- `src/pages/404.astro` — New file: custom branded 404 page, Base+Nav+Footer, data-link-location="404-back-home"
- `public/og.png` — New file: 1200x630 PNG, 50040 bytes. Editorial cream background (#FAF9F7), accent stripe (#1A6EFF), JigSpec mark at ~384px, right-column text: "JigSpec" wordmark in Georgia 96px bold, "Agentic AI that ships." tagline in Arial 34px, supporting line in Arial 22px, domain in accent color
- `public/apple-touch-icon.png` — New file: 180x180 PNG, 3513 bytes. JigSpec mark scaled to 156px with 12px inset on cream background
- `public/robots.txt` — New file: `User-agent: *` + `Allow: /` + `Sitemap: https://jigspec.com/sitemap-index.xml`
- `docs/diagram-fallback-recipe.md` — New file: 136 lines, mmdc recipe from RESEARCH Pattern 3, when-to-invoke criteria, verification checklist, rationale

## OG Image Visual Choices

- **Background:** `#FAF9F7` (cream/editorial off-white matching the page's `bg-bg` token in light mode)
- **Accent color:** `#1A6EFF` (site accent blue — used for top and bottom 6px stripes + domain URL)
- **Divider:** Vertical rule at x=510 separating logo mark from text block
- **Left column:** JigSpec SVG mark scaled 3x (~384px height), positioned at x=112, y=123
- **Right column text:**
  - "JigSpec" in Georgia/serif 96px bold, letter-spacing -2 — editorial wordmark
  - "Agentic AI that ships." in Arial 34px — company tagline
  - "The studio behind buggerd, .pipe.yaml, and what comes next." in Arial 22px — studio framing
  - "jigspec.com" in Arial 18px letter-spacing 1 in accent color
- **Voice compliance:** No fake metrics, no "Trusted by Fortune 500", no stock photography — typography-driven editorial composition

## Decisions Made

- Absolute `og:image` URL hardcoded to `https://jigspec.com/og.png` — relative paths fail in Slack/Twitter unfurlers (per RESEARCH lines 658-671). Preview deploy cosmetic failure accepted per A7 in RESEARCH Assumptions Log.
- `canonicalURL` computed from `Astro.site + Astro.url.pathname` so all pages (including preview deploys) point canonical to production — intentional, prevents Google from indexing preview URLs.
- PNG assets generated via `sharp` SVG rasterization (no external tool required, `sharp` was already available in the environment). SVG sources discarded; only the resulting PNGs shipped.
- DIAGRAM-05 satisfied by documentation alone — implementing proactively would add ~280MB Puppeteer devDep and CPU tax on every CI run for a fallback that may never be needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The plan's verification criterion `grep -c 'og:image' dist/index.html` (expecting ≥ 4) returns 1 because Astro minifies the static HTML to a single line, so grep counts lines-with-match rather than occurrences. The actual OG tags are all present in the built HTML (verified by manual inspection showing `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` all in the output). This is an artifact of Astro's minification, not a content gap.

## Soak Gate Readiness (PITFALLS checklist)

The following items are **READY TO VERIFY** (artifacts exist) but **NOT YET VERIFIED** (soak does that in Plan 04-04):

- PITFALLS item #6: Custom 404 page (`dist/404.html`) exists and links back to `/` — verify `[preview-url]/nonexistent` returns HTTP 404 + branded JigSpec UI during soak
- PITFALLS item #7: `public/og.png` exists at 1200x630 — verify renders correctly in opengraph.xyz debugger during soak
- PITFALLS item #8: Favicon links wired (SVG + ICO + apple-touch-icon) — verify favicon displays in browser tab on all 5 browsers during soak

## DIAGRAM-05 Status

**Satisfied by documentation.** `docs/diagram-fallback-recipe.md` contains the complete runnable recipe:
- Install command for `@mermaid-js/mermaid-cli@^11`
- `.mmd` source file layout
- 4 `mmdc` invocations (light + dark for both diagrams)
- `package.json` scripts wiring
- `MermaidDiagram.astro` static-img rewrite template
- Verification checklist
- Rationale for `mmdc` over `@rendermaid/core`

The recipe has NOT been executed and should NOT be executed unless Plan 04-04 soak shows Lighthouse mobile-perf < 95 with the Mermaid chunk as a top-3 TBT/LCP contributor.

## Known Stubs

None.

## Threat Flags

None — all artifacts are same-origin static files (`og.png`, `apple-touch-icon.png`, `robots.txt`, `sitemap-index.xml` served from `/public/`). No new external CSP hosts introduced. `vercel.json` unchanged. OG image hardcoded to production origin (T-04-03-01 mitigated). 404 page is static with no path echo or stack trace (T-04-03-03 mitigated).

## Self-Check: PASSED

- `src/pages/404.astro` exists: FOUND
- `public/og.png` exists: FOUND (1200x630, 50040 bytes)
- `public/apple-touch-icon.png` exists: FOUND (180x180, 3513 bytes)
- `public/robots.txt` exists: FOUND
- `docs/diagram-fallback-recipe.md` exists: FOUND (136 lines)
- `astro.config.mjs` contains `integrations: [sitemap()]`: FOUND
- `src/layouts/Base.astro` contains `og:image`: FOUND
- Commit `e31984a` (Task 1): FOUND
- Commit `eecbdbe` (Task 2): FOUND
- Commit `86df140` (Task 3): FOUND
- Commit `49227bf` (Task 4): FOUND
- Commit `6415a0e` (Task 5): FOUND

## Next Phase Readiness

All artifacts are in place for Plan 04-04 soak verification:
- Sitemap emits on build
- OG meta + favicon links in every page's `<head>`
- Custom 404 page built to `dist/404.html`
- `og.png` + `apple-touch-icon.png` in `dist/`
- `robots.txt` pointing to sitemap
- DIAGRAM-05 escape hatch documented

No blockers for soak.

---
*Phase: 03-ship-it*
*Completed: 2026-05-04*
