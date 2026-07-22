import "fake-indexeddb/auto";

import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { loadSeedData, seedConstitution } from "@/data/seed";

import { ConstitutionService } from "./constitution-service";

const NOW = "2026-06-24T12:00:00.000Z";
const repositories: DexieWorkspaceRepository[] = [];

function setup() {
  const repository = new DexieWorkspaceRepository(
    `constitution-service-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  let sequence = 0;
  const service = new ConstitutionService(repository, {
    now: () => NOW,
    id: () => `generated-${++sequence}`,
  });
  return { repository, service };
}

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("ConstitutionService", () => {
  it("creates a new Draft Constitution", async () => {
    const { service } = setup();

    const created = await service.createDraft({
      ...seedConstitution,
      constitutionId: "CONST-NEW-2027",
      title: "Growth Discipline 2027",
      version: "1.0",
    });

    expect(created).toMatchObject({
      id: "generated-1",
      status: "Draft",
      constitutionId: "CONST-NEW-2027",
      createdAt: NOW,
    });
  });

  it("clones an active version, then activation supersedes the old version", async () => {
    const { repository, service } = setup();
    await loadSeedData(repository);

    const cloned = await service.clone(
      seedConstitution.id,
      "Clarify acceptable trade-off",
    );
    expect(cloned).toMatchObject({
      id: "generated-1",
      version: "1.1",
      status: "Draft",
      supersedesId: seedConstitution.id,
    });

    await service.activate(cloned.id);
    const records = await service.list();

    expect(records.find((item) => item.id === cloned.id)?.status).toBe("Active");
    expect(
      records.find((item) => item.id === seedConstitution.id)?.status,
    ).toBe("Superseded");
  });

  it("rejects updating an active version in place", async () => {
    const { repository, service } = setup();
    await loadSeedData(repository);

    await expect(
      service.updateDraft(seedConstitution.id, {
        ...seedConstitution,
        title: "Changed active title",
      }),
    ).rejects.toThrow("Clone this version");
  });

  it("invalidates an active Constitution with governance evidence", async () => {
    const { repository, service } = setup();
    await loadSeedData(repository);

    const invalidated = await service.invalidate(seedConstitution.id, {
      reason: "Material market change",
      effectiveEndDate: "2026-07-01",
      executiveOwner: "CEO",
    });

    expect(invalidated).toMatchObject({
      status: "Invalidated",
      invalidationReason: "Material market change",
      effectiveEndDate: "2026-07-01",
      executiveOwner: "CEO",
    });
  });
});
