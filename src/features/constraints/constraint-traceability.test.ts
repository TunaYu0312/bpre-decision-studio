import { describe, expect, it } from "vitest";

import {
  seedConstitutionRules,
  seedConstraintBlueprints,
  seedConstraints,
} from "@/data/seed";

import {
  resolveConstraintTraceability,
  TraceabilityError,
} from "./constraint-traceability";

describe("constraint traceability", () => {
  it("resolves an atomic constraint to its exact Article and blueprint", () => {
    const result = resolveConstraintTraceability(
      seedConstraints[0],
      seedConstitutionRules,
      seedConstraintBlueprints,
    );

    expect(result.article.principle).toBe(
      "Signature-product quality and value perception cannot be compromised for short-term traffic.",
    );
    expect(result.blueprint.metricKey).toBe(result.constraint.metricKey);
  });

  it("rejects a blueprint whose metric does not match the atomic constraint", () => {
    const mismatched = seedConstraintBlueprints.map((blueprint, index) =>
      index === 0
        ? { ...blueprint, metricKey: "different_metric" }
        : blueprint,
    );

    expect(() =>
      resolveConstraintTraceability(
        seedConstraints[0],
        seedConstitutionRules,
        mismatched,
      ),
    ).toThrow(TraceabilityError);
  });
});
