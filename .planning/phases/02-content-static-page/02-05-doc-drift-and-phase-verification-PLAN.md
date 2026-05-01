---
id: 02-05
phase: 02-content-static-page
plan: 05
type: execute
wave: 4
depends_on: [02-01, 02-02, 02-03, 02-04]
files_modified:
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - package.json
autonomous: false
requirements: [TECH-02, CONTENT-08]
tags: [docs, honesty-audit, verification, doc-drift, phase-gate]
must_haves:
  truths:
    - "REQUIREMENTS.md TECH-02 references `src/content.config.ts` (NOT `src/content/config.ts`) — Astro 6 path drift fixed"
    - "ROADMAP.md Phase 2 success criterion 4 references `src/content.config.ts` (NOT `src/content/config.ts`)"
    - "An `npm run honesty-audit` script exists in package.json that exits non-zero on any forbidden marketing-speak phrase"
    - "Honesty audit run across all of `src/` and `.planning/phases/02-content-static-page/` returns 0 forbidden-word hits"
    - "`npm run build` produces a green build with index.html (home) + 5 product detail pages + 0 buggerd detail page"
    - "A self-cold-read sketch of what the page communicates about JigSpec (in 60 seconds) is recorded in this plan's SUMMARY (ROADMAP Phase 2 SC#5 — self-cold-read interpretation, real cold-read deferred to Phase 4 VISUAL-05)"
    - "User checkpoint: human visits dist/index.html in browser preview and confirms the page communicates 'agentic AI studio with reliability claim' before Phase 3 begins (per ROADMAP Phase 2 SC#5)"
  artifacts:
    - path: .planning/REQUIREMENTS.md
      provides: "TECH-02 with corrected src/content.config.ts path"
      contains: "src/content.config.ts"
    - path: .planning/ROADMAP.md
      provides: "Phase 2 SC#4 with corrected src/content.config.ts path"
      contains: "src/content.config.ts"
    - path: package.json
      provides: "npm run honesty-audit script"
      contains: "honesty-audit"
  key_links:
    - from: ".planning/REQUIREMENTS.md TECH-02"
      to: "src/content.config.ts (the actual file)"
      via: "literal path reference"
      pattern: "src/content.config.ts"
    - from: "package.json scripts.honesty-audit"
      to: "src/ + .planning/phases/02-content-static-page/"
      via: "grep blocklist of forbidden marketing phrases"
      pattern: "trusted by|fortune 500"
---

<objective>
Close Phase 2 by patching the documentation drift surfaced in 02-RESEARCH.md (`src/content/config.ts` → `src/content.config.ts`), wiring an `npm run honesty-audit` script that codifies the CONTENT-08 grep blocklist as a repeatable check, running the full Phase 2 verification chain end-to-end (build clean + 5 detail pages + 1 home page + honesty audit clean), and pausing for a human checkpoint where the user reviews the live preview and confirms Phase 2's narrative goal landed (the cold-read 60-second test from ROADMAP Phase 2 SC#5).

Purpose: Phase 2 has two trailing concerns that don't belong on any of the 4 build plans. First, the doc-drift between REQUIREMENTS.md/ROADMAP.md and the Astro 6 reality (a one-off fix, but if not done, every future plan that re-reads these files will reproduce the wrong path — see Pitfall 2). Second, CONTENT-08's honesty audit is a recurring check, not a one-off — codifying it as `npm run honesty-audit` makes Phase 4 polish + future copy passes cheap. Third, ROADMAP Phase 2 SC#5 requires a 60-second cold-read confirmation before Phase 3 begins; a human checkpoint here is the right gate.

Output: Patched docs, wired honesty audit script, green build verified end-to-end, human-confirmed Phase 2 communicates JigSpec's positioning.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/02-content-static-page/02-RESEARCH.md
@.planning/phases/02-content-static-page/02-01-content-collection-PLAN.md
@.planning/phases/02-content-static-page/02-02-section-and-card-components-PLAN.md
@.planning/phases/02-content-static-page/02-03-index-composition-PLAN.md
@.planning/phases/02-content-static-page/02-04-product-detail-route-PLAN.md
@CLAUDE.md
@package.json

<interfaces>
<!-- Existing package.json scripts (Phase 1 carryover): -->
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

<!-- The honesty audit blocklist (canonical SaaS-marketing fail-words from 02-RESEARCH.md Pitfall 4 + § Honesty Audit Checklist): -->
- trusted by
- fortune 500
- industry-leading
- world-class
- best-in-class
- cutting-edge
- revolutionary
- game-changing
- unparalleled
- enterprise-grade

<!-- The doc-drift exact strings (per 02-RESEARCH.md Pitfall 2 + § State of the Art): -->
- REQUIREMENTS.md TECH-02 line currently says `src/content/config.ts` — should be `src/content.config.ts`
- ROADMAP.md Phase 2 SC#4 currently says `src/content/config.ts` — should be `src/content.config.ts`
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Patch doc drift in REQUIREMENTS.md and ROADMAP.md (src/content.config.ts path)</name>
  <files>.planning/REQUIREMENTS.md, .planning/ROADMAP.md</files>
  <read_first>
    - .planning/REQUIREMENTS.md (line ~57 — TECH-02 currently references `src/content/config.ts`)
    - .planning/ROADMAP.md (line ~43 — Phase 2 SC#4 currently references `src/content/config.ts`)
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pitfall 2 + § State of the Art lines 754-766 — drift identified, fix specified)
    - src/content.config.ts (the actual file, confirms the correct path)
  </read_first>
  <action>
Use the Edit tool (not sed) to make the following two minimal patches. These are documentation-only changes — no source code is touched.

**Patch 1: `.planning/REQUIREMENTS.md` TECH-02 line.**

Find the existing line (current text in line 57):
```
- [x] **TECH-02**: `src/content/products/` content collection with one Markdown file per product, validated by a Zod schema with discriminated-union `cta` field (`external` for buggerd, `interest` for the others); `src/content/config.ts` also reserves an empty `blog` collection schema so v2 blog ships without re-platform
```

Replace with the EXACT same line but with `src/content/config.ts` swapped to `src/content.config.ts`:
```
- [x] **TECH-02**: `src/content/products/` content collection with one Markdown file per product, validated by a Zod schema with discriminated-union `cta` field (`external` for buggerd, `interest` for the others); `src/content.config.ts` also reserves an empty `blog` collection schema so v2 blog ships without re-platform
```

(NOTE: also flip the `[ ]` to `[x]` to mark TECH-02 complete — Phase 2 closes this requirement.)

**Patch 2: `.planning/ROADMAP.md` Phase 2 SC#4 line.**

Find the existing line (line 43):
```
  4. `pages/index.astro` is composition-only — imports section components in narrative order, contains zero business logic and zero inline data; `src/content/config.ts` also reserves an empty `blog` collection schema so v2 ships without re-platform.
```

Replace with the EXACT same line but with `src/content/config.ts` → `src/content.config.ts`:
```
  4. `pages/index.astro` is composition-only — imports section components in narrative order, contains zero business logic and zero inline data; `src/content.config.ts` also reserves an empty `blog` collection schema so v2 ships without re-platform.
```

Locked rules:
1. ONLY change the path string. Do not edit anything else in either file.
2. Use the Edit tool (not Bash sed). Both edits are single-line, exact-match swaps — Edit handles them cleanly.
3. After patching, the legacy `src/content/config.ts` string MUST appear ZERO times in REQUIREMENTS.md and ROADMAP.md (verify via grep). The new `src/content.config.ts` string MUST appear at least once in each.
4. Do NOT touch the REQUIREMENTS.md `[ ]`/`[x]` checkboxes for any other requirement. ONLY TECH-02 flips this plan.
  </action>
  <verify>
    <automated>! grep -q 'src/content/config.ts' .planning/REQUIREMENTS.md && ! grep -q 'src/content/config.ts' .planning/ROADMAP.md && grep -q 'src/content.config.ts' .planning/REQUIREMENTS.md && grep -q 'src/content.config.ts' .planning/ROADMAP.md && grep -q '\[x\] \*\*TECH-02\*\*' .planning/REQUIREMENTS.md && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - The string `src/content/config.ts` appears ZERO times in `.planning/REQUIREMENTS.md`
    - The string `src/content/config.ts` appears ZERO times in `.planning/ROADMAP.md`
    - The string `src/content.config.ts` appears at least once in each file
    - REQUIREMENTS.md TECH-02 is now marked `[x]` (Phase 2 closes it)
    - No other `[ ]`/`[x]` flips occurred in REQUIREMENTS.md (compare line-count of `[x]` before/after — should differ by exactly 1, the TECH-02 flip)
    - No source files (`src/`, `package.json`, `astro.config.mjs`) were modified by this task
  </acceptance_criteria>
  <done>Documentation drift is fixed: both REQUIREMENTS.md and ROADMAP.md reference the correct Astro 6 content config path, and TECH-02 is marked complete.</done>
</task>

<task type="auto">
  <name>Task 2: Wire `npm run honesty-audit` script and run it across the project</name>
  <files>package.json</files>
  <read_first>
    - package.json (current scripts block — Phase 1 has dev/build/preview/astro)
    - .planning/phases/02-content-static-page/02-RESEARCH.md (§ Honesty Audit Checklist lines 840-857; Pitfall 4 lines 654-658)
    - .planning/REQUIREMENTS.md (CONTENT-08 — honesty constraint verbatim)
  </read_first>
  <action>
Edit `package.json` to add an `honesty-audit` script under `scripts`. The script greps the source tree for forbidden marketing-speak phrases (case-insensitive) and exits non-zero if any match.

Use the Edit tool to add the new script line. The exact target script (single line, JSON-escaped):

```json
"honesty-audit": "if grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/ ; then echo '\\nHonesty audit FAILED — see hits above. See CONTENT-08 + Pitfall 4 in 02-RESEARCH.md.' && exit 1 ; else echo 'Honesty audit PASSED.' ; fi"
```

After adding, the `scripts` block in package.json should look like:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "honesty-audit": "if grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/ ; then echo '\\nHonesty audit FAILED — see hits above. See CONTENT-08 + Pitfall 4 in 02-RESEARCH.md.' && exit 1 ; else echo 'Honesty audit PASSED.' ; fi"
}
```

Locked rules:
1. The blocklist is case-insensitive (`-i` in grep) and uses extended-regex alternation (`-E`).
2. The script greps `src/` only — the .planning/ tree is research/planning prose and may legitimately use these words in audit-discussion context (this very PLAN.md and 02-RESEARCH.md mention them as the blocklist). DO NOT extend the audit to `.planning/`.
3. The `exit 1` on match is critical — Phase 4 polish + future copy passes can run `npm run honesty-audit` as a pre-commit gate.
4. Use Edit, not Bash heredoc. The JSON is a single line in the value position; Edit is the right tool.

After editing, run the script and confirm it PASSES against the current `src/` tree:

```bash
npm run honesty-audit
```

Expected output: `Honesty audit PASSED.` and exit code 0. If it fails, an executor mistake from 02-01 / 02-02 / 02-03 / 02-04 leaked a forbidden word — fix at the source, do NOT modify the audit blocklist to silence it.
  </action>
  <verify>
    <automated>grep -q '"honesty-audit"' package.json && grep -q 'trusted by|fortune 500' package.json && npm run honesty-audit 2>&1 | tee /tmp/02-05-honesty.log | grep -q 'Honesty audit PASSED' && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - `package.json` contains a `honesty-audit` key under `scripts` (grep)
    - The script body contains the alternation pattern `trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade` (grep)
    - Running `npm run honesty-audit` prints `Honesty audit PASSED.` and exits 0
    - The script greps `src/` only (NOT `.planning/`)
    - `package.json` is still valid JSON: `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` exits 0
    - No other scripts are removed or modified (the existing `dev`/`build`/`preview`/`astro` keys remain unchanged — diff check)
  </acceptance_criteria>
  <done>The honesty audit is codified as a repeatable npm script that passes against the current Phase 2 source tree.</done>
</task>

<task type="auto">
  <name>Task 3: Run the integrated Phase 2 verification chain end-to-end</name>
  <files>(no source files modified — verification only)</files>
  <read_first>
    - .planning/REQUIREMENTS.md (TECH-02..04 + CONTENT-01..09 acceptance verbatim — all should be checkable now)
    - .planning/ROADMAP.md (Phase 2 success criteria 1-6 verbatim)
    - .planning/phases/02-content-static-page/02-01-content-collection-PLAN.md (must_haves)
    - .planning/phases/02-content-static-page/02-02-section-and-card-components-PLAN.md (must_haves)
    - .planning/phases/02-content-static-page/02-03-index-composition-PLAN.md (must_haves)
    - .planning/phases/02-content-static-page/02-04-product-detail-route-PLAN.md (must_haves)
  </read_first>
  <action>
Run the full Phase 2 verification chain. This is a verification task — no source files modified.

```bash
# 1. Source hygiene
test -f src/content.config.ts
test ! -e src/content/config.ts
ls src/content/products/*.md | wc -l                                # 6
ls src/components/sections/*.astro | wc -l                          # 4
ls src/components/cards/*.astro | wc -l                             # 2
ls src/components/forms/*.astro | wc -l                             # 2
ls src/components/diagrams/*.astro | wc -l                          # 1
test -f 'src/pages/products/[slug].astro'

# 2. No new dependencies (02-RESEARCH.md § Standard Stack — Phase 2 ships ZERO new deps)
! grep -q '@astrojs/mdx' package.json
! grep -q 'posthog-js' package.json
! grep -q 'astro-mermaid' package.json
! grep -q '@astrojs/sitemap' package.json

# 3. Type checks pass
npx astro check 2>&1 | tee /tmp/02-05-astro-check.log | grep -qE 'Result \(.*\): 0 errors'

# 4. Build is green
rm -rf dist/
npm run build 2>&1 | tee /tmp/02-05-build.log | grep -qE 'Astro v6\.'
! grep -qi 'error' /tmp/02-05-build.log

# 5. Home page exists with all sections (CONTENT-01..06 + CONTENT-07 footer)
test -f dist/index.html
grep -q 'id="agentic-ai"' dist/index.html
grep -q 'id="products"' dist/index.html
grep -q 'id="problem-pitch"' dist/index.html
[ "$(grep -oE '>Shipping<' dist/index.html | wc -l)" = "1" ]
[ "$(grep -oE '>Probe<'    dist/index.html | wc -l)" = "4" ]
[ "$(grep -oE '>Sibling<'  dist/index.html | wc -l)" = "1" ]
[ "$(grep -oE 'data-event="card:open"' dist/index.html | wc -l)" = "5" ]
[ "$(grep -oE 'data-event="card:cta_external_click"' dist/index.html | wc -l)" = "1" ]
grep -q 'hi@jigspec.com' dist/index.html
grep -q 'github.com/JigSpec' dist/index.html

# 6. Detail pages: exactly 5 (NOT 6) — Pitfall 7 fix
[ "$(ls -d dist/products/*/ 2>/dev/null | wc -l | tr -d ' ')" = "5" ]
test ! -e dist/products/buggerd
test -f dist/products/scientific-paper-agent/index.html
test -f dist/products/triage-router-bot/index.html
test -f dist/products/recorder-extractor/index.html
test -f dist/products/agentic-employees/index.html
test -f dist/products/delegate/index.html

# 7. Each detail page has its InterestForm placeholder with correct productId
for slug in scientific-paper-agent triage-router-bot recorder-extractor agentic-employees delegate; do
  grep -q "data-product-id=\"$slug\"" "dist/products/$slug/index.html"
  grep -q 'data-form="interest"' "dist/products/$slug/index.html"
done

# 8. Phase 2/3 boundary — NO PostHog references anywhere in dist/
! grep -riq 'posthog' dist/

# 9. Phase 2/4 boundary — NO mermaid runtime references in dist/ (placeholder uses static SVG/HTML only)
! grep -riq 'mermaid' dist/

# 10. Honesty audit
npm run honesty-audit 2>&1 | grep -q 'PASSED'

# 11. Tailwind 4 named-utility hygiene (Pitfall 6)
! grep -rE 'font-\[var\(' src/

# 12. Doc drift fixed (Task 1)
! grep -q 'src/content/config.ts' .planning/REQUIREMENTS.md
! grep -q 'src/content/config.ts' .planning/ROADMAP.md

echo ""
echo "============================================"
echo "PHASE 2 VERIFICATION CHAIN: PASSED"
echo "  - Source files: present"
echo "  - Zero new deps"
echo "  - astro check: 0 errors"
echo "  - Build: green"
echo "  - Home: 1 page with 6 cards (1 Shipping + 4 Probe + 1 Sibling)"
echo "  - Detail pages: 5 (buggerd correctly excluded)"
echo "  - InterestForm productId mapping: correct on all 5"
echo "  - Phase 2/3 boundary: no posthog refs"
echo "  - Phase 2/4 boundary: no mermaid runtime refs"
echo "  - Honesty audit: passed"
echo "  - Tailwind 4 named-utility hygiene: clean"
echo "  - Doc drift: fixed"
echo "============================================"
```

Then write a self-cold-read sketch in this plan's SUMMARY.md (to be created by the executor at end-of-plan): a 60-second cold-read interpretation of what `dist/index.html` communicates about JigSpec. The format is:

> After a context break, I read the page from top to bottom. In 60 seconds, the page told me:
> - JigSpec is **[X]** (1 sentence)
> - JigSpec's reliability/autonomy claim is differentiated by **[Y]** (1 sentence)
> - JigSpec is currently **[shipping/probing/exploring]** [Z products]
> - To engage further, I would **[click card / fill problem-pitch form / visit buggerd]** because **[reason]**.

This is the ROADMAP Phase 2 SC#5 self-cold-read; the real external cold-read is Phase 4 VISUAL-05.
  </action>
  <verify>
    <automated>test -f src/content.config.ts && test ! -e src/content/config.ts && [ "$(ls src/content/products/*.md 2>/dev/null | wc -l | tr -d ' ')" = "6" ] && ! grep -qE '@astrojs/mdx|posthog-js|astro-mermaid|@astrojs/sitemap' package.json && npx astro check 2>&1 | grep -qE 'Result \(.*\): 0 errors' && rm -rf dist/ && npm run build 2>&1 | tee /tmp/02-05-final-build.log | grep -qE 'Astro v6\.' && ! grep -qi 'error' /tmp/02-05-final-build.log && test -f dist/index.html && [ "$(ls -d dist/products/*/ 2>/dev/null | wc -l | tr -d ' ')" = "5" ] && test ! -e dist/products/buggerd && [ "$(grep -oE '>Shipping<' dist/index.html | wc -l)" = "1" ] && [ "$(grep -oE '>Probe<' dist/index.html | wc -l)" = "4" ] && [ "$(grep -oE '>Sibling<' dist/index.html | wc -l)" = "1" ] && ! grep -riq 'posthog' dist/ && ! grep -riq 'mermaid' dist/ && npm run honesty-audit 2>&1 | grep -q 'PASSED' && ! grep -rE 'font-\[var\(' src/ && ! grep -q 'src/content/config.ts' .planning/REQUIREMENTS.md && ! grep -q 'src/content/config.ts' .planning/ROADMAP.md && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - All 12 numbered checks above pass (each is verifiable via grep / test / count)
    - Specifically: Phase 2 ships ZERO new dependencies (no @astrojs/mdx, no posthog-js, no astro-mermaid, no @astrojs/sitemap in package.json)
    - `astro check` reports 0 errors
    - `npm run build` is clean
    - 1 home page, 5 detail pages, 0 buggerd detail page
    - Stage badge counts on home: 1 Shipping, 4 Probe, 1 Sibling
    - data-event counts on home: 5 card:open, 1 card:cta_external_click
    - InterestForm productId mapping verified on all 5 detail pages
    - No posthog or mermaid runtime references anywhere in `dist/`
    - Honesty audit passes
    - Doc drift fixed
  </acceptance_criteria>
  <done>The integrated Phase 2 verification chain passes end-to-end. All 12 phase requirements (TECH-02/03/04 + CONTENT-01..09) are satisfied at the file level. Ready for the user-checkpoint cold-read in Task 4.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Human cold-read of the live preview (ROADMAP Phase 2 SC#5 gate)</name>
  <files>(no source files modified — human verification only)</files>
  <action>Pause for the user to open the live preview in a browser and confirm the 60-second cold-read test (ROADMAP Phase 2 SC#5) before Phase 3 begins. The user verifies the page, badges, card-click behavior, detail pages, problem-pitch form, and footer per the steps in &lt;how-to-verify&gt; below. The executor MUST NOT proceed to commit/finalize this plan until the user replies with one of the &lt;resume-signal&gt; phrases.</action>
  <verify><automated>echo "human checkpoint — see resume-signal output"</automated></verify>
  <done>User has replied with "approved", "approved with notes: [text]", or "iterate: [what is wrong]". The first two close Phase 2 and unlock Phase 3 planning; the third sends the executor back to a specific component or copy section.</done>
  <what-built>
    Phase 2 ships:
    - Typed content collection at `src/content.config.ts` (Astro 6 path) with 6 product markdown files in narrative order
    - 9 components under `src/components/` (sections/, cards/, forms/, diagrams/) with bracketed-placeholder Sketch B copy
    - Composition-only `src/pages/index.astro` rendering Hero → AgenticAIExplainer → ProductGrid → ProblemPitchSection
    - Single dynamic-route at `src/pages/products/[slug].astro` rendering 5 concept-stage detail pages (buggerd correctly excluded)
    - Whole-card-clickable Heydon Pickering pattern with declarative `data-event` attributes (Phase 3 wiring hook)
    - Form-shaped placeholders (real `<form>` markup, all inputs disabled, no `action` attribute) — Phase 3 swaps in PostHog Surveys + bare `posthog.capture('problem_pitch')`
    - MermaidDiagram placeholder shell at `src/components/diagrams/MermaidDiagram.astro` (Phase 4 wires astro-mermaid)
    - Doc drift fixed (`src/content/config.ts` → `src/content.config.ts` in REQUIREMENTS.md + ROADMAP.md)
    - `npm run honesty-audit` script wired and passing
    - Zero new dependencies vs Phase 1 (`@astrojs/mdx`, `posthog-js`, `astro-mermaid`, `@astrojs/sitemap` all deferred)
  </what-built>
  <how-to-verify>
    1. Start a local preview: `npm run preview` (after Task 3's `npm run build` already ran)
    2. Open the local preview URL printed in the terminal (typically `http://localhost:4321/`)
    3. Verify the home page (60-second cold-read test — ROADMAP Phase 2 SC#5):
       - Read the page top-to-bottom in your browser without scrolling back
       - Within 60 seconds, you should be able to articulate: (a) what JigSpec does, (b) how JigSpec's reliability/autonomy claim differs from generic agentic-AI noise, (c) what JigSpec is shipping vs probing vs sibling
       - If the answer to any of (a)/(b)/(c) is unclear, the bracketed-placeholder copy needs iteration before Phase 3 begins (this is the explicit Phase 2 SC#5 gate)
    4. Verify the 6 product cards visible in a 1/2/3-column responsive grid:
       - Resize the browser to 320px width — cards stack 1-up
       - Resize to 768px — cards stack 2-up
       - Resize to 1024+ — cards lay out 3×2
       - Each card has a clearly-distinguishable stage badge (Shipping = filled accent, Probe = outlined accent, Sibling = muted text)
    5. Verify card click behavior:
       - Click anywhere on the buggerd card — opens https://buggerd.com in a new tab
       - Click anywhere on the Scientific paper agent card — navigates to /products/scientific-paper-agent on this site
       - Click on a card via keyboard Tab + Enter — focus ring is visible on the entire card border
    6. Verify a detail page (e.g., /products/scientific-paper-agent):
       - Stage label shows "Probe"
       - Headline + tagline + Markdown body all rendered
       - InterestForm placeholder is visible with disabled inputs and a submit button reading "Wired in Phase 3"
       - Back-to-home link works
    7. Verify NO buggerd detail page:
       - Visit /products/buggerd directly — should 404 (Pitfall 7)
    8. Verify the problem-pitch section on the home page:
       - Section heading is "Tell us a problem we should solve" (or the bracketed-placeholder equivalent)
       - Form is visible with disabled inputs and "Wired in Phase 3" submit button
    9. Verify Footer:
       - Docs link, hi@jigspec.com email, GitHub link all present
    10. (Optional) Click the Mermaid diagram placeholder in any future location — should show the dashed-border placeholder with "[Diagram — Phase 4]" copy. (Note: Plan 02-03 explicitly does NOT render MermaidDiagram on the home page — Phase 4 inserts it.)

    If ANY of the above fails the bar, describe the specific issue. Common iteration paths:
    - Cold-read fails (a)/(b)/(c) → bracketed-placeholder copy in Hero / AgenticAIExplainer needs iteration
    - Stage badge tier confusing → adjust StageBadge.astro variant strings (Pattern 5 in 02-RESEARCH.md is the source-of-truth; UI tweak is acceptable within the locked palette)
    - Form looks broken (not "intentionally placeholder") → adjust the disabled-button copy from "Wired in Phase 3" to something more explicit
  </how-to-verify>
  <resume-signal>Type "approved" to close Phase 2 and proceed to Phase 3 planning. Type "iterate: [what's wrong]" to send the planner back to a specific component or copy section. Type "approved with notes: [text]" to proceed but record concerns in the SUMMARY for Phase 4 polish.</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Doc drift in REQUIREMENTS.md / ROADMAP.md → future plan reads | Wrong path silently breaks future content-collection plans (Pitfall 2). |
| package.json scripts → CI / pre-commit hooks | The honesty-audit script runs as a fail-fast gate; if the blocklist regex is malformed, the script silently passes everything. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-02-25 | Tampering | package.json invalid JSON after edit | Medium | mitigate | Task 2 acceptance: `node -e "JSON.parse(...)"` exits 0. Edit tool's exact-match prevents off-by-one issues. |
| T-02-26 | Repudiation | honesty-audit blocklist regex silently passes due to typo | Medium | mitigate | Task 2 verifies the script body contains the literal alternation pattern; running it against current src/ and getting "PASSED" output proves it terminates correctly. Future Phase 4 polish should add an intentional fail-test (e.g., temporarily inject "industry-leading" into a placeholder and confirm exit 1). |
| T-02-27 | Information Disclosure | Self-cold-read SUMMARY may inadvertently fabricate user-facing claims | Low | accept | Bracketed-placeholder copy means the cold-read interpretation is honest about what's currently bracketed. Phase 4 cold-read is the human gate. |
| T-02-28 | Denial of Service | npm run preview fails before user can checkpoint | Low | mitigate | Task 3 verified `npm run build` is green; preview just serves dist/. If preview fails, executor reports the error and pauses. |
| T-02-29 | Spoofing | Doc-drift fix accidentally introduces NEW drift (e.g., changes more lines than intended) | Low | mitigate | Task 1 acceptance: only 2 lines change — the path string in TECH-02 + the Phase 2 SC#4 line. Diff verifiable. |
</threat_model>

<verification>
After all 4 tasks complete:

```bash
# Doc drift fix
! grep -q 'src/content/config.ts' .planning/REQUIREMENTS.md
! grep -q 'src/content/config.ts' .planning/ROADMAP.md
grep -q 'src/content.config.ts' .planning/REQUIREMENTS.md
grep -q 'src/content.config.ts' .planning/ROADMAP.md

# Honesty audit script
npm run honesty-audit | grep -q 'PASSED'

# Full Phase 2 build chain
rm -rf dist/ && npm run build && ls -d dist/products/*/ | wc -l    # 5
test ! -e dist/products/buggerd

# Phase 2 boundary cleanliness
! grep -riq 'posthog' dist/
! grep -riq 'mermaid' dist/

# User checkpoint approved (resume-signal received)
```
</verification>

<success_criteria>
- REQUIREMENTS.md TECH-02 + ROADMAP.md Phase 2 SC#4 reference `src/content.config.ts` (TECH-02 doc fix; Pitfall 2 closed)
- TECH-02 marked `[x]` in REQUIREMENTS.md
- `npm run honesty-audit` script exists in package.json and passes against current `src/`
- Full Phase 2 build chain green: 1 home page + 5 detail pages + 0 buggerd detail page (CONTENT-08 + CONTENT-09)
- Zero new dependencies vs Phase 1
- Phase 2/3 boundary clean (no PostHog references in dist/)
- Phase 2/4 boundary clean (no Mermaid runtime references in dist/)
- User has reviewed the live preview and approved the cold-read positioning gate (ROADMAP Phase 2 SC#5)
</success_criteria>

<output>
After completion, create `.planning/phases/02-content-static-page/02-05-doc-drift-and-phase-verification-SUMMARY.md` documenting:
- The exact diff of REQUIREMENTS.md and ROADMAP.md (one path string per file + the TECH-02 checkbox flip)
- The exact `package.json` scripts block before/after
- The full output of the verification chain (Task 3) — paste the "PHASE 2 VERIFICATION CHAIN: PASSED" block
- The self-cold-read interpretation (Task 3 deliverable — the 4-bullet sketch)
- The user's checkpoint response (approved / iterate / approved-with-notes)
- Any iteration notes that defer to Phase 4 polish
- Confirmation Phase 2 closes 12 requirements: TECH-02, TECH-03, TECH-04, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-08, CONTENT-09
</output>
