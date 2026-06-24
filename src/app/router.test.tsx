import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "./router";

describe("application routes", () => {
  it("renders the product title on the public demo route", () => {
    render(
      <MemoryRouter initialEntries={["/demo"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "BPR&E Decision Studio" }),
    ).toBeInTheDocument();
  });
});
