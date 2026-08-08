---
layout: ../layouts/Page.astro
title: Evidence
description: What this methodology has actually been measured doing, including where it failed and what remains unproven.
---

# Evidence

The manifesto makes claims. This page is where they are checked, with links to
the code and the numbers rather than to a description of them.

Everything here is reproducible. Where a result comes from a system built for
the purpose rather than found in the wild, it says so, because that is weaker
evidence and pretending otherwise would be the exact failure this methodology
is about.

---

## A test suite passed a service that destroys all data

**Measured:** 18 of 18 ordinary contract scenarios pass. The same implementation
scores 1 of 9 on the stateful Regeneration Test.

The two builds differ by one line: the failing one creates its schema at startup
instead of running the migration chain, so it drops every table before serving a
request. It is otherwise flawless, enforcing every rule correctly on the
wreckage.

The ordinary suite is not weak. Every scenario was verified to fail against a
do-nothing implementation, and three that did not were strengthened until they
did. They pass because every scenario starts from an empty database, and on an
empty database, having just destroyed everything is indistinguishable from
having just started.

**What it does not prove.** The destructive build was written deliberately to
see whether the check would catch it, which is weaker than finding one in the
wild. One system, four entities, four migrations.

[The system](https://github.com/tysoncung/regen-engineering-stateful) ·
[Write-up](https://dev.to/tyson_cung/my-tests-passed-18-out-of-18-the-service-deletes-your-database-on-startup-4nhc)

---

## An unattended agent caught a defect its own operator had introduced

**Measured:** under three hours from mistake to report, with no human involved in
noticing.

A scheduled agent reads the whole knowledge corpus weekly, looking for
contradictions between items that are each individually valid. On its second run
its top-ranked finding was a risk rating whose prose said one thing and whose
structured field said another, introduced hours earlier in the commit that was
acting on the agent's *previous* findings.

Its first run, over a 38-item brownfield tree, found six things that validation,
contracts, and the debt report all missed. Four were items that had been true
when written and were falsified by later work, a category no validator can hold
an opinion about because the item does not change when the world does.

**What it does not prove.** Two runs on one tree. The failure mode to watch is
noise rather than cost, since agents filing proposals nobody reads are worse than
no agents, and measuring that takes a month of quiet weeks. It has not been
measured. The headline catch also exists because a person made the mistake it
caught, which is useful and is not the same as catching one that would have been
there anyway.

[Findings](https://github.com/tysoncung/simple-cmdb/blob/main/docs/2026-08-06-librarian-findings.md) ·
[REP-0006](https://github.com/tysoncung/regen.engineering/blob/main/reps/REP-0006-continuous-knowledge-operations.md)

---

## The same knowledge produced working implementations in two languages

**Measured:** one knowledge base, TypeScript and Python, one contract suite,
all green. An independent regeneration, given the knowledge alone and denied
sight of the other implementation, failed 14 of 17 contracts on its first
attempt and passed 17 of 17 after the knowledge was corrected.

That failure is the useful half. It located precisely what had never been
written down, which was almost entirely wire-format detail the prose assumed
everyone knew.

A far smaller and cheaper model then passed 17 of 17 first time on the corrected
knowledge, which is the clearest evidence available that the bottleneck was the
knowledge rather than the model.

[Demo](https://github.com/tysoncung/regen-engineering-demo)

---

## Contracts survive a change of language

**Measured:** all 18 scenarios of the stateful system translated directly into a
second runner, written in Python with no code shared with the JavaScript one and
no reference to it.

Nothing needed inventing that the contracts did not contain. Every piece of
friction was plumbing: an HTTP library that raises on 4xx, a missing default
timeout, a leaked child process. Two of those cost more time than translating all
eighteen scenarios combined.

**What it does not prove.** Python and JavaScript are close relatives, both with
native JSON and dynamic dictionaries. A statically typed language faces questions
neither had to answer. One data point against the contract vocabulary being
JavaScript-shaped is not proof it is neutral, and
[a third runner is an open invitation](https://github.com/tysoncung/regen.engineering/issues/8).

[Both runners](https://github.com/tysoncung/regen-engineering-stateful/tree/main/contracts)

---

## Mining a real codebase found six defects nobody had reported

**Measured:** on a brownfield application with no prior knowledge tree, deriving
knowledge from the code surfaced six real defects, including a history endpoint
that had never worked, foreign key cascades that were declared and inert, and a
schema-creation path that would have failed on any production WSGI deployment.

None was found by testing. All were found by writing down what the system does
and noticing the sentences that could not be finished.

[The pilot](https://github.com/tysoncung/simple-cmdb) ·
[Write-up](https://dev.to/tyson_cung/an-agent-documented-my-app-found-4-bugs-i-did-not-know-about-then-rebuilt-it-from-the-docs-5bl9)

---

## What is still unproven

Stated plainly, because a page called Evidence that only lists wins is marketing.

- **Scale.** The largest tree here is 38 items and one module. Nothing says what
  happens at 400.
- **Time.** The continuous agents have weeks of history, not months. Their real
  risk is noise, and noise is only visible over time.
- **Other people.** Every result on this page was produced by one person on their
  own systems. That is the weakest thing about all of it, and the reason
  [field reports](https://github.com/tysoncung/regen.engineering/issues/new?template=field-report.md),
  especially negative ones, are worth more than anything written here.

The [honest limits section of the manifesto](/#9-honest-limits) is longer than
this page and is the better read if you are trying to decide whether any of this
applies to you.
