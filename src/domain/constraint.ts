import { z } from "zod";

import {
  isoDateSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  versionSchema,
} from "./common";

export const constraintStatuses = [
  "Draft",
  "Active",
  "Suspended",
  "Retired",
] as const;

export const bprePillars = [
  "Brand",
  "Product",
  "Restaurant/Retail",
  "Economic Box",
] as const;

export const constraintTypes = [
  "Hard Red Line",
  "Adjustable Guardrail",
  "Approval Threshold",
  "Information Requirement",
  "Monitoring Trigger",
] as const;

export const decisionTypes = [
  "Generic",
  "Promotion",
  "Pricing",
  "Menu",
  "New Product",
  "Store Network",
  "Custom",
] as const;

export const dataTypes = [
  "Number",
  "Currency",
  "Percentage",
  "Boolean",
  "Text",
  "Enum",
  "Date",
] as const;

export const constraintOperators = [
  "<=",
  "<",
  ">=",
  ">",
  "=",
  "!=",
  "IN",
  "NOT_IN",
  "REQUIRED",
] as const;

export const severities = ["Critical", "High", "Medium", "Low"] as const;
export const failureOutcomes = ["Revise", "Escalate", "Advisory"] as const;
export const escalationRoles = [
  "CEO",
  "CFO",
  "COO",
  "Functional Leader",
] as const;
export const exceptionPolicies = [
  "Allowed",
  "Not allowed",
  "CEO only",
] as const;

export const thresholdValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
  z.array(z.string()),
  z.null(),
]);

export const constraintSchema = z
  .object({
    id: nonEmptyStringSchema,
    constraintId: nonEmptyStringSchema,
    version: versionSchema,
    status: z.enum(constraintStatuses),
    constitutionVersionId: nonEmptyStringSchema,
    constitutionRuleId: nonEmptyStringSchema,
    constraintBlueprintId: nonEmptyStringSchema,
    derivationRationale: nonEmptyStringSchema,
    pillar: z.enum(bprePillars),
    constraintType: z.enum(constraintTypes),
    name: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    scope: nonEmptyStringSchema,
    applicableDecisionTypes: z.array(z.enum(decisionTypes)).min(1),
    metricKey: nonEmptyStringSchema.regex(
      /^[a-z][a-z0-9_]*$/,
      "Use a machine-readable snake_case key",
    ),
    dataType: z.enum(dataTypes),
    operator: z.enum(constraintOperators),
    thresholdValue: thresholdValueSchema,
    unit: z.string(),
    severity: z.enum(severities),
    outcomeIfFailed: z.enum(failureOutcomes),
    escalationRole: z.enum(escalationRoles),
    exceptionPolicy: z.enum(exceptionPolicies),
    requiredEvidence: nonEmptyStringSchema,
    effectiveDate: isoDateSchema,
    reviewFrequency: nonEmptyStringSchema,
    changeNotes: nonEmptyStringSchema,
    supersedesId: z.string().optional(),
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .superRefine((record, context) => {
    if (record.operator === "REQUIRED") {
      if (record.thresholdValue !== null) {
        context.addIssue({
          code: "custom",
          path: ["thresholdValue"],
          message: "REQUIRED constraints do not use a threshold value",
        });
      }
      return;
    }

    if (
      ["Number", "Currency", "Percentage"].includes(record.dataType) &&
      typeof record.thresholdValue !== "number"
    ) {
      context.addIssue({
        code: "custom",
        path: ["thresholdValue"],
        message: `${record.dataType} constraints require a numeric threshold`,
      });
    }

    if (
      record.dataType === "Boolean" &&
      typeof record.thresholdValue !== "boolean"
    ) {
      context.addIssue({
        code: "custom",
        path: ["thresholdValue"],
        message: "Boolean constraints require a true or false threshold",
      });
    }

    if (
      record.dataType === "Enum" &&
      !(
        typeof record.thresholdValue === "string" ||
        (Array.isArray(record.thresholdValue) &&
          record.thresholdValue.length > 0)
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["thresholdValue"],
        message: "Enum constraints require one or more accepted values",
      });
    }
  });

export type Constraint = z.infer<typeof constraintSchema>;
export type ConstraintStatus = Constraint["status"];
export type BprePillar = Constraint["pillar"];
