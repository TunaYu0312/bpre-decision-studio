import {
  constitutionRuleSchema,
  type ConstitutionRule,
} from "@/domain/constitution-rule";
import {
  constitutionSchema,
  type Constitution,
} from "@/domain/constitution";
import {
  constraintSchema,
  type Constraint,
} from "@/domain/constraint";

import type { WorkspaceRepository } from "./repository";

const SEED_VERSION = 1;
const CREATED_AT = "2026-01-01T00:00:00.000Z";
const CONSTITUTION_ID = "constitution-profit-repair-2026-v1";

export const seedConstitution: Constitution = constitutionSchema.parse({
  id: CONSTITUTION_ID,
  constitutionId: "CONST-PR-2026",
  version: "1.0",
  title: "Profit Repair 2026",
  scope: "Company",
  scopeValue: "Illustrative Chain Business",
  businessUnitMarket: "Company-wide",
  strategicStage: "Profit Repair",
  effectiveDate: "2026-01-01",
  reviewDate: "2026-12-15",
  status: "Active",
  executiveOwner: "CEO",
  maintainer: "Decision System Team",
  primaryStrategicPriority:
    "Restore durable store-level profitability while protecting customer trust.",
  primaryNorthStarMetric: "Store-level EBITDA",
  supportingMetrics: [
    "Gross profit dollars",
    "Repeat visit rate",
    "Average wait time",
  ],
  acceptableTradeOffs: [
    "Slower expansion in exchange for stronger unit economics.",
  ],
  nonNegotiableTradeOffs: [
    "Signature-product quality and value perception cannot be compromised for short-term traffic.",
    "Customer experience cannot be materially degraded to reduce costs.",
    "Major projects require explicit ROI, payback, and exit logic.",
  ],
  ceoEscalationThresholds: [
    "Exception to signature-product pricing or quality.",
    "Negative incremental EBITDA beyond the agreed review horizon.",
    "Capital investment above the delegated threshold.",
  ],
  priorityTargetCustomers: [
    "Core frequency customers",
    "Value-conscious quality seekers",
  ],
  priorityJourneyMoments: [
    "Morning visit",
    "Lunch decision",
    "Peak-period service",
  ],
  customerProblemsToSolve: [
    "Reliable quality at a credible price.",
    "Fast service without product compromise.",
  ],
  customerExperienceNonNegotiables: [
    "Core product quality standards remain unchanged.",
    "Wait time cannot materially degrade.",
  ],
  boundaries: {
    brand:
      "Protect the customer promise, trust, signature-product value, and price perception.",
    product:
      "Protect core quality while controlling food cost, complexity, and margin.",
    restaurantRetail:
      "Keep changes executable within peak capacity, service, labor, and availability limits.",
    economicBox:
      "Require non-negative incremental EBITDA, explicit payback, and disciplined investment.",
  },
  decisionRights:
    "Functional leaders propose; COO and CFO test feasibility; CEO owns protected strategic exceptions.",
  ceoEscalationConditions:
    "Protected brand or quality rule exceptions, material negative EBITDA, or capex above threshold.",
  annualReviewCadence: "Annual, with quarterly operating review",
  exceptionalUpdateTriggers:
    "Material strategy, customer, market, regulatory, or economic-box change.",
  changeNotes: "Initial illustrative Constitution for the public demo.",
  activatedAt: CREATED_AT,
  createdAt: CREATED_AT,
  updatedAt: CREATED_AT,
});

export const seedConstitutionRules: ConstitutionRule[] = [
  {
    id: "rule-brand-value-protection",
    ruleId: "RULE-BR-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Brand",
    name: "Brand Value Protection",
    principle:
      "Signature products cannot be used to buy short-term traffic at the expense of trust and value perception.",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-product-quality-complexity",
    ruleId: "RULE-PR-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Product",
    name: "Quality and Complexity Discipline",
    principle:
      "Core quality is protected and product complexity must remain executable.",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-operations-capacity",
    ruleId: "RULE-RR-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Restaurant/Retail",
    name: "Service Capacity Protection",
    principle:
      "Commercial activity must remain executable without material service degradation.",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-economic-box",
    ruleId: "RULE-EB-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Economic Box",
    name: "Economic Box Discipline",
    principle:
      "Every material project requires a credible profit, payback, and exit logic.",
    createdAt: CREATED_AT,
  },
].map((rule) => constitutionRuleSchema.parse(rule));

function seededConstraint(
  record: Omit<
    Constraint,
    | "status"
    | "constitutionVersionId"
    | "effectiveDate"
    | "reviewFrequency"
    | "createdAt"
    | "updatedAt"
    | "version"
  >,
): Constraint {
  return constraintSchema.parse({
    ...record,
    version: "1.0",
    status: "Active",
    constitutionVersionId: CONSTITUTION_ID,
    effectiveDate: "2026-01-01",
    reviewFrequency: "Per project",
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  });
}

export const seedConstraints: Constraint[] = [
  seededConstraint({
    id: "constraint-brand-discount-limit",
    constraintId: "BR-PR-001",
    constitutionRuleId: "rule-brand-value-protection",
    pillar: "Brand",
    constraintType: "Adjustable Guardrail",
    name: "Promotion discount must not exceed 20%",
    description: "Protect customer price perception and long-term brand value.",
    scope: "Company",
    applicableDecisionTypes: ["Promotion", "Pricing"],
    metricKey: "discount_pct",
    dataType: "Percentage",
    operator: "<=",
    thresholdValue: 20,
    unit: "%",
    severity: "High",
    outcomeIfFailed: "Revise",
    escalationRole: "Functional Leader",
    exceptionPolicy: "CEO only",
    requiredEvidence: "Proposed discount percentage and price architecture.",
    changeNotes: "Initial brand guardrail.",
  }),
  seededConstraint({
    id: "constraint-brand-signature-discount",
    constraintId: "BR-PR-002",
    constitutionRuleId: "rule-brand-value-protection",
    pillar: "Brand",
    constraintType: "Hard Red Line",
    name: "No standalone deep discount on signature products",
    description:
      "Signature products cannot be standalone traffic drivers through deep discounting.",
    scope: "Company",
    applicableDecisionTypes: ["Promotion"],
    metricKey: "signature_standalone_deep_discount",
    dataType: "Boolean",
    operator: "=",
    thresholdValue: false,
    unit: "boolean",
    severity: "Critical",
    outcomeIfFailed: "Escalate",
    escalationRole: "CEO",
    exceptionPolicy: "CEO only",
    requiredEvidence: "Promotion mechanics and signature-product role.",
    changeNotes: "Initial protected brand rule.",
  }),
  seededConstraint({
    id: "constraint-product-food-cost",
    constraintId: "PR-PR-001",
    constitutionRuleId: "rule-product-quality-complexity",
    pillar: "Product",
    constraintType: "Adjustable Guardrail",
    name: "Pilot food cost must not exceed 35%",
    description: "Protect product economics during pilot design.",
    scope: "Company",
    applicableDecisionTypes: ["Promotion", "New Product", "Menu"],
    metricKey: "food_cost_pct",
    dataType: "Percentage",
    operator: "<=",
    thresholdValue: 35,
    unit: "%",
    severity: "High",
    outcomeIfFailed: "Revise",
    escalationRole: "CFO",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Recipe cost and forecast product mix.",
    changeNotes: "Initial product margin guardrail.",
  }),
  seededConstraint({
    id: "constraint-product-ingredient-complexity",
    constraintId: "PR-PR-002",
    constitutionRuleId: "rule-product-quality-complexity",
    pillar: "Product",
    constraintType: "Approval Threshold",
    name: "No more than one new ingredient without operations review",
    description: "Limit complexity and supply-chain exposure during pilots.",
    scope: "Company",
    applicableDecisionTypes: ["New Product", "Menu"],
    metricKey: "new_ingredient_count",
    dataType: "Number",
    operator: "<=",
    thresholdValue: 1,
    unit: "count",
    severity: "Medium",
    outcomeIfFailed: "Escalate",
    escalationRole: "COO",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Ingredient list and operational trial evidence.",
    changeNotes: "Initial complexity threshold.",
  }),
  seededConstraint({
    id: "constraint-restaurant-wait-time",
    constraintId: "RR-PR-001",
    constitutionRuleId: "rule-operations-capacity",
    pillar: "Restaurant/Retail",
    constraintType: "Adjustable Guardrail",
    name: "Wait-time increase must not exceed one minute",
    description: "Protect peak-period customer experience.",
    scope: "Company",
    applicableDecisionTypes: ["Generic", "Promotion", "New Product", "Menu"],
    metricKey: "wait_time_increase_minutes",
    dataType: "Number",
    operator: "<=",
    thresholdValue: 1,
    unit: "minutes",
    severity: "High",
    outcomeIfFailed: "Revise",
    escalationRole: "COO",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Peak-period operations simulation or pilot result.",
    changeNotes: "Initial service guardrail.",
  }),
  seededConstraint({
    id: "constraint-restaurant-prep-time",
    constraintId: "RR-PR-002",
    constitutionRuleId: "rule-operations-capacity",
    pillar: "Restaurant/Retail",
    constraintType: "Adjustable Guardrail",
    name: "Preparation-time increase must not exceed 15 seconds",
    description: "Keep product changes within store execution capacity.",
    scope: "Company",
    applicableDecisionTypes: ["New Product", "Menu", "Promotion"],
    metricKey: "prep_time_increase_seconds",
    dataType: "Number",
    operator: "<=",
    thresholdValue: 15,
    unit: "seconds",
    severity: "Medium",
    outcomeIfFailed: "Revise",
    escalationRole: "COO",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Timed preparation test.",
    changeNotes: "Initial preparation-time guardrail.",
  }),
  seededConstraint({
    id: "constraint-economic-ebitda",
    constraintId: "EB-PR-001",
    constitutionRuleId: "rule-economic-box",
    pillar: "Economic Box",
    constraintType: "Hard Red Line",
    name: "Incremental EBITDA must be non-negative",
    description:
      "Projects require non-negative incremental EBITDA in the agreed review horizon.",
    scope: "Company",
    applicableDecisionTypes: ["Generic", "Promotion", "Pricing", "New Product"],
    metricKey: "incremental_ebitda",
    dataType: "Currency",
    operator: ">=",
    thresholdValue: 0,
    unit: "currency",
    severity: "Critical",
    outcomeIfFailed: "Escalate",
    escalationRole: "CFO",
    exceptionPolicy: "CEO only",
    requiredEvidence: "Incremental P&L with review horizon.",
    changeNotes: "Initial profitability red line.",
  }),
  seededConstraint({
    id: "constraint-economic-payback",
    constraintId: "EB-PR-002",
    constitutionRuleId: "rule-economic-box",
    pillar: "Economic Box",
    constraintType: "Adjustable Guardrail",
    name: "Standard promotion payback must not exceed three months",
    description: "Protect cash discipline and investment velocity.",
    scope: "Company",
    applicableDecisionTypes: ["Promotion"],
    metricKey: "payback_months",
    dataType: "Number",
    operator: "<=",
    thresholdValue: 3,
    unit: "months",
    severity: "High",
    outcomeIfFailed: "Revise",
    escalationRole: "CFO",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Investment amount and monthly benefit forecast.",
    changeNotes: "Initial payback guardrail.",
  }),
];

export async function loadSeedData(
  repository: WorkspaceRepository,
): Promise<boolean> {
  return repository.seedWorkspaceIfNeeded(SEED_VERSION, {
    constitutions: [seedConstitution],
    constitutionRules: seedConstitutionRules,
    constraints: seedConstraints,
  });
}
