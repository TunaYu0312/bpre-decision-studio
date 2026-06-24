import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData, seedConstitution } from "@/data/seed";

import { ConstitutionDetailPage } from "./constitution-detail";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Constitution detail", () => {
  it("shows clone but does not offer in-place editing for an Active version", async () => {
    const repository = new DexieWorkspaceRepository(
      `constitution-detail-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter
          initialEntries={[`/constitutions/${seedConstitution.id}`]}
        >
          <Routes>
            <Route
              element={<ConstitutionDetailPage />}
              path="/constitutions/:id"
            />
          </Routes>
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "Profit Repair 2026" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clone new version" })).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Edit Draft" }),
    ).not.toBeInTheDocument();
  });
});
