import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData, seedConstraints } from "@/data/seed";

import { ConstraintDetailPage } from "./constraint-detail";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Constraint detail", () => {
  it("shows the full derivation chain and atomic rule", async () => {
    const repository = new DexieWorkspaceRepository(
      `constraint-detail-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter
          initialEntries={[`/constraints/${seedConstraints[0].id}`]}
        >
          <Routes>
            <Route
              element={<ConstraintDetailPage />}
              path="/constraints/:id"
            />
          </Routes>
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "Derivation chain" }),
    ).toBeVisible();
    expect(screen.getByText("RULE-BR-001")).toBeVisible();
    expect(
      screen.getByText(
        "Signature-product quality and value perception cannot be compromised for short-term traffic.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText("Protect signature-product price perception"),
    ).toBeVisible();
    expect(
      screen.getByText(
        "IF Company THEN discount_pct <= 20 % ELSE Revise",
      ),
    ).toBeVisible();
  });
});
