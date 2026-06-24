import { z } from "zod";

import {
  isoTimestampSchema,
  nonEmptyStringSchema,
} from "./common";
import { bprePillars } from "./constraint";

export const constitutionRuleSchema = z.object({
  id: nonEmptyStringSchema,
  ruleId: nonEmptyStringSchema,
  constitutionVersionId: nonEmptyStringSchema,
  pillar: z.enum(bprePillars),
  name: nonEmptyStringSchema,
  principle: nonEmptyStringSchema,
  createdAt: isoTimestampSchema,
});

export type ConstitutionRule = z.infer<typeof constitutionRuleSchema>;
