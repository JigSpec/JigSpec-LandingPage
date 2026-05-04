---
phase: "03"
plan: "02"
subsystem: analytics
tags: [analytics, posthog, typed-wrapper, taxonomy, lint-guard]
dependency_graph:
  requires: [03-01]
  provides: [src/lib/analytics.ts, src/lib/surveys.ts, package.json#analytics-audit]
  affects: [03-03, 03-04, 03-05]
tech_stack:
  added: []
  patterns:
    - "window.posthog typed via declare global — no posthog-js npm import"
    - "EventName string-literal union + EventProps discriminated mapped type (compile-time per-event property contracts)"
    - "Record<ProductId, SurveyConfig> enforces exhaustive survey map at compile time"
    - "grep-based audit script mirroring honesty-audit pattern"
key_files:
  created:
    - src/lib/analytics.ts
    - src/lib/surveys.ts
  modified:
    - package.json
decisions:
  - "Cast SurveyResponseProps to unknown first before Record<string, unknown> to satisfy TS strict — SurveyResponseProps index signature is string-templated, not plain string"
  - "Quoted 'delegate' key in SURVEYS object for grep-audit consistency with other slug keys"
metrics:
  duration: "~12 minutes"
  completed: "2026-05-04"
  tasks_completed: 3
  files_created: 2
  files_modified: 1
---

# Phase 03 Plan 02: Typed Analytics Wrapper + Survey Map Summary

**One-liner:** Typed PostHog analytics wrapper with 11-event EventName union, discriminated EventProps lookup, four exported functions, and compile-time-exhaustive survey-id map skeleton — zero new npm dependencies.

## Tasks Completed

| # | Name | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Typed analytics wrapper (analytics.ts) | 0f334aa | src/lib/analytics.ts (115 lines) |
| 2 | Survey config map skeleton (surveys.ts) | 4772ce5 | src/lib/surveys.ts (75 lines) |
| 3 | analytics-audit script in package.json | c82ccfd | package.json |

## Artifacts Created

### src/lib/analytics.ts (115 lines)

All 11 EventName members confirmed:
- `'page:home_view'`
- `'nav:link_click'`
- `'card:open'`
- `'card:cta_external_click'`
- `'form:open'`
- `'form:abandon'`
- `'form:submit'`
- `'problem_pitch:submit'`
- `'diagram:view'`
- `'educator:scroll_complete'`
- `'footer:link_click'`

Four exported functions: `track`, `identify`, `captureSurveyResponse`, `captureProblemPitch`

No `import 'posthog-js'` — wrapper reads `window.posthog` via `declare global` augmentation.

### src/lib/surveys.ts (75 lines)

All 5 ProductId slugs confirmed:
- `'scientific-paper-agent'`
- `'triage-router-bot'`
- `'recorder-extractor'`
- `'agentic-employees'`
- `'delegate'`

buggerd intentionally absent (no interest form — CTA is external).
18 `PASTE_*` placeholder strings present (exceeds required minimum of 15).

### package.json scripts.analytics-audit

- Greps `src/` for `(window\.)?posthog\.capture\(` excluding `src/lib/analytics.ts` and `// ALLOW` opt-out lines
- Currently passes with exit 0 and "Analytics audit PASSED."
- Zero new npm dependencies added

## Verification Results

All 5 plan-level checks passed:
1. `astro check` — 0 errors
2. 5 wrapper exports present in analytics.ts
3. >= 15 PASTE_ placeholders in surveys.ts
4. `npm run analytics-audit` exits 0
5. Zero new dependencies in package.json

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SurveyResponseProps TypeScript cast error**
- **Found during:** Task 1 verification (`astro check`)
- **Issue:** `props as Record<string, unknown>` rejected — `SurveyResponseProps` has a template-literal index signature `[key: \`$survey_response_${string}\`]` which doesn't satisfy `string` indexing under strict TS
- **Fix:** Changed cast to `props as unknown as Record<string, unknown>` — double-cast via `unknown` is the idiomatic TS workaround
- **Files modified:** src/lib/analytics.ts line 103
- **Commit:** 0f334aa (fix included in same commit)

**2. [Style] Quoted 'delegate' object key for grep-audit consistency**
- **Found during:** Task 2 acceptance verification
- **Issue:** `delegate:` (bare identifier) is syntactically valid but failed `grep "'delegate':"` acceptance check used in plan verification
- **Fix:** Changed to `'delegate':` (quoted) to match the pattern of the other hyphenated keys
- **Files modified:** src/lib/surveys.ts

## Plan 03-03 Unblocked

Consumers can now import from the typed wrapper:
```ts
import { track, identify, captureSurveyResponse, captureProblemPitch } from '../../lib/analytics';
import { getSurveyConfig, type ProductId } from '../../lib/surveys';
```

Plan 03-03's delegated click listener in Base.astro can `import { track }`.
Plan 03-04's InterestForm.astro submit handler can use all four functions.
Plan 03-05 verification chain can run `npm run analytics-audit` as a gate.

## Known Stubs

None that block this plan's goal. The PASTE_* placeholders in surveys.ts are intentional and documented — Plan 03-04 replaces them after the user creates Surveys in the PostHog dashboard (User-Action Item 3).

## Self-Check: PASSED

- [x] src/lib/analytics.ts exists (115 lines)
- [x] src/lib/surveys.ts exists (75 lines)
- [x] package.json contains analytics-audit script
- [x] Commits 0f334aa, 4772ce5, c82ccfd all exist in git log
