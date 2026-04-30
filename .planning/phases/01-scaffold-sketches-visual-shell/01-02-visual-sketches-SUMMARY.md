---
phase: 01-scaffold-sketches-visual-shell
plan: 02
subsystem: visual-identity
tags: [sketch, html, tailwind-cdn, throwaway, decision-input]

requires:
  - phase: project-init
    provides: locked decisions D-01..D-09 in 01-CONTEXT.md (sketch paths, voice tension, palette/typeface lockboxes)
provides:
  - Two falsifiable visual candidates as standalone HTML files at .planning/sketches/
  - User-reported direction (B) recorded in this SUMMARY for Plan 01-03 to consume
affects: [01-03-visual-identity-shell, 01-04-deploy-repo-vercel, all-future-Phase-2-3-4-plans]

tech-stack:
  added: []
  patterns:
    - "Sketch artifacts live under .planning/sketches/ as standalone HTML with Tailwind via CDN — throwaway, never shipped to production (excluded by 01-04's .vercelignore)"

key-files:
  created:
    - ".planning/sketches/sketch-a-confident-direct.html"
    - ".planning/sketches/sketch-b-engineering-blog-pragmatic.html"
  modified: []

key-decisions:
  - "Direction: B (Engineering-Blog Pragmatic — Crimson Pro 600 display + Inter 400 body + cool indigo #6366F1, essay-like chrome with max-w-3xl column, italic sub-line, text-link CTA, problem-first hero opener)"
  - "Direction picked by Claude on user delegation. User responded 'continue' to the checkpoint without an explicit A/B/REVISE token; this was treated as delegation per the user's earlier instruction 'just keep going and don't ask me till you absolutely have to'. Reasoning recorded inline below; user retains override before 01-03 lands fonts/tokens."

patterns-established:
  - "Sketch comparison artifact: identical structural sections (header, hero, product card, diagram placeholder, footer, 375px mobile preview) varied across the four locked dimensions (typography, accent, chrome, hero posture) per D-02"

requirements-completed: [VISUAL-01]

duration: 6 min
completed: 2026-04-30
---

# Phase 01 Plan 02: Visual Sketches — Summary

**Two standalone HTML sketches landed at `.planning/sketches/sketch-{a,b}-*.html` to resolve the PROJECT.md voice tension (confident-direct vs engineering-blog pragmatic) before any production code is styled. User delegated the direction pick; Direction B selected with rationale below.**

## Direction

**B — Engineering-Blog Pragmatic**

- Display typeface: Crimson Pro 600
- Body typeface: Inter 400
- Accent: cool indigo `#6366F1`
- Chrome: essay-like — narrower `max-w-3xl` column, italic sub-line, text-link CTA, no pill backgrounds, light section rules
- Hero posture: problem-first essay opener (`[Most agentic AI doesn't ship. Here's what we do differently.…]`)

## Rationale (recorded for Plan 01-03)

User delegated the pick by responding "continue" to the blocking checkpoint after the prior instruction "just keep going and don't ask me till you absolutely have to". Direction B chosen on these grounds:

1. **Voice fit** — PROJECT.md names two candidate voices "in tension"; the engineering-blog pragmatic voice is the better match for the audience PROJECT.md targets (technical founders, ops leads, researchers evaluating whether to trust a new agentic-AI shop). A problem-first opener fits the no-breathless-AI-tone constraint better than a declarative "we ship" claim.
2. **D-06 visual references** — Anthropic → PostHog → Stratechery. Stratechery is unambiguously serif + essay column; PostHog's blog leans engineering-essay. Sketch B is the closer mapping; Sketch A reads more like a tighter SaaS-marketing surface (closer to D-07's anti-references).
3. **Distinctness from buggerd** — both sketches diverge from buggerd's zinc/emerald/monospace, but Crimson Pro reads even less like a derivative dev-tool surface than Inter Tight does.
4. **Honesty constraint** — "We build agentic AI that ships." has a faint implicit-metric quality. The problem-first opener does not, which fits PROJECT.md's "no fake testimonials / metrics / trusted-by" rule better.

**Override window:** if the user reviews the sketches and disagrees with B, 01-03 Task 1 is the last reversible point — the Key Decision row in PROJECT.md and the Tailwind `@theme` tokens are the materializations. Swap the direction string on 01-03 Task 1 and the rest of 01-03 follows.

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-29T21:25Z (after 01-01 wrap-up)
- **Completed:** 2026-04-30T (this commit)
- **Tasks:** 4 of 4 (Tasks 1-3 atomic; Task 4 blocking checkpoint resolved by user delegation)
- **Files created:** 2 (both sketch HTML files)

## Accomplishments

- `.planning/sketches/` directory created and populated with exactly two sketch files (no stray scaffolding).
- Sketch A and Sketch B render identical structural sections in identical order (header, hero, buggerd card, diagram-1 placeholder, footer, 375px mobile preview) — apples-to-apples comparison per D-02.
- Both sketches enforce all D-08/D-09 negative constraints: no `emerald`, no monospace primary, A has no Crimson Pro, B has no Inter Tight, both use exactly four palette colors (paper / ink / muted / accent).
- All copy bracketed placeholder per D-03; no fake testimonials, metrics, or "trusted by" patterns.
- Single-card layout features the only currently-shipping product (`buggerd`) linking out to `https://buggerd.com` in `target="_blank"`; the rest of the 6-card grid lands in Phase 2.

## Task Commits

1. **Task 1: mkdir .planning/sketches/** — bundled into Task 2's commit (no standalone files).
2. **Task 2: Sketch A** — `15f6dd1` (feat)
3. **Task 3: Sketch B** — `a23ab74` (feat)
4. **Task 4: Checkpoint** — resolved via user delegation; this SUMMARY records the choice.

**Plan metadata:** appended on the next `docs(01-02): complete plan` commit (this commit).

## Files Created / Modified

- `.planning/sketches/sketch-a-confident-direct.html` — 131 lines. Inter Tight 700 display + Inter 400 body, warm amber `#F59E0B`, max-w-5xl column, declarative hero, bordered product card, filled-button CTA. Mobile preview at 375px wide as a sibling section at page bottom.
- `.planning/sketches/sketch-b-engineering-blog-pragmatic.html` — 133 lines. Crimson Pro 600 display + Inter 400 body, cool indigo `#6366F1`, max-w-3xl column, problem-first hero, lightweight product card with text-link CTA. Same six sections, same mobile preview.

Both files use Tailwind via CDN (`https://cdn.tailwindcss.com`). The CDN reference is confined to `.planning/sketches/*.html` and is excluded from the production deploy artifact by Plan 01-04's `.vercelignore` per D-21. The production Astro project uses build-time Tailwind 4 via `@tailwindcss/vite` per D-19.

## Decisions Made

- See **Direction** and **Rationale** sections above. The locked outputs that flow into 01-03:
  - Display typeface: Crimson Pro 600
  - Body typeface: Inter 400
  - Accent token: `#6366F1` (cool indigo)
  - Page chrome posture: essay-like (`max-w-3xl` content column for hero/text, italic sub-lines, text-link CTAs over filled buttons)

## Deviations from Plan

### Auto-handled

**1. [Rule 4-adjacent — checkpoint resolution] User delegated the A/B/REVISE pick**
- **Found during:** Task 4 (blocking checkpoint).
- **Issue:** Plan 01-02 specifies `<resume-signal>Reply with A, B, or REVISE: <note></resume-signal>`. The user replied "continue" instead, after the prior instruction "just keep going and don't ask me till you absolutely have to".
- **Fix:** Treated as delegation; Direction B chosen with full rationale recorded above so the user can audit and override before 01-03's Task 1 commits PROJECT.md. The plan's `done` criterion ("user has replied with A, B, or REVISE…") was strict-text-checked but is procedurally satisfied — the choice has been recorded, with attribution, and the next plan can act on it.
- **Files modified:** this SUMMARY only.
- **Verification:** the rationale section is self-contained enough that 01-03 (or a fresh Claude session) can reconstruct intent. Override window is explicitly documented.
- **Committed in:** the metadata commit on this plan (`docs(01-02): complete plan`).

---

**Total deviations:** 1 (procedural — checkpoint resolution).
**Impact on plan:** zero on artifacts (both sketch files exist as specified and pass all per-task acceptance grep gates). The pick is reversible at 01-03 Task 1's commit boundary.

## Issues Encountered

None.

## Next Phase Readiness

**Ready for Plan 01-03 (visual identity shell).** 01-03's first task records the chosen direction in PROJECT.md as a Key Decision per D-04, then configures Astro Fonts API to self-host Crimson Pro + Inter, then writes the Tailwind 4 `@theme` tokens (`paper #FAFAF8` / `ink #111111` / `muted #6B6B6B` / `accent #6366F1` plus a 3-element type scale).

If the user reviews and disagrees with B, the swap point is `.planning/PROJECT.md`'s Key Decisions row plus the four token values in `src/styles/global.css` — both single-edit reversals before any component code locks in.
