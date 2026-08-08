---
layout: ../layouts/Page.astro
title: Getting started
description: Reach the first two levels of Regen Engineering by hand, this week, with no tooling and nobody's permission.
---

# Getting started

You do not need a tool, a budget, or anyone's approval to start. The first two maturity levels are reachable by hand, and the exercise that tells you whether any of this applies to you takes about an hour.

Work in this order. Each step is useful even if you stop there.

## 1. Run the Regeneration Test on one module (about an hour)

Pick the module you understand best. Do not regenerate anything yet. Just answer the question:

> Could you delete this implementation today and regenerate a functionally equivalent one from your written knowledge alone, with the existing tests passing?

Then write down everything that makes the answer no. Rules that live only in someone's head. Decisions nobody recorded the reasoning for. Behaviour that exists because of an incident three years ago. Constraints imposed by a system nobody owns any more.

That list is your knowledge debt, and this is the whole point of the exercise. Most teams find it is both shorter and more alarming than expected: not thousands of missing pages, but a dozen specific facts that two people happen to know.

**If the list is empty**, you are in unusually good shape and can move straight to step 3. **If you cannot even assemble the list**, that is itself the finding, and it is the most valuable hour you will spend this month.

## 2. Write one knowledge package (an afternoon)

For that same module, create:

```
your-module/knowledge/
  overview.md        purpose, responsibilities, what is explicitly out of scope
  rules/BR-001.md    one file per business rule
  decisions/ADR-001.md   choices with real alternatives, and why
  assumptions/ASM-001.md things believed but never verified
```

Use the [schema](https://github.com/tysoncung/regen-engineering-schema) if you want your tree to be machine-checkable. If you would rather not commit to a format yet, plain Markdown in the right shape is fine; the schema can come later.

Two pieces of advice that matter more than the format:

**Write the assumptions down.** The `ASM-` items feel like the least important part and are usually the most valuable, because an assumption nobody has questioned is where systems break years later.

**Leave the contracts as a bulleted list for now.** Acceptance criteria in prose are enough at this stage. Turning them into an executable suite is a genuinely larger piece of work, and pretending otherwise would be the first lie this page tells you.

That is level 1, Captured. Knowledge exists beside the code and is reviewed with it.

## 3. Make the next change knowledge first

The next time a real task arrives for that module, resist opening the implementation. Instead:

1. Write the change as a knowledge delta: which rule is new, changed, or retired
2. Get it reviewed as a delta, before any code exists
3. Then implement, by hand or with an agent, from the knowledge

Pay attention to what happens in step 2. The usual experience is that a disagreement surfaces which would otherwise have appeared in a four hundred line pull request two days later, or worse, in production. Arguing about one sentence is cheaper than arguing about a diff.

That is level 2, Knowledge first.

## 4. The following week: mine a legacy module

Levels 1 and 2 are about code you understand. The harder and more valuable case is code nobody does.

Point a capable agent at an existing module and ask it to draft a knowledge package: rules, decisions, assumptions, all marked with how confident it is and what evidence it found. Then have a domain expert **correct** the draft.

The inversion is the whole trick. Nobody writes documentation from a blank page, but everybody will correct a wrong sentence about their own domain. Those corrections are the highest-value knowledge capture your organisation will ever do, because they are precisely the knowledge that existed only in people.

Budget for scheduling that review. It is most of the work, and it does not fit in a spare afternoon.

## If your system owns data

Everything above works on a stateless module and stops short of the first
question anyone asks about a real system, which is what happens to the database.

[regen-engineering-stateful](https://github.com/tysoncung/regen-engineering-stateful)
is the reference for that: a small billing ledger with four migrations, each one
a case that only exists once there are rows. It also carries the result that made
the case for any of this, which is on the [evidence](/evidence) page.

The short version, if you only take one thing: **populate a database with your
current build, restart against it, and see what still passes.** If everything
does, you have learned something real and it cost you an afternoon.

## What comes after

Levels 3 and 4, where modules are regenerable and regeneration is the normal response to change, need contracts that are knowledge rather than generated code, plus provenance and drift detection. That is what the [schema](https://github.com/tysoncung/regen-engineering-schema) and the [skills](https://github.com/tysoncung/regen-engineering-skills) exist for, and the [demo](https://github.com/tysoncung/regen-engineering-demo) shows it working end to end in two languages.

But do not start there. A team at level 1 with knowledge it trusts is in a far better position than a team at level 4 with a knowledge base nobody believes.

## If it does not help

You will have spent a couple of days and gained a written description of a system you own. That is the worst case, and it is not a bad one.

If it does not help, [say so](https://github.com/tysoncung/regen-engineering-demo/issues). Reports of this failing on real code are more useful right now than reports of it working, because the methodology has so far been tested mostly by the person who wrote it.
