import {
  ChartNoAxesCombined,
  FlaskConical,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Pricing Projects",
    to: "/pricing",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Active Pricing Meeting",
    to: "/pricing/pricing-core-menu-2026/room/current",
    icon: FlaskConical,
  },
] as const;

export const meetingLifecycle = [
  "Prepared",
  "Evaluated",
  "Meeting",
  "Action",
  "Review",
] as const;
