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
  it("opens on Decision Brief with five meeting-flow tabs and hides dense governance detail", async () => {
    await renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Should we approve a 10-day breakfast combo pilot across 30 stores?",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /Decision Brief/ }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Decision Card/ })).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /Evidence & Options/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /Rules & Exceptions/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("tab", { name: /Decision & Follow-up/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Who Are We Trying to Serve?" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Which Strategic Rules Apply?" }),
    ).not.toBeInTheDocument();
  });

  it("summarizes the recommendation, reasons, trade-off, option, and action on the brief tab", async () => {
    await renderWorkspace();

    expect(
      await screen.findByRole("heading", { name: "REVISION REQUIRED" }),
    ).toBeVisible();
    expect(
      screen.getAllByText("Approve / Revise / Escalate the 30-store pilot")[0],
    ).toBeVisible();
    expect(
      screen.getByText("Short-term morning traffic growth"),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Signature-product value perception, Store-level EBITDA, and peak-period service capacity",
      ),
    ).toBeVisible();
    expect(screen.getByText("B. Revised bundle pilot")).toBeVisible();
    expect(
      screen.getByText("Improve projected incremental EBITDA to non-negative."),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Return for Revision" }),
    ).toBeVisible();
  });

  it("reveals the decision card and evidence only when their tabs are selected", async () => {
    const { user } = await renderWorkspace();

    expect(screen.queryByText("Business Objective")).not.toBeInTheDocument();

    await user.click(await screen.findByRole("tab", { name: /Decision Card/ }));

    expect(screen.getByText("Business Objective")).toBeVisible();
    expect(screen.getByText(/Core frequency customers/)).toBeVisible();
    expect(
      screen.getByText("Pilot investment envelope: $22K gross discount and enablement cost"),
    ).toBeVisible();
    expect(screen.getByText("Day 30 review due.")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: /Evidence & Options/ }));

    expect(screen.getAllByText("Expected Incremental EBITDA")[0]).toBeVisible();
    expect(screen.getByText("-$4K")).toBeVisible();
    expect(screen.getByText("Verified")).toBeVisible();
    expect(screen.getByText("A. Launch proposed pilot")).toBeVisible();
    expect(screen.getByText("View Data Sources and Assumptions")).toBeVisible();
  });

  it("opens a read-only source drawer for an applied constraint", async () => {
    const { user } = await renderWorkspace();

    await user.click(
      await screen.findByRole("tab", { name: /Rules & Exceptions/ }),
    );

    expect(screen.getByText("4 Passed")).toBeVisible();
    expect(screen.getByText("2 Require Revision")).toBeVisible();
    expect(screen.getByText("1 Requires Escalation")).toBeVisible();
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
    await user.click(screen.getByRole("tab", { name: /Decision & Follow-up/ }));

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
