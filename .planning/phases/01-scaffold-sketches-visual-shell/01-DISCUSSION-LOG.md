# Phase 1: Scaffold, Sketches & Visual Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 1-Scaffold, Sketches & Visual Shell
**Areas discussed:** (all areas presented; user delegated all decisions to Claude)

---

## Initial gray areas presented

| Option | Description | Selected for discussion |
|--------|-------------|-------------------------|
| Sketch medium & review | How sketches get produced (HTML files, deployed paths, /gsd-sketch tool) and reviewed | (delegated) |
| Visual references / inspiration | Concrete pinpoints for editorial aesthetic + anti-references | (delegated) |
| Dark mode in v1 | Light-only / system-preference auto / explicit toggle | (delegated) |
| Repo & Vercel naming + access | Repo name, GitHub org, Vercel project, branch protection | (delegated) |

**User's choice:** "You make these decisions" — full delegation to Claude across all four areas.
**Notes:** Decisions made by Claude inline in CONTEXT.md (D-01 through D-25). All locked unless overridden during planning or execution.

---

## Claude's Discretion

The user explicitly delegated all four discussed gray areas to Claude. Claude's calls (with rationale) are in CONTEXT.md `<decisions>`:

- **Sketch medium & review** (D-01..D-05): standalone HTML files in `.planning/sketches/` with placeholder content distinct from Phase 2 final copy; reviewed via local browser open with Claude prompting in chat after commit; not deployed to live Vercel; handwritten HTML+Tailwind rather than `/gsd-sketch` flow for tighter comparator control
- **Visual references** (D-06..D-09): primary anchors are Anthropic homepage → Posthog homepage/blog → Stratechery; explicit anti-references are Vercel, Linear, n8n, buggerd, magazine-news sites; sketch A typography = Inter Tight grotesque sans, sketch B typography = Crimson Pro serif display + Inter body; both use ≤4-color palettes (warm accent vs. cool accent, not emerald)
- **Dark mode** (D-10..D-11): system-preference auto (no toggle UI), light-only sketches in Phase 1, dark theme auto-derived and validated in Phase 4 polish; if auto-derivation looks bad, dark mode is dropped from v1
- **Repo & Vercel** (D-12..D-16): repo `JigSpec/jigspec-landing` (public), Vercel project same name, default `jigspec-landing.vercel.app` preview URL, branch protection mirrors buggerd (no force-push only), repo + Vercel creation user-owned (executor cannot create remotes)

Additional discretionary calls (also in CONTEXT.md `<decisions>`):

- Scaffolding command + initial dependencies (D-17..D-22)
- Layout shell component breakdown (D-23..D-25)
- Exact CSS variable names, Tailwind config values, file naming inside `src/`, sketch HTML structure, 3rd nav link choice (left to executor within constraints)

## Deferred Ideas

Captured in CONTEXT.md `<deferred>`:

- Explicit dark-mode toggle UI (v2)
- Logo / wordmark SVG (Phase 4 polish if pre-launch needed)
- Mobile menu animation polish (Phase 4)
- Sketch C+ — only two sketches per VISUAL-01; iterate on one if both rejected
- Brand color exploration beyond warm/cool (Phase 4)
- Storybook (out of scope — Delegate uses it; we don't need it for v1)
- Test framework wiring — visual + manual QA suffices for v1

## Notes

- User delegation pattern matches Phase 1's "designer of record: Claude" Key Decision in PROJECT.md. The delegation here extends from visual to all implementation choices for this phase.
- No conflicts with prior decisions (this is the first phase — only project-level decisions exist as priors).
- No scope creep redirected. The four presented areas all clarified HOW within Phase 1's scope.
