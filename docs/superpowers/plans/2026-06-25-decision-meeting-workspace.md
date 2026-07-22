# Decision Meeting Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a decision-centric BPR&E demo with a seeded Breakfast Combo Pilot meeting workspace, operational navigation, a recorded human decision, generated action plan, and immutable local audit snapshot.

**Architecture:** Add a focused `DecisionProject` aggregate persisted in the existing local Dexie repository. The aggregate stores the prepared Decision Card, evaluation snapshot, relevant governance references, optional human decision record, action tasks, and timeline; UI components read the prepared/evaluated fields as immutable meeting inputs and write only the final decision layer through a dedicated service.

**Tech Stack:** React 19, React Router 8, TypeScript 6, Zod 4, Dexie 4, React Hook Form, Vitest, Testing Library, Tailwind CSS

---

## File structure

- Create `src/domain/decision-project.ts`: decision, evidence, option, impact, evaluation, action-plan, and audit schemas.
- Create `src/features/decisions/decision-service.ts`: final-decision validation and immutable snapshot recording.
- Create `src/features/decisions/decision-service.test.ts`: decision-recording domain tests.
- Create `src/features/decisions/decision-home.tsx`: CEO-oriented operational home.
- Create `src/features/decisions/decision-agenda.tsx`: active-decision list.
- Create `src/features/decisions/decision-workspace.tsx`: page composition and meeting state.
- Create `src/features/decisions/decision-workspace.test.tsx`: workspace rendering and meeting-action flow.
- Create `src/features/decisions/decision-sections.tsx`: context, customer, evidence, options, impacts, constraints, and Article sections.
- Create `src/features/decisions/decision-rail.tsx`: sticky assessment and meeting actions.
- Create `src/features/decisions/final-decision-panel.tsx`: human-decision form and action-plan result.
- Create `src/features/decisions/constraint-source-drawer.tsx`: read-only constraint lineage drawer.
- Create `src/features/decisions/review-follow-up.tsx`: action and review summary.
- Modify `src/data/repository.ts`: decision-project repository contract.
- Modify `src/data/dexie-repository.ts`: Dexie schema version 3 and decision persistence.
- Modify `src/data/seed.ts`: Breakfast Combo Pilot aggregate and seed version 3.
- Modify `src/data/seed.test.ts`: project and snapshot seed assertions.
- Modify `src/app/navigation.ts`: decision-centric navigation hierarchy.
- Modify `src/app/app-shell.tsx`: remove global rule-first flow rail and add governance group.
- Modify `src/app/router.tsx`: home, agenda, workspace, and review routes.
- Modify `src/app/router.test.tsx`: default-route and workspace routing tests.
- Modify `src/app/accessibility.test.tsx`: new navigation and operational-home semantics.
- Modify `src/styles.css`: responsive 12-column meeting workspace and component states.

### Task 1: Decision aggregate and local persistence

**Files:**
- Create: `src/domain/decision-project.ts`
- Modify: `src/data/repository.ts`
- Modify: `src/data/dexie-repository.ts`
- Modify: `src/data/seed.ts`
- Modify: `src/data/seed.test.ts`

- [ ] **Step 1: Write the failing seed-persistence test**

Extend the repository seed snapshot:

```ts
projects: await repository.listDecisionProjects(),
```

Assert:

```ts
expect(second.projects).toHaveLength(1);
expect(second.projects[0]).toMatchObject({
  projectId: "DP-2026-001",
  meetingMode: "Revision Review",
  recommendation: "Revise",
});
expect(second.projects[0].evaluationSnapshot.results).toHaveLength(6);
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm.cmd test -- src/data/seed.test.ts --run
```

Expected: failure because decision-project repository methods and seed data do not exist.

- [ ] **Step 3: Implement schemas and repository methods**

Define Zod schemas for:

```ts
DecisionProject
DecisionEvidence
DecisionOption
BpreImpact
ConstraintEvaluation
EvaluationSnapshot
HumanDecisionRecord
ActionPlanTask
TimelineEvent
```

The project must include prepared meeting inputs, six evaluations, four
relevant Article IDs, optional `decisionRecord`, and timeline events.

Add repository methods:

```ts
listDecisionProjects(): Promise<DecisionProject[]>;
getDecisionProject(id: string): Promise<DecisionProject | undefined>;
putDecisionProject(record: DecisionProject): Promise<void>;
```

Add Dexie schema version 3:

```ts
decisionProjects:
  "id, projectId, status, meetingMode, recommendation, decisionDeadline, updatedAt"
```

- [ ] **Step 4: Seed Breakfast Combo Pilot**

Use the approved UX copy and include:

- six evidence metrics with quality states
- three options
- four BPR&E impact cards
- six applicable constraint results
- four relevant Article IDs
- four required resolutions
- four proposed action tasks
- submitted, validated, evaluated, and scheduled-review timeline events

Set seed version to 3.

- [ ] **Step 5: Verify GREEN**

Run:

```powershell
npm.cmd test -- src/data/seed.test.ts --run
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/domain/decision-project.ts src/data
git commit -m "feat: model seeded decision meeting project"
```

### Task 2: Human decision recording service

**Files:**
- Create: `src/features/decisions/decision-service.ts`
- Create: `src/features/decisions/decision-service.test.ts`

- [ ] **Step 1: Write failing validation and snapshot tests**

Test that recording fails without rationale:

```ts
await expect(
  service.recordDecision(seedDecisionProject.id, {
    ...validInput,
    rationale: "",
  }),
).rejects.toThrow("Decision rationale is required");
```

Test a valid Revision decision:

```ts
const recorded = await service.recordDecision(
  seedDecisionProject.id,
  validInput,
);

expect(recorded.decisionRecord?.outcome).toBe("Revise");
expect(recorded.decisionRecord?.snapshot.constraintVersions).toHaveLength(6);
expect(recorded.actionPlan).toHaveLength(4);
expect(recorded.timeline.at(-1)?.eventType).toBe("Decision Recorded");
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-service.test.ts --run
```

Expected: failure because the service does not exist.

- [ ] **Step 3: Implement minimal recording service**

Validate:

- rationale
- decision-maker
- owner
- North Star
- at least one KPI
- at least one review checkpoint
- exit rule
- exception IDs when outcome is `Approve Exception`

Create the immutable snapshot by copying Decision Card version, Constitution
version, Article IDs, constraint IDs and versions, evidence values, evaluation
results, decision fields, commitments, and timestamp. Persist the updated
project without mutating prepared evidence or evaluation inputs.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-service.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/decisions/decision-service.ts src/features/decisions/decision-service.test.ts
git commit -m "feat: record accountable human decisions"
```

### Task 3: Decision-centric shell, home, and agenda

**Files:**
- Create: `src/features/decisions/decision-home.tsx`
- Create: `src/features/decisions/decision-agenda.tsx`
- Modify: `src/app/navigation.ts`
- Modify: `src/app/app-shell.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/app/router.test.tsx`
- Modify: `src/app/accessibility.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing navigation and route tests**

Assert `/` redirects to `/home`, Home renders `Decisions requiring attention`,
and primary navigation contains:

```text
Home
Decision Agenda
Decision Workspace
Review & Follow-up
Rules & Governance
```

Assert the global `Decision workflow` navigation is absent.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm.cmd test -- src/app/router.test.tsx src/app/accessibility.test.tsx --run
```

Expected: failure because the shell and routes are still rule-centric.

- [ ] **Step 3: Implement operational home and agenda**

Home shows:

- decisions requiring attention
- escalated decisions
- recommendation counts
- upcoming reviews
- link to Breakfast Combo Pilot

Agenda shows one active decision row with meeting mode, recommendation, deadline,
North Star, and owner.

Replace the global workflow rail with a compact page header. Render governance
links as a visually subordinate sidebar group.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm.cmd test -- src/app/router.test.tsx src/app/accessibility.test.tsx --run
```

Expected: PASS.

### Task 4: Read-only meeting narrative and decision rail

**Files:**
- Create: `src/features/decisions/decision-workspace.tsx`
- Create: `src/features/decisions/decision-sections.tsx`
- Create: `src/features/decisions/decision-rail.tsx`
- Create: `src/features/decisions/constraint-source-drawer.tsx`
- Create: `src/features/decisions/decision-workspace.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing workspace rendering test**

Render `/decisions/decision-breakfast-combo-pilot` and assert:

```ts
expect(await screen.findByRole("heading", {
  name: "Should we approve a 10-day breakfast combo pilot across 30 stores?",
})).toBeVisible();
expect(screen.getByText("REVISION REQUIRED")).toBeVisible();
expect(screen.getByText("-$4K")).toBeVisible();
expect(screen.getByText("Short-term morning traffic growth")).toBeVisible();
expect(screen.getByText("4 Passed")).toBeVisible();
expect(screen.getAllByText("RULE-BR-001")).toHaveLength(1);
```

Assert no full Constitution navigation content is rendered inside the page.

- [ ] **Step 2: Write failing constraint-drawer test**

Click `Incremental EBITDA must be non-negative` and assert the drawer shows:

```text
Constraint Source
Economic Box Discipline
Prevent value-destructive projects from approval
CEO only
```

- [ ] **Step 3: Verify RED**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-workspace.test.tsx --run
```

Expected: failure because the workspace components do not exist.

- [ ] **Step 4: Implement the meeting workspace**

Compose:

- command bar
- decision header and snapshot
- context and customer sections
- six evidence cards
- trade-off banner and option table
- four BPR&E impact cards
- constraint summary and evaluation table
- relevant Article list
- sticky system-assessment rail
- required-resolution list and meeting actions
- read-only source drawer

The drawer resolves existing Constraint, Blueprint, and Article records through
the repository. Passed details remain compact; failures are visually prominent.

- [ ] **Step 5: Verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-workspace.test.tsx --run
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/features/decisions/decision-home.tsx src/features/decisions/decision-agenda.tsx src/features/decisions/decision-workspace.tsx src/features/decisions/decision-sections.tsx src/features/decisions/decision-rail.tsx src/features/decisions/constraint-source-drawer.tsx src/app src/styles.css
git commit -m "feat: build decision meeting narrative workspace"
```

### Task 5: Final decision form, action plan, and review

**Files:**
- Create: `src/features/decisions/final-decision-panel.tsx`
- Create: `src/features/decisions/review-follow-up.tsx`
- Modify: `src/features/decisions/decision-workspace.tsx`
- Modify: `src/features/decisions/decision-workspace.test.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing meeting-action test**

Click `Return for Revision` and assert the final-decision section opens with
`Revise` selected. Submit with blank rationale and assert:

```text
Decision rationale is required
```

Fill rationale, submit, and assert:

```text
Decision recorded
Finalize revised offer mechanics
Decision Record and Review Timeline
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-workspace.test.tsx --run
```

Expected: failure because no final-decision workflow exists.

- [ ] **Step 3: Implement the form and review surface**

Use React Hook Form with fields from the approved design. Default prepared
accountability values from the project but require explicit rationale. Call
`DecisionService.recordDecision`, reload the project, display the generated
action plan and timeline, and expose the same record at `/review-follow-up`.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
npm.cmd test -- src/features/decisions/decision-workspace.test.tsx --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/features/decisions src/app/router.tsx src/styles.css
git commit -m "feat: complete meeting decision and action flow"
```

### Task 6: Responsive, accessibility, and final verification

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/accessibility.test.tsx`
- Modify: `BPRE_Decision_Studio_Phase1_PRD.md`

- [ ] **Step 1: Add accessibility assertions**

Verify:

- meeting actions are buttons
- collapsible content exposes `aria-expanded`
- status labels include text
- final-decision errors are visible and associated
- governance links remain reachable

- [ ] **Step 2: Update the PRD product direction**

Add a Decision-Centric UX direction section documenting:

- operational home
- Decision Agenda
- Decision Meeting Workspace as core screen
- meeting-mode behavior
- read-only meeting inputs
- human-decision recording boundary
- governance as supporting layer

- [ ] **Step 3: Run complete verification**

Run:

```powershell
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: all tests pass and all commands exit 0. The Vite build may report its
existing non-blocking chunk-size advisory.

- [ ] **Step 4: Browser verification**

Inspect:

- `/home`
- `/decision-agenda`
- `/decisions/decision-breakfast-combo-pilot`
- constraint source drawer
- final-decision validation and successful record
- `/review-follow-up`

Confirm desktop 8/4 layout, sticky rail, mobile stacking, no console errors, and
only relevant governance references.

- [ ] **Step 5: Commit and push**

```powershell
git add BPRE_Decision_Studio_Phase1_PRD.md src
git commit -m "docs: align product around decision meetings"
git push origin codex/sprint-0-1-foundation
```

Expected: existing Pull Request #1 updates with the Decision Meeting Workspace.
