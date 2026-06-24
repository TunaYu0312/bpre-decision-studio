# BPR&E Decision Studio

A local-first decision governance application for high-value business decisions
in chain retail and restaurant businesses.

## Development

```bash
npm install
npm run dev
```

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
