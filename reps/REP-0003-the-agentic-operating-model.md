# REP-0003: The agentic operating model

| | |
|---|---|
| **REP** | 0003 |
| **Title** | The agentic operating model |
| **Status** | Active |
| **Created** | 2026-07-31 |
| **Author** | Tyson Cung |

## Acceptance

Accepted 2026-07-31 by Tyson Cung, waiving the discussion window under the no-external-contributors clause of REP-0001. The tooling half (regen-test harness, Regenerability metric) had been built ahead as permitted; acceptance unblocks continuous regeneration in CI and the reconciliation exercise.

## Summary

Promote agents from an implementation detail to a defined part of the methodology. Add three named concepts, all of which only exist because agents do: **Continuous Regeneration**, **Independent Verification**, and **Autonomous Reconciliation**. Define the roles agents play and, more importantly, the boundaries they must not cross.

## Motivation

The manifesto currently under-describes the thing that makes it possible. Counting words in v0.1.1:

| Term | Occurrences |
|---|---|
| knowledge | 91 |
| review | 18 |
| agent | 4 |
| agentic | 0 |
| autonomous | 0 |

Two of the four "agent" mentions describe other people's products. The remaining two are hedged: "assembling your own pipeline out of an agent", "by hand or with an agent".

That is a fair description of a *document practice* with AI bolted on. It is not a fair description of what this methodology actually is, and it gives away the strongest thing about it.

The deeper problem is that the manifesto describes a **static** relationship: knowledge is the source, code is the artifact, contracts verify. Artifacts sitting in a repository. But the relationship between knowledge and implementation is not static, it decays continuously, and the only reason this methodology is viable in 2026 rather than 2005 is that something can now maintain that relationship without human toil.

Documentation has always failed for one reason: keeping it true is work nobody is paid to do. Agents change the economics of that specific work. **That** is the argument, and the manifesto barely makes it.

## Proposal

### 1. Continuous Regeneration

Regeneration is currently framed as something you do when you want to change or replace an implementation. Reframe it as something that runs **on a schedule, to test whether the knowledge is still sufficient**.

Continuous integration proves your code still works. Continuous Regeneration proves **you still understand your system**. When it fails, no user is affected and nothing is broken; what has decayed is your knowledge, and you have found out before it mattered.

This becomes a metric alongside the existing four:

> **Regenerability**: the share of modules that passed a regeneration attempt within the last N days, and the age of the oldest passing result.

A module that has not been regenerated in six months is not known to be regenerable. It is only *believed* to be.

### 2. Independent Verification

Not a nicety. This project has direct evidence that the obvious approach is worthless.

The two-stack demo originally had both implementations written by the same agent in one session with the whole domain in context. That proved nothing at all; it was marking your own homework. Only when an independent agent was given the knowledge alone, with no access to the existing implementation, did the test produce information, and it immediately failed 14 of 17 and exposed a contract referencing an endpoint that no interface documented.

The rule that follows:

> An agent must not verify work it produced, and must not see an existing implementation of the thing it is regenerating. Verification requires an independent context.

The stronger form, worth adopting where the stakes justify it: several verifiers with **different lenses** (does it satisfy the contracts, is it safe, does it match the decisions in the ADRs) rather than several identical ones. Redundancy catches slips; diversity catches blind spots.

### 3. Autonomous Reconciliation

Drift detection currently blocks a merge and hands a human a chore. That is the point at which real teams abandon methodologies.

Instead, when code-ahead drift is detected, an agent **drafts the knowledge delta** describing what the code now does, and a human reviews a proposed change rather than facing a blank page. The human decision stays; the typing goes.

This is the same inversion that makes Knowledge Mining work. Nobody writes documentation from nothing, but everybody will correct a wrong sentence about their own domain.

### 4. Agent roles, and their boundaries

Name the roles so a team can reason about who does what:

| Role | Does | Must not |
|---|---|---|
| **Author** | Drafts knowledge deltas from a task | Write implementation code in the same pass |
| **Analyst** | Computes regeneration scope | Guess: scope is graph traversal, so it is a script |
| **Regenerator** | Produces implementations from knowledge | See the previous implementation, or edit a contract |
| **Verifier** | Checks output against contracts and knowledge | Verify its own work |
| **Miner** | Derives draft knowledge from existing code | Promote inference to fact without marking confidence |
| **Reconciler** | Turns drift into a proposed knowledge delta | Merge it without human review |

The boundaries matter more than the roles. Every one of them exists because the failure it prevents has already been observed.

### 5. What stays human

This REP would be dishonest without it. Automating toil is the goal; automating judgment is not.

- **Deciding what the system should do.** Agents draft, humans decide. A knowledge delta is reviewed by a person, always.
- **Accepting a contract change.** Contracts are knowledge. An agent may propose one; only a human may accept it, because a contract edited to make a build pass is the most destructive act available here.
- **Security review.** Unchanged from the manifesto's honest limits.
- **Deciding that drift debt is acceptable.** A tradeoff with a business cost, not a technical judgment.

## Impact on existing knowledge trees

**Not breaking.** No schema change. `knowledge.lock` already records `generated_by` and dates, which is most of what Regenerability needs; a `last_verified` field may follow in a separate REP once the metric has been used in anger.

The manifesto gains a section. The skills gain autonomous modes alongside their current invoked ones.

## Alternatives considered

**Leave it as is.** Rejected on the evidence above, but the instinct behind it is sound and worth preserving: the manifesto deliberately avoids sounding like a product pitch, and "agentic" is heavily debased as a word in 2026. The answer is to be concrete about mechanisms rather than to use the adjective.

**Go further and define the methodology *as* agentic.** Rejected, and this is the important one. Knowledge outlives implementations, stacks, **and tools, including agents themselves**. If the methodology is defined in terms of what agents do, it dates the moment agent architectures change, and it forfeits the vendor-neutrality that distinguishes this from platform products.

The line this REP draws: **agents are how the loop runs, not what the methodology is.** Knowledge as source is the invariant. The agentic operating model is how that invariant is maintained in 2026.

**Specify agent protocols and handoff formats.** Rejected as premature. Nobody has run these loops long enough to know what the interfaces should be, and inventing a protocol before the practice exists is how MDA got its metamodels.

## Open questions

- Does Continuous Regeneration belong in CI, or is it too slow and expensive to gate anything? Current instinct: scheduled, never blocking, and reported as a health signal like a dependency audit.
- How many independent verifiers justify their cost, and at what stakes? Unknown. Needs data from real use rather than a number invented here.
- Should Regenerability be a fifth debt metric, or a separate report? It behaves differently from the other four, since it costs real money to compute.
