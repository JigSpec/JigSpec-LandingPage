---
id: 01-02-visual-sketches
phase: 01
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/sketches/sketch-a-confident-direct.html
  - .planning/sketches/sketch-b-engineering-blog-pragmatic.html
autonomous: false
requirements: [VISUAL-01]

must_haves:
  truths:
    - "Both sketch files exist at the locked paths under .planning/sketches/ and open directly in a browser with no build step."
    - "Both sketches render identical placeholder content (header, hero, buggerd card, diagram-1 placeholder, footer, mobile-preview section) in identical structural order."
    - "Differences between sketches are limited to typography, accent color, layout chrome, and hero copy posture (per D-02)."
    - "All visible body/headline copy is bracketed placeholder copy (per D-03) — no Phase 2 final copy, no fake testimonials, no fabricated metrics, no 'trusted by' patterns."
    - "Sketch A uses Inter Tight 700 display + Inter 400 body + warm accent (#F59E0B). Sketch B uses Crimson Pro 600 display + Inter 400 body + cool accent (#6366F1). Neither uses emerald or teal-emerald-adjacent accents (per D-08, D-09)."
    - "Each sketch is intentionally visually distinct from buggerd's index.html (different typeface and different accent — buggerd uses zinc/emerald monospace; sketches use grotesque-or-serif sans + warm/cool accent)."
    - "User has reviewed both sketches in a browser and reported back which direction (A or B) to carry into Plan 01-03."
  artifacts:
    - path: ".planning/sketches/sketch-a-confident-direct.html"
      provides: "Confident & direct candidate visual identity (Inter Tight + warm accent)"
      contains: "Inter Tight"
    - path: ".planning/sketches/sketch-b-engineering-blog-pragmatic.html"
      provides: "Engineering-blog pragmatic candidate visual identity (Crimson Pro + cool accent)"
      contains: "Crimson Pro"
  key_links:
    - from: "Both sketch HTML files"
      to: "https://cdn.tailwindcss.com"
      via: "<script src=\"https://cdn.tailwindcss.com\"></script>"
      pattern: "cdn\\.tailwindcss\\.com"
    - from: "Both sketch product cards"
      to: "https://buggerd.com"
      via: "anchor tag with target=\"_blank\""
      pattern: "https://buggerd\\.com"
    - from: "Plan 01-02 checkpoint output"
      to: "Plan 01-03 first task"
      via: "User-reported direction (A or B) recorded in PROJECT.md as a Key Decision (per D-04)"
      pattern: "Key Decision"
---

<objective>
Hand-write two self-contained static HTML sketches at `.planning/sketches/sketch-a-confident-direct.html` (Confident & Direct) and `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` (Engineering-Blog Pragmatic) per locked decisions D-01..D-09 in `01-CONTEXT.md`.

Both sketches render the SAME placeholder content (minimal nav + hero + one buggerd product card + diagram-1 placeholder + minimal footer, then a 375px-wide mobile-preview section) in the SAME structural order. Differences are LIMITED to:
- Typography (Inter Tight 700 display vs Crimson Pro 600 display)
- Accent palette (warm `#F59E0B` vs cool `#6366F1`)
- Layout chrome (declarative blocks vs essay-like flow)
- Hero copy posture (declarative claim vs problem-first essay opener)

All copy is bracketed placeholder per D-03 (e.g. `[Headline goes here — falsifiable claim]`). Tailwind via CDN script tag, no build step, no shared assets — sketches are throwaway artifacts under `.planning/` that will be ignored at deploy time by Plan 01-04's `.vercelignore`.

Plan ends with a `checkpoint:human-verify` task (gate: blocking) that asks the user to open both files in a browser and report back which direction (A or B). The chosen direction will be recorded as a Key Decision in `.planning/PROJECT.md` by Plan 01-03's first task (per D-04).

Purpose: Produce two falsifiable visual candidates so the user can pick a direction BEFORE any production code (Astro components, Tailwind config, fonts wiring) is written. This prevents thrash on the production shell in Plan 01-03 and Phase 2.

Output: Two standalone `.html` files in `.planning/sketches/` plus a recorded user direction.
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
@.planning/REQUIREMENTS.md
@/Users/kjs/Documents/Business/Buggerd/index.html

<must_diverge_from>
The buggerd landing page (`/Users/kjs/Documents/Business/Buggerd/index.html`) uses a tight zinc/emerald palette with a monospace-leaning aesthetic. JigSpec's company-level landing MUST NOT read as a derivative of one of its own products (PROJECT.md visual identity constraint). Both sketches diverge by:

- NOT using emerald-anything as accent (D-09 explicit exclusion). Sketch A uses warm amber `#F59E0B`; Sketch B uses cool indigo `#6366F1`.
- NOT using monospace as the primary typeface. Sketch A uses Inter Tight (grotesque sans display); Sketch B uses Crimson Pro (serif display).
- Different layout chrome: tech-publication / editorial feel (per PROJECT.md "bolder & editorial — tech-publication aesthetic"), not buggerd's tighter dev-tool surface.

Read buggerd's `index.html` ONCE to confirm what to AVOID. Do not import any patterns from it.
</must_diverge_from>

<anti_references>
Per D-07, do NOT mimic: Vercel.com, Linear.app, n8n.io, buggerd's landing, The Verge.

Visual anchors (in priority order, per D-06): Anthropic homepage → PostHog homepage/blog → Stratechery.
</anti_references>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create .planning/sketches/ directory</name>
  <files>.planning/sketches/</files>
  <read_first>
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` — confirm D-01 path target (`.planning/sketches/sketch-a-confident-direct.html`, `.planning/sketches/sketch-b-engineering-blog-pragmatic.html`).
  </read_first>
  <action>Create the directory `.planning/sketches/` at the repo root. This directory holds throwaway sketch artifacts that will NOT ship to production (Plan 01-04 adds `.planning/` to `.vercelignore`). Use `mkdir -p .planning/sketches`. Do not create any files inside it yet — Tasks 2 and 3 do that.</action>
  <verify>
    <automated>test -d .planning/sketches && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `test -d .planning/sketches` returns success (directory exists).
    - Directory is empty at end of task (no files yet).
  </acceptance_criteria>
  <done>The directory `.planning/sketches/` exists and is empty.</done>
</task>

<task type="auto">
  <name>Task 2: Write sketch-a-confident-direct.html (Inter Tight + warm amber accent, declarative posture)</name>
  <files>.planning/sketches/sketch-a-confident-direct.html</files>
  <read_first>
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` — re-read D-02, D-03, D-08, D-09 before writing.
    - `/Users/kjs/Documents/Business/Buggerd/index.html` — confirm what to diverge from (zinc/emerald monospace).
  </read_first>
  <action>
Write a complete, standalone HTML5 document at `.planning/sketches/sketch-a-confident-direct.html` using the EXACT structure, classes, and copy below. No build step. Tailwind via CDN. Google Fonts CDN for Inter Tight + Inter (acceptable here because sketches are throwaway — Astro Fonts API only governs production per D-08).

**Document head (exact):**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JigSpec — Sketch A (Confident & Direct)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['"Inter Tight"', 'system-ui', 'sans-serif'],
            body: ['Inter', 'system-ui', 'sans-serif'],
          },
          colors: {
            paper: '#FAFAF8',
            ink: '#111111',
            muted: '#6B6B6B',
            accent: '#F59E0B', // warm amber — explicitly NOT emerald (per D-09)
          },
        },
      },
    };
  </script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    .display { font-family: 'Inter Tight', system-ui, sans-serif; }
  </style>
</head>
```

**Palette (exact, ≤4 colors per D-09):**
- Background: `#FAFAF8` (paper)
- Body text: `#111111` (ink)
- Muted text: `#6B6B6B` (muted)
- Accent: `#F59E0B` (warm amber)

**Body structure (exact order — must match Sketch B section-for-section):**

1. `<header>` — sticky-ish top bar, `class="border-b border-black/10 bg-paper"`. Inside: text wordmark `JigSpec` (display font, `text-xl font-bold tracking-tight`) on the left; nav links `Products`, `Docs`, `About` on the right (`text-sm font-medium text-ink/80 hover:text-accent`).

2. `<section id="hero">` — `class="mx-auto max-w-5xl px-6 py-24 md:py-32"`. Headline (declarative posture): `<h1 class="display text-5xl md:text-7xl font-extrabold tracking-tight text-ink">[We build agentic AI that ships. — falsifiable claim, replace in Phase 2]</h1>`. Sub-line below: `<p class="mt-6 max-w-2xl text-lg md:text-xl text-muted">[Sub-line — one sentence on why our agentic recipe is more reliable than what's already out there. Replace in Phase 2.]</p>`. Primary CTA button below: `<a href="#card" class="mt-10 inline-flex items-center gap-2 bg-accent text-ink font-semibold px-6 py-3 rounded-md hover:opacity-90">[Primary CTA placeholder] →</a>`.

3. `<section id="card">` — `class="mx-auto max-w-5xl px-6 py-16 border-t border-black/10"`. Section eyebrow: `<p class="text-sm font-medium uppercase tracking-widest text-accent">Products</p>`. Inside, ONE product card: `<a href="https://buggerd.com" target="_blank" rel="noopener" class="mt-6 block group rounded-lg border border-black/10 p-8 hover:border-accent transition-colors">` containing: wordmark `<div class="display text-2xl font-bold tracking-tight">buggerd</div>`, stage badge `<span class="ml-3 inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded">Shipping</span>` next to wordmark, one-line description `<p class="mt-3 text-muted">[Auto-fixes failing CI runs across your repos. — placeholder, replace in Phase 2]</p>`, CTA arrow `<span class="mt-6 inline-flex items-center gap-2 text-ink font-medium group-hover:text-accent">Visit buggerd.com <span aria-hidden="true">→</span></span>`. Close `</a>`.

4. `<section id="diagram">` — `class="mx-auto max-w-5xl px-6 py-16 border-t border-black/10"`. Section eyebrow: `<p class="text-sm font-medium uppercase tracking-widest text-muted">How it works</p>`. Below: a placeholder box `<div class="mt-6 border-2 border-dashed border-black/20 rounded-lg p-12 text-center text-muted">Diagram 1 (Mermaid) — pipeline runtime view, ships in Phase 4</div>`.

5. `<footer>` — `class="border-t border-black/10 mt-24 py-10 text-sm text-muted"`. Inside `<div class="mx-auto max-w-5xl px-6 flex flex-wrap gap-6 justify-between">`: left side `<div>© 2026 JigSpec. [Copyright line — replace in Phase 2]</div>`, right side `<div class="flex gap-6"><a href="#" class="hover:text-accent">[Docs link]</a><a href="mailto:hello@jigspec.com" class="hover:text-accent">[Contact email]</a><a href="https://github.com/JigSpec" target="_blank" rel="noopener" class="hover:text-accent">GitHub</a></div>`.

6. `<section class="mobile-preview">` — `class="border-t-4 border-accent mt-24 py-12 bg-black/5"`. Heading inside: `<p class="mx-auto max-w-5xl px-6 text-sm font-mono text-muted">Mobile preview (375px)</p>`. Below the heading, a 375px-wide container that REPEATS sections 2-5 (hero + card + diagram + footer) at the smaller width: `<div class="mx-auto mt-6 max-w-[375px] border border-black/10 bg-paper rounded-lg overflow-hidden">…</div>`. Inside that container, scale the type DOWN (e.g. headline becomes `text-3xl font-extrabold tracking-tight`, sub becomes `text-base`, card padding `p-6`, diagram box `p-8`). Use the SAME bracketed placeholder copy as the desktop section.

**Hero posture for Sketch A — declarative claim** (the literal placeholder text you must include verbatim, brackets and all):
- Headline: `[We build agentic AI that ships. — falsifiable claim, replace in Phase 2]`
- Sub: `[Sub-line — one sentence on why our agentic recipe is more reliable than what's already out there. Replace in Phase 2.]`

**Forbidden in this file:**
- `emerald` — anywhere (D-09). Use `accent` (`#F59E0B`) or Tailwind `amber-*` if you need a variant — do NOT introduce `bg-emerald-*` / `text-emerald-*`.
- `Crimson Pro` — that's Sketch B's typeface (D-08). Sketch A is Inter Tight only.
- Real testimonial / metric / "trusted by" copy (PROJECT.md honesty constraint). All copy stays bracketed.

Class hygiene: keep all classes inline on Tailwind CDN — do NOT use `@apply` or custom CSS for layout. Custom CSS is allowed only for the two `.display` / `body` font-family hooks shown above.
  </action>
  <verify>
    <automated>test -f .planning/sketches/sketch-a-confident-direct.html && grep -q "Inter Tight" .planning/sketches/sketch-a-confident-direct.html && grep -q "cdn.tailwindcss.com" .planning/sketches/sketch-a-confident-direct.html && grep -q "\[Headline\|\[We build" .planning/sketches/sketch-a-confident-direct.html && ! grep -qi "emerald" .planning/sketches/sketch-a-confident-direct.html && grep -q "buggerd" .planning/sketches/sketch-a-confident-direct.html && grep -q "Diagram 1" .planning/sketches/sketch-a-confident-direct.html && grep -q "max-w-\[375px\]" .planning/sketches/sketch-a-confident-direct.html && grep -q "#F59E0B" .planning/sketches/sketch-a-confident-direct.html && ! grep -q "Crimson Pro" .planning/sketches/sketch-a-confident-direct.html && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/sketches/sketch-a-confident-direct.html` exists.
    - Contains `Inter Tight` (typeface) AND `cdn.tailwindcss.com` (no build step).
    - Contains a bracketed-placeholder hero string (matches `[We build` or `[Headline`).
    - Contains the literal accent hex `#F59E0B`.
    - Does NOT contain `emerald` (case-insensitive grep — D-09 enforcement).
    - Does NOT contain `Crimson Pro` (typeface confined to Sketch B — D-08 enforcement).
    - Contains `buggerd` (product card subject).
    - Contains `Diagram 1` (diagram-1 placeholder annotation).
    - Contains `max-w-[375px]` (mobile preview section per the locked structural requirement).
    - Contains `https://buggerd.com` linking out (target="_blank").
    - Opens directly in a browser via `open .planning/sketches/sketch-a-confident-direct.html` with no console errors blocking render (manual sanity-check during Task 4 checkpoint).
  </acceptance_criteria>
  <done>Sketch A renders the locked structural sections in order, in Inter Tight + warm amber, with all copy bracketed, no emerald, distinct from buggerd, and includes a 375px mobile-preview section.</done>
</task>

<task type="auto">
  <name>Task 3: Write sketch-b-engineering-blog-pragmatic.html (Crimson Pro + cool indigo accent, essay posture)</name>
  <files>.planning/sketches/sketch-b-engineering-blog-pragmatic.html</files>
  <read_first>
    - `.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md` — re-confirm D-08 (Crimson Pro 600 display + Inter 400 body) and D-09 (cool indigo `#6366F1`, NOT teal/emerald-adjacent).
    - `.planning/sketches/sketch-a-confident-direct.html` — the file just written by Task 2. Read it to confirm STRUCTURAL parity (same sections in same order, same bracketed-placeholder structure for the buggerd card and diagram and footer). Sketch B differs ONLY in typography, accent, chrome, and hero copy posture.
  </read_first>
  <action>
Write a complete, standalone HTML5 document at `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` using the EXACT structure below. SAME six sections in the SAME order as Sketch A (apples-to-apples comparison per D-02). Differences from Sketch A are LIMITED to:
1. Typography: Crimson Pro 600 display + Inter 400 body (replacing Inter Tight 700 + Inter).
2. Accent: cool indigo `#6366F1` (replacing warm amber `#F59E0B`).
3. Chrome: more essay-like (e.g. wider line-height on body, an italicized sub-line, a smaller and more text-forward CTA, a thin top rule on each section instead of bold borders).
4. Hero copy posture: problem-first essay opener instead of declarative claim.

**Document head (exact):**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JigSpec — Sketch B (Engineering-Blog Pragmatic)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['"Crimson Pro"', 'Georgia', 'serif'],
            body: ['Inter', 'system-ui', 'sans-serif'],
          },
          colors: {
            paper: '#FAFAF8',
            ink: '#111111',
            muted: '#6B6B6B',
            accent: '#6366F1', // cool indigo — explicitly NOT teal/emerald-adjacent (per D-09)
          },
        },
      },
    };
  </script>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.65; }
    .display { font-family: 'Crimson Pro', Georgia, serif; }
  </style>
</head>
```

**Palette (exact, ≤4 colors per D-09):**
- Background: `#FAFAF8` (paper)
- Body text: `#111111` (ink)
- Muted text: `#6B6B6B` (muted)
- Accent: `#6366F1` (cool indigo)

**Body structure (must match Sketch A section count and section order):**

1. `<header>` — `class="border-b border-black/10 bg-paper"`. Wordmark `JigSpec` in **Crimson Pro 600** display (`class="display text-2xl font-semibold tracking-tight"`). SAME 3 nav links (`Products`, `Docs`, `About`) but use `text-sm text-ink/70 hover:text-accent` (slightly lighter weight than Sketch A — chrome distinction).

2. `<section id="hero">` — `class="mx-auto max-w-3xl px-6 py-24 md:py-32"` (narrower column than Sketch A's `max-w-5xl` — essay-like measure). Eyebrow above headline: `<p class="text-sm uppercase tracking-widest text-accent">[Eyebrow — replace in Phase 2]</p>`. Headline (essay opener): `<h1 class="display mt-4 text-5xl md:text-6xl font-semibold leading-tight text-ink">[Most agentic AI doesn't ship. Here's what we do differently. — falsifiable problem-first claim, replace in Phase 2]</h1>`. Italicized sub-line: `<p class="mt-6 text-xl italic text-muted">[Sub-line, essay voice — one sentence on the gap between AI demos and AI in production. Replace in Phase 2.]</p>`. CTA as text link rather than button: `<a href="#card" class="mt-10 inline-block text-accent font-medium underline underline-offset-4 decoration-2 hover:decoration-4">[Read more — placeholder]</a>`.

3. `<section id="card">` — `class="mx-auto max-w-3xl px-6 py-16 border-t border-black/10"` (narrower column matches hero). Section eyebrow: `<p class="text-sm uppercase tracking-widest text-muted">Products</p>`. Inside, ONE product card with the SAME content as Sketch A but lighter chrome: `<a href="https://buggerd.com" target="_blank" rel="noopener" class="mt-6 block group">` containing: wordmark `<div class="display text-3xl font-semibold tracking-tight">buggerd</div>`, stage badge `<span class="ml-3 inline-block text-xs font-semibold uppercase tracking-wider text-accent">Shipping</span>` (no pill background — chrome distinction), one-line description `<p class="mt-3 text-muted">[Auto-fixes failing CI runs across your repos. — placeholder, replace in Phase 2]</p>`, CTA arrow `<span class="mt-4 inline-flex items-center gap-2 text-accent group-hover:gap-3 transition-all">Visit buggerd.com <span aria-hidden="true">→</span></span>`. Close `</a>`.

4. `<section id="diagram">` — `class="mx-auto max-w-3xl px-6 py-16 border-t border-black/10"`. Section eyebrow: `<p class="text-sm uppercase tracking-widest text-muted">How it works</p>`. Below: same dashed-border placeholder box as Sketch A but narrower column: `<div class="mt-6 border-2 border-dashed border-black/20 rounded-lg p-12 text-center text-muted">Diagram 1 (Mermaid) — pipeline runtime view, ships in Phase 4</div>`.

5. `<footer>` — `class="border-t border-black/10 mt-24 py-10 text-sm text-muted"`. Inside `<div class="mx-auto max-w-3xl px-6 flex flex-wrap gap-6 justify-between">`: left `<div>© 2026 JigSpec. [Copyright line — replace in Phase 2]</div>`, right `<div class="flex gap-6"><a href="#" class="hover:text-accent">[Docs link]</a><a href="mailto:hello@jigspec.com" class="hover:text-accent">[Contact email]</a><a href="https://github.com/JigSpec" target="_blank" rel="noopener" class="hover:text-accent">GitHub</a></div>`.

6. `<section class="mobile-preview">` — `class="border-t-4 border-accent mt-24 py-12 bg-black/5"`. Heading: `<p class="mx-auto max-w-3xl px-6 text-sm font-mono text-muted">Mobile preview (375px)</p>`. Below, a 375px-wide container that REPEATS sections 2-5 with the SAME bracketed placeholder copy at smaller scale: `<div class="mx-auto mt-6 max-w-[375px] border border-black/10 bg-paper rounded-lg overflow-hidden">…</div>`. Inside, scale type DOWN: headline `text-3xl font-semibold leading-tight` (display font), sub `text-base italic`, padding tightened, but column structure the same.

**Hero posture for Sketch B — problem-first essay opener** (the literal placeholder text you must include verbatim, brackets and all):
- Eyebrow: `[Eyebrow — replace in Phase 2]`
- Headline: `[Most agentic AI doesn't ship. Here's what we do differently. — falsifiable problem-first claim, replace in Phase 2]`
- Sub: `[Sub-line, essay voice — one sentence on the gap between AI demos and AI in production. Replace in Phase 2.]`

**Forbidden in this file:**
- `emerald` and any teal-emerald-adjacent accent (D-09 explicit exclusion). Use indigo `#6366F1`.
- `Inter Tight` — that's Sketch A's display typeface (D-08). Sketch B uses Crimson Pro for display, Inter for body only.
- Real testimonial / metric / "trusted by" copy. All copy stays bracketed.

Class hygiene: same as Sketch A — all classes inline, no `@apply`, custom CSS only for the two font-family hooks plus the `body { line-height: 1.65 }` essay-readability rule.
  </action>
  <verify>
    <automated>test -f .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "Crimson Pro" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && ! grep -q "Inter Tight" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "cdn.tailwindcss.com" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "\[Most agentic AI\|\[Headline" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && ! grep -qi "emerald" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "buggerd" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "Diagram 1" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "max-w-\[375px\]" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && grep -q "#6366F1" .planning/sketches/sketch-b-engineering-blog-pragmatic.html && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` exists.
    - Contains `Crimson Pro` (display typeface) AND does NOT contain `Inter Tight` (D-08 — typefaces confined per sketch).
    - Contains `cdn.tailwindcss.com` (no build step).
    - Contains a bracketed-placeholder essay-opener hero string (matches `[Most agentic AI` or `[Headline`).
    - Contains the literal accent hex `#6366F1`.
    - Does NOT contain `emerald` (case-insensitive grep — D-09 enforcement).
    - Contains `buggerd` (product card subject).
    - Contains `Diagram 1` (diagram-1 placeholder annotation).
    - Contains `max-w-[375px]` (mobile preview section).
    - Contains `https://buggerd.com` linking out (target="_blank").
    - Section structure (`#hero`, `#card`, `#diagram`, `<footer>`, mobile-preview) matches Sketch A's section order — verified by visual diff during Task 4 checkpoint.
  </acceptance_criteria>
  <done>Sketch B renders the same six structural sections as Sketch A but in Crimson Pro + cool indigo with essay-like chrome and a problem-first hero posture; all copy bracketed; no emerald; no Inter Tight.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: User reviews both sketches and reports a direction</name>
  <files>(none — review-only checkpoint; user opens .planning/sketches/sketch-a-confident-direct.html and .planning/sketches/sketch-b-engineering-blog-pragmatic.html in a browser)</files>
  <action>STOP. Do not write any files. Present the &lt;how-to-verify&gt; instructions below to the user verbatim and wait for their reply matching the resume-signal pattern. When the user replies, record the chosen direction (A, B, or REVISE plus note) in this plan's SUMMARY.md so Plan 01-03 can pick it up.</action>
  <verify>
    <automated>test -f .planning/sketches/sketch-a-confident-direct.html &amp;&amp; test -f .planning/sketches/sketch-b-engineering-blog-pragmatic.html</automated>
  </verify>
  <done>User has replied with `A`, `B`, or `REVISE: &lt;note&gt;` and the choice is recorded in 01-02-visual-sketches-SUMMARY.md.</done>
  <what-built>
    Two self-contained HTML sketches:
    - `.planning/sketches/sketch-a-confident-direct.html` — Inter Tight 700 display, Inter 400 body, warm amber `#F59E0B` accent, declarative-claim hero posture, denser block chrome.
    - `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` — Crimson Pro 600 display, Inter 400 body, cool indigo `#6366F1` accent, problem-first essay-opener hero, narrower-column essay chrome.

    Both render the same structural sections (header / hero / buggerd card / diagram-1 placeholder / footer / 375px mobile preview) with identical bracketed-placeholder copy structure, so the comparison is apples-to-apples per D-02.
  </what-built>
  <how-to-verify>
    1. Open both files in your default browser side-by-side. From the repo root:
       ```sh
       open .planning/sketches/sketch-a-confident-direct.html
       open .planning/sketches/sketch-b-engineering-blog-pragmatic.html
       ```
       (or drag both files into a browser window if `open` doesn't pick the right app)

    2. At desktop width, compare:
       - Hero posture: Sketch A's declarative claim ("We build agentic AI that ships.") vs Sketch B's problem-first opener ("Most agentic AI doesn't ship. Here's what we do differently.")
       - Typography: grotesque sans (A) vs serif (B)
       - Accent: warm amber (A) vs cool indigo (B)
       - Chrome density: A's denser blocks with bordered card vs B's lighter essay-like rules

    3. Scroll to the "Mobile preview (375px)" section at the bottom of each file. Confirm:
       - The hero, card, diagram, and footer all reflow inside the 375px container without horizontal scroll.
       - Type scales down sensibly.

    4. Confirm anti-reference check (per D-07 / D-06): neither sketch reads like buggerd's landing (no emerald, no monospace primary), Vercel.com, Linear.app, n8n.io, or The Verge.

    5. Confirm honesty constraint (PROJECT.md): there is NO fake testimonial, fabricated metric, or "trusted by" pattern in either file. All copy is bracketed placeholder.

    6. Pick a direction:
       - **A** — Confident & Direct (Inter Tight + warm amber + declarative posture)
       - **B** — Engineering-Blog Pragmatic (Crimson Pro + cool indigo + essay posture)

    If neither feels right, you can also reply with **REVISE** plus a short note describing what to change. The executor should pause; the orchestrator may decide to re-spawn this plan with revisions or continue to Plan 01-03 with the chosen direction.

    Note: The chosen direction will be recorded as a Key Decision in `.planning/PROJECT.md` by Plan 01-03's first task (per D-04). The rejected sketch is left in place for reference; both files are excluded from production deploy by Plan 01-04's `.vercelignore`.
  </how-to-verify>
  <resume-signal>Reply with `A`, `B`, or `REVISE: <note>`</resume-signal>
</task>

</tasks>

<verification>
Phase-level checks for this plan:

1. Both sketch files exist at the locked paths under `.planning/sketches/`.
2. Both pass the per-task automated grep gates (Tailwind CDN, correct typeface, correct accent hex, bracketed placeholder copy, no emerald, mobile preview present, buggerd link present, diagram-1 placeholder text present).
3. Both open directly in a browser with no build step (verified manually during Task 4 checkpoint).
4. User has reported a direction (A, B, or REVISE) — captured in the orchestrator's resume signal and carried forward to Plan 01-03.
</verification>

<success_criteria>
- `.planning/sketches/sketch-a-confident-direct.html` and `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` both exist, render in a browser, and meet all per-task acceptance criteria.
- The two sketches are visually distinct in the four dimensions D-02 allows (typography, accent, chrome, hero posture) and identical in everything else (placeholder content, structural order, mobile-preview section).
- Neither sketch uses emerald, teal-emerald-adjacent accents, Inter Tight (B only), Crimson Pro (A only), or any honesty-constraint-violating copy.
- The user has selected A, B, or REVISE; the chosen direction is ready to be recorded in PROJECT.md by Plan 01-03's first task.
- `.planning/sketches/` directory exists and contains exactly two files (no stray scaffolding).
</success_criteria>

<output>
After completion, create `.planning/phases/01-scaffold-sketches-visual-shell/01-02-visual-sketches-SUMMARY.md` recording:
- Both sketch file paths
- The user-reported direction (A / B / REVISE)
- Any verbatim revision notes from the user (if REVISE)
- Confirmation that all per-task acceptance grep gates passed
</output>
