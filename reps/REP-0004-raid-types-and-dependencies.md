# REP-0004: Risk and issue types, and declared dependencies

| | |
|---|---|
| **REP** | 0004 |
| **Title** | Risk and issue types, and declared dependencies |
| **Status** | Active |
| **Created** | 2026-07-31 |
| **Author** | Tyson Cung |

## Acceptance

Accepted 2026-07-31 by Tyson Cung, waiving the discussion window under the no-external-contributors clause of REP-0001. Implemented together with `regen-docs` (T-027); schema version 0.3.0.

## Summary

Two new item types, `risk` (`RISK-`) and `issue` (`ISS-`), and one new relation, `depends_on`. Additive; no existing tree breaks.

## Motivation

Asking a practical question exposed the gap: can the knowledge tree generate the documents enterprises are obliged to produce, namely a requirements specification, high-level and detail design, and a RAID log? Three of the four RAID letters were unrepresentable. There was no way to record a risk, no way to record an issue, and dependencies existed only as inference from `affects` links rather than as declarations.

This is not about becoming a project-management tool. Risks, issues, and dependencies are knowledge in exactly the manifesto's sense: things that are true of the system, live in people's heads, and are lost when those people leave. A risk nobody wrote down is knowledge debt with a blast radius.

## Proposal

### `risk` (`RISK-`)

Something that might go wrong. Frontmatter adds three optional fields, kept deliberately coarse:

- `likelihood`: `low | medium | high`
- `impact`: `low | medium | high`
- `mitigation`: free text, one line; the body carries the detail

A risk links to what it threatens with the existing `affects` relation.

### `issue` (`ISS-`)

Something that **is** wrong now. Conflating risks with issues is the most common failure of real RAID logs, so they are distinct types. Adds one optional field:

- `owner`: who is dealing with it

An issue with `status: active` is open; resolving it means marking it `deprecated` or superseding it, using the lifecycle every other item already has.

### `depends_on`

An array of free-form dependency names on any item: another module, an external service, a library, a team. Deliberately not validated against the module list, because the most important dependencies are precisely the ones outside the repository.

## What is deliberately not added

No severity matrices, no probability percentages, no due dates, no status workflows beyond the existing lifecycle. Every field is a tax on everyone who writes knowledge, and a schema that models an entire PM methodology would defeat the point. Coarse and present beats precise and absent.

## Impact on existing knowledge trees

Additive only. Schema 0.3.0. Existing trees validate unchanged.
