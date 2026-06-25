import { describe, expect, it } from "vitest";

import {
  constitutionSchema,
  type Constitution,
} from "./constitution";
import { constraintSchema, type Constraint } from "./constraint";
import {
  activateConstitution,
  assertConstitutionEditable,
  cloneConstitution,
  invalidateConstitution,
  transitionConstraint,
} from "./lifecycle";

const NOW = "2026-06-24T12:00:00.000Z";

function constitution(
  overrides: Partial<Constitution> = {},
): Constitution {
  return constitutionSchema.parse({
    id: "constitution-profit-repair-1-0",
    constitutionId: "CONST-PR-2026",
    version: "1.0",
    title: "Profit Repair 2026",
    scope: "Company",
    scopeValue: "Demo Company",
    businessUnitMarket: "Company-wide",
    strategicStage: "Profit Repair",
    effectiveDate: "2026-01-01",
    reviewDate: "2026-12-31",
    status: "Draft",
    executiveOwner: "CEO",
    maintainer: "Decision System Team",
    primaryStrategicPriority: "Restore store-level profitability",
    primaryNorthStarMetric: "Store-level EBITDA",
    supportingMetrics: ["Gross profit dollars"],
    acceptableTradeOffs: ["Slower expansion for stronger unit economics"],
    nonNegotiableTradeOffs: ["Do not compromise signature product value"],
    ceoEscalationThresholds: ["Negative incremental EBITDA"],
    priorityTargetCustomers: ["Core breakfast customers"],
    priorityJourneyMoments: ["Morning visit"],
    customerProblemsToSolve: ["Affordable quality"],
    customerExperienceNonNegotiables: ["No material wait-time degradation"],
    boundaries: {
      brand: "Protect trust, value perception, and customer promise.",
      product: "Protect quality and margin discipline.",
      restaurantRetail: "Protect service capacity and availability.",
      economicBox: "Require explicit ROI, payback, and exit logic.",
    },
    decisionRights: "CEO approves strategic exceptions.",
    ceoEscalationConditions: "Escalate protected-rule exceptions.",
    annualReviewCadence: "Annual",
    exceptionalUpdateTriggers: "Material strategy or market change",
    changeNotes: "Initial version",
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

function constraint(overrides: Partial<Constraint> = {}): Constraint {
  return constraintSchema.parse({
    id: "constraint-brand-discount-1",
    constraintId: "BR-PR-001",
    version: "1.0",
    status: "Draft",
    constitutionVersionId: "constitution-profit-repair-1-0",
    constitutionRuleId: "rule-brand-value",
    constraintBlueprintId: "blueprint-brand-discount",
    derivationRationale:
      "Discount percentage operationalizes the protected price-perception principle.",
    pillar: "Brand",
    constraintType: "Adjustable Guardrail",
    name: "Promotion discount limit",
    description: "Protect price perception.",
    scope: "Company",
    applicableDecisionTypes: ["Promotion"],
    metricKey: "discount_pct",
    dataType: "Percentage",
    operator: "<=",
    thresholdValue: 20,
    unit: "%",
    severity: "High",
    outcomeIfFailed: "Revise",
    escalationRole: "Functional Leader",
    exceptionPolicy: "Allowed",
    requiredEvidence: "Forecast discount percentage",
    effectiveDate: "2026-01-01",
    reviewFrequency: "Per project",
    changeNotes: "Initial constraint",
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

describe("Constitution lifecycle", () => {
  it("clones a Constitution into the next Draft version", () => {
    const source = constitution({ status: "Active" });

    const cloned = cloneConstitution(source, {
      id: "constitution-profit-repair-1-1",
      now: NOW,
      changeNotes: "Clarify acceptable trade-off",
    });

    expect(cloned).toMatchObject({
      id: "constitution-profit-repair-1-1",
      version: "1.1",
      status: "Draft",
      supersedesId: source.id,
      changeNotes: "Clarify acceptable trade-off",
    });
    expect(cloned.activatedAt).toBeUndefined();
  });

  it("activates a Draft and supersedes only the active matching scope", () => {
    const previous = constitution({
      id: "old",
      status: "Active",
      activatedAt: "2026-01-01T00:00:00.000Z",
    });
    const otherScope = constitution({
      id: "other",
      status: "Active",
      scope: "Brand",
      scopeValue: "Other Brand",
    });
    const draft = constitution({
      id: "new",
      version: "1.1",
      supersedesId: "old",
    });

    const result = activateConstitution(
      [previous, otherScope, draft],
      draft.id,
      NOW,
    );

    expect(result.find((item) => item.id === "old")?.status).toBe("Superseded");
    expect(result.find((item) => item.id === "new")).toMatchObject({
      status: "Active",
      activatedAt: NOW,
    });
    expect(result.find((item) => item.id === "other")?.status).toBe("Active");
  });

  it("rejects editing an Active Constitution in place", () => {
    expect(() =>
      assertConstitutionEditable(constitution({ status: "Active" })),
    ).toThrow("Clone this version");
  });

  it("requires governance fields before invalidation", () => {
    const source = constitution({ status: "Active" });

    expect(() =>
      invalidateConstitution(source, {
        reason: "",
        effectiveEndDate: "",
        executiveOwner: "",
        now: NOW,
      }),
    ).toThrow("reason");
  });
});

describe("Constraint schema and lifecycle", () => {
  it.each([
    ["numeric", { dataType: "Percentage", operator: "<=", thresholdValue: 20 }],
    ["boolean", { dataType: "Boolean", operator: "=", thresholdValue: true }],
    [
      "enum",
      {
        dataType: "Enum",
        operator: "IN",
        thresholdValue: ["A", "B"] as string[],
      },
    ],
    [
      "required information",
      { dataType: "Text", operator: "REQUIRED", thresholdValue: null },
    ],
  ] as const)("accepts a valid %s threshold", (_label, threshold) => {
    expect(
      constraintSchema.safeParse(constraint({ ...threshold })).success,
    ).toBe(true);
  });

  it("rejects a non-numeric threshold for a Percentage constraint", () => {
    const result = constraintSchema.safeParse({
      ...constraint(),
      thresholdValue: "twenty",
    });

    expect(result.success).toBe(false);
  });

  it("permits only defined Constraint lifecycle transitions", () => {
    const active = transitionConstraint(constraint(), "Active", NOW);
    const suspended = transitionConstraint(active, "Suspended", NOW);
    const retired = transitionConstraint(suspended, "Retired", NOW);

    expect(active.status).toBe("Active");
    expect(suspended.status).toBe("Suspended");
    expect(retired.status).toBe("Retired");
    expect(() => transitionConstraint(retired, "Draft", NOW)).toThrow(
      "Cannot transition",
    );
  });
});
