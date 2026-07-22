# Sprint 0+1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable local-first BPR&E Decision Studio with working Constitution and Constraint Library modules.

**Architecture:** Domain rules remain framework-independent, persistence is hidden behind a repository contract with a Dexie adapter, and React route modules consume application services. Seed loading and lifecycle transitions use transactions so version history cannot be partially updated.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Tailwind CSS, Dexie, Zod, React Hook Form, Vitest, Testing Library, Netlify.

---

### Task 1: Project foundation

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`
- Create: `src/main.tsx`, `src/app/router.tsx`, `src/styles.css`
- Create: `netlify.toml`, `README.md`
- Test: `src/app/router.test.tsx`

- [ ] Write a route smoke test that expects `/demo` to render the product title.
- [ ] Run `npm.cmd test -- --run src/app/router.test.tsx` and verify it fails because the app does not exist.
- [ ] Add Vite, test setup, Tailwind, the app shell, flow rail, routes, and planned-module placeholders.
- [ ] Run the route test and verify it passes.
- [ ] Commit with `feat: add application foundation`.

### Task 2: Domain schemas and lifecycle services

**Files:**
- Create: `src/domain/common.ts`
- Create: `src/domain/constitution.ts`
- Create: `src/domain/constraint.ts`
- Create: `src/domain/lifecycle.ts`
- Test: `src/domain/lifecycle.test.ts`

- [ ] Write failing tests for Constitution clone, activation/supersession,
  invalidation validation, and editable-status rules.
- [ ] Write failing tests for Constraint threshold validation and lifecycle
  transitions.
- [ ] Run the domain tests and verify failures are caused by missing behavior.
- [ ] Implement Zod schemas, stable ID generation, and pure lifecycle functions.
- [ ] Run all domain tests and verify they pass.
- [ ] Commit with `feat: define governance domain model`.

### Task 3: Repository and seed data

**Files:**
- Create: `src/data/repository.ts`
- Create: `src/data/dexie-repository.ts`
- Create: `src/data/repository-context.tsx`
- Create: `src/data/seed.ts`
- Test: `src/data/seed.test.ts`

- [ ] Write a failing repository contract test using fake IndexedDB.
- [ ] Write a failing idempotent seed test asserting one active Constitution,
  linked rules, and constraints in all four pillars.
- [ ] Implement the Dexie schema, transactional lifecycle writes, seed loader,
  and React provider.
- [ ] Run repository tests and verify they pass.
- [ ] Commit with `feat: add local workspace repository`.

### Task 4: Constitution module

**Files:**
- Create: `src/features/constitutions/constitution-list.tsx`
- Create: `src/features/constitutions/constitution-form.tsx`
- Create: `src/features/constitutions/constitution-detail.tsx`
- Create: `src/features/constitutions/constitution-service.ts`
- Test: `src/features/constitutions/constitution-service.test.ts`

- [ ] Write failing service tests for create Draft, clone, activate,
  supersede-by-scope, and invalidate.
- [ ] Implement the application service and query hooks.
- [ ] Build the list, PRD-aligned form sections, detail view, version history,
  and lifecycle dialogs.
- [ ] Verify active and historical records are read-only in component tests.
- [ ] Run module and full tests.
- [ ] Commit with `feat: add constitution governance`.

### Task 5: Constraint Library module

**Files:**
- Create: `src/features/constraints/constraint-list.tsx`
- Create: `src/features/constraints/constraint-form.tsx`
- Create: `src/features/constraints/constraint-detail.tsx`
- Create: `src/features/constraints/constraint-service.ts`
- Create: `src/features/constraints/constraint-export.ts`
- Test: `src/features/constraints/constraint-service.test.ts`
- Test: `src/features/constraints/constraint-export.test.ts`

- [ ] Write failing tests for combined filters, search, create/update/clone,
  activate/suspend/retire, and JSON/CSV export escaping.
- [ ] Implement the service, filters, export functions, and query hooks.
- [ ] Build the operating table, filter controls, PRD-complete form, detail
  view, and impact-warning lifecycle dialogs.
- [ ] Run module and full tests.
- [ ] Commit with `feat: add constraint library`.

### Task 6: Demo, accessibility, and production readiness

**Files:**
- Create: `src/features/demo/demo-page.tsx`
- Create: `src/components/empty-state.tsx`
- Create: `src/components/status-badge.tsx`
- Modify: `README.md`, `netlify.toml`, `src/styles.css`
- Test: `src/app/accessibility.test.tsx`

- [ ] Write failing smoke tests for seeded demo counts, semantic navigation,
  visible disclaimer, and keyboard-reachable primary actions.
- [ ] Implement the demo overview, reusable states, responsive rules, focus
  styles, centralized copy, and static-host refresh configuration.
- [ ] Run `npm.cmd test -- --run`, `npm.cmd run build`, and
  `npm.cmd run lint`.
- [ ] Manually verify `/demo`, `/constitutions`, and `/constraints` in the
  browser at desktop and mobile widths.
- [ ] Commit with `feat: complete sprint one demo`.

### Task 7: Final verification and publication

**Files:**
- Modify only files required by verified defects.

- [ ] Confirm `git status --short` contains only intended changes.
- [ ] Run the full test, lint, and production build commands from a clean state.
- [ ] Verify the production preview and direct route refresh.
- [ ] Review the diff against the design specification and PRD Sprint 0+1
  deliverables.
- [ ] Push `codex/sprint-0-1-foundation` and prepare it for integration.
