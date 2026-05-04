# Diagram fallback recipe (DIAGRAM-05)

> **Status:** documented, not implemented. Invoke ONLY if Plan 04-04's Lighthouse mobile-perf measurement comes in below 95 due to the Mermaid client-render chunk.

> **Recovery cost:** <=4 hours per RESEARCH § Pitfall 1 line 521. Single afternoon's work.

## When to invoke

The client-render path (Plan 04-01) is the v1 default because it is simpler, lighter on initial bundle, and well-supported. Switch to this fallback only when ALL of the following are true:

1. Lighthouse mobile-perf < 95 on the preview deploy at T+24h (Plan 04-04 soak).
2. PSI traces identify the Mermaid chunk (`mermaid-*.js` in `dist/_astro/`) as a top-3 contributor to LCP or TBT.
3. Reducing the diagram count or simplifying the source strings has not closed the gap.

If only (1) is true, audit other contributors first — image weight, font preload, third-party scripts. Mermaid is rarely the sole cause when the page has only 2 diagrams gated behind IntersectionObserver.

## Recipe (from RESEARCH § Pattern 3, lines 312-333)

### Step 1: Install the CLI

```bash
npm install --save-dev @mermaid-js/mermaid-cli@^11
```

The package ships Puppeteer + a bundled Chromium for headless SVG rendering. ~280MB on disk in node_modules; not shipped to production (devDependency only).

### Step 2: Author each diagram source as a `.mmd` file

```bash
mkdir -p src/diagrams
```

Move the DIAGRAM-01 source (currently inline in `src/pages/index.astro`) into `src/diagrams/pipeline-run.mmd`.
Move the DIAGRAM-02 source into `src/diagrams/ship-to-you.mmd`.

Each `.mmd` file contains ONLY the Mermaid source — no fences, no metadata.

### Step 3: Render to PNG-quality SVG at build time

```bash
mkdir -p public/diagrams
npx mmdc -i src/diagrams/pipeline-run.mmd -o public/diagrams/pipeline-run.svg -t default -b transparent
npx mmdc -i src/diagrams/ship-to-you.mmd -o public/diagrams/ship-to-you.svg -t default -b transparent

# Dark theme variants:
npx mmdc -i src/diagrams/pipeline-run.mmd -o public/diagrams/pipeline-run-dark.svg -t dark -b transparent
npx mmdc -i src/diagrams/ship-to-you.mmd -o public/diagrams/ship-to-you-dark.svg -t dark -b transparent
```

Wire into `package.json` scripts:

```json
{
  "scripts": {
    "diagrams:build": "mmdc -i src/diagrams/pipeline-run.mmd -o public/diagrams/pipeline-run.svg -t default -b transparent && mmdc -i src/diagrams/pipeline-run.mmd -o public/diagrams/pipeline-run-dark.svg -t dark -b transparent && mmdc -i src/diagrams/ship-to-you.mmd -o public/diagrams/ship-to-you.svg -t default -b transparent && mmdc -i src/diagrams/ship-to-you.mmd -o public/diagrams/ship-to-you-dark.svg -t dark -b transparent",
    "build": "npm run diagrams:build && astro build"
  }
}
```

### Step 4: Rewrite `src/components/diagrams/MermaidDiagram.astro`

Replace the IO + `import('mermaid')` body with a static `<img>` reference (or inline-fetched SVG with `data-theme` switch):

```astro
---
interface Props {
  diagramId: 'pipeline-run' | 'ship-to-you';
  caption: string;
}
const { diagramId, caption } = Astro.props;
---
<figure class="my-12" data-diagram-id={diagramId}>
  <div class="overflow-x-auto" role="img" aria-label={`Diagram: ${caption}`}>
    <img
      src={`/diagrams/${diagramId}.svg`}
      alt={caption}
      class="block mx-auto dark:hidden"
      width="800"
      height="400"
    />
    <img
      src={`/diagrams/${diagramId}-dark.svg`}
      alt={caption}
      class="hidden mx-auto dark:block"
      width="800"
      height="400"
    />
  </div>
  <figcaption class="mt-3 text-sm text-muted text-center italic">{caption}</figcaption>
</figure>
<!-- Phase 3 IO observer for diagram:view tracking — PRESERVE VERBATIM. -->
<script>
  // [paste the existing Phase 3 observer block from the current file — diagram:view fires on data-diagram-id wrapper entry]
</script>
```

Update `src/pages/index.astro` to remove the `source` prop from each `<MermaidDiagram>` instance (no longer needed — source is read from `.mmd` files at build time, not passed at component time).

### Step 5: Verify

```bash
npm run build
ls dist/diagrams/                                 # MUST list pipeline-run.svg, ship-to-you.svg + dark variants
grep -c "import('mermaid')" dist/_astro/*.js      # MUST equal 0 (Mermaid runtime gone from bundle)
ls dist/_astro/ | grep -i mermaid                 # MUST return no results
npx lighthouse [preview-url] --preset=mobile      # MUST score perf >= 95
```

## Verification after switching

- [ ] `dist/_astro/` contains NO `mermaid-*.js` chunk.
- [ ] `dist/diagrams/` contains 4 SVG files (light + dark for both diagrams).
- [ ] Diagrams render visually identical to client-render version on preview deploy.
- [ ] Phase 3's `track('diagram:view', ...)` observer still fires once per diagram (data-diagram-id attribute preserved on wrapper).
- [ ] Lighthouse mobile-perf >= 95 on PSI re-run.
- [ ] Mobile legibility at 320 / 375 / 414 px still passes (the SVG layouts may differ from the client-render layouts; re-verify per Plan 04-02 task 2 protocol).

## Why `mmdc` and not `@rendermaid/core`

Per RESEARCH § Pattern 3 (verified 2026-04-30):

- `@rendermaid/core` is JSR-only (`npm view @rendermaid/core` returned 404).
- Project status: pre-1.0 (v0.7.0, Feb 2026), single maintainer, flowcharts-only.
- `mmdc` (from `@mermaid-js/mermaid-cli`) is the official Mermaid CLI, supports all syntax types, used in production by hundreds of docs sites.
- The Puppeteer dependency is heavier but well-maintained and is devDependency-only (not shipped).

## Why this is documented and not implemented

Per ROADMAP.md DIAGRAM-05 acceptance, the requirement is satisfied by the existence of a documented, runnable escape hatch. Implementing the fallback proactively would:

1. Add ~280MB of devDependency disk weight that is not currently needed.
2. Couple the build to a Puppeteer install on every CI run.
3. Lose the lazy-load benefit for users on fast connections (current default delays the 700KB Mermaid runtime until viewport entry).

The recipe is ready to invoke if soak proves Lighthouse can't hold >=95 with client-render. Until then, client-render is the ship target.
