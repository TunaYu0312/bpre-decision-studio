import type {
  MenuAnalysisSlice,
  PriceResponseSignal,
  PriceResponseCurve,
  PricingProject,
  PricingScenario,
} from "@/domain/pricing";

export const seedPricingProject: PricingProject = {
  id: "pricing-core-menu-2026",
  projectCode: "PR-2026-001",
  title: "2026 Core Menu Price Review",
  decisionType: "Existing menu price adjustment",
  objective: "Margin recovery",
  decisionQuestion:
    "Which existing menu prices should change to improve gross profit dollars while protecting traffic and entry-price value?",
  pricingPrinciples: [
    "Use targeted, low-perception changes rather than an across-the-board increase.",
    "Protect the entry price and signature bundle unless value research supports a change.",
    "Judge options on gross profit dollars and EBITDA, not gross-margin percentage alone.",
    "Pilot when traffic, UPH, or cannibalization assumptions are not observed.",
  ],
  scope: "Shanghai · Company-owned stores · Dine-in & takeaway",
  owner: "Commercial Director",
  stage: "Scenario design",
  baselinePeriod: "2026-03-30 to 2026-06-28 · 13 weeks",
  referencePeriod: "Comparable 13-week period, seasonality adjusted",
  eligibleTransactionDefinition:
    "All completed dine-in and takeaway transactions in the selected stores",
  transactions: 100_000,
  periodDays: 91,
  storeCount: 10,
  dataGrain: "Multi-store aggregate",
  affectedItems: 8,
  proposedEffectiveDate: "2026-09-01",
  dataReadiness: "Verified baseline",
  researchStatus: "Results available",
  items: [
    {
      id: "signature-breakfast-set",
      name: "Signature Breakfast Set",
      category: "Breakfast sets",
      role: "Signature",
      listPrice: 34,
      netRealizedPrice: 32.8,
      unitVariableCost: 10.4,
      units: 28_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "egg-sausage-muffin",
      name: "Egg & Sausage Muffin",
      category: "Breakfast mains",
      role: "Traffic driver",
      listPrice: 19,
      netRealizedPrice: 18.4,
      unitVariableCost: 5.6,
      units: 22_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "chicken-muffin",
      name: "Chicken Muffin",
      category: "Breakfast mains",
      role: "Premium",
      listPrice: 22,
      netRealizedPrice: 21.3,
      unitVariableCost: 7.2,
      units: 15_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "hash-brown",
      name: "Hash Brown",
      category: "Sides",
      role: "Add-on",
      listPrice: 10,
      netRealizedPrice: 9.6,
      unitVariableCost: 2.5,
      units: 30_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "americano",
      name: "Americano",
      category: "Beverages",
      role: "Entry price",
      listPrice: 14,
      netRealizedPrice: 13.5,
      unitVariableCost: 2.1,
      units: 38_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "latte",
      name: "Latte",
      category: "Beverages",
      role: "Profit builder",
      listPrice: 20,
      netRealizedPrice: 19.2,
      unitVariableCost: 4.8,
      units: 27_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "orange-juice",
      name: "Orange Juice",
      category: "Beverages",
      role: "Premium",
      listPrice: 16,
      netRealizedPrice: 15.4,
      unitVariableCost: 5.2,
      units: 9_000,
      evidenceQuality: "Observed",
      source: "POS item sales + Finance item cost",
    },
    {
      id: "breakfast-upgrade",
      name: "Breakfast Beverage Upgrade",
      category: "Modifiers",
      role: "Profit builder",
      listPrice: 8,
      netRealizedPrice: 7.5,
      unitVariableCost: 2.2,
      units: 12_000,
      evidenceQuality: "Observed",
      source: "POS modifier sales + Finance item cost",
    },
  ],
};

export const seedPricingProjects = [seedPricingProject];

export const seedMenuAnalysisSlices: MenuAnalysisSlice[] = [
  {
    id: "all-day",
    label: "All day",
    timeWindow: "All trading hours",
    transactions: seedPricingProject.transactions,
    items: seedPricingProject.items,
    source: "Illustrative item-level POS aggregate",
  },
  buildSlice(
    "breakfast",
    "Breakfast",
    "06:00–10:30",
    48_000,
    [0.9, 0.92, 0.88, 0.74, 0.5, 0.43, 0.48, 0.88],
  ),
  buildSlice(
    "lunch",
    "Lunch",
    "10:30–14:00",
    30_000,
    [0.08, 0.06, 0.08, 0.18, 0.28, 0.34, 0.27, 0.08],
  ),
  buildSlice(
    "afternoon-evening",
    "Afternoon & evening",
    "14:00–close",
    22_000,
    [0.02, 0.02, 0.04, 0.08, 0.22, 0.23, 0.25, 0.04],
  ),
];

export const seedPriceResponseSignals: PriceResponseSignal[] = [
  priceSignal("signature-breakfast-set", 31, 36, 35, 103),
  priceSignal("egg-sausage-muffin", 18, 21, 20, 101),
  priceSignal("americano", 12, 15, 15, 106),
  priceSignal("latte", 19, 23, 22, 100),
];

export const seedPriceResponseCurves: PriceResponseCurve[] = [
  responseCurve("signature-breakfast-set", [
    [30, 112, 78, 110],
    [32, 108, 74, 106],
    [34, 100, 68, 100],
    [35, 91, 59, 94],
    [36, 78, 48, 87],
    [38, 62, 35, 76],
  ]),
  responseCurve("egg-sausage-muffin", [
    [17, 111, 81, 109],
    [18, 106, 77, 105],
    [19, 100, 71, 100],
    [20, 91, 62, 95],
    [21, 76, 49, 86],
    [22, 64, 39, 79],
  ]),
  responseCurve("americano", [
    [12, 114, 84, 112],
    [13, 108, 80, 106],
    [14, 100, 73, 100],
    [15, 86, 61, 91],
    [16, 69, 45, 80],
    [17, 57, 34, 71],
  ]),
  responseCurve("latte", [
    [18, 111, 80, 108],
    [19, 106, 76, 104],
    [20, 100, 70, 100],
    [21, 95, 65, 96],
    [22, 87, 56, 90],
    [23, 73, 44, 82],
  ]),
];

export const seedPricingScenarios: PricingScenario[] = [
  {
    id: "option-a",
    name: "Option A · Targeted gradual increase",
    strategy:
      "Protect signature and entry-price anchors; increase premium, add-on, and profit-builder items selectively.",
    trafficChange: -0.005,
    incrementalOperatingCost: 20_000,
    valueForMoneyIndex: 99,
    brandRisk: "Low",
    isRecommended: true,
    items: [
      scenarioItem("signature-breakfast-set", 34, 28, "Hold the signature bundle.", "No expected switching."),
      scenarioItem("egg-sausage-muffin", 20, 21.5, "Small increase below the stated break point.", "0.3 UPH shifts to the protected bundle."),
      scenarioItem("chicken-muffin", 23, 14.6, "Modest premium-item increase.", "0.2 UPH shifts to Egg & Sausage Muffin."),
      scenarioItem("hash-brown", 11, 28.8, "Add-on increase with lower ticket salience.", "Attach-rate loss is embedded in forecast UPH."),
      scenarioItem("americano", 14, 38, "Protect entry-price accessibility.", "No expected switching."),
      scenarioItem("latte", 21, 26, "Remain below the stated value break point.", "0.4 UPH shifts to Americano."),
      scenarioItem("orange-juice", 17, 8.6, "Premium beverage increase.", "0.2 UPH shifts to coffee."),
      scenarioItem("breakfast-upgrade", 9, 11.4, "Modifier price increase.", "Attach-rate loss is embedded in forecast UPH."),
    ],
  },
  {
    id: "option-b",
    name: "Option B · One-step broad reset",
    strategy:
      "Increase most menu prices in one wave to maximize near-term contribution margin.",
    trafficChange: -0.025,
    incrementalOperatingCost: 12_000,
    valueForMoneyIndex: 94,
    brandRisk: "High",
    items: [
      scenarioItem("signature-breakfast-set", 36, 25.8, "Reach the upper acceptable range.", "Demand partly shifts to lower-priced mains."),
      scenarioItem("egg-sausage-muffin", 20, 20.8, "Broad price reset.", "Limited lower-price substitute remains."),
      scenarioItem("chicken-muffin", 23, 14, "Broad price reset.", "0.4 UPH shifts to Egg & Sausage Muffin."),
      scenarioItem("hash-brown", 11, 27.5, "Broad price reset.", "Attach-rate loss is embedded in forecast UPH."),
      scenarioItem("americano", 15, 35, "Reach the stated value break point.", "Some demand leaves the beverage category."),
      scenarioItem("latte", 21, 25.4, "Broad price reset.", "0.6 UPH shifts to Americano."),
      scenarioItem("orange-juice", 17, 8.3, "Broad price reset.", "0.3 UPH shifts to coffee."),
      scenarioItem("breakfast-upgrade", 9, 10.8, "Broad price reset.", "Attach-rate loss is embedded in forecast UPH."),
    ],
  },
  {
    id: "option-c",
    name: "Option C · Restore value architecture",
    strategy:
      "Lower visible entry and bundle prices to support traffic, funded by larger premium and modifier increases.",
    trafficChange: 0.02,
    incrementalOperatingCost: 45_000,
    valueForMoneyIndex: 104,
    brandRisk: "Medium",
    items: [
      scenarioItem("signature-breakfast-set", 32, 30.5, "Invest in the visible signature bundle.", "Gains from à-la-carte mains are embedded in forecast."),
      scenarioItem("egg-sausage-muffin", 18, 23.6, "Lower the entry main price.", "Cannibalizes part of Chicken Muffin demand."),
      scenarioItem("chicken-muffin", 24, 13.8, "Premium price funds value investment.", "0.8 UPH shifts to Egg & Sausage Muffin."),
      scenarioItem("hash-brown", 11, 28.5, "Add-on increase offsets lower entry prices.", "Attach-rate loss is embedded in forecast UPH."),
      scenarioItem("americano", 13, 41, "Lower the entry beverage price.", "Cannibalizes part of Latte demand."),
      scenarioItem("latte", 22, 24.5, "Widen the premium ladder.", "1.2 UPH shifts to Americano."),
      scenarioItem("orange-juice", 17, 8.5, "Premium beverage increase.", "0.2 UPH shifts to Americano."),
      scenarioItem("breakfast-upgrade", 10, 10.6, "Larger modifier increase funds value anchors.", "Attach-rate loss is embedded in forecast UPH."),
    ],
  },
];

function priceSignal(
  itemId: string,
  acceptablePriceLow: number,
  acceptablePriceHigh: number,
  goodValueBreakPoint: number,
  currentValueForMoneyIndex: number,
): PriceResponseSignal {
  return {
    itemId,
    acceptablePriceLow,
    acceptablePriceHigh,
    goodValueBreakPoint,
    currentValueForMoneyIndex,
    source: "Illustrative Price Sensitivity Study input",
    evidenceQuality: "Research-stated",
  };
}

function buildSlice(
  id: string,
  label: string,
  timeWindow: string,
  transactions: number,
  unitShares: number[],
): MenuAnalysisSlice {
  return {
    id,
    label,
    timeWindow,
    transactions,
    items: seedPricingProject.items.map((item, index) => ({
      ...item,
      units: Math.round(item.units * unitShares[index]),
    })),
    source: "Illustrative transaction-timestamp POS slice",
  };
}

function responseCurve(
  itemId: string,
  values: Array<[number, number, number, number]>,
): PriceResponseCurve {
  return {
    itemId,
    points: values.map(
      ([price, statedGoodValueIndex, statedPurchaseIntent, observedUphIndex]) => ({
        price,
        statedGoodValueIndex,
        statedPurchaseIntent,
        observedUphIndex,
      }),
    ),
    researchSource: "Illustrative Price Sensitivity Study",
    observedSource: "Illustrative normalized historical price-period data",
    evidenceQuality: "Assumption",
  };
}

function scenarioItem(
  itemId: string,
  proposedListPrice: number,
  forecastUph: number,
  assumption: string,
  cannibalizationNote: string,
) {
  return {
    itemId,
    proposedListPrice,
    forecastUph,
    assumption: `${assumption} Management assumption; pilot calibration required.`,
    cannibalizationNote,
    evidenceQuality: "Assumption" as const,
  };
}
