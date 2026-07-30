---
layout: ../layouts/Page.astro
title: Maturity self-assessment
description: Five positions from code-first to regenerative, with an honest checklist for working out where you actually are.
---

# Where are you?

Five positions. Be honest rather than aspirational: the point of this is to find the next useful step, not to score well.

Read from the top and stop at the first level where you cannot tick everything.

## L0. Code first

The code is the only source of truth. It can tell you what the system does and never why.

- [ ] Business rules live in people's heads, tickets, and a wiki everyone knows is stale
- [ ] When someone leaves, knowledge leaves with them
- [ ] "Why does it do that?" is answered by reading code and guessing

Almost everyone starts here. It is not a moral failing, it is what the industry has optimised for.

**Next step:** [write one knowledge package](/start).

## L1. Captured

Knowledge is written beside the code and reviewed with it. Nothing is generated from it yet, and it is still worth the effort.

- [ ] Modules have a knowledge package: purpose, rules, decisions, assumptions
- [ ] Knowledge lives in version control, not a wiki
- [ ] Changing knowledge goes through review like code does
- [ ] Architecture decisions record the alternatives and why they lost

**Next step:** make the next change knowledge-first.

## L2. Knowledge first

The order of work has inverted. Knowledge changes before implementation, and review happens on the knowledge.

- [ ] Every behavioural change starts as a knowledge delta
- [ ] Deltas are reviewed before implementation exists
- [ ] Disagreements surface in the delta rather than in a large pull request
- [ ] AI assistance works from the knowledge rather than from a fresh prompt each time

This is roughly where the current generation of spec-driven tools leaves you, minus the lifecycle. It is a good place to be.

**Next step:** make contracts knowledge rather than generated code.

## L3. Regenerable

Individual modules pass the Regeneration Test. This is where verification becomes load-bearing.

- [ ] Contracts are knowledge: written and reviewed as knowledge, never edited to make a build pass
- [ ] Contracts sit at an interface boundary, never referencing internal classes or functions
- [ ] At least one module can be deleted and regenerated with the pre-existing contract suite passing
- [ ] Every generated module records its provenance: knowledge version, model, date, contracts passed
- [ ] Continuous integration blocks code-ahead drift
- [ ] Knowledge debt is measured rather than felt
- [ ] Regeneration is verified by an agent that did **not** write the code and cannot see the previous implementation

**Next step:** widen the set of modules that pass, and try a second stack.

## L4. Regenerative

Regeneration is the normal response to change, including a change of stack or model.

- [ ] Regenerating is a routine choice, not an event
- [ ] Knowledge has survived at least one stack or model change
- [ ] Line-by-line review of generated code has given way to knowledge review plus behaviour-diff review
- [ ] Regeneration runs on a schedule, so knowledge decay is found before it matters
- [ ] Drift produces a drafted knowledge change for review, not a chore for a human
- [ ] Security review has **not** been given up, at any level

Very few systems are here, and this document is not going to pretend otherwise.

---

## An honest note about scoring

L3 and L4 apply first to code whose behaviour can be stated: services, APIs, data pipelines, business logic. Interface feel, animation, performance tuning against a specific runtime, and exploratory work resist contracts, and regeneration is unsafe where behaviour cannot be verified.

If your system is mostly the second kind, L1 and L2 are the honest ceiling, and they still pay for themselves. That is not a failure of your team.

## The one question that matters

If the checklists are hard to answer, the [Regeneration Test](/#4-the-regeneration-test) cuts through them:

> Could you delete a module's implementation today and regenerate a functionally equivalent one from your knowledge alone, with the pre-existing contract suite passing?

Whatever makes the answer no is your knowledge debt, itemised. You can run that in an hour, without adopting anything.
