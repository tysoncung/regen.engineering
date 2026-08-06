# REP-0005: Stateful systems, schema as knowledge, and migrations

| | |
|---|---|
| **REP** | 0005 |
| **Title** | Stateful systems, schema as knowledge, and migrations |
| **Status** | Draft |
| **Created** | 2026-08-06 |
| **Author** | Tyson Cung |

## Summary

Extend the methodology to systems that own data. Schema becomes knowledge rather than a build artifact, migrations become a first-class knowledge type that is append-only, and the Regeneration Test gains a stateful form that regenerates against a populated database rather than an empty one.

## Motivation

Everything this methodology has demonstrated so far runs in memory. The reference demo, the brownfield pilot, both regeneration tests: all of them start from nothing, and all of them can be thrown away between runs. That is not an oversight of the examples, it is an unexamined assumption in the method, and it hides the first question any experienced engineer will ask:

> Fine. You regenerated my service. What happened to my database?

The manifesto's central claim is an asymmetry: implementations are cheap and replaceable, knowledge is scarce and durable. **Data breaks that asymmetry**, because data is neither. It cannot be regenerated from knowledge, it cannot be thrown away, and unlike code it usually cannot be rolled back. A method that treats code as disposable while saying nothing about the one artifact that genuinely is not disposable has a hole where its hardest problem should be.

Three concrete failures follow from leaving it unsaid.

**Silent schema divergence.** Nothing currently constrains what schema a regenerated implementation invents. Two regenerations of the same knowledge could reasonably choose `full_name` or `first_name`/`last_name`, and the second one orphans every existing row. Contracts would not catch it: they test behaviour through the interface, and a service with an empty database satisfies them perfectly.

**Migrations with no home.** A knowledge delta that changes a rule frequently implies a change to stored data. "Customers may now hold several addresses" is a rule change and a table change and a backfill. Today the rule is knowledge and the other two are nowhere.

**A test that cannot fail on the thing that matters.** The Regeneration Test starts from an empty database every time, so it proves the new implementation can create state, never that it can correctly read state the old one wrote. The most dangerous regeneration defect is invisible to it.

## Proposal

### 1. Schema is knowledge

A module that owns persistent data must carry `data.schema.yaml` in its knowledge package, in the same way REP-0002 requires `api.openapi.yaml` for a module that exposes an HTTP interface, and for the same reason: **prose does not survive regeneration, and structure does.**

It describes the logical data model, not a physical DDL dump: entities, fields with types and nullability, identity, relationships and their cardinality, and the invariants that must hold over stored rows. It is deliberately not a migration script and not vendor DDL, because the model outlives both.

The validator gains a rule mirroring REP-0002: a module whose knowledge mentions stored entities but ships no data schema is an error.

### 2. Migrations are an append-only knowledge type

Add `migration` (`MIG-`). Each records a single forward step:

- `from` and `to` schema versions
- the change, in the same declarative vocabulary as the schema
- a **backfill rule** where new non-null data is required, expressed as knowledge (what the value should be, not how to compute it)
- `reversible: true | false`, honestly. Most are not.
- `applied_at`, once it has run anywhere real

Two hard rules, and they are the whole point of making migrations a distinct type rather than ordinary knowledge:

**A migration is immutable once applied.** Every other knowledge item is editable, because knowledge should improve as understanding does. A migration describes an event that has already happened to real data. Editing it makes the recorded history disagree with the world. Correcting a migration means writing another one.

**A knowledge delta that changes stored shape must ship its migration in the same change.** This is the stateful form of "drift is a build break". A rule saying customers hold several addresses, merged without the migration that makes that possible, is a rule the running system cannot satisfy.

### 3. Regeneration is data-preserving by construction

State the rule the current tooling only implies: **regeneration replaces implementations, never data.** A regenerating agent may create schema from the data schema, and may not write, drop, or transform existing rows. Applying migrations is a separate, deliberate act.

The corollary matters for the smallest-scope principle: a module's data is part of its boundary, so regenerating a module must never touch another module's tables. ADR-100 in the reference demo already argues this for a different reason, and this makes it normative.

### 4. The stateful Regeneration Test

The existing test asks whether knowledge suffices to rebuild an implementation. The stateful form asks a harder question:

> Delete the implementation, regenerate it from knowledge alone, point it at a database **populated by the previous implementation**, and confirm the contracts still pass against that existing data.

An empty-database pass proves the new code is internally coherent. A populated-database pass proves the knowledge captured the data contract, which is the thing that actually breaks in production.

This needs a new artifact: a **fixture**, a representative dataset that is knowledge rather than test scaffolding, because what counts as representative is a domain judgment. Contracts may then assert over pre-existing rows, not only over rows they created.

### 5. Data contracts

Contracts today are interface-level, and REP-0002 requires that, because a contract reaching into an implementation cannot survive regeneration. Stored data needs assertions of a different shape: invariants that must hold over the data itself, before and after a migration.

These stay at the boundary by asserting through the interface where possible, and where genuinely not possible, against the logical schema rather than physical tables. A contract that names a physical column is as brittle as one that names an internal class.

## Impact on existing knowledge trees

**Additive for stateless modules**, which need none of this. **Breaking for modules that own data**, which must add a data schema. Schema version 0.4.0.

## Alternatives considered

**Leave data out of scope and say so.** Honest, and much cheaper. Rejected because it concedes the methodology only applies to stateless services, which is a small and shrinking fraction of the systems worth owning for a decade.

**Treat the schema as a generated artifact like code.** Rejected outright, and it is worth being explicit about why, because it is the intuitive move. Schema is where data lives. Regenerating it means regenerating the shape of something you cannot replace, and a difference of opinion between two runs becomes data loss rather than a diff.

**Adopt an existing migration tool's format** (Alembic, Flyway, Prisma). Rejected for the knowledge layer, and recommended for the execution layer. The knowledge records what changed and why, in a form that survives a change of tool; the tool applies it. Binding the knowledge to one vendor's migration format would contradict stack independence for exactly the artifact that outlives stacks longest.

## Implementation

| Issue | |
|---|---|
| [#1](https://github.com/tysoncung/regen.engineering/issues/1) | Data schema as knowledge: define the format |
| [#2](https://github.com/tysoncung/regen.engineering/issues/2) | Migrations as an append-only knowledge type |
| [#3](https://github.com/tysoncung/regen.engineering/issues/3) | The stateful Regeneration Test |
| [#4](https://github.com/tysoncung/regen.engineering/issues/4) | Purpose-built stateful reference system |

## Open questions

- Should the data schema be able to generate DDL, or only constrain it? Generating is more useful and more coupled.
- How should a fixture avoid becoming a second source of truth about behaviour? It is data, but a badly chosen fixture encodes assumptions no rule states.
- What is the correct treatment of a destructive migration, such as dropping a column, where the old implementation is no longer regenerable against post-migration data? Provisionally: regenerability is scoped to the current schema version, and older versions are historical.
- Does `reversible` earn its place, given that in practice almost nothing is reversed?
