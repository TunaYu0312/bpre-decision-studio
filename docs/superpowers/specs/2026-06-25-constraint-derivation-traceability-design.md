# Constraint Derivation Traceability Design

## Purpose

The Constraint Library must show how every atomic constraint was derived from
the active Decision Constitution. A constraint is not considered governable
unless a reviewer can identify the exact Constitution article, the control
objective used to interpret that article, and the rationale for the selected
metric and threshold.

This change implements the governance chain defined in the PRD supplement:

`Decision Constitution Article → BPR&E Control Objective → Constraint Blueprint → Atomic Constraint → Decision Card Evaluation`

The current Sprint 0+1 scope ends at Atomic Constraint. Decision Card
evaluation will consume these traceability records in a later sprint.

## Selected approach

Add a first-class Constraint Blueprint between Constitution rules and atomic
constraints. Keep the existing `ConstitutionRule` model name to avoid an
unnecessary repository-wide rename, but expand it so that each record functions
as a formal Constitution Article.

This approach is preferred over copying the source sentence into every
constraint because duplicated text could drift when a Constitution is
versioned. It is also preferred over a UI-only lookup because the PRD supplement
requires control objectives, threshold sources, and derivation rationale as
governance data rather than presentation-only text.

## Domain model

### Constitution Article

Expand `ConstitutionRule` with:

- `strategicStage`
- `ruleType`
- `applicableDecisionTypes`
- `relevantPillars`
- `escalationAuthority`
- `status`
- `version`

The existing `principle` field remains the exact source sentence shown to users.
The existing `ruleId` is the human-readable Article ID.

### Constraint Blueprint

Add a `ConstraintBlueprint` entity with:

- `id`
- `blueprintId`
- `constitutionVersionId`
- `parentArticleId`
- `pillar`
- `controlObjective`
- `riskToAvoid`
- `metricKey`
- `thresholdSource`
- `ruleType`
- `evaluationOutcome`
- `exceptionAuthority`
- `createdAt`

A blueprint belongs to one Constitution version and one Constitution Article.
It explains the governance intent behind one or more atomic constraints.

### Atomic Constraint

Add these required fields to `Constraint`:

- `constraintBlueprintId`
- `derivationRationale`

The existing `constitutionRuleId` remains the direct parent Article reference.
The existing metric, operator, threshold, unit, outcome, exception, review,
effective-date, version, and status fields satisfy the remaining atomic
constraint requirements.

The relationship is valid only when:

1. The constraint and blueprint reference the same Constitution version.
2. The constraint and blueprint reference the same parent Article.
3. The constraint and blueprint use the same BPR&E pillar.
4. The blueprint metric matches the atomic constraint metric.

## Repository and seed data

Add blueprint persistence to the repository interface and Dexie database. Bump
the Dexie schema and seed version so existing demo browsers receive the new
traceability records.

Create one blueprint for each seeded atomic constraint. This is intentional for
the current demo: the eight constraints have distinct metrics or threshold
sources, so sharing a blueprint would obscure rather than clarify derivation.

Each seeded Constitution Article uses an exact sentence already present in the
demo Constitution:

- Brand: `Signature-product quality and value perception cannot be compromised for short-term traffic.`
- Product: `Protect core quality while controlling food cost, complexity, and margin.`
- Restaurant/Retail: `Keep changes executable within peak capacity, service, labor, and availability limits.`
- Economic Box: `Require non-negative incremental EBITDA, explicit payback, and disciplined investment.`

No new strategic principle is invented during this change.

## Application behavior

### Constraint list

Load constraints, Constitution Articles, and blueprints together. Add a
`Constitution source` column showing:

- Article ID
- the exact source sentence, truncated visually but available in full text

Search also matches Article ID and source sentence.

### Constraint detail

Replace the current ID-only Constitution linkage with a `Derivation chain`
section showing:

1. Constitution version and Article ID
2. Exact Constitution principle
3. BPR&E control objective
4. Risk to avoid
5. Threshold source
6. Derivation rationale
7. Atomic `IF / THEN / ELSE` representation

If a linked record cannot be resolved, the page shows a clear traceability
error instead of silently displaying incomplete governance information.

### Constraint form

The form continues to store IDs but replaces free-text parent IDs with selectors
backed by repository records:

- Constitution Article selector
- Constraint Blueprint selector, filtered by selected Article

The selected source sentence and blueprint control objective are previewed
before saving. `derivationRationale` is a required field.

## PRD update

Append the supplement as a new `Constraint Derivation Mechanism` subsection
within Module B. It will document:

- purpose and governance chain
- required Constitution Article fields
- Constraint Blueprint structure
- Atomic Constraint structure
- five supported constraint types, including `Monitoring Trigger`
- matching rules for Decision Card evaluation
- immutable evaluation snapshot requirements
- interface and acceptance criteria for traceability

The existing `Advisory Check` constraint type will be renamed to `Monitoring
Trigger` so the implementation and supplemented PRD use one vocabulary.
`Information Requirement` will return `Incomplete Data` when evaluated in the
future Decision Card engine.

## Validation and tests

Tests will verify:

- all seeded active constraints resolve to an Article and blueprint
- relationship invariants hold for every seed record
- repository seed upgrades persist and return blueprints
- list search and rendering expose the Article source
- detail rendering exposes the complete derivation chain
- the form requires a derivation rationale and valid linked records
- exports include the new traceability IDs and rationale
- existing constraint lifecycle and Constitution behavior remain intact

Final verification includes the complete unit test suite, lint, production
build, Git diff checks, and browser inspection of the local demo.

## Scope boundaries

This change does not implement Decision Card evaluation, immutable evaluation
snapshots, approval workflows, or automatic natural-language generation of
blueprints. It establishes the governed data and UI traceability those later
features require.
