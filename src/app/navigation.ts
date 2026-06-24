import {
  BookOpenCheck,
  ClipboardCheck,
  FileStack,
  Gauge,
  LibraryBig,
  ListChecks,
  Settings,
} from "lucide-react";

export const navigationItems = [
  { label: "Overview", to: "/demo", icon: Gauge, enabled: true },
  {
    label: "Decision Constitutions",
    to: "/constitutions",
    icon: BookOpenCheck,
    enabled: true,
  },
  {
    label: "Constraint Library",
    to: "/constraints",
    icon: LibraryBig,
    enabled: true,
  },
  {
    label: "Decision Projects",
    to: "/decision-projects",
    icon: FileStack,
    enabled: false,
  },
  {
    label: "Evaluation Queue",
    to: "/evaluation",
    icon: ClipboardCheck,
    enabled: false,
  },
  {
    label: "Action & Review",
    to: "/action-review",
    icon: ListChecks,
    enabled: false,
  },
  {
    label: "Export / Settings",
    to: "/settings",
    icon: Settings,
    enabled: false,
  },
] as const;

export const decisionFlow = [
  { label: "Constitution", enabled: true },
  { label: "Constraints", enabled: true },
  { label: "Decision Card", enabled: false },
  { label: "Evaluation", enabled: false },
  { label: "Action", enabled: false },
  { label: "Review", enabled: false },
] as const;
