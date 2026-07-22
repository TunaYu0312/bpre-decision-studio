import type { DecisionProject } from "@/domain/decision-project";

export function getUpcomingReviews(
  projects: DecisionProject[],
  today = new Date(),
) {
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return projects
    .flatMap((project) =>
      project.timeline
        .filter(
          (event) =>
            event.eventType === "Review Due" && event.date >= todayKey,
        )
        .map((event) => ({ ...event, project })),
    )
    .sort((left, right) => left.date.localeCompare(right.date));
}
