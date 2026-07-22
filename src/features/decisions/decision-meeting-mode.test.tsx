import "fake-indexeddb/auto";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { DexieWorkspaceRepository } from "@/data/dexie-repository";
import { RepositoryProvider } from "@/data/repository-provider";
import { loadSeedData, seedDecisionProject } from "@/data/seed";

import { DecisionMeetingModePage } from "./decision-meeting-mode";

const repositories: DexieWorkspaceRepository[] = [];

async function renderMeetingMode() {
  const repository = new DexieWorkspaceRepository(
    `decision-meeting-mode-${crypto.randomUUID()}`,
  );
  repositories.push(repository);
  await loadSeedData(repository);

  render(
    <RepositoryProvider repository={repository}>
      <MemoryRouter
        initialEntries={[`/decisions/${seedDecisionProject.id}/meeting`]}
      >
        <Routes>
          <Route
            element={<DecisionMeetingModePage />}
            path="/decisions/:id/meeting"
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

describe("Decision Meeting Mode", () => {
  it("opens on a low-density Decision Brief instead of the detailed workspace", async () => {
    await renderMeetingMode();

    expect(
      await screen.findByRole("heading", {
        name: "What decision is required today?",
      }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Meeting Mode" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("REVISION REQUIRED")).toBeVisible();
    expect(screen.getByText("Decision needed today")).toBeVisible();
    expect(screen.getByText("Decision Owner")).toBeVisible();
    expect(screen.getByText("Execution Owner")).toBeVisible();
    expect(screen.getByText("North Star")).toBeVisible();
    expect(screen.getByText("Meeting Deadline")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("BPR&E Assessment")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Incremental EBITDA must be non-negative"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Return for Revision" }),
    ).not.toBeInTheDocument();
  });

  it("uses a five-page presentation sequence with progressive disclosure", async () => {
    const { user } = await renderMeetingMode();

    await screen.findByRole("heading", {
      name: "What decision is required today?",
    });

    await user.click(screen.getByRole("button", { name: /2\s*Facts/ }));
    expect(
      screen.getByRole("heading", {
        name: "What do we know, and what is still uncertain?",
      }),
    ).toBeVisible();
    expect(screen.getAllByText("Expected Traffic Uplift")[0]).toBeVisible();
    expect(screen.getByText("+12%")).toBeVisible();
    expect(screen.getByText("Key uncertainty")).toBeVisible();
    expect(screen.getByText("View Evidence Detail")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /3\s*Options/ }));
    expect(
      screen.getByRole("heading", {
        name: "What are the real choices and trade-offs?",
      }),
    ).toBeVisible();
    expect(screen.getByText("Current Proposal")).toBeVisible();
    expect(screen.getByText("Revised Bundle")).toBeVisible();
    expect(screen.getByText("No Launch")).toBeVisible();
    expect(screen.getByText("Requires more store preparation")).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /4\s*Risks/ }));
    expect(
      screen.getByRole("heading", {
        name: "What must be revised, escalated, or accepted?",
      }),
    ).toBeVisible();
    expect(
      screen.getAllByText("No standalone deep discount on signature products")[0],
    ).toBeVisible();
    expect(screen.getAllByText("Why this rule applies?")[0]).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /5\s*Commitments/ }));
    expect(
      screen.getByRole("heading", {
        name: "What decision and responsibilities are locked?",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Return for Revision" }),
    ).toBeVisible();
    expect(screen.getByText("Data Owner")).toBeVisible();
    expect(screen.getByText("Action plan")).toBeVisible();
  });
});
