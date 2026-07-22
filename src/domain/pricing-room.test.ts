import { describe, expect, it } from "vitest";

import { seedPricingDecisionRoom } from "@/data/pricing-room-seed";

import {
  calculateNetIncrementalContribution,
  calculateScenarioAfterOperationsReview,
} from "./pricing-room";

describe("pricing decision room economics", () => {
  it("deducts every operating cost from incremental revenue", () => {
    const scenario = seedPricingDecisionRoom.scenarios.find(
      (item) => item.id === "option-d",
    )!;

    expect(calculateNetIncrementalContribution(scenario.breakdown)).toBe(
      238_000,
    );
  });

  it("updates net contribution only after the operations result is confirmed", () => {
    const scenario = seedPricingDecisionRoom.scenarios.find(
      (item) => item.id === "option-d",
    )!;

    expect(calculateScenarioAfterOperationsReview(scenario, false)).toBe(
      238_000,
    );
    expect(calculateScenarioAfterOperationsReview(scenario, true)).toBe(
      208_000,
    );
  });
});
