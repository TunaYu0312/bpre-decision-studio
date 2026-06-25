import "fake-indexeddb/auto";

import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { loadSeedData, seedDecisionProject } from "@/data/seed";

import { DecisionService, type RecordDecisionInput } from "./decision-service";

const repositories: DexieWorkspaceRepository[] = [];
const NOW = "2026-06-14T10:30:00.000Z";

const validInput: RecordDecisionInput = {
  outcome: "Revise",
  rationale:
    "Return the proposal for a revised bundle that restores non-negative EBITDA.",
  decisionMaker: "CEO",
  decisionDate: "2026-06-14",
  acceptedExceptionIds: [],
  commitments: {
    owner: "Marketing Director",
    coOwner: "Operations Manager",
    approver: "CEO",
    primaryNorthStar: "Store-level EBITDA",
    supportingKpis: ["Morning traffic", "Gross profit dollars", "Wait time"],
    successTarget: "+$20K incremental EBITDA within 30 days",
    executionScope: "30 stores / 10 days",
    reviewCheckpoints: ["Day 5", "Day 10", "Day 30", "Day 90"],
    exitRule:
      "Stop the pilot if incremental EBITDA remains negative at Day 10 or average wait time exceeds one minute.",
  },
};

async function setup() {
  const repository = new DexieWorkspaceRepository(
    `decision-service-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  await loadSeedData(repository);
  return {
    repository,
    service: new DecisionService(repository, {
      now: () => NOW,
      id: () => "timeline-decision-recorded",
    }),
  };
}

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("DecisionService", () => {
  it("requires an explicit human decision rationale", async () => {
    const { service } = await setup();

    await expect(
      service.recordDecision(seedDecisionProject.id, {
        ...validInput,
        rationale: "",
      }),
    ).rejects.toThrow("Decision rationale is required");
  });

  it("records a human decision, action plan, timeline event, and audit snapshot", async () => {
    const { service } = await setup();

    const recorded = await service.recordDecision(
      seedDecisionProject.id,
      validInput,
    );

    expect(recorded.status).toBe("Decision Recorded");
    expect(recorded.decisionRecord?.outcome).toBe("Revise");
    expect(
      recorded.decisionRecord?.snapshot.constraintVersions,
    ).toHaveLength(7);
    expect(recorded.actionPlan).toHaveLength(4);
    expect(recorded.timeline.at(-1)?.eventType).toBe("Decision Recorded");
    expect(recorded.decisionRecord?.snapshot.evidence[3].displayValue).toBe(
      "-$4K",
    );
  });

  it("requires explicit constraint exceptions for an exception approval", async () => {
    const { service } = await setup();

    await expect(
      service.recordDecision(seedDecisionProject.id, {
        ...validInput,
        outcome: "Approve Exception",
      }),
    ).rejects.toThrow("Select at least one accepted exception");
  });
});
