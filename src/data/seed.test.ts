import "fake-indexeddb/auto";

import { afterEach, describe, expect, it } from "vitest";

import { bprePillars } from "@/domain/constraint";

import { DexieWorkspaceRepository } from "./dexie-repository";
import { loadSeedData } from "./seed";

const repositories: DexieWorkspaceRepository[] = [];

function createRepository() {
  const repository = new DexieWorkspaceRepository(
    `bpre-test-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  return repository;
}

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Dexie workspace repository", () => {
  it("persists and retrieves Constitution records through the contract", async () => {
    const repository = createRepository();
    await loadSeedData(repository);

    const constitutions = await repository.listConstitutions();
    const stored = await repository.getConstitution(constitutions[0].id);

    expect(constitutions).toHaveLength(1);
    expect(stored).toEqual(constitutions[0]);
    expect(stored?.status).toBe("Active");
  });

  it("loads seed data idempotently", async () => {
    const repository = createRepository();

    await loadSeedData(repository);
    const first = {
      constitutions: await repository.listConstitutions(),
      rules: await repository.listConstitutionRules(),
      constraints: await repository.listConstraints(),
    };

    await loadSeedData(repository);
    const second = {
      constitutions: await repository.listConstitutions(),
      rules: await repository.listConstitutionRules(),
      constraints: await repository.listConstraints(),
    };

    expect(second).toEqual(first);
    expect(second.constitutions).toHaveLength(1);
    expect(second.rules.length).toBeGreaterThanOrEqual(4);
    expect(new Set(second.constraints.map((item) => item.pillar))).toEqual(
      new Set(bprePillars),
    );
    expect(second.constraints.every((item) => item.status === "Active")).toBe(
      true,
    );
  });
});
