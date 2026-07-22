# Constraint Derivation Traceability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every demo constraint traceable to an exact Decision Constitution article, a governed Constraint Blueprint, and a documented derivation rationale.

**Architecture:** Extend the existing local-first domain with formal Constitution Article metadata and a new Constraint Blueprint entity persisted in Dexie. Resolve traceability through a focused read-model helper used by the Constraint Library list, detail, and form rather than copying source text into atomic constraints.

**Tech Stack:** React 19, TypeScript 6, Zod 4, Dexie 4, React Hook Form, Vitest, Testing Library, Tailwind CSS

---

## File structure

- Create `src/domain/constraint-blueprint.ts`: blueprint schema and types.
- Create `src/features/constraints/constraint-traceability.ts`: relationship validation and UI read-model construction.
- Create `src/features/constraints/constraint-traceability.test.ts`: relationship invariant tests.
- Create `src/features/constraints/constraint-detail.test.tsx`: detail derivation-chain test.
- Modify `src/domain/constitution-rule.ts`: formal Article metadata.
- Modify `src/domain/constraint.ts`: blueprint reference, derivation rationale, and vocabulary.
- Modify `src/data/repository.ts`: blueprint repository contract.
- Modify `src/data/dexie-repository.ts`: schema version 2 and blueprint persistence.
- Modify `src/data/seed.ts`: Article metadata, eight blueprints, and atomic derivation rationales.
- Modify `src/data/seed.test.ts`: seed traceability assertions.
- Modify `src/features/constraints/constraint-service.ts`: traceability-aware filtering.
- Modify `src/features/constraints/constraint-list.tsx`: source Article column.
- Modify `src/features/constraints/constraint-list.test.tsx`: source rendering and search.
- Modify `src/features/constraints/constraint-detail.tsx`: full derivation chain.
- Modify `src/features/constraints/constraint-form.tsx`: governed linkage selectors and rationale.
- Modify `src/features/constraints/constraint-export.ts`: traceability columns and schema version.
- Modify `src/features/constraints/constraint-export.test.ts`: export assertions.
- Modify `src/styles.css`: source and derivation-chain presentation.
- Modify `BPRE_Decision_Studio_Phase1_PRD.md`: append the PRD supplement to Module B.

### Task 1: Domain and repository traceability

**Files:**
- Create: `src/domain/constraint-blueprint.ts`
- Modify: `src/domain/constitution-rule.ts`
- Modify: `src/domain/constraint.ts`
- Modify: `src/data/repository.ts`
- Modify: `src/data/dexie-repository.ts`
- Test: `src/data/seed.test.ts`

- [ ] **Step 1: Write the failing repository contract test**

Extend the seed repository snapshot with:

```ts
blueprints: await repository.listConstraintBlueprints(),
```

and assert:

```ts
expect(second.blueprints).toHaveLength(second.constraints.length);
```

- [ ] **Step 2: Run the test and verify the missing repository API fails**

Run:

```powershell
npm.cmd test -- src/data/seed.test.ts --run
```

Expected: TypeScript or runtime failure because `listConstraintBlueprints` and blueprint seed data do not exist.

- [ ] **Step 3: Add the minimal schemas and persistence contract**

Create `constraint-blueprint.ts` with a Zod object containing the fields in the approved design. Extend `ConstitutionRule` with Article metadata. Require `constraintBlueprintId` and `derivationRationale` in `Constraint`; replace `Advisory Check` with `Monitoring Trigger`.

Add to `WorkspaceRepository`:

```ts
listConstraintBlueprints(): Promise<ConstraintBlueprint[]>;
getConstraintBlueprint(id: string): Promise<ConstraintBlueprint | undefined>;
listConstraintBlueprintsForArticle(
  parentArticleId: string,
): Promise<ConstraintBlueprint[]>;
```

Add a Dexie `constraintBlueprints` table and schema version 2:

```ts
this.version(2).stores({
  constraintBlueprints:
    "id, blueprintId, constitutionVersionId, parentArticleId, pillar, metricKey",
});
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
npm.cmd test -- src/data/seed.test.ts --run
```

Expected: compilation reaches seed data and fails because required Article, blueprint, and atomic fields are not seeded.

### Task 2: Governed seed data and invariant validation

**Files:**
- Create: `src/features/constraints/constraint-traceability.ts`
- Create: `src/features/constraints/constraint-traceability.test.ts`
- Modify: `src/data/seed.ts`
- Modify: `src/data/seed.test.ts`

- [ ] **Step 1: Write failing relationship tests**

Test that `resolveConstraintTraceability`:

```ts
const result = resolveConstraintTraceability(
  seedConstraints[0],
  seedConstitutionRules,
  seedConstraintBlueprints,
);

expect(result.article.principle).toBe(
  "Signature-product quality and value perception cannot be compromised for short-term traffic.",
);
expect(result.blueprint.metricKey).toBe(result.constraint.metricKey);
```

Also create a mismatched blueprint fixture and assert the helper throws a
`TraceabilityError`.

- [ ] **Step 2: Run the tests and verify the missing helper fails**

Run:

```powershell
npm.cmd test -- src/features/constraints/constraint-traceability.test.ts --run
```

Expected: FAIL because the helper and governed seed records do not exist.

- [ ] **Step 3: Seed exact Articles, blueprints, and rationales**

Set seed version to 2. Use the four exact Constitution sentences named in the
design. Create eight blueprints, one for each atomic metric, with explicit
control objective, risk, threshold source, outcome, and exception authority.
Add `constraintBlueprintId` and a specific derivation rationale to all eight
constraints.

Implement `resolveConstraintTraceability` so it resolves the records and checks
version, Article, pillar, and metric invariants.

- [ ] **Step 4: Run seed and invariant tests**

Run:

```powershell
npm.cmd test -- src/data/seed.test.ts src/features/constraints/constraint-traceability.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit the domain slice**

```powershell
git add src/domain src/data src/features/constraints/constraint-traceability.ts src/features/constraints/constraint-traceability.test.ts
git commit -m "feat: model governed constraint derivation"
```

### Task 3: Constraint Library source visibility

**Files:**
- Modify: `src/features/constraints/constraint-service.ts`
- Modify: `src/features/constraints/constraint-list.tsx`
- Modify: `src/features/constraints/constraint-list.test.tsx`
- Modify: `src/features/constraints/constraint-detail.tsx`
- Create: `src/features/constraints/constraint-detail.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing list and detail tests**

List test assertions:

```ts
expect(
  await screen.findByText("Signature-product quality and value perception cannot be compromised for short-term traffic."),
).toBeVisible();
```

Search for `RULE-BR-001` and assert only the two Brand constraints remain.

Detail test assertions:

```ts
expect(await screen.findByRole("heading", { name: "Derivation chain" })).toBeVisible();
expect(screen.getByText("RULE-BR-001")).toBeVisible();
expect(screen.getByText("Protect signature-product price perception")).toBeVisible();
expect(screen.getByText(/IF Company THEN discount_pct <= 20 % ELSE Revise/)).toBeVisible();
```

- [ ] **Step 2: Run the tests and verify the source UI is absent**

Run:

```powershell
npm.cmd test -- src/features/constraints/constraint-list.test.tsx src/features/constraints/constraint-detail.test.tsx --run
```

Expected: FAIL because no Article source column or derivation chain is rendered.

- [ ] **Step 3: Build traceability read models and UI**

Load constraints, Articles, and blueprints in parallel. Resolve each row through
the traceability helper. Add the `Constitution source` column and include source
data in text search.

In detail, display the full governance chain and a clear error panel if
resolution fails. Format the atomic rule as:

```text
IF {scope} THEN {metricKey} {operator} {threshold} ELSE {outcomeIfFailed}
```

- [ ] **Step 4: Run focused UI tests**

Run:

```powershell
npm.cmd test -- src/features/constraints/constraint-list.test.tsx src/features/constraints/constraint-detail.test.tsx --run
```

Expected: PASS.

### Task 4: Governed editing and export

**Files:**
- Modify: `src/features/constraints/constraint-form.tsx`
- Modify: `src/features/constraints/constraint-export.ts`
- Modify: `src/features/constraints/constraint-export.test.ts`
- Create: `src/features/constraints/constraint-form.test.tsx`

- [ ] **Step 1: Write failing form and export tests**

The form test opens `/constraints/new`, waits for repository linkage data, and
asserts Article and Blueprint comboboxes plus the exact source preview exist.
Clear `Derivation rationale`, submit, and assert the required-field message.

The CSV export test asserts headers for:

```text
Constitution Version ID
Constitution Article ID
Constraint Blueprint ID
Derivation Rationale
```

The JSON test expects `schemaVersion` to equal `2`.

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
npm.cmd test -- src/features/constraints/constraint-form.test.tsx src/features/constraints/constraint-export.test.ts --run
```

Expected: FAIL because linkage is free text, rationale is absent, and exports use schema version 1.

- [ ] **Step 3: Implement selectors, preview, validation, and export fields**

Load Articles and blueprints from the repository. Filter blueprints by the
selected Article, keep Constitution version and pillar synchronized with the
selected records, and require `derivationRationale`.

Add the traceability IDs and rationale to CSV. Increment JSON export schema to
2; records already contain the new fields.

- [ ] **Step 4: Run focused tests**

Run:

```powershell
npm.cmd test -- src/features/constraints/constraint-form.test.tsx src/features/constraints/constraint-export.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit the user-facing slice**

```powershell
git add src/features/constraints src/styles.css
git commit -m "feat: expose constraint derivation traceability"
```

### Task 5: PRD integration and full verification

**Files:**
- Modify: `BPRE_Decision_Studio_Phase1_PRD.md`

- [ ] **Step 1: Update the Module B specification**

Add the full supplement content after the Constraint Library purpose and update
the required field table, constraint vocabulary, interface requirements, and
acceptance criteria. Preserve the existing PRD content outside Module B.

- [ ] **Step 2: Verify PRD terminology**

Run:

```powershell
rg -n "Constraint Derivation Mechanism|Constraint Blueprint|Parent Article ID|Monitoring Trigger|Immutable snapshot" BPRE_Decision_Studio_Phase1_PRD.md
```

Expected: each governed concept appears in Module B.

- [ ] **Step 3: Run the complete verification suite**

Run:

```powershell
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: all tests pass; lint, build, and whitespace checks exit with code 0.

- [ ] **Step 4: Inspect the local demo**

Run the Vite dev server and inspect `/constraints`, a Brand constraint detail,
and `/constraints/new` in the in-app browser. Confirm the source sentence,
derivation chain, selectors, and mobile/desktop layout render without browser
errors.

- [ ] **Step 5: Commit documentation and final corrections**

```powershell
git add BPRE_Decision_Studio_Phase1_PRD.md docs/superpowers/plans/2026-06-25-constraint-derivation-traceability.md
git commit -m "docs: add constraint derivation mechanism"
```

- [ ] **Step 6: Push the existing PR branch**

```powershell
git push origin codex/sprint-0-1-foundation
```

Expected: Pull request #1 updates with the new commits.
