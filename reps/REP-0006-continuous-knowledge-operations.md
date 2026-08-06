# REP-0006: Continuous knowledge operations

| | |
|---|---|
| **REP** | 0006 |
| **Title** | Continuous knowledge operations |
| **Status** | Draft |
| **Created** | 2026-08-06 |
| **Author** | Tyson Cung |

## Summary

Four standing agents that run without being asked: a **Gatherer** that notices when a change implies knowledge nobody wrote down, a **Librarian** that reads the whole tree looking for what structural tooling cannot see, a **Monitor** that watches implementations for decay, and a **Trigger** that decides when regeneration is worth its cost. Together they turn the methodology from something you perform into something that runs.

Every one of them proposes. None of them merges.

## Motivation

Read the first line of any skill in the reference implementation: *"Use to derive"*, *"Use before regenerating"*, *"Use when code changed"*. All eight begin the same way. Every mechanism in this methodology waits to be invoked by a person who already suspects something is wrong.

That is a fatal design for the problem it claims to solve. Knowledge does not decay at the moment someone thinks to check. It decays continuously, silently, and fastest when everyone is busy, which is exactly when nobody runs a knowledge audit. A drift check that only runs when you are already suspicious is a check for the one situation where it was not needed.

The evidence is in this project's own history, not in theory. A contradiction sat on the reference demo's main branch: a rule capping the address list at fifty items in a system where another rule capped holdings at twenty. Validation reported no problems, because both files were individually well formed. Contracts stayed green, because none of them asked. It was found days later, by a person reading two files side by side. Everything necessary to catch it existed; nothing was watching.

Documentation has always failed because keeping it true is work nobody is paid to do. This methodology's answer so far has been to make that work cheaper. **That is not sufficient. Cheaper work that nobody schedules is still work nobody does.** The answer has to be that it happens without being scheduled.

## Proposal

### The Gatherer: notice knowledge that was never written down

Watches merged changes, issues, and incident notes, and asks one question of each: *does this imply something true about the system that the knowledge does not contain?*

Distinct from `mine`, which is a one-shot bootstrap for a codebase with no knowledge at all. This is the steady state, and its job is the smaller, harder catch: the pull request whose description contains a business rule, the incident write-up that reveals a constraint, the code review comment where someone explains why something must be a certain way. Those are the moments when knowledge exists in a human's head and is briefly written down somewhere that is not the knowledge tree. They are also the moments it is cheapest to capture and easiest to lose.

Output: a draft knowledge delta, marked draft, with the evidence quoted and confidence stated.

### The Librarian: read the whole tree, not the diff

Everything else in the methodology looks at changes. The Librarian looks at the corpus, on a schedule, and hunts for what only a reader can see:

- **Contradictions.** Two rules that cannot both be true. The demo's fifty-versus-twenty is the worked example.
- **Orphans.** Rules nothing references, contracts verifying nothing, modules no rule mentions.
- **Staleness.** Assumptions never revisited, drafts never promoted or retired, decisions whose alternatives have since been taken anyway.
- **Duplication.** The same fact stated in two places, which is drift waiting for one copy to change.
- **Confidence that should have moved.** A mined item marked low confidence that three subsequent changes have implicitly confirmed, or a high-confidence item since contradicted.

This is deliberately the thing the manifesto says tooling cannot do: *structural tooling detects that knowledge is missing, it cannot detect that knowledge is wrong.* That claim stays true of validators. It is not true of a reader, and an agent can read a whole tree every night for a few cents.

### The Monitor: watch implementations for decay

Continuous rather than at pull-request time, and watching signals no single check owns:

- Drift, including the code-ahead case the existing check catches only at merge
- Regenerability age: modules whose last successful regeneration is receding
- Contract weakening: a rule whose contracts have shrunk, or which the vacuity check now finds hollow
- Coverage gaps opening as code grows faster than knowledge

Its output is not a verdict but a ranked list: which module is furthest from being understood.

### The Trigger: decide when regeneration is worth its cost

Regeneration costs money and attention, so *always* and *never* are both wrong. The Trigger weighs the signals and proposes, with reasoning:

- Knowledge changed and the implementation has not caught up
- A materially better or cheaper model became available, which is the case the manifesto's "regenerate when the model improves" claim has never actually exercised
- Regenerability has gone stale, so the module is only believed to be regenerable
- The Librarian corrected knowledge that this module implements

### The rule that holds it all together

**Agents propose. Humans dispose.** Every one of these four produces a pull request, an issue, or a ranked list. None merges anything, and none changes what the system does.

REP-0003 already fixed what stays human: deciding what the system should do, accepting a contract change, security review, and accepting drift debt. This REP does not move that line, and it should be read as strengthening it. The more the machinery runs unattended, the more load-bearing that boundary becomes, because a system that both proposes and disposes has quietly become the author of the software with nobody deciding that it should.

There is a second rule, learned the hard way. When the Librarian or Gatherer drafts knowledge, it must **hunt for justification it invented**. Exercising reconciliation on the demo produced a draft asserting a database-shaped cause in a system with no database, and it read as the most competent sentence in the file. Fluency is what makes it dangerous. Every causal claim traces to evidence or is written as unknown.

## Relationship to REP-0003

REP-0003 drew a line that this REP must not cross: *agents are how the loop runs, not what the methodology is*. Knowledge outlives implementations, stacks, and tools, including these agents.

That line survives, and the distinction is worth stating plainly because this proposal will look like it crosses it. **The methodology remains tool-neutral and describable without mentioning agents at all.** What this REP specifies is the reference implementation of continuous operation, in the same way the skills are the reference implementation of the change loop. Someone should be able to run this methodology with four humans doing these four jobs on a rota, badly and expensively, and get the same guarantees.

## Impact on existing knowledge trees

None. No schema change. New skills, and workflows that run them on a schedule.

## Costs, stated honestly

This turns a methodology with near-zero running cost into one with a monthly bill. A nightly Librarian pass over a large tree is not free, the Monitor's regeneration attempts are the expensive part, and every proposal costs human review attention, which is scarcer than money.

The failure mode to watch is not cost but noise: four agents filing proposals nobody reads is worse than no agents, because it trains people to ignore the channel where real findings arrive. Every one of these must earn its place by proposal acceptance rate, and any of them that runs for a month without a finding worth acting on should be turned off rather than defended.

## Open questions

- What is the right cadence for each? Nightly Librarian and weekly Monitor are guesses.
- Should the Gatherer read conversations, chat, and tickets, or only what is in the repository? Richer input, materially harder privacy and consent questions.
- Can the Librarian's findings be ranked well enough that a person reads only the top few? Without that, this fails on attention rather than accuracy.
- How does a proposal expire? An unreviewed draft that lingers for months is itself knowledge debt.
