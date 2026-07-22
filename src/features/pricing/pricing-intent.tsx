import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  PackagePlus,
  RefreshCw,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import { seedPricingProjects } from "@/data/pricing-seed";

import { PricingFlow } from "./pricing-flow";

const adjustmentObjectives = [
  {
    title: "Margin recovery",
    description:
      "Improve gross profit dollars and EBITDA while protecting traffic and value anchors.",
  },
  {
    title: "Gradual low-perception increase",
    description:
      "Use smaller, targeted moves and phase timing to reduce customer notice and demand shock.",
  },
  {
    title: "One-step price reset",
    description:
      "Correct a material price gap in one wave, accepting greater traffic and value-perception risk.",
  },
  {
    title: "Value restoration",
    description:
      "Lower selected visible prices to rebuild traffic, affordability, or Good Value for Money.",
  },
  {
    title: "Price architecture rebalance",
    description:
      "Change entry, signature, premium, bundle, and add-on relationships rather than applying one rate.",
  },
];

export function PricingIntentPage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);

  if (!project) return <Navigate replace to="/pricing" />;

  return (
    <section className="mx-auto max-w-[1500px]">
      <Link className="back-link" to="/pricing">
        <ArrowLeft aria-hidden="true" size={15} />
        Pricing Projects
      </Link>
      <PricingFlow active="intent" projectId={project.id} />

      <div className="page-header mt-6">
        <div>
          <p className="eyebrow">Step 1 · Define the meeting logic</p>
          <h1 className="page-title">What pricing decision are we making?</h1>
          <p className="page-description">
            Existing-menu adjustments and new-product pricing require different
            evidence, questions, and approval logic. Select the decision type
            before preparing analysis.
          </p>
        </div>
        <Link className="button button--primary" to={`/pricing/${project.id}/baseline`}>
          Start Menu Analysis
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="decision-type-grid mt-7">
        <article className="decision-type-card decision-type-card--selected">
          <RefreshCw aria-hidden="true" size={22} />
          <span>Selected template</span>
          <h2>Existing menu price adjustment</h2>
          <p>
            Starts with current menu roles, observed Product Mix, contribution
            margin, price response, substitution, and traffic impact.
          </p>
          <strong><CircleCheck size={15} /> Active for this project</strong>
        </article>
        <article className="decision-type-card">
          <PackagePlus aria-hidden="true" size={22} />
          <span>Separate template</span>
          <h2>New product pricing</h2>
          <p>
            Starts with target role and price architecture, then willingness to
            pay, analog products, trial, repeat, and cannibalization. It cannot
            rely on historical item UPH.
          </p>
          <strong>Template defined · not this project</strong>
        </article>
      </div>

      <section className="pricing-intent-panel mt-5">
        <div>
          <p className="eyebrow">Selected objective</p>
          <h2>{project.objective}</h2>
          <p>{project.decisionQuestion}</p>
        </div>
        <div className="objective-grid">
          {adjustmentObjectives.map((objective) => (
            <article
              className={objective.title === project.objective ? "objective-card objective-card--selected" : "objective-card"}
              key={objective.title}
            >
              <strong>{objective.title}</strong>
              <p>{objective.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-intent-panel mt-5">
        <div>
          <p className="eyebrow">Agreed pricing principles</p>
          <h2>What must remain true across every option?</h2>
        </div>
        <ol className="principle-list">
          {project.pricingPrinciples.map((principle, index) => (
            <li key={principle}>
              <span>{index + 1}</span>
              {principle}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
