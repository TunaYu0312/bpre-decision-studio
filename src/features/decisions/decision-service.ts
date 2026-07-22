import { z } from "zod";

import type { WorkspaceRepository } from "@/data/repository";
import {
  decisionCommitmentsSchema,
  decisionProjectSchema,
  finalDecisionOutcomes,
  type DecisionProject,
} from "@/domain/decision-project";

const recordDecisionInputSchema = z
  .object({
    outcome: z.enum(finalDecisionOutcomes),
    rationale: z.string().trim().min(1, "Decision rationale is required"),
    decisionMaker: z.string().trim().min(1, "Decision maker is required"),
    decisionDate: z.iso.date(),
    acceptedExceptionIds: z.array(z.string().trim().min(1)),
    commitments: decisionCommitmentsSchema,
  })
  .superRefine((input, context) => {
    if (
      input.outcome === "Approve Exception" &&
      input.acceptedExceptionIds.length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["acceptedExceptionIds"],
        message: "Select at least one accepted exception",
      });
    }
  });

export type RecordDecisionInput = z.infer<typeof recordDecisionInputSchema>;

interface DecisionServiceDependencies {
  now: () => string;
  id: () => string;
}

const defaultDependencies: DecisionServiceDependencies = {
  now: () => new Date().toISOString(),
  id: () => `timeline-${crypto.randomUUID()}`,
};

export class DecisionService {
  constructor(
    private readonly repository: WorkspaceRepository,
    private readonly dependencies: DecisionServiceDependencies =
      defaultDependencies,
  ) {}

  list(): Promise<DecisionProject[]> {
    return this.repository.listDecisionProjects();
  }

  get(id: string): Promise<DecisionProject | undefined> {
    return this.repository.getDecisionProject(id);
  }

  async recordDecision(
    id: string,
    rawInput: RecordDecisionInput,
  ): Promise<DecisionProject> {
    const input = recordDecisionInputSchema.parse(rawInput);
    const project = await this.repository.getDecisionProject(id);
    if (!project) throw new Error("Decision project not found");

    const recordedAt = this.dependencies.now();
    const actionPlan = project.proposedActionPlan.map((task) => ({ ...task }));
    const snapshot = {
      decisionCardVersion: project.decisionCardVersion,
      constitutionVersionId: project.constitutionVersionId,
      articleIds: [...project.relevantArticleIds],
      constraintVersions: project.evaluationSnapshot.results.map((result) => ({
        constraintId: result.constraintId,
        version: result.constraintVersion,
      })),
      evidence: project.evidence.map((item) => ({ ...item })),
      evaluation: {
        ...project.evaluationSnapshot,
        results: project.evaluationSnapshot.results.map((result) => ({
          ...result,
        })),
      },
      outcome: input.outcome,
      acceptedExceptionIds: [...input.acceptedExceptionIds],
      commitments: {
        ...input.commitments,
        supportingKpis: [...input.commitments.supportingKpis],
        reviewCheckpoints: [...input.commitments.reviewCheckpoints],
      },
      recordedAt,
    };

    const updated = decisionProjectSchema.parse({
      ...project,
      status: "Decision Recorded",
      decisionRecord: {
        ...input,
        acceptedExceptionIds: [...input.acceptedExceptionIds],
        commitments: snapshot.commitments,
        recordedAt,
        snapshot,
      },
      actionPlan,
      timeline: [
        ...project.timeline,
        {
          id: this.dependencies.id(),
          eventType: "Decision Recorded",
          date: input.decisionDate,
          description: `${input.outcome} recorded by ${input.decisionMaker}.`,
        },
      ],
      updatedAt: recordedAt,
    });

    await this.repository.putDecisionProject(updated);
    return updated;
  }
}
