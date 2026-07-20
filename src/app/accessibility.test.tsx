import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData } from "@/data/seed";

import { AppRoutes } from "./router";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("pricing workspace accessibility", () => {
  it("exposes the focused pricing navigation and project entry point", async () => {
    const repository = new DexieWorkspaceRepository(
      `accessibility-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={["/pricing"]}>
          <AppRoutes />
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Pricing Projects" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Baseline & Research" }),
    ).toHaveAttribute("href", "/pricing/pricing-core-menu-2026");
    expect(screen.queryByText("Rules & Governance")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Open baseline for 2026 Core Menu Price Review",
      }),
    ).toHaveAttribute(
      "href",
      "/pricing/pricing-core-menu-2026/baseline",
    );
  });
});
