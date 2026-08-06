# Regen Engineering Proposals

How the methodology and its schema change.

Start with [REP-0001](REP-0001-the-rep-process.md), which defines the process and is the first use of it. To write one, copy [TEMPLATE.md](TEMPLATE.md).

## Index

| REP | Title | Status |
|---|---|---|
| [0001](REP-0001-the-rep-process.md) | The REP process | Active |
| [0002](REP-0002-require-interface-contracts.md) | Require a machine-readable interface contract for modules exposing an API | Active |
| [0003](REP-0003-the-agentic-operating-model.md) | The agentic operating model | Active |
| [0004](REP-0004-raid-types-and-dependencies.md) | Risk and issue types, and declared dependencies | Active |
| [0005](REP-0005-stateful-systems.md) | Stateful systems, schema as knowledge, and migrations | Draft |
| [0006](REP-0006-continuous-knowledge-operations.md) | Continuous knowledge operations | Draft |

## Short version

Open an issue first. If the idea survives that, write it up and send a pull request. Seven days of discussion minimum before anything is accepted.

You need a REP to change the schema in a way that could break existing knowledge trees, to add or remove item and relation types, to change what a maturity level means, or to change a normative rule in the manifesto. You do not need one for bug fixes, clarifications, examples, adapters for other ecosystems, or anything in your own repository.
