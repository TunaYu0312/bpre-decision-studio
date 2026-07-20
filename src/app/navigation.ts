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
    label: "Baseline & Research",
    to: "/pricing/pricing-core-menu-2026",
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
