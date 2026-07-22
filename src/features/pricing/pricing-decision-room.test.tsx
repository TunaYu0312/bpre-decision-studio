import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";

import { PricingDecisionRoomPage } from "./pricing-decision-room";

function renderRoom(stage: string) {
  return render(
    <MemoryRouter
      initialEntries={[
        `/pricing/pricing-core-menu-2026/room/${stage}`,
      ]}
    >
      <Routes>
        <Route
          element={<PricingDecisionRoomPage />}
          path="/pricing/:id/room/:stage?"
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("menu pricing decision room", () => {
  it("uses the five PRD meeting pages as the primary flow", () => {
    renderRoom("current");

    expect(
      screen.getByRole("heading", { name: "今天究竟要决定什么？" }),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "定价决策会议流程" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /共同事实/ })).toHaveAttribute(
      "href",
      "/pricing/pricing-core-menu-2026/room/facts",
    );
    expect(screen.getByText("六类必填范围")).toBeVisible();
  });

  it("shows traceable common facts across market, customer, and store", () => {
    renderRoom("facts");

    expect(
      screen.getByRole("heading", { name: "哪些事实足以支持讨论？" }),
    ).toBeVisible();
    expect(screen.getByText("8条事实 · 1条争议 · 1项低质量假设")).toBeVisible();
    expect(screen.getByText("商圈—顾客—门店")).toBeVisible();
    expect(screen.getByText("A套餐单位成本上升")).toBeVisible();
  });

  it("keeps no-action as a baseline and calculates net contribution", () => {
    renderRoom("options");

    expect(screen.getByText("方案0 · 维持现状")).toBeVisible();
    expect(screen.getAllByText("方案D · 30店受控试点").length).toBeGreaterThan(0);
    expect(screen.getByText("真实经营贡献")).toBeVisible();
    expect(screen.getAllByText("CN¥238K").length).toBeGreaterThan(0);
  });

  it("runs an operations analysis and requires confirmation before writeback", async () => {
    const user = userEvent.setup();
    renderRoom("evidence");

    await user.click(
      screen.getByRole("button", { name: "运行预设运营情景分析" }),
    );
    expect(screen.getAllByText("Result awaiting review").length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: "人工确认并回写方案" }),
    );
    expect(screen.getByText("已更新共同事实及方案B、D")).toBeVisible();
  });

  it("turns the selected pilot into execution and review commitments", () => {
    renderRoom("decision");

    expect(
      screen.getByRole("heading", {
        name: "决定如何变成可验证的行动？",
      }),
    ).toBeVisible();
    expect(screen.getByText("30家试点 + 15家对照")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /导出 Markdown 纪要/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /决策者确认并冻结/ }),
    ).toBeVisible();
  });
});
