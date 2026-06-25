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

describe("decision workspace accessibility", () => {
  it("exposes decision-centric navigation and operational decision counts", async () => {
    const repository = new DexieWorkspaceRepository(
      `accessibility-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={["/home"]}>
          <AppRoutes />
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    expect(
      screen.queryByRole("navigation", { name: "Decision workflow" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Decision Agenda" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Decision Workspace" })).toBeVisible();
    expect(screen.getByText("Rules & Governance")).toBeVisible();
    expect(await screen.findByText("1 decision requires attention")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /Open Breakfast Combo Pilot/i }),
    ).toHaveAttribute(
      "href",
      "/decisions/decision-breakfast-combo-pilot",
    );
  });
});
