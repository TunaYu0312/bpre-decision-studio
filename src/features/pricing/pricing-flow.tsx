import { NavLink } from "react-router";

const steps = [
  { key: "intent", label: "Decision Intent" },
  { key: "baseline", label: "Menu Analysis" },
  { key: "research", label: "Price Response" },
  { key: "scenarios", label: "Options" },
  { key: "decision", label: "Decision & Action" },
] as const;

export function PricingFlow({
  active,
  projectId,
}: {
  active: (typeof steps)[number]["key"];
  projectId: string;
}) {
  return (
    <nav aria-label="Pricing decision steps" className="pricing-flow">
      {steps.map((step, index) => (
        <NavLink
          aria-current={active === step.key ? "step" : undefined}
          className={active === step.key ? "pricing-flow-step pricing-flow-step--active" : "pricing-flow-step"}
          key={step.key}
          to={`/pricing/${projectId}/${step.key}`}
        >
          <span>{index + 1}</span>
          {step.label}
        </NavLink>
      ))}
    </nav>
  );
}
