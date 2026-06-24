import "fake-indexeddb/auto";

import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { loadSeedData, seedConstraints } from "@/data/seed";

import {
  ConstraintService,
  filterConstraints,
} from "./constraint-service";

const NOW = "2026-06-24T12:00:00.000Z";
const repositories: DexieWorkspaceRepository[] = [];

function setup() {
  const repository = new DexieWorkspaceRepository(
    `constraint-service-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  let sequence = 0;
  const service = new ConstraintService(repository, {
    now: () => NOW,
    id: () => `constraint-generated-${++sequence}`,
  });
  return { repository, service };
}

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Constraint filtering", () => {
  it("combines text search, pillar, status, and outcome filters", () => {
    const result = filterConstraints(seedConstraints, {
      search: "discount",
      pillar: "Brand",
      status: "Active",
      outcome: "Revise",
    });

    expect(result.map((item) => item.constraintId)).toEqual(["BR-PR-001"]);
  });

  it("searches by constraint ID and metric key case-insensitively", () => {
    expect(
      filterConstraints(seedConstraints, { search: "eb-pr-001" }),
    ).toHaveLength(1);
    expect(
      filterConstraints(seedConstraints, { search: "WAIT_TIME_INCREASE" }),
    ).toHaveLength(1);
  });
});

describe("ConstraintService", () => {
  it("creates and updates only Draft Constraints", async () => {
    const { service } = setup();
    const draft = await service.createDraft({
      ...seedConstraints[0],
      constraintId: "BR-NEW-001",
      name: "New draft rule",
    });

    const updated = await service.updateDraft(draft.id, {
      ...draft,
      name: "Updated draft rule",
    });

    expect(updated).toMatchObject({
      id: "constraint-generated-1",
      status: "Draft",
      name: "Updated draft rule",
    });
  });

  it("clones an Active Constraint into the next Draft version", async () => {
    const { repository, service } = setup();
    await loadSeedData(repository);

    const cloned = await service.clone(
      seedConstraints[0].id,
      "Adjust threshold for a new strategy stage",
    );

    expect(cloned).toMatchObject({
      id: "constraint-generated-1",
      version: "1.1",
      status: "Draft",
      supersedesId: seedConstraints[0].id,
    });
  });

  it("activates, suspends, reactivates, and retires through valid transitions", async () => {
    const { service } = setup();
    const draft = await service.createDraft({
      ...seedConstraints[0],
      constraintId: "BR-NEW-002",
    });

    expect((await service.transition(draft.id, "Active")).status).toBe("Active");
    expect((await service.transition(draft.id, "Suspended")).status).toBe(
      "Suspended",
    );
    expect((await service.transition(draft.id, "Active")).status).toBe("Active");
    expect((await service.transition(draft.id, "Retired")).status).toBe(
      "Retired",
    );
  });
});
