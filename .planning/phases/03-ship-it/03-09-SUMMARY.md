---
phase: 03-ship-it
plan: 09
subsystem: testing
tags: [soak, lighthouse, posthog, og-debugger, cold-read, accessibility, visual-qa]

requires:
  - phase: 03-ship-it
    provides: Deployed preview build from plans 03-01 through 03-08

provides:
  - "03-09-SOAK-LOG.md: structured 24h soak audit template ready for human execution"
  - "VISUAL-05 cold-read review protocol (Pattern 4) documented and ready"
  - "16-item PITFALLS measurement table pre-scaffolded with numeric-measurement instructions"

affects: [phase-04-cutover, production-dns-swap, VISUAL-05, ROADMAP-SC5]

tech-stack:
  added: []
  patterns:
    - "Soak log as audit trail: structured Markdown table per PITFALLS item, three time-series snapshots, Lighthouse PSI cross-reference"
    - "Cold-read review: recruit reviewer who has never seen the page, 60-second timer, verbatim quote, 3-criterion pass rubric"

key-files:
  created:
    - ".planning/phases/03-ship-it/03-09-SOAK-LOG.md"
  modified: []

key-decisions:
  - "Soak log template created by agent; actual 24h soak measurements require human execution — cannot be automated"
  - "PostHog $exception autocapture must be enabled via project Settings UI before soak begins (Plan Task 1 — human action)"
  - "VISUAL-05 cold-read requires a reviewer with zero prior JigSpec exposure — cannot be simulated or automated"

requirements-completed: [VISUAL-05]

duration: 5min
completed: 2026-05-04
---

# Phase 3 Plan 09: 24-Hour Preview Soak — Template Ready, Awaiting Human Execution

**Soak log template created with all 16 PITFALLS measurement slots, three time-series snapshots, Lighthouse PSI table, OG debugger section, and VISUAL-05 cold-read protocol — actual soak requires 24 wall-clock hours of human measurement.**

## Performance

- **Duration:** 5 min (template creation only; soak itself is 24+ wall-clock hours)
- **Started:** 2026-05-04
- **Completed:** 2026-05-04 (template phase); soak execution is pending
- **Tasks completed (automated):** 1 of 7 (Task 2: soak log scaffolded)
- **Files created:** 1

## Accomplishments

- Created `.planning/phases/03-ship-it/03-09-SOAK-LOG.md` with every measurement slot pre-filled with instructions and FILL-IN markers
- All 16 PITFALLS items pre-scaffolded as a table requiring numeric/verbatim measurements (not checkboxes)
- Three snapshot sections (T+0h / T+12h / T+24h) with identical metric tables so measurements are comparable
- Lighthouse PSI table with mobile + desktop rows and per-category columns (≥95 threshold annotated)
- OG debugger section with step-by-step instructions
- VISUAL-05 cold-read section with the full Pattern 4 protocol: persona criteria, 60-second timer, verbatim capture, 3-criterion pass rubric, FAIL iteration map (CONTENT-01 / CONTENT-02 / VISUAL-02)
- Final pass/fail decision section with all 6 ROADMAP success criteria cross-referenced

## Task Commits

1. **Task 2: Soak log template created** - `c53344b` (docs)

## Files Created/Modified

- `.planning/phases/03-ship-it/03-09-SOAK-LOG.md` — Full soak audit template with all measurement slots pre-scaffolded

## Decisions Made

- Template creation is the only automated part of this plan. All measurements (T+0h, T+12h, T+24h, Lighthouse, OG, cold-read) require a live deployed site and human judgment — they cannot be run by an agent.
- Soak log uses `[FILL IN]` markers rather than placeholder values so there is no risk of mistaking template text for real measurements.
- Items 4 and 5 (Slack/Zapier notification destinations) pre-marked with fallback "n/a — Phase 3 deferred" instruction, as Phase 3 notification wiring may or may not be complete.

## Deviations from Plan

None — plan execution is functioning as designed. The `context_note` in the orchestrator prompt explicitly directs this agent to create the soak log template and return a checkpoint; the actual soak is a human-time activity.

## User Setup Required

The following steps require human action before this plan can be marked complete:

### Step 1 — Enable PostHog $exception autocapture (Task 1)

1. Open `https://us.posthog.com/project/<your-project-id>/settings/autocapture`
2. Find "Capture exceptions" (or "Error tracking") toggle — enable it
3. Verify: in DevTools console on the preview URL, run `throw new Error('soak-test-' + Date.now())` — the `$exception` event must appear in `https://us.posthog.com/project/<id>/events?q=$exception` within 30 seconds
4. Record the test-event timestamp in `03-09-SOAK-LOG.md` pre-soak checklist

### Step 2 — Run the 24-hour soak (Tasks 3, 4, 5)

Fill in the soak log at each time marker:
- **T+0h:** Load preview URL in Chrome (incognito, no extensions). Fill in all metric table values.
- **T+12h:** Repeat in a different browser (Safari recommended). Fill in all metric table values. Complete the 16-item PITFALLS table.
- **T+24h:** Repeat in a third browser (Firefox recommended). Fill in all metric table values. Run Lighthouse via PageSpeed Insights. Check OG debugger.

All measurement slots are documented in: `.planning/phases/03-ship-it/03-09-SOAK-LOG.md`

### Step 3 — VISUAL-05 cold-read review (Task 6)

Recruit one person who has never seen the JigSpec landing page. Send them only the preview URL with the message: "Quick favor — open this URL when you have 60 seconds free, then tell me in one paragraph what this company does and who it's for."

Pass criterion: verbatim response must mention ≥2 of:
- (a) Agentic AI / autonomous agents
- (b) At least one product candidate / vertical
- (c) Signal-driven roadmap or runtime concept

Record the verbatim quote in `03-09-SOAK-LOG.md` under the Cold-read section.

### Step 4 — Write final pass/fail decision (Task 7)

After T+24h measurements and cold-read are complete, fill in the "Final pass/fail decision" section of the soak log. If all thresholds met: Phase 3 is COMPLETE and ready for production DNS cutover.

## Next Phase Readiness

- Soak log template is ready — begin when the preview deploy from plans 03-01 through 03-08 is live
- Phase 4 (DNS cutover / production promote) is gated on this soak passing VISUAL-05 and ROADMAP SC#5
- The soak log at `.planning/phases/03-ship-it/03-09-SOAK-LOG.md` is the audit trail that justifies the Phase 4 promote decision

---
*Phase: 03-ship-it*
*Template completed: 2026-05-04*
*Soak execution: pending human measurement window*

## Self-Check: PASSED

- [x] `03-09-SOAK-LOG.md` exists at `.planning/phases/03-ship-it/03-09-SOAK-LOG.md`
- [x] Commit `c53344b` exists
- [x] `03-09-SUMMARY.md` created (this file)
- [x] STATE.md not modified (per parallel execution instructions)
- [x] ROADMAP.md not modified (per parallel execution instructions)
