# Decision Meeting Workspace Design

## 1. Objective

Redesign BPR&E Decision Studio around the real decision meeting rather than
around governance configuration.

The Decision Meeting Workspace is the primary operating screen. It must let a
CEO or meeting group understand the decision, inspect the evidence and
trade-offs, understand the system recommendation, and record an accountable
human decision without browsing the full Constitution or Constraint Library.

The first implementation uses one seeded scenario:

- Scenario: Breakfast Combo Pilot
- Decision type: Promotion
- Strategic stage: Profit Repair
- Primary North Star: Store-level EBITDA
- Meeting mode: Revision Review

## 2. Product hierarchy

The product hierarchy becomes:

```text
Decision Agenda
→ Decision Meeting Workspace
→ System Evaluation
→ Human Decision
→ Action Plan
→ Review and Learning
```

Rules support the decision:

```text
Decision Constitution
→ Derived Constraints
→ Applied to Decision Card
```

The Constitution and Constraint Library remain available under governance
navigation, but they are no longer the primary entry point.

## 3. Chosen layout

Use a meeting narrative layout with a 12-column desktop grid:

- Main discussion column: 8 columns.
- Sticky decision rail: 4 columns.
- Full-width decision header above both columns.
- Full-width final decision, action plan, and timeline below both columns.

The main column follows the order in which a meeting should reason:

1. What are we deciding?
2. Who are we serving?
3. What does the evidence show?
4. What options and trade-offs exist?
5. What is the BPR&E impact?
6. Which constraints apply?
7. Which Constitution Articles explain those constraints?
8. What did the human decision-maker decide?

This layout is preferred over a metric-heavy executive dashboard because the
page must support discussion and judgment, not only rapid scanning. It is
preferred over a step-by-step wizard because meeting participants need to
compare evidence, options, and rules without leaving the shared screen.

## 4. Meeting interaction boundary

The workspace is primarily a meeting presentation and final-decision recording
surface.

### Read-only during the meeting

- Decision statement and context
- Customer and journey context
- Evidence values and assumptions
- Options and trade-offs
- BPR&E impact assessment
- Constraint evaluation results
- Constitution references
- System recommendation

These inputs are prepared and evaluated before the meeting. A meeting
participant may open supporting details but cannot change the underlying
evaluation inputs from this screen.

### Editable during the meeting

- Final decision
- Decision rationale
- Decision-maker
- Accepted exceptions
- Decision Owner and Co-owner
- Approver
- North Star and supporting KPI commitments
- Success target
- Execution scope
- Review checkpoints
- Exit rule
- Action-plan tasks
- Meeting notes

Any change to evidence, options, or project assumptions requires returning the
project to preparation and running a new evaluation. This prevents a meeting
from silently invalidating the recommendation currently displayed.

## 5. Primary user journey

```text
Decision Agenda
→ Open active decision meeting
→ Understand decision ask and urgency
→ Review key evidence and evidence quality
→ Compare options and explicit trade-off
→ Review system recommendation and required resolution
→ Inspect only failed or disputed constraints
→ Inspect only relevant Constitution Articles
→ Record human decision and rationale
→ Confirm ownership, KPI, review dates, and exit rule
→ Generate action plan and immutable decision snapshot
→ Continue to Review & Follow-up
```

### Success conditions

- The decision ask, recommendation, and main conflict are understandable within
  30 seconds.
- A meeting can proceed without opening governance configuration pages.
- A final decision cannot be recorded until accountability fields are complete.
- The final record preserves the exact evidence, Article, Constraint, and
  evaluation versions used in the meeting.

## 6. Workspace page structure

### 6.1 Meeting command bar

Contains:

- Breadcrumb: `Decision Agenda / Active Decisions / Breakfast Combo Pilot`
- Decision type: `Promotion`
- Decision level: `L4 Strategic Decision`
- Meeting mode: `Revision Review`
- Meeting date: `14 Jun 2026`
- Actions:
  - Open Evidence Pack
  - Export Meeting Brief
  - Add Meeting Note
  - More Actions

The command bar stays compact. It establishes context but does not compete with
the recommendation.

### 6.2 Decision header

Title:

`Should we approve a 10-day breakfast combo pilot across 30 stores?`

Subtitle:

`A promotion decision designed to increase morning traffic and gross profit
dollars without weakening Store-level EBITDA, brand value, or peak-period
customer experience.`

Snapshot items:

- Decision request
- Decision Owner
- Co-owner
- Decision deadline
- Strategic stage
- Primary North Star

### 6.3 Main discussion column

#### Section 1 — What Are We Deciding?

Show:

- Decision statement
- Why now
- Business objective
- Decision type
- Requested decision

#### Section 2 — Who Are We Trying to Serve?

Show:

- Priority target customer
- Priority journey moment
- Customer problem
- Experience non-negotiables

#### Section 3 — What Does the Evidence Show?

Show six compact decision metrics:

- Expected traffic uplift
- Expected average-check impact
- Expected gross-profit dollars
- Expected incremental EBITDA
- Expected wait-time impact
- Expected repeat-rate impact

Each metric includes an evidence-quality label:

- Verified
- Estimated
- Assumption
- Missing

Show one overall completeness line and a collapsed source-and-assumption area.
This is a decision evidence summary, not a BI dashboard.

#### Section 4 — What Are the Real Options and Trade-offs?

Show the core trade-off prominently:

`Short-term morning traffic growth`

versus

`Signature-product value perception, Store-level EBITDA, and peak-period
service capacity`

Compare three options:

- Launch proposed pilot
- Revised bundle pilot
- Do not launch

Show customer value, economic impact, constraint status, and recommendation.
Make the recommended option visually clear without removing the human choice.

#### Section 5 — BPR&E Impact Assessment

Use four concise cards:

- Brand — At Risk
- Product — Acceptable
- Restaurant/Retail — Watch
- Economic Box — Failing

Status cannot rely on color alone. Each card includes a short explanation and an
icon or textual state.

#### Section 6 — Applicable Constraint Evaluation

Show only constraints loaded for this Decision Card.

Summary:

- Passed
- Requires Revision
- Requires Escalation
- Missing Evidence

Table columns:

- Pillar
- Constraint
- Project condition
- Result
- Outcome
- Required action

Default disclosure:

- Failed, escalated, and missing constraints expanded or prominent.
- Passed constraints compact.
- Full derivation details hidden.

Selecting a constraint opens a side drawer showing:

- Constraint source
- Parent Constitution Article
- Control objective
- Why the rule exists
- Threshold source
- Derivation rationale
- Exception policy
- Evaluation snapshot values

The drawer is explanatory and read-only.

#### Section 7 — Relevant Constitution References

Show only Articles linked to applied constraints:

- Brand Value Protection
- Quality and Complexity Discipline
- Service Capacity Protection
- Economic Box Discipline

Each item displays Article ID, title, and exact strategic principle. These
references explain the recommendation; they are not presented as another
approval step.

### 6.4 Sticky decision rail

The rail remains visible while the main discussion column scrolls.

#### System assessment

Show:

- Meeting mode
- Recommendation
- Plain-language reason
- Decision readiness
- Evidence completeness

For the seeded scenario:

- Meeting mode: Revision Review
- Recommendation: Revision Required
- Reason: Negative incremental EBITDA and signature-product discount risk
- Readiness: 6 of 8 mandatory conditions complete

#### Required resolution

Show an ordered list of specific changes:

1. Avoid standalone signature-product discounting.
2. Improve projected incremental EBITDA to non-negative.
3. Reduce payback to three months or below.
4. Confirm Day 5 and Day 30 review accountability.

#### Meeting actions

For Revision Review:

- Return for Revision — primary
- Approve Exception
- Escalate to CEO
- Reject Proposal

No action executes a business decision immediately. Selecting an action opens
the Final Decision section and preselects the intended outcome. The decision is
not recorded until required fields are validated and the user explicitly
confirms the record.

## 7. Meeting modes

The workspace supports four modes using the same structural layout.

### Fast Track

Conditions:

- Evidence complete
- Mandatory constraints pass
- No red line or escalation threshold

Primary message: `Ready for Approval`

Default behavior:

- Constraint and Constitution details collapsed.
- Primary action: Approve.

### Revision Review

Conditions:

- Adjustable guardrail failure
- Proposal can be redesigned
- No non-negotiable rejection condition

Primary message: `Revision Required`

Default behavior:

- Failed constraints expanded.
- Required changes displayed in the rail.
- Primary action: Return for Revision.

### Executive Escalation

Conditions:

- Constitution red line
- CEO escalation threshold
- Protected-principle exception
- Material negative Economic Box impact

Primary message: `CEO Decision Required`

Default behavior:

- Triggered Article, constraint, exception, risk, and upside expanded.
- Primary action depends on user authority: Approve Exception or Escalate.

### Incomplete Decision

Conditions:

- Missing evidence, option, owner, KPI, review date, financial assumption, or
  exit rule

Primary message: `Decision Not Ready`

Default behavior:

- Completion tasks replace decision actions.
- Final approval actions disabled.

## 8. Final decision and action plan

This section is initially collapsed and becomes active after a meeting action is
selected.

Required final-decision fields:

- Final decision
- Decision rationale
- Decision-maker
- Decision date
- Accepted exceptions
- Decision Owner
- Co-owner
- Approver
- Primary North Star
- Supporting KPIs
- Success target
- Execution scope
- Review checkpoints
- Exit rule

Validation rules:

- Decision rationale is always required.
- Owner, North Star, at least one KPI, review date, and exit rule are mandatory.
- An exception outcome requires selected Constraint IDs and authorized
  approver.
- The system must not infer or submit a final human decision.

After confirmation, create editable action tasks with:

- Action
- Owner
- Due date
- Status

## 9. Audit and review timeline

Display a compact timeline after the action plan:

- Project submitted
- Data completeness validated
- Constraint evaluation completed
- Decision meeting held
- Scheduled review checkpoints

The detailed audit record is collapsed by default.

Every recorded decision stores an immutable snapshot of:

- Decision Card version
- Constitution version
- Applied Article IDs
- Constraint versions
- Evidence values
- Evaluation results
- Final human decision
- Exception approvals
- Owner and KPI commitments
- Timestamp

## 10. Progressive disclosure

### Visible by default

- Decision ask
- Key evidence
- Recommendation
- Core trade-off
- Constraint summary
- Required resolution
- Meeting actions

### Collapsed by default

- Full evidence pack
- Assumption details
- Passed constraint details
- Constraint derivation chain
- Constitution rationale
- Version history
- Detailed audit trail

### Automatically expanded

- Hard Red Line failure
- Executive escalation
- Missing required evidence
- Revision guidance request
- User selects “Why does this rule apply?”

## 11. Navigation implications

Primary navigation becomes:

- Home
- Decision Agenda
- Decision Workspace
- Review & Follow-up
- Rules & Governance

Rules & Governance expands to:

- Decision Constitutions
- Constraint Library
- Rule Derivation
- Version History

For the first implementation:

- Home and Decision Agenda may use seeded summary data.
- Decision Workspace is fully rendered for Breakfast Combo Pilot.
- Review & Follow-up may initially link to the seeded timeline and action plan.
- Existing Constitution and Constraint routes remain unchanged under governance.

The existing horizontal workflow rail is removed from general pages. Within the
Decision Workspace, a compact decision lifecycle indicator may show:

`Prepared → Evaluated → Meeting → Action → Review`

## 12. Responsive behavior

### Desktop

- 8/4 discussion and sticky rail layout.

### Tablet

- Main content full width.
- Decision rail becomes a sticky summary bar that opens a panel.

### Mobile

- Single-column narrative.
- Recommendation and primary action remain near the top.
- Tables become stacked evaluation cards.
- Sticky rail becomes a bottom summary/action sheet.

## 13. Accessibility

- Meeting modes and evaluation results use text and icons, not color alone.
- All expandable sections use semantic buttons with `aria-expanded`.
- Sticky elements must not obscure focused controls.
- Tables retain meaningful headers; mobile cards preserve equivalent labels.
- Final-decision validation errors are associated with their fields and
summarized at the section top.
- Action targets meet a minimum 44-by-44-pixel size.
- The recommendation update and validation results use an appropriate live
  region without repeatedly interrupting screen-reader users.

## 14. Phase 1 implementation boundary

Implement one end-to-end seeded meeting workspace for Breakfast Combo Pilot:

- Load the seeded Decision Card.
- Display seeded evidence and option comparisons.
- Evaluate and display the applicable existing constraints.
- Resolve and display relevant Constitution Articles.
- Support Revision Review meeting actions.
- Validate and record a local human decision.
- Generate a local action plan.
- Preserve a local immutable meeting snapshot and timeline.

Do not implement:

- Multi-user real-time collaboration
- External data connectors
- Authentication or authority management
- Automated CEO approval
- Automatic modification of evidence during the meeting
- Automatic Constitution or Constraint updates

## 15. Acceptance criteria

- A user understands the decision request, recommendation, and primary conflict
  in under 30 seconds.
- Only relevant Constraints and Constitution Articles appear.
- The recommendation clearly distinguishes Pass, Revise, Escalate, and
  Incomplete states.
- The page identifies concrete required resolution rather than only showing
  failed rules.
- Evidence and evaluation inputs are read-only in meeting mode.
- A human decision requires rationale and accountability fields.
- The action plan contains owners, dates, KPI commitments, review checkpoints,
  and exit rule.
- A recorded decision preserves a traceable immutable snapshot.
- Existing governance pages remain available but visually subordinate.
- The workspace works as a shared meeting screen at desktop, tablet, and mobile
  breakpoints.
