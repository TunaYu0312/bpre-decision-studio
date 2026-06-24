# Architecture

## Product boundary

BPR&E Decision Studio is a local-first decision governance application. It
structures rules, evidence, trade-offs, accountability, and review while
leaving approval authority with accountable leaders.

Sprint 0+1 implements the common shell, Decision Constitutions, and the
Constraint Library. Decision Cards, evaluation, approval, action, and review
remain explicit future workflow stages.

## Application layers

### Domain

`src/domain` contains Zod schemas and pure lifecycle rules. It has no React or
browser-storage dependency. A Constitution can only be edited while Draft;
activation supersedes the previous Active version in the same scope. Constraint
state transitions are explicitly enumerated.

### Data

`src/data/repository.ts` is the storage contract. The current adapter uses
Dexie/IndexedDB, but feature code depends only on the contract. A future cloud
adapter can implement the same interface.

The IndexedDB database contains:

- `constitutions`
- `constitutionRules`
- `constraints`
- `workspaceMeta`

Seed loading is transactional and idempotent through `workspaceMeta.seedVersion`.

### Features

Feature folders own route pages and application services. Services coordinate
domain rules and repository writes. Pages never import Dexie tables directly.

## Current object flow

```text
Constitution
  └─ Constitution Rules
       └─ Constraints
```

Later sprints extend this without replacing the current objects:

```text
Constraint
  └─ Decision Project
       └─ Evaluation Snapshot
            └─ Approval
                 └─ Action Plan
                      └─ Review
```

## Extensibility

Stable string IDs, explicit version fields, immutable historical records, and a
repository boundary prevent scenario-specific UI from becoming the system of
record. Future Promotion, Pricing, Menu, Product, and Store Network scenarios
will be configuration records that reuse the same Decision Card and evaluation
engine.

## Static deployment

Vite produces static assets in `dist/`. `netlify.toml` rewrites route requests
to `index.html`, so BrowserRouter routes work when refreshed directly. No
private API key or server is required.
