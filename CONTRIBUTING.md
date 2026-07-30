# Contributing

Regen Engineering is version 0.1 and is meant to be argued with. Disagreement is the most useful contribution available right now, more useful than a pull request fixing a typo.

## The most valuable thing you can do

**Run the Regeneration Test on something you own** and tell us what happened.

> Could you delete a module's implementation today and regenerate a functionally equivalent one from your knowledge alone, with the pre-existing contract suite passing?

Report it honestly, especially when it fails. A methodology tested only by its author on examples chosen by its author is worth very little. What we most want to know:

- Where the knowledge turned out to be insufficient, and whether you could tell that apart from the model simply not being good enough
- Where the schema could not express something your domain needed
- Where the process was slower or more annoying than just writing the code
- Where a claim in the manifesto did not survive contact with your codebase

Open an issue titled `Field report: <what you tried>`. There is no template, because a template would make it feel like paperwork.

## Where things live

| Repository | Contains |
|---|---|
| [regen.engineering](https://github.com/tysoncung/regen.engineering) | Manifesto, website, REPs |
| [regen-engineering-schema](https://github.com/tysoncung/regen-engineering-schema) | Schema, JSON Schemas, tooling, CI action |
| [regen-engineering-skills](https://github.com/tysoncung/regen-engineering-skills) | Agent skills reference implementation |
| [regen-engineering-demo](https://github.com/tysoncung/regen-engineering-demo) | Two-stack worked example |

## What needs a REP and what does not

Changes to the methodology or the schema go through the [REP process](reps/). Everything else is a normal pull request:

- Bug fixes and clarifications: pull request
- Examples, adapters for other ecosystems, documentation: pull request
- Schema changes that could break existing knowledge trees, new item or relation types, changed maturity levels, changed normative rules: [REP](reps/REP-0001-the-rep-process.md)

If you are unsure, open an issue. Being told "just send the pull request" costs you nothing.

## Adapters are wanted

The methodology claims to be stack-independent, and that claim is only as good as the number of stacks anyone has actually tried. Particularly welcome:

- Contract runners for other languages, so a knowledge tree can be verified in Java, .NET, Go, Rust, or Ruby
- Skills ports for other agents, since the current pack targets Claude Code and portability is the point
- Knowledge conventions for ecosystems with strong existing norms, for instance Maven, Gradle, Bazel, or .NET

The demo's [contract runner](https://github.com/tysoncung/regen-engineering-demo/blob/main/contracts/run.mjs) is the reference. Note what it does not contain: any mention of a specific language. That constraint is the whole point, so an adapter that leaks implementation detail into contracts has missed it.

## House style for prose

The manifesto and documentation aim to be plain and argumentative rather than promotional.

- No em dashes. Commas, colons, and full stops carry the same weight.
- Concede weaknesses in the same paragraph as the claim, not in a footnote. The honest-limits sections exist because they make the strong claims credible.
- No marketing register. If a sentence would fit on a landing page for a product, rewrite it.
- British spellings, for consistency rather than principle.

## Code

- Tests before claims. The schema tooling has 32 cases, most of them negative, because a validator that only ever says OK is worthless.
- No dependencies unless there is a real reason. The demo runs anywhere Node and Python exist, with nothing to install, and that is deliberate.
- Comments explain constraints, not mechanics.

Run `npm test` in the schema repo and `node verify.mjs` in the demo before opening a pull request.

## Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report problems to conduct@regen.engineering.
