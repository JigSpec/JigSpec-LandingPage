---
quick_id: 260503-oqq
type: execute
wave: 1
depends_on: []
autonomous: true
files_modified:
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/phases/03-ship-it/03-01-PLAN.md
  - .planning/phases/03-ship-it/03-02-PLAN.md
  - .planning/phases/03-ship-it/03-03-PLAN.md
  - .planning/phases/03-ship-it/03-04-PLAN.md
  - .planning/phases/03-ship-it/03-05-PLAN.md
  - .planning/phases/03-ship-it/03-06-PLAN.md
  - .planning/phases/03-ship-it/03-07-PLAN.md
  - .planning/phases/03-ship-it/03-08-PLAN.md
  - .planning/phases/03-ship-it/03-09-PLAN.md
  - .planning/phases/03-ship-it/03-RESEARCH.md
  - .planning/phases/03-ship-it/03-PATTERNS.md
  - .planning/phases/03-ship-it/03-VALIDATION.md
  - .planning/phases/04-apex-dns-cutover/

must_haves:
  truths:
    - "ROADMAP.md reflects 4 phases: phases 1+2 complete, phase 3 Ship It (9 plans, waves 1-5), phase 4 Apex DNS Cutover"
    - "All 9 PLAN.md files exist under .planning/phases/03-ship-it/ with renumbered filenames"
    - "STATE.md reflects total_phases: 4, total_plans: 14 (9 in phase 3, 1 TBD in phase 4)"
    - "Old phase directories 03-analytics-forms-notifications and 04-diagrams-polish-preview-soak are removed"
---

<objective>
Collapse the current Phase 3 (Analytics, Forms & Notifications, 5 plans) and Phase 4 (Diagrams, Polish & Preview Soak, 4 plans) into a single Phase 3 named "Ship It" with 9 sequentially-numbered plans. Rename the old Phase 5 (Apex DNS Cutover) to Phase 4. Update ROADMAP.md, STATE.md, and the filesystem to reflect the simplified 4-phase structure.

Purpose: The landing page doesn't need enterprise-grade phase segmentation. Merging the two "build it out and ship it" phases into one "Ship It" phase removes cognitive overhead and reflects reality.
Output: Reorganized .planning/phases/ directory, updated ROADMAP.md and STATE.md.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Merge phase directories and renumber PLAN files</name>
  <files>
    .planning/phases/03-ship-it/ (new directory with all 9 plans)
    .planning/phases/04-apex-dns-cutover/ (renamed from 05)
  </files>
  <action>
Create the merged phase directory and copy all plan files with renumbered names. Then remove the old directories.

Step 1 — Create new merged directory:
```
mkdir -p .planning/phases/03-ship-it
```

Step 2 — Copy old Phase 3 plans (03-01 through 03-05) keeping their numbers:
```
cp .planning/phases/03-analytics-forms-notifications/03-01-PLAN.md .planning/phases/03-ship-it/03-01-PLAN.md
cp .planning/phases/03-analytics-forms-notifications/03-02-PLAN.md .planning/phases/03-ship-it/03-02-PLAN.md
cp .planning/phases/03-analytics-forms-notifications/03-03-PLAN.md .planning/phases/03-ship-it/03-03-PLAN.md
cp .planning/phases/03-analytics-forms-notifications/03-04-PLAN.md .planning/phases/03-ship-it/03-04-PLAN.md
cp .planning/phases/03-analytics-forms-notifications/03-05-PLAN.md .planning/phases/03-ship-it/03-05-PLAN.md
cp .planning/phases/03-analytics-forms-notifications/03-RESEARCH.md .planning/phases/03-ship-it/03-RESEARCH.md
```

Step 3 — Copy old Phase 4 plans, renumbering them 06-09 (04-01 → 03-06, 04-02 → 03-07, 04-03 → 03-08, 04-04 → 03-09):
```
cp .planning/phases/04-diagrams-polish-preview-soak/04-01-PLAN.md .planning/phases/03-ship-it/03-06-PLAN.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-02-PLAN.md .planning/phases/03-ship-it/03-07-PLAN.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-03-PLAN.md .planning/phases/03-ship-it/03-08-PLAN.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-04-PLAN.md .planning/phases/03-ship-it/03-09-PLAN.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-PATTERNS.md .planning/phases/03-ship-it/03-PATTERNS.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-RESEARCH.md .planning/phases/03-ship-it/03-RESEARCH-diagrams.md
cp .planning/phases/04-diagrams-polish-preview-soak/04-VALIDATION.md .planning/phases/03-ship-it/03-VALIDATION.md
```

Step 4 — In each of the four renumbered plan files (03-06 through 03-09), update the `phase:` frontmatter field from `04-diagrams-polish-preview-soak` to `03-ship-it` and update the `plan:` number (04 → 06, 07, 08, 09 respectively). Also update the `depends_on:` references: any reference to `04-0N` becomes `03-0N` (e.g. `04-01` → `03-06`, `04-02` → `03-07`, `04-03` → `03-08`). Also update the output SUMMARY path at the bottom of each plan from `.planning/phases/04-diagrams-polish-preview-soak/{04-0N}-SUMMARY.md` to `.planning/phases/03-ship-it/03-0{N}-SUMMARY.md`.

Step 5 — Create the new Phase 4 directory for the renamed DNS Cutover phase (currently "Phase 5" with no PLAN files yet — it's TBD):
```
mkdir -p .planning/phases/04-apex-dns-cutover
```

Step 6 — Remove old directories:
```
rm -rf .planning/phases/03-analytics-forms-notifications
rm -rf .planning/phases/04-diagrams-polish-preview-soak
```

Note: the old Phase 5 (`05-apex-dns-cutover`) directory does NOT exist on disk (it was TBD/unplanned), so no rename is needed — just the new `04-apex-dns-cutover` directory created in Step 5.
  </action>
  <verify>
    <automated>
ls .planning/phases/ && echo "---" && ls .planning/phases/03-ship-it/ && echo "---" && ls .planning/phases/04-apex-dns-cutover/
    </automated>
  </verify>
  <done>
    - `.planning/phases/` contains exactly: 01-scaffold-sketches-visual-shell, 02-content-static-page, 03-ship-it, 04-apex-dns-cutover
    - `.planning/phases/03-ship-it/` contains 03-01-PLAN.md through 03-09-PLAN.md plus support files
    - `.planning/phases/04-apex-dns-cutover/` exists (empty, plans TBD)
    - Old directories 03-analytics-forms-notifications and 04-diagrams-polish-preview-soak are gone
  </done>
</task>

<task type="auto">
  <name>Task 2: Update ROADMAP.md and STATE.md</name>
  <files>
    .planning/ROADMAP.md
    .planning/STATE.md
  </files>
  <action>
Rewrite the planning documents to reflect the new 4-phase structure.

**ROADMAP.md changes:**

1. Update the Overview paragraph — remove references to "five phases" / "Phase 4 gates" / "Phase 5 gates"; replace with: "The JigSpec landing page is built in four phases..." keeping the substance of each gate description but collapsing "Phase 3 gates demand-signal contamination" and "Phase 4 gates Mermaid degradation and final polish" into a single sentence for the new Phase 3 ("Phase 3 gates demand-signal contamination, Mermaid degradation, and final polish"); rename old Phase 5 logic to Phase 4.

2. Update the phase bullet list to 4 entries:
   - Phase 1: (unchanged)
   - Phase 2: (unchanged)
   - Phase 3: "Ship It" — consolidate the goals of old Phase 3 and Phase 4 into one short description covering analytics + forms + notifications + diagrams + polish + preview soak.
   - Phase 4: "Apex DNS Cutover (Gated)" — unchanged content, renumbered.

3. Update Phase Details section:
   - Keep Phase 1 and Phase 2 sections unchanged.
   - Replace the separate "Phase 3: Analytics, Forms & Notifications" and "Phase 4: Diagrams, Polish & Preview Soak" sections with a single combined section:

   ```
   ### Phase 3: Ship It
   **Goal**: Analytics, forms, notifications, Mermaid diagrams, and full polish land together — the page captures clean demand signal, both diagrams render without tanking initial paint, an external cold-read confirms positioning, and the production build soaks at the preview URL for ≥24h before cutover is considered.
   **Depends on**: Phase 2
   **Requirements**: ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, ANALYTICS-04, ANALYTICS-05, DEMAND-01, DEMAND-02, DEMAND-03, DEMAND-04, DEMAND-05, DIAGRAM-01, DIAGRAM-02, DIAGRAM-03, DIAGRAM-04, DIAGRAM-05, VISUAL-05
   **Success Criteria** (what must be TRUE):
     [Numbered list combining all success criteria from old Phase 3 SC#1-5 and old Phase 4 SC#1-5, renumbered 1-10]
   **Plans:** 9 plans
   Plans:
   - [ ] 03-01-PLAN.md — [copy old 03-01 objective line]
   - [ ] 03-02-PLAN.md — [copy old 03-02 objective line]
   - [ ] 03-03-PLAN.md — [copy old 03-03 objective line]
   - [ ] 03-04-PLAN.md — [copy old 03-04 objective line]
   - [ ] 03-05-PLAN.md — [copy old 03-05 objective line]
   - [ ] 03-06-PLAN.md — [copy old 04-01 objective line, renumbered]
   - [ ] 03-07-PLAN.md — [copy old 04-02 objective line, renumbered]
   - [ ] 03-08-PLAN.md — [copy old 04-03 objective line, renumbered]
   - [ ] 03-09-PLAN.md — [copy old 04-04 objective line, renumbered]
   **UI hint**: yes
   ```

   - Rename the "Phase 5: Apex DNS Cutover" section to "Phase 4: Apex DNS Cutover (Gated)" — content unchanged, just renumbered throughout.

4. Update the Progress table at the bottom to 4 rows:
   ```
   | Phase | Plans Complete | Status | Completed |
   |-------|----------------|--------|-----------|
   | 1. Scaffold, Sketches & Visual Shell | 0/TBD | Not started | - |
   | 2. Content & Static Page | 0/5 | Not started | - |
   | 3. Ship It | 0/9 | Not started | - |
   | 4. Apex DNS Cutover (Gated) | 0/TBD | Not started | - |
   ```

**STATE.md changes:**

Update the frontmatter and body to reflect 4 phases and 14 total plans:

Frontmatter:
```yaml
total_phases: 4
total_plans: 14
completed_plans: 9
percent: 64
```

Body — update "Current Position" section:
- Phase: still `02 (content-static-page) — EXECUTING` (phases 1+2 are complete as noted)
- Update the note "Last activity" to: `2026-05-03 -- Collapsed phases 3+4 into Phase 3 Ship It; Phase 5 renumbered to Phase 4`

Update "Blockers/Concerns" — the Phase 5 reference becomes Phase 4:
- Change "Phase 5 cutover prerequisite" to "Phase 4 cutover prerequisite"

No other STATE.md changes needed.
  </action>
  <verify>
    <automated>
grep -c "Phase 3: Ship It" /Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/ROADMAP.md && grep -c "Phase 4: Apex DNS" /Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/ROADMAP.md && grep "total_phases" /Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/STATE.md
    </automated>
  </verify>
  <done>
    - ROADMAP.md has exactly 4 phase entries; no reference to old "Phase 5" or separate "Phase 3: Analytics" / "Phase 4: Diagrams" sections
    - Phase 3 "Ship It" plan list shows 9 plans (03-01 through 03-09)
    - STATE.md frontmatter shows total_phases: 4, total_plans: 14
    - "Phase 4 cutover prerequisite" in STATE.md Blockers (not Phase 5)
  </done>
</task>

</tasks>

<verification>
After both tasks complete:

1. `ls .planning/phases/` returns exactly 4 directories: 01-scaffold-sketches-visual-shell, 02-content-static-page, 03-ship-it, 04-apex-dns-cutover
2. `ls .planning/phases/03-ship-it/*.md | wc -l` returns 10 or more (9 plans + support files)
3. ROADMAP.md contains no heading "Phase 3: Analytics" or "Phase 4: Diagrams" or "Phase 5:"
4. ROADMAP.md contains "Phase 3: Ship It" and "Phase 4: Apex DNS Cutover"
5. STATE.md `total_phases` is 4
</verification>

<success_criteria>
The .planning directory reflects a clean 4-phase structure. All 9 plan files are present under 03-ship-it/ with sequential numbering. ROADMAP.md and STATE.md are internally consistent. No old phase directory names remain.
</success_criteria>

<output>
No SUMMARY file needed for this quick task — it is a planning-document reorganization only.
</output>
