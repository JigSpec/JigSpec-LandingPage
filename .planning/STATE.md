# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-27)

**Core value:** Generate enough company-level credibility and product-candidate signal that we can confidently pick which vertical to ship next.
**Current focus:** Phase 1 — Scaffold, Sketches & Visual Shell

## Current Position

Phase: 1 of 5 (Scaffold, Sketches & Visual Shell)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-04-27 — Roadmap created; 37 v1 requirements mapped across 5 phases

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Most relevant for Phase 1:

- Tech stack: Astro 6 + Tailwind 4 (`@tailwindcss/vite`) + PostHog + `astro-mermaid` v2 + Vercel/Cloudflare
- Visual: bolder editorial / tech-publication aesthetic, distinct from buggerd; designer-of-record is Claude (no human-designer hours budgeted) — mitigated by the Phase 1 sketch comparison and the Phase 4 cold-read review
- Voice: two-sketch comparison (Confident & Direct vs. Engineering-Blog Pragmatic) before locking copy — happens in Phase 1
- 6th card "Agentic Employees" added — intentionally creates a Delegate-overlap that the demand signal can resolve
- Forms split: PostHog Surveys for the 5 structured per-card forms; bare `posthog.capture('problem_pitch')` for the open-ended capture
- Notification destination wired on day one (Slack or Zapier-to-Gmail) — Phase 3 gate
- Docs cutover destination locked at `docs.jigspec.com` (existing VitePress build redeployed there before apex swap)
- Demand-signal gate: 5 submits/card OR 4 weeks of traffic, whichever first; weighted formula `1.0×submits + 0.3×opens + 0.1×clicks + 0.05×dwell` — committed in Phase 3

### Pending Todos

None yet.

### Blockers/Concerns

- **REQUIREMENTS.md count discrepancy** — REQUIREMENTS.md bottom counter says "v1 requirements: 36 total" but the Traceability table actually lists 37 (CONTENT 8 + DEMAND 5 + ANALYTICS 5 + DIAGRAM 5 + VISUAL 5 + TECH 5 + DEPLOY 4). Roadmap maps all 37; counter updated to 37 in this pass.
- **Phase 5 cutover prerequisite** — `docs.jigspec.com` must be stood up (even just pointing at the existing VitePress build) before the apex DNS swap can happen. This is not a v1 deliverable on the marketing repo but it is a hard dependency the user owns; flagged for tracking outside this codebase.

## Deferred Items

Items acknowledged and carried forward:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Docs migration | Full content migration of VitePress docs to `docs.jigspec.com` (DOCS-01/02) | v2 | Project init |
| Blog | `/blog` index, post pages, RSS, MDX support (BLOG-01..04) | v2 — schema reserved in Phase 2 | Project init |
| Niche pages | Per-vertical landing pages once a vertical is picked (NICHE-01/02) | v2 | Project init |

## Session Continuity

Last session: 2026-04-27
Stopped at: Roadmap + STATE created; ready for `/gsd-plan-phase 1`
Resume file: None
