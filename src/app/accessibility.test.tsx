import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData, seedConstraints } from "@/data/seed";

import { AppRoutes } from "./router";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("public demo accessibility", () => {
  it("exposes semantic navigation, disclaimer, and seeded workspace counts", async () => {
    const repository = new DexieWorkspaceRepository(
      `accessibility-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={["/demo"]}>
          <AppRoutes />
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Decision workflow" })).toBeVisible();
    expect(
      screen.getByText(/Illustrative demo data only/i),
    ).toBeVisible();
    expect(await screen.findByText("1 active Constitution")).toBeVisible();
    expect(
      screen.getByText(`${seedConstraints.length} active constraints`),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Open active Constitution/i }),
    ).toHaveAttribute("href", "/constitutions");
  });
});
