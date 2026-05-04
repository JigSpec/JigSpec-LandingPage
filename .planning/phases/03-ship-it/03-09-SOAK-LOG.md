# Phase 3 Soak Log — Plan 03-09

**Plan:** 03-09
**Phase:** 03 (Ship It)
**Soak start:** [FILL IN: ISO-8601 timestamp when you begin T+0h measurements]
**Soak end (target):** [FILL IN: T+0h timestamp plus 24 hours]
**Preview URL:** [FILL IN: e.g., jigspec-landing-git-main-<username>.vercel.app or per-deploy URL]
**Deploy commit SHA:** [FILL IN: git rev-parse --short HEAD or captured from Vercel dashboard]
**PostHog project:** [FILL IN: https://us.posthog.com/project/<your-project-id>]
**PostHog $exception autocapture:** [FILL IN: ENABLED at <timestamp> — see Task 1 protocol below]

## Pre-Soak Checklist (Complete Before T+0h)

### Task 1: Enable PostHog $exception autocapture

This step must be completed BEFORE starting the soak window.

1. Open `https://us.posthog.com/project/<your-project-id>/settings/autocapture` in a browser.
2. Find the toggle labeled **"Capture exceptions"** (some PostHog UI versions label it **"Error tracking"**).
3. Enable the toggle. Save.
4. Verify the wiring: open the preview URL in a browser with DevTools open. In the console, run:
   ```javascript
   throw new Error('soak-test-' + Date.now())
   ```
5. Within 30 seconds, the `$exception` event should appear at:
   `https://us.posthog.com/project/<id>/events?q=$exception`
6. Record the test-event timestamp here: [FILL IN]

**Toggle path found at:** [FILL IN: e.g., "Settings > Autocapture > Capture exceptions"]
**Test event appeared:** [FILL IN: yes/no + timestamp]

If the toggle is not at the expected location, check `https://us.posthog.com/project/<id>/error_tracking`.

---

## Soak Protocol

Per RESEARCH Pattern 5 + ROADMAP SC#5. All 16 PITFALLS items measured. Three time-series snapshots (T+0h / T+12h / T+24h). Lighthouse via PSI at T+24h. Cold-read review (Pattern 4) once during the window.

**Instructions for each snapshot:** Open the preview URL in an incognito browser window (extensions disabled) with DevTools open on the Network tab and Console tab before navigating. Clear both tabs before loading. Scroll the entire page slowly to trigger lazy-loaded content.

---

## T+0h Snapshot

**Timestamp:** [FILL IN: ISO-8601]
**Browser:** [FILL IN: e.g., Chrome 134 macOS, incognito, extensions disabled]
**Actions performed:**
- Loaded preview URL with DevTools open (Network + Console tabs clear)
- Scrolled entire page (watching for Mermaid chunk in Network tab)
- Hovered each product card
- Visited each `/products/<slug>` detail page
- Visited `<preview-url>/this-page-does-not-exist` (custom 404 check)
- Submitted one test form on a product detail page
- Tabbed through entire home page with keyboard only

| Metric | Value |
|--------|-------|
| Console error count | [FILL IN — MUST be 0] |
| PostHog ingestion warnings count | [FILL IN — check https://us.posthog.com/project/<id>/data-management/ingestion-warnings, filter "last 1 hour"] |
| Mermaid chunk in network log AT page load | [FILL IN — MUST be "no"] |
| Mermaid chunk in network log AFTER scroll to first diagram | [FILL IN — MUST be "yes"] |
| Mermaid chunk filename | [FILL IN — e.g., `mermaid-D8a92f1c.js`] |
| Mermaid chunk size (transfer) | [FILL IN — kB] |
| Custom 404 page: branded UI rendered (not Vercel default) | [FILL IN — yes/no] |
| Custom 404 page: HTTP status code | [FILL IN — MUST be 404] |
| Custom 404 back-link returns to `/` | [FILL IN — yes/no] |
| Tab navigation: focus rings visible on all focusable elements | [FILL IN — yes/no] |
| PostHog test form event appeared in events feed | [FILL IN — yes/no + event name] |

**Notes / oddities:**
[FILL IN or "None"]

**If any measurement fails threshold:** STOP. Document under "## T+0h Blocking Issues" below and do NOT proceed to T+12h until resolved, redeployed, and re-soaked.

---

## T+12h Snapshot

**Timestamp:** [FILL IN: ISO-8601, must be ≥12h after T+0h timestamp]
**Browser:** [FILL IN: different browser from T+0h — e.g., Safari 17.4 macOS, incognito]
**Actions performed:** Same as T+0h protocol above.

| Metric | Value |
|--------|-------|
| Console error count | [FILL IN — MUST be 0] |
| PostHog ingestion warnings count | [FILL IN — filter "last 12 hours" from soak start] |
| Mermaid chunk in network log AT page load | [FILL IN — MUST be "no"] |
| Mermaid chunk in network log AFTER scroll to first diagram | [FILL IN — MUST be "yes"] |
| Mermaid chunk filename | [FILL IN] |
| Mermaid chunk size (transfer) | [FILL IN — kB] |
| Custom 404 page: branded UI rendered | [FILL IN — yes/no] |
| Custom 404 page: HTTP status code | [FILL IN — MUST be 404] |
| Tab navigation: focus rings visible | [FILL IN — yes/no] |

**Notes / oddities:**
[FILL IN or "None"]

---

## T+24h Snapshot

**Timestamp:** [FILL IN: ISO-8601, must be ≥24h after T+0h timestamp]
**Browser:** [FILL IN: third browser if possible — e.g., Firefox 137 macOS, incognito]
**Actions performed:** Same as T+0h protocol above.

| Metric | Value |
|--------|-------|
| Console error count | [FILL IN — MUST be 0] |
| PostHog ingestion warnings count | [FILL IN — filter full soak window T+0h to T+24h] |
| Mermaid chunk in network log AT page load | [FILL IN — MUST be "no"] |
| Mermaid chunk in network log AFTER scroll to first diagram | [FILL IN — MUST be "yes"] |
| Mermaid chunk filename | [FILL IN] |
| Mermaid chunk size (transfer) | [FILL IN — kB] |
| Custom 404 page: branded UI rendered | [FILL IN — yes/no] |
| Custom 404 page: HTTP status code | [FILL IN — MUST be 404] |
| Tab navigation: focus rings visible | [FILL IN — yes/no] |

**Notes / oddities:**
[FILL IN or "None"]

---

### Lighthouse via PageSpeed Insights (T+24h)

**Instructions:** Open `https://pagespeed.web.dev/analysis?url=<preview-url>` (substitute your captured preview URL). Wait for both mobile + desktop runs to complete (~60-90 seconds each). Copy all four scores per form factor.

URL analyzed: `https://pagespeed.web.dev/analysis?url=` [FILL IN preview URL]

| Form factor | Performance | Accessibility | Best Practices | SEO | Pass (all ≥95)? |
|-------------|-------------|---------------|----------------|-----|------------------|
| Mobile | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN yes/no] |
| Desktop | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN yes/no] |

Lighthouse audit run timestamp: [FILL IN: ISO-8601]
PSI shareable link: [FILL IN: copy from PSI URL bar after run completes]

**If any score < 95:** Click into the Lighthouse trace to identify the failing diagnostic. Common fixes: verify Mermaid chunk lazy-loaded (Performance), verify `<meta name="description">` present in Base.astro (SEO), verify Hero is the LCP candidate (Performance). Document the diagnosis + any iteration below.

Lighthouse iteration log (if needed):
[FILL IN or "N/A — all scores ≥95 on first run"]

---

### OG image debugger (T+24h)

**Instructions:** Open `https://www.opengraph.xyz/?url=<preview-url>`. Wait for the debugger to fetch and render the preview card. Verify title, description, and image.

URL tested: [FILL IN]
Result: [FILL IN: PASS / FAIL]
Title rendered: [FILL IN — expected: "JigSpec" or similar]
Description rendered: [FILL IN — expected: mentions agentic AI / JigSpec studio]
Image rendered: [FILL IN: yes/no, with notes on edges/cropping]
Screenshot reference: [FILL IN: path to screenshot file, e.g., `.planning/phases/03-ship-it/og-debugger-screenshot.png`, OR note "not saved — visual confirmed in browser"]

Secondary validation (optional):
- Twitter Card Validator (`https://cards-dev.twitter.com/validator`): [FILL IN or "not tested"]
- Facebook Sharing Debugger (`https://developers.facebook.com/tools/debug/`): [FILL IN or "not tested"]

---

### Cold-read review (Pattern 4 / VISUAL-05)

**Instructions:** Recruit ONE person who has never seen the JigSpec landing page. Send ONLY the preview URL — no explanation. Message: "Quick favor — open this URL when you have 60 seconds free, then tell me in one paragraph what this company does and who it's for. No prep, no homework, just first read." Start a 60-second timer when they confirm page loaded. Capture verbatim response.

Reviewer: [FILL IN: first name only]
Reviewer persona: [FILL IN: e.g., "technical founder, has read AI/agent landing pages before, has not seen JigSpec content"]
Review date: [FILL IN: ISO-8601]
Method: Sent ONLY the preview URL. Started 60-second timer when reviewer confirmed page loaded.
Verbatim response: [FILL IN: exact words — do not paraphrase]

Pass criterion (≥ 2 of 3 must appear in the verbatim quote):
- [ ] Mentions agentic AI / autonomous agents / "AI that does things on its own"
- [ ] Mentions at least one product candidate / vertical (buggerd, .pipe.yaml spec, or a concept card)
- [ ] Mentions signal-driven roadmap ("figuring out what to build next") OR runtime concept ("a system that powers products")

Score: [FILL IN: X / 3]
Outcome: [FILL IN: PASS / FAIL]

**If FAIL:** STOP. Do NOT declare Phase 3 done. File iteration sub-tasks against:
- **CONTENT-01** if confusion is "what does this do" (hero tagline / falsifiable sub-line)
- **CONTENT-02** if confusion is "why is this different" (agentic AI explainer section)
- **VISUAL-02** if confusion is "where do I look first" (typographic hierarchy)
Recruit a DIFFERENT reviewer (the first reviewer's impression is now contaminated). Document the failure + iteration plan under "## VISUAL-05 Iteration Log" below.

---

## 16-item PITFALLS Measurement Table

**Instructions:** Fill each row with NUMERIC or VERBATIM measurements, not just ticks. Items 7, 15, 16 reference T+24h sections above — cross-reference those results here.

| # | Item | Verification method | Measurement | Pass |
|---|------|---------------------|-------------|------|
| 1 | All 6 product cards display correctly on iOS Safari, Android Chrome, desktop Firefox/Safari/Chrome | Manual cross-browser test during soak window | [FILL IN: list browsers tested + result per card count] | [yes/no] |
| 2 | Mermaid diagrams legible at 320/375/414/768/1024+ px | DevTools device toolbar in Chrome | [FILL IN: viewports tested, smallest readable font size at 320px, horizontal scroll behavior] | [yes/no] |
| 3 | All form submits fire `posthog.capture` (verify in PostHog Live Events) | Submit one form per card; check `https://us.posthog.com/project/<id>/events` | [FILL IN: N forms tested, N events captured, event names + productId payload confirmed] | [yes/no] |
| 4 | Slack notification destination receives test pings | Submit form → check Slack channel within 60s | [FILL IN or "n/a — Phase 3 deferred"] | [yes/no/n/a] |
| 5 | Email destination receives test pings | Submit form → check Gmail/Zapier within 60s | [FILL IN or "n/a — Phase 3 deferred"] | [yes/no/n/a] |
| 6 | Custom 404 page renders branded UI, returns HTTP 404, back-link returns to `/` | Visit `<preview-url>/this-page-does-not-exist` | [FILL IN: branded UI yes/no, HTTP status, back-link behavior, PostHog event captured yes/no] | [yes/no] |
| 7 | OG image renders correctly in opengraph.xyz debugger | See OG section above (T+24h) | [FILL IN: cross-reference OG section result] | [yes/no] |
| 8 | Favicon displays in browser tab on all 5 browsers | Manual check in each browser | [FILL IN: Chrome/Safari/Firefox/iOS Safari/Android Chrome — SVG or ICO, visible yes/no] | [yes/no] |
| 9 | No console errors on any page, any state | DevTools console at T+0h, T+12h, T+24h | [FILL IN: T+0h: N. T+12h: N. T+24h: N. Total: N.] | [yes/no] |
| 10 | No PostHog ingestion warnings during 24h soak | `https://us.posthog.com/project/<id>/data-management/ingestion-warnings` | [FILL IN: T+0h: N. T+12h: N. T+24h: N. Window: <T+0h ISO> to <T+24h ISO>.] | [yes/no] |
| 11 | All links 200 OK (no broken internal anchors, no 404s on external links) | Manual click-through or `lychee` link checker | [FILL IN: N total links, N external, all 200 OK yes/no, any broken links listed] | [yes/no] |
| 12 | All forms validate required fields (HTML5 + posthog.capture only fires on success) | Submit empty form → verify HTML5 validation; submit valid → verify PostHog event | [FILL IN: N forms tested, empty-submit behavior, valid-submit behavior] | [yes/no] |
| 13 | Tab navigation works through entire page, focus rings visible | Manual keyboard-only navigation on home + 1 product detail | [FILL IN: N focusable elements, focus ring style observed, any gaps] | [yes/no] |
| 14 | Screen reader announces semantic landmarks correctly | VoiceOver on macOS (Cmd+F5) or NVDA on Windows | [FILL IN: landmarks announced — banner, main, contentinfo; diagram aria-label; heading levels] | [yes/no] |
| 15 | Lighthouse ≥ 95 on perf/a11y/SEO/best-practices, mobile + desktop | See Lighthouse section above (T+24h) | [FILL IN: cross-reference Lighthouse table — mobile lowest score, desktop lowest score] | [yes/no] |
| 16 | External cold-reader articulates JigSpec value in 60s without leading | See Cold-read section above (Pattern 4 / VISUAL-05) | [FILL IN: cross-reference cold-read section — score X/3, PASS/FAIL] | [yes/no] |

---

## Final pass/fail decision

**Decision:** [FILL IN: PASS / FAIL]
**Decision timestamp:** [FILL IN: ISO-8601]

### Phase 3 success criteria (per ROADMAP)

| SC | Description | Status |
|----|-------------|--------|
| SC#1 | Both Mermaid diagrams render legibly at 320/375/414/768/1024+ px | [FILL IN: PASS / FAIL — refs PITFALLS item #2] |
| SC#2 | Mermaid chunk loads only after IntersectionObserver trigger (DIAGRAM-03) | [FILL IN: PASS / FAIL — refs T+0h chunk timing measurement] |
| SC#3 | Custom 404 page renders with HTTP 404 | [FILL IN: PASS / FAIL — refs PITFALLS item #6] |
| SC#4 | OG image + sitemap + canonical URL emitted on every page | [FILL IN: PASS / FAIL — refs Lighthouse SEO + OG debugger] |
| SC#5 | 24h preview soak with all 16 PITFALLS items measured + Lighthouse ≥95 + cold-read pass | [FILL IN: PASS / FAIL — refs entire log] |
| SC#6 (VISUAL-05) | External cold-read confirms positioning lands | [FILL IN: PASS / FAIL — refs cold-read section] |

### Aggregate metrics

| Metric | Value |
|--------|-------|
| Soak duration | [FILL IN: T+0h to T+24h, in hours] |
| Browsers covered | [FILL IN: list] |
| Total console errors across 3 snapshots | [FILL IN: number] |
| Total PostHog ingestion warnings across 3 snapshots | [FILL IN: number] |
| Lighthouse mobile (lowest of 4 categories) | [FILL IN: number] |
| Lighthouse desktop (lowest of 4 categories) | [FILL IN: number] |
| OG debugger result | [FILL IN: PASS / FAIL] |
| Cold-read score | [FILL IN: X / 3] |

### Outstanding items deferred to v2 / future phases

[FILL IN: any iteration items that surfaced during soak but did NOT block the soak gate, or "None"]

### Sign-off

Phase 3 is [FILL IN: COMPLETE / BLOCKED]. [FILL IN: If complete: "Ready for production DNS cutover." If blocked: describe the blocker and proposed Phase 3.5 mini-phase or in-plan fix.]

---

## Appendix: Blocking Issues Log

### T+0h Blocking Issues

[FILL IN if any T+0h measurement failed threshold, or delete this section if all T+0h measurements passed]

### T+12h Blocking Issues

[FILL IN if any T+12h measurement failed threshold, or delete this section if all T+12h measurements passed]

### VISUAL-05 Iteration Log

[FILL IN if cold-read failed — reviewer quote, confusion mapping to CONTENT-01/CONTENT-02/VISUAL-02, iteration sub-tasks, second-reviewer result — or delete this section if cold-read passed on first attempt]
