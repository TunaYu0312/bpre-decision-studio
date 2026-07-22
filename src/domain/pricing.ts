export type PricingEvidenceQuality =
  | "Observed"
  | "Modelled"
  | "Research-stated"
  | "Assumption"
  | "Missing";

export type PricingDecisionType =
  | "Existing menu price adjustment"
  | "New product pricing";

export type PricingObjective =
  | "Margin recovery"
  | "Gradual low-perception increase"
  | "One-step price reset"
  | "Value restoration"
  | "Price architecture rebalance";

export type MenuRole =
  | "Signature"
  | "Traffic driver"
  | "Profit builder"
  | "Add-on"
  | "Entry price"
  | "Premium";

export type MenuEngineeringCategory =
  | "Star"
  | "Plowhorse"
  | "Puzzle"
  | "Dog";

export interface MenuItemBaseline {
  id: string;
  name: string;
  category: string;
  role: MenuRole;
  listPrice: number;
  netRealizedPrice: number;
  unitVariableCost: number;
  units: number;
  evidenceQuality: PricingEvidenceQuality;
  source: string;
}

export interface PricingProject {
  id: string;
  projectCode: string;
  title: string;
  decisionType: PricingDecisionType;
  objective: PricingObjective;
  decisionQuestion: string;
  pricingPrinciples: string[];
  scope: string;
  owner: string;
  stage: "Baseline ready" | "Research pending" | "Scenario design" | "Decision ready";
  baselinePeriod: string;
  referencePeriod: string;
  eligibleTransactionDefinition: string;
  transactions: number;
  periodDays: number;
  storeCount: number;
  dataGrain: "Multi-store aggregate" | "Single-store";
  affectedItems: number;
  proposedEffectiveDate: string;
  dataReadiness: "Verified baseline" | "Partial baseline" | "Missing baseline";
  researchStatus: "Not started" | "Study designed" | "Results available";
  items: MenuItemBaseline[];
}

export interface MenuItemEconomics extends MenuItemBaseline {
  uph: number;
  adq: number;
  salesMix: number;
  netSales: number;
  grossProfit: number;
  grossMargin: number;
  contributionMargin: number;
  menuEngineeringCategory: MenuEngineeringCategory;
}

export interface BaselineEconomics {
  transactions: number;
  periodDays: number;
  storeCount: number;
  adtc: number;
  averageCheck: number;
  ads: number;
  totalUnits: number;
  totalUph: number;
  netSales: number;
  grossProfit: number;
  grossMargin: number;
  items: MenuItemEconomics[];
}

export interface PriceResponseSignal {
  itemId: string;
  acceptablePriceLow: number;
  acceptablePriceHigh: number;
  goodValueBreakPoint: number;
  currentValueForMoneyIndex: number;
  source: string;
  evidenceQuality: PricingEvidenceQuality;
}

export interface MenuAnalysisSlice {
  id: string;
  label: string;
  timeWindow: string;
  transactions: number;
  items: MenuItemBaseline[];
  source: string;
}

export interface PriceResponsePoint {
  price: number;
  statedGoodValueIndex?: number;
  statedPurchaseIntent?: number;
  observedUphIndex?: number;
}

export interface PriceResponseCurve {
  itemId: string;
  points: PriceResponsePoint[];
  researchSource: string;
  observedSource: string;
  evidenceQuality: PricingEvidenceQuality;
}

export interface ScenarioItemInput {
  itemId: string;
  proposedListPrice: number;
  forecastUph: number;
  assumption: string;
  cannibalizationNote: string;
  evidenceQuality: PricingEvidenceQuality;
}

export interface PricingScenario {
  id: string;
  name: string;
  strategy: string;
  trafficChange: number;
  incrementalOperatingCost: number;
  valueForMoneyIndex: number;
  brandRisk: "Low" | "Medium" | "High";
  isRecommended?: boolean;
  items: ScenarioItemInput[];
}

export interface ScenarioItemForecast extends MenuItemEconomics {
  currentListPrice: number;
  proposedListPrice: number;
  priceChange: number;
  baselineUph: number;
  forecastUph: number;
  uphChange: number;
  assumption: string;
  cannibalizationNote: string;
}

export interface ScenarioForecast {
  scenario: PricingScenario;
  forecastTransactions: number;
  adtc: number;
  averageCheck: number;
  ads: number;
  netSales: number;
  grossProfit: number;
  grossMargin: number;
  ebitdaImpact: number;
  trafficChange: number;
  items: ScenarioItemForecast[];
}

interface BaselineScope {
  periodDays?: number;
  storeCount?: number;
}

export function calculateBaselineEconomics(
  items: MenuItemBaseline[],
  transactions: number,
  scope: BaselineScope = {},
): BaselineEconomics {
  if (!Number.isFinite(transactions) || transactions <= 0) {
    throw new Error("Eligible transactions must be greater than zero.");
  }

  const totalUnits = items.reduce((sum, item) => sum + item.units, 0);

  if (totalUnits <= 0) {
    throw new Error("Baseline must contain at least one sold unit.");
  }

  const periodDays = scope.periodDays ?? 1;
  const storeCount = scope.storeCount ?? 1;

  if (periodDays <= 0 || storeCount <= 0) {
    throw new Error("Period days and store count must be greater than zero.");
  }

  const adtc = transactions / periodDays / storeCount;
  const provisionalItems = items.map((item) => {
    const netSales = item.units * item.netRealizedPrice;
    const grossProfit =
      item.units * (item.netRealizedPrice - item.unitVariableCost);
    const uph = (item.units / transactions) * 100;

    return {
      ...item,
      uph,
      adq: (uph * adtc) / 100,
      netSales,
      grossProfit,
      grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
      contributionMargin: item.netRealizedPrice - item.unitVariableCost,
    };
  });

  const netSales = provisionalItems.reduce(
    (sum, item) => sum + item.netSales,
    0,
  );
  const grossProfit = provisionalItems.reduce(
    (sum, item) => sum + item.grossProfit,
    0,
  );
  const popularityThreshold =
    (provisionalItems.reduce((sum, item) => sum + item.uph, 0) /
      provisionalItems.length) *
    0.7;
  const contributionThreshold = grossProfit / totalUnits;
  const calculatedItems = provisionalItems.map((item) => {
    const popular = item.uph >= popularityThreshold;
    const profitable = item.contributionMargin >= contributionThreshold;

    return {
      ...item,
      salesMix: netSales === 0 ? 0 : item.netSales / netSales,
      menuEngineeringCategory: classifyMenuEngineering(
        popular,
        profitable,
      ),
    };
  });
  const averageCheck = netSales / transactions;
  const ads = netSales / periodDays / storeCount;

  return {
    transactions,
    periodDays,
    storeCount,
    adtc,
    averageCheck,
    ads,
    totalUnits,
    totalUph: (totalUnits / transactions) * 100,
    netSales,
    grossProfit,
    grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
    items: calculatedItems,
  };
}

export function classifyMenuEngineering(
  popular: boolean,
  profitable: boolean,
): MenuEngineeringCategory {
  if (popular && profitable) return "Star";
  if (popular) return "Plowhorse";
  if (profitable) return "Puzzle";
  return "Dog";
}

export function calculateScenarioForecast(
  project: PricingProject,
  scenario: PricingScenario,
): ScenarioForecast {
  const baseline = calculateBaselineEconomics(
    project.items,
    project.transactions,
    {
      periodDays: project.periodDays,
      storeCount: project.storeCount,
    },
  );
  const forecastTransactions =
    project.transactions * (1 + scenario.trafficChange);
  const adtc =
    forecastTransactions / project.periodDays / project.storeCount;

  const itemForecasts = scenario.items.map((input) => {
    const baselineItem = baseline.items.find(
      (item) => item.id === input.itemId,
    );

    if (!baselineItem) {
      throw new Error(`Unknown scenario item: ${input.itemId}`);
    }

    const realizationRate =
      baselineItem.netRealizedPrice / baselineItem.listPrice;
    const netRealizedPrice = input.proposedListPrice * realizationRate;
    const units =
      (input.forecastUph / 100) *
      adtc *
      project.periodDays *
      project.storeCount;
    const netSales = units * netRealizedPrice;
    const grossProfit =
      units * (netRealizedPrice - baselineItem.unitVariableCost);

    return {
      ...baselineItem,
      listPrice: input.proposedListPrice,
      netRealizedPrice,
      units,
      uph: input.forecastUph,
      adq: (input.forecastUph * adtc) / 100,
      netSales,
      grossProfit,
      grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
      contributionMargin:
        netRealizedPrice - baselineItem.unitVariableCost,
      currentListPrice: baselineItem.listPrice,
      proposedListPrice: input.proposedListPrice,
      priceChange:
        input.proposedListPrice / baselineItem.listPrice - 1,
      baselineUph: baselineItem.uph,
      forecastUph: input.forecastUph,
      uphChange: input.forecastUph / baselineItem.uph - 1,
      assumption: input.assumption,
      cannibalizationNote: input.cannibalizationNote,
      evidenceQuality: input.evidenceQuality,
    };
  });

  const netSales = itemForecasts.reduce(
    (sum, item) => sum + item.netSales,
    0,
  );
  const grossProfit = itemForecasts.reduce(
    (sum, item) => sum + item.grossProfit,
    0,
  );
  const totalUnits = itemForecasts.reduce((sum, item) => sum + item.units, 0);
  const popularityThreshold =
    (itemForecasts.reduce((sum, item) => sum + item.uph, 0) /
      itemForecasts.length) *
    0.7;
  const contributionThreshold = grossProfit / totalUnits;
  const items = itemForecasts.map((item) => ({
    ...item,
    salesMix: netSales === 0 ? 0 : item.netSales / netSales,
    menuEngineeringCategory: classifyMenuEngineering(
      item.uph >= popularityThreshold,
      item.contributionMargin >= contributionThreshold,
    ),
  }));
  const averageCheck = netSales / forecastTransactions;
  const ads = netSales / project.periodDays / project.storeCount;

  return {
    scenario,
    forecastTransactions,
    adtc,
    averageCheck,
    ads,
    netSales,
    grossProfit,
    grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
    ebitdaImpact:
      grossProfit - baseline.grossProfit - scenario.incrementalOperatingCost,
    trafficChange: scenario.trafficChange,
    items,
  };
}
