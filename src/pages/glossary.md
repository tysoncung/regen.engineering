---
layout: ../layouts/Page.astro
title: Glossary
description: The vocabulary of Regen Engineering, defined in one place.
---

# Glossary

Methodologies spread as vocabulary. These are the terms, defined once.

## Knowledge Package

The knowledge a module owns: purpose, business rules, decisions, assumptions, contracts, and interface. Colocated with the module rather than filed somewhere central, because knowledge that belongs to everyone belongs to nobody.

## Knowledge Delta

The unit of change. A change to the knowledge, written and reviewed on its own, **before** any implementation exists. Arguing about a rule as one sentence is cheaper than discovering the disagreement in a four hundred line pull request.

## Knowledge Debt

Knowledge that is missing, wrong, or exists only in someone's head. Related to technical debt but upstream of it: technical debt makes change slow, knowledge debt makes change dangerous.

Measured with four numbers, all computable:

- **Coverage**: modules with a structurally complete knowledge package. A floor, not a quality measure.
- **Freshness**: modules built from current knowledge.
- **Integrity**: modules with code-ahead drift. Target zero. This is the rot metric.
- **Traceability**: active rules with both a verifying contract and an implementing module.

## Knowledge Compiler

The pipeline from knowledge to a deployed system: impact analysis, planning, generation, testing, verification. Today this is an agent plus continuous integration, not a product. The [skills](https://github.com/tysoncung/regen-engineering-skills) are one implementation of it.

## Regeneration Scope

The blast radius of a knowledge delta, computed from the links between knowledge items, and the boundary of what gets regenerated. Deterministic graph traversal, so it is computed rather than estimated.

## Regeneration Lineage

The provenance record for a generated artifact: which knowledge version, which model, on which date, and which contracts passed. Stored as `knowledge.lock` beside the module, or `knowledge.<stack>.lock` when a module has several implementations.

It turns questions into queries. Which modules were built from stale knowledge? Which were built by last year's model? Where has code drifted ahead of its source?

## Drift

Divergence between knowledge and implementation. It has a direction, and the two directions mean opposite things.

**Knowledge ahead of code** is normal. Someone decided something and the implementation has not caught up. That is a backlog.

**Code ahead of knowledge** is a defect. Something is true of the running system that the source of truth does not know. Detection is structural rather than semantic: a change touching a module's generated paths with no corresponding change to its knowledge.

## Drift Debt

Code-ahead drift that has been accepted deliberately, recorded with a reason, a date, and an owner. The escape hatch for genuine emergencies, because a methodology that forbids hotfixes will be ignored during the first outage.

It should be measured in days. An emergency hatch that becomes routine is rot with paperwork.

## Reconciliation

Mining an unplanned code change back into knowledge, clearing drift debt. Usually the right answer when drift is found.

## Knowledge Mining

Deriving draft knowledge from an existing system: its code, tests, commit history, and tickets. The way brownfield systems enter the methodology.

It works because of an inversion: nobody writes documentation from a blank page, but everybody will correct a wrong sentence about their own domain.

## The Regeneration Test

> Could you delete a module's implementation today and regenerate a functionally equivalent one from the knowledge repository alone, with the pre-existing contract suite passing?

Whatever makes that impossible is your knowledge debt, itemised.

Two caveats. It is relative to a named model, so a failure needs diagnosing before it is booked as knowledge debt. And it is bounded by the contracts you wrote, so passing means nothing contradicts what you specified, not that the implementations are equivalent in every respect.

## Behavioural equivalence under contract

The standard regeneration is held to. Not textual reproduction, since two regenerations will differ, but agreement with every contract that existed beforehand.

Deliberately weaker than "equivalent". A contract suite can falsify, never prove.

## Behaviour-diff review

At L4, what replaces line-by-line review of generated code: comparing the observable behaviour of a new implementation against the old across the contract suite and recorded real traffic, then reading code only where behaviour moved or risk is concentrated.

## Maturity levels

L0 Code first, L1 Captured, L2 Knowledge first, L3 Regenerable, L4 Regenerative. See the [self-assessment](/maturity).
