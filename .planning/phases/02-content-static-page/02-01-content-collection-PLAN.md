---
id: 02-01
phase: 02-content-static-page
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content.config.ts
  - src/content/products/buggerd.md
  - src/content/products/scientific-paper-agent.md
  - src/content/products/triage-router-bot.md
  - src/content/products/recorder-extractor.md
  - src/content/products/agentic-employees.md
  - src/content/products/delegate.md
autonomous: true
requirements: [TECH-02]
tags: [astro, content-collections, zod, schema, products]
must_haves:
  truths:
    - "src/content.config.ts exists at the Astro 6 path (NOT src/content/config.ts) and exports `collections = { products, blog }`"
    - "Six product markdown files exist under src/content/products/, one per product, with valid frontmatter that passes the Zod schema"
    - "The Zod schema's cta field is a true z.discriminatedUnion('type', [...]) with z.literal('external') and z.literal('interest') branches"
    - "buggerd.md uses cta.type === 'external' with url: https://buggerd.com; the other 5 products use cta.type === 'interest'"
    - "stage values: buggerd → 'Shipping', delegate → 'Sibling', the four others → 'Probe'"
    - "An empty `blog` collection is reserved in the same config so v2 ships without re-platform (per ROADMAP Phase 2 SC#4)"
    - "`npm run build` (or `astro build`) completes without Zod validation errors and resolves the 6 products via getCollection"
  artifacts:
    - path: src/content.config.ts
      provides: "Typed content collection config (products + reserved blog)"
      contains: "z.discriminatedUnion"
    - path: src/content/products/buggerd.md
      provides: "buggerd product entry, cta.type=external"
      contains: "type: external"
    - path: src/content/products/scientific-paper-agent.md
      provides: "scientific-paper-agent product entry, cta.type=interest"
      contains: "type: interest"
    - path: src/content/products/triage-router-bot.md
      provides: "triage-router-bot product entry, cta.type=interest"
      contains: "type: interest"
    - path: src/content/products/recorder-extractor.md
      provides: "recorder-extractor product entry, cta.type=interest"
      contains: "type: interest"
    - path: src/content/products/agentic-employees.md
      provides: "agentic-employees product entry, cta.type=interest"
      contains: "type: interest"
    - path: src/content/products/delegate.md
      provides: "delegate product entry, cta.type=interest, stage=Sibling"
      contains: "stage: Sibling"
  key_links:
    - from: "src/content.config.ts"
      to: "src/content/products/*.md"
      via: "glob({ pattern: '**/*.md', base: './src/content/products' })"
      pattern: "loader: glob"
    - from: "src/content.config.ts"
      to: "astro/zod"
      via: "import { z } from 'astro/zod'"
      pattern: "from 'astro/zod'"
---

<objective>
Establish the typed content collection that every later Phase 2 task depends on: a single `src/content.config.ts` (Astro 6 path) defining a `products` collection with a Zod-validated frontmatter schema (including a discriminated `cta` union — `external` for buggerd, `interest` for the 5 concept cards), an empty `blog` collection reserved for v2, plus the 6 product markdown files with bracketed-placeholder copy in the locked Sketch B / Engineering-Blog Pragmatic voice.

Purpose: Phase 2 is composition-only on top of this collection. If the schema isn't typed correctly, every downstream task (`ProductCard`, `ProductGrid`, `[slug].astro`) inherits weak types and the `getStaticPaths` filter that excludes buggerd from `/products/[slug]` becomes a runtime check instead of a compile-time guarantee. This task locks both the file path (Astro 6 drift trap — see 02-RESEARCH.md Pitfall 2) and the discriminator literal (Pitfall 3).

Output: Type-safe content collection that `getCollection('products')` consumes, with all 6 products validated at build time.
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
@.planning/phases/02-content-static-page/02-RESEARCH.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-04-deploy-repo-vercel-SUMMARY.md
@CLAUDE.md
@package.json
@astro.config.mjs

<interfaces>
<!-- Astro 6 content layer surface area. Use these directly — do NOT explore Astro source. -->

From `astro:content` (Astro 6.1.10, VERIFIED via 02-RESEARCH.md):
```typescript
import { defineCollection, getCollection, render } from 'astro:content';
// NOTE: `z` is NOT exported from 'astro:content' in Astro 6 — see below.
```

From `astro/zod`:
```typescript
import { z } from 'astro/zod';   // Astro 6 path (NOT 'astro:content')
```

From `astro/loaders`:
```typescript
import { glob } from 'astro/loaders';
// Usage: loader: glob({ pattern: '**/*.md', base: './src/content/products' })
```

Phase 1 already-locked palette + type tokens (in `src/styles/global.css` `@theme` block) — no changes here, but markdown copy must avoid arbitrary `font-[var(...)]` forms when the markdown rendering lands in 02-04:
```
--color-bg: #FAFAF8 (Tailwind utility: bg-bg)
--color-fg: #18181B (text-fg)
--color-muted: #71717A (text-muted)
--color-accent: #6366F1 (text-accent / bg-accent / border-accent)
--font-display: 'Crimson Pro' (utility: font-display)
--font-body: 'Inter' (utility: font-body)
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create src/content.config.ts with products + reserved blog collections</name>
  <files>src/content.config.ts</files>
  <read_first>
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 1 — full file at lines 248-293; Pitfall 1, 2, 3 at lines 636-652)
    - astro.config.mjs (verify Astro 6.1.10, output: 'static', no integrations conflicts)
    - package.json (verify astro@^6.1.10, no @astrojs/mdx — Phase 2 deliberately skips it per 02-RESEARCH.md § Don't Hand-Roll)
  </read_first>
  <action>
Create `src/content.config.ts` (Astro 6 path — NOT `src/content/config.ts`; the legacy path was removed in Astro 6) with the EXACT following content:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const stage = z.enum(['Shipping', 'Probe', 'Sibling']);

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    stage,
    order: z.number().int().min(1).max(6),
    cta: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('external'),
        url: z.string().url(),
        label: z.string().default('Visit'),
      }),
      z.object({
        type: z.literal('interest'),
        label: z.string().default('Tell us'),
      }),
    ]),
    headline: z.string(),
  }),
});

// Reserve blog collection so v2 ships without re-platform — ROADMAP Phase 2 SC#4
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { products, blog };
```

Locked rules (from 02-RESEARCH.md):
1. File path is `src/content.config.ts`. NOT `src/content/config.ts`. The legacy path was removed in Astro 6 (Pitfall 2).
2. Import `z` from `'astro/zod'`. NOT `'astro:content'`. The latter was deprecated/removed in Astro 6 (Pitfall 1, CLAUDE.md "What NOT to Use").
3. The `cta` field MUST be a `z.discriminatedUnion('type', [...])` with `z.literal('external')` and `z.literal('interest')` literals. NOT `z.string()` (Pitfall 3 — silent fall-through).
4. Do NOT create the `src/content/blog/` directory yet — the empty glob is intentional for v2 readiness; Astro will resolve to an empty collection at build time without erroring.

Do NOT install `@astrojs/mdx`. Phase 2 explicitly skips it per 02-RESEARCH.md § Don't Hand-Roll. Plain `.md` works in collections without it.
  </action>
  <verify>
    <automated>test ! -e src/content/config.ts && test -f src/content.config.ts && grep -q "from 'astro/zod'" src/content.config.ts && grep -q "z.discriminatedUnion" src/content.config.ts && grep -q "z.literal('external')" src/content.config.ts && grep -q "z.literal('interest')" src/content.config.ts && grep -q "export const collections" src/content.config.ts && grep -q "blog" src/content.config.ts && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - File exists at exact path `src/content.config.ts` (verify with `test -f src/content.config.ts`)
    - Legacy path does NOT exist: `test ! -e src/content/config.ts` returns 0
    - Imports `z` from `'astro/zod'` (grep): `grep -q "import { z } from 'astro/zod'" src/content.config.ts`
    - File does NOT contain `from 'astro:content'` followed by `z` import: `! grep -E "import \\{[^}]*z[^}]*\\} from 'astro:content'" src/content.config.ts`
    - Uses `z.discriminatedUnion('type', [` exactly (grep returns 1+ match)
    - Both `z.literal('external')` and `z.literal('interest')` appear (grep each returns 1+ match)
    - `external` branch has `url: z.string().url()` (grep): `grep -q "z.string().url()" src/content.config.ts`
    - `external` branch has `label: z.string().default('Visit')` and `interest` branch has `label: z.string().default('Tell us')` (grep both)
    - `stage` enum lists exactly `['Shipping', 'Probe', 'Sibling']`: `grep -q "z.enum(\\['Shipping', 'Probe', 'Sibling'\\])" src/content.config.ts`
    - `order` field uses `z.number().int().min(1).max(6)` (grep)
    - Exports `collections` object with both `products` and `blog` keys (grep returns `export const collections = { products, blog };`)
    - File compiles under `npx astro check` without TS errors related to schema (note: `astro check` may flag missing markdown files until Task 2-7 land; that's fine — schema syntax must compile)
  </acceptance_criteria>
  <done>The Astro 6 content config file is in place at the correct path with a typed discriminated-union schema and a reserved blog collection. No `@astrojs/mdx` dependency added.</done>
</task>

<task type="auto">
  <name>Task 2: Create the 6 product markdown files with bracketed-placeholder copy</name>
  <files>src/content/products/buggerd.md, src/content/products/scientific-paper-agent.md, src/content/products/triage-router-bot.md, src/content/products/recorder-extractor.md, src/content/products/agentic-employees.md, src/content/products/delegate.md</files>
  <read_first>
    - src/content.config.ts (the schema you just wrote — frontmatter MUST satisfy it)
    - .planning/phases/02-content-static-page/02-RESEARCH.md (Pattern 1, Pitfall 4 at lines 654-658 for honesty constraint)
    - .planning/PROJECT.md (Key Decisions row D-23 carried forward — 6 products in narrative order; Sketch B voice; CONTENT-08 honesty constraint)
    - .planning/REQUIREMENTS.md (CONTENT-03 narrative order, CONTENT-04 stage badges, CONTENT-08 honesty)
  </read_first>
  <action>
Create exactly 6 markdown files under `src/content/products/`. Each file MUST have valid frontmatter satisfying the schema in Task 1 (`name`, `tagline`, `stage`, `order`, `cta`, `headline`) plus a 200–400 word body in bracketed-placeholder Sketch B / Engineering-Blog Pragmatic voice (continuing Phase 1 D-03). The body is rendered on `/products/[slug]` pages in Plan 02-04, so make it readable but honest — no testimonials, no fabricated metrics, no superlatives ("industry-leading", "trusted by", "world-class", etc.).

Each file MUST follow this exact frontmatter pattern. Bodies are 200–400 word bracketed-placeholder copy the executor writes. Each file ends with a blank line + body content.

**File 1: `src/content/products/buggerd.md`** (the ONLY external-cta product, stage Shipping, order 1):
```markdown
--- 
name: "buggerd"
tagline: "[Tagline placeholder — one-line buggerd description that names the agentic-CI claim, replace in copy pass]"
stage: "Shipping"
order: 1
cta:
  type: "external"
  url: "https://buggerd.com"
  label: "Visit buggerd.com"
headline: "[Buggerd detail-page headline — not used since buggerd has no on-site detail page, but required by the schema]"
--- 

[200–400 word body — buggerd is shipping, so this body is never rendered on JigSpec.com (getStaticPaths filters it out per CONTENT-09). Body kept here for schema completeness and so the same Markdown file format is reusable. Describe in bracketed-placeholder voice what buggerd does, who it's for, and what makes its agentic-CI loop reliable. No testimonials, no fabricated metrics, no superlatives.]
```

**File 2: `src/content/products/scientific-paper-agent.md`** (stage Probe, order 2, cta interest):
```markdown
--- 
name: "Scientific paper agent"
tagline: "[Tagline placeholder — one-line for a research-paper-extraction agent, replace in copy pass]"
stage: "Probe"
order: 2
cta:
  type: "interest"
  label: "Tell us"
headline: "[Scientific paper agent — falsifiable detail-page headline, replace in copy pass]"
--- 

[200–400 word body in bracketed-placeholder Sketch B voice. Describe the problem (researchers re-reading hundreds of papers), the agent's loop (find → extract → cross-reference → cite), what would make this reliable enough to trust (review-gate at extraction step, citation-back-to-source mandatory, no hallucinated DOIs), who would use it (academics, R&D leads, technical-due-diligence consultants). End with a sentence framing the form below as "tell us if this is the one to ship next." No fake metrics. No "trusted by" patterns.]
```

**File 3: `src/content/products/triage-router-bot.md`** (stage Probe, order 3, cta interest):
```markdown
--- 
name: "Triage + router bot"
tagline: "[Tagline placeholder — one-line for a support-inbox triage agent, replace in copy pass]"
stage: "Probe"
order: 3
cta:
  type: "interest"
  label: "Tell us"
headline: "[Triage + router bot — falsifiable detail-page headline, replace in copy pass]"
--- 

[200–400 word body in bracketed-placeholder Sketch B voice. Describe the problem (support inboxes / form submissions / lead pipelines drown ops teams), the agent's loop (read → classify → enrich → route to humans/tools), the reliability claim (no auto-replies without confidence threshold, every routing decision logged for audit, escalation path always visible). Voice candidate: pragmatic engineering-blog framing. Close with a "tell us if this is the one" hook.]
```

**File 4: `src/content/products/recorder-extractor.md`** (stage Probe, order 4, cta interest):
```markdown
--- 
name: "Always-on recorder + extractor"
tagline: "[Tagline placeholder — one-line for an always-on call/meeting recorder agent, replace in copy pass]"
stage: "Probe"
order: 4
cta:
  type: "interest"
  label: "Tell us"
headline: "[Always-on recorder + extractor — falsifiable detail-page headline, replace in copy pass]"
--- 

[200–400 word body in bracketed-placeholder Sketch B voice. Describe the problem (meetings produce decisions and action items that vanish into note-app voids), the agent's loop (record → transcribe → extract decisions/actions/owners → push to your tools), the reliability claim (no silent edits to your CRM/issue-tracker, every extraction reviewable, opt-in per meeting, on-device transcription option for privacy-sensitive teams). Avoid breathless-AI tone.]
```

**File 5: `src/content/products/agentic-employees.md`** (stage Probe, order 5, cta interest — NB: Marblism-style, intentional Delegate-overlap):
```markdown
--- 
name: "Agentic Employees"
tagline: "[Tagline placeholder — one-line for hiring named AI agents for functional roles, replace in copy pass]"
stage: "Probe"
order: 5
cta:
  type: "interest"
  label: "Tell us"
headline: "[Agentic Employees — falsifiable detail-page headline, replace in copy pass]"
--- 

[200–400 word body in bracketed-placeholder Sketch B voice. Describe the model (hire named AI agents for functional roles like inbox-triage, SEO-monitoring, lead-qualification, customer-support, content-research — Marblism-style), the agent loop (each "employee" has a defined remit, tool access, working hours, weekly digest), the reliability claim (every action requires a human-readable rationale, weekly review interface, kill-switch per employee). Note this is the Marblism-overlapping bet — if demand collapses with Delegate, that's itself the answer. Reference https://www.marblism.com as the conceptual anchor without endorsing them as a competitor — neutral framing.]
```

**File 6: `src/content/products/delegate.md`** (stage Sibling, order 6, cta interest):
```markdown
--- 
name: "Delegate"
tagline: "[Tagline placeholder — one-line for the Delegate sibling project, replace in copy pass]"
stage: "Sibling"
order: 6
cta:
  type: "interest"
  label: "Tell us"
headline: "[Delegate — falsifiable detail-page headline, replace in copy pass]"
--- 

[200–400 word body in bracketed-placeholder Sketch B voice. Describe Delegate as a sibling project (operations layer / agents-as-roles / outcomes-not-tasks framing), audience (freelancers, consultants, operators), and the reliability/autonomy framing. Note Sibling stage means Delegate has its own landing in flight separately — this card is here so the demand signal can tell us whether Delegate's audience overlaps with Agentic Employees. Voice: pragmatic engineering-blog. End with the "tell us" hook.]
```

Locked constraints:
- Narrative order via `order: 1..6` field MUST match: 1=buggerd, 2=scientific-paper-agent, 3=triage-router-bot, 4=recorder-extractor, 5=agentic-employees, 6=delegate (per CONTENT-03 + 02-RESEARCH.md user_constraints).
- Stage values (per CONTENT-04): `Shipping` for buggerd; `Probe` for the four concept-stage; `Sibling` for delegate. NOTE: agentic-employees gets `Probe` (it's a concept-stage card, despite carrying the Sibling-overlap conceptual debate — see PROJECT.md key decisions).
- `cta.type` is `external` ONLY for buggerd; the other 5 use `interest`.
- All copy is bracketed (`[...]`) per Phase 1 D-03 — no final copy in Phase 2; cold-read can validate structure, copy gets locked in a future polish pass.
- Honesty constraint (CONTENT-08): every body avoids `industry-leading`, `trusted by`, `Fortune 500`, `enterprise-grade`, `world-class`, `best-in-class`, `cutting-edge`, `revolutionary`, `game-changing`, `unparalleled`. The bracketed convention DOES NOT excuse using these phrases inside the brackets — Pitfall 4 in 02-RESEARCH.md.
  </action>
  <verify>
    <automated>test -f src/content/products/buggerd.md && test -f src/content/products/scientific-paper-agent.md && test -f src/content/products/triage-router-bot.md && test -f src/content/products/recorder-extractor.md && test -f src/content/products/agentic-employees.md && test -f src/content/products/delegate.md && grep -q "type: \"external\"" src/content/products/buggerd.md && grep -L "type: \"external\"" src/content/products/scientific-paper-agent.md src/content/products/triage-router-bot.md src/content/products/recorder-extractor.md src/content/products/agentic-employees.md src/content/products/delegate.md | wc -l | grep -qx 5 && grep -q "stage: \"Sibling\"" src/content/products/delegate.md && grep -q "stage: \"Shipping\"" src/content/products/buggerd.md && ! grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/content/products/ && npx astro check 2>&1 | tee /tmp/02-01-astro-check.log | grep -qE 'Result \(.*\): 0 errors' && echo OK</automated>
  </verify>
  <acceptance_criteria>
    - All 6 files exist at exact paths (`test -f` each)
    - `buggerd.md` has frontmatter `cta.type: "external"`, `url: "https://buggerd.com"`, `stage: "Shipping"`, `order: 1`
    - `scientific-paper-agent.md`: `cta.type: "interest"`, `stage: "Probe"`, `order: 2`
    - `triage-router-bot.md`: `cta.type: "interest"`, `stage: "Probe"`, `order: 3`
    - `recorder-extractor.md`: `cta.type: "interest"`, `stage: "Probe"`, `order: 4`
    - `agentic-employees.md`: `cta.type: "interest"`, `stage: "Probe"`, `order: 5`
    - `delegate.md`: `cta.type: "interest"`, `stage: "Sibling"`, `order: 6`
    - Exactly one file has `type: "external"` (run: `grep -lc 'type: "external"' src/content/products/*.md | wc -l` → `1`)
    - Honesty grep returns clean (no forbidden words filtered case-insensitive across all files): `! grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/content/products/`
    - `npx astro check` runs WITHOUT Zod validation errors (the command may emit benign warnings about other files, but the products collection must validate clean — output should NOT contain "Invalid frontmatter" or Zod error messages mentioning `products/`)
    - Each body is 200–400 words (rough check via `wc -w`; bracketed body content alone, excluding frontmatter)
    - Each body uses bracketed `[...]` placeholder convention (grep confirms each file body opens with `[` after the closing `---`)
  </acceptance_criteria>
  <done>Six product markdown files exist with valid frontmatter (passes Zod schema), correct narrative order, correct stage/cta assignments, and bracketed-placeholder bodies in Sketch B voice that pass the honesty audit. `astro check` reports zero schema errors against the `products/` collection.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| build-time content → static HTML | Markdown frontmatter + body parsed at `astro build`; failed validation fails the build (good — no runtime exposure). |
| product detail URLs → user browser | `/products/[slug]` pages built from `entry.id` (filesystem basename); slugs come from filenames the developer controls, not user input. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-02-01 | Tampering | `src/content.config.ts` schema | Low | mitigate | Discriminated union with `z.literal` discriminator (per Pitfall 3) — type errors at build, not runtime. Failing build is the stop. |
| T-02-02 | Information Disclosure | Bracketed placeholder copy | Low | accept | Bodies are placeholder; no PII, no secrets, no internal-only info. Phase 2 SUMMARY will note this. Phase 4 polish pass replaces with final copy. |
| T-02-03 | Denial of Service | Astro build via malformed frontmatter | Low | mitigate | Zod schema fails the build cleanly with line numbers — easier to fix than a silent rendering bug. |
| T-02-04 | Spoofing | External `buggerd.com` URL in cta | Low | accept | URL hardcoded by author; no user input. The `buggerd.com` domain is owned by the same author. `noopener noreferrer` on the rendered link is enforced in Plan 02-02 (ProductCard). |
| T-02-05 | Repudiation | Honesty-audit bypass via bracketed copy | Low | mitigate | Pitfall 4 grep blocklist runs in Plan 02-05 acceptance and again in CONTENT-08 verification. Bracketed convention doesn't excuse forbidden words inside brackets. |
| T-02-06 | Elevation of Privilege | n/a | n/a | accept | Static build, no runtime privilege boundary. |
</threat_model>

<verification>
After both tasks complete:

```bash
# Schema + content validate end-to-end
npx astro check                                    # 0 errors related to products/
ls -la src/content.config.ts                       # exists
ls -la src/content/config.ts 2>&1 | grep -q "No such" && echo "legacy path absent"
ls src/content/products/ | wc -l                   # 6
grep -lc 'type: "external"' src/content/products/*.md | wc -l  # 1 (only buggerd)
grep -lc 'type: "interest"' src/content/products/*.md | wc -l  # 5

# Honesty audit (also runs in 02-05)
! grep -riE 'trusted by|fortune 500|industry-leading|world-class|best-in-class|cutting-edge|revolutionary|game-changing|unparalleled|enterprise-grade' src/content/products/

# Build smoke (no rendering yet, but content layer should resolve)
npm run build 2>&1 | tee /tmp/02-01-build.log
grep -qE "Astro v6\\." /tmp/02-01-build.log
! grep -qiE "invalid frontmatter|zod" /tmp/02-01-build.log
```
</verification>

<success_criteria>
- `src/content.config.ts` exists at the Astro 6 path with discriminated-union `cta` schema and reserved `blog` collection (TECH-02)
- 6 product markdown files exist with valid frontmatter (TECH-02)
- `astro check` and `npm run build` complete without schema errors
- Honesty audit returns clean across `src/content/products/`
- No `@astrojs/mdx` dependency added (`grep -q "@astrojs/mdx" package.json && exit 1 || exit 0`)
- `src/content/config.ts` (legacy path) does NOT exist
</success_criteria>

<output>
After completion, create `.planning/phases/02-content-static-page/02-01-content-collection-SUMMARY.md` documenting:
- The exact `src/content.config.ts` content shipped
- The 6 product file paths + their stage/order/cta assignments
- Confirmation `npm run build` is green
- Confirmation honesty audit grep returns 0 hits
- Any deviations from the plan (e.g., body word counts outside 200–400)
</output>
