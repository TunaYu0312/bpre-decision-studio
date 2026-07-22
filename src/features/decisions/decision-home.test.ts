import { describe, expect, it } from "vitest";

import { seedDecisionProject } from "@/data/seed";

import { getUpcomingReviews } from "./decision-home-utils";

describe("decision home review calendar", () => {
  it("shows only review deadlines that are today or later", () => {
    const reviews = getUpcomingReviews(
      [seedDecisionProject],
      new Date("2026-06-25T00:00:00"),
    );

    expect(reviews.map((review) => review.date)).toEqual(["2026-07-14"]);
  });
});
