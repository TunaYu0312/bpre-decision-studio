export type EvidenceState =
  | "Fact"
  | "Estimate"
  | "Assumption"
  | "Management judgement";

export type EvidenceLayer =
  | "Market"
  | "Customer"
  | "Store"
  | "Product"
  | "Competition";

export type QueueItemType =
  | "Fact claim"
  | "Assumption"
  | "Constraint"
  | "Preference"
  | "Question"
  | "Risk"
  | "New option"
  | "Objection";

export type QueueStatus =
  | "Pending confirmation"
  | "In analysis"
  | "Result awaiting review"
  | "Fact updated"
  | "Pilot required"
  | "Cannot answer"
  | "Closed";

export interface DecisionScopeItem {
  label: string;
  value: string;
}

export interface DecisionGuardrail {
  label: string;
  threshold: string;
  type: "Customer" | "Brand" | "Operations" | "Economics";
}

export interface CommonFact {
  id: string;
  title: string;
  value: string;
  interpretation: string;
  layer: EvidenceLayer;
  state: EvidenceState;
  source: string;
  period: string;
  quality: "High" | "Medium" | "Low";
  supports: string[];
  disputed?: boolean;
}

export interface DistrictDecisionRow {
  district: string;
  customer: string;
  sensitivity: string;
  valueRisk: "Low" | "Medium" | "High" | "Very high";
  competitorPosition: string;
  capacity: string;
  netContribution: number;
  action: string;
  rollout: string;
}

export interface ContributionBreakdown {
  incrementalRevenue: number;
  ingredientCost: number;
  laborCost: number;
  wasteCost: number;
  packagingAndChannelCost: number;
  qualityLoss: number;
  displacedContribution: number;
  otherOperatingCost: number;
}

export interface PricingRoomScenario {
  id: string;
  name: string;
  action: string;
  scope: string;
  price: string;
  rollout: string;
  trafficChange: number;
  uphChange: number;
  averageCheckChange: number;
  grossMargin: number;
  valueRisk: "Low" | "Medium" | "High";
  capacityRisk: "Low" | "Medium" | "High";
  reversibility: "High" | "Medium" | "Low";
  confidence: "High" | "Medium" | "Low";
  tradeoff: string;
  keyAssumption: string;
  breakdown: ContributionBreakdown;
}

export interface OperationsProfile {
  activeMinutes: number;
  totalCycleMinutes: number;
  stations: string[];
  bottleneck: string;
  minimumBatch: number;
  shelfLifeMinutes: number;
  currentWasteRate: number;
  scenarioWasteRate: number;
  maxStableUph: number;
  peakLoad: number;
  overtimeTriggerUph: number;
}

export interface EvidenceQueueItem {
  id: string;
  type: QueueItemType;
  statement: string;
  owner: string;
  due: string;
  status: QueueStatus;
  relatedScenarios: string[];
  suggestedAnalysis?: string;
  result?: string;
}

export interface PricingDecisionRoom {
  id: string;
  code: string;
  title: string;
  decisionStatement: string;
  primaryObjective: string;
  status: string;
  decisionMaker: string;
  facilitator: string;
  analysisOwner: string;
  executionOwner: string;
  deadline: string;
  scope: DecisionScopeItem[];
  outOfScope: string;
  guardrails: DecisionGuardrail[];
  facts: CommonFact[];
  districtMatrix: DistrictDecisionRow[];
  operations: OperationsProfile;
  scenarios: PricingRoomScenario[];
  queue: EvidenceQueueItem[];
}

export function calculateNetIncrementalContribution(
  breakdown: ContributionBreakdown,
) {
  return (
    breakdown.incrementalRevenue -
    breakdown.ingredientCost -
    breakdown.laborCost -
    breakdown.wasteCost -
    breakdown.packagingAndChannelCost -
    breakdown.qualityLoss -
    breakdown.displacedContribution -
    breakdown.otherOperatingCost
  );
}

export function calculateScenarioAfterOperationsReview(
  scenario: PricingRoomScenario,
  operationsRiskConfirmed: boolean,
) {
  if (!operationsRiskConfirmed || scenario.id === "option-0") {
    return calculateNetIncrementalContribution(scenario.breakdown);
  }

  return calculateNetIncrementalContribution({
    ...scenario.breakdown,
    laborCost: scenario.breakdown.laborCost + 18_000,
    wasteCost: scenario.breakdown.wasteCost + 12_000,
  });
}
