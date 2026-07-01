# BPR&E Decision Meeting Studio — Phase 1 PRD

**Document status:** Implementation-ready

**Product:** BPR&E Decision Meeting Studio

**Phase:** Phase 1 — Retail & Restaurant Decision Meeting MVP

**Primary language of UI:** English-first, with copy centralized for future localization

**Deployment target:** Public static web demo suitable for LinkedIn Featured

**Product principle:** BPR&E does not replace a company's management philosophy. It turns the company's chosen strategic priorities, risk posture, evidence standards, and meeting habits into a clearer, executable, and reviewable decision mechanism.

---

## 1. Product Summary

BPR&E Decision Meeting Studio is a local-first, meeting-first decision workspace for high-value business decisions in chain retail and restaurant businesses.

It is not a generic Decision OS, BI dashboard, approval workflow, Constitution management tool, rule repository, or AI decision-maker. The product opportunity is narrower and more concrete: help chain retail and restaurant teams turn high-value operating meetings into structured, accountable, and reviewable decisions.

Phase 1 builds the common meeting engine required by all later retail / restaurant decision scenarios:

```text
BPR&E Core
  x Decision Operating Profile
  x Decision-Type Template
  -> Decision Meeting Workspace
```

The primary user journey is:

```text
Decision Agenda
-> Decision Project
-> Data Facts
-> Options & Trade-offs
-> Recommendation
-> Rules / Constraints Check
-> Human Decision
-> Execution Plan
-> Review & Learning
```

The application must demonstrate how an organization converts strategic priorities into measurable constraints, evaluates a real project against those constraints, presents the decision in a meeting-ready workspace, records accountable human judgement, assigns owners and KPIs, and preserves a review trail.

Phase 1 is not a dashboard project or a governance document viewer. It is a structured decision meeting workspace.

### 1.1 Phase 1 MVP boundary update

The MVP should prove that one real chain operating decision meeting can run end-to-end:

1. What decision needs to be made now?
2. What is the current recommendation?
3. What facts are known, estimated, assumed, or missing?
4. What are the real options and trade-offs?
5. Which constraints or red lines are triggered?
6. What did accountable humans decide?
7. Who owns execution and measurement?
8. What KPI, review date, and exit rule define success or failure?

Future scenario modules should reuse the same meeting engine:

- Promotion Decision
- Pricing Decision
- Menu Portfolio Decision
- New Product Pilot Decision
- Store Network Portfolio Decision

---

## 2. Problem Statement

Most organizations have strategy statements, KPI dashboards, and approval meetings. They often do not have a repeatable mechanism that connects:

- strategic trade-offs;
- customer and business-model guardrails;
- measurable decision constraints;
- project-level evidence;
- accountable owners;
- approvals, exceptions, and review rules.

As a result, teams repeatedly renegotiate strategic boundaries in each promotion, pricing, product, store, or investment decision.

Examples:

- A promotion increases traffic but damages price perception and store EBITDA.
- A new product raises sales but creates unacceptable operational complexity.
- A local team proposes an investment without a common ROI or payback threshold.
- A CEO is asked to decide without a structured view of red-line violations, trade-offs, or exit conditions.

BPR&E Decision Studio makes those boundaries visible and operational.

---

## 3. Phase 1 Objectives

### 3.1 Primary objective

Deliver a working, public-facing prototype that can create, manage, evaluate, approve, and review a high-value business decision using the BPR&E logic.

### 3.2 Specific objectives

1. Create, activate, update, supersede, and invalidate Decision Constitutions with version history.
2. Create and maintain a Constraint Library linked to Constitution rules and BPR&E pillars.
3. Create a complete Decision Card containing evidence, decision logic, trade-offs, owners, KPIs, North Star metrics, action plan, review dates, and exit rules.
4. Evaluate a Decision Card against active constraints and return a clear recommendation: **Pass**, **Revise**, or **Escalate**.
5. Preserve a decision snapshot so historical projects remain auditable after rules change.
6. Support a basic review workflow that compares expected versus actual KPIs and produces a rule-learning recommendation.
7. Provide seeded, anonymized demonstration cases suitable for public LinkedIn sharing.
8. Make the data structure extensible so later scenario Demos can be added without rebuilding the common engine.

### 3.3 Definition of success

A user should be able to complete the following end-to-end flow without developer support:

1. Open the operational Home or Decision Agenda and identify decisions requiring judgement.
2. Open a Decision Meeting Workspace containing the prepared Decision Card, evidence, options, and evaluation.
3. Review the system recommendation and the reasons for Pass / Revise / Escalate.
4. Inspect only the constraints and Constitution articles relevant to the current decision.
5. Resolve open issues and record an accountable human decision with rationale.
6. Confirm an Action Plan with owner, KPI, review date, and exit rule.
7. Record KPI results at review dates.
8. Create a request to confirm, revise, retire, or add a rule when review evidence warrants it.

---

## 4. Scope

### 4.1 In scope for Phase 1

- Local-first web application.
- Public demo mode with mock data.
- Decision Constitution management.
- Constraint Library management.
- Generic Decision Card management.
- Rule-based Constraint Evaluation Engine.
- Pass / Revise / Escalate recommendations.
- Owner, Co-owner, Approver, KPI, North Star, Review Date, and Exit Rule management.
- Action Plan generation and tracking.
- Basic Review and Learning workflow.
- JSON import/export.
- Browser print view / PDF-friendly Decision Summary.
- Static deployment to a public URL.
- Responsive desktop-first UI.

### 4.2 Explicitly out of scope for Phase 1

- Enterprise authentication, SSO, role-based permissions, and multi-user collaboration.
- Production database, data warehouse, ERP, POS, CRM, or finance-system integrations.
- Automatic data ingestion or real-time KPI calculation.
- AI-generated approval decisions.
- Automated execution of promotions, prices, store actions, or workflows.
- Formal legal or compliance approval workflows.
- Native mobile app.
- Full scenario-specific workspaces for promotion, pricing, menu, product launch, or store network decisions.

Phase 1 must create the reusable foundation for those later modules.

---

## 5. Product Principles

1. **Strategy first, data second, decision third.** Data informs a decision; it does not replace strategy or managerial accountability.
2. **Customer-centricity is a foundation.** It must appear in every Decision Card as target customer, journey moment, customer problem, and experience guardrail.
3. **BPR&E is not a department map.** Brand, Product, Restaurant/Retail, and Economic Box are decision pillars and business-model lenses.
4. **Rules must be explicit.** A strategic principle becomes operational only when it can be translated into measurable or inspectable constraints.
5. **The system recommends; accountable leaders decide.** Pass / Revise / Escalate is a recommendation, not an autonomous management action.
6. **Historical decisions must be preserved.** A project must retain the Constitution and constraint versions that applied at the time of evaluation.
7. **Rules evolve deliberately.** Changes must be versioned and linked to evidence, not overwritten casually.
8. **Phase 1 must be simple enough to demonstrate.** Avoid features that weaken the core decision flow.

---

## 5.1 Decision-Centric UX Direction

The primary product entry point is the decision agenda, not the Constitution or Constraint Library.

1. **Home is operational.** It answers what requires judgement now, which decisions are escalated, why they are escalated, the recommended action, and expected North Star / Economic Box impact.
2. **Decision Meeting Workspace is the core screen.** It presents the decision snapshot, customer and strategic context, evidence, options, recommendation, relevant rule checks, final decision, and action plan in one meeting-ready narrative.
3. **Meeting input is intentionally narrow.** Prepared evidence, assumptions, options, evaluation results, and rule references are read-only during the meeting. Meeting participants record resolutions, final judgement, rationale, accountability, review dates, and exceptions.
4. **Governance is progressively disclosed.** The full Constitution and Constraint Library remain available under Rules & Governance, but a decision workspace shows only the articles and constraints relevant to that decision.
5. **The system recommendation does not approve the project.** Pass / Revise / Escalate is a structured system assessment. The final outcome is an explicit human decision and must be auditable.
6. **Four meeting modes guide attention.** Fast Track, Revision Review, Executive Escalation, and Incomplete Decision determine the meeting emphasis without changing the underlying governance logic.

The intended product hierarchy is:

```text
Decision Constitution
→ Derived Constraints
→ Decision Card
→ Evaluation
→ Human Decision
→ Action Plan
→ Review
```

---

## 5.2 Decision Operating Profile & Configurable Governance Model

The system should not force companies to adopt one decision style. It should make each company's decision logic explicit, structured, reviewable, and improvable.

BPR&E Core defines what a sound high-value decision must consider:

- Brand and customer meaning.
- Product value, mix, quality, margin, and complexity.
- Restaurant / Retail execution capacity, channel, labor, and service impact.
- Economic Box impact, payback, cash discipline, and exit logic.

The Company Decision Operating Profile defines how this company prefers to make decisions in its current strategic stage. In Phase 1 this is a lightweight, visible context layer inherited by every Decision Project. It is not a personalization engine and must not become a hidden "CEO personality" model.

Minimum Phase 1 fields:

- Current Strategic Stage
- Primary North Star
- Decision Style
- Risk Posture
- Evidence Standard
- Economic Review Horizon
- Hard Red Lines
- Escalation Authority
- Meeting Default
- Review Cadence
- Company Language
- Version

Every Decision Project also inherits a Decision-Type Template. Phase 1 implements the Promotion Decision Template as the seeded example. Later versions should add:

- Pricing Decision
- Menu Portfolio Decision
- New Product Pilot Decision
- Store Network Portfolio Decision

The resulting operating logic is:

```text
BPR&E Core
  x Company Decision Operating Profile
  x Decision-Type Template
  -> Decision Project
  -> Decision Meeting Workspace
```

Example Phase 1 profile:

```text
Current Strategic Stage: Profit Repair Stage
Primary North Star: Store-level EBITDA
Decision Style: CEO final decision with CFO / COO challenge
Risk Posture: Balanced but economically disciplined
Evidence Standard: Base case + downside case required
Economic Review Horizon: 30-day EBITDA review with 90-day payback signal
Meeting Default: Exception-based meeting
CEO Escalation: Brand red lines and negative EBITDA exceptions
```

This makes the same Breakfast Combo Pilot produce different recommendations under different strategic stages without claiming BPR&E is a universal fixed answer.

---

## 6. Target Users and Responsibilities

| Role | Phase 1 responsibility | System interaction |
|---|---|---|
| CEO | Final strategic decision-maker; approves major exceptions and strategic changes | Review high-risk / escalated decisions; review Constitution versions |
| COO | Tests operational feasibility and protects Restaurant/Retail guardrails | Reviewer, Co-owner, or Approver |
| CFO | Tests Economic Box assumptions, ROI, Payback, and cash discipline | Reviewer, Co-owner, or Approver |
| Functional Leader | Brings project proposal, evidence, and execution resources | Decision Owner / Co-owner / Reviewer |
| Head of Data / Decision System Team | Facilitator and maintainer, not owner of the Constitution | Maintains rules, constraints, data evidence, decision logs, and review trail |
| Decision Owner | Accountable for project design and execution | Creates Decision Card; owns Action Plan and KPI updates |
| Co-owner | Shares execution accountability | Supports action completion and KPI review |

**Important Phase 1 limitation:** No actual user permissions are required. These are role fields and workflow semantics only. Authentication and permissions are later phases.

---

## 7. Core Information Architecture

### Main navigation

1. **Home**
2. **Decision Agenda**
3. **Decision Workspace**
4. **Review & Follow-up**
5. **Rules & Governance**
   - Decision Constitutions
   - Constraint Library
   - Rule Derivation
   - Version History

Home and Decision Agenda are the default operational entry points. Rules & Governance is a supporting layer rather than the primary user journey.

### Key object relationships

```text
Decision Constitution (versioned)
  └── Constitution Rules
        └── Constraints (versioned, BPR&E pillar-tagged)
              └── Decision Project / Decision Card
                    └── Evaluation Snapshot
                          └── Approval Outcome
                                └── Action Plan
                                      └── Review Record
                                            └── Rule Update Request
```

---

## 8. Functional Requirements

# 8.1 Module A — Decision Constitution Management

## Purpose

Create and maintain the top-level strategic boundary that governs major decisions during a defined strategic stage.

## Constitution lifecycle

- **Draft:** editable; not applied to decisions.
- **Active:** one active Constitution per business unit / scope; available for constraint linkage and Decision Card use.
- **Superseded:** replaced by a newer active version; preserved as historical record.
- **Invalidated:** no longer valid because of a material strategy or market change; must include reason and effective end date.
- **Archived:** retired historical reference; read-only.

## Requirements

1. Create a new Constitution.
2. Clone an existing Constitution into a new Draft version.
3. Edit a Draft Constitution.
4. Activate a Draft Constitution.
5. When a new version is activated, automatically mark the previous active version as Superseded for the same scope.
6. Invalidate an active Constitution only with a mandatory reason, effective end date, and executive owner field.
7. Never permanently delete a Constitution that has linked constraints or projects.
8. Display complete version history and change log.
9. Support one or more scopes: `Company`, `Business Unit`, `Country/Market`, `Brand`, `Pilot`. Phase 1 may use a single company scope in seed data but data model must support scope.

## Constitution form sections

### A. Document control

- Constitution ID
- Version number
- Title
- Scope
- Business Unit / Market
- Strategic stage
- Effective date
- Review date
- Status
- Executive owner
- Maintainer

### B. Strategic mandate

- Current strategic stage: Expansion / Profit Repair / Brand Upgrade / Transformation / Custom
- Primary strategic priority
- Primary North Star metric
- Supporting metrics
- Acceptable trade-offs
- Non-negotiable trade-offs / red lines
- CEO escalation thresholds

### C. Customer-centricity foundation

- Priority target customer(s)
- Priority customer journey moment(s)
- Customer problems to solve
- Customer experience non-negotiables

### D. BPR&E strategic boundaries

For each pillar:

- **Brand:** customer promise, trust, price perception, value protection.
- **Product:** strategic products, quality, innovation, complexity, margin discipline.
- **Restaurant/Retail:** execution capacity, waiting time, service, availability, labor pressure.
- **Economic Box:** EBITDA, gross profit dollars, ROI, Payback, cash flow, investment discipline.

### E. Governance and review

- Decision rights
- CEO escalation conditions
- Annual review cadence
- Trigger conditions for exceptional update

## Acceptance criteria

- A user can create and activate a Constitution.
- Existing active versions cannot be edited in place; they must be cloned to a new Draft version.
- A decision project can only reference an Active or historical version, not a deleted object.
- Version history shows effective dates, status, and change notes.

---

# 8.2 Module B — Constraint Library

## Purpose

Translate Constitution principles into measurable, inspectable, and reusable decision boundaries.

## Constraint Derivation Mechanism

### Purpose

The Constraint Library must not operate as a disconnected list of thresholds.
Every Constraint must be traceable to a specific Decision Constitution Article
and explain how a strategic principle becomes an actionable decision boundary.

### Governance chain

```text
Decision Constitution Article
→ BPR&E Control Objective
→ Constraint Blueprint
→ Atomic Constraint
→ Decision Card Evaluation
→ Pass / Revise / Escalate
→ Review and Rule Update
```

This chain is the required lineage model for creating, evaluating, reviewing,
and updating constraints.

### Step 1 — Structure Decision Constitution Articles

Each Constitution principle that can govern a decision must be represented as a
formal Article with:

| Field | Description |
|---|---|
| Constitution ID | Stable identifier of the parent Constitution |
| Article ID | Stable identifier of the governing Article |
| Strategic Stage | Stage in which the Article applies |
| Strategic Principle | Exact Constitution sentence used as the source |
| Rule Type | Non-negotiable red line, strategic guardrail, approval mandate, information mandate, or monitoring principle |
| Applicable Decision Types | Promotion, pricing, menu, new product, store network, generic, or custom |
| Relevant BPR&E Pillars | Brand, Product, Restaurant/Retail, and/or Economic Box |
| Escalation Authority | CEO, CFO, COO, or delegated functional leader |
| Status and Version | Governed Article lifecycle and version |

Example:

| Field | Value |
|---|---|
| Article ID | `BR-01` |
| Strategic Principle | “Signature products must not lose quality, value perception, or normal price credibility in exchange for short-term traffic.” |
| Rule Type | Non-Negotiable Red Line |
| Applicable Decision Types | Promotion, Pricing, Menu |
| Relevant BPR&E Pillars | Brand, Product, Restaurant/Retail, Economic Box |
| Escalation Authority | CEO |

### Step 2 — Generate Constraint Blueprints

For every applicable BPR&E pillar, the system must create a Constraint Blueprint
that interprets the Article before an atomic threshold is created.

| Field | Description |
|---|---|
| Constraint Blueprint ID | Stable identifier of the interpretation layer |
| Parent Constitution ID | Constitution version from which the blueprint is derived |
| Parent Article ID | Exact governing Article |
| BPR&E Pillar | Pillar controlled by the blueprint |
| Control Objective | What the blueprint protects or requires |
| Risk to Avoid | Failure mode the blueprint is designed to prevent |
| Metric or Data Field | Machine-readable signal used by atomic constraints |
| Threshold Source | Evidence, policy, benchmark, management tolerance, or Article language supporting the threshold |
| Rule Type | Hard Red Line / Adjustable Guardrail / Approval Threshold / Information Requirement / Monitoring Trigger |
| Evaluation Outcome | Pass, Revise, Escalate, Reject, or Incomplete Data |
| Exception Authority | Role allowed to approve an exception |

Example Brand blueprint:

| Field | Value |
|---|---|
| Control Objective | Protect signature-product price perception |
| Metric | Discount Rate |
| Threshold | `<= 20%` |
| Rule Type | Adjustable Guardrail |
| Failed Outcome | Revise |
| Exception Authority | CEO |

### Step 3 — Generate Atomic Constraints

Each executable constraint must be expressible as:

```text
IF [Scope]
THEN [Metric] [Operator] [Threshold]
ELSE [Evaluation Outcome]
```

Every Atomic Constraint requires:

- Constraint ID
- Parent Constitution ID
- Parent Article ID
- Constraint Blueprint ID
- Derivation Rationale
- BPR&E Pillar
- Decision Type
- Scope
- Metric
- Operator
- Threshold
- Unit
- Severity
- Evaluation Outcome
- Exception Owner
- Review Frequency
- Effective Date
- Version
- Status

The Derivation Rationale must explain why the selected metric and threshold are
a valid operational interpretation of the exact Constitution sentence. IDs
alone do not satisfy traceability.

### Constraint types and evaluation behavior

1. **Hard Red Line** — Failed evaluation produces `Escalate` or `Reject`.
2. **Adjustable Guardrail** — Failed evaluation produces `Revise` and resubmission.
3. **Approval Threshold** — Failed evaluation requires CEO or designated-authority approval.
4. **Information Requirement** — Missing evidence produces `Incomplete Data`; the decision cannot be evaluated.
5. **Monitoring Trigger** — The decision may pass with a mandatory review condition.

### Step 4 — Apply Constraints to Decision Cards

The Evaluation Engine must load constraints using:

- Active Constitution Version
- Applicable Article ID
- Decision Type
- BPR&E Pillar
- Project Scope
- Strategic Stage

The engine may return:

- `Pass`
- `Revise`
- `Escalate`
- `Reject`
- `Incomplete Data`

Each evaluation must create an immutable snapshot containing:

- Constitution Version
- Article ID
- Constraint Version
- Project Inputs
- Evaluation Results
- Exception Requests
- Timestamp

Later changes to the Constitution, Blueprint, or Constraint must not alter a
historical Decision Card evaluation.

## Constraint lifecycle

- **Draft:** editable and not evaluated.
- **Active:** available to the Evaluation Engine.
- **Suspended:** temporarily unavailable; remains in history.
- **Retired:** no longer used for new decisions; remains visible for historical decisions.

## Constraint types

1. **Hard Red Line** — Violation produces `Escalate` or `Stop` recommendation.
2. **Adjustable Guardrail** — Violation produces `Revise` recommendation.
3. **Approval Threshold** — Violation requires specified approver escalation.
4. **Information Requirement** — Missing required information produces `Incomplete Data`.
5. **Monitoring Trigger** — A decision may pass with a mandatory review condition.

## Required constraint fields

| Field | Description |
|---|---|
| Constraint ID | Unique ID, e.g. `BR-PR-001` |
| Version | Version number |
| Status | Draft / Active / Suspended / Retired |
| Constitution Version ID | Parent Constitution version |
| Parent Constitution Article ID | Specific strategic principle linked to the constraint |
| Constraint Blueprint ID | Governed interpretation from Article to metric |
| Derivation Rationale | Why the metric and threshold validly operationalize the exact Article sentence |
| BPR&E Pillar | Brand / Product / Restaurant-Retail / Economic Box |
| Constraint Type | Hard Red Line / Adjustable Guardrail / Approval Threshold / Information Requirement / Monitoring Trigger |
| Constraint Name | Human-readable label |
| Description / Rationale | Why the constraint exists |
| Scope | Business unit, market, decision type, product category, store format, etc. |
| Applicable Decision Types | Generic / Promotion / Pricing / Menu / New Product / Store Network / Custom |
| Metric Key | Machine-readable field key, e.g. `discount_pct` |
| Data Type | Number / Currency / Percentage / Boolean / Text / Enum / Date |
| Operator | `<=`, `<`, `>=`, `>`, `=`, `!=`, `IN`, `NOT_IN`, `REQUIRED` |
| Threshold Value | Rule threshold or accepted values |
| Unit | %, currency, minutes, months, count, boolean, etc. |
| Severity | Critical / High / Medium / Low |
| Outcome if Failed | Revise / Escalate / Advisory |
| Escalation Role | CEO / CFO / COO / Functional Leader |
| Exception Policy | Allowed / Not allowed / CEO only |
| Required Evidence | Required metrics, assumptions, attachments, or explanation |
| Effective Date | Start date |
| Review Frequency | Per project / quarterly / annual |
| Change Notes | Reason for creation or update |

## Example seed constraints

### Brand

- Promotion discount must not exceed 20%.
- Signature products cannot be used as standalone deep-discount traffic drivers.
- Any exception that affects signature-product value perception requires CEO escalation.

### Product

- Food cost must not exceed 35% for the pilot.
- Core product quality standards cannot be changed.
- New-product pilot cannot introduce more than one new ingredient without operations review.

### Restaurant / Retail

- Average wait-time increase must not exceed one minute.
- Preparation-time increase must not exceed 15 seconds.
- Kitchen capacity impact must not exceed 10% during peak periods.

### Economic Box

- Incremental EBITDA must be greater than or equal to zero in the agreed review horizon.
- Payback must not exceed three months for a standard promotion investment.
- Major campaigns require pilot validation before rollout.

## Constraint Library interface requirements

- Table view with filter by BPR&E pillar, status, decision type, scope, severity, and outcome.
- Search by Constraint ID, name, or metric key.
- Search by Constitution Article ID or exact strategic-principle text.
- Create / edit / clone / suspend / retire constraints.
- Display the exact linked Constitution sentence in the table and detail view.
- Display the complete Article → Blueprint → Atomic Constraint derivation chain.
- Select governed Constitution Articles and Constraint Blueprints when creating or editing a constraint; do not rely on free-text IDs.
- Show a clear traceability error if an Article or Blueprint cannot be resolved.
- Display linked Constitution version and linked decision projects.
- Show an impact warning before retiring or suspending a constraint with open projects.
- Export filtered constraints to JSON and CSV.

## Acceptance criteria

- A user can create at least one active constraint for each BPR&E pillar.
- Every Active constraint resolves to one Constitution Article and one Constraint Blueprint.
- The constraint detail view shows the exact source sentence, control objective, threshold source, derivation rationale, and atomic `IF / THEN / ELSE` rule.
- A constraint cannot be treated as valid when its Constitution version, Article, pillar, Blueprint, or metric relationship is inconsistent.
- An active constraint can be applied automatically to a matching Decision Card.
- Retiring a constraint does not alter previous evaluation snapshots.
- Constraint data supports numeric, boolean, enum, and required-information checks.

---

# 8.3 Module C — Decision Project and Decision Card

## Purpose

Provide one structured operating unit for a high-value business decision.

A Decision Card must show not only a proposal but also the data, insight, trade-off, constraints, ownership, economic impact, and review mechanism.

## Decision Project lifecycle

- **Draft** — project being prepared.
- **Ready for Evaluation** — required fields complete.
- **Revise Required** — one or more revisable constraints failed or evidence is incomplete.
- **Escalated** — hard red line, approval threshold, or exception request requires senior decision.
- **Approved** — approved for execution.
- **Approved with Conditions** — approved with stated conditions and review requirements.
- **In Execution** — active action plan.
- **Under Review** — awaiting or conducting KPI review.
- **Closed** — completed with review record.
- **Cancelled** — discontinued before or during execution.

## Required Decision Card sections

### A. Decision identity

- Project ID
- Project name
- Decision type
- Decision statement
- Business unit / market / store group
- Linked Constitution version
- Decision status
- Created date
- Last updated date

### B. Customer and strategy context

- Target customer(s)
- Customer journey moment
- Customer problem / friction / unmet need
- Business objective
- Primary North Star
- Supporting KPIs

### C. Decision logic

- Current situation / baseline
- Options considered, including “do nothing” where relevant
- Proposed option
- Strategic conflict
- Explicit trade-offs accepted
- Decision recommendation
- Key risks and mitigations

### D. Evidence and data panel

Each evidence item must support:

- Metric / evidence name
- Baseline value
- Forecast / expected value
- Actual value when available
- Unit
- Data source
- Updated date
- Assumption / note
- Owner / source contact

Phase 1 must support manual entry. Optional CSV import may be implemented if it does not delay core functionality.

### E. BPR&E implications

Separate structured text and selected constraints for:

- Brand implications
- Product implications
- Restaurant/Retail implications
- Economic Box implications

### F. Constraint evaluation snapshot

Auto-populated after evaluation:

- Applicable constraint list
- Project value / condition
- Pass / Fail / Missing / Not Applicable
- Rule rationale
- Required action
- Exception request status

### G. Governance and action plan

- Decision Owner
- Co-owner(s)
- Approver
- Reviewers
- Approval date
- Primary North Star
- KPI targets
- Review dates
- Exit Rule
- Action plan tasks

## Decision Card user experience requirements

- Use a multi-step form with visible progress.
- Highlight missing mandatory fields.
- Allow save as Draft at any time.
- Include a clear `Run Evaluation` action only when mandatory fields are complete.
- Display recommendation and reasons in a fixed summary panel.
- Provide a clean printable Decision Summary view.

## Acceptance criteria

- A complete Decision Card can be created and saved.
- Each card references one Constitution version.
- A user can add multiple metrics / evidence items.
- A user can define Owner, Co-owner, North Star, KPI targets, review dates, and exit rule.
- A printable summary includes the decision statement, evaluation result, risks, owners, KPIs, review schedule, and action plan.

---

# 8.4 Module D — Constraint Evaluation Engine

## Purpose

Evaluate a Decision Card against the applicable active constraints and generate a transparent recommendation.

## Core engine logic

1. User selects a linked active Constitution version when creating a Decision Card.
2. User selects decision type, scope, and applicable BPR&E pillars.
3. System retrieves active constraints matching:
   - Constitution version or rule;
   - scope;
   - decision type;
   - pillar;
   - effective date.
4. System maps required `metric_key` values from the Decision Card evidence and fields.
5. System evaluates each condition.
6. System assigns a result per constraint:
   - Pass
   - Fail
   - Missing Data
   - Not Applicable
7. System derives recommendation:
   - **Pass** — all mandatory Hard Red Lines and Approval Thresholds pass; no required information is missing; no revisable guardrail has failed.
   - **Revise** — one or more Adjustable Guardrails fail, or required information is missing, but no non-negotiable red line / executive threshold is triggered.
   - **Escalate** — a Hard Red Line fails, a CEO/CFO/COO threshold is triggered, or a user requests an exception on a protected rule.

## Priority logic

```text
IF any applicable hard-red-line fails
  OR any CEO escalation threshold is triggered
  OR any required exception has been requested
THEN recommendation = ESCALATE

ELSE IF any applicable adjustable guardrail fails
  OR any required information is missing
THEN recommendation = REVISE

ELSE IF all applicable mandatory constraints pass
THEN recommendation = PASS

ELSE recommendation = REVISE
```

## Important safeguards

- The engine must not auto-approve or auto-execute any business decision.
- A Pass means “eligible for human approval,” not “automatically approved.”
- Users must see exactly which constraints were applied, values used, and why a result occurred.
- Evaluation results must be stored as an immutable snapshot attached to the project.
- A later constraint change must not re-evaluate historical projects unless user explicitly starts a new evaluation.

## Evaluation result display

For each constraint show:

- Constraint ID
- Pillar
- Rule name
- Constraint condition
- Project value
- Result badge
- Severity
- Required action
- Exception allowed?
- Escalation owner

Show a final recommendation panel:

- Recommendation: Pass / Revise / Escalate
- Summary of blocking issues
- Risks accepted
- Required approver(s)
- Suggested next action

## Acceptance criteria

- The engine correctly evaluates at least numeric, boolean, enum, and required-data constraints.
- Test cases demonstrate Pass, Revise, and Escalate outcomes.
- All evaluation results are explainable to a non-technical user.

---

# 8.5 Module E — Approval, Action Plan, and Review

## Purpose

Convert an evaluated Decision Card into an accountable project record and a basic learning loop.

## Approval outcome

After evaluation, a user can record one of:

- Approved
- Approved with Conditions
- Revise Required
- Escalated for Executive Decision
- Rejected / Stopped
- Cancelled

The system must require a decision rationale for Approve with Conditions, Escalated, Rejected, and Cancelled outcomes.

## Action Plan generation

When Approved or Approved with Conditions, automatically create an editable Action Plan seeded from the Decision Card:

- Decision Owner
- Co-owner(s)
- Start date
- Pilot scope
- North Star
- KPI targets
- Review dates
- Exit Rule
- Required conditions
- Monitoring tasks
- Review tasks

### Suggested default task groups

1. Pre-launch preparation
2. Launch / implementation
3. KPI monitoring
4. Day 7 review
5. Day 30 review
6. Day 90 review, if configured
7. Final decision / rule-learning review

## Review and Learning

Phase 1 review is deliberately lightweight:

- Enter actual KPI values.
- Compare baseline / expected / actual.
- Add qualitative lessons.
- Record whether the decision is On Track / At Risk / Off Track.
- Select recommendation:
  - Confirm rule
  - Create rule update request
  - Retire / suspend a constraint
  - Extend pilot
  - Exit / stop

A Rule Update Request should include:

- Linked Constitution / Constraint ID
- Evidence from review
- Proposed change
- Rationale
- Required reviewer
- Status: Draft / Submitted / Accepted / Rejected

Phase 1 does not automatically change rules after review.

## Acceptance criteria

- An Approved Decision Card creates an editable Action Plan.
- Review records retain expected versus actual metric values.
- A review can create a rule update request linked to existing constraints.

---

## 9. Overview Dashboard

The dashboard is a decision-control surface, not a generic BI dashboard.

Display:

- Active Constitution and strategic stage
- Active decision projects by status
- Pass / Revise / Escalate counts
- Projects awaiting executive decision
- Projects with review dates due
- Active constraints by BPR&E pillar
- Open exceptions / escalations
- Basic North Star / KPI card summary from demo data
- Quick actions: Create Constitution, Create Constraint, Create Decision Card, Open Demo Case

Do not build complicated charts in Phase 1. Use clear cards, status counts, and a concise activity list.

---

## 10. Seeded Demonstration Data

The public demo must include realistic but anonymized mock data.

### Active Constitution: Profit Repair 2026

- Strategic stage: Profit Repair
- Primary North Star: Store-level EBITDA
- Acceptable trade-off: slower expansion in exchange for stronger unit economics
- Non-negotiable red lines:
  - Signature-product quality and value perception must not be compromised for short-term traffic.
  - Customer experience cannot be materially degraded to reduce costs.
  - Major projects must have an explicit ROI / payback logic and exit rule.
- CEO escalation: exception to signature-product pricing / quality; capex above threshold; negative incremental EBITDA beyond agreed horizon.

### Demo Case A — Signature Breakfast Promotion Pilot

Expected outcome: **Revise** or **Escalate** depending on seed settings.

Illustrative inputs:

- 50% standalone discount on signature breakfast item
- Forecast traffic increase: +20%
- Forecast average check: -12%
- Forecast wait-time increase: +2 minutes
- Incremental EBITDA: negative
- Owner: Marketing Director
- Co-owner: Operations Manager
- North Star: Store-level EBITDA

Expected explanation:

- Discount exceeds brand constraint.
- Signature product used as standalone deep-discount traffic driver.
- Wait-time threshold breached.
- Incremental EBITDA condition failed.

### Demo Case B — Lunch Bundle Pilot

Expected outcome: **Pass**.

Illustrative inputs:

- 15% perceived value through bundle, not standalone signature-product discount
- Pilot: 30 stores for 10 days
- Incremental gross profit dollars positive
- Wait-time increase within one minute
- Payback within three months
- Owner: Marketing Director
- Co-owner: Operations Manager
- North Star: Gross Profit Dollars and Store-level EBITDA

### Demo Case C — Capex Exception Request

Expected outcome: **Escalate**.

Illustrative inputs:

- Proposed equipment investment exceeds normal capex threshold
- Payback exceeds standard threshold
- Strategic justification presented
- Requires CFO and CEO executive decision

---

## 11. Data Model and Extensibility Requirements

The app must use stable IDs and configuration-driven records. Do not hard-code scenario logic directly into page components.

### Core entities

```text
Constitution
ConstitutionRule
Constraint
DecisionProject
DecisionOption
EvidenceMetric
EvaluationSnapshot
EvaluationResult
ExceptionRequest
ApprovalRecord
ActionPlan
ActionTask
ReviewRecord
RuleUpdateRequest
ScenarioDefinition
```

### Required extensibility pattern

Future decision scenarios must be added through a `ScenarioDefinition` configuration rather than a separate application.

A scenario definition should support:

- Scenario ID
- Name
- Description
- Applicable BPR&E pillars
- Required Decision Card fields
- Default North Star metrics
- Default supporting KPI fields
- Applicable constraint tags
- Default review cadence
- Recommended action-plan templates

Future scenarios include:

- Promotion Evaluation
- Pricing Decision
- Menu Portfolio Decision
- New Product Pilot
- Store Network Portfolio Decision

### Snapshot requirement

When evaluation runs, persist a JSON snapshot of:

- Constitution version
- Linked rules
- Applied constraints
- Project data values
- Evaluation results
- Recommendation
- Timestamp

Historical project cards must always display the snapshot used at the time of decision.

---

## 12. Technical Requirements

### 12.1 Recommended technology

Use a static, local-first architecture:

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- Component library permitted, but do not allow excessive visual complexity
- Local storage abstraction using IndexedDB or an equivalent repository layer
- Schema validation using Zod or equivalent
- Unit tests for rule evaluation logic
- Optional end-to-end tests for the core workflow

### 12.2 Storage and portability

- Store mock/demo data locally in the browser.
- Support workspace JSON export and import.
- Support export of one Decision Card and one Evaluation Snapshot as JSON.
- Add browser print styles so a Decision Summary can be saved as PDF.
- Keep storage access behind a small adapter layer to enable a future cloud database without rewriting UI logic.

### 12.3 Deployment

- Build as a static site.
- Include a public `/demo` route with seeded mock data.
- Deploy to GitHub Pages, Netlify, Vercel, or equivalent static hosting.
- Include deployment instructions in README.
- Ensure route refresh works in static hosting.

### 12.4 Quality requirements

- Responsive design: desktop first, usable on mobile.
- Accessibility: semantic labels, keyboard navigation for key forms, visible focus states.
- No hard dependency on a private API key.
- No collection or transmission of sensitive user data in Phase 1.
- Fast initial load suitable for public demo use.

---

## 13. Visual and Interaction Design

### Design direction

- Executive decision-system interface.
- Dark navy or deep charcoal base with restrained gold / warm accent highlights.
- Clear white text, high contrast, no decorative visual noise.
- Strong use of decision status badges: Draft, Pass, Revise, Escalate, Approved, Under Review.
- Cards and tables should feel like an operating system, not a generic analytics dashboard.
- Use BPR&E pillar labels consistently.

### Core UI patterns

- Persistent decision flow indicator:
  `Constitution → Constraints → Decision Card → Evaluation → Action → Review`
- Color must not be the only indicator of status; include text labels and icons.
- Empty states must explain what a user should create next.
- Evaluation page must surface blockers above non-blockers.
- Data and assumptions must be visually distinct.

### Public demo requirements

- A concise landing message: “A structured workflow for managing high-value business decisions.”
- Demo mode must include preloaded cases and a guided tour or explanatory callouts.
- Include a visible disclaimer: “Illustrative demo data only. The system supports human decision governance; it does not automate business decisions.”

---

## 14. Workflow States and State Transitions

```text
Draft
  → Ready for Evaluation
  → Pass Recommendation
  → Human Approval
  → In Execution
  → Under Review
  → Closed

Draft / Ready for Evaluation
  → Revise Required
  → Draft or Ready for Evaluation after changes

Draft / Ready for Evaluation
  → Escalated
  → Approved with Conditions / Revise Required / Rejected

Approved / In Execution
  → Cancelled
  → Under Review
```

Rules:

- A card cannot move to Ready for Evaluation if mandatory identity, decision, owner, North Star, KPI, review date, and exit rule fields are missing.
- A card cannot become Approved until a human approval record is entered.
- Escalated cards must capture the escalation reason and required executive approver.
- Closed cards require at least one Review Record.

---

## 15. Acceptance Test Scenarios

### Scenario 1 — Constitution versioning

- Create `Profit Repair 2026 v1.0`.
- Activate it.
- Clone it to `v1.1`.
- Modify an acceptable trade-off.
- Activate v1.1.
- Confirm v1.0 becomes Superseded and remains linked to old Decision Cards.

### Scenario 2 — Constraint management

- Create `Brand / Discount limit / <=20%`.
- Set status to Active.
- Link it to Constitution Rule `Brand Value Protection`.
- Retire it after creating a Decision Card.
- Confirm the historical Card still shows the original applied constraint snapshot.

### Scenario 3 — Revise recommendation

- Create Signature Breakfast Promotion Pilot.
- Enter `discount_pct = 50`, `wait_time_increase = 2`, `incremental_ebitda < 0`.
- Run evaluation.
- Confirm recommendation is Revise or Escalate according to configured severity.
- Confirm reasons are visible and actionable.

### Scenario 4 — Pass recommendation

- Create Lunch Bundle Pilot.
- Enter compliant discount, positive gross profit dollars, compliant wait-time, and compliant payback.
- Run evaluation.
- Confirm recommendation is Pass.
- Confirm the system still requires human approval.

### Scenario 5 — Executive escalation

- Create Capex Exception Request exceeding capex threshold.
- Run evaluation.
- Confirm recommendation is Escalate.
- Confirm CEO/CFO appears as required approver.

### Scenario 6 — Action and review

- Approve Lunch Bundle Pilot.
- Confirm Action Plan is created with Owner, Co-owner, KPI, review dates, and exit rule.
- Enter Day 7 actual KPI values.
- Create a rule update request from the review.

---

## 16. Delivery Plan

### Sprint 0 — Foundation and design system

Deliver:

- Repository setup
- Static app shell
- Navigation
- Data schemas
- Local storage adapter
- Seed-data loader
- Basic design system
- README skeleton

### Sprint 1 — Constitution and Constraint Library

Deliver:

- Constitution create / clone / activate / supersede / invalidate
- Version history
- Constraint CRUD and filters
- Rule linkage
- Seed Constitution and seed constraints

### Sprint 2 — Decision Card and Evaluation Engine

Deliver:

- Generic Decision Card builder
- Evidence / data panel
- BPR&E implications
- Applicable constraint mapping
- Rule evaluation engine
- Pass / Revise / Escalate result page
- Unit tests for evaluation logic

### Sprint 3 — Action Plan, Review, and public demo

Deliver:

- Human approval record
- Action Plan generation
- Review records
- Rule Update Request
- Dashboard
- Demo cases
- Print / PDF-friendly Decision Summary
- JSON import/export
- Deployment configuration
- Screenshots and user guide

---

## 17. Deliverables Required from Codex

1. Functional local-first web application.
2. Publicly deployable static build.
3. GitHub-ready repository with clear commit history.
4. Clean README containing setup, run, test, build, and deploy instructions.
5. `docs/architecture.md` explaining objects, evaluation flow, and extensibility design.
6. Seed JSON files for Constitution, Constraints, and Demo Cases.
7. Unit tests for the evaluation engine.
8. Screenshot set covering all core pages.
9. A short `docs/demo-script.md` for LinkedIn or stakeholder demonstrations.
10. Print-ready Decision Summary view for browser PDF export.

---

## 18. Future Phases (Not for Phase 1 Build)

### Scenario modules

- Promotion Evaluation Demo
- Pricing Decision Demo
- Menu Portfolio Decision Demo
- New Product Pilot Demo
- Store Network Portfolio Decision Demo

### Product capabilities

- Authentication and role-based access
- Shared cloud workspace and multi-user collaboration
- Data warehouse / spreadsheet / API connectors
- AI-assisted evidence summarization and scenario generation
- Advanced decision quality scoring
- Analytics on exception frequency, decision lead time, and rule effectiveness
- Scenario-specific dashboards and workflow templates

---

## 19. Final Product Statement

BPR&E Decision Studio Phase 1 must prove one core idea:

> A strategy becomes operational only when it can guide a specific decision through explicit constraints, accountable owners, measurable outcomes, and disciplined review.

The system must therefore make the following visible in one workflow:

> **Constitution sets direction. Constraints define what is allowed. Decision Cards test reality. Human leaders decide. Reviews improve the next rule.**
