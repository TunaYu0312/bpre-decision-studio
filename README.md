# BPR&E Decision Meeting Studio

A local-first, meeting-first decision workspace for high-value retail and
restaurant business decisions.

It is not a generic BI dashboard, approval workflow, rule repository, or AI
decision-maker. Its Phase 1 goal is to help a real chain retail / restaurant
decision meeting move from Decision Project to Data Facts, Recommendation,
Human Decision, Action Plan, and Review.

The current demo uses one Promotion Decision scenario and makes the lightweight
Company Decision Operating Profile visible so the BPR&E framework adapts to the
company's strategic stage, risk posture, evidence standard, and meeting habits.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/home` or the executive meeting view at
`http://localhost:5173/decisions/decision-breakfast-combo-pilot/meeting`.

The detailed owner workbench remains available at
`http://localhost:5173/decisions/decision-breakfast-combo-pilot`.

## Quality checks

```bash
npm test -- --run
npm run lint
npm run build
```

## Deployment

The application builds to `dist/` and includes a Netlify rewrite so React
Router URLs such as `/demo` and `/constitutions` work after a direct refresh.

No private API key is required. Phase 1 data remains in browser IndexedDB.

## Implemented modules

- Public demo workspace and decision-meeting navigation
- Full-screen five-page Meeting Mode for executive decision meetings
- Separate Workspace Mode for owner / data / execution preparation
- Company Decision Operating Profile attached to the Decision Project
- Promotion Decision Template attached to the meeting workspace
- Versioned Decision Constitutions
- Constraint Library with filters, lifecycle actions, and JSON/CSV export
- Idempotent anonymized seed data

See [docs/architecture.md](docs/architecture.md) for domain and storage
boundaries.
