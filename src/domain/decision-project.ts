import { z } from "zod";

import {
  isoDateSchema,
  isoTimestampSchema,
  nonEmptyStringSchema,
  versionSchema,
} from "./common";
import { bprePillars, decisionTypes } from "./constraint";

export const meetingModes = [
  "Fast Track",
  "Revision Review",
  "Executive Escalation",
  "Incomplete Decision",
] as const;

export const decisionRecommendations = [
  "Pass",
  "Revise",
  "Escalate",
  "Incomplete",
] as const;

export const decisionProjectStatuses = [
  "Ready for Meeting",
  "Revision Required",
  "Escalated",
  "Decision Recorded",
  "Under Review",
] as const;

export const evidenceQualities = [
  "Verified",
  "Estimated",
  "Assumption",
  "Missing",
] as const;

export const evaluationResults = ["Pass", "Fail", "Missing"] as const;
export const evaluationOutcomes = [
  "Continue",
  "Monitor",
  "Revise",
  "Escalate",
] as const;

export const finalDecisionOutcomes = [
  "Approve",
  "Approve Exception",
  "Revise",
  "Escalate",
  "Reject",
  "Defer",
] as const;

export const evidenceValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.string(),
  z.null(),
]);

export const decisionEvidenceSchema = z.object({
  id: nonEmptyStringSchema,
  metricKey: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  displayValue: nonEmptyStringSchema,
  value: evidenceValueSchema,
  unit: z.string(),
  quality: z.enum(evidenceQualities),
  source: nonEmptyStringSchema,
  period: nonEmptyStringSchema,
  owner: nonEmptyStringSchema,
  calculationNote: nonEmptyStringSchema,
  confidence: nonEmptyStringSchema,
});

export const decisionOptionSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  customerValue: nonEmptyStringSchema,
  economicImpact: nonEmptyStringSchema,
  constraintStatus: nonEmptyStringSchema,
  recommendation: nonEmptyStringSchema,
  recommended: z.boolean(),
});

export const bpreImpactSchema = z.object({
  pillar: z.enum(bprePillars),
  status: z.enum(["Acceptable", "Watch", "At Risk", "Failing"]),
  summary: nonEmptyStringSchema,
});

export const constraintEvaluationSchema = z.object({
  constraintId: nonEmptyStringSchema,
  constraintVersion: versionSchema,
  projectCondition: nonEmptyStringSchema,
  projectValue: evidenceValueSchema,
  result: z.enum(evaluationResults),
  outcome: z.enum(evaluationOutcomes),
  requiredAction: nonEmptyStringSchema,
});

export const evaluationSnapshotSchema = z.object({
  id: nonEmptyStringSchema,
  createdAt: isoTimestampSchema,
  recommendation: z.enum(decisionRecommendations),
  reason: nonEmptyStringSchema,
  readinessComplete: z.number().int().nonnegative(),
  readinessRequired: z.number().int().positive(),
  results: z.array(constraintEvaluationSchema).min(1),
});

export const actionPlanTaskSchema = z.object({
  id: nonEmptyStringSchema,
  action: nonEmptyStringSchema,
  owner: nonEmptyStringSchema,
  dueDate: isoDateSchema,
  status: z.enum(["Open", "Planned", "Complete"]),
});

export const timelineEventSchema = z.object({
  id: nonEmptyStringSchema,
  eventType: nonEmptyStringSchema,
  date: isoDateSchema,
  description: nonEmptyStringSchema,
});

export const decisionCommitmentsSchema = z.object({
  owner: nonEmptyStringSchema,
  coOwner: nonEmptyStringSchema,
  approver: nonEmptyStringSchema,
  primaryNorthStar: nonEmptyStringSchema,
  supportingKpis: z.array(nonEmptyStringSchema).min(1),
  successTarget: nonEmptyStringSchema,
  executionScope: nonEmptyStringSchema,
  reviewCheckpoints: z.array(nonEmptyStringSchema).min(1),
  exitRule: nonEmptyStringSchema,
});

export const decisionAuditSnapshotSchema = z.object({
  decisionCardVersion: versionSchema,
  constitutionVersionId: nonEmptyStringSchema,
  articleIds: z.array(nonEmptyStringSchema).min(1),
  constraintVersions: z
    .array(
      z.object({
        constraintId: nonEmptyStringSchema,
        version: versionSchema,
      }),
    )
    .min(1),
  evidence: z.array(decisionEvidenceSchema).min(1),
  evaluation: evaluationSnapshotSchema,
  outcome: z.enum(finalDecisionOutcomes),
  acceptedExceptionIds: z.array(nonEmptyStringSchema),
  commitments: decisionCommitmentsSchema,
  recordedAt: isoTimestampSchema,
});

export const humanDecisionRecordSchema = z.object({
  outcome: z.enum(finalDecisionOutcomes),
  rationale: nonEmptyStringSchema,
  decisionMaker: nonEmptyStringSchema,
  decisionDate: isoDateSchema,
  acceptedExceptionIds: z.array(nonEmptyStringSchema),
  commitments: decisionCommitmentsSchema,
  recordedAt: isoTimestampSchema,
  snapshot: decisionAuditSnapshotSchema,
});

export const decisionProjectSchema = z.object({
  id: nonEmptyStringSchema,
  projectId: nonEmptyStringSchema,
  decisionCardVersion: versionSchema,
  title: nonEmptyStringSchema,
  subtitle: nonEmptyStringSchema,
  status: z.enum(decisionProjectStatuses),
  meetingMode: z.enum(meetingModes),
  recommendation: z.enum(decisionRecommendations),
  decisionLevel: nonEmptyStringSchema,
  decisionType: z.enum(decisionTypes),
  meetingDate: isoDateSchema,
  decisionDeadline: isoDateSchema,
  strategicStage: nonEmptyStringSchema,
  constitutionVersionId: nonEmptyStringSchema,
  decisionRequest: nonEmptyStringSchema,
  decisionStatement: nonEmptyStringSchema,
  whyNow: nonEmptyStringSchema,
  businessObjective: nonEmptyStringSchema,
  requestedDecision: nonEmptyStringSchema,
  owner: nonEmptyStringSchema,
  coOwner: nonEmptyStringSchema,
  approver: nonEmptyStringSchema,
  primaryNorthStar: nonEmptyStringSchema,
  supportingKpis: z.array(nonEmptyStringSchema).min(1),
  targetCustomers: z.array(nonEmptyStringSchema).min(1),
  journeyMoment: nonEmptyStringSchema,
  customerProblem: nonEmptyStringSchema,
  experienceNonNegotiables: z.array(nonEmptyStringSchema).min(1),
  coreTradeOff: z.object({
    upside: nonEmptyStringSchema,
    downside: nonEmptyStringSchema,
  }),
  evidence: z.array(decisionEvidenceSchema).min(1),
  evidenceComplete: z.number().int().nonnegative(),
  evidenceRequired: z.number().int().positive(),
  options: z.array(decisionOptionSchema).min(2),
  impacts: z.array(bpreImpactSchema).length(4),
  evaluationSnapshot: evaluationSnapshotSchema,
  relevantArticleIds: z.array(nonEmptyStringSchema).min(1),
  requiredResolutions: z.array(nonEmptyStringSchema),
  proposedActionPlan: z.array(actionPlanTaskSchema),
  actionPlan: z.array(actionPlanTaskSchema),
  timeline: z.array(timelineEventSchema),
  decisionRecord: humanDecisionRecordSchema.optional(),
  createdAt: isoTimestampSchema,
  updatedAt: isoTimestampSchema,
});

export type DecisionProject = z.infer<typeof decisionProjectSchema>;
export type HumanDecisionRecord = z.infer<typeof humanDecisionRecordSchema>;
export type DecisionCommitments = z.infer<typeof decisionCommitmentsSchema>;
export type FinalDecisionOutcome = HumanDecisionRecord["outcome"];
