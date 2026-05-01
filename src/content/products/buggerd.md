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

[Body placeholder — buggerd is the only `Shipping` card in the Phase 2 grid, and unlike the five concept cards it has no on-site `/products/[slug]` page. Clicking the buggerd card on the JigSpec home grid opens `https://buggerd.com` in a new tab; this body is therefore never rendered to a visitor on jigspec.com. It exists for two reasons: schema completeness, so every product file in `src/content/products/` validates against the same Zod shape; and authoring symmetry, so a future "promote a Probe to Shipping" workflow only requires changing the `cta.type` from `interest` to `external` plus adding a `url`, with the body already in place.]

[Describe in bracketed-placeholder voice what buggerd does — the agentic-CI loop that fixes failing test runs across a fleet of repos before a human is paged. Name the reliability claim explicitly: every fix is grounded in a reproduced failure, every change goes through the project's existing review process, no commits land without a green run. The audience is platform-engineering teams and small ops shops where "the CI is red again on Monday morning" is a familiar pattern. Keep tone honest — describe what the loop does and what its boundaries are, not what it might one day do.]

[Close with a one-sentence framing of why buggerd is the first card on the JigSpec page: the company sells a recipe for agents that ship; buggerd is the first product that runs that recipe end-to-end against a hard-to-fake substrate (whether the build goes green). Replace this entire body in the copy pass before launch.]
