---
id: 01-01-astro-tailwind-scaffold
phase: 01
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - tsconfig.json
  - astro.config.mjs
  - src/styles/global.css
  - .gitignore
  - README.md
  - src/env.d.ts
  - src/pages/index.astro
autonomous: true
requirements: [TECH-01]
tags: [astro, tailwind, scaffold, typescript]

must_haves:
  truths:
    - "`npm run build` succeeds end-to-end and produces a `dist/` directory"
    - "Tailwind 4 imports resolve at build time (`@import \"tailwindcss\"` in global CSS works)"
    - "TypeScript strict mode is active (tsconfig.json extends astro/tsconfigs/strict, per D-17)"
    - "Astro init was invoked with the locked flags per D-17 (--template minimal --typescript strict --install --git --no), preserving pre-scaffold .git, LICENSE, CLAUDE.md, and .planning/"
    - "@astrojs/tailwind is NOT installed (forbidden by Tailwind 4 + STACK.md)"
    - "Phase 1 dependency surface is exactly tailwindcss + @tailwindcss/vite per D-18 — posthog-js, astro-mermaid, mermaid, @astrojs/mdx, @astrojs/sitemap are NOT installed (those are owned by Phases 2/3/4)"
    - "No font CDN configured at scaffold level (TECH-05 honored — no Google Fonts in <head>)"
    - "astro.config.mjs declares site: 'https://jigspec.com', output: 'static', and vite.plugins: [tailwindcss()] per D-19 (no integrations array — mermaid/mdx/sitemap arrive in their respective phases)"
    - "Repo-root files per D-22: README.md replaces the placeholder with a brief description + .planning/PROJECT.md pointer; LICENSE is preserved untouched; .gitignore covers Node + Astro defaults"
  artifacts:
    - path: "package.json"
      provides: "Astro 6 + Tailwind 4 + @tailwindcss/vite dependencies"
      contains: "\"astro\":"
    - path: "tsconfig.json"
      provides: "Astro strict TypeScript base config"
      contains: "astro/tsconfigs/strict"
    - path: "astro.config.mjs"
      provides: "Static site config with Tailwind Vite plugin wired"
      contains: "output: 'static'"
    - path: "src/styles/global.css"
      provides: "Tailwind 4 CSS-first entry point"
      contains: "@import \"tailwindcss\""
    - path: ".gitignore"
      provides: "Node + Astro ignore defaults"
      contains: "node_modules"
    - path: "README.md"
      provides: "Brief project description + pointer to .planning/PROJECT.md"
      contains: ".planning/PROJECT.md"
  key_links:
    - from: "astro.config.mjs"
      to: "@tailwindcss/vite"
      via: "vite.plugins array"
      pattern: "tailwindcss\\(\\)"
    - from: "src/styles/global.css"
      to: "Tailwind 4 engine"
      via: "@import directive (CSS-first config)"
      pattern: "@import \"tailwindcss\""
    - from: "tsconfig.json"
      to: "astro/tsconfigs/strict"
      via: "extends field"
      pattern: "astro/tsconfigs/strict"
---

<objective>
Scaffold the Astro 6 (TypeScript strict) project at the repo root, install Tailwind 4 via `@tailwindcss/vite` (NOT `@astrojs/tailwind`), write `astro.config.mjs` with `output: 'static'` and `site: 'https://jigspec.com'` and Tailwind wired as a Vite plugin, replace the placeholder `README.md`, and ensure `.gitignore` covers Node + Astro defaults.

Purpose: Produce a buildable but content-less Astro project as the foundation that all subsequent Phase 1 plans (fonts → 01-02, layout shell → 01-03, vercel config → 01-04) build on. Without a working `npm run build`, nothing else in Phase 1 can be verified end-to-end.

Output: A scaffolded Astro 6 project with Tailwind 4 wired and `npm run build` exiting 0. NO fonts, NO layout components beyond the Astro init defaults, NO Vercel config — those are owned by Plans 01-02, 01-03, and 01-04 respectively.

Implements requirement: **TECH-01** (Astro 6 + Tailwind 4 + TypeScript strict scaffold).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md
@CLAUDE.md
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Scaffold Astro 6 project (minimal template, TypeScript strict)</name>
  <files>package.json, tsconfig.json, astro.config.mjs, src/env.d.ts, src/pages/index.astro, public/favicon.svg, .gitignore</files>
  <read_first>
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (re-read D-17, D-22 carefully — they govern this task)
    - CLAUDE.md (Tech Stack table — Astro `^6` is the locked version line)
    - The existing repo root via `ls -la` (CLAUDE.md, LICENSE, README.md, .planning/, .git/ already exist; the scaffold must NOT clobber LICENSE or .planning/)
  </read_first>
  <action>
    Per **D-17** (LOCKED): run the Astro 6 minimal-template scaffold IN-PLACE at the repo root (NOT in a subdirectory) with TypeScript strict and git init suppressed (the repo is already a git repo).

    Run from `/Users/kjs/Documents/Business/JigSpec-LandingPage`:

    ```bash
    npm create astro@latest -- . --template minimal --typescript strict --install --no --git
    ```

    Flag breakdown:
    - `.` — scaffold INTO the current directory (do NOT create a subdirectory; the repo root IS the project root per D-22)
    - `--template minimal` — D-17 locks this template (no example content)
    - `--typescript strict` — D-17 locks TypeScript strict mode
    - `--install` — install npm deps as part of init (saves a step)
    - `--no` — answer "no" to any "this directory is not empty / would you like to..." prompts (we KNOW it's not empty; CLAUDE.md, LICENSE, README.md, .planning/, .git/ all already exist and must be preserved)
    - `--git` — D-17 includes the `--git` flag; combined with `--no` this means "do not re-init git" (the repo is already a git repo)

    If the create-astro CLI is non-interactive enough that the above flags fully suppress prompts, the command should complete without further input. If it stalls on a "destination is not empty" prompt despite `--no`, fall back to:

    ```bash
    yes n | npm create astro@latest -- . --template minimal --typescript strict --install
    ```

    Before scaffolding, capture the current git HEAD so we can verify post-scaffold that pre-existing history was preserved:

    ```bash
    git rev-parse HEAD > /tmp/jigspec-pre-scaffold-head.txt
    ```

    After the scaffold completes, verify it did NOT delete `LICENSE`, `CLAUDE.md`, or `.planning/`:

    ```bash
    test -f LICENSE && test -f CLAUDE.md && test -d .planning || (echo "FATAL: scaffold clobbered protected files" && exit 1)
    ```

    Verify `.git/` was preserved (the create-astro CLI's `--git --no` flag handling is non-obvious and version-dependent):

    ```bash
    test -f .git/HEAD && git log -1 --oneline || (echo "FATAL: scaffold destroyed git history" && exit 1)
    # Confirm HEAD either matches pre-scaffold OR sits on top of pre-existing history (no detached/orphan branch)
    git merge-base --is-ancestor "$(cat /tmp/jigspec-pre-scaffold-head.txt)" HEAD || (echo "FATAL: pre-scaffold commit not reachable from current HEAD" && exit 1)
    ```

    The Astro minimal template should produce: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/env.d.ts`, `src/pages/index.astro`, `public/favicon.svg`, and a `.gitignore`. README.md is OVERWRITTEN by the scaffold — don't worry, Task 5 replaces it with our project description.

    Verify Astro version is `^6`:

    ```bash
    grep -E '"astro":\s*"\^6' package.json
    ```

    Verify `tsconfig.json` extends Astro's strict base (D-17):

    ```bash
    grep '"extends"' tsconfig.json | grep 'astro/tsconfigs/strict'
    ```

    If `tsconfig.json` extends `astro/tsconfigs/base` instead of `strict` (some scaffold flag combinations default to base), edit it to use strict:

    ```json
    {
      "extends": "astro/tsconfigs/strict"
    }
    ```

    Keep any other fields the scaffold added (`include`, `exclude`, etc.); only swap the `extends` value if needed.

    Do NOT touch `astro.config.mjs` in this task — Task 3 owns that file. Leave whatever the scaffold produced (likely `import { defineConfig } from 'astro/config'; export default defineConfig({});` or similar).

    Do NOT install Tailwind in this task — Task 2 owns the Tailwind install per D-18.
  </action>
  <verify>
    <automated>test -f package.json && test -f tsconfig.json && test -f astro.config.mjs && grep -E '"astro":\s*"\^6' package.json && grep -v '^[[:space:]]*//' tsconfig.json | grep -q 'astro/tsconfigs/strict' && test -f LICENSE && test -d .planning</automated>
  </verify>
  <acceptance_criteria>
    - File `package.json` exists.
    - File `tsconfig.json` exists.
    - File `astro.config.mjs` exists.
    - File `src/env.d.ts` exists (Astro minimal template default).
    - File `src/pages/index.astro` exists (Astro minimal template default).
    - `package.json` matches `grep -E '"astro":\s*"\^6'` (Astro version pinned to `^6` per D-17).
    - `tsconfig.json` (with comment lines stripped via `grep -v '^[[:space:]]*//'`) contains `astro/tsconfigs/strict` (NOT `base`, NOT `strictest` — per D-17).
    - File `LICENSE` exists (NOT clobbered by scaffold per D-22).
    - File `CLAUDE.md` exists (NOT clobbered by scaffold).
    - Directory `.planning/` exists (NOT clobbered by scaffold).
    - Directory `node_modules/` exists (npm install ran successfully via `--install` flag).
    - File `.git/HEAD` exists (git directory survived scaffold).
    - `git log -1 --oneline` exits 0 (pre-existing commits are still reachable).
    - `git merge-base --is-ancestor "$(cat /tmp/jigspec-pre-scaffold-head.txt)" HEAD` exits 0 (current HEAD is the pre-scaffold commit OR a descendant of it — no detached/orphan branch).
  </acceptance_criteria>
  <done>
    - `package.json` exists with `"astro": "^6.x"` in `dependencies`
    - `tsconfig.json` exists and extends `astro/tsconfigs/strict` (NOT `base`, NOT `strictest` — exactly `strict` per D-17)
    - `astro.config.mjs` exists (contents will be rewritten by Task 3)
    - `src/env.d.ts` and `src/pages/index.astro` exist (Astro minimal template defaults)
    - `LICENSE`, `CLAUDE.md`, and `.planning/` are still present (scaffold did not clobber them)
    - `node_modules/` exists (npm install ran successfully via `--install` flag)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Install Tailwind 4 + @tailwindcss/vite (NOT @astrojs/tailwind)</name>
  <files>package.json, package-lock.json</files>
  <read_first>
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-18 LOCKED — Phase 1 deps are ONLY tailwindcss + @tailwindcss/vite)
    - CLAUDE.md (Tech Stack table — `tailwindcss` `^4.2` and `@tailwindcss/vite` `^4.2`; AVOID list explicitly forbids `@astrojs/tailwind`)
  </read_first>
  <action>
    Per **D-18** (LOCKED): install ONLY `tailwindcss` and `@tailwindcss/vite` as devDependencies. Do NOT install `posthog-js`, `astro-mermaid`, `mermaid`, `@astrojs/mdx`, or `@astrojs/sitemap` — those belong to Phases 2/3/4.

    From the repo root:

    ```bash
    npm install -D tailwindcss @tailwindcss/vite
    ```

    Per **CLAUDE.md "What NOT to Use"**: explicitly verify `@astrojs/tailwind` is NOT installed (it's the deprecated v3 integration and conflicts with the v4 Vite plugin). If npm or some other tool ever pulled it in transitively, remove it:

    ```bash
    if grep -q '@astrojs/tailwind' package.json; then npm uninstall @astrojs/tailwind; fi
    ```

    Verify both target packages are in `devDependencies` of `package.json` and that `@astrojs/tailwind` is absent:

    ```bash
    grep '"tailwindcss":' package.json
    grep '"@tailwindcss/vite":' package.json
    ! grep '"@astrojs/tailwind":' package.json
    ```

    Verify the version lines start with `^4` (D-18 + CLAUDE.md):

    ```bash
    grep -E '"tailwindcss":\s*"\^4' package.json
    grep -E '"@tailwindcss/vite":\s*"\^4' package.json
    ```

    Do NOT run `npx tailwindcss init` — Tailwind 4 uses CSS-first config (`@import "tailwindcss"` directive in CSS), not a `tailwind.config.js` file. Task 4 creates the CSS file.

    Do NOT modify `astro.config.mjs` here — Task 3 wires the Vite plugin.
  </action>
  <verify>
    <automated>grep -E '"tailwindcss":\s*"\^4' package.json && grep -E '"@tailwindcss/vite":\s*"\^4' package.json && ! grep -q '"@astrojs/tailwind"' package.json</automated>
  </verify>
  <acceptance_criteria>
    - `package.json` matches `grep -E '"tailwindcss":\s*"\^4'` (Tailwind pinned to `^4` per D-18).
    - `package.json` matches `grep -E '"@tailwindcss/vite":\s*"\^4'` (Vite plugin pinned to `^4` per D-18).
    - `package.json` does NOT contain `"@astrojs/tailwind"` (deprecated v3 integration — forbidden by CLAUDE.md "What NOT to Use" + D-18).
    - File `package-lock.json` exists (npm install persisted the dependency tree).
    - File `tailwind.config.js` does NOT exist at the repo root (Tailwind 4 is CSS-first; this file would indicate v3 misconfiguration).
  </acceptance_criteria>
  <done>
    - `package.json` `devDependencies` contains `"tailwindcss": "^4.x"` and `"@tailwindcss/vite": "^4.x"`
    - `package.json` does NOT contain `@astrojs/tailwind` anywhere (deps, devDeps, peerDeps)
    - `package-lock.json` has been updated by npm
    - No `tailwind.config.js` was created (Tailwind 4 is CSS-first; this file would be wrong)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Write astro.config.mjs (site, output: 'static', tailwindcss Vite plugin)</name>
  <files>astro.config.mjs</files>
  <read_first>
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-19 LOCKED — exact config shape)
    - CLAUDE.md (Tech Stack table — `@tailwindcss/vite` is the v4 path; the AVOID list confirms no integrations array yet for mdx/mermaid/sitemap)
    - Current `astro.config.mjs` (whatever the scaffold produced — read it before overwriting so we know what we're replacing)
  </read_first>
  <action>
    Per **D-19** (LOCKED): rewrite `astro.config.mjs` to declare:
    - `site: 'https://jigspec.com'` (the eventual apex, even though we deploy to vercel.app)
    - `output: 'static'` (default in Astro 6, but declare it explicitly so future readers don't wonder)
    - `vite.plugins: [tailwindcss()]` (Tailwind 4 wired as a Vite plugin)
    - NO `integrations` array (mdx/mermaid/sitemap arrive in their respective phases per D-18; an empty `integrations: []` is also fine but unnecessary)

    Write the file with **exactly** this content:

    ```js
    // @ts-check
    import { defineConfig } from 'astro/config';
    import tailwindcss from '@tailwindcss/vite';

    // https://astro.build/config
    export default defineConfig({
      site: 'https://jigspec.com',
      output: 'static',
      vite: {
        plugins: [tailwindcss()],
      },
    });
    ```

    Notes:
    - The `// @ts-check` pragma at the top enables TypeScript checking on the config file (low-cost type safety win; matches Astro 6 scaffold conventions).
    - `defineConfig` is imported from `'astro/config'` (NOT `'astro'`).
    - `tailwindcss` is the DEFAULT export from `@tailwindcss/vite`.
    - No `integrations` field — Phase 1 ships zero integrations per D-18.
    - No `image`, no `markdown`, no `prefetch` config — keep the file minimal; later phases add what they need.

    After writing, verify:

    ```bash
    grep "site: 'https://jigspec.com'" astro.config.mjs
    grep "output: 'static'" astro.config.mjs
    grep "from '@tailwindcss/vite'" astro.config.mjs
    grep "tailwindcss()" astro.config.mjs
    # Negative checks — these MUST be absent in Phase 1
    ! grep -E "from '@astrojs/(mdx|sitemap|vercel)'" astro.config.mjs
    ! grep "from 'astro-mermaid'" astro.config.mjs
    ! grep "@astrojs/tailwind" astro.config.mjs
    ```
  </action>
  <verify>
    <automated>grep -F "site: 'https://jigspec.com'" astro.config.mjs && grep -F "output: 'static'" astro.config.mjs && grep -F "from '@tailwindcss/vite'" astro.config.mjs && grep -F "tailwindcss()" astro.config.mjs && ! grep -q "@astrojs/tailwind" astro.config.mjs && ! grep -qE "from '@astrojs/(mdx|sitemap|vercel)'" astro.config.mjs && ! grep -q "from 'astro-mermaid'" astro.config.mjs</automated>
  </verify>
  <acceptance_criteria>
    - File `astro.config.mjs` contains the literal `site: 'https://jigspec.com'` (per D-19).
    - File `astro.config.mjs` contains the literal `output: 'static'` (per D-19).
    - File `astro.config.mjs` contains the literal `from '@tailwindcss/vite'` (Tailwind 4 default-export import).
    - File `astro.config.mjs` contains the literal `tailwindcss()` (plugin invocation inside `vite.plugins`).
    - File `astro.config.mjs` contains the literal `// @ts-check` (TypeScript-checking pragma at top).
    - File `astro.config.mjs` does NOT match `grep -qE "from '@astrojs/(mdx|sitemap|vercel)'"` (no MDX, sitemap, or Vercel integrations in Phase 1).
    - File `astro.config.mjs` does NOT contain `from 'astro-mermaid'` (Mermaid deferred to Phase 4).
    - File `astro.config.mjs` does NOT contain `@astrojs/tailwind` (deprecated v3 integration — forbidden).
  </acceptance_criteria>
  <done>
    - `astro.config.mjs` contains the exact lines `site: 'https://jigspec.com'`, `output: 'static'`, `import tailwindcss from '@tailwindcss/vite';`, and `tailwindcss()` inside `vite.plugins`
    - File does NOT import any other Astro integrations (mdx, sitemap, vercel, astro-mermaid) — those are deferred to Phases 2/3/4
    - File does NOT reference `@astrojs/tailwind`
    - `// @ts-check` pragma is present at top of file
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Create src/styles/global.css with Tailwind 4 CSS-first import</name>
  <files>src/styles/global.css</files>
  <read_first>
    - CLAUDE.md (Tech Stack — Tailwind 4 uses CSS-first syntax; `@import "tailwindcss"` is the entry directive)
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-19 governs Tailwind wiring at the build layer; this task does the CSS-side complement)
  </read_first>
  <action>
    Create the directory and file:

    ```bash
    mkdir -p src/styles
    ```

    Write `src/styles/global.css` with **exactly** this single line of content (no comments, no extra rules — Phase 1 keeps it minimal; Plan 01-03 adds reset/typography rules):

    ```css
    @import "tailwindcss";
    ```

    That single directive is Tailwind 4's CSS-first entry point — it pulls in the engine, the preflight reset, and the utility classes. There is no `@tailwind base / components / utilities` triple anymore (that was Tailwind 3 syntax; using it on v4 will silently produce broken output).

    Do NOT add `@theme {}` blocks, `@layer` rules, or `@plugin` imports here — Plan 01-02 (fonts) and Plan 01-03 (typography/reset) own those additions.

    Do NOT import `global.css` from any layout component yet — `src/layouts/Base.astro` does not exist in Phase 1 Plan 01 (Plan 01-03 creates it). The Astro scaffold's default `src/pages/index.astro` won't pull this CSS until Plan 01-03 wires it in. That's fine: the build still validates the CSS imports correctly because Astro's Vite pipeline processes CSS files in `src/` regardless of import status — and the negative check in Task 6's `astro check` confirms no syntax errors.

    Verify file content:

    ```bash
    test -f src/styles/global.css
    grep -F '@import "tailwindcss"' src/styles/global.css
    ```
  </action>
  <verify>
    <automated>test -f src/styles/global.css && grep -F '@import "tailwindcss"' src/styles/global.css && test "$(wc -l < src/styles/global.css | tr -d ' ')" -le 2</automated>
  </verify>
  <acceptance_criteria>
    - File `src/styles/global.css` exists.
    - File `src/styles/global.css` contains the literal `@import "tailwindcss"` (Tailwind 4 CSS-first entry directive).
    - File `src/styles/global.css` is at most 2 lines (`wc -l` ≤ 2 — keeps Phase 1 minimal; Plans 01-02/01-03 own additions).
    - File `src/styles/global.css` does NOT contain `@tailwind base` (Tailwind 3 syntax — would break on v4).
    - File `src/styles/global.css` does NOT contain `@theme` or `@layer` (deferred to Plans 01-02 / 01-03).
  </acceptance_criteria>
  <done>
    - `src/styles/global.css` exists and contains exactly `@import "tailwindcss";` (one substantive line; trailing newline OK)
    - File contains NO `@tailwind base/components/utilities` directives (Tailwind 3 syntax — would be wrong on v4)
    - File contains NO `@theme {}`, `@layer`, or font-family declarations (those belong to Plans 01-02 and 01-03)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 5: Replace README.md with project description; ensure .gitignore covers Node + Astro</name>
  <files>README.md, .gitignore</files>
  <read_first>
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-22 LOCKED — README replacement + .gitignore Node + Astro defaults)
    - Existing `.gitignore` (whatever the Astro scaffold produced; we may only need to verify, not rewrite)
    - Existing `README.md` (the scaffold overwrote our 2-line placeholder; we replace it again)
  </read_first>
  <action>
    Per **D-22** (LOCKED): replace `README.md` with a brief project description plus a pointer to `.planning/PROJECT.md`. The scaffold likely overwrote our original 2-line placeholder with an Astro template README — replace that with project-specific content.

    Write `README.md` with **exactly** this content:

    ```markdown
    # JigSpec Landing Page

    Company-level marketing site for JigSpec — the proprietary agentic-AI runtime
    and product studio behind the open `.pipe.yaml` spec and individual products
    like `buggerd`.

    Built with Astro 6 + Tailwind 4. Deployed to Vercel, fronted by Cloudflare DNS.

    See `.planning/PROJECT.md` for full project context, constraints, and the
    success criteria this site is designed to satisfy. See `.planning/ROADMAP.md`
    for the phased delivery plan, and `CLAUDE.md` for the technology-stack
    decisions and contributor instructions.

    ## Local development

    ```sh
    npm install
    npm run dev      # start the Astro dev server
    npm run build    # produce a static build in ./dist
    npm run preview  # preview the production build locally
    ```

    ## License

    See `LICENSE` (MIT).
    ```

    Verify the replacement:

    ```bash
    grep -F 'JigSpec Landing Page' README.md
    grep -F '.planning/PROJECT.md' README.md
    grep -F 'Astro 6 + Tailwind 4' README.md
    ```

    For `.gitignore`: the Astro scaffold typically produces a `.gitignore` covering `node_modules`, `dist`, `.astro`, `.env*`, and editor / OS junk. **Read the scaffold-produced file first**. If any of the following entries are missing, append them. Do NOT rewrite the file from scratch — preserve whatever Astro added.

    Required entries (D-22 — Node + Astro defaults):

    ```
    # build output
    dist/
    .astro/

    # dependencies
    node_modules/

    # logs
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*

    # environment variables
    .env
    .env.production
    .env.local
    .env.*.local

    # macOS
    .DS_Store

    # editors
    .vscode/
    .idea/
    ```

    Verification approach: for each pattern that's missing from the existing `.gitignore`, append it. Concretely:

    ```bash
    # Check each required pattern; append any missing ones
    for pat in "dist/" ".astro/" "node_modules/" ".env" ".DS_Store"; do
      grep -qF "$pat" .gitignore || echo "$pat" >> .gitignore
    done
    ```

    Verify the result:

    ```bash
    grep -F 'node_modules' .gitignore
    grep -F 'dist' .gitignore
    grep -F '.astro' .gitignore
    grep -F '.env' .gitignore
    grep -F '.DS_Store' .gitignore
    ```
  </action>
  <verify>
    <automated>grep -F 'JigSpec Landing Page' README.md && grep -F '.planning/PROJECT.md' README.md && grep -F 'Astro 6 + Tailwind 4' README.md && grep -F 'node_modules' .gitignore && grep -F 'dist' .gitignore && grep -F '.astro' .gitignore && grep -F '.env' .gitignore</automated>
  </verify>
  <acceptance_criteria>
    - File `README.md` contains the literal `JigSpec Landing Page` (project heading per D-22).
    - File `README.md` contains the literal `.planning/PROJECT.md` (pointer to canonical project context per D-22).
    - File `README.md` contains the literal `Astro 6 + Tailwind 4` (stack callout — also enforces stack identity).
    - File `.gitignore` contains `node_modules` (D-22 Node default).
    - File `.gitignore` contains `dist` (D-22 Astro build-output default).
    - File `.gitignore` contains `.astro` (D-22 Astro cache default).
    - File `.gitignore` contains `.env` (secrets).
    - File `.gitignore` contains `.DS_Store` (macOS noise).
    - File `LICENSE` exists and is unchanged from before the plan ran (D-22 sanity — keep existing, untouched).
  </acceptance_criteria>
  <done>
    - `README.md` contains the project description with `JigSpec Landing Page` heading, mention of `Astro 6 + Tailwind 4`, and a `.planning/PROJECT.md` pointer
    - `README.md` does NOT contain Astro template boilerplate (e.g. "Astro starter kit" headings or `npm create astro@latest` instructions for new users)
    - `.gitignore` includes patterns for `node_modules`, `dist`, `.astro`, `.env`, and `.DS_Store` (additional Astro-default patterns may also be present and should be preserved)
    - `LICENSE` is unchanged from before this plan ran (D-22: keep existing, untouched)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 6: End-to-end verification — install, type-check, build</name>
  <files>(none modified — verification only)</files>
  <read_first>
    - This plan's must_haves block (the truths must be demonstrably TRUE at the end of this task)
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-19 governs the build target — `output: 'static'` must produce a `dist/`)
  </read_first>
  <action>
    Run the full verification chain from the repo root. All three must exit 0 in order:

    ```bash
    # 1. Install (idempotent — Task 1's --install already ran this, but re-run to catch any
    # devDep additions from Task 2)
    npm install
    echo "npm install exit: $?"

    # 2. Type-check the Astro project
    npx astro check
    echo "astro check exit: $?"

    # 3. Build the static site
    npm run build
    echo "npm run build exit: $?"

    # 4. Confirm the static output landed in dist/
    test -d dist && echo "dist/ exists: yes"
    test -f dist/index.html && echo "dist/index.html exists: yes"
    ```

    Expected outputs:
    - `npm install` exits 0
    - `npx astro check` exits 0 — there are no `.astro` files we authored yet (only the scaffold's `src/pages/index.astro`); zero errors expected
    - `npm run build` exits 0 — produces `dist/` with at least `dist/index.html` (the scaffold's default page)
    - `dist/` directory exists

    If `npx astro check` fails: most likely cause is a TypeScript strict violation in the scaffold's `index.astro` or an outdated `astro.config.mjs` import. Read the error, fix at the smallest scope possible. Do NOT loosen `tsconfig.json` to bypass — D-17 locks strict.

    If `npm run build` fails with a Tailwind error: most likely the `@tailwindcss/vite` plugin isn't actually wired. Re-check Task 3's `astro.config.mjs` content character-by-character.

    If `npm run build` fails with `[ERROR] Could not resolve "tailwindcss"`: Task 2's npm install didn't actually persist the dep — re-run `npm install -D tailwindcss @tailwindcss/vite`.

    Once all three commands exit 0 and `dist/index.html` exists, this plan is COMPLETE. Phase 1 Plan 01-02 can begin.

    Optional cleanup (do NOT block on this): `rm -rf dist` is fine if you want a clean tree before the next plan, but `dist/` is in `.gitignore` so leaving it is also fine.
  </action>
  <verify>
    <automated>npm install --silent && npx astro check && npm run build && test -d dist && test -f dist/index.html</automated>
  </verify>
  <acceptance_criteria>
    - `npm install --silent` exits 0 (dependency tree resolves cleanly).
    - `npx astro check` exits 0 (TypeScript strict + Astro type-check passes).
    - `npm run build` exits 0 (Astro static build succeeds).
    - Directory `dist/` exists (build output landed at the expected location).
    - File `dist/index.html` exists (Astro rendered the scaffold's default page end-to-end — proves the full pipeline runs, not just that `dist/` was created empty).
  </acceptance_criteria>
  <done>
    - `npm install` exits 0
    - `npx astro check` exits 0 with zero errors and zero warnings (info-level messages OK)
    - `npm run build` exits 0
    - `dist/index.html` exists (proves the static build pipeline runs end-to-end)
    - All five must_haves truths are satisfied (build works, Tailwind imports resolve, strict TS active, @astrojs/tailwind absent, no font CDN configured)
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| npm registry → local node_modules | External package source; supply-chain risk if a typosquatted or compromised package is installed |
| Astro init template → repo root | Scaffold writes files into a directory that already contains LICENSE, CLAUDE.md, .planning/; risk of clobber |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-01 | Tampering | npm install of `@tailwindcss/vite` and `tailwindcss` | mitigate | Pin to `^4.2` per CLAUDE.md; verify exact package names character-by-character in Task 2 (typosquat names like `@tailwind/vite` or `tailwindcss-cli` exist on npm); package-lock.json committed for reproducibility |
| T-01-02 | Information Disclosure | Astro init scaffold writing into populated repo root | mitigate | Task 1 verifies LICENSE, CLAUDE.md, .planning/ all survive; explicit post-scaffold check exits non-zero if any are missing; use `--no` flag to suppress destructive prompts |
| T-01-03 | Denial of Service | Build pipeline silently degrading (e.g. `npm run build` succeeds but produces empty `dist/`) | mitigate | Task 6 verifies `dist/index.html` exists, not just `dist/` directory; smoke-tests the full Astro-render pipeline |
| T-01-04 | Elevation of Privilege | Inadvertent install of `@astrojs/tailwind` (deprecated v3 integration) which would conflict with v4 plugin and could mask Tailwind's actual behavior | mitigate | Task 2 explicit `! grep '@astrojs/tailwind'` negative check; Task 3 negative check on `astro.config.mjs`; CLAUDE.md "What NOT to Use" row makes the prohibition explicit |
| T-01-05 | Spoofing | A future contributor (or a future Claude run) misidentifying the project's Tailwind version because v3 vs v4 syntax differs | mitigate | README.md states "Astro 6 + Tailwind 4" explicitly; `package.json` version pin is `^4.2`; CSS file uses v4-only `@import "tailwindcss"` syntax which would fail on v3, making accidental downgrade self-detecting |
| T-01-06 | Repudiation | TypeScript strict mode silently relaxed by a future tsconfig edit | accept | Low risk for Phase 1; D-17 locks strict; if violated, downstream `astro check` will surface errors. Will be re-validated in Plan 01-03 when actual Astro components are authored. |

</threat_model>

<verification>
After all tasks complete, the following commands MUST all exit 0 from the repo root:

```bash
# Dependency hygiene
grep -E '"astro":\s*"\^6' package.json
grep -E '"tailwindcss":\s*"\^4' package.json
grep -E '"@tailwindcss/vite":\s*"\^4' package.json
! grep -q '"@astrojs/tailwind"' package.json

# Config correctness
grep -F "site: 'https://jigspec.com'" astro.config.mjs
grep -F "output: 'static'" astro.config.mjs
grep -F "tailwindcss()" astro.config.mjs
grep -v '^[[:space:]]*//' tsconfig.json | grep -q 'astro/tsconfigs/strict'

# CSS entry
grep -F '@import "tailwindcss"' src/styles/global.css

# Repo files
grep -F 'JigSpec Landing Page' README.md
grep -F '.planning/PROJECT.md' README.md
grep -F 'node_modules' .gitignore
test -f LICENSE  # untouched per D-22

# Build pipeline
npx astro check
npm run build
test -f dist/index.html
```

Any failure → re-run the corresponding task's verify step and fix at the smallest scope possible. Do NOT relax `tsconfig.json` strict mode (locked by D-17); do NOT install `@astrojs/tailwind` (forbidden by CLAUDE.md + D-18).
</verification>

<success_criteria>
1. **Buildable project:** `npm run build` exits 0 and produces `dist/index.html`
2. **Correct stack versions:** `astro@^6`, `tailwindcss@^4`, `@tailwindcss/vite@^4` all in `package.json`
3. **Tailwind v4 CSS-first config:** `src/styles/global.css` contains `@import "tailwindcss"` (NOT v3's `@tailwind base/components/utilities`)
4. **TypeScript strict active:** `tsconfig.json` extends `astro/tsconfigs/strict` and `npx astro check` exits 0
5. **Forbidden package absent:** `@astrojs/tailwind` is NOT in any `package.json` dependency list
6. **Astro config matches D-19:** `site: 'https://jigspec.com'`, `output: 'static'`, `vite.plugins: [tailwindcss()]`, no integrations array
7. **Repo-root files correct per D-22:** README.md replaced (project description + .planning/PROJECT.md pointer), LICENSE untouched, .gitignore covers Node + Astro defaults
8. **Protected files preserved:** `LICENSE`, `CLAUDE.md`, and `.planning/` all still exist after the scaffold
9. **No font CDN, no Vercel adapter, no MDX/Mermaid/sitemap integration** — those are owned by Plans 01-02 / 01-03 / 01-04 and Phases 2 / 3 / 4
</success_criteria>

<output>
After completion, create `.planning/phases/01-scaffold-sketches-visual-shell/01-01-astro-tailwind-scaffold-SUMMARY.md` documenting:
- The exact `astro` version that landed in `package.json` (e.g. `6.1.9`) and exact Tailwind version (e.g. `4.2.4`) — useful as a baseline if a future plan needs to coordinate version bumps
- Whether `npm create astro@latest` ran fully non-interactive or required intervention (informs Plan 01-02's automation strategy if it also needs to invoke a generator)
- Any deviations from D-17 / D-18 / D-19 / D-22 (expected: zero — but record any pre-existing scaffold artifacts that influenced the result, like Astro defaulting `tsconfig.json` to `base` instead of `strict`)
- Confirmation that LICENSE survived untouched (D-22 sanity check)
- Build artifacts produced (size of `dist/`, what `dist/index.html` contains — should be the Astro minimal-template default Hello World)
</output>
</output>
