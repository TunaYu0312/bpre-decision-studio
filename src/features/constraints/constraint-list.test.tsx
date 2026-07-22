import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData } from "@/data/seed";

import { ConstraintListPage } from "./constraint-list";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Constraint Library", () => {
  it("renders seed constraints and filters them by search", async () => {
    const repository = new DexieWorkspaceRepository(
      `constraint-list-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);
    const user = userEvent.setup();

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter>
          <ConstraintListPage />
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(
      await screen.findByRole("link", {
        name: "Promotion discount must not exceed 20%",
      }),
    ).toBeVisible();
    expect(
      await screen.findAllByText(
        "Signature-product quality and value perception cannot be compromised for short-term traffic.",
      ),
    ).toHaveLength(2);

    await user.type(
      screen.getByRole("searchbox", { name: "Search constraints" }),
      "wait_time_increase",
    );

    expect(
      screen.getByRole("link", {
        name: "Wait-time increase must not exceed one minute",
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", {
        name: "Promotion discount must not exceed 20%",
      }),
    ).not.toBeInTheDocument();

    await user.clear(
      screen.getByRole("searchbox", { name: "Search constraints" }),
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search constraints" }),
      "RULE-BR-001",
    );

    expect(
      screen.getByRole("link", {
        name: "Promotion discount must not exceed 20%",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "No standalone deep discount on signature products",
      }),
    ).toBeVisible();
    expect(screen.getByText("2 matching constraints")).toBeVisible();
  });
});
