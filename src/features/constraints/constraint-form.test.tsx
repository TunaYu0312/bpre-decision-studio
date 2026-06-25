import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData } from "@/data/seed";

import { ConstraintFormPage } from "./constraint-form";

const repositories: DexieWorkspaceRepository[] = [];

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Constraint form", () => {
  it("uses governed linkage selectors and requires a derivation rationale", async () => {
    const repository = new DexieWorkspaceRepository(
      `constraint-form-${crypto.randomUUID()}`,
    );
    repositories.push(repository);
    await loadSeedData(repository);
    const user = userEvent.setup();

    render(
      <RepositoryProvider repository={repository}>
        <MemoryRouter initialEntries={["/constraints/new"]}>
          <Routes>
            <Route
              element={<ConstraintFormPage />}
              path="/constraints/new"
            />
          </Routes>
        </MemoryRouter>
      </RepositoryProvider>,
    );

    expect(
      await screen.findByRole("combobox", {
        name: "Constitution Article",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Constraint Blueprint" }),
    ).toBeVisible();
    expect(
      await screen.findByText(
        "Signature-product quality and value perception cannot be compromised for short-term traffic.",
      ),
    ).toBeVisible();

    const rationale = screen.getByRole("textbox", {
      name: "Derivation rationale",
    });
    await user.clear(rationale);
    await user.click(screen.getByRole("button", { name: "Save Draft" }));

    expect(
      await screen.findByText("Derivation rationale is required"),
    ).toBeVisible();
  });
});
