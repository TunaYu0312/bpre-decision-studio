import {
  ArrowLeft,
  BarChart3,
  ChartSpline,
  CircleAlert,
  FlaskConical,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import { seedPricingProjects } from "@/data/pricing-seed";

export function PriceSensitivityPage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);

  if (!project) {
    return <Navigate replace to="/pricing" />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <Link className="back-link" to={`/pricing/${project.id}/baseline`}>
        <ArrowLeft aria-hidden="true" size={15} />
        Baseline &amp; Research
      </Link>

      <div className="page-header mt-5">
        <div>
          <p className="eyebrow">Price Sensitivity · Step 2 of 4</p>
          <h1 className="page-title">How will customers respond to price?</h1>
          <p className="page-description">
            Use research to define acceptable price ranges and stated purchase
            intent, then calibrate it with observed demand evidence. Survey
            response is not treated as actual elasticity.
          </p>
        </div>
      </div>

      <div className="research-warning mt-7">
        <CircleAlert aria-hidden="true" size={19} />
        <div>
          <strong>Research has not started</strong>
          <p>
            Rollout approval will remain blocked until price-response evidence or
            an explicit pilot design is attached.
          </p>
        </div>
      </div>

      <div className="research-method-grid mt-5">
        <MethodCard
          icon={ChartSpline}
          label="Recommended first"
          title="Van Westendorp PSM"
          purpose="Find the perceived acceptable range for signature and entry-price items."
          outputs={[
            "Marginal cheapness and expensiveness",
            "Acceptable price range",
            "Indifference and method-defined optimal points",
          ]}
        />
        <MethodCard
          icon={BarChart3}
          label="Candidate prices"
          title="Gabor–Granger"
          purpose="Test purchase intent at the discrete prices the team may actually use."
          outputs={[
            "Stated demand curve",
            "Revenue and gross-profit index",
            "Sharp purchase-intent drop points",
          ]}
        />
        <MethodCard
          icon={FlaskConical}
          label="Behavioral calibration"
          title="Observed price test"
          purpose="Estimate actual own-price response and substitution in a controlled store pilot."
          outputs={[
            "Observed elasticity range",
            "UPH and traffic response",
            "Cross-item substitution",
          ]}
        />
      </div>

      <section className="research-plan mt-5">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommended design</p>
            <h2>Study plan for this project</h2>
          </div>
          <span>3 evidence layers</span>
        </div>
        <ol className="research-steps mt-5">
          <li>
            <span>1</span>
            <div>
              <strong>Protect value anchors</strong>
              <p>
                Run PSM for the Signature Breakfast Set and Americano to define
                the acceptable price range and “too expensive” risk by segment.
              </p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Test real candidate prices</strong>
              <p>
                Use Gabor–Granger for the specific price points under
                consideration; include the product description and bundle context.
              </p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Calibrate stated intent</strong>
              <p>
                Use a limited store test or historical price variation to estimate
                actual UPH, traffic, and substitution response before rollout.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </section>
  );
}

function MethodCard({
  icon: Icon,
  label,
  outputs,
  purpose,
  title,
}: {
  icon: typeof ChartSpline;
  label: string;
  outputs: string[];
  purpose: string;
  title: string;
}) {
  return (
    <article className="research-method-card">
      <div className="research-method-icon">
        <Icon aria-hidden="true" size={20} />
      </div>
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{purpose}</p>
      <ul>
        {outputs.map((output) => (
          <li key={output}>{output}</li>
        ))}
      </ul>
    </article>
  );
}
