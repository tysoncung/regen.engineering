# REP-0002: Require a machine-readable interface contract for modules exposing an API

| | |
|---|---|
| **REP** | 0002 |
| **Title** | Require a machine-readable interface contract for modules exposing an API |
| **Status** | Active |
| **Created** | 2026-07-31 |
| **Author** | Tyson Cung |

## Acceptance

Accepted 2026-07-31 by Tyson Cung, waiving the discussion window under the no-external-contributors clause of REP-0001. Implemented in [schema PR #1](https://github.com/tysoncung/regen-engineering-schema/pull/1) and [demo PR #5](https://github.com/tysoncung/regen-engineering-demo/pull/5), both merged with CI green. Schema version 0.2.0.

## Summary

When a module exposes an API, require its knowledge package to include a machine-readable interface contract (OpenAPI for HTTP) rather than describing the interface in prose. Prose interface tables would become a human-readable summary of that file, not the source.

## Motivation

This comes from a Regeneration Test failing on the project's own demo, not from tidiness.

An independent agent regenerated a Python implementation from the knowledge alone and scored 14 of 17 contract scenarios. **Every single failure was a wire-format question the knowledge did not answer.** The agent returned an order's `shippingAddress` as a bare string; the contract expected an object with a `line` field. Nothing in the knowledge said which, and both were defensible.

Before being scored, the same agent listed eighteen questions it had to guess at. The overwhelming majority were interface shape: response envelopes, field names, which status code an unknown resource produces, error body structure.

Worse, it found a contradiction that no validator could catch. A contract, CT-010, exercised an "edit address" capability that the module's interface documentation did not contain at all. The prose table listed POST, GET, and DELETE. The contract assumed something else existed. That gap had been present since the demo was written, and it is invisible to structural validation because both files were individually well-formed.

The pattern is clear enough to act on. **Business logic survives regeneration; interface shape does not.** The rules about email uniqueness, default-address promotion, and soft deletion all regenerated correctly, because prose expresses them well. Wire format expressed in prose is where the knowledge leaked.

## Proposal

Add to the schema:

1. A module whose `overview.md` documents an HTTP interface **must** include `api.openapi.yaml` in its knowledge package.
2. The validator errors when a module has an interface table in `overview.md` but no interface contract file.
3. The validator errors when a contract (`CT-*`) references a path or method absent from the module's interface contract. This is what would have caught the missing edit-address endpoint.
4. The prose interface table becomes explicitly a summary. Where the two disagree, the machine-readable file wins, and validation should flag the disagreement rather than silently preferring one.

Non-HTTP interfaces (CLI tools, libraries, message consumers) are out of scope for this REP. They have the same problem and deserve their own answer; pretending one format covers all of them would be worse than admitting the gap.

## Examples

Before, in `customer/knowledge/overview.md`:

```markdown
| Method | Path | Purpose |
|---|---|---|
| POST | `/customers/{id}/addresses` | Add address. Body `{line}`. 201 |
```

A regenerating agent cannot tell from this what the 201 body looks like, what an unknown customer returns, or whether the list endpoint wraps its array.

After, the same information lives in `customer/knowledge/api.openapi.yaml` with request and response schemas, status codes, and error shapes, and the prose table stays as a two-line orientation for humans.

## Impact on existing knowledge trees

**Breaking**, for any module that documents an HTTP interface in prose and has no OpenAPI file. That currently includes both modules in the reference demo.

Migration is mechanical and scriptable in the common case: generate a skeleton OpenAPI file from the existing prose table, then fill in schemas. A migration script should ship with the change.

This is a real cost and it should not be waved away. It asks adopters to write a file they may consider redundant. The argument for paying it is that the demo's failure was not a near-miss: it was three of seventeen scenarios, every one of them a wire-format guess, in a system small enough to hold in one person's head. In a real system the exposure is larger.

## Alternatives considered

**Do nothing, and write better prose.** Rejected, though not obviously wrong. The demo's prose interface tables were reasonably careful and still left eighteen open questions. Prose is a poor medium for wire format because the gaps are invisible to the author, who already knows the answers.

**Require it only at L3 and above.** Tempting, since L1 and L2 do not regenerate anything. But the contradiction found here, a contract referencing an endpoint that did not exist, is worth catching at any level, and a rule that applies sometimes is harder to teach.

**Invent a lighter interface format.** Rejected firmly. OpenAPI exists, has tooling, and the methodology's stated position is to reuse standards rather than add formats. Inventing one here would contradict the manifesto.

**Generate OpenAPI from the contracts.** Interesting, and possibly a later REP. It inverts the dependency so the contracts stay the single source. Rejected for now because contract coverage is always partial, so the generated interface would be too.

## Open questions

- Should the validator require every endpoint in the interface contract to be exercised by at least one contract scenario? That would catch dead interface surface, but it may be too strict for endpoints that exist for consumers outside the test's reach.
- What is the right answer for non-HTTP interfaces? Deliberately deferred, and it should not block this.
- Does requiring OpenAPI push teams toward HTTP designs when another interface would serve better? A real risk, worth watching rather than solving in advance.
