# Menu Pricing Decision Room MVP — Implementation Baseline

This document maps the first interactive prototype to Chapter 8 and Chapter 21
of `Menu_Pricing_Decision_Room_MVP_PRD_v1.0.md`.

## Product boundary

The prototype is intentionally focused on one decision: whether and how to move
Combo A from RMB 28 to RMB 30. It is a meeting workspace, not a generic BI
dashboard or an automated pricing engine. The system structures evidence,
options, operating risks, the human decision, and the follow-up plan. It does
not make or publish the price decision.

## Five-page meeting flow

| Page | Meeting question | Implemented capability |
| --- | --- | --- |
| Current Decision | What exactly must be decided? | Decision statement, six-part scope, missing-field prompt, out-of-scope boundary, guardrails |
| Common Facts | What is known, estimated, assumed, or missing? | Traceable fact cards, evidence status, district/customer/store filters, operations and competitor context |
| Options & Trade-off | What do we gain and give up? | No-action baseline plus A/B/C/D, contribution bridge, district matrix, explicit trade-offs |
| Questions & Evidence Queue | What still needs to be proved? | Management-view classification, owner/status queue, operations scenario run, mandatory human confirmation before writeback |
| Decision, Execution & Review | What are we committing to? | Five decision outcomes, 30-store pilot, rationale, objections, action owners, review gates, stop/rollback rules, version freeze and meeting-note export |

The room uses a persistent command header, a left-side meeting flow, a
collaboration rail, and a bottom decision bar. Detailed evidence is disclosed by
stage instead of being shown as one long report.

## Acceptance scenario coverage

1. The seed case starts with Combo A at RMB 28 and evaluates RMB 30.
2. The Current Decision page flags an incomplete customer guardrail.
3. The structured statement fixes purpose, range, stores, period, and decision
   maker.
4. The prototype provides common facts, known gaps, a no-action baseline, and
   four candidate strategies.
5. The Common Facts and Options pages expose office, community, and transit
   differences.
6. The operations view records peak labor and waste as an assumption.
7. The view is added to the evidence queue rather than silently converted into
   fact.
8. A preset operating scenario can be run from the queue.
9. Only a human confirmation updates options B and D. Option D moves from RMB
   238k to RMB 208k monthly net incremental contribution after RMB 18k labor and
   RMB 12k waste costs are included.
10. The brand view records community-customer value risk.
11. The district matrix makes the community guardrail and differentiated action
    visible.
12. The selected recommendation is a 30-store office/transit pilot.
13. The final page provides scope, control-store intent, owners, success
    criteria, stop rules, and rollback logic.
14. The meeting can freeze a version.
15. Meeting minutes and action items can be exported as Markdown; the browser
    print flow supports Save as PDF.
16. Review gates and assumption-versus-actual comparison fields are represented;
    live post-pilot data ingestion remains a subsequent implementation step.

## Calculation baseline

Net incremental contribution is calculated as:

```text
Incremental revenue
- ingredient cost
- active labor cost
- waste cost
- packaging and channel cost
- rework and refund cost
- displaced contribution
- other operating cost
```

This prototype deliberately separates gross margin improvement from real store
operating contribution. Every non-observed input must remain labelled as an
estimate, assumption, or missing evidence.

## MVP limitations

- Data is currently a deterministic demonstration dataset, not imported POS,
  research, labor-scheduling, or finance data.
- The operating scenario is a transparent preset, not an AI-generated forecast.
- Version freeze and export are browser-side demonstrations; production audit
  storage, permissions, approvals, and price publishing are not yet connected.
- PDF export currently relies on the browser print dialog.

These limits preserve the PRD's AI boundary: the system may structure,
calculate, classify, and draft, but a named human must confirm evidence and own
the final decision.
