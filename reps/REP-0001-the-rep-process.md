# REP-0001: The REP process

| | |
|---|---|
| **REP** | 0001 |
| **Title** | The REP process |
| **Status** | Active |
| **Created** | 2026-07-30 |
| **Author** | Tyson Cung |

## Summary

Regen Engineering Proposals (REPs) are how the methodology and its schema change. This REP defines the process, and is itself the first use of it.

## Motivation

An open methodology needs a visible way for people outside the project to change it. Without one, "open" means only that the files are readable, and the thing is really one person's blog with a licence attached.

There is a second reason, more practical. The schema has adopters, and adopters have knowledge trees that must keep validating. Changes need somewhere to be argued about before they land, and a record afterwards explaining why the thing is the way it is. That record is the same argument the methodology makes about software: the decision matters more than the artifact.

## What needs a REP

**Needs one:**

- Changing the schema in a way that could break an existing knowledge tree
- Adding or removing a knowledge item type, a relation type, or a lock field
- Changing what the maturity levels mean
- Adding or redefining a term in the vocabulary
- Changing a normative rule in the manifesto, for instance what drift means or what regeneration requires

**Does not:**

- Fixing a bug in the tooling
- Clarifying wording that changes no meaning
- New examples, new adapters for other ecosystems, documentation
- Anything in your own repository

When unsure, open an issue and ask. Being told "just send a pull request" costs nothing.

## Statuses

| Status | Meaning |
|---|---|
| **Draft** | Written, under discussion, may change entirely |
| **Accepted** | Agreed and being implemented |
| **Active** | Implemented and in force |
| **Rejected** | Considered and declined, with the reasoning kept |
| **Superseded** | Replaced by a later REP, which is named |
| **Withdrawn** | Abandoned by its author |

Rejected REPs stay in the repository. A record of what was considered and declined, and why, is worth as much as the record of what was accepted; without it the same proposal returns every year.

## How to submit one

1. Open an issue first to sound out the idea. Cheaper than writing a document nobody wanted.
2. Copy [TEMPLATE.md](TEMPLATE.md) to `reps/REP-XXXX-short-title.md`, using the next free number.
3. Open a pull request. Discussion happens there.
4. A REP normally gets seven days of open discussion before acceptance, so that people who do not read GitHub daily can still object. **While the project has no external contributors, the accepting authority may waive the window**, because a waiting period that protects nobody only slows the work; each waiver is recorded in the REP it applies to. The full window becomes binding the moment there are external contributors to protect.

## Who decides

Right now, Tyson Cung decides, because the project is new and a committee of one person pretending to be a committee helps nobody.

This is a temporary and slightly embarrassing state of affairs, and it is written down rather than left implicit so that it can be pointed at and changed. When there are three or more regular contributors, the decision rule moves to rough consensus among them, and this REP is superseded to say so.

## Changing the schema without breaking people

Schema changes follow semver:

- **Patch**: wording and clarification, no behaviour change
- **Minor**: additive and backward compatible. An existing valid tree stays valid
- **Major**: anything that can invalidate an existing tree

Any major change must ship with migration notes, and where possible a script. "Update your knowledge trees by hand" is not migration notes.

The methodology has an obligation here that most projects do not. It asks people to put their most valuable asset, the knowledge of how their systems work, into a format this project defines. Breaking that format casually would be a betrayal of the argument the manifesto makes.

## Precedent

This process is modelled on Python's PEPs and Rust's RFCs, deliberately at the lighter end. Both projects are far larger, and copying their full ceremony now would be cosplay rather than governance.
