import { z } from "zod";

import {
  isoDateSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  versionSchema,
} from "./common";

export const constitutionStatuses = [
  "Draft",
  "Active",
  "Superseded",
  "Invalidated",
  "Archived",
] as const;

export const constitutionScopes = [
  "Company",
  "Business Unit",
  "Country/Market",
  "Brand",
  "Pilot",
] as const;

export const strategicStages = [
  "Expansion",
  "Profit Repair",
  "Brand Upgrade",
  "Transformation",
  "Custom",
] as const;

export const constitutionSchema = z.object({
  id: nonEmptyStringSchema,
  constitutionId: nonEmptyStringSchema,
  version: versionSchema,
  title: nonEmptyStringSchema,
  scope: z.enum(constitutionScopes),
  scopeValue: nonEmptyStringSchema,
  businessUnitMarket: nonEmptyStringSchema,
  strategicStage: z.enum(strategicStages),
  effectiveDate: isoDateSchema,
  reviewDate: isoDateSchema,
  status: z.enum(constitutionStatuses),
  executiveOwner: nonEmptyStringSchema,
  maintainer: nonEmptyStringSchema,

  primaryStrategicPriority: nonEmptyStringSchema,
  primaryNorthStarMetric: nonEmptyStringSchema,
  supportingMetrics: z.array(nonEmptyStringSchema),
  acceptableTradeOffs: z.array(nonEmptyStringSchema),
  nonNegotiableTradeOffs: z.array(nonEmptyStringSchema).min(1),
  ceoEscalationThresholds: z.array(nonEmptyStringSchema),

  priorityTargetCustomers: z.array(nonEmptyStringSchema).min(1),
  priorityJourneyMoments: z.array(nonEmptyStringSchema),
  customerProblemsToSolve: z.array(nonEmptyStringSchema),
  customerExperienceNonNegotiables: z.array(nonEmptyStringSchema).min(1),

  boundaries: z.object({
    brand: nonEmptyStringSchema,
    product: nonEmptyStringSchema,
    restaurantRetail: nonEmptyStringSchema,
    economicBox: nonEmptyStringSchema,
  }),

  decisionRights: nonEmptyStringSchema,
  ceoEscalationConditions: nonEmptyStringSchema,
  annualReviewCadence: nonEmptyStringSchema,
  exceptionalUpdateTriggers: nonEmptyStringSchema,
  changeNotes: nonEmptyStringSchema,

  supersedesId: z.string().optional(),
  activatedAt: isoTimestampSchema.optional(),
  invalidationReason: z.string().optional(),
  effectiveEndDate: isoDateSchema.optional(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type Constitution = z.infer<typeof constitutionSchema>;
export type ConstitutionStatus = Constitution["status"];

export function constitutionScopeKey(
  record: Pick<Constitution, "scope" | "scopeValue">,
): string {
  return `${record.scope}::${record.scopeValue.trim().toLowerCase()}`;
}
