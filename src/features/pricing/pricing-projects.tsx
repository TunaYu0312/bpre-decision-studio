import {
  ArrowRight,
  CalendarDays,
  Database,
  FlaskConical,
  Plus,
  Tags,
} from "lucide-react";
import { Link } from "react-router";

import { seedPricingProjects } from "@/data/pricing-seed";

export function PricingProjectsPage() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">BPR&E Menu Pricing Decision Studio</p>
          <h1 className="page-title">Pricing Projects</h1>
          <p className="page-description">
            Decide which menu prices to change, by how much, and under what
            rollout conditions—with demand, product mix, gross profit, customer
            value, and uncertainty visible.
          </p>
        </div>
        <button
          className="button button--primary"
          disabled
          title="Project creation is planned for the next implementation slice."
          type="button"
        >
          <Plus aria-hidden="true" size={16} />
          Create Pricing Project
        </button>
      </div>

      <div className="pricing-principle mt-7">
        <strong>Focused MVP</strong>
        <span>
          Baseline → Price Sensitivity → Scenarios → Decision → Pilot Review
        </span>
        <p>
          No automatic optimal price. Every recommendation exposes its evidence,
          assumptions, and downside case.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <SummaryCard
          icon={Tags}
          label="Active pricing projects"
          value={seedPricingProjects.length}
        />
        <SummaryCard
          icon={Database}
          label="Verified baselines"
          value={
            seedPricingProjects.filter(
              (project) => project.dataReadiness === "Verified baseline",
            ).length
          }
        />
        <SummaryCard
          icon={FlaskConical}
          label="Research pending"
          value={
            seedPricingProjects.filter(
              (project) => project.researchStatus === "Not started",
            ).length
          }
        />
        <SummaryCard icon={CalendarDays} label="Decision-ready" value={0} />
      </div>

      <section className="pricing-project-list mt-7">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Active work</p>
            <h2>Current price decisions</h2>
          </div>
          <span>{seedPricingProjects.length} project</span>
        </div>

        <div className="mt-5 space-y-3">
          {seedPricingProjects.map((project) => (
            <article className="pricing-project-card" key={project.id}>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="soft-tag">{project.projectCode}</span>
                  <span className="pricing-status pricing-status--ready">
                    {project.stage}
                  </span>
                  <span className="pricing-status pricing-status--pending">
                    Price Sensitivity Study pending
                  </span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.scope}</p>
                <dl className="pricing-project-meta">
                  <div>
                    <dt>Owner</dt>
                    <dd>{project.owner}</dd>
                  </div>
                  <div>
                    <dt>Items</dt>
                    <dd>{project.affectedItems}</dd>
                  </div>
                  <div>
                    <dt>Baseline</dt>
                    <dd>13 weeks</dd>
                  </div>
                  <div>
                    <dt>Effective date</dt>
                    <dd>{project.proposedEffectiveDate}</dd>
                  </div>
                </dl>
              </div>
              <Link
                aria-label={`Open baseline for ${project.title}`}
                className="button button--primary"
                to={`/pricing/${project.id}/baseline`}
              >
                Open baseline
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tags;
  label: string;
  value: number;
}) {
  return (
    <article className="pricing-summary-card">
      <Icon aria-hidden="true" size={18} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
