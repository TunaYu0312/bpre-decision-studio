import { describe, expect, it } from "vitest";

import { seedConstraints } from "@/data/seed";

import { constraintsToCsv, constraintsToJson } from "./constraint-export";

describe("Constraint export", () => {
  it("exports valid workspace JSON", () => {
    const output = constraintsToJson(seedConstraints.slice(0, 2));
    const parsed = JSON.parse(output);

    expect(parsed.exportType).toBe("bpre-constraints");
    expect(parsed.records).toHaveLength(2);
  });

  it("escapes commas, quotes, and line breaks in CSV values", () => {
    const output = constraintsToCsv([
      {
        ...seedConstraints[0],
        name: 'Discount, "brand"\nlimit',
      },
    ]);

    expect(output).toContain('"Discount, ""brand""\nlimit"');
    expect(output.split("\n")[0]).toContain("Constraint ID");
  });
});
