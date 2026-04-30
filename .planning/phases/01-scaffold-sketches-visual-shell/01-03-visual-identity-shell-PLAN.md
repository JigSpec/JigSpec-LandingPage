---
id: 01-03-visual-identity-shell
phase: 01
plan: 03
type: execute
wave: 2
depends_on: [01-01-astro-tailwind-scaffold, 01-02-visual-sketches]
files_modified:
  - .planning/PROJECT.md
  - astro.config.mjs
  - src/styles/global.css
  - src/layouts/Base.astro
  - src/components/global/Nav.astro
  - src/components/global/Footer.astro
  - src/pages/index.astro
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-320.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-375.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-414.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-1280.png
autonomous: false
requirements: [TECH-05, VISUAL-02, VISUAL-03, VISUAL-04]

must_haves:
  truths:
    - "Sketch direction (A or B) is recorded as a Key Decision row in PROJECT.md before any production styling lands"
    - "All chosen typefaces are self-hosted via Astro Fonts API (zero external font CDN per TECH-05)"
    - "Tailwind 4 @theme declares ≤4 colors total (bg, fg, muted, accent) and a 3-element type scale (display, body, micro)"
    - "Typeface is not ui-monospace and accent is not emerald-600 — chrome reads as distinct from buggerd (VISUAL-03)"
    - "Shell renders legibly at 320 / 375 / 414 / 1280 viewports with nav collapsing below 768px (VISUAL-04, per D-25 — Tailwind defaults sm/md/lg/xl/2xl at 640/768/1024/1280/1536, manual DevTools verification, no test framework wired in Phase 1)"
    - "Phase 1 ships only the three components from D-23: src/layouts/Base.astro + src/components/global/Nav.astro (text wordmark + 3 placeholder anchor links + mobile hamburger <768px) + src/components/global/Footer.astro (placeholder docs link + contact email + copyright + GitHub org link). NO ProductCard / MermaidDiagram / InterestForm / sections — those belong to Phases 2/3/4."
    - "index.astro is composition-only (Base + Nav + h1 placeholder + Footer) — no hero, no cards, no sections (D-24)"
    - "<html data-theme> attribute is wired so Phase 4 can validate dark mode without re-architecting"
    - "Dark mode follows D-10: system-preference auto via <html data-theme> + Tailwind darkMode: 'media' (NOT 'class'); NO toggle UI ships in v1 (Mermaid in Phase 4 wires off the same attribute)"
    - "Per D-11, dark theme palette is NOT designed in Phase 1 — sketches are light-only, dark theme is auto-derived (bg → near-black, fg → light, accent unchanged), validated visually only in Phase 4 polish; if auto-derivation fails the polish gate, dark mode is dropped from v1 (light-only fallback)"
    - "npx astro check exits 0 and npm run build exits 0 after the plan completes"
  artifacts:
    - path: ".planning/PROJECT.md"
      provides: "Key Decisions table row recording chosen sketch direction"
      contains: "sketch direction"
    - path: "astro.config.mjs"
      provides: "Astro Fonts API config for chosen direction's display + body faces"
      contains: "experimental: { fonts:"
    - path: "src/styles/global.css"
      provides: "Tailwind 4 @theme tokens (≤4 colors, 3-element type scale) + @import 'tailwindcss'"
      contains: "@theme"
      min_lines: 15
    - path: "src/layouts/Base.astro"
      provides: "HTML5 document shell, font loading, data-theme plumbing, slot"
      contains: "<slot"
      min_lines: 25
    - path: "src/components/global/Nav.astro"
      provides: "JigSpec wordmark + 3 placeholder anchor links + mobile hamburger toggle"
      contains: "md:hidden"
      min_lines: 30
    - path: "src/components/global/Footer.astro"
      provides: "docs link, contact email, copyright, GitHub org link"
      contains: "github.com/JigSpec"
      min_lines: 10
    - path: "src/pages/index.astro"
      provides: "Composition-only landing: Base + Nav + h1 + Footer"
      contains: "coming soon"
  key_links:
    - from: "src/pages/index.astro"
      to: "src/layouts/Base.astro"
      via: "import + <Base> wrapper"
      pattern: "import Base from"
    - from: "src/layouts/Base.astro"
      to: "src/styles/global.css"
      via: "import in frontmatter"
      pattern: "import.*global\\.css"
    - from: "src/layouts/Base.astro"
      to: "Astro Fonts API"
      via: "<Font> component for display + body"
      pattern: "from ['\"]astro:assets['\"]|from ['\"]astro:fonts['\"]"
    - from: "src/components/global/Nav.astro"
      to: "mobile hamburger toggle"
      via: "vanilla JS click listener flipping menu visibility"
      pattern: "addEventListener\\(['\"]click"
---

<objective>
Apply the chosen sketch direction (A or B from plan 01-02) to the production Astro project: record the choice in PROJECT.md, configure Astro Fonts API to self-host the chosen direction's faces (TECH-05 — zero external font CDN), wire Tailwind 4 `@theme` tokens (≤4 colors, 3-element typographic scale, system-pref dark via `darkMode: 'media'`), write `Base.astro` + `Nav.astro` + `Footer.astro`, and render a minimal composition-only `index.astro` (just `<h1>JigSpec — coming soon</h1>`). Verify legibility at 320 / 375 / 414 / 1280 via `npm run dev`.

Purpose: Lock the visual identity before any content lands so subsequent phases cannot drift. Ship the production shell that fills the gap between scaffold (plan 01-01) and content composition (Phase 2).

Output: Production-ready Astro shell with self-hosted typography, locked palette tokens, responsive nav/footer, and `<html data-theme>` plumbing for Phase 4 dark-mode validation.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/REQUIREMENTS.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md
@CLAUDE.md
@.planning/sketches/sketch-a-confident-direct.html
@.planning/sketches/sketch-b-engineering-blog-pragmatic.html

<interfaces>
<!-- Astro 6 Fonts API (experimental.fonts) — embed <Font> components in Base.astro. -->
<!-- Astro 6 Fonts API is exposed via "astro:assets" until promoted to stable; the import path may differ in the project's installed version. -->
<!-- The executor MUST verify the import path against `node_modules/astro/types.d.ts` or astro.config.mjs typegen output. As of Astro 6.1, the path is `astro:assets` for the <Font> component. -->

Astro 6 experimental.fonts config shape (in astro.config.mjs):
```typescript
experimental: {
  fonts: [
    {
      provider: fontProviders.google(),       // imported from 'astro/config'
      name: '<font family name>',
      cssVariable: '--font-display',           // matches @theme variable
      weights: ['700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    // ...repeat for body face
  ],
}
```

Astro 6 <Font> component usage (in Base.astro <head>):
```astro
---
import { Font } from 'astro:assets';
---
<Font cssVariable="--font-display" preload />
<Font cssVariable="--font-body" preload />
```

Tailwind 4 @theme block (in src/styles/global.css):
```css
@import "tailwindcss";

@theme {
  --color-bg: #FAFAF8;
  --color-fg: #18181B;
  --color-muted: #71717A;
  --color-accent: <branch on direction>;

  --font-display: <branch on direction>, system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-micro: ui-monospace, SFMono-Regular, monospace;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-bg: #0A0A0A;
    --color-fg: #FAFAFA;
    --color-muted: #A1A1AA;
  }
}
```
</interfaces>
</context>

<tasks>

<task type="checkpoint:decision" gate="blocking">
  <name>Task 1: Record chosen sketch direction in PROJECT.md Key Decisions</name>
  <files>.planning/PROJECT.md</files>
  <read_first>
    - `.planning/PROJECT.md` lines 73-91 (existing Key Decisions table format)
    - `.planning/sketches/sketch-a-confident-direct.html` (review the rendered direction A)
    - `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` (review the rendered direction B)
  </read_first>
  <decision>Which sketch direction does the production shell adopt — A (Confident & Direct: Inter Tight + warm accent) or B (Engineering-Blog Pragmatic: Crimson Pro + cool accent)?</decision>
  <context>
    Plan 01-02 produced two static-HTML sketches at desktop+mobile widths. The user must pick one before any production typography or palette tokens are written. The choice is locked into PROJECT.md as a Key Decision so future phases inherit the constraint.

    **Direction A — Confident & Direct (warm):**
    - Display: Inter Tight 700
    - Body: Inter 400
    - Accent: `#F59E0B` (warm amber)
    - Background: `#FAFAF8` (near-white)
    - Vibe: declarative, opinionated engineering-company front page

    **Direction B — Engineering-Blog Pragmatic (cool):**
    - Display: Crimson Pro 600 (serif)
    - Body: Inter 400
    - Accent: `#6366F1` (cool indigo)
    - Background: `#FAFAF8` (near-white)
    - Vibe: Stratechery-style essay lede, more setup, more reflective
  </context>
  <options>
    <option id="direction-a">
      <name>Direction A — Confident & Direct (Inter Tight + warm amber)</name>
      <pros>Stronger declarative tone; matches "we built this, here's why it works" voice candidate; cleaner read on small screens; geometric grotesque is forgiving across devices.</pros>
      <cons>Less editorial-feeling than Direction B; warm accent reads slightly more SaaS-marketing if not handled with restraint.</cons>
    </option>
    <option id="direction-b">
      <name>Direction B — Engineering-Blog Pragmatic (Crimson Pro + cool indigo)</name>
      <pros>Strongest editorial signal — serif display reads as essay-like; cool accent is calmer; matches Stratechery anchor reference (D-06).</pros>
      <cons>Crimson Pro hinting on Windows can be soft below 22px; serif display sets a higher bar for body copy quality (Phase 2 risk).</cons>
    </option>
  </options>
  <action>
    Append exactly one row to the Key Decisions table in `.planning/PROJECT.md`. The table starts at line 75 (header) and the last row currently ends at line 90.

    **If user selects direction-a:** insert this row immediately above line 92 (the `## Evolution` header):

    ```markdown
    | Visual direction: Sketch A — Confident & Direct (Inter Tight 700 display + Inter 400 body, warm amber accent #F59E0B on near-white #FAFAF8) | Picked from two-sketch comparison in Phase 1; declarative-claim posture matches voice candidate (1); geometric grotesque is the lower-risk pick for visual-taste-mitigation per PITFALLS.md §Pitfall 7 | — Locked Phase 1 |
    ```

    **If user selects direction-b:** insert this row instead:

    ```markdown
    | Visual direction: Sketch B — Engineering-Blog Pragmatic (Crimson Pro 600 display + Inter 400 body, cool indigo accent #6366F1 on near-white #FAFAF8) | Picked from two-sketch comparison in Phase 1; editorial serif posture matches Stratechery anchor (D-06) and voice candidate (2); accepted Phase 2 risk that serif body copy quality bar is higher | — Locked Phase 1 |
    ```

    Use Edit tool with old_string = the existing final row of the table and new_string = existing final row + newline + the new row, OR Edit tool to insert above the `## Evolution` line. Do NOT rewrite the entire file. Per D-08/D-09, this is the locked direction for the rest of Phase 1.

    After editing, save the chosen direction (A or B) for use by tasks 2-7 — every downstream task branches on it.
  </action>
  <resume-signal>Type "direction-a" or "direction-b" to continue. After the decision, the executor will branch tasks 2-7 on the chosen direction.</resume-signal>
  <verify>
    <automated>grep -E "Visual direction: Sketch [AB]" .planning/PROJECT.md && grep -E "Locked Phase 1" .planning/PROJECT.md</automated>
  </verify>
  <acceptance_criteria>
    - User has selected one of the two options (`direction-a` or `direction-b`) via the resume-signal.
    - `.planning/PROJECT.md` contains exactly one new row matching the regex `Visual direction: Sketch [AB]` (verified by `grep -cE "Visual direction: Sketch [AB]" .planning/PROJECT.md` returning `1`).
    - The new row contains the chosen direction's display typeface name (`Inter Tight` for A, `Crimson Pro` for B).
    - The new row contains the chosen direction's accent hex (`#F59E0B` for A, `#6366F1` for B).
    - The new row's Outcome column contains the literal string `— Locked Phase 1`.
    - The new row sits inside the existing Key Decisions table (above the `## Evolution` header — verified by `grep -n "## Evolution" .planning/PROJECT.md` returning a line number greater than the new row's line number).
    - No other rows in the Key Decisions table have been mutated (the existing table rows are unchanged — verify by spot-checking the rows added in prior commits are still present).
    - The chosen direction (A or B) is recorded in the executor's working state so tasks 2-7 can branch on it.
  </acceptance_criteria>
  <done>
    - `.planning/PROJECT.md` contains exactly one row matching `Visual direction: Sketch [AB]`
    - That row is in the Key Decisions table (above the `## Evolution` header)
    - Outcome column reads `— Locked Phase 1`
    - The chosen direction (A or B) is recorded in the executor's working state for tasks 2-7
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Configure Astro Fonts API for chosen direction in astro.config.mjs</name>
  <files>astro.config.mjs</files>
  <read_first>
    - `astro.config.mjs` (current contents — produced by plan 01-01)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-19 (Astro config requirements)
    - `CLAUDE.md` lines covering Astro Fonts API (the "Astro built-in Fonts API" row)
    - https://docs.astro.build/en/guides/fonts/ (verify the experimental.fonts shape against the installed Astro 6.x version — read the executor's installed `node_modules/astro/package.json` version)
  </read_first>
  <action>
    Edit `astro.config.mjs` to add the `experimental.fonts` config alongside the existing `site`, `output`, and `vite` keys. Branch on the direction picked in task 1:

    **For direction-a (Inter Tight + Inter):**

    ```javascript
    import { defineConfig, fontProviders } from 'astro/config';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      site: 'https://jigspec.com',
      output: 'static',
      vite: {
        plugins: [tailwindcss()],
      },
      experimental: {
        fonts: [
          {
            provider: fontProviders.google(),
            name: 'Inter Tight',
            cssVariable: '--font-display',
            weights: ['700'],
            styles: ['normal'],
            subsets: ['latin'],
            fallbacks: ['system-ui', 'sans-serif'],
          },
          {
            provider: fontProviders.google(),
            name: 'Inter',
            cssVariable: '--font-body',
            weights: ['400', '500'],
            styles: ['normal'],
            subsets: ['latin'],
            fallbacks: ['system-ui', 'sans-serif'],
          },
        ],
      },
    });
    ```

    **For direction-b (Crimson Pro + Inter):**

    ```javascript
    import { defineConfig, fontProviders } from 'astro/config';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      site: 'https://jigspec.com',
      output: 'static',
      vite: {
        plugins: [tailwindcss()],
      },
      experimental: {
        fonts: [
          {
            provider: fontProviders.google(),
            name: 'Crimson Pro',
            cssVariable: '--font-display',
            weights: ['600'],
            styles: ['normal'],
            subsets: ['latin'],
            fallbacks: ['ui-serif', 'Georgia', 'serif'],
          },
          {
            provider: fontProviders.google(),
            name: 'Inter',
            cssVariable: '--font-body',
            weights: ['400', '500'],
            styles: ['normal'],
            subsets: ['latin'],
            fallbacks: ['system-ui', 'sans-serif'],
          },
        ],
      },
    });
    ```

    If `astro.config.mjs` already imports `defineConfig` without `fontProviders`, add `fontProviders` to the existing import. If the existing config uses a different stylistic shape, preserve it and add only the `experimental` block (do NOT rewrite unrelated fields).

    Note (per D-19): only `site`, `output`, `vite.plugins`, and `experimental.fonts` should be present in Phase 1. NO integrations array yet — sitemap/mdx/mermaid arrive in their respective phases.

    Do NOT use the deprecated `@astrojs/tailwind` integration (CLAUDE.md "What NOT to Use").
    Do NOT use `output: 'server'` (CLAUDE.md "What NOT to Use").
    Do NOT install or import `@astrojs/vercel` (deferred per CLAUDE.md).
  </action>
  <verify>
    <automated>npx astro check 2>&1 | grep -v "^#" | tee /tmp/astro-check.log; test "${PIPESTATUS[0]}" = "0" && (grep -q "Inter Tight" astro.config.mjs && ! grep -q "Crimson Pro" astro.config.mjs) || (grep -q "Crimson Pro" astro.config.mjs && ! grep -q "Inter Tight" astro.config.mjs)</automated>
  </verify>
  <acceptance_criteria>
    - `astro.config.mjs` imports `fontProviders` from `'astro/config'` (verified by `grep -q "fontProviders" astro.config.mjs`).
    - `astro.config.mjs` contains the substring `experimental:` AND a `fonts:` array key (verified by `grep -q "experimental" astro.config.mjs` AND `grep -q "fonts:" astro.config.mjs`).
    - `astro.config.mjs` contains exactly two `cssVariable:` declarations: `'--font-display'` AND `'--font-body'` (verified by `grep -c "cssVariable:" astro.config.mjs` returning `2`).
    - For direction A: file contains `'Inter Tight'` AND does NOT contain `'Crimson Pro'` (verified by `grep -q "Inter Tight" astro.config.mjs && ! grep -q "Crimson Pro" astro.config.mjs`).
    - For direction B: file contains `'Crimson Pro'` AND does NOT contain `'Inter Tight'` (verified by `grep -q "Crimson Pro" astro.config.mjs && ! grep -q "Inter Tight" astro.config.mjs`).
    - `output: 'static'` is preserved in the config (verified by `grep -q "output: 'static'" astro.config.mjs`).
    - `vite.plugins` still contains `tailwindcss()` (verified by `grep -q "tailwindcss()" astro.config.mjs`).
    - File does NOT contain `@astrojs/tailwind` (deprecated v3 integration — verified by `! grep -q "@astrojs/tailwind" astro.config.mjs`).
    - File does NOT contain `output: 'server'` (verified by `! grep -q "output: 'server'" astro.config.mjs`).
    - Independent of the existing PIPESTATUS-based verify line, `npx astro check` exits 0 when run directly (verified by `npx astro check; test $? -eq 0`). This is a separate gate from the bash-specific `${PIPESTATUS[0]}` check in `<verify>` so non-bash shells cannot silently pass the task.
    - `npm run build` exits 0 (verified by `npm run build; test $? -eq 0`) — proves the font config is structurally valid and the static build still produces output.
  </acceptance_criteria>
  <done>
    - `astro.config.mjs` imports `fontProviders` from `'astro/config'`
    - `astro.config.mjs` contains an `experimental.fonts` array with exactly two entries (display + body)
    - For direction A: file contains `"Inter Tight"` and does NOT contain `"Crimson Pro"`
    - For direction B: file contains `"Crimson Pro"` and does NOT contain `"Inter Tight"`
    - Both entries set `cssVariable` to `--font-display` and `--font-body` respectively
    - `output: 'static'` is preserved
    - `vite.plugins` still contains `tailwindcss()`
    - `npx astro check` exits 0
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Write Tailwind 4 @theme tokens in src/styles/global.css</name>
  <files>src/styles/global.css</files>
  <read_first>
    - `src/styles/global.css` (current contents — likely just `@import "tailwindcss";` from plan 01-01)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-09, D-10, D-11
    - The existing chosen sketch HTML file (sketch-a or sketch-b in `.planning/sketches/`) for hex value reference
    - https://tailwindcss.com/docs/installation/framework-guides/astro (verify Tailwind 4 @theme syntax)
  </read_first>
  <action>
    Replace the contents of `src/styles/global.css` with the following. Branch on direction:

    **For direction-a:**

    ```css
    @import "tailwindcss";

    @theme {
      /* Palette — ≤4 colors per VISUAL-02 (D-09) */
      --color-bg: #FAFAF8;
      --color-fg: #18181B;
      --color-muted: #71717A;
      --color-accent: #F59E0B;

      /* Type scale — 3 elements per VISUAL-02 (D-08) */
      --font-display: 'Inter Tight', system-ui, sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
      --font-micro: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    /* Dark mode via prefers-color-scheme (D-10: media strategy, no toggle UI) */
    /* Dark palette is auto-derived per D-11 — validated visually only in Phase 4 */
    @media (prefers-color-scheme: dark) {
      @theme {
        --color-bg: #0A0A0A;
        --color-fg: #FAFAFA;
        --color-muted: #A1A1AA;
        /* --color-accent unchanged per D-11 (auto-derivation, validate Phase 4) */
      }
    }

    /* Base resets (kept minimal — Tailwind 4 preflight handles most) */
    html {
      font-family: var(--font-body);
      background-color: var(--color-bg);
      color: var(--color-fg);
    }
    ```

    **For direction-b:**

    ```css
    @import "tailwindcss";

    @theme {
      /* Palette — ≤4 colors per VISUAL-02 (D-09) */
      --color-bg: #FAFAF8;
      --color-fg: #18181B;
      --color-muted: #71717A;
      --color-accent: #6366F1;

      /* Type scale — 3 elements per VISUAL-02 (D-08) */
      --font-display: 'Crimson Pro', ui-serif, Georgia, serif;
      --font-body: 'Inter', system-ui, sans-serif;
      --font-micro: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    /* Dark mode via prefers-color-scheme (D-10: media strategy, no toggle UI) */
    /* Dark palette is auto-derived per D-11 — validated visually only in Phase 4 */
    @media (prefers-color-scheme: dark) {
      @theme {
        --color-bg: #0A0A0A;
        --color-fg: #FAFAFA;
        --color-muted: #A1A1AA;
        /* --color-accent unchanged per D-11 (auto-derivation, validate Phase 4) */
      }
    }

    /* Base resets (kept minimal — Tailwind 4 preflight handles most) */
    html {
      font-family: var(--font-body);
      background-color: var(--color-bg);
      color: var(--color-fg);
    }
    ```

    Note: per D-10, dark mode is `prefers-color-scheme`, NOT `class`-based. Do NOT add a `darkMode: 'class'` config or a toggle button. The `data-theme` attribute on `<html>` (set in Base.astro) is plumbing for Phase 4 visual validation — Tailwind 4 doesn't strictly require it, but Mermaid (Phase 4) reads it directly.

    Total non-comment colors in the `@theme` block (light) = 4 exactly (`bg`, `fg`, `muted`, `accent`). Verify by `grep -E "^\s*--color-" src/styles/global.css | grep -v "^[[:space:]]*/\*" | head -8` returns exactly 4 lines for the light scope and 3 for the dark scope (no accent override).
  </action>
  <verify>
    <automated>grep -q "@import \"tailwindcss\"" src/styles/global.css && grep -q "@theme" src/styles/global.css && grep -q "\-\-color-bg:" src/styles/global.css && grep -q "\-\-color-fg:" src/styles/global.css && grep -q "\-\-color-muted:" src/styles/global.css && grep -q "\-\-color-accent:" src/styles/global.css && grep -q "\-\-font-display:" src/styles/global.css && grep -q "\-\-font-body:" src/styles/global.css && grep -q "\-\-font-micro:" src/styles/global.css && grep -q "prefers-color-scheme: dark" src/styles/global.css && [ "$(grep -E "^\s*--color-(bg|fg|muted|accent):" src/styles/global.css | grep -v "^\s*/\*" | wc -l | tr -d ' ')" -le 7 ] && (grep -q "#F59E0B" src/styles/global.css || grep -q "#6366F1" src/styles/global.css)</automated>
  </verify>
  <acceptance_criteria>
    - `src/styles/global.css` opens with `@import "tailwindcss"` (verified by `head -1 src/styles/global.css | grep -q '@import "tailwindcss"'`).
    - File contains `@theme` (verified by `grep -q "@theme" src/styles/global.css`).
    - File contains all four palette tokens: `--color-bg:`, `--color-fg:`, `--color-muted:`, `--color-accent:` (each verified by an individual grep).
    - File contains all three type-scale tokens: `--font-display:`, `--font-body:`, `--font-micro:` (each verified by an individual grep).
    - For direction A: file contains the literal `--color-accent: #F59E0B` AND `'Inter Tight'` (verified by `grep -q "color-accent: #F59E0B" src/styles/global.css && grep -q "Inter Tight" src/styles/global.css`).
    - For direction B: file contains the literal `--color-accent: #6366F1` AND `'Crimson Pro'` (verified by `grep -q "color-accent: #6366F1" src/styles/global.css && grep -q "Crimson Pro" src/styles/global.css`).
    - File does NOT contain `emerald` (case-insensitive — distinct from buggerd; verified by `! grep -qi "emerald" src/styles/global.css`).
    - File contains a `@media (prefers-color-scheme: dark)` block (verified by `grep -q "prefers-color-scheme: dark" src/styles/global.css`).
    - The dark-mode block overrides exactly three of the four palette tokens (`--color-bg`, `--color-fg`, `--color-muted`) and does NOT override `--color-accent` (verified by reading the dark block and confirming no `--color-accent` line appears between its `{` and `}`).
    - Total non-comment `--color-*` declarations across the entire file is at most 7 (4 light + 3 dark overrides — verified by the existing `<verify>` shell pipeline).
    - File does NOT contain `darkMode: 'class'` (verified by `! grep -q "darkMode: 'class'" src/styles/global.css`).
  </acceptance_criteria>
  <done>
    - `src/styles/global.css` opens with `@import "tailwindcss";`
    - Contains an `@theme` block with exactly 4 `--color-*` declarations in light scope (`bg`, `fg`, `muted`, `accent`)
    - Contains exactly 3 `--font-*` declarations (`display`, `body`, `micro`)
    - For direction A: `--color-accent: #F59E0B` and display font is `'Inter Tight'`
    - For direction B: `--color-accent: #6366F1` and display font is `'Crimson Pro'`
    - Contains a `@media (prefers-color-scheme: dark)` block overriding `--color-bg`, `--color-fg`, `--color-muted` (and explicitly NOT `--color-accent`)
    - No `darkMode: 'class'` configuration anywhere
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Write src/layouts/Base.astro with HTML shell, font loading, data-theme plumbing</name>
  <files>src/layouts/Base.astro</files>
  <read_first>
    - `src/layouts/Base.astro` (may not exist yet — check first with `ls src/layouts/`)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-23 (component layout spec)
    - `astro.config.mjs` (just edited in task 2 — confirm font cssVariable names match)
    - https://docs.astro.build/en/guides/fonts/ (confirm `<Font>` import path for installed Astro 6.x)
  </read_first>
  <action>
    Create the directory if needed (`mkdir -p src/layouts`), then write the full file contents below verbatim:

    ```astro
    ---
    import { Font } from 'astro:assets';
    import '../styles/global.css';

    interface Props {
      title?: string;
      description?: string;
    }

    const {
      title = 'JigSpec',
      description = 'JigSpec — agentic AI that ships. The company-level studio behind the .pipe.yaml spec and products like buggerd.',
    } = Astro.props;
    ---

    <!doctype html>
    <html lang="en" data-theme="auto">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="generator" content={Astro.generator} />
        <title>{title}</title>

        <!-- Self-hosted via Astro Fonts API (TECH-05: zero external font CDN) -->
        <Font cssVariable="--font-display" preload />
        <Font cssVariable="--font-body" preload />

        <!--
          Plumbing for Phase 4 dark-mode validation (D-10, D-11).
          Tailwind 4 already drives palette via @media (prefers-color-scheme: dark) in global.css.
          This script just reflects the user's preference into a data-theme attribute so
          Mermaid (Phase 4) can read it without a second media query.
        -->
        <script is:inline>
          (function () {
            try {
              const mq = window.matchMedia('(prefers-color-scheme: dark)');
              const apply = () => {
                document.documentElement.setAttribute(
                  'data-theme',
                  mq.matches ? 'dark' : 'light'
                );
              };
              apply();
              mq.addEventListener('change', apply);
            } catch (e) {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          })();
        </script>
      </head>
      <body class="bg-[var(--color-bg)] text-[var(--color-fg)] font-[var(--font-body)] antialiased min-h-screen flex flex-col">
        <slot />
      </body>
    </html>
    ```

    Notes:
    - `is:inline` on the script tag is REQUIRED per CLAUDE.md (Astro processes/bundles scripts by default; `is:inline` keeps it as-is in `<head>` so it runs before paint and avoids FOUC on theme).
    - `<html data-theme="auto">` initial value is overridden by the inline script before paint.
    - `min-h-screen flex flex-col` on `<body>` lets a future Footer stick to the bottom on short pages without extra wiring.
    - Do NOT add `<link rel="stylesheet" href="...">` for fonts — the `<Font>` component handles preload + CSS injection.
    - Do NOT add Google Fonts CDN links anywhere (TECH-05).
  </action>
  <verify>
    <automated>test -f src/layouts/Base.astro && grep -q 'data-theme' src/layouts/Base.astro && grep -q '<slot' src/layouts/Base.astro && grep -q 'cssVariable="--font-display"' src/layouts/Base.astro && grep -q 'cssVariable="--font-body"' src/layouts/Base.astro && grep -q 'is:inline' src/layouts/Base.astro && grep -q "import '../styles/global.css'" src/layouts/Base.astro && ! grep -q "fonts.googleapis.com\|fonts.gstatic.com" src/layouts/Base.astro</automated>
  </verify>
  <acceptance_criteria>
    - `src/layouts/Base.astro` exists (verified by `test -f src/layouts/Base.astro`).
    - File contains `data-theme` on the `<html>` element (verified by `grep -q '<html.*data-theme' src/layouts/Base.astro` OR by `grep -q 'data-theme' src/layouts/Base.astro` since the only `data-theme` in the file is on the html element).
    - File contains `<slot` (slot for page content — verified by `grep -q '<slot' src/layouts/Base.astro`).
    - File contains `prefers-color-scheme` (the inline script reading dark/light preference — verified by `grep -q "prefers-color-scheme" src/layouts/Base.astro`).
    - File imports the `Font` component from `astro:assets` (verified by `grep -q "import { Font } from 'astro:assets'" src/layouts/Base.astro`).
    - File contains exactly two `<Font cssVariable=` invocations: one for `--font-display` and one for `--font-body` (verified by `grep -c '<Font cssVariable=' src/layouts/Base.astro` returning `2`).
    - File contains an `is:inline` script tag (verified by `grep -q 'is:inline' src/layouts/Base.astro`).
    - File imports `'../styles/global.css'` (verified by `grep -q "import '../styles/global.css'" src/layouts/Base.astro`).
    - File does NOT reference `fonts.googleapis.com` (verified by `! grep -q "fonts.googleapis.com" src/layouts/Base.astro`).
    - File does NOT reference `fonts.gstatic.com` (verified by `! grep -q "fonts.gstatic.com" src/layouts/Base.astro`).
    - File does NOT contain any `<link rel="stylesheet"` tag pointing at an external font CDN (TECH-05 — verified by `! grep -q "rel=\"stylesheet\".*fonts\\." src/layouts/Base.astro`).
  </acceptance_criteria>
  <done>
    - `src/layouts/Base.astro` exists
    - Contains `<html lang="en" data-theme=` (initial attribute present)
    - Contains `<slot />`
    - Contains exactly two `<Font cssVariable="..."` invocations (display + body)
    - Contains an `is:inline` script that reads `prefers-color-scheme` and sets `data-theme`
    - Imports `'../styles/global.css'`
    - Contains NO references to `fonts.googleapis.com` or `fonts.gstatic.com`
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 5: Write src/components/global/Nav.astro with wordmark + 3 anchor links + mobile hamburger</name>
  <files>src/components/global/Nav.astro</files>
  <read_first>
    - `src/components/global/Nav.astro` (likely doesn't exist; check with `ls src/components/global/`)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-23, D-25 (mobile breakpoint spec)
    - The chosen sketch HTML for any specific nav treatment cues
  </read_first>
  <action>
    Create the directory if needed (`mkdir -p src/components/global`), then write the full file contents below verbatim:

    ```astro
    ---
    // Phase 1 nav: text wordmark + 3 placeholder anchor links + mobile hamburger.
    // Anchors point at non-existent sections; Phase 2 will populate the targets.
    // Per D-23, NO logo SVG in v1 — text wordmark only.
    // Per D-25, mobile collapse below md (768px), Tailwind defaults only.
    const links = [
      { href: '#products', label: 'Products' },
      { href: '#docs', label: 'Docs' },
      { href: '#about', label: 'About' },
    ];
    ---

    <header class="border-b border-[var(--color-muted)]/20">
      <nav class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between" aria-label="Primary">
        <!-- Wordmark -->
        <a href="/" class="font-[var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)]">
          JigSpec
        </a>

        <!-- Desktop links (visible md and up) -->
        <ul class="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li>
              <a
                href={link.href}
                class="text-sm text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <!-- Mobile hamburger (visible below md) -->
        <button
          id="nav-toggle"
          type="button"
          class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded text-[var(--color-fg)] hover:bg-[var(--color-muted)]/10"
          aria-label="Toggle menu"
          aria-expanded="false"
          aria-controls="nav-mobile-menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </nav>

      <!-- Mobile menu (hidden by default; toggled below md only) -->
      <ul
        id="nav-mobile-menu"
        class="md:hidden hidden flex-col gap-2 px-6 pb-5 border-t border-[var(--color-muted)]/20"
      >
        {links.map((link) => (
          <li>
            <a
              href={link.href}
              class="block py-2 text-base text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </header>

    <script>
      const toggle = document.getElementById('nav-toggle');
      const menu = document.getElementById('nav-mobile-menu');
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          const open = menu.classList.contains('hidden') === false;
          if (open) {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      }
    </script>
    ```

    Notes:
    - Astro processes the `<script>` block by default — that's fine here (it's logic, not theme-bootstrap).
    - The mobile menu uses `hidden` (display:none) ↔ `flex` (display:flex) toggle. The `flex-col gap-2` is permanent; only display visibility flips.
    - `aria-expanded` is updated on toggle for accessibility.
    - The 3 anchor links are placeholders per D-23 — Phase 2 wires actual sections.
    - Do NOT add a logo SVG or image (D-23: text-only wordmark in v1).
    - Do NOT animate the menu open/close — animations are deferred (Phase 4 polish, see CONTEXT.md `<deferred>`).
  </action>
  <verify>
    <automated>test -f src/components/global/Nav.astro && grep -q 'JigSpec' src/components/global/Nav.astro && grep -q 'md:hidden' src/components/global/Nav.astro && grep -q 'md:flex' src/components/global/Nav.astro && grep -q 'aria-expanded' src/components/global/Nav.astro && grep -q "addEventListener('click'" src/components/global/Nav.astro && grep -q 'nav-toggle' src/components/global/Nav.astro && grep -c '#products\|#docs\|#about' src/components/global/Nav.astro | awk '{ if ($1 < 2) exit 1 }'</automated>
  </verify>
  <acceptance_criteria>
    - `src/components/global/Nav.astro` exists (verified by `test -f src/components/global/Nav.astro`).
    - File contains the wordmark text `JigSpec` (verified by `grep -q 'JigSpec' src/components/global/Nav.astro`).
    - File contains `md:hidden` (hamburger button visible only below md=768px — verified by `grep -q 'md:hidden' src/components/global/Nav.astro`).
    - File contains `md:flex` (inline links visible at md+ — verified by `grep -q 'md:flex' src/components/global/Nav.astro`).
    - File contains an `id="nav-toggle"` button with `aria-expanded` and `aria-controls` (verified by `grep -q 'id="nav-toggle"' src/components/global/Nav.astro && grep -q 'aria-expanded' src/components/global/Nav.astro && grep -q 'aria-controls' src/components/global/Nav.astro`).
    - File contains an `id="nav-mobile-menu"` ul (verified by `grep -q 'id="nav-mobile-menu"' src/components/global/Nav.astro`).
    - File contains a `<script>` tag (vanilla JS for hamburger toggle — no React/Alpine — verified by `grep -q '<script' src/components/global/Nav.astro`).
    - File contains `addEventListener('click'` (toggle wiring — verified by `grep -q "addEventListener('click'" src/components/global/Nav.astro`).
    - File contains the three anchor href targets `#products`, `#docs`, `#about`, each appearing at least twice (once in desktop list, once in mobile list — verified by `grep -c '#products' src/components/global/Nav.astro | awk '{ if ($1 < 2) exit 1 }'` and same for `#docs` and `#about`); equivalently the file contains at least 6 anchor `<a` tags whose href starts with `#`.
    - File does NOT contain `<img` for the wordmark and does NOT reference any logo SVG file (verified by `! grep -q '<img' src/components/global/Nav.astro` AND `! grep -q 'logo\\.\\(svg\\|png\\|jpg\\)' src/components/global/Nav.astro`).
  </acceptance_criteria>
  <done>
    - `src/components/global/Nav.astro` exists
    - Contains the wordmark text `JigSpec`
    - Contains both `md:hidden` (mobile-only elements) and `md:flex` (desktop-only ul) classes
    - Contains an `id="nav-toggle"` button with `aria-expanded` and `aria-controls`
    - Contains an `id="nav-mobile-menu"` ul
    - Contains a `<script>` block with `addEventListener('click', ...)` toggling menu visibility
    - Contains all 3 anchor links: `#products`, `#docs`, `#about` (each appears at least twice — once in desktop list, once in mobile list)
    - Contains NO SVG logo file references and NO `<img>` tags for the wordmark
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 6: Write src/components/global/Footer.astro with docs/contact/copyright/GitHub</name>
  <files>src/components/global/Footer.astro</files>
  <read_first>
    - `src/components/global/Footer.astro` (likely doesn't exist; check with `ls src/components/global/`)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-23 (footer content spec)
  </read_first>
  <action>
    Write the full file contents below verbatim:

    ```astro
    ---
    // Phase 1 footer: docs link, contact email, copyright, GitHub org link.
    // Per D-23, all four required. The honesty constraint applies — no fake "trusted by".
    const year = new Date().getFullYear();
    ---

    <footer class="mt-auto border-t border-[var(--color-muted)]/20">
      <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>&copy; {year} JigSpec</p>
        <ul class="flex flex-wrap items-center gap-6">
          <li>
            <a
              href="https://jigspec.com"
              class="hover:text-[var(--color-accent)] transition-colors"
            >
              Docs
            </a>
          </li>
          <li>
            <a
              href="mailto:hi@jigspec.com"
              class="hover:text-[var(--color-accent)] transition-colors"
            >
              hi@jigspec.com
            </a>
          </li>
          <li>
            <a
              href="https://github.com/JigSpec"
              rel="noopener"
              class="hover:text-[var(--color-accent)] transition-colors"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
    ```

    Notes:
    - The `mt-auto` on `<footer>` combined with `min-h-screen flex flex-col` on `<body>` (Base.astro) makes the footer stick to the bottom on short pages.
    - `&copy; {year}` uses `new Date().getFullYear()` so the year auto-updates — at build time since output is `static`. It will read 2026 in this build.
    - `mailto:` link is correct per D-23 ("contact email placeholder"); the address `hi@jigspec.com` is consistent with the JigSpec org's apex domain.
    - Docs link points to `https://jigspec.com` (current VitePress docs apex per D-19 / PROJECT.md "interim location until cutover phase"); will move to `docs.jigspec.com` in the cutover phase, but Phase 1 leaves it pointing at the existing docs.
    - `rel="noopener"` on the GitHub external link only (the docs link is same-future-domain, mailto needs no rel).
  </action>
  <verify>
    <automated>test -f src/components/global/Footer.astro && grep -q 'github.com/JigSpec' src/components/global/Footer.astro && grep -q 'hi@jigspec.com' src/components/global/Footer.astro && grep -q 'getFullYear()' src/components/global/Footer.astro && grep -q 'href="https://jigspec.com"' src/components/global/Footer.astro</automated>
  </verify>
  <acceptance_criteria>
    - `src/components/global/Footer.astro` exists (verified by `test -f src/components/global/Footer.astro`).
    - File contains `github.com/JigSpec` (GitHub org link — verified by `grep -q 'github.com/JigSpec' src/components/global/Footer.astro`).
    - File contains a 2026 copyright signal: either the literal `2026` or a `getFullYear()` build-time computation (verified by `grep -q '2026' src/components/global/Footer.astro || grep -q 'getFullYear()' src/components/global/Footer.astro`); the `getFullYear()` form is preferred and will resolve to `2026` in the current build.
    - File contains a contact email matching the `*@jigspec.com` pattern (verified by `grep -qE '[a-zA-Z0-9._%+-]+@jigspec\.com' src/components/global/Footer.astro`); the canonical address is `hi@jigspec.com`.
    - File contains the docs URL `jigspec.com` (verified by `grep -q 'jigspec.com' src/components/global/Footer.astro`); specifically the docs anchor sets `href="https://jigspec.com"` (verified by `grep -q 'href="https://jigspec.com"' src/components/global/Footer.astro`).
    - File contains a `mailto:` anchor (verified by `grep -q 'mailto:' src/components/global/Footer.astro`).
    - File contains exactly four required footer items (copyright, docs, contact email, GitHub): verified by `grep -c '<a ' src/components/global/Footer.astro` returning at least `3` (the three external/mailto links) and the copyright `<p>` tag being present (`grep -q '&copy;' src/components/global/Footer.astro`).
    - The GitHub external link has `rel="noopener"` (verified by `grep -A2 'github.com/JigSpec' src/components/global/Footer.astro | grep -q 'rel="noopener"'`).
  </acceptance_criteria>
  <done>
    - `src/components/global/Footer.astro` exists
    - Contains `https://github.com/JigSpec` (GitHub org link)
    - Contains `mailto:hi@jigspec.com` (contact email)
    - Contains `https://jigspec.com` (docs link — interim per D-23)
    - Contains `getFullYear()` (so copyright year auto-updates)
    - Renders all four required elements: docs link, contact email, copyright, GitHub link
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 7: Overwrite src/pages/index.astro with composition-only shell</name>
  <files>src/pages/index.astro</files>
  <read_first>
    - `src/pages/index.astro` (current contents — likely Astro scaffold default from plan 01-01)
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-24 (composition-only spec)
  </read_first>
  <action>
    Replace the entire contents of `src/pages/index.astro` with this exact file:

    ```astro
    ---
    import Base from '../layouts/Base.astro';
    import Nav from '../components/global/Nav.astro';
    import Footer from '../components/global/Footer.astro';
    ---

    <Base
      title="JigSpec — coming soon"
      description="JigSpec is the company behind agentic AI products that ship. Site under construction."
    >
      <Nav />
      <main class="flex-1 px-6 py-32 max-w-3xl mx-auto">
        <h1 class="font-[var(--font-display)] text-5xl md:text-6xl tracking-tight text-[var(--color-fg)]">
          JigSpec — coming soon
        </h1>
        <p class="mt-6 text-lg text-[var(--color-muted)]">
          The company-level marketing site is under construction. Real content lands in Phase 2.
        </p>
      </main>
      <Footer />
    </Base>
    ```

    Per D-24, this page is composition-only:
    - Base wraps Nav + main + Footer
    - The single `<h1>` is the placeholder
    - One supporting `<p>` is allowed (PROJECT.md tone — no breathless claims; this is a transparent under-construction note)
    - NO hero, NO product cards, NO sections, NO diagram placeholder, NO form

    The `flex-1` on `<main>` works with `min-h-screen flex flex-col` on `<body>` to push the footer to the bottom on short viewports.

    Do NOT import Mermaid, PostHog, or any Phase 3/4 dependency here.
    Do NOT add a hero section even if it would look more "complete" — D-24 explicitly forbids it.
  </action>
  <verify>
    <automated>test -f src/pages/index.astro && grep -q 'import Base from' src/pages/index.astro && grep -q '<Base' src/pages/index.astro && grep -q '<Nav' src/pages/index.astro && grep -q '<Footer' src/pages/index.astro && grep -q '<h1' src/pages/index.astro && grep -q 'coming soon' src/pages/index.astro && ! grep -q 'product-card\|<section.*products\|posthog\|mermaid' src/pages/index.astro</automated>
  </verify>
  <acceptance_criteria>
    - `src/pages/index.astro` exists (verified by `test -f src/pages/index.astro`).
    - File contains `import Base from` AND `<Base` (layout wrapper — verified by `grep -q 'import Base from' src/pages/index.astro && grep -q '<Base' src/pages/index.astro`).
    - File contains `<Nav` (verified by `grep -q '<Nav' src/pages/index.astro`).
    - File contains `<Footer` (verified by `grep -q '<Footer' src/pages/index.astro`).
    - File contains `<h1` (placeholder headline — verified by `grep -q '<h1' src/pages/index.astro`).
    - File contains `coming soon` (placeholder copy per D-24 — verified by `grep -q 'coming soon' src/pages/index.astro`).
    - File does NOT contain `<section` (no hero/cards/sections — Phase 1 is shell-only per D-24; verified by `! grep -q '<section' src/pages/index.astro`).
    - File does NOT contain `<form` (no email capture in Phase 1 — verified by `! grep -q '<form' src/pages/index.astro`).
    - File does NOT contain `posthog` or `mermaid` (Phase 3/4 dependencies — verified by `! grep -qi 'posthog\|mermaid' src/pages/index.astro`).
    - File contains at most one `<h1` and at most one `<p` outside the Base/Nav/Footer composition (a single placeholder headline and a single supporting note — verified by `grep -c '<h1' src/pages/index.astro` returning `1`).
  </acceptance_criteria>
  <done>
    - `src/pages/index.astro` exists and was overwritten (not appended to)
    - Contains imports for `Base`, `Nav`, `Footer` from their respective paths
    - Contains `<Base>` wrapper, `<Nav />`, `<h1>` with text "coming soon", and `<Footer />`
    - Contains NO `<section>` for products, NO `<form>`, NO Mermaid integration, NO PostHog calls
    - File is composition-only per D-24
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 8: Distinct-from-buggerd guard + build/check sweep</name>
  <files>(verification only — no file modifications)</files>
  <read_first>
    - All files modified in tasks 2-7
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` (VISUAL-03 cross-reference)
    - `/Users/kjs/Documents/Business/Buggerd/index.html` (the comparator we must read distinct from)
  </read_first>
  <action>
    Run the four guard checks in sequence. Each is a hard gate; if any fails, STOP and surface to the user before continuing to task 9 (the human verification checkpoint).

    1. **Distinct-from-buggerd typeface guard (VISUAL-03):**
       ```
       grep -ril "ui-monospace" src/ astro.config.mjs
       ```
       Expected: only `src/styles/global.css` (the `--font-micro` declaration is allowed — it's the fallback for code/monospace use, not the body or display face). If any *other* file matches, the guard fails. The display and body faces are NOT monospace by construction (Inter Tight / Crimson Pro / Inter), so this check is effectively asserting we didn't accidentally `font-mono` the body.

       ```
       ! grep -rn "font-mono" src/
       ```
       Expected: zero matches. (We don't use Tailwind's `font-mono` utility on the body or display — `--font-micro` only exists for inline code if/when added.)

    2. **Distinct-from-buggerd accent guard (VISUAL-03):**
       ```
       ! grep -rn "emerald-600\|emerald-500\|#10B981\|#059669" src/ astro.config.mjs
       ```
       Expected: zero matches. Emerald is buggerd's accent. This site uses warm amber (direction A) or cool indigo (direction B).

    3. **Type check + build:**
       ```
       npx astro check
       ```
       Expected: exit code 0, no errors.

       ```
       npm run build
       ```
       Expected: exit code 0, `dist/` directory created with `index.html` inside.

    4. **CSS @theme sanity:**
       ```
       grep -E "^\s*--color-" src/styles/global.css | grep -v "^\s*/\*" | wc -l
       ```
       Expected: at most 7 (4 light + 3 dark overrides). More than 7 indicates the palette has crept past the ≤4-color budget.

    If any guard fails, fix the offending file and rerun. Do NOT proceed to task 9 until all four guards pass.
  </action>
  <verify>
    <automated>npx astro check && npm run build && test -f dist/index.html && ! grep -rn "emerald-600\|emerald-500\|#10B981\|#059669" src/ astro.config.mjs && ! grep -rn "font-mono" src/ && [ "$(grep -E "^\s*--color-" src/styles/global.css | grep -v "^\s*/\*" | wc -l | tr -d ' ')" -le 7 ]</automated>
  </verify>
  <acceptance_criteria>
    - No file under `src/` (case-insensitive) contains the literal `ui-monospace` outside of `src/styles/global.css` (the `--font-micro` fallback declaration is the only allowed occurrence — verified by `grep -ril "ui-monospace" src/` returning at most `src/styles/global.css`).
    - No file under `src/` contains the Tailwind utility `font-mono` (verified by `! grep -rn "font-mono" src/`).
    - No file under `src/` or `astro.config.mjs` contains the buggerd emerald markers `emerald-600`, `emerald-500`, `#10B981`, or `#059669` (each verified by `! grep -rn '<token>' src/ astro.config.mjs`).
    - `npx astro check` exits 0 (verified by `npx astro check; test $? -eq 0`).
    - `npm run build` exits 0 (verified by `npm run build; test $? -eq 0`).
    - `dist/` directory exists after the build (verified by `test -d dist`).
    - `dist/index.html` exists after the build (verified by `test -f dist/index.html`).
    - The total count of `--color-*` declarations across `src/styles/global.css` is at most 7 (4 light + 3 dark overrides, no accent override — verified by the existing `<verify>` shell pipeline).
  </acceptance_criteria>
  <done>
    - `npx astro check` exits 0
    - `npm run build` exits 0
    - `dist/index.html` exists (proves the static build pipeline produces output)
    - No `emerald-600`, `emerald-500`, `#10B981`, or `#059669` in `src/` or `astro.config.mjs`
    - No `font-mono` Tailwind class in `src/`
    - At most 7 `--color-*` declarations across the entire `global.css` (light scope + dark overrides)
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 9: Manual responsive verification at 320 / 375 / 414 / 1280</name>
  <files>
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-320.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-375.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-414.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-1280.png
  </files>
  <read_first>
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` D-25 (manual verification at 320/375/414/desktop, no test framework)
    - `.planning/REQUIREMENTS.md` VISUAL-04 (responsive legibility requirement)
  </read_first>
  <what-built>
    Production Astro shell with:
    - Self-hosted typography (chosen direction's display + body faces) via Astro Fonts API
    - Tailwind 4 `@theme` palette (≤4 colors) and 3-element type scale
    - `Base.astro` document shell with `data-theme` plumbing
    - `Nav.astro` with text wordmark + 3 anchor links + mobile hamburger (collapses below 768px)
    - `Footer.astro` with docs/contact/copyright/GitHub
    - `index.astro` rendering only `<h1>JigSpec — coming soon</h1>` + supporting `<p>` inside the shell
  </what-built>
  <how-to-verify>
    Before this checkpoint, the executor must:

    1. Start dev server in the background:
       ```
       npm run dev
       ```
       Wait for "Local: http://localhost:4321" (or whatever port Astro picks).

    2. Create the screenshots directory:
       ```
       mkdir -p .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots
       ```

    3. Capture screenshots at each viewport using Chrome DevTools MCP (preferred) or Playwright if available. Save to:
       - `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-320.png` (iPhone SE-class)
       - `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-375.png` (iPhone standard)
       - `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-414.png` (iPhone Plus / Android large)
       - `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-1280.png` (laptop)

       For each: full-page screenshot with the dev URL loaded, viewport set to the listed width × 800 height (height isn't critical; full-page capture handles it).

    4. Stop the dev server when done.

    Then ask the user to verify (using the captured screenshots inline in chat):

    **At 320, 375, 414 (mobile):**
    - The hamburger button is visible in the top-right of the nav
    - The 3 desktop links (`Products`, `Docs`, `About`) are NOT visible inline
    - The `JigSpec` wordmark is visible top-left
    - The `<h1>` "JigSpec — coming soon" is legible, doesn't overflow horizontally, doesn't wrap awkwardly mid-word
    - The footer is visible at the bottom (or after scroll), and its three items (`Docs`, `hi@jigspec.com`, `GitHub`) stack/wrap reasonably
    - Tap the hamburger → mobile menu opens vertically with the 3 links

    **At 1280 (desktop):**
    - The 3 nav links (`Products`, `Docs`, `About`) are visible inline in the top-right
    - The hamburger button is NOT visible
    - The `<h1>` is large and dominant (text-5xl or text-6xl)
    - The page has comfortable horizontal padding (page does not feel edge-to-edge)
    - The footer is at the bottom, its three items in a single row

    **Visual identity sanity (all viewports):**
    - The chosen direction's typography is visible (if direction A: geometric grotesque headline; if direction B: serif headline)
    - The chosen direction's accent color is visible on link hover (warm amber for A, cool indigo for B)
    - The aesthetic does NOT read as a buggerd derivative (no monospace headline, no emerald accent, no zinc/dark dense layout)
  </how-to-verify>
  <verify>
    <automated>test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-320.png && test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-375.png && test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-414.png && test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-1280.png</automated>
  </verify>
  <acceptance_criteria>
    - All four PNG files exist on disk: `verification-screenshots/dev-320.png`, `dev-375.png`, `dev-414.png`, `dev-1280.png` (verified by `test -f` for each path).
    - Each file is non-empty (verified by `test -s <path>` for each — empty PNGs would indicate a failed capture).
    - User has replied to the resume-signal with `approved` (or an explicit issue description that triggers a revision loop).
    - User confirms (in their resume-signal reply) that nav collapses to a hamburger button at the 320, 375, and 414 viewports (no inline `Products`/`Docs`/`About` links visible at these widths).
    - User confirms that nav shows inline `Products`/`Docs`/`About` links at 1280, and the hamburger button is not visible at that width.
    - User confirms that the `<h1>` "JigSpec — coming soon" is legible at all four widths: no horizontal overflow at 320, no awkward mid-word wrap at 320/375/414, and dominant (text-5xl/6xl) at 1280.
    - User confirms that the footer is visible at all widths and its three items (`Docs`, `hi@jigspec.com`, `GitHub`) render reasonably (stacked/wrapped at mobile widths, single row at 1280).
    - User confirms the visual identity does NOT read as a buggerd derivative: no monospace headline, no emerald accent, no zinc/dark dense layout.
    - User confirms the chosen direction's accent color is visible on link hover (warm amber `#F59E0B` for direction A, cool indigo `#6366F1` for direction B).
  </acceptance_criteria>
  <resume-signal>Type "approved" once all five visual checks pass at all four viewports. If any check fails, describe the failure (e.g., "h1 wraps mid-word at 320", "hamburger missing at 414", "accent looks emerald-adjacent") and the executor will revise.</resume-signal>
  <done>
    - All four screenshot PNGs exist in `verification-screenshots/`
    - User confirmed nav collapses to hamburger below 768px
    - User confirmed nav shows inline links at 1280
    - User confirmed h1 is legible at 320 (no overflow, no awkward wrap)
    - User confirmed footer renders all three items at all viewports
    - User confirmed visual identity does NOT read as buggerd-derivative
    - User typed "approved"
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| user browser → static site | Untrusted client renders our HTML/CSS/JS. No backend in v1. |
| user browser → Google Fonts (build-time only) | Build pipeline fetches font files from Google Fonts at build time via Astro Fonts API; runtime serves them same-origin. |
| browser DOM → inline theme script | The `is:inline` script in Base.astro reads `prefers-color-scheme` and writes `data-theme`. No user input crosses this boundary. |
| browser DOM → Nav toggle script | The Nav.astro toggle script reads click events and toggles class names. No user input flows to executable contexts. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-03-01 | Tampering | Astro Fonts API build-time fetch | accept | Build-time only; output is hashed and committed in `dist/`. Vercel deploy is from same git commit; SRI not applicable for same-origin self-hosted assets. |
| T-01-03-02 | Information Disclosure | inline theme script | accept | Reads `prefers-color-scheme` only. No PII; no cross-origin. |
| T-01-03-03 | Tampering | Nav toggle script class manipulation | accept | Operates only on element IDs scoped to the component; no innerHTML writes; no eval; no user-supplied content reaches the DOM in v1 (no forms in this plan). |
| T-01-03-04 | Spoofing | Footer external links (`https://github.com/JigSpec`) | mitigate | `rel="noopener"` on external link to GitHub prevents `window.opener` access. mailto + same-future-domain links don't need rel. |
| T-01-03-05 | Elevation of Privilege | Tailwind `@theme` arbitrary values via `[var(--...)]` | accept | Tailwind 4 evaluates `[var(--color-bg)]` at build time; the variable name space is locked by `global.css` (which is committed). No user-controlled CSS. |
| T-01-03-06 | Denial of Service | Font preload size | accept | `<Font preload>` for 2 faces × 1-2 weights = ~50-100KB total, well under typical perf budget. Font subsetting (`subsets: ['latin']`) limits payload. |
| T-01-03-07 | Information Disclosure | `<html data-theme>` attribute | accept | Reflects only OS-level color preference, which is already client-side state. Phase 4 dark-mode validation will confirm Mermaid reads it without leaking other state. |
| T-01-03-08 | Tampering | Future Phase 4 dark-mode injection point | mitigate | The inline theme script is `is:inline` so it's not bundled — easier to audit. Phase 4 should NOT replace it with a bundled equivalent without re-reviewing this register. |

CSP enforcement happens in `vercel.json` (plan 01-04). The Phase 1 vercel.json already allowlists self for fonts/scripts/styles, which covers the surface of this plan.
</threat_model>

<verification>
After all tasks complete, run the full sweep:

```bash
npx astro check                                                  # exit 0
npm run build                                                    # exit 0
test -d dist && test -f dist/index.html                          # static output
grep -q "Visual direction: Sketch" .planning/PROJECT.md          # decision recorded
grep -q "@theme" src/styles/global.css                           # tokens present
grep -q "is:inline" src/layouts/Base.astro                       # theme bootstrap
grep -q "md:hidden" src/components/global/Nav.astro              # mobile collapse
grep -q "github.com/JigSpec" src/components/global/Footer.astro  # GitHub link
! grep -rn "emerald-600\|font-mono" src/                         # distinct from buggerd
test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-320.png
test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-375.png
test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-414.png
test -f .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/dev-1280.png
```

All commands must exit 0. Visual checks require the user-approved screenshot review in task 9.
</verification>

<success_criteria>
- [ ] PROJECT.md Key Decisions table contains exactly one new row recording the chosen sketch direction (A or B) with `Locked Phase 1` outcome
- [ ] `astro.config.mjs` declares `experimental.fonts` with the chosen direction's display + body faces; no Google Fonts CDN link anywhere in the codebase
- [ ] `src/styles/global.css` declares ≤4 colors and 3 fonts in `@theme`, with `prefers-color-scheme: dark` overriding bg/fg/muted (NOT accent)
- [ ] `Base.astro` plumbs `<html data-theme>` via inline `is:inline` script and renders `<slot />` inside `<body>` flex column
- [ ] `Nav.astro` shows wordmark + inline links at md+, hamburger + collapsible vertical menu below md, with working JS toggle and `aria-expanded`
- [ ] `Footer.astro` renders docs link + `hi@jigspec.com` + copyright (auto year) + `https://github.com/JigSpec`
- [ ] `index.astro` is composition-only: `<Base>` + `<Nav />` + `<h1>JigSpec — coming soon</h1>` + supporting `<p>` + `<Footer />`. No products, no forms, no Mermaid.
- [ ] `npx astro check` exits 0 and `npm run build` produces `dist/index.html`
- [ ] No `emerald-600`/`emerald-500`/`#10B981`/`#059669` and no `font-mono` Tailwind class in `src/` (distinct from buggerd guard)
- [ ] Four PNG screenshots captured at 320/375/414/1280 in `verification-screenshots/`
- [ ] User approved the responsive shell renders legibly at all four viewports and reads as visually distinct from buggerd
</success_criteria>

<output>
After completion, create `.planning/phases/01-scaffold-sketches-visual-shell/01-03-visual-identity-shell-SUMMARY.md` recording:
- Chosen direction (A or B) and the Key Decision row text appended to PROJECT.md
- Final palette hex values committed in `global.css`
- Final display + body font names committed in `astro.config.mjs`
- Path to the four verification screenshots
- Any deviations from the plan (none expected — all branches are explicit)
- Forward note for plan 01-04: vercel.json CSP for `connect-src` and `script-src` is unaffected by this plan (no PostHog/Mermaid yet); the only CSP-relevant addition would be `font-src 'self'` which Astro Fonts API output already requires.
</output>
