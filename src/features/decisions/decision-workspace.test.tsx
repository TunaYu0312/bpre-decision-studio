import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData, seedDecisionProject } from "@/data/seed";

import { DecisionWorkspacePage } from "./decision-workspace";

const repositories: DexieWorkspaceRepository[] = [];

async function renderWorkspace() {
  const repository = new DexieWorkspaceRepository(
    `decision-workspace-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  await loadSeedData(repository);

  render(
    <RepositoryProvider repository={repository}>
      <MemoryRouter initialEntries={[`/decisions/${seedDecisionProject.id}`]}>
        <Routes>
          <Route
            element={<DecisionWorkspacePage />}
            path="/decisions/:id"
          />
        </Routes>
      </MemoryRouter>
    </RepositoryProvider>,
  );

  return { repository, user: userEvent.setup() };
}

afterEach(async () => {
  await Promise.all(repositories.splice(0).map((repository) => repository.reset()));
});

describe("Decision Meeting Workspace", () => {
  it("presents the decision narrative, recommendation, and relevant governance", async () => {
    await renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Should we approve a 10-day breakfast combo pilot across 30 stores?",
      }),
    ).toBeVisible();
    expect(screen.getByText("REVISION REQUIRED")).toBeVisible();
    expect(screen.getByText("-$4K")).toBeVisible();
    expect(screen.getByText("Short-term morning traffic growth")).toBeVisible();
    expect(screen.getByText("4 Passed")).toBeVisible();
    expect(screen.getByText("2 Require Revision")).toBeVisible();
    expect(screen.getByText("1 Requires Escalation")).toBeVisible();
    expect(screen.getAllByText("RULE-BR-001")).toHaveLength(1);
    expect(
      screen.getByText(
        "Signature-product quality and value perception cannot be compromised for short-term traffic.",
      ),
    ).toBeVisible();
  });

  it("opens a read-only source drawer for an applied constraint", async () => {
    const { user } = await renderWorkspace();

    const constraint = await screen.findByRole("button", {
      name: "Incremental EBITDA must be non-negative",
    });
    await user.click(constraint);

    expect(
      screen.getByRole("heading", { name: "Constraint Source" }),
    ).toBeVisible();
    expect(screen.getByText("Economic Box Discipline")).toBeVisible();
    expect(
      screen.getByText("Prevent value-destructive projects from approval"),
    ).toBeVisible();
    expect(screen.getByText("CEO only")).toBeVisible();
  });

  it("requires a rationale before recording the human decision and action plan", async () => {
    const { user } = await renderWorkspace();

    await user.click(
      await screen.findByRole("button", { name: "Return for Revision" }),
    );

    expect(
      screen.getByRole("heading", {
        name: "Final Decision and Action Plan",
      }),
    ).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Final Decision" })).toHaveValue(
      "Revise",
    );

    await user.click(
      screen.getByRole("button", { name: "Record Human Decision" }),
    );
    expect(
      await screen.findByText("Decision rationale is required"),
    ).toBeVisible();

    await user.type(
      screen.getByRole("textbox", { name: "Decision rationale" }),
      "Revise the offer mechanics and restore non-negative EBITDA.",
    );
    await user.click(
      screen.getByRole("button", { name: "Record Human Decision" }),
    );

    expect(await screen.findByText("Decision recorded")).toBeVisible();
    expect(screen.getByText("Finalize revised offer mechanics")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: "Decision Record and Review Timeline",
      }),
    ).toBeVisible();
  });
});
