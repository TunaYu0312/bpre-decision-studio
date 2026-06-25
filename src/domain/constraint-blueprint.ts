import { z } from "zod";

import {
  isoTimestampSchema,
  nonEmptyStringSchema,
} from "./common";
import {
  bprePillars,
  constraintTypes,
  escalationRoles,
  failureOutcomes,
} from "./constraint";

export const blueprintEvaluationOutcomes = [
  ...failureOutcomes,
  "Reject",
  "Incomplete Data",
] as const;

export const constraintBlueprintSchema = z.object({
  id: nonEmptyStringSchema,
  blueprintId: nonEmptyStringSchema,
  constitutionVersionId: nonEmptyStringSchema,
  parentArticleId: nonEmptyStringSchema,
  pillar: z.enum(bprePillars),
  controlObjective: nonEmptyStringSchema,
  riskToAvoid: nonEmptyStringSchema,
  metricKey: nonEmptyStringSchema.regex(
    /^[a-z][a-z0-9_]*$/,
    "Use a machine-readable snake_case key",
  ),
  thresholdSource: nonEmptyStringSchema,
  ruleType: z.enum(constraintTypes),
  evaluationOutcome: z.enum(blueprintEvaluationOutcomes),
  exceptionAuthority: z.enum(escalationRoles),
  createdAt: isoTimestampSchema,
});

export type ConstraintBlueprint = z.infer<typeof constraintBlueprintSchema>;
