# regen.engineering

The [Regen Engineering](https://regen.engineering) manifesto and its website.

> **Knowledge is the asset. Code is the byproduct.**

Regen Engineering is an open methodology for owning software as knowledge: the system's knowledge is the versioned, governed source, and implementations are verified build artifacts that any capable AI can regenerate, at the smallest scope, on any stack.

**Read it: [MANIFESTO.md](MANIFESTO.md), or at [regen.engineering](https://regen.engineering).**

## One source

[MANIFESTO.md](MANIFESTO.md) is the single source of the text. The website renders that same file at build time, so there is no second copy to drift out of date. A manifesto about knowledge drift should not have any.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Astro renders `MANIFESTO.md` into a single static page. No JavaScript is shipped to the browser.

## Deployment

Cloudflare Pages builds from `main` automatically.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |

## Contributing

The manifesto is version 0.1 and is meant to be argued with. Open an issue for disagreements, or a pull request for corrections. Substantial changes to the methodology will go through the REP (Regen Engineering Proposal) process once it exists.

## Licence

Text is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Site source is MIT.
