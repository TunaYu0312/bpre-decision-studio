# BPR&E Decision Studio — Decision-Centric Four-Card Workspace Requirements

## 1. Product Direction

BPR&E Decision Studio must be a decision workspace, not a governance document viewer. The primary product object is the Decision Project. Decision Constitution, Constraint Blueprint, Constraint Library, and Rule Derivation remain important governance layers, but they should explain why a recommendation exists instead of dominating the default user journey.

The visible product flow for business users is:

```text
Decision Project
→ Data Facts
→ Decision
→ Execution & Review
```

The supporting governance flow is:

```text
Decision Constitution
→ Constraint Blueprint
→ Applicable Constraints
→ Decision Evaluation
→ Recommendation
```

The first flow is what meeting participants see. The second flow appears only when a participant asks why a recommendation, risk, or exception applies.

## 2. Two Product Experiences

### Meeting Experience

Audience: CEO, final decision-maker, project owner, execution owner, data owner, and meeting participants.

Purpose:

- Review the live decision quickly.
- Understand the recommendation and real options.
- Separate facts from interpretation.
- Inspect evidence sources only when challenged.
- Inspect rules only when risk, revision, escalation, or exception is relevant.
- Record a final human decision.
- Convert the decision into accountable execution and review commitments.

Design requirements:

- Meeting-room first, suitable for 16:9 display.
- Large readable text and strong visual hierarchy.
- No long vertical report page.
- No default Constitution or Constraint Library page inside the meeting flow.
- Progressive disclosure for sources, calculations, rules, and Constitution references.

### Workbench Experience

Audience: project owners, data team, decision system team, and governance maintainers.

Purpose:

- Create Decision Cards.
- Prepare evidence and assumptions.
- Configure and maintain constraints.
- Maintain Constitution versions.
- Review audit history.

The existing Constitution and Constraint pages belong to the Workbench / Rules & Governance area. They should not be removed.

## 3. Navigation Direction

Primary navigation should move from module-first to decision-first:

1. My Decision Agenda
2. Decision Portfolio
3. Review & Follow-up
4. Rules & Governance

Rules & Governance sub-navigation:

- Decision Constitutions
- Constraint Library
- Rule Derivation
- Version History
- System Settings

Phase 1 does not require authentication. If role-specific home pages are introduced, use a shared demo role switcher:

```text
View as:
CEO | Decision Owner | Data Team | Execution Owner | Meeting View
```

## 4. Core Meeting Workspace IA

The Decision Meeting Workspace must use four tabs only:

1. Decision Project
2. Data Facts
3. Decision
4. Execution & Review

Default active tab: `Decision Project`.

Do not create separate default tabs for Constitution, Constraint Library, Rules, or Evidence Dashboard. Rules and Constitution references appear contextually inside the Decision tab.

## 5. Persistent Meeting Header

The page header may show the current recommendation state:

- Ready for Approval
- Revision Required
- CEO Escalation Required
- Decision Not Ready

It should also show decision type, decision level, meeting mode, meeting date, decision owner, co-owner, decision deadline, strategic stage, and primary North Star.

## 6. Card 1 — Decision Project

Purpose: explain the business context before discussing numbers, recommendations, or rules.

This card answers:

- What are we deciding?
- Why now?
- What business problem are we solving?
- What decision is required from this meeting?
- Who is accountable?

Required content:

- Decision Project Name
- Decision ID
- Decision Type
- Decision Priority / Level
- Meeting Date
- Decision Deadline
- Background / subtitle
- Why Now
- Strategic Stage
- Business Objective
- Target Customer
- Customer Journey Moment
- Scope: stores, markets, products, channels, budget, timeline
- Decision Request: Approve / Revise / Escalate / Reject / Defer
- Decision Owner
- Co-owner
- Approver

## 7. Card 2 — Data Facts

Purpose: present factual evidence separately from options, interpretation, recommendation, and rules.

This card answers:

- What do we know?
- What are we estimating?
- What is still uncertain?

Required content:

- 5–8 compact decision-relevant metrics.
- Every metric must show a data quality label: Verified, Estimated, Assumption, or Missing.
- Each metric must have source details available through disclosure:
  - Data source
  - Reporting period
  - Data owner
  - Calculation method
  - Confidence level

Design rules:

- Use compact KPI cards and confidence labels.
- Do not show options, recommendation, or rules in this card.
- Do not turn this into a generic BI dashboard.

## 8. Card 3 — Decision

Purpose: transform facts into options, trade-offs, risk judgments, rule checks, and recommendation.

This card answers:

- What are the real options?
- What do we gain and lose under each option?
- What is the recommended option?
- Which risks are acceptable?
- Which rules are triggered?
- Does the project pass, require revision, or require escalation?

Required sections:

1. Core Strategic Conflict
2. Options Comparison
3. BPR&E Assessment
4. Recommendation
5. Rules and Exceptions

Rules and Exceptions requirements:

- Do not show the full Constraint Library.
- Show only applicable constraints.
- Failed, revise, escalation, and missing items must be prominent.
- For each relevant failed/escalated item, show:

```text
Constitution Article
→ Derived Constraint
→ Project Condition
→ Evaluation Result
→ Required Action
```

When a user clicks a failed item, show the existing source drawer with Constitution article, strategic principle, derived constraint, project condition, and required outcome.

Exception capture should include:

- Rule being overridden
- Business rationale
- Expected upside
- Risk accepted
- Exception authority
- Expiry date
- Mandatory review date

## 9. Card 4 — Execution & Review

Purpose: convert the final meeting decision into a managed execution and learning commitment.

This card answers:

- What did we finally decide?
- Who owns the decision outcome?
- Who executes it?
- Who owns measurement?
- What will be measured?
- When will we review?
- What triggers stop, adjustment, or escalation?

Required sections:

- Final Decision
- Decision Rationale
- Accepted Exceptions
- Ownership Model:
  - Decision Owner
  - Execution Owner
  - Data Owner
  - Approver
- KPI Structure:
  - Primary North Star
  - Supporting KPIs
  - Success Target
  - Guardrail Metrics
- Review Plan:
  - Day 5
  - Day 10
  - Day 30
  - Day 90
- Exit Rule
- Action Plan
- Audit Record after decision is recorded

Approval rule:

A final approval cannot be recorded unless all fields below are complete:

- Final decision
- Decision Owner
- Execution Owner
- Data Owner
- Primary North Star
- Supporting KPIs
- Review dates
- Exit Rule
- Decision rationale
- Accepted exceptions, if any

## 10. Meeting Modes

### Fast Track

Use when all critical conditions pass. Show recommendation and approval action with minimal detail. Rules remain collapsed.

### Revision Review

Use when adjustable constraints fail. Show required changes and failed rules in the Decision card. Default tab remains Decision Project.

### Executive Escalation

Use when red lines or CEO thresholds are triggered. Show exception request, Constitution article, upside, risk accepted, and CEO decision options in the Decision card.

### Incomplete

Use when required evidence, ownership, KPI, review date, or exit rule is missing. Show `Decision Not Ready for Meeting` and block approval until missing information is completed.

## 11. Phase 1 Implementation Scope

Current implementation scope:

1. Replace the existing five-tab workspace with the four-card tab structure.
2. Move evidence-only content into `Data Facts`.
3. Move options, trade-off, BPR&E assessment, recommendation, and rules into `Decision`.
4. Move final decision recording and execution commitments into `Execution & Review`.
5. Preserve existing Constitution, Constraint, evaluation, source drawer, and final decision recording logic.
6. Keep the seeded demo scenario: Breakfast Combo Pilot, 30 stores, 10 days, Profit Repair, North Star Store-level EBITDA, recommendation Revision Required.

Out of scope for this immediate implementation:

- Authentication.
- Permissions.
- Multi-role persistence.
- Full Decision Portfolio buildout.
- New backend services.

## 12. Demo Success Criteria

The demo must allow a user to see:

- The decision ask.
- Why the decision is needed now.
- The core trade-off.
- The factual evidence and confidence level.
- The recommended option.
- The failing constraints.
- The linked Constitution rules.
- The required revision.
- The final human decision.
- Decision Owner, Execution Owner, Data Owner, Approver.
- KPI, review dates, exit rule, and action plan.
