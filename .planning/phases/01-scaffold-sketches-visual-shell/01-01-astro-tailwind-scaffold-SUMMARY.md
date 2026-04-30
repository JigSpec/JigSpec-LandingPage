---
phase: 01-scaffold-sketches-visual-shell
plan: 01
subsystem: infra
tags: [astro, tailwind, scaffold, typescript, vite]

requires:
  - phase: project-init
    provides: locked tech-stack decisions D-17/D-18/D-19/D-22 in 01-CONTEXT.md
provides:
  - Buildable Astro 6 + Tailwind 4 project at the repo root with `npm run build` exiting 0
  - TypeScript strict mode active via `astro/tsconfigs/strict`
  - Tailwind 4 wired through `@tailwindcss/vite` (not the deprecated `@astrojs/tailwind`)
  - Tailwind 4 CSS-first entry at `src/styles/global.css` (`@import "tailwindcss";`)
  - Project-specific `README.md` and Node/Astro `.gitignore` per D-22
  - Foundation that 01-02 (sketches), 01-03 (visual identity shell), and 01-04 (Vercel deploy) build on
affects: [01-02-visual-sketches, 01-03-visual-identity-shell, 01-04-deploy-repo-vercel, all-future-Phase-2-3-4-plans]

tech-stack:
  added:
    - "astro@^6.1.10"
    - "tailwindcss@^4.2.4"
    - "@tailwindcss/vite@^4.2.4"
    - "@astrojs/check (devDependency, for `astro check`)"
    - "typescript (devDependency, peer of @astrojs/check)"
  patterns:
    - "CSS-first Tailwind 4 config: `@import \"tailwindcss\";` in src/styles/global.css (no tailwind.config.js)"
    - "`@tailwindcss/vite` wired via `vite.plugins: [tailwindcss()]` in astro.config.mjs"
    - "Atomic per-task commits prefixed with `feat(01-01):` or `fix(01-01):`"

key-files:
  created:
    - "package.json (Astro 6 + Tailwind 4 deps)"
    - "package-lock.json"
    - "tsconfig.json (extends astro/tsconfigs/strict)"
    - "astro.config.mjs (site, output: static, integrations: [], vite.plugins: [tailwindcss()])"
    - "src/styles/global.css (`@import \"tailwindcss\";`)"
    - "src/pages/index.astro (Astro minimal template default)"
    - "public/favicon.ico, public/favicon.svg"
    - ".vscode/extensions.json, .vscode/launch.json (Astro VS Code conventions)"
    - ".gitignore (Astro defaults: dist/, .astro/, node_modules/, .env*, .DS_Store, .idea/)"
  modified:
    - "README.md (replaced placeholder + Astro template stub with project description per D-22)"

key-decisions:
  - "Scaffold ran in /tmp/jigspec-astro-scaffold then files were copied into the repo root, because `npm create astro@latest -- . --no` does NOT suppress the 'destination is not empty' prompt — it converts to a free-text 'where should we create your project?' input rather than a yes/no. The plan's documented `yes n |` fallback would not have worked either. Temp-then-copy preserved LICENSE, CLAUDE.md, .planning/, and .git/ untouched."
  - "Added `integrations: []` to astro.config.mjs. Astro 6.1.10's config schema validation marks the field as Required; without it, `astro build` exits 0 silently with no dist/. The plan explicitly noted 'an empty integrations: [] is also fine but unnecessary' — turns out it is necessary in 6.1.10."
  - "Installed @astrojs/check + typescript as devDependencies. The plan requires `npx astro check` to exit 0, and that command needs @astrojs/check. These are diagnostic tooling, not in D-18's named runtime/integration exclusion list."

patterns-established:
  - "Per-task commit message: `{type}(01-01): {imperative summary}` with HEREDOC-formatted body documenting decisions and trade-offs"
  - "Verification chain: read-first files → run action → run automated `<verify>` script → run each `<acceptance_criteria>` line → commit"
  - "Phase 1 dep surface stops at tailwindcss + @tailwindcss/vite for runtime, plus @astrojs/check + typescript for the verification CLI; no posthog-js, astro-mermaid, mermaid, @astrojs/mdx, @astrojs/sitemap (those land in Phase 2/3/4)"

requirements-completed: [TECH-01]

duration: 16 min
completed: 2026-04-29
---

# Phase 01 Plan 01: Astro + Tailwind Scaffold — Summary

**Astro 6 + Tailwind 4 project scaffolded at the repo root with `output: 'static'`, TypeScript strict, and Tailwind 4 wired through `@tailwindcss/vite`. `npm run build` produces a 12 KB `dist/` containing `index.html` (the Astro minimal-template default Hello World).**

## Performance

- **Duration:** ~16 min (incl. one detour for the non-empty-dir scaffold prompt and one for Astro 6's strict config validation)
- **Started:** 2026-04-29T21:08Z (state.begin-phase)
- **Completed:** 2026-04-29T21:24Z (Task 6 verification passed)
- **Tasks:** 6 of 6 completed
- **Files created:** 11 (package.json, package-lock.json, tsconfig.json, astro.config.mjs, .gitignore, src/styles/global.css, src/pages/index.astro, public/favicon.ico, public/favicon.svg, .vscode/extensions.json, .vscode/launch.json)
- **Files modified:** 1 (README.md)

## Accomplishments

- Astro 6.1.10 minimal template scaffolded in place at the repo root without clobbering LICENSE, CLAUDE.md, .planning/, or .git/. Pre-scaffold commit `2c51207` is reachable from current HEAD via `git merge-base --is-ancestor`.
- Tailwind 4.2.4 wired via `@tailwindcss/vite` (NOT `@astrojs/tailwind`), matching the locked CLAUDE.md "What NOT to Use" guidance.
- Single-line `src/styles/global.css` (`@import "tailwindcss";`) — Tailwind 4 CSS-first entry; no `tailwind.config.js`, no `@tailwind base/components/utilities` v3 triple.
- `astro.config.mjs` carries the locked D-19 shape: `site: 'https://jigspec.com'`, `output: 'static'`, `vite.plugins: [tailwindcss()]`, plus the explicit `integrations: []` Astro 6 requires.
- README replaced per D-22; .gitignore covers Node + Astro defaults; LICENSE preserved untouched.
- Full pipeline verified: `npm install` → `npx astro check` (0 errors, 0 warnings) → `npm run build` → `dist/index.html` exists (657 bytes, Astro minimal Hello World).

## Task Commits

1. **Task 1: Scaffold Astro 6** — `9ebe7a9` (feat)
2. **Task 2: Install Tailwind 4 + @tailwindcss/vite** — `4147f45` (feat)
3. **Task 3: Write astro.config.mjs (D-19)** — `a4c3681` (feat)
4. **Task 4: src/styles/global.css** — `bb93846` (feat)
5. **Task 5: Replace README.md per D-22** — `8534d64` (feat)
6. **Task 6: End-to-end verify (config fix + check deps)** — `e12ce07` (fix)

**Plan metadata:** appended on the next `docs(01-01): complete plan` commit.

## Files Created / Modified

- `package.json` — name `jigspec-landing-page`, `astro@^6.1.10`, devDeps `tailwindcss@^4.2.4`, `@tailwindcss/vite@^4.2.4`, `@astrojs/check`, `typescript`.
- `package-lock.json` — full transitive dep tree (lockfileVersion 3).
- `tsconfig.json` — `extends: astro/tsconfigs/strict`, `include: [".astro/types.d.ts", "**/*"]`.
- `astro.config.mjs` — final shape includes `integrations: []` (see Deviations).
- `src/styles/global.css` — `@import "tailwindcss";`.
- `src/pages/index.astro` — Astro minimal-template default (untouched by this plan; will be rewritten in 01-03).
- `public/favicon.ico`, `public/favicon.svg` — Astro defaults.
- `.vscode/extensions.json`, `.vscode/launch.json` — Astro convention; recommend the official Astro VS Code extension.
- `.gitignore` — Astro defaults; covers `dist/`, `.astro/`, `node_modules/`, `.env`, `.env.production`, `.DS_Store`, `.idea/`, log patterns.
- `README.md` — replaced both the original 2-line placeholder AND the Astro template's "Astro Starter Kit: Minimal" stub with the project description from D-22.

## Decisions Made

- **Scaffold strategy:** ran `npm create astro@latest` in `/tmp/jigspec-astro-scaffold` (a clean directory) and copied generated files into the repo root, because the in-place form prompted on the non-empty repo root despite the `--no` flag. The plan's `yes n |` fallback would have responded "n" to a free-text directory-name prompt, not a yes/no — so it wouldn't have worked either. Temp-then-copy is robust to whatever the create-astro CLI does next.
- **Package name:** `jigspec-landing-page` (overrode `jigspec-astro-scaffold` from the temp dir).
- **Skipped `src/env.d.ts`:** the Astro 6 minimal template no longer generates it; `.astro/types.d.ts` (auto-generated, referenced from tsconfig include) replaces it. Creating an empty stub would be cargo-culting.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — bug] `npm create astro@latest -- . --no --git` does not suppress the non-empty-dir prompt**
- **Found during:** Task 1 (scaffold)
- **Issue:** The CLI converted "is this directory empty?" into a free-text "where should we create your new project?" input (offering `./cyan-centauri78` as a default). The plan's documented `yes n |` fallback feeds "n" to that prompt, which would have created a literal `./n/` subdirectory.
- **Fix:** Ran scaffold in `/tmp/jigspec-astro-scaffold` and copied the generated `package.json`, `package-lock.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`, `README.md`, `src/`, `public/`, `.vscode/`, and `node_modules/` into the repo root. Did NOT copy the scaffold's `.git/` (the repo's existing one is preserved).
- **Files modified:** all of the above.
- **Verification:** `git log -1 --oneline` shows pre-scaffold HEAD reachable; LICENSE/CLAUDE.md/.planning/ all present.
- **Committed in:** `9ebe7a9`.

**2. [Rule 1 — bug] Astro 6.1.10 schema marks `integrations` as Required (not optional)**
- **Found during:** Task 6 (build verification)
- **Issue:** `astro build` exited 0 with `[config] Astro found issue(s) with your configuration: ! integrations: Required` and produced no `dist/`. The plan's expected shape was "no integrations array".
- **Fix:** Added `integrations: []` to `astro.config.mjs`. The plan's own action notes already permitted "an empty integrations: [] is also fine".
- **Files modified:** `astro.config.mjs`.
- **Verification:** `npm run build` now produces `dist/index.html`; `npx astro check` reports 0 errors, 0 warnings, 0 hints.
- **Committed in:** `e12ce07`.

**3. [Rule 1 — missing critical dep] `astro check` requires `@astrojs/check` + `typescript`**
- **Found during:** Task 6 (running `npx astro check`)
- **Issue:** First invocation of `npx astro check` displayed an interactive "Astro will run the following command: npm i @astrojs/check typescript" prompt and exited 0 silently without checking anything. Task 6's acceptance criteria require a real type-check pass.
- **Fix:** Installed `@astrojs/check` + `typescript` as devDependencies. These are CLI tooling for the verification command itself, not application runtime deps; they're not on D-18's named exclusion list (posthog-js, astro-mermaid, mermaid, @astrojs/mdx, @astrojs/sitemap).
- **Files modified:** `package.json`, `package-lock.json`.
- **Verification:** `npx astro check` reports `Result (3 files): - 0 errors - 0 warnings - 0 hints`.
- **Committed in:** `e12ce07`.

**4. [Rule 1 — stale assumption] `src/env.d.ts` is no longer generated by the Astro 6 minimal template**
- **Found during:** Task 1 (post-scaffold inspection)
- **Issue:** Task 1's acceptance criteria include "File `src/env.d.ts` exists (Astro minimal template default)." Astro 6 dropped this file in favor of `.astro/types.d.ts`, which is auto-generated and already referenced from `tsconfig.json` `include`.
- **Fix:** None — did NOT create an empty stub. The criterion was based on a stale Astro version's behavior; the build still passes type-check, so the original intent (TypeScript strict diagnostics work) is satisfied.
- **Files modified:** none.
- **Verification:** `npx astro check` exits 0; `tsconfig.json` references `.astro/types.d.ts` per Astro 6 conventions.
- **Committed in:** documented here, not in code.

---

**Total deviations:** 4 (3 Rule-1 auto-fixes committed in 9ebe7a9 + e12ce07; 1 documented-only).
**Impact on plan:** all four deviations were tooling/version drift between what the plan was written against and what `npm create astro@latest` produces today. None changed plan scope or D-17/18/19/22 intent. All success criteria satisfied.

## Issues Encountered

None beyond the deviations above. No verification ever stayed failing across two attempts.

## User Setup Required

None. Plan 01-01 has no `user_setup:` block — Vercel deploy auth lands in Plan 01-04.

## Next Phase Readiness

**Ready for Plan 01-02 (visual sketches).** Plan 01-02 is a `.planning/sketches/` HTML-only deliverable that doesn't depend on the Astro project, but having the scaffold in place lets 01-03 immediately start applying the chosen sketch direction once 01-02's user-choice checkpoint clears.

Notes for downstream plans:
- The scaffold's `src/pages/index.astro` is the Astro Hello-World default — Plan 01-03 will rewrite it to compose `Base.astro` + `Nav.astro` + `Footer.astro`.
- `src/styles/global.css` is intentionally one line. Plan 01-03 owns adding `@theme` tokens and the type scale; do NOT add reset/typography rules in 01-02 (which lives entirely under `.planning/sketches/`).
- `astro.config.mjs` `integrations: []` is empty by design — Phase 2 adds `@astrojs/mdx` (content collections), Phase 3 has no Astro integrations (PostHog is client-side), Phase 4 adds `astro-mermaid` and `@astrojs/sitemap`.
- The project pulls Astro from npm at `^6.1.10`; Tailwind at `^4.2.4`. CLAUDE.md's "Tech Stack" table called out `^6.1` and `^4.2` lines, so we landed on the current minor of each.
