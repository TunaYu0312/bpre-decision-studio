# BPR&E Menu Pricing Decision Studio

A focused decision workspace for menu pricing and price-adjustment decisions in
chain restaurant businesses.

The Phase 1 product has been reset from a generic decision system to one
practical workflow: baseline menu economics, Price Sensitivity Study, elasticity
and substitution assumptions, price scenarios, product-mix and gross-profit
forecast, customer-value risk, human decision, and pilot review.

The current application is the earlier general-decision prototype and will be
progressively replaced by the pricing MVP. The implementation baseline is
[docs/BPRE_Menu_Pricing_Decision_MVP_PRD.md](docs/BPRE_Menu_Pricing_Decision_MVP_PRD.md).

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
