import { describe, expect, it } from "vitest";

import { calculateBaselineEconomics } from "./pricing";

describe("pricing baseline economics", () => {
  it("calculates UPH, mix, sales, gross profit, and gross margin", () => {
    const result = calculateBaselineEconomics(
      [
        {
          id: "item-a",
          name: "Item A",
          category: "Breakfast",
          role: "Signature",
          listPrice: 20,
          netRealizedPrice: 18,
          unitVariableCost: 6,
          units: 600,
          evidenceQuality: "Observed",
          source: "POS",
        },
        {
          id: "item-b",
          name: "Item B",
          category: "Beverage",
          role: "Profit builder",
          listPrice: 10,
          netRealizedPrice: 10,
          unitVariableCost: 2,
          units: 400,
          evidenceQuality: "Observed",
          source: "POS",
        },
      ],
      2_000,
    );

    expect(result.totalUnits).toBe(1_000);
    expect(result.totalUph).toBe(50);
    expect(result.netSales).toBe(14_800);
    expect(result.grossProfit).toBe(10_400);
    expect(result.grossMargin).toBeCloseTo(0.7027, 4);
    expect(result.items[0]).toMatchObject({
      uph: 30,
      netSales: 10_800,
      grossProfit: 7_200,
    });
    expect(result.items[0].salesMix).toBeCloseTo(10_800 / 14_800, 6);
    expect(
      result.items.reduce((sum, item) => sum + item.salesMix, 0),
    ).toBeCloseTo(1, 6);
  });

  it("rejects an undefined UPH denominator", () => {
    expect(() => calculateBaselineEconomics([], 0)).toThrow(
      "Eligible transactions must be greater than zero.",
    );
  });
});
