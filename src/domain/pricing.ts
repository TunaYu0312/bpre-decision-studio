export type PricingEvidenceQuality =
  | "Observed"
  | "Modelled"
  | "Research-stated"
  | "Assumption"
  | "Missing";

export type MenuRole =
  | "Signature"
  | "Traffic driver"
  | "Profit builder"
  | "Add-on"
  | "Entry price"
  | "Premium";

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
  scope: string;
  owner: string;
  stage: "Baseline ready" | "Research pending" | "Scenario design" | "Decision ready";
  baselinePeriod: string;
  referencePeriod: string;
  eligibleTransactionDefinition: string;
  transactions: number;
  affectedItems: number;
  proposedEffectiveDate: string;
  dataReadiness: "Verified baseline" | "Partial baseline" | "Missing baseline";
  researchStatus: "Not started" | "Study designed" | "Results available";
  items: MenuItemBaseline[];
}

export interface MenuItemEconomics extends MenuItemBaseline {
  uph: number;
  salesMix: number;
  netSales: number;
  grossProfit: number;
  grossMargin: number;
}

export interface BaselineEconomics {
  transactions: number;
  totalUnits: number;
  totalUph: number;
  netSales: number;
  grossProfit: number;
  grossMargin: number;
  items: MenuItemEconomics[];
}

export function calculateBaselineEconomics(
  items: MenuItemBaseline[],
  transactions: number,
): BaselineEconomics {
  if (!Number.isFinite(transactions) || transactions <= 0) {
    throw new Error("Eligible transactions must be greater than zero.");
  }

  const totalUnits = items.reduce((sum, item) => sum + item.units, 0);

  if (totalUnits <= 0) {
    throw new Error("Baseline must contain at least one sold unit.");
  }

  const itemEconomics = items.map((item) => {
    const netSales = item.units * item.netRealizedPrice;
    const grossProfit =
      item.units * (item.netRealizedPrice - item.unitVariableCost);

    return {
      ...item,
      uph: (item.units / transactions) * 100,
      netSales,
      grossProfit,
      grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
    };
  });

  const netSales = itemEconomics.reduce(
    (sum, item) => sum + item.netSales,
    0,
  );
  const grossProfit = itemEconomics.reduce(
    (sum, item) => sum + item.grossProfit,
    0,
  );
  const calculatedItems = itemEconomics.map((item) => ({
    ...item,
    salesMix: netSales === 0 ? 0 : item.netSales / netSales,
  }));

  return {
    transactions,
    totalUnits,
    totalUph: (totalUnits / transactions) * 100,
    netSales,
    grossProfit,
    grossMargin: netSales === 0 ? 0 : grossProfit / netSales,
    items: calculatedItems,
  };
}
