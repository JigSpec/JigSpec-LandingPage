# Feature Research

**Domain:** Company-level marketing landing page for an agentic-AI product studio, doubling as a demand-discovery instrument
**Researched:** 2026-04-27
**Confidence:** HIGH

---

## Framing

This page is unusual: it is **not** a SaaS landing trying to convert one product, and it is **not** a generic agency homepage. It is an **umbrella marketing site that is structurally a survey instrument**. Every visible feature serves one of three jobs:

1. **Educate** — get the visitor over the "what is agentic AI" comprehension wall (direct response to the buggerd post-mortem finding that visitors didn't understand what they were looking at).
2. **Differentiate** — separate JigSpec from the LangChain / n8n / Flowise / Dify / Kestra field, which all sell **platforms for building** AI; JigSpec **ships productized agentic services** and is honest about which vertical is real vs. probing.
3. **Capture demand signal** — produce a clean ranking of the 5 product cards (and an open-ended "tell us a problem" channel) so that after 4–8 weeks of traffic the next vertical decision is data-backed, not a coin flip.

Features below are categorized **by which of those three jobs they serve and how load-bearing they are**. The "anti-features" section is uncharacteristically long because the strategy notes flag "too many ideas wanting simultaneous execution" as the dominant failure mode for this org — saying no in writing is part of the work.

---

## Feature Landscape

### Table Stakes (Required for the page to function at all)

If any of these are missing, the page either (a) fails to communicate what JigSpec is, or (b) fails to capture the demand signal that justifies its existence. These are **non-negotiable for v1**.

| # | Feature | Why Required | Complexity | Stack Dependencies | Implementation Notes |
|---|---------|--------------|------------|--------------------|----------------------|
| TS-1 | **Apex hero** (tagline + sub-line) | Sets thesis in the first 3 seconds. Without it, visitors don't know what they're looking at. | LOW | Astro page, Tailwind | Two voice candidates ("confident & direct" vs. "engineering-blog pragmatic") sketched before lock-in per PROJECT.md. |
| TS-2 | **"What is agentic AI" educational explainer** | The buggerd post-mortem says visitors didn't realize buggerd was agentic AI. If this page assumes the visitor knows what agentic AI is, it inherits the same failure. | MEDIUM | Astro + Tailwind, possibly Mermaid | **Scope:** ~250–400 words. ~60–90 sec read. Plain-English, no jargon. Three beats: (1) what an "agent" is vs. a chatbot/script (acts, doesn't just answer), (2) what makes it "agentic" (loops, tools, decisions, gates), (3) why JigSpec's recipe is more reliable than the field (review gates, narrow scope, productized — *not* "build your own platform"). Anchored visually by Diagram 1 (TS-7). |
| TS-3 | **Product card grid — 5 cards, equal visual weight** | This IS the demand-discovery instrument. Equal weight is critical: any visual hierarchy biases the signal. | MEDIUM | Astro components | Cards: buggerd (live), Scientific paper agent, Triage + router bot, Always-on recorder + extractor, Delegate. Each card: 1-line problem, 1-line our pipeline, status pill ("Shipping" / "Gauging interest"), CTA. buggerd CTA → external link to buggerd.com; concept CTAs → in-page interest form (TS-4). Delegate's CTA may switch to its own landing once that ships (PROJECT.md notes Delegate has its own React/Vite landing in flight). |
| TS-4 | **"Interested?" form per concept card** | This is how the click signal becomes a typed signal. Click = curiosity; email + free-text = real demand. | LOW–MEDIUM | PostHog Surveys (or Tally fallback per PROJECT.md) | Three fields: email, "what would you use this for?" (free text, 1–3 sentences), optional "what tools/stack are you on?". Same form template per card with a hidden `card_id` field so submits are attributable. Inline reveal (not modal) — modals add friction and break analytics. |
| TS-5 | **"Tell us a problem we should solve" general capture** | Catches demand outside our 5 predefined buckets — the most strategically valuable signal because it's not anchored to our preconceptions. | LOW | PostHog Surveys (or Tally fallback) | Email + open-ended textarea. Lower in the page. Distinct event so it's separable from card-specific submits. |
| TS-6 | **PostHog analytics in hybrid mode** | If the page works but we can't measure card preference, the page failed at its primary job. PostHog hybrid mode (anonymous → identify on submit) avoids the cookie-banner tax. | MEDIUM | PostHog free tier, `posthog-js` | Combine **autocapture** (free coverage of incidental clicks/pageviews) with **named custom events** for the load-bearing actions (card clicks, form opens, form submits). PostHog's own guidance: autocapture for breadth, custom events for the specific actions you'll ship decisions on. ([PostHog Tutorials](https://posthog.com/tutorials/event-tracking-guide), [PostHog Autocapture docs](https://posthog.com/docs/product-analytics/autocapture)) |
| TS-7 | **Mermaid Diagram 1 — "How an agentic pipeline runs"** | Visual proof that JigSpec's reliability claim isn't vapor. Shows input → agent steps → tool calls → review gates → output. | MEDIUM | Mermaid client-side render, Astro island | **Scope:** A single horizontal flowchart. Nodes: `User input` → `Agent plan` → `Tool calls (search/code/data)` → `Self-check` → `Review gate (auto or human)` → `Output`. Branches showing retry on review-gate failure. ~6–9 nodes, no more. Anchors the "more reliable than the field" claim. |
| TS-8 | **Mermaid Diagram 2 — "How JigSpec ships a product to you"** | Process transparency — answers "what does engaging with you actually look like?" before the visitor has to ask. | MEDIUM | Mermaid client-side render | **Scope:** A 4–5 step horizontal pipeline: `You describe a repetitive problem` → `We design a pipeline (.pipe.yaml)` → `We build & evaluate it` → `You use it (managed service or licensed)`. Distinct from Diagram 1 — that one is about *runtime*, this one is about *engagement*. |
| TS-9 | **Footer with docs link + contact** | Standard expectation. Docs link points to interim VitePress location until the deferred docs cutover happens. | LOW | Astro layout | Copyright, contact email, link to current docs site, no nav clutter. |
| TS-10 | **Mobile-responsive layout** | Desktop is primary discovery, but social shares (LinkedIn, X, Slack DMs) hit mobile. A broken mobile view tanks shared-link conversion. | MEDIUM | Tailwind responsive utilities, Astro | Card grid collapses to single column on mobile; diagrams need horizontal scroll containers since Mermaid SVGs don't reflow well. |
| TS-11 | **Apex deployment to jigspec.com** (final phase) | The whole page is gated on apex DNS to be the marketing surface visitors actually find. Until then it's a preview URL. | LOW (mechanically) / HIGH (coordination) | Vercel + Cloudflare DNS | Gated on docs migration plan per PROJECT.md "Out of Scope." Final phase, not v1. |

**Total table-stakes count: 11.** This is intentionally tight — everything below is either differentiator or anti-feature.

---

### Differentiators (Where this page out-competes the LangChain/n8n/Dify field)

Drawn directly from the whitespace findings in `competitor_angles.md` (no competitor leads with correctness/reliability; observability is claimed but never visualized; "production-ready" is overused; no honest "here's what we ship vs. here's what we're probing" framing exists).

| # | Feature | Value Proposition | Complexity | Stack Dependencies | Implementation Notes |
|---|---------|-------------------|------------|--------------------|----------------------|
| D-1 | **"Shipping vs. Gauging interest" honesty pills on cards** | Every competitor pretends every product is shipping. We tell visitors which is real and which is a probe. This *is* the "honest about which vertical we're winning" differentiator from PROJECT.md. | LOW | Astro + Tailwind | Two-state pill: green "Shipping" (only buggerd), amber "Gauging interest" (4 concepts). Explicitly **not** "Coming soon" — that implies we've decided to build it; we haven't. |
| D-2 | **Editorial / tech-publication aesthetic** (vs. SaaS-template look) | LangChain/Flowise/Dify all look like Tailwind UI templates. A magazine-style hierarchy — large serif headlines, opinionated color, generous whitespace, single hero image or none — signals "this is a thinking company, not a feature checklist." | MEDIUM | Tailwind + custom font stack | Specifically distinct from buggerd's tighter zinc/emerald/monospace look (PROJECT.md constraint: "company brand isn't read as a derivative of one of its own products"). Reference: MIT Sloan articles, Anthropic homepage, Linear blog. |
| D-3 | **Visualized agentic execution (Diagram 1)** | `competitor_angles.md` whitespace finding #2: "Observability is claimed but not visualized." A diagram on the marketing page that shows the actual loop — tool calls, review gates, retries — turns a claim into a picture. | MEDIUM | Mermaid (already in stack) | Counts as both TS-7 and a differentiator. The competitive moat is that nobody else does this on their hero page. |
| D-4 | **Process transparency (Diagram 2 + plain-English engagement steps)** | None of the 5 competitors show "this is how working with us works." It's all "build agents fast." Showing the engagement flow signals seriousness and lowers the perceived activation cost. | MEDIUM | Mermaid + copy | Counts as both TS-8 and a differentiator. |
| D-5 | **Open-ended "problem you want solved?" capture** | Every competitor's only capture is "Sign up" or "Book a demo." Asking "what would *you* want us to build?" inverts the relationship — visitor as collaborator, not lead. | LOW | PostHog Surveys / Tally | Counts as TS-5 too. The differentiator is the framing of the field, not its existence. |
| D-6 | **No fake social proof** (deliberately empty where competitors show logos) | Every competitor has a logo bar or testimonials. Ours says nothing — which, in a category drowning in Fortune-500 logo theater, reads as confident. The honesty constraint becomes a brand asset. | LOW | n/a (omission) | This is technically an anti-feature (see AF-1) but its **strategic effect** is differentiation. Worth noting in both columns. |
| D-7 | **Spec-first / runtime-honest framing** | `competitor_angles.md` whitespace #1: "No one owns 'spec' or 'correctness.'" If hero/sub-line lean into "every pipeline is a spec'd process, not a vibe-coded prompt," we plant a flag in unclaimed territory. | LOW (copy work) | n/a (positioning) | Implementation is in copy choice, not code. Flagged here so the copy phase doesn't drift to generic "AI agents" language. |
| D-8 | **The page itself is the methodology demo** | Meta-move: "We pick verticals by measuring demand, not by guessing. This page is how we're picking the next one — which card you click is data we'll act on." Stating this on the page makes the visitor a participant and turns the survey-instrument shape into a story. | LOW | Copy near the card grid or in footer | Optional one-liner near the cards: *"These five aren't a roadmap. They're a question. Click the one that solves a problem you have — we'll build the winner."* High-leverage if it lands. |

---

### Anti-Features (Explicitly NOT built — with reasoning)

PROJECT.md and the strategy notes both flag scope-creep / "too many ideas" as the dominant failure mode. This list is intentionally long so future-Claude or future-Kate can search this file before adding any of these.

| # | Anti-Feature | Why It Seems Tempting | Why We're Not Building It | What We Do Instead |
|----|--------------|----------------------|---------------------------|--------------------|
| AF-1 | **Testimonials / customer logos / "trusted by" bar** | Every competitor has them; their absence is conspicuous. | Zero shipped customers. Fabricating credibility contradicts the company's tone (PROJECT.md "Voice exclusion") and contradicts the buggerd page's honesty stance. | Let the absence speak. The first real customer testimonial we earn becomes a v1.1 feature. |
| AF-2 | **Fabricated metrics / "5M downloads" / "10× faster" claims** | All five competitors lean on these (`competitor_angles.md`). | We don't have these metrics. Inventing them is fraud; quoting irrelevant ones (e.g., GitHub stars on the open spec) is misleading. | Real numbers when we have them. Until then, none. |
| AF-3 | **Live agentic-AI demo embedded on the page** | Visceral proof of the thesis. | If it fails in front of a visitor it looks like vaporware (PROJECT.md explicit constraint). Latency, cost, and reliability of an in-page agent demo are all wrong for a marketing surface. | Diagram 1 carries the visualization load. The buggerd CTA carries the "real product" load. |
| AF-4 | **Pricing page / paid tiers** | Standard SaaS expectation. | Concepts are pre-product. buggerd has its own pricing on its own page. JigSpec the company doesn't sell anything directly *yet*. | Card CTAs route to either real product (buggerd) or interest form. |
| AF-5 | **Authentication / dashboard / "manage your agents"** | Looks like a product. | Explicit user instruction (PROJECT.md): "this will come later down the road, as we need to set up infrastructure, audience, and start funding our time with customers." Building it now violates the strategy-notes rule "no platform for others to build on until one product works end-to-end." | Marketing site only in v1. Platform surfaces ship after vertical #1 hits revenue gate. |
| AF-6 | **Blog content in v1** | Editorial aesthetic invites blog content. | Astro stack chosen *so* a blog can be added later, but no posts ship in this milestone (PROJECT.md "Out of Scope"). | Astro content collections wired so adding posts is a one-step change post-launch. |
| AF-7 | **Niche-specific landing pages** | Each card could justify its own funnel. | User explicitly said "as niches form, we'll create more — that's a bit in the future." Right now we don't know which niche to deepen — that's *what this page exists to determine*. | One page, 5 cards, measure, then build niche pages for the winner. |
| AF-8 | **OSS runtime / `.pipe.yaml` documentation** | Natural to show "look, our spec is open." | Docs site's job, not this site's. Mixing dev-docs and marketing tanks both audiences (PROJECT.md "Replace jigspec.com" decision). | Footer link to current docs. Once docs cutover happens, link to new docs subdomain. |
| AF-9 | **Mega-menu navigation / multi-page IA** | Lean Labs reference (PROJECT.md) shows lots of menu patterns. | This is a single-page site with anchor scrolls. A mega-menu implies depth that doesn't exist behind it. | Minimal nav: logo + 2–3 anchor links (e.g., "What we build," "How we work," "Get in touch") + maybe an external "Docs" link. |
| AF-10 | **Newsletter signup (separate from product interest)** | Universal SaaS pattern. | Adds a third capture form competing with TS-4 and TS-5; muddies the demand signal; PostHog Surveys free tier has a per-survey limit and we'd burn one on low-value list-building. | Defer. If demand emerges from form free-text replies for "keep me posted on JigSpec generally," add v1.1. |
| AF-11 | **Cookie banner / GDPR consent UI** | Default reflex for analytics. | PostHog hybrid mode (anonymous → identify on submit, no persistent pre-submit cookies) means no banner is required (PROJECT.md "Analytics" constraint). Adding one anyway adds friction without a legal trigger. | Privacy disclosure in footer link. No banner. |
| AF-12 | **Live chat widget (Intercom / Crisp / etc.)** | "Founders should be reachable." | Adds a vendor, a script, a notification dependency, and a UI element that competes with the demand-capture form. Async email through TS-5 covers the same need without the noise. | Email link in footer. "Tell us a problem" form is the primary inbound. |
| AF-13 | **Auto-personalization / "what brings you here?" intent picker on entry** | Search-result patterns (Webflow templates, Shipixen, etc.) suggest progressive intent capture. | Adds friction at the worst possible moment (first 5 seconds), risks creating a roadblock before the educational explainer can do its work. PostHog can derive intent from card-click events without asking. | Let the visitor scroll. Capture intent from behavior, not interrogation. |
| AF-14 | **Animated agent walking through a demo / Lottie hero** | Visually impressive; trendy in AI marketing. | Distracts from copy that needs to be read carefully (the educational section). Mermaid diagrams already carry the "show, don't tell" load with less rendering risk. | Static hero; diagrams animate on scroll *only* if low-effort and accessible. |
| AF-15 | **A/B test infrastructure on v1** | PostHog supports it; tempting to "just turn it on." | We don't have enough traffic for statistical power, and we don't yet know which copy variant is the right baseline. PostHog Experiments adds complexity and dilutes the demand signal across variants. | Ship one well-considered version. Add experiments only if traffic justifies it (likely v1.x). |
| AF-16 | **Persistent header CTA** ("Book a demo" sticky) | Standard SaaS conversion pattern. | We don't book demos. Our CTAs are card-specific. A sticky CTA would have to point somewhere generic, diluting the demand signal. | Standard non-sticky nav. Cards do the CTA work. |
| AF-17 | **Pulling content from Notion** | Notion has the source-of-truth strategy docs. | Notion MCP not wired into the current Claude session (PROJECT.md). Building a runtime dependency on it adds infra risk for low value when content can be authored directly in markdown alongside the Astro project. | Content lives in Astro markdown / .astro files, version-controlled in the same repo. |

---

## Demand-Signal Mapping

This is the artifact the analytics schema (in STACK.md / ARCHITECTURE.md) will be built from. For each table-stakes / differentiator feature, what kind of signal does it produce?

### Signal Taxonomy

Three signal grades, by strength of demand inference:

- **L1 — Ambient** (page view, scroll depth): "someone is here." Useful for normalization (denominator).
- **L2 — Active interest** (card click, diagram interaction, FAQ open): "someone is engaging with a specific concept." Useful for ranking.
- **L3 — Committed intent** (form open, partial form fill, form submit): "someone wants this enough to type." Useful for prioritization and outreach.

### Signal Inventory

| Feature | Event Name(s) | Signal Grade | Properties Captured | Decision This Informs |
|---------|--------------|--------------|---------------------|------------------------|
| Apex hero (TS-1) | `$pageview` (auto) | L1 | `referrer`, `utm_*`, `device`, `country` | Traffic-source quality; baseline conversion denominator |
| "What is agentic AI" section (TS-2) | `educator_section_viewed` (custom, scroll-into-view) + `educator_read_time_ms` | L1→L2 | `scroll_depth_pct`, `time_on_section_ms` | Whether the buggerd-postmortem fix landed (are people actually reading the explainer, or scrolling past?) |
| Diagram 1 — pipeline run (TS-7 / D-3) | `diagram_viewed` (intersection observer), `diagram_zoomed` if interactive | L2 | `diagram_id: "pipeline_run"`, `dwell_ms` | Whether the visualization-as-differentiator is working |
| Diagram 2 — ship process (TS-8 / D-4) | `diagram_viewed` | L2 | `diagram_id: "ship_process"`, `dwell_ms` | Whether process-transparency framing resonates |
| Card grid impression (TS-3) | `cards_viewed` (when grid scrolls into view) | L1→L2 | `cards_visible: [...]`, `viewport` | Denominator for per-card click-through rate |
| **Per-card click** (TS-3) — **the primary signal** | `card_clicked` | L2 | `card_id` ∈ {`buggerd`, `paper_agent`, `triage_router`, `recorder_extractor`, `delegate`}, `card_position` (1–5), `cta_label` | **THE core demand-ranking signal.** This is what the page exists to produce. |
| Card hover/dwell (TS-3) | `card_dwell` (time hovered > 2s) | L2 | `card_id`, `dwell_ms` | Secondary signal — interest without click (e.g., "interesting but not enough info") |
| Interest form opened (TS-4) | `interest_form_opened` | L3 | `card_id`, `trigger` (e.g., `"card_cta"` vs `"second_visit"`) | Funnel: view → click → form open ratio per card |
| Interest form field focused (TS-4) | `interest_form_field_focused` | L3 | `card_id`, `field_name` | Identifies friction (which field do people stall on?) |
| Interest form abandoned (TS-4) | `interest_form_abandoned` (blur with partial fill, no submit within 60s) | L3 | `card_id`, `fields_filled: [...]`, `last_field_focused` | Critical: tells us where forms lose people |
| Interest form submitted (TS-4) | `interest_form_submitted` + PostHog `identify(email)` | L3 (strongest) | `card_id`, `email` (hashed for default events, plain on identify), `use_case_text_length`, `has_stack_text` | **The strongest per-card demand signal.** Combined with `card_clicked` gives us click→submit conversion per card. |
| "Tell us a problem" form opened (TS-5) | `general_capture_opened` | L3 | `scroll_position` | Did they read first or scroll straight here? |
| "Tell us a problem" form submitted (TS-5 / D-5) | `general_capture_submitted` + `identify(email)` | L3 (strategically highest) | `email`, `problem_text_length`, optional `tags_extracted` (post-hoc) | **The most strategically valuable signal** — surfaces problems we haven't thought to put on a card. Manual review weekly. |
| FAQ / detail expand (if present) | `disclosure_opened` | L2 | `disclosure_id` | Which questions visitors actually have |
| Outbound to buggerd.com (TS-3) | `outbound_clicked` (capture before navigation) | L2→L3 | `destination: "buggerd.com"`, `source_card: "buggerd"` | Confirms buggerd card → buggerd funnel handoff |
| Footer docs link clicked | `outbound_clicked` | L2 | `destination: "docs"` | Validates docs-audience demand for the cutover decision |

### Demand-Ranking Formula (suggested, for the analytics dashboard)

For each of the 5 cards, the composite demand score over a 4–8 week window:

```
demand_score(card) =
    1.0 × form_submits(card)            # weight: committed intent
  + 0.3 × form_opens(card)              # weight: serious interest
  + 0.1 × clicks(card)                  # weight: curiosity
  + 0.05 × dwell_events(card)           # weight: passive interest
```

(Weights are starting points, not gospel — calibrate after first 200 sessions.)

PostHog dashboard: one panel per card showing this composite, sorted descending. The vertical that wins after 4–8 weeks is the next vertical to deepen.

---

## Feature Dependencies

```
TS-1 (Hero copy)
    └──sets thesis for──> TS-2 (Educational explainer)
                              └──visualized by──> TS-7 (Diagram 1)

TS-2 (Educational explainer)
    └──earns trust to engage with──> TS-3 (Card grid)

TS-3 (Card grid)
    └──drives clicks into──> TS-4 (Per-card interest form)
    └──also surfaces──> TS-5 (General "tell us a problem" capture)

TS-6 (PostHog analytics)
    └──instruments──> TS-3, TS-4, TS-5  (without it, the page has no purpose)

TS-7 (Diagram 1) ──proves claim of──> D-7 (Spec-first / reliability framing)
TS-8 (Diagram 2) ──proves claim of──> D-4 (Process transparency)

D-1 (Honesty pills) ──depends on──> TS-3 (Card grid existing)

TS-11 (Apex DNS) ──depends on──> docs migration (deferred, separate phase)

AF-3 (No live demo) ──forces──> TS-7 (Diagram 1 must work hard)
AF-1 (No testimonials) ──forces──> D-7 (Spec/reliability copy must work hard)
```

### Dependency Notes

- **TS-2 → TS-3:** The educator section is load-bearing for card engagement. If a visitor doesn't understand agentic AI, they won't click a card. This is the buggerd post-mortem lesson directly encoded.
- **TS-6 → entire page purpose:** The page without analytics is a brochure. The page *with* analytics is a survey instrument. Analytics is not optional.
- **TS-7 / TS-8 → editorial aesthetic (D-2):** Mermaid renders are the visual backbone of the editorial look. If they're ugly or render slowly, the aesthetic differentiator fails. Style customization budget needed.
- **D-1 (honesty pills) → buggerd CTA differentiation:** Without the pill, buggerd's "Visit site →" CTA visually dominates the four "Tell us if you'd use this" CTAs and biases the demand signal. Pill normalizes the visual hierarchy.

---

## MVP Definition

### Launch With (v1)

The page is launched at a **non-apex preview URL** with everything below working end-to-end. Apex DNS swap (TS-11) is a separate, gated final step.

- [ ] TS-1 Apex hero (one of two voice candidates locked)
- [ ] TS-2 Educational "what is agentic AI" section (~250–400 words)
- [ ] TS-3 5-card product grid with equal weight
- [ ] TS-4 Per-card interest form (PostHog Surveys or Tally)
- [ ] TS-5 General "tell us a problem" capture
- [ ] TS-6 PostHog analytics (autocapture + custom events listed in Demand-Signal Mapping)
- [ ] TS-7 Diagram 1 — pipeline run
- [ ] TS-8 Diagram 2 — ship process
- [ ] TS-9 Footer with docs link + contact
- [ ] TS-10 Mobile-responsive layout
- [ ] D-1 Honesty pills on cards
- [ ] D-2 Editorial aesthetic (sketch phase resolves voice + visual direction)
- [ ] D-7 Spec-first / reliability copy threading through hero + educator + diagrams

### Add After Validation (v1.x — triggered by 4–8 weeks of traffic)

- [ ] PostHog Experiments / A/B testing on hero copy variants — once traffic justifies statistical power
- [ ] Niche landing page for the winning vertical — once the demand signal is unambiguous
- [ ] Newsletter signup — only if free-text capture surfaces "keep me posted" requests organically
- [ ] First customer testimonial — once we have a real one
- [ ] Anthropic / MIT-Sloan-style essay or two on agentic-AI thesis — moves toward the deferred blog

### Future Consideration (v2+)

- [ ] Blog (Astro content collections wired in v1, posts shipped in v2+)
- [ ] Hosted docs subdomain cutover (separate phase, owns docs site decisions)
- [ ] Customer dashboard / authenticated surfaces — gated on vertical #1 hitting revenue gate per strategy notes
- [ ] Live agent demo (only if reliability and cost economics make it safe)
- [ ] Multi-language / region surfaces

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| TS-1 Hero | HIGH | LOW | P1 |
| TS-2 Educator section | HIGH | MEDIUM | P1 |
| TS-3 Card grid | HIGH | MEDIUM | P1 |
| TS-4 Interest forms | HIGH | LOW | P1 |
| TS-5 General capture | HIGH | LOW | P1 |
| TS-6 PostHog analytics | HIGH | MEDIUM | P1 |
| TS-7 Diagram 1 | HIGH | MEDIUM | P1 |
| TS-8 Diagram 2 | MEDIUM | MEDIUM | P1 |
| TS-9 Footer | MEDIUM | LOW | P1 |
| TS-10 Mobile responsive | HIGH | MEDIUM | P1 |
| D-1 Honesty pills | HIGH | LOW | P1 |
| D-2 Editorial aesthetic | HIGH | MEDIUM–HIGH | P1 |
| D-7 Spec-first copy | HIGH | LOW (copy work) | P1 |
| D-8 "Page is the methodology" copy beat | MEDIUM | LOW | P2 |
| TS-11 Apex DNS swap | HIGH | LOW (mechanically) | P2 (final phase, gated) |
| Future: A/B test on hero | MEDIUM | MEDIUM | P3 |
| Future: Blog | MEDIUM | MEDIUM | P3 |

---

## Competitor Feature Comparison

Drawn from `competitor_angles.md`. Comparison limited to features relevant to *this* page; we are not competing on platform features (we're not selling a platform).

| Page Feature | LangChain | n8n | Flowise | Dify | Kestra | JigSpec (this page) |
|--------------|-----------|-----|---------|------|--------|---------------------|
| Hero claim | "Agents that work" | "AI workflow automation" | "Build AI agents visually" | "Production-ready AI agents" | "One platform for all workflows" | Reliability + honesty about what's shipping |
| Customer logos | 20+ Fortune 10 | yes (carousel) | 15+ enterprise | named testimonials | Apple/JP Morgan/etc. | **None** (deliberate) |
| Quantified metrics | "5 of Fortune 10" | 400k users (rumored) | 12k GitHub stars | 5M downloads | "10× faster pipelines" | **None** (deliberate — we don't have any yet) |
| Live demo | partial (LangSmith) | yes | yes | yes | yes | **No** (Diagram 1 carries the load) |
| Pricing page | yes | yes | yes | yes | yes | **No** (concepts pre-product, buggerd has its own) |
| Multi-product card grid | no (single platform) | no | no | no | no | **Yes** (5 equal cards — unique to us) |
| "Tell us a problem" open capture | no | no | no | no | no | **Yes** (unique differentiator) |
| Visualized agent execution | claimed, not shown | no | partial (canvas screenshots) | no | no | **Yes** (Mermaid Diagram 1 — whitespace claim) |
| Process / engagement transparency | no | no | no | no | no | **Yes** (Mermaid Diagram 2) |
| "Shipping vs probing" honesty | no | no | no | no | no | **Yes** (D-1 honesty pills) |

The pattern is clear: **JigSpec is doing things competitors aren't, and not doing things they are**. That's the bet.

---

## Quality-Gate Checklist (from research request)

- [x] Three categories clearly distinguished (table stakes vs differentiators vs anti-features) — sections are visually separated, anti-features expanded with reasoning.
- [x] Each feature noted with implementation complexity and stack dependency — both columns present in all three feature tables.
- [x] Demand-signal mapping included for the click-tracking analytics schema — full Demand-Signal Mapping section with event names, properties, signal grades.
- [x] Educational "what is agentic AI" explainer has a defined scope — TS-2 specifies 250–400 words, ~60–90 sec read, three beats.
- [x] Mermaid diagram features have specific scope — TS-7 (6–9 nodes, pipeline runtime), TS-8 (4–5 step engagement flow). Each has stated content and bound.

---

## Sources

- `/Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/PROJECT.md` (project requirements, constraints, decisions)
- `/Users/kjs/Documents/Business/jigspec/competitor_angles.md` (LangChain, n8n, Flowise, Dify, Kestra positioning analysis — extracted 2026-04-19)
- `/Users/kjs/Documents/Business/Buggerd/index.html` (proven sibling landing on similar audience — voice, FAQ, honesty pattern, dual-form pattern)
- `/Users/kjs/Documents/Business/jigspec-strategy-notes.md` (lifestyle business framing, ADHD failure modes, "too many ideas" guardrails)
- [PostHog event tracking guide](https://posthog.com/tutorials/event-tracking-guide) — autocapture + custom events recommendation
- [PostHog autocapture docs](https://posthog.com/docs/product-analytics/autocapture) — autocapture coverage and tuning
- [PostHog capture events docs](https://posthog.com/docs/product-analytics/capture-events) — `[object] [verb]` event naming convention
- General research on multi-product landing pages and progressive intent capture (web search 2026-04-27)

---
*Feature research for: company-level agentic-AI marketing site doubling as a demand-discovery instrument*
*Researched: 2026-04-27*
