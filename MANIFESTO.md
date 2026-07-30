# The Regen Engineering Manifesto

**Knowledge is the asset. Code is the byproduct.**

Version 0.1 (draft, 2026-07-30)

---

## 1. The inversion

Every team eventually says the same sentence about its own system: nobody knows why it does that any more.

The code is still there. It compiles, it ships, it serves traffic at three in the morning. What has been lost is the knowledge that produced it: the rule someone agreed with a customer four years ago, the constraint that forced an architecture decision, the reason a strange workaround exists in the payment path. That knowledge lived in people, and it left when they did. What remains is a fossil, evidence that a decision once happened, without the decision itself.

We accepted this as the natural order because, until very recently, code was the only durable artifact that could actually run. Documentation was a courtesy. Specifications were scaffolding you threw away once the building stood. Anything that was not code decayed, because nothing depended on it being true.

That constraint has now been removed. A sufficiently capable model can turn a sufficiently complete description of a system into a working implementation of it, repeatedly, in more than one language. The moment that became true, the economics of software inverted. Implementations became cheap, plural, and replaceable. The description became the scarce and valuable thing.

Most of our industry has not updated its habits to match. We still treat generated code as the deliverable and the prompt as garbage. We still review diffs line by line while the intent that produced them evaporates. We are, in effect, carefully preserving the output and discarding the source.

Consider what already happened one level down the stack. Nobody reviews compiler output. Nobody stores the binary and deletes the source. We review source, we trust a toolchain, and we verify the result with tests. The ladder has moved before, and it is moving again:

```
binaries  are a build artifact of  code       verified by  compiler + tests
code      is  a build artifact of  knowledge  verified by  contracts + regeneration
```

**Regen Engineering is the practice of taking that second line seriously.**

It means the knowledge of a system, its business rules, requirements, decisions, constraints, contracts, and vocabulary, is the versioned and governed source. Implementations are build artifacts: verified, provenance-stamped, and regenerable at any time, on any stack, by any capable model.

This is not a prediction about the future. Every part of it can be practised today.

---

## 2. What we value

**Knowledge as source** over code as source.

**Regeneration** over the accumulation of patches.

**Verified behaviour** over reviewed implementation.

**Stack independence** over stack loyalty.

That is, while there is value in the items on the right, we value the items on the left more.

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

If tests are generated from the same prompt as the implementation, in the same breath, they verify nothing. They only confirm the model was internally consistent with itself.

So acceptance criteria and contract tests are knowledge. They are written and reviewed as knowledge, versioned as knowledge, and they change only when a human deliberately changes them. Regenerated code must satisfy the contract suite that existed **before** it was generated.

The contracts are the fixed point. Implementations move around them.

### 3.5 Drift is a build break

The real enemy of this methodology is not a bad generation. It is the Tuesday afternoon hotfix applied straight to the code, shipped, and never reflected back into knowledge.

Do that a dozen times and the knowledge base becomes exactly what documentation has always been: confidently wrong. So drift is named, given a direction, and enforced.

**Knowledge ahead of code** is normal and healthy. It means someone has decided something and the implementation has not caught up. That is a backlog.

**Code ahead of knowledge** is a defect. Something is true of the running system that the source of truth does not know. Continuous integration detects it and blocks the merge.

Emergencies still happen, and a methodology that forbids them will be ignored during the first outage. So there is an escape hatch: ship the hotfix, label it as drift debt, and carry a mandatory reconciliation task to mine the change back into knowledge. What is not allowed is silence.

### 3.6 Every artifact carries its provenance

If code is a build artifact, it must record what built it: which version of the knowledge tree, which model, on which date, and which contracts passed.

That single small file per module turns the compiler metaphor into an operational one. "Which parts of our system were built from stale knowledge?" stops being a conversation and becomes a query. Upgrading to a better model stops being a vague ambition and becomes a plannable migration.

---

## 4. The Regeneration Test

A methodology needs one question that anyone can ask on a Monday morning and get an uncomfortable answer to.

> **The Regeneration Test:** could you delete a module's implementation today and regenerate a functionally equivalent one from the knowledge repository alone, with the pre-existing contract suite passing?

Whatever makes that impossible is your knowledge debt, and now it is itemized rather than vague.

Notice what the test does not require. It does not require the output to be identical, or even similar. Two regenerations will differ, and that is acceptable, because the standard is not textual reproduction but **behavioural equivalence under contract**. We are not asking the machine to remember the code. We are asking whether we ever wrote down enough to justify it.

Most teams, honestly applying this test to a single module, discover in an afternoon that a decade of decisions exists only in the heads of two people. That discovery is the point. It is available before any tooling is adopted.

---

## 5. Maturity

Nobody arrives at the end of this on day one. There are five useful positions.

**L0, Code first.** Knowledge lives in heads, tickets, and a wiki that everyone knows is stale. The code is the only source of truth, and it can only tell you what, never why.

**L1, Captured.** Knowledge is written down beside the code and reviewed with it: purpose, rules, decisions, glossary, contracts. Nothing is generated from it yet. This alone is worth the effort, and it needs no new tooling.

**L2, Knowledge first.** Every change begins as a knowledge delta, and knowledge review precedes implementation. AI assists with implementation, from knowledge. This is roughly where the current generation of spec-driven tools drops you, minus the lifecycle.

**L3, Regenerable.** Individual modules pass the Regeneration Test. Contracts are knowledge, provenance is recorded, and drift is detected in continuous integration.

**L4, Regenerative.** Regeneration is the normal response to change, including a change of stack or of model. Code review is largely replaced by knowledge review plus behaviour-diff review.

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

Traceability deserves a note. Regulated industries already maintain requirement-to-test traceability by law, and they do it by hand, expensively, at audit time. Here it is a side effect of working normally.

---

## 7. Brownfield: how real systems get in

Almost nobody starts from nothing. A methodology that only works on a blank repository is a hobby.

The path in runs in reverse:

**Mine.** A model reads the existing system, its code, tests, commit history, and tickets, and drafts knowledge packages: candidate rules, contracts, assumptions, and vocabulary, flagged by confidence.

**Correct.** Domain experts review the drafts. This inverts the hardest problem in documentation. Nobody writes documentation from a blank page, but everybody will correct a wrong sentence about their own domain. The corrections are the highest-value knowledge capture the organisation will ever do, because they are exactly the knowledge that existed only in heads.

**Validate by regeneration.** Regenerate one module from the corrected knowledge. Run both the old and new implementations against the same characterization and contract suite. Where behaviour matches, the knowledge was sufficient. Where it differs, you have found a real rule nobody had written down. Mine it, add it, repeat.

That last step is worth stating plainly, because it is the part that surprises people:

> **Regeneration is not only how you produce software. It is how you audit whether you understand it.**

A system you cannot regenerate is a system you do not fully understand. You may have been running it successfully for ten years, but the understanding lives in people, not in the organisation.

---

## 8. "We tried this. It was called MDA."

Anyone who was building systems twenty years ago will raise this, and they are right to. Model-Driven Architecture promised systems generated from models, consumed enormous effort, and largely failed. Three things are different now, and one thing is not.

**The transformer changed.** MDA transformations were hand-built template engines: brittle, black box, and helpless in the face of anything the metamodel had not anticipated. Worse, the models were frequently more laborious to write than the code they produced. Today the transformer is a general one, and the source is prose with light structure, which is less rigid than code, not more. A knowledge package is cheaper to write than the implementation it regenerates. That was never true of UML.

**There was no verification loop.** MDA trusted generation, and generation was not trustworthy. Regen Engineering assumes generation is fallible. That is precisely why contracts are knowledge, why regeneration must satisfy a pre-existing suite, and why provenance is recorded. The load-bearing wall is verification, not generation.

**The escape hatch stays open.** MDA died partly on round-tripping: once you edited generated code, the model was dead. Here, generated code is ordinary code in your repository, readable and editable. Editing it is not forbidden; it is *visible*, via drift detection, and there is a defined path back, via reconciliation.

And the thing that has not changed: this works best where behaviour can be contracted. That was true of MDA and it is true here. Which brings us to the limits.

---

## 9. Honest limits

A methodology that claims to work everywhere is selling something.

**Some domains resist contracts.** The feel of an interface, an animation that is subtly wrong, a performance optimisation that depends on a specific runtime, exploratory code whose purpose is to discover what you are building. If behaviour cannot be stated, it cannot be verified, and regeneration is unsafe. L3 and L4 belong first to services, APIs, data pipelines, and business logic. L1 and L2 pay for themselves everywhere, including the places above.

**Regeneration is not deterministic.** Two runs produce different code. If you need byte-identical output, this is not for you. The standard offered here is behavioural equivalence under contract, which is the same standard you already accept from a team of humans.

**It costs real money and real attention.** Tokens are not free and review time is not free. Smallest-scope regeneration is the answer, but it is an answer to a real problem, not a denial of one.

**Knowledge maintenance is work.** If a team experiences this as documentation homework, it will die exactly as documentation always dies. That is why mining and reconciliation matter: the machine drafts, humans correct. Nobody should ever face a blank page.

**The hard part was always the hard part.** Deciding what a system should do, and agreeing on it, remains difficult human work. This methodology does not remove that. It insists you write the result down, and it makes the writing pay for itself.

---

## 10. Where this sits

This idea has good company, and pretending otherwise would be dishonest.

The industry moved decisively toward specifications in 2025. [GitHub Spec Kit](https://github.com/github/spec-kit) brought structure to agent workflows through specify, plan, tasks, implement. [Amazon Kiro](https://kiro.dev/docs/specs/) built an IDE around requirements, design, and tasks. [Tessl](https://tessl.io/) made the strongest version of the argument commercially, that specs are the durable source and code is disposable. Sean Grove of OpenAI put it memorably in [The New Code](https://www.youtube.com/watch?v=8rABwKRsec4): code is a lossy projection of the specification, and most of a developer's value was never in the typing.

Those are good tools and good arguments, and this manifesto agrees with all of them. The difference is scope and lifespan.

Feature-scoped specifications answer the question "how do I build the next thing with AI." They are written, they drive an implementation, and after the merge nobody guarantees they are still true. That is not a flaw in those tools; it is what they are for.

Regen Engineering answers a different question: **how do you own a system for ten years once code is cheap.** That question forces everything the feature-scoped view can skip: the whole system rather than one feature, a lifecycle rather than a hand-off, drift detection, a debt model, provenance, a brownfield path, and independence from any single vendor, stack, or model.

It also means this is a methodology, not a product. There will be reference implementations, and there should be many. But knowledge that only compiles inside one company's platform is not the stack-independent knowledge this document is arguing for.

---

## 11. Start this week

You do not need permission, budget, or a new tool.

1. **Run the Regeneration Test on one module.** Not to regenerate it, just to answer the question. Write down what is missing. That list is your knowledge debt, and it is usually shorter and more shocking than expected.
2. **Write one knowledge package**, for the module you understand best: purpose, rules, decisions, assumptions, contracts. An afternoon.
3. **Make the next change knowledge first.** Write the delta, review the delta, then implement. Notice where the disagreement surfaces, and how much cheaper it was to find it there.
4. **Mine one legacy module** and let the experts correct the draft. Watch what comes out of people's heads when they are correcting instead of composing.

If none of that improves anything, you have lost a week and gained a written description of a system you own. That is the worst case.

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
