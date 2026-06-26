# Decision Workspace Tab Flow Design

## Product Decision

The Decision Meeting Workspace must behave like a live decision meeting interface, not a governance report. The default entry point is always `Decision Brief`, including Revision Review and Executive Escalation modes. Rules and Constitution references remain available, but they are secondary layers exposed through tabs, badges, drawers, and explicit user intent.

## Required Information Hierarchy

1. Recommendation and decision action
2. Why the recommendation exists
3. Options and evidence
4. Applicable rules and Constitution references only when needed
5. Final decision, action plan, and review record

## Default Interaction

- Default active tab: `Decision Brief`
- The page must show five tabs:
  - `Decision Brief`
  - `Decision Card`
  - `Evidence & Options`
  - `Rules & Exceptions`
  - `Decision & Follow-up`
- Revision Review and Executive Escalation must not auto-open the rules tab.
- Failed or escalated constraints should appear as a badge on `Rules & Exceptions` and in the sticky decision rail.
- The full Constitution and full Constraint Library must not appear in the default workspace.

## Tab Requirements

### Decision Brief

Purpose: allow a CEO or meeting participant to understand the case in under 30 seconds.

Must show:
- Decision title
- Decision request
- Current recommendation: Approve / Revise / Escalate / Reject / Incomplete
- Three key reasons
- Core strategic trade-off
- Recommended option
- Required meeting decision
- Main decision buttons

### Decision Card

Purpose: answer what exactly is being decided and how success will be measured.

Must show:
- Business objective
- Target customer
- Customer journey moment
- Project scope
- Budget / investment envelope
- Owner and co-owner
- Primary North Star
- Supporting KPIs
- Review dates
- Exit rule

### Evidence & Options

Purpose: give meeting-relevant evidence, not a generic dashboard.

Must show:
- 5–8 decision-relevant metrics
- Data quality tags: Verified / Estimated / Assumption / Missing
- Option A / B / C comparison
- Strategic trade-off summary
- Source and assumption disclosure

### Rules & Exceptions

Purpose: show only rules applicable to this project.

For every failed or escalated rule, display:
- Constitution Article
- Derived Constraint
- Project Condition
- Evaluation Result
- Required Action

Also show:
- Exception request
- Exception reason
- Exception authority
- Risk accepted

### Decision & Follow-up

Purpose: record the human decision and make the follow-through auditable.

Must show:
- Final human decision
- Decision rationale
- Accepted exceptions
- Action plan
- Owner / co-owner
- KPI / North Star
- Review schedule
- Exit rule
- Audit record

## Meeting Modes

- `Fast Track`: key conditions pass; keep rules low-emphasis and allow approval with minimal detail.
- `Revision Review`: some adjustable guardrails fail; default to Decision Brief, badge Rules & Exceptions with failed/revision items, and make “Return for Revision” the primary action.
- `Executive Escalation`: a hard red line or CEO threshold is triggered; default to Decision Brief, badge Rules & Exceptions with escalation items, and show exception memo in that tab.
- `Incomplete Decision`: required evidence, owner, KPI, review date, or exit rule is missing; default to Decision Brief and block approval actions.

## Test Requirements

- The workspace renders a five-tab interface with `Decision Brief` selected by default.
- Dense sections from the old long page are not visible on first load.
- Decision Brief displays recommendation, three reasons, trade-off, recommended option, and primary actions.
- Switching tabs reveals the correct content for Decision Card, Evidence & Options, Rules & Exceptions, and Decision & Follow-up.
- Rules & Exceptions retains constraint-to-Constitution traceability and opens the existing source drawer.
- Decision recording still requires rationale and creates the human decision record.
