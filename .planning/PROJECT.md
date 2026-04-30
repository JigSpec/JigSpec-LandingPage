# JigSpec Landing Page

## What This Is

The company-level marketing site for JigSpec — the proprietary agentic-AI runtime and product studio behind the open `.pipe.yaml` spec and individual products like `buggerd`. The site introduces JigSpec as a company, explains agentic AI in plain English (anchoring our positioning that *our* agentic recipe is more reliable and autonomous than what's already out there), and surfaces a grid of product candidates — one shipping (buggerd) plus five concept-stage probes — so click and email signal can tell us which vertical to build next. The intended visitor is anyone with a repetitive or research-heavy task they suspect could be done by an autonomous agent: technical founders, ops leads, researchers, freelancers, knowledge workers. This page replaces `jigspec.com` (currently a VitePress docs site) as the apex; the docs migration to a separate subdomain is a known deferred dependency.

## Core Value

**Generate enough company-level credibility and product-candidate signal that we can confidently pick which vertical to ship next.** Every other section serves that: the agentic-AI explainer earns the visitor's trust to engage with the cards; the cards capture the demand signal; the "tell us a problem we should solve" capture extends the signal beyond our pre-defined options. If the page looks beautiful but doesn't produce a clear demand ranking after 4–8 weeks of traffic, it has failed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Apex hero: tagline ("Solving Real Problems with Agentic AI" or successor) + sub-line that distinguishes JigSpec's reliability/autonomy claim from generic agentic-AI noise
- [ ] "What is agentic AI" educational section in plain language (anchors the bolder/editorial tech-publication aesthetic and answers the buggerd post-mortem: visitors didn't realize what it was)
- [ ] Product card grid — equal visual weight, 6 cards:
  - buggerd (real product, links to buggerd.com)
  - Scientific paper agent (concept, "interested? tell us")
  - Triage + router bot (concept, "interested? tell us")
  - Always-on recorder + extractor (concept, "interested? tell us")
  - Delegate (concept, "interested? tell us" — sibling project's own landing exists separately)
  - Agentic Employees (concept, "interested? tell us" — JigSpec's take on the Marblism model: hire named AI agents for functional roles like inbox/SEO/lead-gen/support; reference https://www.marblism.com)
- [ ] "Tell us a problem we should solve" open-ended email + free-text capture (general demand probe beyond our predefined cards)
- [ ] Mermaid Diagram 1: How an agentic pipeline runs (input → agent steps → tools → review gates → output) — anchors the reliability/autonomy claim
- [ ] Mermaid Diagram 2: How JigSpec ships a product to you (your problem → we design pipeline → build → you use it) — process transparency
- [ ] PostHog analytics in hybrid mode: anonymous events by default, identify on form submit; track every product-card click as a named event so demand ranking is measurable
- [ ] Footer with link to current docs (interim location until cutover phase) and contact
- [ ] Responsive (mobile-first; site is primarily desktop-discovery but social shares hit mobile)
- [ ] Deployed to production at jigspec.com (DNS cutover from current VitePress site is the final phase — gated on docs having a migration plan)

### Out of Scope

- **Migrating the existing VitePress docs to a new home** — explicit user instruction "Hold for now"; surfaced as a deferred dependency in the cutover phase. The docs content is safe in git regardless.
- **Blog content in v1** — Astro stack chosen specifically so blog can be added later without re-platforming, but no blog posts ship in this milestone.
- **Niche-specific landing pages** — user said "as niches form, we'll create more landing pages — that's a bit in the future."
- **Pricing pages or paid tiers** — no products are monetized through this page; buggerd has its own funnel; concepts are pre-product.
- **Authentication / dashboard / "platform for managing agentic agents"** — user explicitly said "this will come later down the road, as we need to set up infrastructure, audience, and start funding our time with customers."
- **A live agentic-AI demo embedded on the page** — risks looking like vaporware if it fails in front of a visitor; the diagrams + buggerd CTA carry the demo load instead.
- **Testimonials / customer logos** — no shipped customers yet; fabricating credibility contradicts the company's tone.
- **OSS/runtime documentation on this site** — that's the docs site's job; this site sits above it.
- **Pulling content from Notion** — the Notion MCP isn't wired into the current Claude Code session; if it gets connected later we can supplement, but the page does not architecturally depend on Notion.

## Context

- **JigSpec is a lifestyle business by deliberate choice** — `jigspec-strategy-notes.md` (2026-04-23) sets the strategic frame: solo technical founder + non-technical co-founder, build-for-self-first, $5–20M ARR ceiling vertical, no VC trajectory. Two failure modes the strategy notes call out and that this page partially navigates: (a) "too many ideas wanting simultaneous execution" — we accept the tension by surfacing 5 cards anyway *because the page IS the mechanism for picking the One Vertical*, not a violation of it; (b) "ambiguous decisions with no clear signal" — the page exists to generate the signal so the next decision isn't ambiguous.
- **buggerd is the existing template for landing pages in this org.** Single static `index.html` + Tailwind CDN + Tally form + Vercel Pro + Cloudflare DNS. We're consciously upgrading the stack to Astro because this page needs to grow into a blog and possibly host more product surfaces; buggerd's stack hits its ceiling at one page.
- **The existing `jigspec.com` is a VitePress site** built from `/Users/kjs/Documents/Business/jigspec/docs/`. Replacing it requires a docs cutover that the user has explicitly deferred. Until cutover, this marketing site lives at a non-apex preview URL.
- **The "umbrella + flagship" tension was discussed and resolved:** all 5 cards are equal visual weight, and the data the page produces decides which becomes the flagship. The 1 shipping product (buggerd) gets a real CTA but no visual elevation over the concepts.
- **Competitor positioning research already exists** at `/Users/kjs/Documents/Business/jigspec/competitor_angles.md` — covers LangChain, n8n, Flowise, Dify, Kestra. Our positioning differentiator: those are platforms for *building* AI workflows; we are the company that *ships them as productized services* and is honest about which vertical we're winning vs. probing.
- **Sibling product surfaces:** `Delegate/` (sibling folder) has its own pre-product interest-gauge landing in flight on a different stack (React + Vite). Its card on this page should respect that — link to its own landing if/when ready, or use a "tell us" form like the other concepts in the meantime.
- **Audience-overlap watch — Delegate vs. Agentic Employees:** Both cards target small operators (freelancers/consultants for Delegate; founders/SMBs hiring functional AI roles for Agentic Employees). The framings differ — Delegate is "operations layer / agents-as-roles / outcomes-not-tasks," Agentic Employees is the named-persona-per-functional-area model exemplified by Marblism. The page intentionally surfaces both so the demand signal can tell us whether the audience differentiates them or collapses them into one. If demand collapses, that itself is the answer (one card was redundant).
- **The MIT Sloan articles the user linked** (agentic AI explainer, the emerging agentic enterprise, nine essential questions) are good reference reading for the educational section's voice; they're written for executives who don't yet know what "agentic" means, which mirrors our target visitor.
- **Lean Labs menu-design article** (https://www.leanlabs.com/blog/website-menu-design-examples) is the user's specified design reference for navigation patterns.
- **The buggerd post-mortem finding** that visitors didn't realize buggerd was an agentic AI product is the *single most important* piece of UX feedback informing this page. The "what is agentic AI" section, the diagrams, and the consistent reliability/autonomy framing are all direct responses to it.

## Constraints

- **Tech stack**: Astro + Tailwind CSS — Chosen so the site can grow into a blog without re-platforming and can co-host docs in the same repo if the future requires it. Mermaid renders client-side.
- **Hosting**: Vercel + Cloudflare DNS — Same pattern as buggerd; auto-deploy from `main`. Apex DNS swap from current VitePress site is gated on a separate docs-migration phase.
- **Repo**: GitHub under the existing JigSpec org (parallel to `JigSpec/buggerd`).
- **Analytics**: PostHog free tier, hybrid privacy mode — anonymous events by default, identify on form submit. No persistent cookies pre-submit, no cookie banner required.
- **Forms**: Hybrid — PostHog Surveys for the 5 structured per-card interest forms (with a Slack/Zapier-to-Gmail webhook destination wired on day one to close the inbox-notification gap), and bare `posthog.capture('problem_pitch', ...)` for the general "tell us a problem we should solve" free-text capture. Tally is the documented fallback if PostHog Surveys friction proves unworkable post-launch.
- **Visual identity**: Bolder & editorial — tech-publication aesthetic. Strong typography, magazine-like hierarchy, opinionated colors. Distinct from buggerd's tighter zinc/emerald/monospace look so the company brand isn't read as a derivative of one of its own products. **Designer of record: Claude (this assistant) — no human-designer hours budgeted.** Pitfall 7 from research is partially accepted: visual taste limitations are mitigated by sketching multiple treatments early and external cold-read review at launch gate.
- **Voice**: Two candidate voices in tension — (1) Confident & direct ("we built this, here's why it works") and (2) Pragmatic / engineering-blog ("here's the problem, here's our pipeline, click to vote"). Resolution: produce sketch comparisons in a sketch phase before locking copy. Both candidates avoid breathless-AI tone.
- **Voice exclusion**: No fake social proof, no fabricated metrics, no "trusted by Fortune 500" copy patterns. The honesty constraint that runs through the buggerd and Delegate landings carries here.
- **No backend** in v1 — Astro static output, all dynamic surfaces (forms, analytics) handled by third parties.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Company umbrella + 5 equal-weight product cards (buggerd + 4 concepts), no flagship elevation | Page IS the mechanism for picking next vertical; visual equality removes selection bias from the demand signal | — Pending |
| Replace jigspec.com (apex) with this site, defer docs migration as a known dependency | Marketing audience and developer-docs audience don't share a homepage well; user wants the marketing message at the apex | — Pending |
| Tech stack: Astro + Tailwind (not single-file static like buggerd) | Site needs to grow into blog + possibly hosted docs; the cost of upgrading later exceeds the cost of starting on Astro now | — Pending |
| Analytics: PostHog (not Tally/Plausible/GA4), hybrid anonymous+identify mode | Free tier covers it; demand ranking via custom events is the primary use case PostHog is built for; hybrid mode skips cookie banner | — Pending |
| Forms: PostHog Surveys primary, Tally as documented fallback | Keeps signal in one place; trades inbox notifications for unified data; Tally fallback de-risks if PostHog Surveys UX disappoints | — Pending |
| Mermaid diagrams: render client-side, two diagrams (pipeline run + ship-to-you), no architecture diagram | Two diagrams educate without cluttering; architecture diagram belongs on docs site | — Pending |
| Visual: bolder editorial / tech-publication aesthetic, distinct from buggerd | Company-level brand shouldn't read as a derivative of its own product | — Pending |
| Voice: two-sketch comparison in a sketch phase before locking copy | User wanted to see options 1 and 4 rendered before committing | — Pending |
| Notion MCP not relied on — content sourced from local Business folder | MCP wasn't wired into this session; deferring eliminates a session-dependency risk | — Pending |
| Forms split: PostHog Surveys for the 5 structured per-card forms, bare `posthog.capture` for the general "tell us a problem" free-text | Surveys' built-in form/dashboard/webhook UI is right for the structured CTAs; the open-ended capture is just an event with email + free-text — Surveys overhead isn't earned for it | — Pending |
| Docs cutover destination: `docs.jigspec.com` (existing VitePress build redeployed there before apex swap) | Conventional, easy Cloudflare redirect rule, preserves brand; locking it now allows Phase 9 (cutover) to plan against it instead of waiting on a side decision | — Pending |
| Demand-signal gate: 5 form submits per card OR 4 weeks of traffic, whichever comes first | Concrete and falsifiable — kills dead cards early, forces a vertical-pick decision at 4 weeks even if signal is mixed; uses research-recommended weighted formula (1.0×submits + 0.3×opens + 0.1×clicks + 0.05×dwell) for ranking | — Pending |
| Designer of record: Claude (this session); no human-designer hours budgeted | User explicitly accepts the trade-off; mitigations are early sketch comparison + external cold-read at launch gate, not external designer pass | — Pending |
| Add 6th card "Agentic Employees" (Marblism-style: hire named AI for functional ops roles) | Expands the demand-probe surface to include the SMB/founder hire-an-AI-employee model; intentionally creates a Delegate-overlap that the demand signal can resolve | — Pending |
| Visual direction: Sketch B — Engineering-Blog Pragmatic (Crimson Pro 600 display + Inter 400 body, cool indigo accent #6366F1 on near-white #FAFAF8) | Picked from two-sketch comparison in Phase 1; editorial serif posture matches Stratechery anchor (D-06) and voice candidate (2); accepted Phase 2 risk that serif body copy quality bar is higher | — Locked Phase 1 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-27 after initialization*
