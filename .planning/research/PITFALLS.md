# Pitfalls Research

**Domain:** Agentic-AI company landing page (marketing surface + demand-discovery instrument), replacing apex docs site, multi-card portfolio with honesty-about-stage constraint
**Researched:** 2026-04-27
**Confidence:** HIGH (project-specific reasoning grounded in PROJECT.md, strategy notes, buggerd post-mortem, and verified PostHog/Mermaid behavior)

---

## How To Read This Document

Generic web-dev pitfalls (alt text, mobile breakpoints, lazy-loading images) are excluded by instruction. Every pitfall below is specific to one or more of the following five risk vectors that uniquely characterize this project:

1. **Agentic-recognition failure** (the buggerd post-mortem repeating)
2. **"Junk-drawer of ideas" perception** vs. "thesis-driven studio" perception
3. **Apex-cutover collateral damage** (developer-docs audience hits a marketing page)
4. **Demand-signal contamination** (the 5 cards must produce *clean* ranking data)
5. **Editorial-aesthetic execution risk** (bolder is harder than minimal)

Read the **Pitfall-to-Phase Mapping** at the bottom first if you're driving the roadmap.

---

## Critical Pitfalls

### Pitfall 1: The Buggerd Recognition Failure, Repeated at Company Scope

**What goes wrong:**
A visitor lands on jigspec.com, reads the hero, scrolls past the "what is agentic AI" section, sees the cards, and leaves without internalizing that JigSpec is an *agentic-AI studio* with a differentiated reliability claim. The page reads as "another AI startup landing page" — interchangeable with LangChain/Dify/Flowise positioning the visitor has already seen seven times this month. The exact failure mode that killed buggerd's first read scales up to the company level, where it's worse: visitors don't even reach a product, they bounce at the umbrella.

**Why it happens:**
- The "what is agentic AI" section gets treated as filler content (a paragraph nobody reads) instead of as the *load-bearing positioning device* it must be.
- Hero copy defaults to outcome-language ("Solving Real Problems with Agentic AI") that sounds like every other AI hero — verb-noun-adjective sludge.
- The reliability/autonomy claim — the actual differentiator vs. competitors who all promise "production-ready" — gets buried below the fold or stated abstractly without proof scaffolding.
- The educational layer doesn't actually *teach* anything new; it restates a definition the visitor already half-knows.

**Warning signs (what the page LOOKS like when this is happening):**
- "Agentic AI" appears 6+ times above the fold but is never *defined contrastively* against chatbots, copilots, or workflow automation.
- The educational section is a single paragraph or three bullet points — visually it reads as "skip me."
- Diagrams sit in a section the eye treats as decorative rather than as the diagram-driven explanation itself.
- Hero sub-line uses words like "intelligent," "powerful," "next-generation" — telling rather than showing.
- A non-technical reader cannot articulate, after one minute on the page, *what makes JigSpec's pipelines different from LangChain workflows*.

**Prevention strategy:**
- The "what is agentic AI" section must be a **structural** element — minimum 200–400 words, with a contrast table ("not this / this") that explicitly distinguishes agentic from chat/copilot/workflow-automation. Treat it like a feature, not copy.
- Hero sub-line must contain a **falsifiable, contrastive claim** — e.g., "Pipelines that finish, not chatbots that stall" or "Agents that ship work, not demos that wow." Whatever it is, a competitor's hero should not be able to use the same line.
- Mermaid Diagram 1 (pipeline run) must visibly show **review gates** — that is the *visual* form of the reliability claim. If the diagram is just boxes-and-arrows without the gating semantics, it's missing its job.
- Add an "is this for me?" qualifier section between the explainer and the cards — three concrete bullet examples of the kind of work agentic pipelines do well, written in the visitor's vocabulary, not ours.
- After internal-team review, do **one external validation** with someone who has never heard the JigSpec pitch: ask "what does this company do, in one sentence" — if the answer is "AI stuff" or "automation," the page failed and ships nothing yet.

**Phase to address:**
**Copy/voice phase** (sketch comparison) and **content-build phase** — this pitfall is fundamentally a copy-and-IA problem, not a tech problem. The voice sketches must produce a hero that survives the contrastive-claim test before any visual polish happens.

---

### Pitfall 2: The "Junk Drawer of Ideas" Read

**What goes wrong:**
The visitor sees five product cards of equal visual weight and concludes "this is one person spraying ideas at the wall." Instead of generating demand signal, the cards generate *concern* — visitors who would have engaged with a single, focused product page silently leave because the portfolio looks scattered. Worse: this read confirms exactly the strategy-notes failure mode ("too many ideas wanting simultaneous execution") even though the page is *intentionally* surfacing the cards as a discovery mechanism.

**Why it happens:**
- "Equal visual weight" was decided as a fairness/measurement principle, but visual equality without *thesis framing* reads as "we couldn't pick."
- Card copy describes each product on its own terms (what it does) without showing the **shared underlying capability** (one agentic runtime applied to different domains).
- The order of the cards looks arbitrary — visitors implicitly read top-left → bottom-right and infer priority from position even if no priority was intended.
- The "Tell us a problem we should solve" capture, sitting next to four "interested? tell us" cards, compounds the impression that the company doesn't know what it's doing.

**Warning signs:**
- Anyone reviewing the page asks "so which one is the actual product?" — that's the diagnostic.
- Cards have no shared visual language indicating they're built on the same engine — they look like screenshots of unrelated startups.
- The "what is agentic AI" section explains the technique generally, but the cards don't visibly inherit from it ("each card is a pipeline").
- No section on the page says "here's how we decide what to build next" — leaving the cards to imply "we'll build whichever one you like" which sounds desperate.

**Prevention strategy:**
- Add a **transitional sentence/section** above the card grid: literally something like *"One agentic runtime, applied to different domains. We're shipping the first; the rest are probes — tell us which one you want next."* This converts visual equality from "scattered" to "deliberate portfolio."
- Use a **shared card chrome** (consistent badge for stage: "Shipping" / "Probe" / "Sibling project"), so visitors instantly parse stage even at a glance. The labels remove the "is this real?" guessing without elevating buggerd visually.
- buggerd gets a **functional CTA** (link/button to buggerd.com), the four concept cards get **interest-capture CTAs** (form/button) — the *button text and color* differ even if card size doesn't. The visual equality is in card *footprint*, not in *call-to-action posture*.
- Order the cards intentionally and document the order rationale in a comment (not on the page) — buggerd first, then concepts in *thesis-supportive* order (related verticals near each other), so even an arbitrary reader extracts a story.
- The "tell us a problem" form must be **visually distinct from the cards** — different section, different background, different framing ("Beyond these — what's your problem?"). Otherwise it reads as a sixth card, doubling the junk-drawer effect.

**Phase to address:**
**IA/wireframe phase** — this is a layout and copy problem, not a styling problem. Decide card chrome, transitional copy, and the "tell us" form's separation before any visual design lands.

---

### Pitfall 3: Apex-Cutover Collateral Damage to Developer-Docs Audience

**What goes wrong:**
The DNS swap from VitePress docs to this Astro marketing site happens. A developer who has the existing jigspec.com docs URL bookmarked (or who is following a link from a tutorial, README, GitHub issue, or external blog post that references the OSS spec) types or clicks jigspec.com and lands on a marketing page about "agentic AI for everyone." They cannot find the API reference they came for. They close the tab and assume the project was abandoned, deprecated, or pivoted away from OSS. Search-engine deep-links to docs pages return 404s or redirect to a marketing page that doesn't have the content. SEO juice for the docs URLs evaporates.

**Why it happens:**
- The cutover is treated as a single switch ("flip DNS") instead of as a migration with a redirect map.
- The docs migration is deferred (per PROJECT.md), so there's no destination to redirect TO.
- The new site's footer mentions docs in a single text link — easy to miss on a page that visually does not look like documentation.
- No holding period: visitors who had old URLs in their browser history get the new page with no transition affordance.

**Prevention strategy (concrete, not "be careful"):**
- **Do NOT cut DNS until the docs site has a permanent home AND a redirect map exists.** This is non-negotiable. Add it explicitly as a cutover gate in the cutover phase.
- Stand up the docs migration target *before* cutover (e.g., `docs.jigspec.com`) — even if it's just the existing VitePress build, pointed at the subdomain. Migration of *content* can be deferred; migration of *hosting location* cannot be.
- Build a **redirect map** from known old URLs (`/guide/`, `/reference/`, `/api/`, etc.) to the new docs subdomain at the same paths. Implement at the Cloudflare level (Page Rules / Bulk Redirects) so it works regardless of the Astro site's routing.
- Add a **persistent docs banner or pill** in the new site's header (not just the footer) for the first 4–8 weeks post-cutover — something like *"Looking for the docs? They moved to docs.jigspec.com →"*. This handles the long tail of bookmarked or linked-to-from-elsewhere visitors.
- **Preview-deploy the cutover** as a staged rollout: deploy the marketing site to a preview URL, share with a handful of developers who actively use the docs, get explicit "I can find what I need" feedback before flipping DNS.
- Submit the new docs subdomain to search engines and update the canonical URL on the (legacy) docs HTML if any post-cutover indexing window exists.
- Set up a 404-monitoring alert on the marketing site for the first 30 days — every 404 is signal that a docs URL pattern was missed in the redirect map.

**Warning signs (post-cutover):**
- 404 spike in Vercel/Cloudflare logs — especially on `/guide/*` or `/reference/*` paths.
- GitHub issues, Discord messages, or DMs along the lines of "did you delete the docs?" or "where did the API reference go?"
- Drop in referral traffic from sites that link to the OSS docs (Stack Overflow answers, blog posts, GitHub READMEs).
- Bounce rate on the marketing page from referrers that historically went to docs paths is high — these are docs-seekers, not marketing visitors.

**Phase to address:**
**Cutover phase** (the final phase, gated). The cutover phase's success criteria must include: (a) docs hosting target exists, (b) redirect map implemented, (c) header banner deployed, (d) preview-deploy validated by ≥3 known docs users. If any of those are missing, do not flip DNS.

---

### Pitfall 4: Demand-Signal Contamination — Cards Look Either Too Real or Too Concept

**What goes wrong:**
The whole point of the page is to produce a clean demand ranking. Two failure modes destroy that signal:

- **Failure A (cards look too production-ready):** A visitor clicks "interested" on a concept card thinking they're signing up for a beta or waitlist. When they get a "we're gauging interest" response, they feel bait-and-switched. Worse, they DON'T click on the card they actually want most because they assume all four are equally available, so the "what should we build next" decision is made on noise.
- **Failure B (cards look obviously vapor):** A visitor recognizes the cards as concept-stage and either (a) doesn't bother clicking because "it's not real," or (b) does click but the click carries no real intent — it's idle curiosity, not "I would pay for this." The demand ranking becomes uncalibrated.

The 5-card grid is a measurement instrument; if the calibration is wrong, the data is misleading and the next-vertical decision is *worse than no data*.

**Why it happens:**
- The honesty-vs.-credibility tension is real and narrow. The visual designer wants pretty cards (which look "real"); the copy writer wants honest framing (which looks "concept"). Without an explicit decision on stage labeling, defaults pull toward whichever side the last person edited.
- "Interest" is an ambiguous click. Without a follow-on commitment (email + free-text), it's just curiosity.
- All four concept cards being labeled identically ("interested? tell us") collapses the priority signal — visitors might check 2–3 boxes equally.

**Measurable warning signs:**
- **Click-through rate above ~25% on every card simultaneously** — this means cards are being clicked indifferently, not selectively. Healthy demand signal looks like a Pareto: one or two cards get most of the clicks.
- **Form submissions with empty/junk free-text fields** — the email gets entered, the "what would you use this for" field gets "idk" or left blank. That's curiosity, not demand.
- **Drop-off between card click and form submit > 80%** — visitors clicked because the card looked real, then bailed when they realized it was an interest probe. (Less than ~50% drop-off is healthy for genuine interest.)
- **Inbound DMs/emails asking "is X actually available?"** — confusion about stage is happening in the wild.
- **No card receives a *qualitative* (free-text) response specific to a use case** after 4 weeks of traffic — visitors aren't engaging deeply enough for the data to mean anything.

**Prevention strategy:**
- **Ship explicit stage labels on every card.** Three labels, three colors, three meanings — nothing else:
  - `Shipping` (buggerd)
  - `Probe` (the four concepts)
  - `Sibling` (Delegate, if it gets that treatment)
  Stage labels go in a consistent badge slot, not in the card body where they can be missed.
- Each concept card's CTA copy should set expectation: not "Get started" or "Sign up" but **"Tell us you want this →"** — wording that makes the stage explicit at the click moment, not just at the card-glance moment.
- The interest-capture form must require **a qualitative field** ("How would you use this? / What's the most painful version of this problem for you?") *in addition to* email. The qualitative field is the actual signal; the email is the followup channel. Without the field, you have anonymous votes; with it, you have validated problems.
- Track click events as **named PostHog events with card identifier and stage** (`card_click_buggerd_shipping`, `card_click_paper_agent_probe`, etc.) so the dashboard can show clicks-by-stage and clicks-by-card separately. Mix them and the data is unreadable.
- **Define the demand ranking metric BEFORE traffic starts.** Is it raw clicks? Form submissions? Form submissions with non-empty qualitative fields? Without a pre-committed metric, the team will rationalize whichever number favors the card they already wanted to build (the strategy notes' "ambiguous decisions with no clear signal" failure mode applied to the page itself).

**Phase to address:**
**Card design phase** for stage labels and CTA copy; **PostHog instrumentation phase** for event naming and dashboard setup; **Pre-launch** for committing the demand metric in writing before traffic flows.

---

### Pitfall 5: PostHog Surveys Notification Gap (Verified — But Worse Than Stated)

**What goes wrong:**
Per the milestone context, the trade-off accepted is "no inbox notifications." Reality is a little more nuanced and a little worse: PostHog **does** support webhook and Slack destinations on submission events ([source](https://posthog.com/docs/surveys/webhook), [source](https://posthog.com/tutorials/slack-surveys)) — so the gap isn't technical, it's that *nobody wires the destination up because it's not part of v1 launch scope*. The page goes live, leads accumulate in a PostHog dashboard nobody opens, and by the time anyone notices, the high-intent leads from the launch window are weeks cold and won't reply to a "hey, you submitted interest a month ago" follow-up.

Compounding: PostHog's data pipeline destinations have their own [usage-based pricing](https://posthog.com/blog/data-pipeline-pricing) (per-trigger-event), but for a low-volume marketing-page survey scenario, this stays well within free territory. The cost objection that might justify *not* wiring webhooks doesn't apply at this scale.

**Why it happens:**
- Forms are perceived as "set it and forget it" infrastructure. They're not — every form needs a notification path or it silently rots.
- The PostHog Surveys decision was made on the basis of "free tier covers it for capture" — the destination side of the equation never got costed because the milestone context literally states "trade-off accepted: no inbox notifications."
- Dashboard-checking discipline is a fragile mitigation. A solo founder with ADHD failure modes (per strategy notes: "ambiguous decisions with no clear signal") will not consistently check a PostHog dashboard for survey responses if there's no external nudge.

**Prevention strategy:**
- **Wire up at least one webhook destination from PostHog Surveys submissions on day one.** Options, in order of effort:
  - Slack incoming webhook (5 min) — every submission posts a formatted message to a private channel.
  - Email-via-Zapier (15 min) — Zapier free tier handles this trivially; PostHog → Zapier → Gmail.
  - Discord webhook (5 min) — same as Slack if a Discord exists.
- **Set the destination filter to fire on `survey sent` events with non-empty qualitative fields** — junk submissions don't notify, real ones do.
- **Schedule a calendar reminder** (literally — recurring weekly calendar event) titled "Check PostHog leads dashboard" until the first ~10 submissions have been responded to. Habit doesn't form, calendar reminders do.
- **Document the fallback to Tally** (already noted in PROJECT.md) but also document the *trigger condition* for switching: if 30 days post-launch the team has missed responding to >2 leads within 48 hours, switch to Tally. Decide the trigger now so it's not relitigated under stress.

**Warning signs:**
- The PostHog Surveys dashboard is showing a count higher than the count of responses you've actually replied to.
- A submission's qualitative field references something time-sensitive ("I have a project starting next month") and the response goes out 3 weeks later.
- The first submission of any traffic spike (post-launch, post-share, post-press) gets responded to slowly because the dashboard wasn't being watched during the spike.

**Phase to address:**
**Forms/PostHog setup phase** — add "wire up Slack/Zapier webhook destination" as an explicit task in this phase, not a "nice to have." Verify with a test submission *before* the page is shared anywhere.

---

### Pitfall 6: Mermaid Diagrams as Load-Bearing UX That Quietly Degrade

**What goes wrong:**
The two Mermaid diagrams are doing genuine positioning work — Diagram 1 communicates the reliability/autonomy claim by visualizing review gates; Diagram 2 communicates process transparency. If they break in any of the ways below, they don't just look bad — they actively undercut the page's primary message. A diagram that "doesn't render" when explaining "our pipelines are reliable" is the worst possible failure mode.

Specific failure modes:
- **Render flash / FOUC** — visitor sees raw `graph TD` Markdown text for 200–800ms before Mermaid hydrates. Looks broken.
- **Mobile layout failure** — diagram renders at desktop width, overflows viewport on mobile, gets a horizontal scrollbar nobody discovers.
- **Bundle weight** — Mermaid is ~500KB+ minified ([reference](https://mfyz.com/smart-client-side-rendered-mermaid-charts-on-astro-blogs/)); loaded on every page (including future blog posts that don't need it) tanks the LCP that the editorial-aesthetic relies on.
- **Visual ugliness at default styling** — Mermaid's default theme is decent but generic; on a "bolder & editorial" page it looks like a Confluence wiki diagram pasted in.
- **JS-disabled / JS-failed visitor** sees nothing where a diagram should be. Empty space with no fallback context.
- **Slow CDN / blocked CDN** in some networks — the diagram never loads, visitor scrolls past empty space.

**Why it happens:**
- Mermaid is designed for client-side rendering ([GitHub issue #3650](https://github.com/mermaid-js/mermaid/issues/3650) — official SSR not supported); it has direct DOM access, so SSR'ing it requires Puppeteer or alternatives like [@rendermaid/core](https://jsr.io/@rendermaid/core) or [headless-mermaid](https://github.com/muhammadmuzzammil1998/headless-mermaid).
- The "bolder & editorial" aesthetic tolerates *less* visual dissonance than minimal-tech does — a diagram that would pass on buggerd's tighter layout looks shabby on this page.
- The diagrams are small enough (2 of them) that nobody invests engineering effort in render-quality, but visible enough that they're load-bearing.

**Prevention strategy:**
- **Render diagrams to SVG at build time, not at runtime.** Use a build-step tool (e.g., [@rendermaid/core](https://jsr.io/@rendermaid/core), or a custom Astro integration that runs `mmdc` / `mermaid-cli` during the build) and ship inline SVG to the page. This eliminates: FOUC, JS-disabled fallback gap, CDN dependency, bundle weight, render performance variability. The Mermaid runtime never ships to the client.
- **If build-time SVG isn't viable**, at minimum: lazy-load Mermaid only when the diagram section is in the viewport (Intersection Observer), show a styled placeholder (not raw Markdown) before hydration, and explicitly test on a throttled mobile connection.
- **Test diagrams on actual mobile viewports** at 320px, 375px, and 414px widths before shipping. If the diagram is wider than the viewport, it needs a redesign — not a horizontal scrollbar. (Acceptable redesigns: vertical layout instead of horizontal flow, simplified node text, two stacked diagrams instead of one wide one.)
- **Style the diagrams to match the editorial aesthetic** — custom Mermaid theme variables (font family, colors, node shapes) so they don't look like default Mermaid. If shipping inline SVG, post-process the SVG with the right typography and color palette.
- **Add a one-sentence caption under each diagram** that *also* communicates the diagram's point — so a visitor with the diagram broken still gets the message.

**Warning signs:**
- Diagrams visibly render *after* surrounding content settles (the diagram "pops in").
- Lighthouse mobile performance score below 90 with "JS execution time" being a major contributor.
- The diagrams look noticeably less polished than the surrounding typography in design reviews.
- Anyone reviewing the page on mobile horizontally-scrolls to see a diagram.

**Phase to address:**
**Diagram-build phase** — must precede final visual polish. Decide build-time-SVG vs. lazy-loaded-runtime as a *technical* decision early; it changes what the rest of the page can do for performance budgeting.

---

### Pitfall 7: The Editorial Aesthetic Lands at 70% — Worse Than Minimal at 95%

**What goes wrong:**
"Bolder & editorial / tech-publication aesthetic" is an objectively higher-execution-difficulty visual direction than buggerd's tight zinc/emerald/monospace minimal-tech style. The minimal-tech aesthetic is forgiving — it can be 80% executed and still look professional because there's less surface area for things to go wrong. Editorial aesthetic has a much steeper failure curve: a magazine-grade layout that's 70% executed looks like a *bad blog* — worse than no design opinion at all. Strong typography that's almost-right looks amateurish; strong color choices that don't *quite* hold together look loud; magazine-like hierarchy with one wrong size looks chaotic.

The cost is not just "the page looks meh." The cost is that an under-executed editorial aesthetic actively *undermines the studio-not-junk-drawer read* (Pitfall 2): a polished editorial page says "we have taste, we ship things"; an under-polished editorial page says "this person tried to look serious and didn't pull it off." That second read is fatal for the company-credibility job the page is doing.

**Why it happens:**
- Underestimation of the difference in execution difficulty between visual styles.
- Solo founder + non-technical co-founder team, neither of whom is a full-time designer (per strategy notes / PROJECT.md context).
- The two-voice sketch comparison is planned for *copy*, but the analogous visual sketch comparison may not happen — visual decisions get made implicitly by the developer building the page.
- Editorial aesthetic implies custom typography, intentional color palettes, deliberate whitespace — all things that take iteration. Limited iteration → 70% finish.

**Warning signs:**
- The page passes a "looks fine" review but no one says "this is sharp" unprompted.
- Type sizes were chosen by `text-2xl, text-xl, text-lg` defaults rather than by deliberate typographic scale.
- More than three accent colors in active use without a clear system.
- Card chrome, button styling, form styling all use shadcn/ui defaults or unmodified Tailwind components — fine on a minimal-tech site, generic on an editorial site.
- Diagrams (per Pitfall 6) look like Confluence wiki diagrams sitting next to magazine-style typography — the contrast is jarring.
- The hero looks indistinguishable from Vercel/Linear/any other "well-designed SaaS hero" — that's *not* the editorial aesthetic, that's the *default modern SaaS aesthetic*.

**Prevention strategy:**
- **Honest pre-build decision: minimal-tech 95% or editorial 70%?** If the team can't commit time/skill to landing editorial 90%+, downgrade the aesthetic intent rather than ship a half-rendered version. Minimal-tech-but-distinct-from-buggerd is a viable fallback (different palette, different typography, different layout grid, but not editorial).
- **Establish a 3-element typographic scale** (display / heading / body) with deliberate font choices and line-height ratios *before* layout begins. Magazine-grade type is the load-bearing element of editorial design — get it right or don't try.
- **Limit the palette to 4 colors** (background, surface, ink, one accent) for v1. Editorial does NOT mean "many colors" — it means deliberate color, often very restricted.
- **Reference real tech publications** (e.g., Increment, The Pragmatic Engineer, Quanta, Stripe Press, Bloomberg) — actually open them in a tab next to the page during design review. The reference raises the bar.
- **Visual sketch comparison phase**, mirror of the copy sketch phase: produce two visual treatments before committing. Same content, different visual direction. Pick the one that lands cleaner.
- **External design review** (one trusted designer, even informally — "does this look like a tech publication or like a blog?") before shipping. The team is too close to evaluate this themselves.

**Phase to address:**
**Visual sketch phase** (parallel to copy sketch phase) — must include the explicit "minimal-tech 95% or editorial 70%" decision. **Visual polish phase** — must have an external review gate.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode all card content in `index.astro` instead of a content collection | Ships faster, no Astro content-collections learning curve | When the 6th card or first blog post lands, you're refactoring the whole page; risk of inconsistent card chrome between cards | Acceptable in v1 *only if* there's a documented note that the next card-add triggers extraction to a content collection |
| Ship Mermaid via CDN runtime instead of build-time SVG | Saves a day of build pipeline work | Page weight, FOUC, mobile flakiness — all directly undermine the page's positioning job (Pitfall 6) | Never acceptable for these specific load-bearing diagrams; would be acceptable for blog-post diagrams later |
| Skip PostHog webhook destination, "we'll check the dashboard" | Saves 15 minutes of Zapier/Slack setup | Lost leads in launch window, founder-discipline failure mode (Pitfall 5) | Never acceptable — the cost of setup is dwarfed by the cost of one missed lead |
| Defer redirect map from old docs URLs until "we see what 404s come in" | Cutover ships sooner | Permanent SEO damage to docs URLs (which had years of indexing); developer-trust damage; recovery cost is months of slowly rebuilding inbound links | Never acceptable — redirect map is a cutover prerequisite |
| Use shadcn/ui or default Tailwind components without customization | Visual consistency, ships fast | Editorial aesthetic collapses to "another well-designed SaaS page" (Pitfall 7) — undermines the company-distinct positioning | Acceptable for non-hero non-card surfaces (footer, FAQ if added later); not acceptable for hero, cards, or section transitions |
| Single hero CTA pointing to "scroll down" / no real action | Hero stays clean | The page's primary job (signal capture) loses its highest-attention surface | Never acceptable — the hero needs at least one of: card-grid scroll-anchor, problem-capture form scroll-anchor, or buggerd CTA |
| Defer mobile layout testing to "after main desktop is done" | Faster desktop iteration | Mermaid diagrams (Pitfall 6) and editorial typography (Pitfall 7) both have steep mobile failure modes; refactor cost is high | Acceptable only if mobile review gate is explicit before launch — not "we'll get to it" |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| PostHog (hybrid privacy mode) | Forgetting that `posthog.identify()` needs to be called on form submit, not on page load — leaving submissions as anonymous events with no link to the email | Wire `identify` into the form-submit handler explicitly; verify with a test submission that the same person's pre- and post-submit events join up in PostHog |
| PostHog event naming | Using freeform event names per card, leading to typos that fragment the dashboard (`card_click_paper`, `cardClickPaper`, `paper_card_click`) | Define a `card_click` event with `card_id` and `card_stage` properties; one event, two properties — dashboard groups cleanly. Document naming in code comments |
| PostHog Surveys | Capturing only email, treating it as a waitlist signup | Always include a qualitative free-text field; the qualitative field is the actual demand signal, the email is the followup channel (Pitfall 4) |
| Vercel deploy | Auto-deploy from `main` without preview environments; first preview is in production | Configure preview deployments for PRs; use a preview URL for the entire pre-cutover period — apex DNS swap is the *last* deploy that touches production, not the first |
| Cloudflare DNS | Not setting up the redirect map at the Cloudflare level (Page Rules / Bulk Redirects) — relying instead on Astro routing for old-docs URLs | Implement redirects at Cloudflare so they fire before Astro routing, work even on URLs Astro doesn't know about, and survive any Vercel routing changes |
| Mermaid client render | Loading the full Mermaid bundle on every page including future blog posts that have no diagrams | If runtime render is used at all, conditionally load only when a Mermaid block is present in the page; better, render at build time and ship inline SVG |
| Buggerd link | Linking buggerd card to the buggerd marketing page with no UTM parameters — losing attribution of which JigSpec visitors converted to buggerd interest | Use UTM (`utm_source=jigspec&utm_medium=card&utm_campaign=portfolio_grid`) on the buggerd outbound link; helps measure whether the umbrella site is funneling traffic to the shipping product |
| Delegate sibling card | Linking to a Delegate landing page that doesn't exist yet, or to a placeholder, breaking the card's CTA | Treat Delegate's card identically to other concept cards (interest-capture form) until Delegate's own landing is shippable; switch the link only after that landing is up |

---

## Performance Traps

The site is small and traffic is expected to be modest, so most performance concerns are about *perceived* quality rather than scale failure. The traps below are the ones that would matter for this project.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Mermaid runtime bundle on every page | LCP > 2.5s; "Reduce JavaScript execution time" warning in Lighthouse | Build-time SVG (preferred) or conditional load (fallback) | Becomes painful as soon as the blog launches and most blog posts don't need diagrams — the Mermaid runtime ships anyway |
| Custom font loading without `font-display: swap` and preload | FOIT (flash of invisible text) on the editorial typography that the aesthetic depends on | Self-host the font with `font-display: swap`, preload the primary font in the `<head>`, subset to Latin-1 if applicable | First-paint feels slow on slower connections; editorial aesthetic looks especially bad mid-load |
| Tailwind CSS unminified or with unused utilities | CSS bundle 100KB+; render-blocking | Astro + Tailwind defaults handle this if `content` config is correct — verify the production CSS bundle is < 30KB | Only matters if Tailwind config gets miswritten; verify post-build |
| PostHog full snippet in `<head>` blocking | TTI delayed | PostHog is async by default — verify the snippet is the official async loader, not a custom inline copy | Rare with default install; check if anyone "optimizes" the snippet |
| All cards loading their hero images at full resolution | Largest Contentful Paint regression | Astro `<Image>` component for any card images; native lazy-loading for below-fold images | If images get added to cards (currently the design may be type-only); preempt by using `<Image>` from the start |

---

## Security Mistakes

This is a static marketing site with no auth and no backend, so the security surface is small. The mistakes below are the project-specific ones.

| Mistake | Risk | Prevention |
|---------|------|------------|
| PostHog API key leakage in client-side code (intended) but with project that has *recordings* enabled | Session replay capturing form input on a page that has email capture — PII in recordings | Verify recordings are disabled at the project level (or masking is enforced) before shipping. PostHog *can* record sessions; the privacy mode chosen says it shouldn't, but verify — don't assume |
| Email capture forms without rate limiting | Form spam fills the PostHog Surveys quota (1500 responses/month free), kills budget or crowds out real submissions | PostHog Surveys has built-in throttling per-respondent; add a honeypot field (hidden input that bots fill but humans don't) as low-cost defense |
| Open redirect via UTM-tagged outbound links | Phishing campaigns appending malicious destinations | All outbound links are hardcoded; do not implement any "redirect handler" that takes a destination in a query parameter |
| Cloudflare redirects misconfigured during cutover | Open redirect at apex (e.g., `jigspec.com/?next=evil.com` resolving incorrectly) | Cloudflare Page Rules / Bulk Redirects use exact path matching; review the redirect map for any pattern that takes user input |
| `mailto:` link or contact email exposed in plaintext on the page | Scraped, added to spam lists, contaminates the same inbox that's supposed to receive PostHog notifications | Use a contact form (PostHog Survey) instead of a public email address, OR use an alias forwarder (e.g., `hello@jigspec.com` via Cloudflare Email Routing) that can be rotated if it becomes a spam target |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hero asks "what do you want to build with agentic AI?" | Visitor doesn't know yet — that's why they're on the page; question induces decision paralysis | Hero asserts; cards present; capture is for visitors who already have a problem in mind. Don't ask the visitor to do the studio's job |
| Educational section uses jargon ("agents," "tools," "review gates," "pipelines") without defining them in plain language | Visitor who came in cold (the target audience) bounces because they think the page isn't for them | Define each term inline the first time it's used; the educational section is the place where "agentic AI = an LLM that takes actions in tools to complete a multi-step task, with review at gates" gets stated, not assumed |
| Card grid above the fold | Cards get clicked before the educational layer does its work; click signal is uninformed | Cards below the fold, after the explainer; visitors who scroll to cards have ingested context and clicks mean more |
| Form submit success state is silent or generic ("Thanks!") | Visitor who just gave an email feels unheard, doubts the team is real | Success state names back what the visitor said: "Got it — we'll be in touch about [card name]. Expect a reply within [N] business days." Sets expectation, signals real human on the other end |
| "Tell us a problem we should solve" form has no examples | Visitors stare at an empty textarea and bail; the open-ended capture produces near-zero signal | Show 2–3 example responses below the textarea: *"e.g., 'I need to extract financial data from 200 PDFs a week,' 'I want incoming support emails triaged before they hit my inbox,' 'I'd pay for an agent that reads new arXiv papers in my field daily.'"* Examples teach the form |
| Footer link to docs as a single text link in a 12pt grey footer | Developers looking for docs miss it entirely | Per Pitfall 3: persistent header banner during the post-cutover transition window, not just a footer link |
| Mobile nav (if hamburger) hides the docs link | Same problem as above, worse on mobile | Docs link is *always* visible regardless of viewport; can be a small pill in the header rather than nav-menu-hidden |
| Card hover states that change card height or shift layout | Cumulative Layout Shift; jittery scroll experience | Hover states change color/border/shadow — never width or height. Verify CLS metric stays low |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Hero copy:** Often missing a *contrastive, falsifiable* differentiator — verify a competitor (LangChain, Dify) couldn't run the same hero line.
- [ ] **Educational section:** Often missing the *contrast* against chat/copilot/workflow-automation — verify a non-technical reader can articulate *what makes JigSpec's pipelines different* after one read.
- [ ] **Card stage labels:** Often missing or inconsistent — verify every card has exactly one of `Shipping` / `Probe` / `Sibling` and the labels are visually consistent.
- [ ] **PostHog `identify`:** Often missing on form-submit — verify by submitting a test form and checking that pre-submit events for the same session join up in PostHog.
- [ ] **PostHog Surveys notification destination:** Often missing entirely — verify by submitting a test response and confirming a Slack/email notification fires.
- [ ] **PostHog event naming consistency:** Often missing one card or has typos — verify all 5 cards fire `card_click` with correct `card_id` and `card_stage` properties.
- [ ] **Demand-ranking metric definition:** Often missing — verify there is a written document stating "the metric we'll use to rank cards is X, measured over Y weeks, with at least Z submissions per card to be considered signal."
- [ ] **Mermaid diagram fallback:** Often missing — verify diagrams have a caption that conveys the diagram's message even if the SVG fails to render.
- [ ] **Mermaid mobile rendering:** Often missing — verify on real mobile viewports (320px / 375px), not just devtools narrow window.
- [ ] **Redirect map for old docs URLs:** Often missing — verify a list of old VitePress docs URLs has been mapped to the new docs subdomain *before* DNS cutover.
- [ ] **Docs subdomain availability:** Often missing — verify `docs.jigspec.com` (or chosen subdomain) is live and serving the existing docs content *before* DNS cutover.
- [ ] **404 monitoring:** Often missing — verify a Cloudflare or Vercel alert fires on 404 spike post-cutover.
- [ ] **Buggerd UTM:** Often missing — verify the buggerd card's outbound link includes UTM parameters for attribution.
- [ ] **Form qualitative field:** Often missing or marked optional — verify every interest-capture form requires a free-text qualitative field, not just email.
- [ ] **External validation read:** Often missing — verify at least one person who has never heard the JigSpec pitch has reviewed the page and articulated back what JigSpec does in one sentence.
- [ ] **Visual external review:** Often missing — verify at least one designer (or a non-team member with strong visual taste) has reviewed the editorial aesthetic against actual tech-publication references.

---

## Recovery Strategies

When pitfalls occur despite prevention, here's what recovery costs and looks like.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Pitfall 1 (Agentic-recognition failure) | MEDIUM — copy rewrite, no infra change | Diagnose via user interviews (5 cold reads); rewrite hero + educational section; A/B test the rewrite if traffic supports it; recovery time ~1 week |
| Pitfall 2 (Junk-drawer read) | MEDIUM — copy + minor layout change | Add transitional copy above the grid; add stage badges to cards; reorder cards intentionally; recovery time ~3 days |
| Pitfall 3 (Apex cutover damage) | HIGH — once the SEO/trust damage happens, recovery is months | Stand up `docs.jigspec.com` immediately; back-port redirect map even if late; publish a "we moved the docs" post on whatever channels reach the dev audience; submit redirect map to search engines; expect 60-90 days for indexing to recover. Prevention is *vastly* cheaper than recovery |
| Pitfall 4 (Demand-signal contamination) | HIGH — the data you collected may be unusable, requiring a relaunch of the measurement period | Add stage labels and qualitative-field requirements; reset the "signal collection window" to start now; explicitly discount pre-fix data when ranking |
| Pitfall 5 (PostHog notification gap) | LOW (going forward) / MEDIUM (sunk cost on missed leads) | Wire the webhook now; check the dashboard manually for the entire history; reach out individually to backlogged submissions with an apology and an explanation. Burn the goodwill, don't pretend it didn't happen |
| Pitfall 6 (Mermaid degradation) | LOW (build-time SVG migration) / MEDIUM (full diagram redesign for mobile) | Migrate to build-time SVG via `mmdc` or `@rendermaid/core`; redesign diagrams that don't fit mobile; recovery time ~2 days |
| Pitfall 7 (Editorial aesthetic at 70%) | HIGH — visual rework requires designer time, not just dev time | Honest call: either invest in a designer for a v1.5 polish pass, or pivot to a more forgiving minimal-tech aesthetic. Don't ship-and-iterate visual identity — it's the company's first impression |

---

## Pitfall-to-Phase Mapping

This is the load-bearing table for roadmap construction. Each pitfall is anchored to the phase that should prevent it.

| Pitfall | Prevention Phase | Verification (how we know prevention worked) |
|---------|------------------|----------------------------------------------|
| 1. Agentic-recognition failure | **Copy/voice sketch phase** + **Content build phase** | A cold reader articulates JigSpec's differentiator in one sentence; "agentic" is defined contrastively in the educational section |
| 2. Junk-drawer read | **IA/wireframe phase** | Stage badges present on every card; transitional copy above the grid; "Tell us a problem" form visually distinct from cards |
| 3. Apex cutover collateral damage | **Cutover phase** (gated) | Docs subdomain live; redirect map deployed at Cloudflare; header banner deployed; ≥3 docs users validated preview deploy |
| 4. Demand-signal contamination | **Card design phase** + **PostHog instrumentation phase** + **Pre-launch metric commit** | Stage labels live; qualitative field required on forms; named PostHog events with `card_id`/`card_stage` properties; demand-ranking metric documented in writing pre-launch |
| 5. PostHog notification gap | **Forms/PostHog setup phase** | Test submission triggers a Slack/email notification; weekly calendar reminder set; Tally fallback trigger condition documented |
| 6. Mermaid degradation | **Diagram-build phase** (must precede final visual polish) | Diagrams render at build time as inline SVG (or, fallback: lazy-loaded with styled placeholder); verified on 320px/375px/414px mobile; captions present |
| 7. Editorial aesthetic at 70% | **Visual sketch phase** + **Visual polish phase** | Two visual treatments produced and compared; type/color system documented; external designer review completed; explicit "minimal-tech 95% or editorial 90%+" decision made |

**Suggested phase ordering implications from this mapping:**

1. Copy/voice sketches and visual sketches happen **early and in parallel** — both are sketch phases that must produce decisions before build commits to either direction.
2. IA/wireframe happens **after** sketches but **before** build — it's where stage labels, card chrome, and form structure get fixed.
3. PostHog instrumentation happens **as part of build**, not after — events need names that match the design's card identifiers, and the notification destination must be wired before any traffic.
4. Diagram build is its **own phase** with technical-decision authority (build-time SVG vs. runtime), separate from visual polish.
5. Cutover is the **final, gated phase** — the gate is a checklist of Pitfall 3 prevention items, not a date.
6. Pre-launch checklist must include Pitfall 4's metric-commit and the "Looks Done But Isn't" verification list.

---

## Sources

- `/Users/kjs/Documents/Business/JigSpec-LandingPage/.planning/PROJECT.md` — project constraints, deferred dependencies, decision log
- `/Users/kjs/Documents/Business/jigspec-strategy-notes.md` — ADHD failure modes, "too many ideas" pattern, lifestyle business framing
- `/Users/kjs/Documents/Business/Buggerd/index.html` — reference for the post-mortem-informed prevention of Pitfall 1, and the minimal-tech aesthetic baseline that Pitfall 7 contrasts against
- `/Users/kjs/Documents/Business/jigspec/competitor_angles.md` — competitor positioning landscape that informs the "contrastive falsifiable claim" prevention for Pitfall 1
- [PostHog Surveys webhook destinations docs](https://posthog.com/docs/surveys/webhook) — confirms webhook/Slack notifications ARE supported (HIGH confidence; corrects partial misstatement in milestone context)
- [PostHog Slack survey tutorial](https://posthog.com/tutorials/slack-surveys) — concrete setup steps for Pitfall 5 mitigation
- [PostHog data pipeline pricing](https://posthog.com/blog/data-pipeline-pricing) — verifies that low-volume webhook destinations stay in free territory
- [PostHog pricing / free tier](https://posthog.com/pricing) — 1500 survey responses/month, 1M events/month free
- [Mermaid SSR limitations (GitHub issue #3650)](https://github.com/mermaid-js/mermaid/issues/3650) — confirms no official SSR; informs Pitfall 6 build-time-SVG recommendation
- [@rendermaid/core](https://jsr.io/@rendermaid/core) — pure-TypeScript Mermaid SSR, viable build-time alternative
- [headless-mermaid](https://github.com/muhammadmuzzammil1998/headless-mermaid) — Puppeteer-based SSR alternative
- [Smart client-side Mermaid on Astro blogs](https://mfyz.com/smart-client-side-rendered-mermaid-charts-on-astro-blogs/) — pattern for conditional Mermaid loading if build-time SVG is rejected
- [Cloudflare apex domain DNS docs](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-zone-apex/) — apex DNS mechanics relevant to Pitfall 3 cutover

---
*Pitfalls research for: agentic-AI company landing page, demand-discovery instrument, apex docs replacement, honesty-about-stage constraint*
*Researched: 2026-04-27*
