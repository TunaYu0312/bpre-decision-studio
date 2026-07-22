# BPR&E Decision Studio Sprint 0+1 Design

## Objective

Deliver the first usable release of BPR&E Decision Studio: a static, local-first
application shell plus complete Constitution and Constraint Library modules.
The release must demonstrate versioned decision governance records, not merely
static screens.

## Scope

Included:

- Executive application shell, responsive navigation, decision-flow rail, and
  placeholder routes for later workflow stages.
- Typed domain schemas and a repository interface backed by Dexie/IndexedDB.
- Idempotent seed loading for `Profit Repair 2026`, its strategic rules, and
  active constraints across all four BPR&E pillars.
- Constitution create, view, clone, activate, supersede, and invalidate flows.
- Constitution version history and immutable active/historical versions.
- Constraint create, view, edit Draft, clone, activate, suspend, retire,
  filter, search, JSON export, and CSV export flows.
- Public `/demo` landing route and illustrative-data disclaimer.
- Unit tests for lifecycle services, validation, seed loading, and exports.
- Netlify static-host configuration and developer README.

Excluded:

- Decision Card entry, evaluation execution, approvals, action plans, review
  records, authentication, collaboration, and production APIs.
- A real open-project impact count. Sprint 1 exposes the warning contract and
  reports zero linked open projects until Decision Projects are implemented.

## Architecture

The implementation uses React, TypeScript, Vite, React Router, Tailwind CSS,
Dexie, Zod, React Hook Form, Vitest, and Testing Library.

The code is divided into three boundaries:

1. `domain`: Zod schemas, record types, lifecycle rules, identifiers, export
   formatting, and seed definitions. It has no browser or React dependency.
2. `data`: a repository contract and Dexie implementation. UI code depends on
   the contract, not Dexie tables, so a cloud repository can replace IndexedDB.
3. `features` and `app`: route-level screens and reusable UI. Screens call
   application services and hooks; they never perform direct database writes.

Dexie tables use stable string IDs:

- `constitutions`
- `constitutionRules`
- `constraints`
- `workspaceMeta`

The database version is explicit. Seed loading is idempotent through a
`seedVersion` metadata record and runs in one transaction.

## Domain Behavior

### Constitution

A Constitution contains document control, strategic mandate,
customer-centricity, four BPR&E boundary records, and governance fields.

- New records start as `Draft`.
- Only Draft records are editable.
- Clone creates a new Draft with a new stable ID, incremented minor version,
  a `supersedesId` link, cleared activation metadata, and required change notes.
- Activating a Draft supersedes the currently Active Constitution for the same
  scope key in the same transaction.
- Invalidating an Active Constitution requires reason, effective end date, and
  executive owner.
- Linked or historical records are never deleted.

### Constraint

A Constraint contains every field required by the PRD, including type,
operator, typed threshold, severity, failure outcome, escalation role,
exception policy, evidence requirement, effective date, and review frequency.

- New records start as `Draft`.
- Only Draft records are freely editable.
- Clone creates a new Draft version linked through `supersedesId`.
- Activate makes the version available for future evaluation.
- Suspend and Retire preserve the record and show an impact-warning dialog.
- Filters combine pillar, status, decision type, scope, severity, and outcome.
- Search matches constraint ID, name, and metric key, case-insensitively.

## Interface Design

The interface uses a persistent dark left navigation and a top decision-flow
rail:

`Constitution → Constraints → Decision Card → Evaluation → Action → Review`

Sprint 0+1 enables the first two stages. Later stages remain visible but are
marked `Planned`, making the product architecture understandable without
pretending unfinished modules work.

Routes:

- `/` redirects to `/demo`
- `/demo`
- `/constitutions`
- `/constitutions/new`
- `/constitutions/:id`
- `/constitutions/:id/clone`
- `/constraints`
- `/constraints/new`
- `/constraints/:id`
- `/constraints/:id/edit`
- `/constraints/:id/clone`
- `/decision-projects`, `/evaluation`, `/action-review`, `/settings` as
  explanatory placeholders

Constitution and Constraint lists use operating tables with status text and
icons, not color alone. Detail pages put lifecycle actions in a right-side
action panel. Forms use sections matching the PRD and show inline Zod errors.

## Failure Handling

- Repository failures show a persistent error notice with a retry action.
- Invalid lifecycle transitions are rejected by domain services and surfaced
  as plain-language messages.
- Failed seed transactions roll back completely.
- JSON/CSV exports are generated locally; no data is transmitted.
- An IndexedDB-unavailable state explains that the browser must permit local
  storage.

## Test and Acceptance Strategy

Automated tests cover:

- Constitution activation supersedes only the matching active scope.
- Active Constitutions cannot be edited in place.
- Clone increments version and preserves historical linkage.
- Invalidation rejects missing governance fields.
- Constraint filtering and search combine correctly.
- Numeric, boolean, enum, and required-information threshold schemas validate.
- Seed loading is idempotent and creates one active Constitution plus active
  constraints across Brand, Product, Restaurant/Retail, and Economic Box.
- JSON and CSV exports preserve filtered records and escape values safely.
- Route smoke tests render demo, Constitution list, and Constraint list.

Manual browser acceptance covers creation, cloning, activation, superseding,
invalidation, Draft editing, lifecycle warnings, filtering, responsive layout,
keyboard focus, route refresh, and Netlify production build.

## Defaults

- English-first UI; copy is centralized for future localization.
- Dark navy/charcoal foundation with restrained warm gold accents.
- Company scope is used in seed data, while the schema supports all PRD scopes.
- Dates are stored as ISO `YYYY-MM-DD`; timestamps use ISO UTC strings.
- No license is added in this sprint.
