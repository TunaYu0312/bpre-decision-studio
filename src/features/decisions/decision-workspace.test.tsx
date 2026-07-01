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
  it("opens on Decision Project with four meeting cards and hides standalone governance tabs", async () => {
    await renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Should we approve a 10-day breakfast combo pilot across 30 stores?",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: "Decision Project" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Data Facts" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Decision" })).toBeVisible();
    expect(
      screen.getByRole("tab", { name: "Execution & Review" }),
    ).toBeVisible();
    expect(screen.queryByRole("tab", { name: /Decision Brief/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /Rules & Exceptions/ })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Who Are We Trying to Serve?" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Which Strategic Rules Apply?" }),
    ).not.toBeInTheDocument();
  });

  it("shows the decision project context before numbers, recommendations, or rules", async () => {
    await renderWorkspace();

    expect(await screen.findByText("Decision Project Name")).toBeVisible();
    expect(screen.getByText("DP-2026-001")).toBeVisible();
    expect(screen.getByText("Why Now")).toBeVisible();
    expect(
      screen.getByText(
        "Morning traffic is below target in selected trade areas. The team proposes a bundle offer to improve customer conversion during breakfast hours.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Business Objective")).toBeVisible();
    expect(screen.getByText(/Core frequency customers/)).toBeVisible();
    expect(
      screen.getAllByText("Approve / Revise / Escalate the 30-store pilot")[0],
    ).toBeVisible();
    expect(screen.queryByRole("heading", { name: "REVISION REQUIRED" })).not.toBeInTheDocument();
    expect(screen.queryByText("Expected Incremental EBITDA")).not.toBeInTheDocument();
  });

  it("keeps facts separate from options, recommendations, and rules", async () => {
    const { user } = await renderWorkspace();

    await user.click(await screen.findByRole("tab", { name: "Data Facts" }));

    expect(screen.getAllByText("Expected Incremental EBITDA")[0]).toBeVisible();
    expect(screen.getByText("-$4K")).toBeVisible();
    expect(screen.getByText("Verified")).toBeVisible();
    expect(screen.getByText("View Data Sources and Assumptions")).toBeVisible();
    expect(screen.queryByText("B. Revised bundle pilot")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "REVISION REQUIRED" })).not.toBeInTheDocument();
    expect(screen.queryByText("Incremental EBITDA must be non-negative")).not.toBeInTheDocument();
  });

  it("shows options, trade-offs, BPR&E assessment, recommendation, and contextual rules on the decision card", async () => {
    const { user } = await renderWorkspace();

    await user.click(await screen.findByRole("tab", { name: "Decision" }));

    expect(
      screen.getByRole("heading", { name: "REVISION REQUIRED" }),
    ).toBeVisible();
    expect(screen.getAllByText("B. Revised bundle pilot")[0]).toBeVisible();
    expect(screen.getByText("Recommended Option")).toBeVisible();
    expect(screen.getByText("BPR&E Assessment")).toBeVisible();
    expect(screen.getAllByText("Brand")[0]).toBeVisible();
    expect(
      screen.getByText("Improve projected incremental EBITDA to non-negative."),
    ).toBeVisible();
    expect(
      screen.getAllByText("Incremental EBITDA must be non-negative")[0],
    ).toBeVisible();
    expect(screen.getByText("4 Passed")).toBeVisible();
    expect(screen.getByText("2 Require Revision")).toBeVisible();
    expect(screen.getByText("1 Requires Escalation")).toBeVisible();
  });

  it("opens a read-only source drawer for an applied constraint", async () => {
    const { user } = await renderWorkspace();

    await user.click(await screen.findByRole("tab", { name: "Decision" }));

    expect(screen.getAllByText("RULE-BR-001")).toHaveLength(1);
    expect(
      screen.getByText(
        "Signature-product quality and value perception cannot be compromised for short-term traffic.",
      ),
    ).toBeVisible();

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
    await user.click(screen.getByRole("tab", { name: "Execution & Review" }));

    expect(
      screen.getByRole("heading", {
        name: "Final Decision and Action Plan",
      }),
    ).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Final Decision" })).toHaveValue(
      "Revise",
    );
    expect(screen.getByText("Ownership Model")).toBeVisible();
    expect(screen.getByText("Execution Owner")).toBeVisible();
    expect(screen.getAllByText("Data Owner")[0]).toBeVisible();

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
