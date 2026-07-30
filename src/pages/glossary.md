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

Measured with five numbers:

- **Coverage**: modules with a structurally complete knowledge package. A floor, not a quality measure.
- **Freshness**: modules built from current knowledge.
- **Integrity**: modules with code-ahead drift. Target zero. This is the rot metric.
- **Traceability**: active rules with both a verifying contract and an implementing module.
- **Regenerability**: modules that have actually passed a regeneration attempt recently.

The first four are computed from files in seconds. Regenerability costs real money, because answering it means actually regenerating something, and that is exactly what makes it the honest one: it is the only measure that cannot be satisfied by tidy paperwork.

## Knowledge Compiler

The pipeline from knowledge to a deployed system: impact analysis, planning, generation, testing, verification. Today this is an agent plus continuous integration, not a product. The [skills](https://github.com/tysoncung/regen-engineering-skills) are one implementation of it.

## The graph, drawn

Everything below is a node or an edge in one graph. This is the reference demo's, rendered from its actual links rather than drawn by hand for illustration:

<figure class="kgraph">
  <svg viewBox="0 0 780 430" role="img" aria-labelledby="kg-title kg-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="kg-title">The knowledge graph of a small commerce system</title>
    <desc id="kg-desc">
      Four contracts verify four business rules. The rules declare which modules they affect and which
      module implements them. One rule, BR-002, affects both the customer and orders modules, which is
      what makes a change to it require regenerating both.
    </desc>

    <defs>
      <marker id="kg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" class="kg-arrowhead" />
      </marker>
      <marker id="kg-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 10 5 0 10z" class="kg-arrowhead-v" />
      </marker>
    </defs>

    <!-- column headings -->
    <text x="18" y="26" class="kg-col">CONTRACTS</text>
    <text x="266" y="26" class="kg-col">KNOWLEDGE</text>
    <text x="620" y="26" class="kg-col">MODULES</text>

    <!-- verifies: contract to rule -->
    <g class="kg-edge kg-verifies" marker-end="url(#kg-arrow-v)">
      <path d="M172 74 H262" /><path d="M172 138 H262" /><path d="M172 202 H262" /><path d="M172 266 H262" />
    </g>

    <!-- built in: rule to module (solid) -->
    <g class="kg-edge kg-built" marker-end="url(#kg-arrow)">
      <path d="M446 74 H612" />
      <path d="M446 138 C540 138 540 138 612 138" />
      <path d="M446 202 C520 202 540 150 612 146" />
      <path d="M446 266 H612" />
    </g>

    <!-- affects: the cross-module link, dashed -->
    <g class="kg-edge kg-affects" marker-end="url(#kg-arrow)">
      <path d="M446 148 C520 190 540 240 612 262" />
      <path d="M446 276 C520 300 540 190 612 154" />
      <path d="M360 320 C430 320 520 300 612 168" />
    </g>

    <!-- contracts -->
    <g class="kg-node kg-contract">
      <rect x="18" y="56" width="154" height="36" rx="18" />
      <rect x="18" y="120" width="154" height="36" rx="18" />
      <rect x="18" y="184" width="154" height="36" rx="18" />
      <rect x="18" y="248" width="154" height="36" rx="18" />
    </g>
    <g class="kg-label">
      <text x="95" y="79">CT-001</text>
      <text x="95" y="143">CT-002</text>
      <text x="95" y="207">CT-003</text>
      <text x="95" y="271">CT-010</text>
    </g>

    <!-- rules and the decision -->
    <g class="kg-node kg-rule">
      <rect x="262" y="56" width="184" height="36" rx="5" />
      <rect x="262" y="120" width="184" height="36" rx="5" />
      <rect x="262" y="184" width="184" height="36" rx="5" />
      <rect x="262" y="248" width="184" height="36" rx="5" />
    </g>
    <g class="kg-node kg-decision">
      <rect x="262" y="302" width="98" height="34" rx="5" />
    </g>
    <g class="kg-label">
      <text x="354" y="79">BR-001</text>
      <text x="354" y="143">BR-002</text>
      <text x="354" y="207">BR-003</text>
      <text x="354" y="271">BR-010</text>
      <text x="311" y="324">ADR-001</text>
    </g>
    <g class="kg-sub">
      <text x="354" y="105">email is unique</text>
      <text x="354" y="169">one default address</text>
      <text x="354" y="233">deleted cannot log in</text>
      <text x="354" y="297">order copies address</text>
    </g>

    <!-- modules -->
    <g class="kg-node kg-module">
      <rect x="612" y="120" width="150" height="48" rx="8" />
      <rect x="612" y="240" width="150" height="48" rx="8" />
    </g>
    <g class="kg-label kg-module-label">
      <text x="687" y="150">customer</text>
      <text x="687" y="270">orders</text>
    </g>

    <!-- legend -->
    <g class="kg-legend">
      <path class="kg-edge kg-verifies" d="M18 388 H58" />
      <text x="66" y="392">verifies</text>
      <path class="kg-edge kg-built" d="M170 388 H210" />
      <text x="218" y="392">implemented by</text>
      <path class="kg-edge kg-affects" d="M356 388 H396" />
      <text x="404" y="392">affects (regeneration scope)</text>
    </g>
  </svg>

  <figcaption>
    The reference demo, drawn from its own links. <strong>BR-002</strong> affects both modules, which is
    why changing it puts <code>orders</code> in the regeneration scope even though the rule lives in
    <code>customer</code>. A rule with no contract pointing at it would be visible immediately, which is
    the traceability metric made into a picture.
  </figcaption>
</figure>

## Regeneration Scope

The blast radius of a knowledge delta, computed from the links between knowledge items, and the boundary of what gets regenerated. Deterministic graph traversal, so it is computed rather than estimated.

Render your own with `regen-graph`, as Mermaid, Graphviz, or plain text:

```bash
regen-graph --format text      # no tooling required
regen-graph --focus BR-002     # just what one change touches
```

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
