import {
  BookOpenCheck,
  CalendarRange,
  Gauge,
  LayoutDashboard,
  LibraryBig,
  ListChecks,
  Network,
  PanelsTopLeft,
  ScrollText,
} from "lucide-react";

export const navigationItems = [
  { label: "Home", to: "/home", icon: LayoutDashboard },
  {
    label: "Decision Agenda",
    to: "/decision-agenda",
    icon: CalendarRange,
  },
  {
    label: "Decision Workspace",
    to: "/decisions/decision-breakfast-combo-pilot",
    icon: PanelsTopLeft,
  },
  {
    label: "Review & Follow-up",
    to: "/review-follow-up",
    icon: ListChecks,
  },
] as const;

export const governanceItems = [
  {
    label: "Decision Constitutions",
    to: "/constitutions",
    icon: BookOpenCheck,
  },
  {
    label: "Constraint Library",
    to: "/constraints",
    icon: LibraryBig,
  },
  {
    label: "Rule Derivation",
    to: "/constraints/constraint-brand-discount-limit",
    icon: Network,
  },
  {
    label: "Version History",
    to: "/constitutions",
    icon: ScrollText,
  },
] as const;

export const meetingLifecycle = [
  "Prepared",
  "Evaluated",
  "Meeting",
  "Action",
  "Review",
] as const;
