---
phase: 01-scaffold-sketches-visual-shell
type: outline
plan_count: 4
wave_count: 3
---

# Phase 1 Plan Outline — Scaffold, Sketches & Visual Shell

## Plan Table

| Plan ID | Objective | Wave | Depends On | Requirements |
|---------|-----------|------|------------|--------------|
| 01-01-astro-tailwind-scaffold | Initialize Astro 6 (TypeScript strict) project at repo root, install Tailwind 4 via `@tailwindcss/vite`, write base `astro.config.mjs` with `output: 'static'` + `site: 'https://jigspec.com'`, replace `README.md`, write `.gitignore`. Produces a buildable but content-less project; no fonts or layout components yet (those wait on the sketch decision). | 1 | — | TECH-01 |
| 01-02-visual-sketches | Hand-write two self-contained static HTML sketches at `.planning/sketches/sketch-a-confident-direct.html` and `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` per D-01..D-09. Sketch A: Inter Tight 700 / Inter 400, warm accent on near-white. Sketch B: Crimson Pro 600 / Inter 400, cool accent on near-white. Each renders identical placeholder Hero + buggerd card + diagram-1 placeholder + nav + footer at desktop, with mobile-width section below. Tailwind via CDN, throwaway, NOT deployed. Ends with a `checkpoint:human-verify` task that prompts the user to open both files and pick a direction. | 1 | — | VISUAL-01 |
| 01-03-visual-identity-shell | Apply chosen sketch direction to production. Opens with `checkpoint:decision` task that records the picked direction (typeface family, accent color, chrome posture) as a Key Decision row in PROJECT.md. Then: configure Astro Fonts API for the chosen display + body faces (zero external font CDN), set Tailwind 4 theme tokens (palette ≤4 colors, 3-element typographic scale display/body/micro, `darkMode: 'media'`), write `src/layouts/Base.astro`, `src/components/global/Nav.astro` (text wordmark, 3 placeholder anchor links, mobile hamburger <768px), `src/components/global/Footer.astro` (docs link placeholder, contact email, GitHub org link, copyright), and a minimal `src/pages/index.astro` containing only an `<h1>` placeholder inside `<Base>` with `<Nav>` and `<Footer>`. Verifies legibility at 320/375/414/desktop via dev server (no deploy yet). | 2 | 01-01, 01-02 | TECH-05, VISUAL-02, VISUAL-03, VISUAL-04 |
| 01-04-deploy-repo-vercel | Write `vercel.json` (copied from buggerd's, amended per D-20 with PostHog hosts in CSP `script-src` + `connect-src`, `cleanUrls: true`, `trailingSlash: false`, `.planning/(.*)` → `/404` redirect) and `.vercelignore` (excludes `.planning/`, `.git/`, `node_modules/`, `.claude/` per D-21). Commits these BEFORE any deploy artifact is built. Then a `checkpoint:human-action` task instructs the user to (a) `gh repo create JigSpec/jigspec-landing --public --source . --push`, (b) protect `main` from force-push, (c) import the project on Vercel and confirm auto-deploy from `main` per D-12..D-16. Final `checkpoint:human-verify` task confirms the preview URL serves the empty shell over HTTPS, security headers are live (curl `-I` check), and the shell renders at 320/375/414/desktop on the live URL. | 3 | 01-03 | DEPLOY-01, DEPLOY-02, DEPLOY-03 |

## Wave Rationale

**Why 3 waves and not fewer:** Two hard ordering constraints force at least three waves.

1. **Sketch-decision gate (D-04, D-08):** The user must open both sketch HTML files and pick a direction before the production typography (Astro Fonts API faces) and palette can be locked into the Tailwind theme. Plan 01-03 cannot start without that decision — putting it earlier would either pre-commit a typeface (defeating Pitfall 7's mitigation) or force a re-do of the Tailwind theme + font config after the sketch decision. The decision is captured at the front of Plan 01-03 as a `checkpoint:decision` task, NOT a separate plan, because the decision and its application share files (`tailwind.config`, `astro.config.mjs` font block) and consist of one atomic "lock visual identity" beat.

2. **Visual shell → deploy gate:** The deploy plan verifies the shell renders correctly on the live preview URL — verification requires Plan 01-03's `Base.astro` + `Nav.astro` + `Footer.astro` + `index.astro` to exist. `vercel.json` and `.vercelignore` themselves don't require the shell, but the success criterion of Phase 1 ("preview URL serves the empty shell") does. Splitting deploy config into its own wave keeps the user-owned manual setup (gh repo + Vercel import per D-14) cleanly bounded as Wave 3 work and avoids mixing it with Wave 2's design application.

**Why 01-01 and 01-02 run in parallel (Wave 1):**
- File ownership is fully disjoint: 01-01 writes only to repo root + `src/` (scaffold output) + `astro.config.mjs` + `package.json`. 01-02 writes only to `.planning/sketches/`. Zero `files_modified` overlap.
- Neither plan depends on the other's output: scaffold doesn't need sketches; sketches are standalone HTML+CDN-Tailwind that doesn't import from the Astro project.
- Running them in parallel halves Wave 1 wall-clock and exploits the sketch-review bottleneck (user can review sketches *while* scaffold settles — both must be done before Wave 2 starts).

**Why 01-03 stays a single plan and doesn't split sketch-decision-checkpoint into its own plan:**
- A standalone "record the user's pick" plan would be one task and consume <5% context. That violates "too small — combine with a related task" sizing guidance. The decision and its first downstream consumer (Tailwind theme tokens + Astro Fonts API config) belong together because they share the same files and the decision is meaningless without immediate application.
- The checkpoint sits at the front of 01-03 with `gate="blocking"`, so the executor cannot proceed past it without user input — same enforcement strength as a standalone plan, less plan-overhead.

**Why 01-04 stays a single plan with 3 tasks:**
- vercel.json + .vercelignore (auto), user-owned repo+Vercel setup (`checkpoint:human-action` — D-14 explicitly forbids Claude creating these), live-URL verification (`checkpoint:human-verify`). Three tasks, one concern (deploy), ~30% context. Right size.
- Critical ordering inside the plan: `.vercelignore` MUST be committed *before* the user pushes the first commit (otherwise `.planning/` ships in the deploy artifact). This is enforced by task order within the plan and called out in the action text.

**Requirement coverage (all 9 IDs covered, each in exactly one plan):**
- TECH-01 → 01-01 (Astro 6 + TS strict + Tailwind 4 via `@tailwindcss/vite`)
- VISUAL-01 → 01-02 (two sketches, hero + card + diagram-1 area)
- TECH-05 → 01-03 (Astro Fonts API self-hosting; no font CDN)
- VISUAL-02 → 01-03 (3-element typographic scale; ≤4 colors)
- VISUAL-03 → 01-03 (typeface + accent + chrome distinct from buggerd)
- VISUAL-04 → 01-03 (mobile-responsive 320/375/414, nav collapses)
- DEPLOY-01 → 01-04 (GitHub repo `JigSpec/jigspec-landing`, force-push protection)
- DEPLOY-02 → 01-04 (Vercel auto-deploy from `main`)
- DEPLOY-03 → 01-04 (`vercel.json` mirrors buggerd + PostHog CSP; `.vercelignore`)

**Note on sketch deployment:** Sketches in `.planning/sketches/` are excluded from the Vercel deploy artifact by `.vercelignore` (D-21) — they will exist in the git repo (public) but will not be served by the production site. This satisfies D-04's "sketches are NOT deployed" constraint without requiring a separate ignore rule.

## OUTLINE COMPLETE

4 plans across 3 waves.
