import { Circle, CircleCheck, CircleOff, History } from "lucide-react";

const statusStyles: Record<string, string> = {
  Active: "status-badge--active",
  Draft: "status-badge--draft",
  Superseded: "status-badge--historical",
  Invalidated: "status-badge--danger",
  Archived: "status-badge--historical",
  Suspended: "status-badge--warning",
  Retired: "status-badge--historical",
};

export function StatusBadge({ status }: { status: string }) {
  const Icon =
    status === "Active"
      ? CircleCheck
      : status === "Draft"
        ? Circle
        : status === "Invalidated"
          ? CircleOff
          : History;

  return (
    <span className={`status-badge ${statusStyles[status] ?? ""}`}>
      <Icon aria-hidden="true" size={13} />
      {status}
    </span>
  );
}
