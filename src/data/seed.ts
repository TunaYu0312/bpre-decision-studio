import {
  constitutionRuleSchema,
  type ConstitutionRule,
} from "@/domain/constitution-rule";
import {
  constitutionSchema,
  type Constitution,
} from "@/domain/constitution";
import {
  constraintBlueprintSchema,
  type ConstraintBlueprint,
} from "@/domain/constraint-blueprint";
import {
  constraintSchema,
  type Constraint,
} from "@/domain/constraint";

import type { WorkspaceRepository } from "./repository";

const SEED_VERSION = 2;
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
      "Signature-product quality and value perception cannot be compromised for short-term traffic.",
    strategicStage: "Profit Repair",
    ruleType: "Non-Negotiable Red Line",
    applicableDecisionTypes: ["Promotion", "Pricing", "Menu"],
    relevantPillars: ["Brand"],
    escalationAuthority: "CEO",
    status: "Active",
    version: "1.0",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-product-quality-complexity",
    ruleId: "RULE-PR-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Product",
    name: "Quality and Complexity Discipline",
    principle:
      "Protect core quality while controlling food cost, complexity, and margin.",
    strategicStage: "Profit Repair",
    ruleType: "Strategic Guardrail",
    applicableDecisionTypes: ["Promotion", "Menu", "New Product"],
    relevantPillars: ["Product"],
    escalationAuthority: "COO",
    status: "Active",
    version: "1.0",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-operations-capacity",
    ruleId: "RULE-RR-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Restaurant/Retail",
    name: "Service Capacity Protection",
    principle:
      "Keep changes executable within peak capacity, service, labor, and availability limits.",
    strategicStage: "Profit Repair",
    ruleType: "Strategic Guardrail",
    applicableDecisionTypes: ["Generic", "Promotion", "Menu", "New Product"],
    relevantPillars: ["Restaurant/Retail"],
    escalationAuthority: "COO",
    status: "Active",
    version: "1.0",
    createdAt: CREATED_AT,
  },
  {
    id: "rule-economic-box",
    ruleId: "RULE-EB-001",
    constitutionVersionId: CONSTITUTION_ID,
    pillar: "Economic Box",
    name: "Economic Box Discipline",
    principle:
      "Require non-negative incremental EBITDA, explicit payback, and disciplined investment.",
    strategicStage: "Profit Repair",
    ruleType: "Non-Negotiable Red Line",
    applicableDecisionTypes: [
      "Generic",
      "Promotion",
      "Pricing",
      "New Product",
      "Store Network",
    ],
    relevantPillars: ["Economic Box"],
    escalationAuthority: "CFO",
    status: "Active",
    version: "1.0",
    createdAt: CREATED_AT,
  },
].map((rule) => constitutionRuleSchema.parse(rule));

export const seedConstraintBlueprints: ConstraintBlueprint[] = [
  {
    id: "blueprint-brand-discount",
    blueprintId: "BP-BR-001",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-brand-value-protection",
    pillar: "Brand",
    controlObjective: "Protect signature-product price perception",
    riskToAvoid:
      "Short-term traffic buying that weakens normal-price credibility.",
    metricKey: "discount_pct",
    thresholdSource:
      "Decision Constitution price-credibility principle and the demo management tolerance for standard promotions.",
    ruleType: "Adjustable Guardrail",
    evaluationOutcome: "Revise",
    exceptionAuthority: "CEO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-brand-signature-discount",
    blueprintId: "BP-BR-002",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-brand-value-protection",
    pillar: "Brand",
    controlObjective: "Prevent signature products from becoming discount bait",
    riskToAvoid:
      "Loss of signature-product value perception and customer trust.",
    metricKey: "signature_standalone_deep_discount",
    thresholdSource:
      "Decision Constitution non-negotiable protection of signature-product quality and value perception.",
    ruleType: "Hard Red Line",
    evaluationOutcome: "Escalate",
    exceptionAuthority: "CEO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-product-food-cost",
    blueprintId: "BP-PR-001",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-product-quality-complexity",
    pillar: "Product",
    controlObjective: "Protect pilot product margin without reducing quality",
    riskToAvoid: "A product proposition that cannot support the economic box.",
    metricKey: "food_cost_pct",
    thresholdSource:
      "Illustrative pilot unit-economics standard for the Profit Repair stage.",
    ruleType: "Adjustable Guardrail",
    evaluationOutcome: "Revise",
    exceptionAuthority: "CFO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-product-ingredient-complexity",
    blueprintId: "BP-PR-002",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-product-quality-complexity",
    pillar: "Product",
    controlObjective: "Keep new-product complexity operationally executable",
    riskToAvoid:
      "Supply-chain and store-execution failure caused by unnecessary ingredients.",
    metricKey: "new_ingredient_count",
    thresholdSource:
      "Illustrative store-execution limit requiring operations review above one new ingredient.",
    ruleType: "Approval Threshold",
    evaluationOutcome: "Escalate",
    exceptionAuthority: "COO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-restaurant-wait-time",
    blueprintId: "BP-RR-001",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-operations-capacity",
    pillar: "Restaurant/Retail",
    controlObjective: "Protect peak-period customer waiting time",
    riskToAvoid:
      "Commercial activity that materially degrades customer experience.",
    metricKey: "wait_time_increase_minutes",
    thresholdSource:
      "Customer-experience non-negotiable on wait-time degradation; the demo tolerance is one minute.",
    ruleType: "Adjustable Guardrail",
    evaluationOutcome: "Revise",
    exceptionAuthority: "COO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-restaurant-prep-time",
    blueprintId: "BP-RR-002",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-operations-capacity",
    pillar: "Restaurant/Retail",
    controlObjective: "Keep preparation changes within store capacity",
    riskToAvoid:
      "A product or promotion mechanic that overloads peak execution.",
    metricKey: "prep_time_increase_seconds",
    thresholdSource:
      "Illustrative peak-capacity preparation-time tolerance for the demo.",
    ruleType: "Adjustable Guardrail",
    evaluationOutcome: "Revise",
    exceptionAuthority: "COO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-economic-ebitda",
    blueprintId: "BP-EB-001",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-economic-box",
    pillar: "Economic Box",
    controlObjective: "Prevent value-destructive projects from approval",
    riskToAvoid:
      "Approval of a project with negative incremental operating profit.",
    metricKey: "incremental_ebitda",
    thresholdSource:
      "Decision Constitution economic boundary requiring non-negative incremental EBITDA.",
    ruleType: "Hard Red Line",
    evaluationOutcome: "Escalate",
    exceptionAuthority: "CEO",
    createdAt: CREATED_AT,
  },
  {
    id: "blueprint-economic-payback",
    blueprintId: "BP-EB-002",
    constitutionVersionId: CONSTITUTION_ID,
    parentArticleId: "rule-economic-box",
    pillar: "Economic Box",
    controlObjective: "Protect promotion investment velocity and cash discipline",
    riskToAvoid: "Capital tied up in promotions with slow or uncertain returns.",
    metricKey: "payback_months",
    thresholdSource:
      "Illustrative standard-promotion investment policy for the Profit Repair stage.",
    ruleType: "Adjustable Guardrail",
    evaluationOutcome: "Revise",
    exceptionAuthority: "CFO",
    createdAt: CREATED_AT,
  },
].map((blueprint) => constraintBlueprintSchema.parse(blueprint));

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
    constraintBlueprintId: "blueprint-brand-discount",
    derivationRationale:
      "The Article protects normal-price credibility; discount percentage is the direct measurable signal, and values above 20% require redesign.",
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
    constraintBlueprintId: "blueprint-brand-signature-discount",
    derivationRationale:
      "The Article makes signature-product value non-negotiable, so standalone deep discounting is represented as a prohibited boolean condition.",
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
    constraintBlueprintId: "blueprint-product-food-cost",
    derivationRationale:
      "The Article requires margin control without a quality reduction; pilot food-cost percentage tests whether the proposed recipe remains viable.",
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
    constraintBlueprintId: "blueprint-product-ingredient-complexity",
    derivationRationale:
      "Ingredient count is a practical proxy for supply and store complexity; more than one new ingredient requires operations approval.",
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
    constraintBlueprintId: "blueprint-restaurant-wait-time",
    derivationRationale:
      "The Article protects service capacity; incremental wait time measures the direct customer impact and must remain within one minute.",
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
    constraintBlueprintId: "blueprint-restaurant-prep-time",
    derivationRationale:
      "Preparation-time increase is a direct execution-capacity indicator; more than 15 seconds triggers redesign before rollout.",
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
    constraintBlueprintId: "blueprint-economic-ebitda",
    derivationRationale:
      "The Article explicitly requires non-negative incremental EBITDA, so zero is the atomic lower boundary and failure requires escalation.",
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
    constraintBlueprintId: "blueprint-economic-payback",
    derivationRationale:
      "The Article requires explicit payback and disciplined investment; three months is the demo standard for a routine promotion.",
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
    constraintBlueprints: seedConstraintBlueprints,
    constraints: seedConstraints,
  });
}
