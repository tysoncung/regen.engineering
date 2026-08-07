# The Regen Engineering Manifesto

**Knowledge is the asset. Code is the byproduct.**

Version 0.3 (draft, 2026-08-08)

*What changed since 0.2: data, which the previous two versions quietly assumed
away; four standing agents that run without being invoked; a correction to a
claim 0.2 made that has since turned out to be wrong; and the sharpest limit yet
found, which is that a test suite starting from an empty database cannot tell a
working implementation from one that destroys everything.*

*The section on what this cannot do remains the longest in the document, and
every entry in it was found by use rather than by review.*

---

## 1. The inversion

Every team eventually says the same sentence about its own system: nobody knows why it does that any more.

The code is still there. It compiles, it ships, it serves traffic at three in the morning. What has been lost is the knowledge that produced it: the rule someone agreed with a customer four years ago, the constraint that forced an architecture decision, the reason a strange workaround exists in the payment path. That knowledge lived in people, and it left when they did. What remains is a fossil, evidence that a decision once happened, without the decision itself.

We accepted this as the natural order because, until very recently, code was the only durable artifact that could actually run. Documentation was a courtesy. Specifications were scaffolding you threw away once the building stood. Anything that was not code decayed, because nothing depended on it being true.

That constraint has now been removed, at least in part. Today's frontier models can turn a well-specified service module, one whose behaviour is stated as rules and checkable contracts, into a working implementation of it, repeatedly, in more than one language. That is a narrower claim than "AI writes software", and it is deliberately narrow, because it is the part that can be checked. Section 4 gives you the way to check it on your own code rather than taking this paragraph's word for it.

Even that narrower version inverts the economics. Implementations became cheap, plural, and replaceable. The description became the scarce and valuable thing.

Most of our industry has not updated its habits to match. We still treat generated code as the deliverable and the prompt as garbage. We still review diffs line by line while the intent that produced them evaporates. We are, in effect, carefully preserving the output and discarding the source.

Consider what already happened one level down the stack. Almost nobody reviews compiler output, and nobody stores the binary and deletes the source. We review source, we trust a toolchain, and we verify the result with tests. The ladder has moved before, and it is moving again:

```
binaries  are a build artifact of  code       verified by  compiler + tests
code      is  a build artifact of  knowledge  verified by  contracts + regeneration
```

The analogy is imperfect and it is worth saying so immediately. A compiler is semantics-preserving and deterministic; a model is neither. That is exactly why the right-hand column matters more here than it does one rung down. The analogy sets the direction. Verification, not the analogy, carries the weight.

**Regen Engineering is the practice of taking that second line seriously.**

It means the knowledge of a system, its business rules, requirements, decisions, constraints, contracts, and vocabulary, is the versioned and governed source. Implementations are build artifacts: verified, provenance-stamped, and regenerable at any time, on any stack, by any capable model.

How much of this you can practise today depends on where you are on the ladder in section 5. Writing knowledge down and reviewing it before implementation needs nothing but a decision, and you can start this week. Regenerating whole modules against a contract suite is real but currently means assembling your own pipeline out of an agent and continuous integration, and it works best on well-contracted service code. This document tries to be clear throughout about which claims are practice and which are direction.

---

## 2. What we value

**Knowledge as source** over code as source.

**Regeneration** over the accumulation of patches.

**Verified behaviour** over reviewed implementation.

**Stack independence** over stack loyalty.

That is, while there is value in the items on the right, we value the items on the left more. The form is borrowed from the Agile Manifesto on purpose, because it remains the clearest way anyone has found to state a preference without pretending the other side is worthless.

The items on the right are not wrong. Code will still be read, patched, and reviewed, especially at the start. But when the two conflict, when it is faster to fix the code and skip the knowledge, when it is easier to stay on the stack than to prove the knowledge could leave it, we choose the left. Those small moments are exactly where systems begin to forget.

---

## 3. Principles

### 3.1 Knowledge first

A change begins by changing knowledge, not code.

The traditional loop is task, code, and then, if there is time, documentation. Documentation loses that race forever, because it is last and optional.

The Regen loop is: task, knowledge delta, knowledge review, regeneration, verification.

The important move is not the automation. It is that **review happens on the knowledge, before the implementation exists.** Arguing about a business rule as one sentence is cheaper than discovering the disagreement in a pull request of four hundred lines.

### 3.2 Knowledge is versioned, modular, and lives with the code

Knowledge belongs in the repository, in version control, reviewed through the same process as everything else. It is not a wiki, not a ticket, not a document in a drive that nobody can find.

It is modular. Every module owns a knowledge package describing its purpose, rules, decisions, assumptions, and contracts. Global knowledge (vision, glossary, cross-cutting constraints, non-functional requirements) lives at the root. Knowledge that belongs to everyone belongs to no one, so most of it should sit next to the thing it describes.

### 3.3 Regenerate at the smallest scope

Regenerating an entire system to change one rule is both expensive and reckless.

Knowledge is linked, so change is traceable: a rule declares what it affects, a module declares what it implements, a contract declares what it verifies. From those links you can compute the blast radius of a knowledge delta and regenerate only what is inside it: a function, a class, a module, a service, a bounded context.

Smallest-scope regeneration is what makes this affordable, in tokens, in review time, and in risk.

### 3.4 Contracts are knowledge, not code

This is the principle that makes the rest safe, and the one most often skipped.

If tests are generated from the same prompt as the implementation, in the same breath, they cannot verify the intent. They confirm only that the model was consistent with itself, which is not nothing, but it is not verification of what you asked for.

So acceptance criteria and contract tests are knowledge. They are written and reviewed as knowledge, versioned as knowledge, and they change only when a human deliberately changes them. Regenerated code must satisfy the contract suite that existed **before** it was generated.

The contracts are the fixed point. Implementations move around them.

Two consequences follow, and both matter more than they first appear. Contracts must be written at an interface boundary, in terms of HTTP calls, command-line behaviour, data formats, and observable effects, never in terms of internal classes or function names. A contract that reaches inside an implementation cannot survive that implementation being regenerated, let alone regenerated in a different language, and stack independence dies with it. And a contract suite can only ever falsify, never prove; section 9 is honest about what that leaves uncovered.

### 3.5 Drift is a build break

The real enemy of this methodology is not a bad generation. It is the Tuesday afternoon hotfix applied straight to the code, shipped, and never reflected back into knowledge.

Do that a dozen times and the knowledge base becomes exactly what documentation has always been: confidently wrong. So drift is named, given a direction, and enforced.

**Knowledge ahead of code** is normal and healthy. It means someone has decided something and the implementation has not caught up. That is a backlog.

**Code ahead of knowledge** is a defect. Something is true of the running system that the source of truth does not know.

Detecting that mechanically is simpler than it sounds, because it does not require comparing prose to code. The rule is structural: if a pull request changes files under a module's generated paths and contains no corresponding change to that module's knowledge, it is code-ahead drift, and continuous integration blocks the merge. No semantic understanding is needed, only the observation that the source of a build artifact did not change while the artifact did.

Emergencies still happen, and a methodology that forbids them will be ignored during the first outage. So there is an escape hatch: ship the hotfix, label it **drift debt** (code-ahead drift that has been accepted deliberately, recorded with a reason and an owner), and carry a mandatory reconciliation task to mine the change back into knowledge. Drift debt is the acute form of knowledge debt: it has a known cause and a known fix, and it should be measured in days. What is not allowed is silence.

### 3.6 Every artifact carries its provenance

If code is a build artifact, it must record what built it: which version of the knowledge tree, which model, on which date, and which contracts passed.

That single small file per module turns the compiler metaphor into an operational one. "Which parts of our system were built from stale knowledge?" stops being a conversation and becomes a query. Upgrading to a better model stops being a vague ambition and becomes a plannable migration.

---

### 3.7 The loop is maintained, not merely written

Everything above describes artifacts: knowledge in a repository, contracts beside it, code produced from both. Artifacts are the easy part. The relationship between them decays continuously, and documentation has always failed for exactly one reason, which has nothing to do with formats or discipline.

Keeping it true is work nobody is paid to do.

That is the constraint agents remove. Not the typing of implementations, which is the least interesting thing they do here, but the unglamorous maintenance that no team has ever had budget for. Three practices follow, and none of them was available before.

**Continuous regeneration.** Continuous integration proves your code still works. Regenerate a module on a schedule and you prove something else: that you still understand your system. When that fails, nothing is broken and no user is affected. What has decayed is your knowledge, and you have found out before it mattered. A module nobody has regenerated in six months is not known to be regenerable, only believed to be.

**Independent verification.** An agent must not verify work it produced, and must not see an existing implementation of the thing it is regenerating. This is not fastidiousness. The demo accompanying this document originally had both of its implementations written by the same agent in one session, which proved nothing whatsoever; it was marking its own homework. Only when an independent agent was given the knowledge alone did the exercise produce information, and it immediately failed a fifth of the contracts and exposed a rule referencing an interface that no document described.

**Autonomous reconciliation.** When drift is found, the machine drafts the knowledge change describing what the code now does, and a person reviews a proposal rather than facing a blank page. The judgment stays human. The typing does not. This is the same inversion that makes mining work on old systems: nobody writes documentation from nothing, but everybody will correct a wrong sentence about their own domain.

**Standing operation.** The three practices above are still things somebody starts. That is the wrong shape for the problem, and 0.2 did not notice it. Knowledge does not decay at the moment someone thinks to check; it decays continuously, and fastest when everyone is busy, which is exactly when nobody runs a knowledge audit. A check that only runs when you are already suspicious is a check for the one situation where it was not needed.

So four things now run without being invoked, and each answers a question no single check owned:

- A **Gatherer** notices when a merged change implied knowledge nobody wrote down. Its filter is the whole idea: changes that touched an implementation and touched no knowledge, because a change that touched both has already recorded itself.
- A **Librarian** reads the entire corpus on a schedule, looking for what only a reader can see. This is the one that overturned a claim in section 9.
- A **Monitor** watches implementations for decay, and reports which module is furthest from being understood rather than issuing a verdict.
- A **Trigger** decides whether regenerating is worth its cost, and its most useful behaviour turned out to be **refusal**. Code-ahead drift is simultaneously a decay signal and the reason regenerating would be destructive, so every dashboard pointing at an unhealthy module points at it at exactly the moment rebuilding it deletes evidence. That refusal is mechanical, because it is not a judgement call.

**Agents propose. Humans dispose.** All four produce a pull request, an issue, or a ranked list. None merges anything.

A caution, because this is where the idea is easiest to oversell. Agents are how this loop runs in 2026. They are not what the methodology is. Knowledge outlives implementations, stacks, and tools, and that emphatically includes the tools that regenerate it. A method defined by what today's agents happen to do would date the moment they change, and would forfeit the independence that is the whole point.

Automate the toil. Do not automate the judgment. Who decides what the system should do, which contracts are accepted, and what risk is tolerable stays exactly where it was.

---

## 4. The Regeneration Test

A methodology needs one question that anyone can ask on a Monday morning and get an uncomfortable answer to.

> **The Regeneration Test:** could you delete a module's implementation today and regenerate a functionally equivalent one from the knowledge repository alone, with the pre-existing contract suite passing?

Whatever makes that impossible is your knowledge debt, and now it is itemised rather than vague.

Notice what the test does not require. It does not require the output to be identical, or even similar. Two regenerations will differ, and that is acceptable, because the standard is not textual reproduction but **behavioural equivalence under contract**. We are not asking the machine to remember the code. We are asking whether we ever wrote down enough to justify it.

Two honest caveats, because the test is easy to over-read.

It is relative to a named model, not absolute. A failed regeneration might mean your knowledge was incomplete, but it might equally mean the model was not up to the task or the harness was flaky. Diagnose before booking it as knowledge debt: if a careful human engineer, handed only your knowledge package, would also have been unable to build the thing, the debt is real.

And behavioural equivalence under contract is bounded by the contracts you wrote. Passing them means nothing contradicts what you specified. It does not mean the two implementations are equivalent in every respect, which brings us to the limits in section 9.

You do not need any tooling to run this test today, and running it on one module is usually enough to find out whether a decade of decisions has been living in two people's heads.

### 4.1 Data breaks the central claim, and the test has to change with it

Everything above rests on an asymmetry: implementations are cheap and replaceable, knowledge is scarce and durable. **Data is neither**, and versions 0.1 and 0.2 of this document simply did not mention it.

That was not a gap in the examples. It was an unexamined assumption in the method, and it hid the first question an experienced engineer asks: *you regenerated my service, what happened to my database?*

Three things follow, and none of them is optional for a system that stores anything.

**The shape of stored data is knowledge.** Nothing otherwise constrains what a regenerated implementation invents. Two regenerations of the same knowledge could each reasonably choose `full_name` or `first_name`/`last_name`, and the second orphans every existing row. A module owning persistent data carries a logical data model in its knowledge package: what exists, what identifies it, what may be absent, what must be true of the rows. Not DDL, because the model outlives every physical choice made to store it.

**How the data got its shape is knowledge too.** Migrations are an append-only record, immutable once applied, because a migration describes an event that has already happened to data that exists, and editing it makes the record disagree with the world. Correcting an applied migration means writing another one.

**Regeneration replaces implementations, never data.** A regenerating agent may create schema; it may not write, drop, or transform existing rows. Applying a migration is a separate, deliberate act with a person's name on it.

And the test itself has a stateful form, which asks a harder question than the original:

> **The stateful Regeneration Test:** delete the implementation, regenerate it from knowledge alone, point it at a database **populated by the previous implementation**, and confirm the contracts still pass against rows the new code did not create.

The difference between those two questions is not academic, and section 9 records what it measured.

---

## 5. Maturity

Nobody arrives at the end of this on day one. There are five useful positions.

**L0, Code first.** Knowledge lives in heads, tickets, and a wiki that everyone knows is stale. The code is the only source of truth, and it can only tell you what, never why.

**L1, Captured.** Knowledge is written down beside the code and reviewed with it: purpose, rules, decisions, glossary, contracts. Nothing is generated from it yet. This alone is worth the effort, and it needs no new tooling.

**L2, Knowledge first.** Every change begins as a knowledge delta, and knowledge review precedes implementation. AI assists with implementation, from knowledge. This is roughly where the current generation of spec-driven tools drops you, minus the lifecycle.

**L3, Regenerable.** Individual modules pass the Regeneration Test. Contracts are knowledge, provenance is recorded, and drift is detected in continuous integration.

**L4, Regenerative.** Regeneration is the normal response to change, including a change of stack or of model. Line-by-line review of generated code gives way to knowledge review plus **behaviour-diff review**: comparing the observable behaviour of the new implementation against the old one across the contract suite and a recorded body of real traffic, and reading the code only where behaviour moved or where risk is concentrated.

Security review is not one of the things that goes away, at any level. See section 9.

L1 and L2 are reachable this quarter, by hand, with no adoption of anything. Start there. A team stuck at L1 with honest, current knowledge is in a far better position than a team at L4 with a knowledge base nobody trusts.

---

## 6. Vocabulary

**Knowledge Package.** The knowledge a module owns: purpose, rules, decisions, assumptions, contracts, and interface. Colocated with the module.

**Knowledge Delta.** The unit of change. A change to the knowledge, expressed and reviewed on its own, before implementation.

**Knowledge Debt.** Knowledge that is missing, wrong, or exists only in someone's head. Like technical debt, but upstream of it: technical debt makes change slow, knowledge debt makes change dangerous. It is measurable, see below.

**Knowledge Compiler.** The pipeline from knowledge to a deployed system: impact analysis, planning, generation, testing, verification. Today this is an agent plus continuous integration, not a product.

**Regeneration Scope.** The blast radius of a knowledge delta, computed from the links between knowledge items, and the boundary of what gets regenerated.

**Regeneration Lineage.** The provenance record for a generated artifact: knowledge version, model, date, contracts passed.

**Drift.** Divergence between knowledge and implementation. Knowledge ahead means backlog; code ahead means defect.

**Reconciliation.** Mining an unplanned code change back into knowledge, clearing drift debt.

**Knowledge Mining.** Deriving draft knowledge from an existing system: its code, tests, tickets, and history. The way brownfield systems enter the methodology.

**The Regeneration Test.** Section 4.

### Knowledge debt, measured

Four numbers, all computable from the knowledge tree and the provenance files:

- **Coverage.** What share of modules have a complete knowledge package?
- **Freshness.** What share are built from current knowledge, and how old is the oldest backlog item?
- **Integrity.** How much code-ahead drift exists? The target is zero. This is the rot metric.
- **Traceability.** What share of business rules have at least one contract verifying them and at least one module implementing them?
- **Regenerability.** What share of modules have actually passed a regeneration attempt recently, and how old is the oldest passing result?

Regenerability is the odd one out, and deliberately so. The other four can be computed from files in seconds. This one costs real money to answer, because answering it means actually regenerating something. That is exactly what makes it the honest measure: it is the only one that cannot be satisfied by tidy paperwork.

Traceability deserves a note. Regulated industries already maintain requirement-to-test traceability by law, and they do it expensively, with dedicated tooling bolted alongside the codebase. Here it falls out of the links people were already writing.

A caveat on coverage: "complete knowledge package" has to mean something structural to be countable, so define it as the required files being present and every item passing schema validation. That is a floor, not a guarantee of quality. A package can be structurally complete and still be wrong, which is what the Regeneration Test is for.

---

### 6.1 Added in 0.3

**Data schema.** The logical model a module owns, held as knowledge: what exists, what identifies it, what may be absent, what must be true of stored rows. Not DDL.

**Migration.** An append-only record of one forward step in that model, immutable once applied, carrying the backfill rule as knowledge rather than as whatever script happened to run.

**Fixture.** A representative dataset that is knowledge, not test scaffolding, because what counts as representative is a domain judgement no code can make. The guard against it becoming a second source of truth: every row must be justifiable by pointing at a numbered rule or a migration.

**Standing agent.** One that runs without being invoked, proposes, and never merges.

---

## 7. Brownfield: how real systems get in

Almost nobody starts from nothing. A methodology that only works on a blank repository is a hobby.

The path in runs in reverse:

**Mine.** A model reads the existing system, its code, tests, commit history, and tickets, and drafts knowledge packages: candidate rules, contracts, assumptions, and vocabulary, flagged by confidence.

**Correct.** Domain experts review the drafts. This inverts the hardest problem in documentation. Nobody writes documentation from a blank page, but everybody will correct a wrong sentence about their own domain. The corrections are the highest-value knowledge capture the organisation will ever do, because they are exactly the knowledge that existed only in heads.

**Validate by regeneration.** Regenerate one module from the corrected knowledge. Run both the old and new implementations against the same characterisation and contract suite. Where behaviour matches, the knowledge was sufficient. Where it differs, you have found a real rule nobody had written down. Mine it, add it, repeat.

That last step is worth stating plainly, because it is the part that surprises people:

> **Regeneration is not only how you produce software. It is how you audit whether you understand it.**

A system you cannot regenerate is a system you do not fully understand. You may have been running it successfully for ten years, but the understanding lives in people, not in the organisation.

---

## 8. "We tried this. It was called MDA."

Anyone who was building systems twenty years ago will raise this, and they are right to. Model-Driven Architecture promised systems generated from models, consumed enormous effort, and largely failed. Three things are different now, and one thing is not.

**The transformer changed.** MDA transformations were hand-built template engines: brittle, black box, and helpless in the face of anything the metamodel had not anticipated. Worse, the models were frequently more laborious to write than the code they produced. Today the transformer is a general one, and the source is prose with light structure, which is less rigid than code, not more. A knowledge package is cheaper to write than the implementation it regenerates. That was never true of UML.

**There was no independent verification loop.** This is the part worth stating carefully, because the obvious retort is that we have replaced a deterministic generator with a stochastic one and called it progress. MDA's template engines were, run for run, more predictable than any model. But MDA treated the transformation as correct by construction, so there was nothing standing outside the generator to check its output against intent; when the model and the generated system disagreed with reality, nothing caught it. Regen Engineering assumes the generator is fallible precisely because it is stochastic. That assumption is why contracts are written before generation, why they are knowledge rather than generated artifacts, and why provenance is recorded. Determinism was never what made generation safe. Independent verification is.

**The escape hatch stays open.** MDA died partly on round-tripping: once you edited generated code, the model was dead. Here, generated code is ordinary code in your repository, readable and editable. Editing it is not forbidden; it is *visible*, via drift detection, and there is a defined path back, via reconciliation.

And the thing that has not changed: this works best where behaviour can be contracted. That was true of MDA and it is true here. Which brings us to the limits.

---

## 9. Honest limits

A methodology that claims to work everywhere is selling something.

**Contracts under-specify, always.** This is the most important limit, and it applies even inside domains that contract well. A test suite can falsify but never prove. Regenerated code can pass every contract you wrote and still carry an injection flaw, a quadratic loop that only bites at scale, a leaked file handle, or different behaviour in any case you did not think to state. "Behavioural equivalence under contract" means equivalence with respect to what you specified, and nothing more. Regeneration therefore does not remove the need for the checks that catch what tests do not: static analysis and dependency scanning in the pipeline, load testing before the traffic arrives, and human eyes on anything touching money, credentials, or personal data.

**Security review does not go away.** A generated implementation is untrusted code from an unfamiliar author, and it should be treated that way. Authentication and authorisation paths, cryptography, input handling at trust boundaries, and anything with a blast radius beyond its own module still get human security review at every maturity level, including L4. The knowledge base helps here, because a reviewer who knows the intended rules can spot the gap between intent and implementation faster than one reading unfamiliar code cold. But knowledge review is an addition to security review, never a replacement for it. Supply chain is the same story: a model choosing dependencies is a model choosing your attack surface, and that choice deserves a human.

**Some domains resist contracts.** The feel of an interface, an animation that is subtly wrong, a performance optimisation that depends on a specific runtime, exploratory code whose purpose is to discover what you are building. If behaviour cannot be stated, it cannot be verified, and regeneration is unsafe. L3 and L4 belong first to services, APIs, data pipelines, and business logic. L1 and L2 pay for themselves everywhere, including the places above.

**A contract can exist without exercising the rule it claims to verify.** Traceability, as this document defines it, measures that a rule has a contract pointing at it. It cannot measure whether that contract would fail if the rule were violated. Running the loop on the reference demo produced exactly this: three of five new scenarios passed against an implementation that ignored the new rule entirely, while validation reported no problems and the debt report counted the rule as fully verified. Traceability at 100% means every rule has a witness, not that every witness is watching.

There is at least a cheap defence, and it should be automatic rather than remembered. Run the contract suite against a straw implementation that answers every request with a plausible shape and no behaviour; every scenario should fail, and any that passes is asserting nothing. The reference demo runs this in continuous integration and it caught a vacuous scenario the first time it executed. It does not make traceability mean what people assume it means, but it does stop the metric from being decorative.

**Structural tooling detects that knowledge is missing. It cannot detect that knowledge is wrong.** Between those two questions sits every interesting failure. Exercising reconciliation on the reference demo produced a proposed rule that contradicted two active rules and an interface contract; validation reported no problems, because every file was individually well formed. Worse, the agent drafting it invented plausible justification the evidence did not support, and only a deliberate hunt for that failure caught it.

*Corrected in 0.3.* The first sentence is still true and the last one no longer is. Version 0.2 ended this entry with "knowledge review is human work, and no tool here does it", and that has since turned out to be wrong in a specific way worth recording rather than quietly editing away.

The claim holds for **validators**, which check one file at a time against a schema and are structurally incapable of noticing that two individually valid files cannot both be true. It does not hold for a **reader**. An agent can read an entire knowledge corpus on a schedule for a few pence, and doing so on the brownfield pilot found six things nothing else here could see, four of which were items that had been true when written and were falsified by later work. Nothing marks such an item as changed, because the item does not change when the world does.

So knowledge review is no longer entirely human work. What remains human is the disposition: every one of those findings was a proposal, and a person decided. That boundary matters more as more of this runs unattended, because a system that both proposes and disposes has quietly become the author of the software with nobody deciding that it should.

This entry is itself the failure it describes. A claim written in good faith, correct when written, falsified by later work, and left standing in the most prominent document in the project until something read the whole thing and noticed.

**A test suite that starts from an empty database cannot see data destruction.** This is the sharpest limit found so far, and it is not a limit of this methodology alone: it applies to almost every integration suite ever written.

Measured on the stateful reference system. An implementation that drops every table at startup, and is otherwise flawless, passed **18 of 18** contract scenarios. Those scenarios are not weak: each had been verified to fail against a do-nothing service, and three were strengthened until they did. They pass because every one of them begins from an empty database, and on an empty database, having just destroyed everything is indistinguishable from having just started.

The same implementation scores **1 of 9** on the stateful Regeneration Test. The one it passes is a schema version it reports about itself.

Two things follow. Any suite whose fixtures always start clean is proving that code can *create* state and proving nothing about whether it can correctly *read* state something else wrote, which for most systems is the more dangerous half. And "create the schema at startup" is precisely the reading a regenerating agent takes from a data model that describes a finished shape, so this is not a hypothetical failure mode but the expected one.

**The standing agents are unproven over time, and their real risk is noise.** Four of them now run on a schedule and the loop demonstrably closes: on its second unattended run the corpus reader caught a defect its own operator had introduced three hours earlier, in the commit that was acting on its previous findings. That establishes it works. It does not establish it stays useful. Two runs on one 38-item tree says nothing about a 400-item one, and the failure mode to watch is not cost but noise, because four agents filing proposals nobody reads is worse than no agents at all: it trains people to ignore the channel where the real finding will arrive. Measuring that takes a month of quiet weeks and it has not been measured.

**Drift detection is weaker on a branch than it looks.** The structural rule fires when implementation files change and knowledge files do not. On a branch that changes both, it passes, and it cannot tell whether the knowledge that moved had anything to do with the code that moved. It catches the Tuesday hotfix, which is what it was built for, and it does not catch a large change whose knowledge update is cosmetic.

**Following the loop costs real time, and here is the number.** Putting one small feature through the full sequence on the reference demo took roughly eight times longer than writing the change directly, and two to three times longer on repeat once the shape was familiar. That premium buys review-before-implementation, a durable record, and a verifiable rule. It is worth it for behaviour that will outlive the person writing it, and it is not worth it for a spike you intend to throw away.

**The link graph is maintained by people, and people forget.** Impact analysis is only as good as the `affects` links in the knowledge. A missing link does not announce itself; it silently shrinks the computed regeneration scope, which is the most dangerous failure mode in this whole methodology, because it produces confident, incomplete regeneration. Treat link completeness as part of the integrity metric, and be suspicious of any knowledge item that claims to affect exactly one module.

**Regeneration is not deterministic.** Two runs produce different code. If you need byte-identical output, this is not for you. The standard offered here is behavioural equivalence under contract, which is the same standard you already accept from a team of humans.

**It costs real money and real attention.** Tokens are not free and review time is not free. Smallest-scope regeneration is the answer, but it is an answer to a real problem, not a denial of one.

**Knowledge maintenance is work.** If a team experiences this as documentation homework, it will die exactly as documentation always dies. That is why mining and reconciliation matter: the machine drafts, humans correct. Nobody should ever face a blank page.

**The hard part was always the hard part.** Deciding what a system should do, and agreeing on it, remains difficult human work. This methodology does not remove that. It insists you write the result down, and it makes the writing pay for itself.

---

## 10. Where this sits

This idea has good company, and pretending otherwise would be dishonest.

The industry moved decisively toward specifications in 2025. [GitHub Spec Kit](https://github.com/github/spec-kit) brought structure to agent workflows through specify, plan, tasks, implement. [Amazon Kiro](https://kiro.dev/docs/specs/) built an IDE around requirements, design, and tasks. [Tessl](https://tessl.io/blog/taming-agents-with-specifications-what-the-experts-say/) made the strongest commercial case that specs are the durable source and code is disposable. Sean Grove of OpenAI put it memorably in [The New Code](https://www.youtube.com/watch?v=8rABwKRsec4): code is a lossy projection of the specification, and most of a developer's value was never in the typing.

Those are good tools and good arguments, and this manifesto agrees with all of them. Two different distinctions are worth drawing, because they are not the same distinction.

**Against feature-scoped tools.** Spec Kit and Kiro answer the question "how do I build the next thing with AI." A specification is written, it drives an implementation, and after the merge nobody guarantees it is still true. That is not a flaw; it is what those tools are for. Regen Engineering answers a different question, **how do you own a system for ten years once code is cheap**, and that question forces everything the feature-scoped view can skip: the whole system rather than one feature, a lifecycle rather than a hand-off, drift detection, a debt model, provenance, and a brownfield path.

**Against loop engineering.** The newest neighbour, and the closest ally. Loop engineering is about designing the control system an agent runs inside: the trigger, the topology, the verifier, the stop rules. Its own literature keeps landing on the same conclusion, that **the verifier is the bottleneck, not the model**.

That conclusion is where these two ideas meet, because it leaves a question open. A verifier invented per task, by the same agent that will be graded against it, is not a verifier; it is an agent agreeing with itself. This document's answer is that the verifier is the contract suite, which is knowledge: versioned, reviewed by people, written before generation, and never edited to make a run terminate.

Put compactly: **loop engineering makes the agent finish. This is about deciding what finishing means, and making that answer outlive the loop.** One is designing the afternoon. The other is owning the decade. A team wants both, and neither substitutes for the other, since a perfect loop pointed at knowledge that does not exist still produces a system nobody understands in three years.

**Against platforms.** Tessl is not feature-scoped, and it would be unfair to pretend otherwise; its position on durable specs and disposable code is close to this one. The difference there is not scope but ownership. This is a methodology, not a product: an open schema, conventions anyone can implement, and no registry to depend on. There should be many reference implementations, ideally including commercial ones. But knowledge that compiles only inside one company's platform is not the stack-independent knowledge this document is arguing for, and a methodology that outlives its tools has to be specified somewhere the tools do not control.

---

## 11. Start this week

You do not need permission, budget, or a new tool.

**This week**

1. **Run the Regeneration Test on one module.** Not to regenerate it, just to answer the question. Write down what is missing. That list is your first inventory of knowledge debt. An hour, and it needs no tooling and no permission.
2. **Write one knowledge package** for the module you understand best: purpose, rules, decisions, assumptions. An afternoon. Leave the contracts as a bulleted list of acceptance criteria for now; turning those into an executable suite is a separate and larger piece of work, and pretending otherwise would be the first lie this document tells you.
3. **Make the next change knowledge first.** Write the delta, review the delta, then implement, by hand or with an agent. Notice where the disagreement surfaces, and how much cheaper it was to find it there than in a four hundred line pull request.

**The week after**

4. **Mine one legacy module** into draft knowledge and get a domain expert to correct it. Scheduling that review is most of the work, so plan it rather than squeezing it in. Watch what comes out of people's heads when they are correcting instead of composing.

If none of it improves anything, you have spent a couple of days and gained a written description of a system you own. That is the worst case.

---

## Mission

> Software should preserve knowledge, not implementations.
>
> Implementations are temporary. Knowledge endures.
>
> When an implementation becomes outdated, regenerate it.

---

*Regen Engineering is an open methodology. This document is version 0.1 and is meant to be argued with. Proposals for changes are welcome as Regen Engineering Proposals (REPs).*

*Licensed CC BY-SA 4.0.*
