---
id: 01-04-deploy-repo-vercel
phase: 01
plan: 04
type: execute
wave: 3
depends_on: [01-03-visual-identity-shell]
files_modified:
  - vercel.json
  - .vercelignore
  - .planning/STATE.md
  - .planning/PROJECT.md
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-320.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-375.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-414.png
  - .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-1280.png
autonomous: false
requirements: [DEPLOY-01, DEPLOY-02, DEPLOY-03]

must_haves:
  truths:
    - "vercel.json mirrors buggerd's security headers with PostHog additions per D-20"
    - "vercel.json has cleanUrls: true and trailingSlash: false"
    - "vercel.json has /.planning/(.*) -> /404 redirect (defense-in-depth per D-20)"
    - ".vercelignore excludes .planning/, .git/, node_modules/, .claude/ per D-21"
    - ".vercelignore is committed BEFORE first push to GitHub (so .planning/ never enters deploy artifact)"
    - "GitHub repo JigSpec/jigspec-landing exists, public, main protected from force-push per D-12/D-15/D-16"
    - "Vercel project jigspec-landing auto-deploys from main per D-13/D-14"
    - "Live preview URL serves empty Astro shell over HTTPS"
    - "curl -I on / returns 200 with HSTS, X-Frame-Options DENY, X-Content-Type-Options, full CSP including PostHog hosts"
    - "curl -I on /.planning/PROJECT.md returns 404 (not 200, not 403)"
    - "Shell renders correctly at 320/375/414/1280 widths on the LIVE preview URL (not just dev server)"
    - "Live preview URL is recorded in PROJECT.md Key Decisions and STATE.md Last Activity"
  artifacts:
    - path: "vercel.json"
      provides: "Vercel platform config with security headers + CSP + redirects"
      contains: "Strict-Transport-Security"
    - path: ".vercelignore"
      provides: "Deploy artifact exclusions (.planning/, .git/, node_modules/, .claude/)"
      contains: ".planning/"
    - path: ".planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-320.png"
      provides: "320px viewport screenshot from live preview URL"
    - path: ".planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-375.png"
      provides: "375px viewport screenshot from live preview URL"
    - path: ".planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-414.png"
      provides: "414px viewport screenshot from live preview URL"
    - path: ".planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-1280.png"
      provides: "1280px viewport screenshot from live preview URL"
  key_links:
    - from: ".vercelignore"
      to: "deploy artifact"
      via: "Vercel native ignore parsing (committed before first push)"
      pattern: "\\.planning/"
    - from: "vercel.json redirects"
      to: "/404"
      via: "/.planning/(.*) defense-in-depth redirect"
      pattern: "\\.planning/\\(\\.\\*\\)"
    - from: "vercel.json CSP"
      to: "PostHog hosts"
      via: "script-src + connect-src allowlist"
      pattern: "us-assets\\.i\\.posthog\\.com"
    - from: "GitHub main branch"
      to: "Vercel auto-deploy"
      via: "GitHub integration in Vercel project"
---

<objective>
Ship the live preview URL.

Write `vercel.json` (copied from buggerd's, amended per D-20: PostHog hosts in CSP `script-src` + `connect-src`, `cleanUrls: true`, `trailingSlash: false`, `.planning/(.*)` -> `/404` redirect) and `.vercelignore` (excludes `.planning/`, `.git/`, `node_modules/`, `.claude/` per D-21). Verify locally (`dist/` clean of `.planning/` content). The user then runs `gh repo create`, configures branch protection, and imports the project on Vercel (per D-14 — user-owned step). Final verification: live preview URL serves the empty shell over HTTPS with expected security headers; `.planning/` paths return 404; shell renders at 320/375/414/1280 widths on the live URL.

Purpose: This plan closes Phase 1's success criterion (preview URL serves empty shell with buggerd-mirrored headers). All subsequent phases push to `main` and rely on Vercel auto-deploy.

Output: Two committed config files (`vercel.json`, `.vercelignore`), a public GitHub repo with branch protection, a Vercel project on auto-deploy, four live-URL screenshots, and an updated PROJECT.md/STATE.md recording the preview URL.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/STATE.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-01-astro-tailwind-scaffold-PLAN.md
@.planning/phases/01-scaffold-sketches-visual-shell/01-03-visual-identity-shell-PLAN.md

<canonical_references>
The executor MUST read these files in full before Tasks 1 and 2:
- `/Users/kjs/Documents/Business/Buggerd/vercel.json` — direct base for our `vercel.json`; the diff to apply is pre-computed in Task 1's action
- `/Users/kjs/Documents/Business/Buggerd/.vercelignore` — direct base for our `.vercelignore`; D-21 specifies the exclusion list
</canonical_references>

<locked_decisions>
From `01-CONTEXT.md`:
- **D-12** Repo name `jigspec-landing` under `JigSpec` GitHub org
- **D-13** Vercel project name `jigspec-landing`
- **D-14** Repo + Vercel creation is user-owned. Claude does NOT run `gh repo create` or click "import project". Plan emits explicit instructions in `checkpoint:human-action` task.
- **D-15** Branch protection: `main` protected from force-push only. NO required PR reviews.
- **D-16** Repo visibility: public.
- **D-20** `vercel.json` = buggerd's verbatim, then amended:
  - CSP `script-src` adds `https://us-assets.i.posthog.com`
  - CSP `connect-src` adds BOTH `https://us-assets.i.posthog.com` AND `https://us.i.posthog.com`
  - `cleanUrls: true`
  - `trailingSlash: false`
  - `/.planning/(.*)` -> `/404` redirect (mirrors buggerd defense-in-depth)
- **D-21** `.vercelignore` excludes: `.planning/`, `.git/`, `node_modules/`, `.claude/`

**Critical ordering invariant:** `.vercelignore` MUST be committed BEFORE the user pushes the first commit to GitHub. Otherwise, even though `.vercelignore` is read by Vercel from the repo root, the deploy artifact built from a push that didn't include `.vercelignore` would ship `.planning/`. Tasks 1 + 2 + 3 commit before Task 4 (the human push).
</locked_decisions>

<interfaces>
<!-- The exact buggerd vercel.json contents (extracted) — executor uses this as the base for D-20 amendments. -->

From /Users/kjs/Documents/Business/Buggerd/vercel.json (full file):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://cdn.tailwindcss.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
      ]
    }
  ],
  "redirects": [
    { "source": "/archive/(.*)", "destination": "/404", "statusCode": 404 },
    { "source": "/.planning/(.*)", "destination": "/404", "statusCode": 404 }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

**D-20 diff to apply for JigSpec landing:**
- DROP `https://cdn.tailwindcss.com` from CSP everywhere (we use Tailwind 4 build-time, not the CDN — STACK.md "What NOT to Use" forbids the CDN in production)
- DROP `'unsafe-inline'` from `script-src` (Astro 6 doesn't need it for this scaffold; can be re-added in Phase 4 if a polish item requires inline scripts)
- ADD `https://us-assets.i.posthog.com` to `script-src`
- ADD BOTH `https://us-assets.i.posthog.com` AND `https://us.i.posthog.com` to `connect-src`
- DROP `style-src 'unsafe-inline' https://cdn.tailwindcss.com` -> KEEP `'unsafe-inline'` for `style-src` (Astro inlines critical CSS in dev/prod; without `'unsafe-inline'` on style-src, Astro's hydration-style and Tailwind's compile-time inline blocks break)
- DROP the `/archive/(.*)` redirect (no `archive/` directory in JigSpec landing repo)
- KEEP `/.planning/(.*)` -> `/404` redirect verbatim (defense-in-depth per D-20 even though `.vercelignore` already excludes it)
- KEEP all other headers identical: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
- KEEP `cleanUrls: true`, `trailingSlash: false`

**Final `vercel.json` (target file contents — executor writes this exactly):**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://us-assets.i.posthog.com https://us.i.posthog.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
      ]
    }
  ],
  "redirects": [
    { "source": "/.planning/(.*)", "destination": "/404", "statusCode": 404 }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

From /Users/kjs/Documents/Business/Buggerd/.vercelignore (reference — buggerd's version):
```
# NOTE: The live deployment is Vercel Pro, configured via vercel.json
# at repo root. This file (.vercelignore) is read natively by Vercel
# and excludes the listed paths from the deployed artifact.

# Non-canonical prior landing-page iterations.
# Kept in git history for diff/rollback; never deployed.
archive/

# Planning docs are not part of the deployed site.
.planning/

# Source-of-truth markdown companions, not served pages.
pitch.md
validation-plan.md
faq-template.md

# Project instructions (Claude Code); not served.
CLAUDE.md
```

**Final `.vercelignore` (target file contents — executor writes this exactly per D-21):**
```
# NOTE: The live deployment is configured via vercel.json at repo root.
# This file (.vercelignore) is read natively by Vercel and excludes the
# listed paths from the deployed artifact.

# Planning docs are never served.
.planning/

# Git internals (Vercel already ignores these; explicit for safety).
.git/

# Build dependencies — Vercel runs npm install itself.
node_modules/

# Claude Code configuration / project instructions; never served.
.claude/
CLAUDE.md
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write vercel.json with D-20 amendments</name>
  <files>vercel.json</files>
  <read_first>
    - /Users/kjs/Documents/Business/Buggerd/vercel.json (canonical base)
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-20)
  </read_first>
  <action>
    Use the Write tool to create `vercel.json` at the repo root. The exact contents are pre-computed in `<interfaces>` above under "Final vercel.json (target file contents — executor writes this exactly)". Copy that JSON verbatim. Do NOT improvise; do NOT add extra fields; do NOT re-derive from buggerd's vercel.json — the diff has already been applied.

    Specifically the file MUST contain (verbatim):
    - `"$schema": "https://openapi.vercel.sh/vercel.json"`
    - A `headers` array with one entry whose `source` is `"/(.*)"` and whose headers include all six: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, and a `Content-Security-Policy` value containing exactly: `default-src 'self'; script-src 'self' https://us-assets.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://us-assets.i.posthog.com https://us.i.posthog.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
    - A `redirects` array containing one entry: `{"source": "/.planning/(.*)", "destination": "/404", "statusCode": 404}`
    - `"cleanUrls": true`
    - `"trailingSlash": false`

    No other top-level keys. No additional CSP directives. No `archive/` redirect (it does not exist in this repo).

    Per D-20, this file (a) mirrors buggerd's security posture, (b) allowlists PostHog (script + connect) so Phase 3 can ship the SDK without a CSP-only deploy, (c) keeps `.planning/` defense-in-depth via the redirect even though `.vercelignore` already excludes it.
  </action>
  <verify>
    <automated>test -f vercel.json && jq -e '.cleanUrls == true and .trailingSlash == false' vercel.json && grep -c 'us-assets.i.posthog.com' vercel.json | grep -E '^[2-9]' && grep -c 'us.i.posthog.com' vercel.json | grep -E '^[1-9]' && grep -c 'Strict-Transport-Security' vercel.json | grep -E '^[1-9]' && grep -c 'X-Frame-Options' vercel.json | grep -E '^[1-9]' && grep -q '"DENY"' vercel.json && grep -c 'X-Content-Type-Options' vercel.json | grep -E '^[1-9]' && grep -c 'Referrer-Policy' vercel.json | grep -E '^[1-9]' && grep -c 'Permissions-Policy' vercel.json | grep -E '^[1-9]' && grep -q '/.planning/(.*)' vercel.json && grep -q '"/404"' vercel.json && ! grep -q 'cdn.tailwindcss.com' vercel.json && ! grep -q '/archive/' vercel.json</automated>
  </verify>
  <acceptance_criteria>
    - File `vercel.json` exists at repo root.
    - File is valid JSON: `python3 -m json.tool vercel.json` (or `jq . vercel.json`) exits 0.
    - `jq -e '.cleanUrls == true' vercel.json` exits 0 (`"cleanUrls": true` present).
    - `jq -e '.trailingSlash == false' vercel.json` exits 0 (`"trailingSlash": false` present).
    - CSP `script-src` contains `https://us-assets.i.posthog.com` (verified via grep on the CSP header value in `vercel.json`).
    - CSP `connect-src` contains BOTH `https://us-assets.i.posthog.com` AND `https://us.i.posthog.com` (so `grep -c 'us-assets.i.posthog.com' vercel.json` returns at least 2 — once in script-src, once in connect-src; and `grep -q 'us.i.posthog.com' vercel.json` exits 0).
    - Headers array includes all six: `Strict-Transport-Security`, `X-Frame-Options` (with value `DENY`), `X-Content-Type-Options` (with value `nosniff`), `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` (each verified by `grep -q` for the header key in `vercel.json`).
    - Redirects array contains a rule whose `source` matches `/.planning/(.*)` and whose `destination` is `/404` (`grep -q '/.planning/(.*)' vercel.json` AND `grep -q '"/404"' vercel.json`).
    - File does NOT contain `cdn.tailwindcss.com` (the buggerd-era CSP entry was dropped per D-20 — `! grep -q 'cdn.tailwindcss.com' vercel.json`).
    - File does NOT contain `/archive/` redirect (no `archive/` directory in JigSpec landing repo — `! grep -q '/archive/' vercel.json`).
  </acceptance_criteria>
  <done>
    `vercel.json` exists at repo root. `jq` confirms `cleanUrls: true` and `trailingSlash: false`. CSP contains both PostHog hosts. All six security headers present. `.planning/(.*)` redirect to `/404` present. NO `cdn.tailwindcss.com` (we use Tailwind 4 build-time). NO `/archive/` redirect (no such directory in this repo).
  </done>
</task>

<task type="auto">
  <name>Task 2: Write .vercelignore with D-21 exclusions</name>
  <files>.vercelignore</files>
  <read_first>
    - /Users/kjs/Documents/Business/Buggerd/.vercelignore (canonical base)
    - .planning/phases/01-scaffold-sketches-visual-shell/01-CONTEXT.md (D-21)
  </read_first>
  <action>
    Use the Write tool to create `.vercelignore` at the repo root. Exact contents are pre-computed in `<interfaces>` above under "Final .vercelignore (target file contents — executor writes this exactly per D-21)". Copy verbatim.

    The file MUST list (each on its own line, comments allowed):
    - `.planning/`
    - `.git/`
    - `node_modules/`
    - `.claude/`

    Plus an entry for `CLAUDE.md` (carried from the buggerd pattern — Claude Code project instructions are not part of the deployed site). Comments explaining each exclusion are encouraged but not required.

    Critical: this file MUST be staged and committed before the user runs `gh repo create ... --push` in Task 4. The plan's task ordering enforces this — Tasks 1, 2, 3 all run before Task 4. Per D-21, this prevents `.planning/` from leaking into the deploy artifact on the first push.
  </action>
  <verify>
    <automated>test -f .vercelignore && grep -qx '\.planning/' .vercelignore && grep -qx '\.git/' .vercelignore && grep -qx 'node_modules/' .vercelignore && grep -qx '\.claude/' .vercelignore</automated>
  </verify>
  <acceptance_criteria>
    - File `.vercelignore` exists at repo root.
    - File contains `.planning/` as a standalone line (`grep -qx '\.planning/' .vercelignore` exits 0 — D-21 exclusion).
    - File contains `.git/` as a standalone line (`grep -qx '\.git/' .vercelignore` exits 0 — D-21 exclusion).
    - File contains `node_modules/` as a standalone line (`grep -qx 'node_modules/' .vercelignore` exits 0 — D-21 exclusion).
    - File contains `.claude/` as a standalone line (`grep -qx '\.claude/' .vercelignore` exits 0 — D-21 exclusion).
    - File has at least 4 non-empty, non-comment lines (`grep -v '^#' .vercelignore | grep -v '^[[:space:]]*$' | wc -l` returns ≥ 4).
  </acceptance_criteria>
  <done>
    `.vercelignore` exists at repo root. Contains all four exclusions per D-21: `.planning/`, `.git/`, `node_modules/`, `.claude/`. Comments are optional but no exclusion is missing.
  </done>
</task>

<task type="auto">
  <name>Task 3: Local pre-push verification + commit</name>
  <files>
    (no new files — verifies + commits Tasks 1-2 output)
  </files>
  <read_first>
    - vercel.json (just written)
    - .vercelignore (just written)
  </read_first>
  <action>
    Run local verification gates BEFORE handing off to the human-action checkpoint. These prove that the user's first push will deploy a clean artifact.

    Step 1 — Verify staging:
    ```bash
    git status --short
    ```
    Both `vercel.json` and `.vercelignore` MUST appear (either as untracked `??` or staged `A`).

    Step 2 — Stage explicitly (do NOT use `git add -A` or `git add .` — sensitive files like `.env` could be present from earlier scaffold steps):
    ```bash
    git add vercel.json .vercelignore
    ```

    Step 3 — Run the production build to verify the build succeeds with the new vercel.json present (Vercel re-runs `npm run build` on its end, but failing here saves a CI round-trip):
    ```bash
    npm run build
    ```
    Build MUST exit 0. `dist/` MUST be created.

    Step 4 — Verify the build artifact does NOT contain `.planning/`, `.claude/`, or `node_modules/` content. (`.vercelignore` controls deploy upload, not the local `dist/` — so the test is that `dist/` was built from `src/` only, which is the case for any standard Astro project. This step is a safety net for misconfigured `astro.config.mjs`.)
    ```bash
    ! find dist -path '*planning*' -print -quit | grep -q . && \
    ! find dist -path '*\.claude*' -print -quit | grep -q . && \
    ! find dist -path '*node_modules*' -print -quit | grep -q .
    ```
    (Each `find ... -print -quit | grep -q .` returns 0 if any match was found; the leading `!` flips it. The compound returns 0 only if ALL three find no matches.)

    Step 5 — Commit:
    ```bash
    git commit -m "feat(01): add vercel.json and .vercelignore (D-20, D-21)" \
      --no-verify=false
    ```
    Use a heredoc for the message body if multi-line. Do NOT amend a previous commit. Do NOT use `--no-verify`. Per project commit conventions, scope is the phase number.

    Step 6 — Confirm commit landed locally:
    ```bash
    git log -1 --oneline
    ```
    Output MUST reference the new commit and `vercel.json`/`.vercelignore` in `git show --stat HEAD`.

    DO NOT push yet. The user pushes in Task 4 (D-14).
  </action>
  <verify>
    <automated>git log -1 --name-only | grep -q '^vercel\.json$' && git log -1 --name-only | grep -q '^\.vercelignore$' && test -d dist && ! find dist -path '*planning*' -print -quit | grep -q . && ! find dist -path '*\.claude*' -print -quit | grep -q . && ! find dist -path '*node_modules*' -print -quit | grep -q .</automated>
  </verify>
  <acceptance_criteria>
    - `git log -1 --name-only` includes `vercel.json` (file is part of HEAD commit).
    - `git log -1 --name-only` includes `.vercelignore` (file is part of HEAD commit).
    - Together that means `git status --porcelain` BEFORE the commit showed at least 2 staged/untracked entries for `vercel.json` and `.vercelignore` (covered by the post-commit name-only check).
    - `npm run build` exited 0 in Step 3 (build succeeded with new `vercel.json` present).
    - Directory `dist/` exists (`test -d dist` exits 0).
    - `find dist/ -path '*planning*'` returns no matches (no `.planning/` content in build output — verified via `! find dist -path '*planning*' -print -quit | grep -q .`).
    - `find dist/ -path '*\.claude*'` returns no matches (no `.claude/` content in build output).
    - `find dist/ -path '*node_modules*'` returns no matches (no `node_modules/` content in build output).
    - No `git push` has been issued yet (user owns the first push in Task 4 per D-14 — verifiable by absence of any `origin/main` ref locally, or simply by the fact that Task 4 hasn't run).
  </acceptance_criteria>
  <done>
    HEAD commit includes both `vercel.json` and `.vercelignore`. `dist/` exists from a successful build. `dist/` contains nothing from `.planning/`, `.claude/`, or `node_modules/`. No push has occurred yet.
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 4: User creates GitHub remote, sets branch protection, imports Vercel project</name>
  <what-built>
    `vercel.json` and `.vercelignore` are committed locally (Task 3). `dist/` builds clean.
  </what-built>
  <why-human>
    Per D-14, repo + Vercel creation is user-owned, not Claude-owned. Claude initialized the local Astro project, but creating the GitHub remote (which requires `gh auth` against the JigSpec org) and clicking "import project" in the Vercel dashboard are user actions. Same pattern as `JigSpec/buggerd`. Branch protection via `gh api` requires write permissions on the org and is also user-owned.
  </why-human>
  <how-to-verify>
    Run these commands in order. Each step's success gates the next.

    **Step (a) — Confirm gh CLI auth on the JigSpec org:**
    ```bash
    gh auth status
    ```
    Expected: `Logged in to github.com as <your-username>` AND the token has access to the `JigSpec` org. If not authenticated, run `gh auth login` and select the JigSpec org during the SSH key / token grant flow.

    **Step (b) — Create the public repo and push initial commits:**
    ```bash
    gh repo create JigSpec/jigspec-landing --public --source . --push
    ```
    Expected: command exits 0, prints the new HTTPS URL `https://github.com/JigSpec/jigspec-landing`. The push includes the commit from Task 3 (so `.vercelignore` is on the remote BEFORE Vercel ever sees the repo — D-21 ordering invariant satisfied).

    Verify on GitHub:
    ```bash
    gh repo view JigSpec/jigspec-landing --json visibility,defaultBranchRef
    ```
    Expected: `"visibility": "PUBLIC"` (D-16), `"defaultBranchRef": {"name": "main"}`.

    **Step (c) — Enable branch protection on `main` (force-push only per D-15):**

    Preferred — `gh api` one-liner. Pipe the JSON inline:
    ```bash
    gh api -X PUT repos/JigSpec/jigspec-landing/branches/main/protection \
      -H "Accept: application/vnd.github+json" \
      --input - <<'EOF'
    {
      "required_status_checks": null,
      "enforce_admins": false,
      "required_pull_request_reviews": null,
      "restrictions": null,
      "allow_force_pushes": false,
      "allow_deletions": false,
      "block_creations": false,
      "required_conversation_resolution": false,
      "lock_branch": false,
      "allow_fork_syncing": false
    }
    EOF
    ```
    Expected: 200 response with the protection object. Key fields: `allow_force_pushes: false`, `required_pull_request_reviews: null` (D-15 explicitly says NO required PR reviews — solo project).

    Fallback — GitHub UI: navigate to `https://github.com/JigSpec/jigspec-landing/settings/branches`, click "Add classic branch protection rule" (or the new ruleset UI), branch name pattern `main`, check ONLY "Block force pushes" and "Restrict deletions". Leave all PR-review options unchecked. Save.

    Verify protection landed:
    ```bash
    gh api repos/JigSpec/jigspec-landing/branches/main/protection \
      --jq '.allow_force_pushes.enabled, .required_pull_request_reviews'
    ```
    Expected: `false` and `null` (in either order, two lines).

    **Step (d) — Import the project in Vercel:**
    1. Open `https://vercel.com/new` in your browser
    2. Under "Import Git Repository", select `JigSpec/jigspec-landing`. (If the JigSpec org is not listed, click "Add GitHub Account" and grant the Vercel app access to the JigSpec org first.)
    3. Project Name: `jigspec-landing` (matches D-13 — should be the default)
    4. Framework Preset: Astro (auto-detected)
    5. Build Command: `npm run build` (default)
    6. Output Directory: `dist` (default)
    7. Root Directory: `./` (default)
    8. Environment Variables: NONE in Phase 1 (PostHog keys arrive in Phase 3)
    9. Click "Deploy"
    10. Wait for the deploy to complete (typically <60s for an empty Astro shell)
    11. Note the production URL — it will be `https://jigspec-landing.vercel.app` and ALSO a deploy-specific URL like `https://jigspec-landing-<hash>-<team>.vercel.app`

    **Step (e) — Confirm auto-deploy on push to `main`:**

    In the Vercel project page, navigate to Settings -> Git. Confirm:
    - Production Branch: `main`
    - "Auto-assign Custom Domains" is enabled (defaults on)
    - The "Connected Git Repository" shows `JigSpec/jigspec-landing`

    No additional click needed; Vercel auto-deploys `main` by default.

    **Report back:** Reply with the production preview URL (e.g. `https://jigspec-landing.vercel.app`) so Task 5 can verify it. Also confirm: "branch protection enabled, auto-deploy confirmed."
  </how-to-verify>
  <acceptance_criteria>
    - User reports back a production preview URL string matching `^https://[a-z0-9-]+\.vercel\.app/?$` (default `*.vercel.app` host) OR a custom-domain equivalent matching `^https://[a-z0-9.-]+\.[a-z]{2,}/?$` (e.g. `https://jigspec-landing.vercel.app`).
    - The reported URL is captured into a plan-scoped variable `${LIVE_URL}` for use by Tasks 5 and 6.
    - User confirms branch protection is enabled on `main` (force-push blocked) — verifiable via `gh api repos/JigSpec/jigspec-landing/branches/main/protection --jq '.allow_force_pushes.enabled'` returning `false`.
    - User confirms `required_pull_request_reviews` is `null` per D-15 (no required PR reviews — solo project).
    - User confirms Vercel auto-deploy from `main` is configured (Vercel project Settings → Git shows production branch `main` connected to `JigSpec/jigspec-landing`).
    - `gh repo view JigSpec/jigspec-landing --json visibility` returns `{"visibility":"PUBLIC"}` per D-16.
    - The first deploy from the initial push completed successfully (Vercel dashboard shows ≥1 production deployment).
  </acceptance_criteria>
  <resume-signal>Reply with the live preview URL and confirmation: "URL: <url>. Branch protection enabled. Auto-deploy confirmed."</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 5: Verify live preview URL — headers, .planning 404, viewport rendering</name>
  <what-built>
    Live Vercel preview URL is up. Need to verify it actually serves the empty shell over HTTPS with the security posture from `vercel.json`, that `.planning/` paths are 404, and the shell renders correctly at all four target widths (per ROADMAP Phase 1 success criteria + DEPLOY-03).
  </what-built>
  <how-to-verify>
    Substitute the URL the user reported in Task 4 wherever `<URL>` appears. Use `https://jigspec-landing.vercel.app` if that's what the user reported.

    **(1) Root returns 200 with all expected security headers:**
    ```bash
    curl -sI https://<URL>/ | tee /tmp/jigspec-headers.txt
    ```
    Expected: first line is `HTTP/2 200`. Then verify each header:
    ```bash
    grep -i '^strict-transport-security:.*max-age=31536000' /tmp/jigspec-headers.txt
    grep -i '^x-frame-options: DENY' /tmp/jigspec-headers.txt
    grep -i '^x-content-type-options: nosniff' /tmp/jigspec-headers.txt
    grep -i '^referrer-policy: strict-origin-when-cross-origin' /tmp/jigspec-headers.txt
    grep -i '^permissions-policy:' /tmp/jigspec-headers.txt
    grep -i '^content-security-policy:.*us-assets\.i\.posthog\.com' /tmp/jigspec-headers.txt
    grep -i '^content-security-policy:.*us\.i\.posthog\.com' /tmp/jigspec-headers.txt
    ```
    Each `grep` must match. If ANY misses, `vercel.json` was deployed wrong — re-check Task 1 contents and re-push.

    **(2) `.planning/` paths return 404 (NOT 200, NOT 403):**
    ```bash
    curl -sI https://<URL>/.planning/PROJECT.md | head -1
    curl -sI https://<URL>/.planning/STATE.md | head -1
    curl -sI https://<URL>/.planning/sketches/sketch-a-confident-direct.html | head -1
    ```
    Each MUST start with `HTTP/2 404` (or `HTTP/1.1 404`). A `200` here means `.vercelignore` failed to exclude `.planning/` — STOP, do not proceed to the next phase, debug `.vercelignore` placement.

    A `403` is acceptable but `404` is preferred (the `vercel.json` redirect to `/404` is what produces the 404). If you see 403, that's Vercel's default response for `.vercelignore`-excluded paths and is also fine — just confirm the redirect rule fires by hitting:
    ```bash
    curl -sI -L https://<URL>/.planning/anything | grep -E '^(HTTP|location:)'
    ```
    Expected: redirect chain ends at `/404` with HTTP 404.

    **(3) Shell renders at all four target widths (320/375/414/1280) — D-25 manual verification:**

    Open Chrome (or any modern browser) -> DevTools -> Toggle Device Toolbar (Cmd+Shift+M). Set viewport widths in this order and capture a full-page screenshot at each:

    - 320px (iPhone SE 1st gen mental model — minimum we support)
    - 375px (iPhone SE 2nd/3rd gen, iPhone 13 mini)
    - 414px (iPhone 11 / 13 Pro Max)
    - 1280px (laptop default)

    Save screenshots to:
    ```
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-320.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-375.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-414.png
    .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-1280.png
    ```

    For each viewport, visually confirm:
    - Nav is visible (collapses to hamburger at <768px per D-23/D-25)
    - `<h1>` placeholder is visible and readable (no horizontal scrollbar, no overflow)
    - Footer is visible at bottom of page
    - No console errors in DevTools (Network + Console tabs)
    - Page background, body text, and accent color match the chosen sketch direction (Plan 01-02 pick)

    **(4) Auto-deploy on `main` is confirmed:**

    Open Vercel dashboard -> jigspec-landing project -> Deployments tab. Confirm there's at least one Production deploy from the `main` branch.

    Optionally test the loop: make a trivial commit (e.g. add a blank line to `README.md`), push to `main`, watch Vercel kick off a new deploy. Roll the change back if you want.

    **(5) Capture verification proof to git:**
    After all four screenshots exist, stage and commit them:
    ```bash
    git add .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/
    git commit -m "docs(01): capture live preview verification screenshots"
    git push origin main
    ```
    The push triggers another Vercel deploy — that itself is a smoke test of the auto-deploy loop.
  </how-to-verify>
  <acceptance_criteria>
    - `curl -sI https://${LIVE_URL}/ | head -1` returns a status line containing `200` (e.g. `HTTP/2 200` — root serves empty shell).
    - Response headers from `https://${LIVE_URL}/` include `strict-transport-security` containing `max-age=31536000` (`grep -i '^strict-transport-security:.*max-age=31536000' /tmp/jigspec-headers.txt` exits 0).
    - Response headers include `x-frame-options: DENY` (case-insensitive `grep -i '^x-frame-options: DENY' /tmp/jigspec-headers.txt` exits 0).
    - Response headers include `x-content-type-options: nosniff` (`grep -i '^x-content-type-options: nosniff' /tmp/jigspec-headers.txt` exits 0).
    - Response headers include `referrer-policy: strict-origin-when-cross-origin` (`grep -i '^referrer-policy: strict-origin-when-cross-origin' /tmp/jigspec-headers.txt` exits 0).
    - Response headers include a `permissions-policy:` header (`grep -i '^permissions-policy:' /tmp/jigspec-headers.txt` exits 0).
    - Response headers include `content-security-policy:` containing both `us-assets.i.posthog.com` AND `us.i.posthog.com` (two `grep -i` checks, each exits 0).
    - `curl -sI https://${LIVE_URL}/.planning/PROJECT.md | head -1` returns a status line containing `404` (NOT 200, NOT 403 preferred — 403 acceptable only if redirect chain to `/404` is verified separately).
    - `curl -sI https://${LIVE_URL}/.planning/STATE.md | head -1` returns a status line containing `404`.
    - `curl -sI https://${LIVE_URL}/.planning/sketches/sketch-a-confident-direct.html | head -1` returns a status line containing `404`.
    - File `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-320.png` exists (PNG, valid image; `file` command reports `PNG image data`).
    - File `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-375.png` exists (PNG).
    - File `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-414.png` exists (PNG).
    - File `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-1280.png` exists (PNG).
    - All four screenshots staged and committed: `git log -1 --name-only` includes the four PNG paths above OR a prior commit on `origin/main` does.
    - Vercel dashboard confirms ≥1 production deploy on `main` (manual visual check by user; user reports back "auto-deploy active").
  </acceptance_criteria>
  <resume-signal>Reply "verified" with the live URL and confirmation that all five checks (headers, .planning 404, four viewport screenshots, auto-deploy active, screenshot commit pushed) passed. If any check fails, paste the failing curl output or screenshot path so we can debug.</resume-signal>
</task>

<task type="auto">
  <name>Task 6: Record live preview URL in PROJECT.md and STATE.md</name>
  <files>
    .planning/PROJECT.md
    .planning/STATE.md
  </files>
  <read_first>
    - .planning/PROJECT.md (find the Key Decisions table)
    - .planning/STATE.md (find the Last Activity / Phase Position section)
  </read_first>
  <action>
    Use the Edit tool, NOT Write (these are existing planning docs — do not rewrite).

    **PROJECT.md — append a Key Decision row:**
    Find the existing Key Decisions table or section. Append a row recording:
    ```
    | Phase 1 deploy | Live preview URL: https://<URL> (Vercel project `jigspec-landing`, auto-deploys from `main`). Verified <YYYY-MM-DD> with HSTS + full CSP including PostHog hosts; `.planning/` returns 404. | D-12, D-13, D-20, D-21 |
    ```
    Substitute `<URL>` with the actual URL from Task 4 (the value the user passed via the resume signal — `${LIVE_URL}`) and `<YYYY-MM-DD>` with today's date.

    If PROJECT.md uses a bullet-list format for Key Decisions instead of a table, follow that format — match the existing structure exactly.

    **STATE.md — append to Last Activity:**
    Find the most recent "Last Activity" or session-log entry. Append a bullet:
    ```
    - Phase 1 deploy verified at https://<URL> (vercel.json + .vercelignore committed, gh repo created with main force-push protection, Vercel auto-deploy confirmed). Closes DEPLOY-01/02/03.
    ```

    Do NOT overwrite prior entries. Do NOT change the file's frontmatter. Do NOT change other sections.

    Stage and commit:
    ```bash
    git add .planning/PROJECT.md .planning/STATE.md
    git commit -m "docs(01): record live preview URL and Phase 1 deploy completion"
    git push origin main
    ```
  </action>
  <verify>
    <automated>grep -F "$(cat /tmp/jigspec-headers.txt 2>/dev/null | grep -oE 'https?://[^ ]+' | head -1 || echo 'jigspec-landing')" .planning/PROJECT.md && grep -q 'Phase 1 deploy verified' .planning/STATE.md && git log -1 --name-only | grep -qE '(PROJECT\.md|STATE\.md)'</automated>
  </verify>
  <acceptance_criteria>
    - The literal preview URL captured from Task 4's checkpoint reply (the plan-scoped variable `${LIVE_URL}`, e.g. `https://jigspec-landing.vercel.app`) appears verbatim in `.planning/PROJECT.md` — verifiable by `grep -F "${LIVE_URL}" .planning/PROJECT.md` exiting 0. This criterion takes the URL directly from the checkpoint reply and does NOT depend on `/tmp/jigspec-headers.txt` (which may not survive a checkpoint resume across shell sessions).
    - `.planning/PROJECT.md` contains a Key Decisions row referencing `Phase 1 deploy` and the URL (`grep -q 'Phase 1 deploy' .planning/PROJECT.md` exits 0).
    - `.planning/STATE.md` Last Activity contains the URL OR a `Phase 1 deploy verified` marker (`grep -q 'Phase 1 deploy verified' .planning/STATE.md` exits 0).
    - `git diff --stat HEAD~1 .planning/` (or equivalent inspection of the most recent commit) shows BOTH `.planning/PROJECT.md` and `.planning/STATE.md` modified (`git log -1 --name-only | grep -qE '(PROJECT\.md|STATE\.md)'` exits 0; both files appear).
    - The commit is pushed to `origin/main` (`git rev-parse HEAD` matches `git rev-parse origin/main` after `git fetch`).
    - PROJECT.md frontmatter is unchanged from prior commit (`git diff HEAD~1 -- .planning/PROJECT.md` shows no changes inside the frontmatter `---` block — the edit is additive, not rewriting).
    - STATE.md frontmatter is unchanged from prior commit (same check on `.planning/STATE.md`).
  </acceptance_criteria>
  <done>
    PROJECT.md Key Decisions section contains a new row with the live preview URL. STATE.md Last Activity contains a "Phase 1 deploy verified at <URL>" bullet referencing DEPLOY-01/02/03. Both changes committed and pushed to `main`.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| repo -> Vercel deploy artifact | `.vercelignore` controls what crosses; failure here leaks `.planning/` to public web |
| public web -> rendered HTML | CSP controls which origins can execute script / receive XHR; failure here enables XSS or unintended exfil |
| public web -> `.planning/` paths | `.vercelignore` exclusion + `vercel.json` redirect both gate this; defense-in-depth |
| GitHub `main` branch | Force-push protection (D-15) prevents history rewrites that could re-introduce excluded files in a deploy artifact |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-01-04-01 | Information Disclosure | Vercel deploy artifact | high | mitigate | `.vercelignore` excludes `.planning/`, `.git/`, `node_modules/`, `.claude/` (Task 2 per D-21). `vercel.json` adds `/.planning/(.*)` -> `/404` redirect as defense-in-depth (Task 1 per D-20). Verified post-deploy by Task 5: `curl -I https://<URL>/.planning/PROJECT.md` MUST return 404. Ordering invariant: `.vercelignore` is committed in Task 3 BEFORE the human push in Task 4 — so the very first deploy artifact is clean. Severity high because `.planning/` contains pre-launch product positioning, deferred-idea decisions, and competitive context the company has not chosen to publish. |
| T-01-04-02 | Tampering | Browser-rendered page | medium | mitigate | CSP `script-src 'self' https://us-assets.i.posthog.com` exact-match (Task 1) — no wildcard, no `'unsafe-inline'` on script-src, no `'unsafe-eval'`. PostHog is the only third-party origin allowed to execute script, and it's only allowed because Phase 3 will load it. Verified post-deploy by Task 5: `grep -i 'content-security-policy:.*us-assets\.i\.posthog\.com'` AND `grep -v` for any `cdn.tailwindcss.com` or other third-party hosts. Severity medium because Phase 1 ships zero scripts beyond the Astro shell; CSP misconfig only becomes high-severity once Phase 3 loads PostHog and forms accept user input. |
| T-01-04-03 | Information Disclosure | Sketch HTML files in `.planning/sketches/` | medium | mitigate | Sketches load Tailwind via CDN (D-01) — if they shipped, both leak pre-launch design AND introduce an uncontrolled CDN dependency that the production CSP forbids (so even if shipped, they wouldn't render). Mitigated by `.vercelignore` excluding all of `.planning/` (Task 2). Verified by Task 5: `curl -I https://<URL>/.planning/sketches/sketch-a-confident-direct.html` returns 404. Severity medium: leaked sketches are pre-launch design candidates, not production secrets, but still represent unshipped IP and competitive positioning. |
| T-01-04-04 | Elevation of Privilege | Repo `main` branch | medium | mitigate | Branch protection enabled in Task 4 step (c) per D-15: `allow_force_pushes: false`, `allow_deletions: false`. Verified by `gh api .../branches/main/protection --jq '.allow_force_pushes.enabled'` returning `false`. Solo project — no required PR reviews, just history-integrity protection. Severity medium because force-push could re-introduce excluded files into a deploy artifact, but the deploy artifact is also gated by `.vercelignore` (defense in depth — both would have to fail). |
| T-01-04-05 | Information Disclosure | TLS / Cleartext | high | mitigate | `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Task 1) prevents downgrade attacks across all subdomains. Vercel auto-provisions HTTPS for `*.vercel.app`; the Phase 5 apex swap to `jigspec.com` will inherit HSTS. Verified by Task 5: `grep -i '^strict-transport-security:.*max-age=31536000' /tmp/jigspec-headers.txt`. Severity high because TLS downgrade across the apex domain (post-Phase 5) would expose all subsequent visitor traffic (including PostHog event POSTs containing email and free-text problem pitches) to passive interception. |
| T-01-04-06 | Spoofing | Iframe embedding | medium | mitigate | `X-Frame-Options: DENY` (Task 1) plus CSP `frame-ancestors 'none'` block all framing. No clickjacking surface. Verified by Task 5: `grep -i '^x-frame-options: DENY'`. Severity medium: clickjacking on a marketing page is low immediate impact, but blocking it is cheap and prevents UI-redress attacks against the future signup forms. |
| T-01-04-07 | Tampering | MIME sniffing | low | mitigate | `X-Content-Type-Options: nosniff` (Task 1) prevents browsers from re-interpreting response content type. Verified by Task 5: `grep -i '^x-content-type-options: nosniff'`. Severity low for a static-only site (no user-uploaded content), but still a free hardening win and required for ASVS L1 baseline. |
| T-01-04-08 | Information Disclosure | Referer leakage | low | accept | `Referrer-Policy: strict-origin-when-cross-origin` (Task 1) — origin only on cross-origin, full URL on same-origin. Standard posture. No PII in URLs in Phase 1, and Phase 3 forms POST to PostHog (a separate origin), so the referrer-from-form-submit signal is the origin only. Acceptable. Severity low: no path-level data is sensitive, and the chosen policy already minimizes cross-origin leakage to origin-only. |

All threats have a disposition. Severity column uses the heuristic: high = production secret/PII or apex-traffic exposure; medium = pre-launch context, CSP/header bypass, or branch-history integrity; low = defense-in-depth on already-mitigated surface or no-PII referrer. T-01-04-08 is `accept` with rationale; the rest are `mitigate` with specific implementation tasks and verification commands.
</threat_model>

<verification>
Phase-level checks (run after Task 6 completes):

1. **Files committed and pushed:** `git log --name-only origin/main | grep -E '^(vercel\.json|\.vercelignore)$'` matches both files in commit history.
2. **Live URL serves shell over HTTPS:** `curl -sI https://<URL>/ | head -1` returns `HTTP/2 200`.
3. **All six security headers live:** Task 5 step (1) commands all match.
4. **`.planning/` paths return 404:** Task 5 step (2) commands all return `HTTP/2 404`.
5. **Four viewport screenshots committed:** `ls .planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/live-{320,375,414,1280}.png` lists all four.
6. **Branch protection active:** `gh api repos/JigSpec/jigspec-landing/branches/main/protection --jq '.allow_force_pushes.enabled'` returns `false`.
7. **Vercel auto-deploy on:** Vercel dashboard shows production deploys triggered by `main` pushes (Task 5 step 4).
8. **PROJECT.md + STATE.md updated:** `grep -q 'Phase 1 deploy verified' .planning/STATE.md` AND `grep -q '<URL>' .planning/PROJECT.md` (substitute actual URL).

Phase 1 closes when all 8 checks pass and the executor produces a SUMMARY.md per the output section.
</verification>

<success_criteria>
- `vercel.json` and `.vercelignore` exist at repo root, contents match the inline targets in `<interfaces>` exactly
- DEPLOY-01 satisfied: GitHub repo `JigSpec/jigspec-landing` is public, has `main` protected from force-push, exists at the URL in PROJECT.md
- DEPLOY-02 satisfied: Vercel project `jigspec-landing` auto-deploys from `main`; first deploy completed; Vercel dashboard shows deploys.
- DEPLOY-03 satisfied: Live preview URL serves the empty Astro shell over HTTPS with all six security headers (HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, full CSP including PostHog hosts); `.planning/` paths return 404; shell renders at 320/375/414/1280.
- All four viewport screenshots committed under `.planning/phases/01-scaffold-sketches-visual-shell/verification-screenshots/`
- PROJECT.md Key Decisions has a row recording the live preview URL
- STATE.md Last Activity records "Phase 1 deploy verified at <URL>"
- Phase 1 ROADMAP success criterion ("preview URL serves empty Astro shell over HTTPS with vercel.json mirroring buggerd's headers and cleanUrls/trailingSlash flags") is met
</success_criteria>

<output>
After completion, create `.planning/phases/01-scaffold-sketches-visual-shell/01-04-deploy-repo-vercel-SUMMARY.md` summarizing:
- Files written: `vercel.json`, `.vercelignore` (with the D-20 amendments and D-21 exclusion list noted)
- Deviations from buggerd's `vercel.json`: dropped `cdn.tailwindcss.com`, dropped `'unsafe-inline'` on script-src, dropped `/archive/` redirect; added PostHog hosts to script-src and connect-src
- GitHub repo URL, default branch, branch protection status
- Vercel project URL, production preview URL, auto-deploy status
- Verification artifacts: paths to the four `live-*.png` screenshots, the curl output saved to `/tmp/jigspec-headers.txt` content (paste it inline so the SUMMARY is self-contained)
- Key links recorded: PROJECT.md Key Decisions row, STATE.md Last Activity entry
- Closes DEPLOY-01, DEPLOY-02, DEPLOY-03 (and therefore Phase 1 — all 9 Phase 1 requirements complete)
- Forward links: Phase 2 begins by pushing real content to `main`; this plan's Vercel auto-deploy is the only thing that needs to keep working for that to succeed
</output>
