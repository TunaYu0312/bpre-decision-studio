import { z } from "zod";

import {
  isoTimestampSchema,
  nonEmptyStringSchema,
  versionSchema,
} from "./common";
import {
  bprePillars,
  decisionTypes,
  escalationRoles,
} from "./constraint";

export const constitutionArticleRuleTypes = [
  "Non-Negotiable Red Line",
  "Strategic Guardrail",
  "Approval Mandate",
  "Information Mandate",
  "Monitoring Principle",
] as const;

export const constitutionArticleStatuses = [
  "Draft",
  "Active",
  "Retired",
] as const;

export const constitutionRuleSchema = z.object({
  id: nonEmptyStringSchema,
  ruleId: nonEmptyStringSchema,
  constitutionVersionId: nonEmptyStringSchema,
  pillar: z.enum(bprePillars),
  name: nonEmptyStringSchema,
  principle: nonEmptyStringSchema,
  strategicStage: nonEmptyStringSchema,
  ruleType: z.enum(constitutionArticleRuleTypes),
  applicableDecisionTypes: z.array(z.enum(decisionTypes)).min(1),
  relevantPillars: z.array(z.enum(bprePillars)).min(1),
  escalationAuthority: z.enum(escalationRoles),
  status: z.enum(constitutionArticleStatuses),
  version: versionSchema,
  createdAt: isoTimestampSchema,
});

export type ConstitutionRule = z.infer<typeof constitutionRuleSchema>;
