# Decision Workspace Tab Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Decision Meeting Workspace into a five-tab, recommendation-first meeting flow with `Decision Brief` selected by default.

**Architecture:** Keep the existing route and repository flow. Replace the old long `DecisionSections` rendering with a focused `DecisionTabs` component while preserving the sticky `DecisionRail`, source drawer, and final decision recording service.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS modules through the existing global stylesheet.

---

## File Structure

- Modify `src/features/decisions/decision-workspace.test.tsx`: add red tests for tab behavior, progressive disclosure, rules traceability, and final decision placement.
- Create `src/features/decisions/decision-tabs.tsx`: render tab list, active tab state, and five tab panels.
- Modify `src/features/decisions/decision-workspace.tsx`: replace `DecisionSections` with `DecisionTabs`.
- Modify `src/features/decisions/decision-rail.tsx`: derive recommendation and primary action from meeting mode instead of hardcoding `REVISION REQUIRED`.
- Modify `src/styles.css`: add tab, brief, card, evidence, rules, exception, and follow-up layout styles; keep existing table and drawer styles.
- Modify `src/domain/decision-project.ts` and `src/data/seed.ts`: add a project `budget` field so the Decision Card can show an explicit budget / investment envelope.

### Task 1: Lock the tab-first behavior with failing tests

**Files:**
- Modify: `src/features/decisions/decision-workspace.test.tsx`

- [ ] **Step 1: Write failing tests**

Add tests that assert:

```tsx
expect(await screen.findByRole("tab", { name: /Decision Brief/ })).toHaveAttribute("aria-selected", "true");
expect(screen.getByRole("tab", { name: /Decision Card/ })).toBeVisible();
expect(screen.getByRole("tab", { name: /Evidence & Options/ })).toBeVisible();
expect(screen.getByRole("tab", { name: /Rules & Exceptions/ })).toBeVisible();
expect(screen.getByRole("tab", { name: /Decision & Follow-up/ })).toBeVisible();
expect(screen.queryByText("Who Are We Trying to Serve?")).not.toBeInTheDocument();
expect(screen.queryByRole("heading", { name: "Which Strategic Rules Apply?" })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm.cmd test -- --run src/features/decisions/decision-workspace.test.tsx`

Expected: fail because the workspace has no tablist and still renders the old long sections.

### Task 2: Add the tab component and default Decision Brief

**Files:**
- Create: `src/features/decisions/decision-tabs.tsx`
- Modify: `src/features/decisions/decision-workspace.tsx`

- [ ] **Step 1: Implement minimal tab state**

Create a React component with `useState("brief")`, five tab buttons with `role="tab"`, and `aria-selected`.

- [ ] **Step 2: Implement Decision Brief panel**

Render title, decision request, recommendation, three reasons, trade-off, recommended option, requested decision, and action buttons.

- [ ] **Step 3: Wire it into the workspace**

Remove the `DecisionSections` import and render `DecisionTabs` in its place.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- --run src/features/decisions/decision-workspace.test.tsx`

Expected: tab/default behavior tests pass; later tab tests may still fail until implemented.

### Task 3: Implement Decision Card and Evidence & Options

**Files:**
- Modify: `src/domain/decision-project.ts`
- Modify: `src/data/seed.ts`
- Modify: `src/features/decisions/decision-tabs.tsx`

- [ ] **Step 1: Add explicit budget field**

Add `budget: nonEmptyStringSchema` to `decisionProjectSchema` and set seed value to `Pilot investment envelope: $22K gross discount and enablement cost`.

- [ ] **Step 2: Implement Decision Card panel**

Show objective, target customer, journey moment, project scope, budget, owner/co-owner, North Star, supporting KPIs, review dates, and exit rule.

- [ ] **Step 3: Implement Evidence & Options panel**

Show the seeded evidence metrics with quality tags, option comparison, trade-off summary, and source/assumption disclosure.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- --run src/features/decisions/decision-workspace.test.tsx src/data/seed.test.ts`

Expected: tests pass.

### Task 4: Implement Rules & Exceptions and Decision & Follow-up

**Files:**
- Modify: `src/features/decisions/decision-tabs.tsx`
- Modify: `src/features/decisions/decision-workspace.tsx`

- [ ] **Step 1: Implement Rules & Exceptions panel**

Render only applicable constraints. For failed or escalated rows, show Constitution Article → Derived Constraint → Project Condition → Evaluation Result → Required Action. Keep source drawer opening through `onConstraintSelect`.

- [ ] **Step 2: Implement exception memo**

Show exception request, exception reason, exception authority, and risk accepted for failed/escalated rules.

- [ ] **Step 3: Implement Decision & Follow-up panel**

Move final decision entry and record summary into the fifth tab so action recording happens in the meeting flow.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd test -- --run src/features/decisions/decision-workspace.test.tsx`

Expected: tests pass.

### Task 5: Update sticky rail and visual layout

**Files:**
- Modify: `src/features/decisions/decision-rail.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Derive rail recommendation**

Map `Pass` to `APPROVE`, `Revise` to `REVISION REQUIRED`, `Escalate` to `EXECUTIVE ESCALATION`, and `Incomplete` to `INCOMPLETE`.

- [ ] **Step 2: Derive primary action**

For `Revision Review`, make `Return for Revision` primary. For `Executive Escalation`, make `Approve Exception` or `Escalate to CEO` prominent. For `Incomplete Decision`, disable approval-like actions.

- [ ] **Step 3: Add compact meeting-first CSS**

Add styles for horizontal tabs, tab panels, brief hero, reason cards, compact metric cards, exception cards, and follow-up layout.

- [ ] **Step 4: Run visual and automated verification**

Run:
- `npm.cmd test -- --run`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`

Expected: all commands exit 0.

## Self-Review

- Spec coverage: all five tabs, default Decision Brief, progressive disclosure, rules traceability, final decision flow, and meeting modes are covered.
- Placeholder scan: no `TBD`, `TODO`, or unspecified test steps.
- Type consistency: new `budget` property is defined in domain schema and seed data before UI use.
