import {
  ArrowLeft,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  RotateCcw,
  UserRoundCheck,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import {
  seedPricingProjects,
  seedPricingScenarios,
} from "@/data/pricing-seed";
import {
  calculateBaselineEconomics,
  calculateScenarioForecast,
} from "@/domain/pricing";

import {
  currencyFormatter,
  decimalFormatter,
  percentFormatter,
  signedCurrency,
  signedPercent,
} from "./pricing-format";
import { PricingFlow } from "./pricing-flow";

export function PricingDecisionPage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);

  if (!project) return <Navigate replace to="/pricing" />;

  const scenario =
    seedPricingScenarios.find((candidate) => candidate.isRecommended) ??
    seedPricingScenarios[0];
  const forecast = calculateScenarioForecast(project, scenario);
  const baseline = calculateBaselineEconomics(
    project.items,
    project.transactions,
    { periodDays: project.periodDays, storeCount: project.storeCount },
  );

  return (
    <section className="mx-auto max-w-[1400px]">
      <Link className="back-link" to={`/pricing/${project.id}/scenarios`}>
        <ArrowLeft aria-hidden="true" size={15} />
        Options
      </Link>
      <PricingFlow active="decision" projectId={project.id} />

      <div className="decision-brief-header mt-6">
        <div>
          <p className="eyebrow">Step 5 · Decision & action plan</p>
          <h1>{project.decisionQuestion}</h1>
        </div>
        <span className="pricing-status pricing-status--pending">
          Human decision required
        </span>
      </div>

      <div className="pricing-decision-grid mt-5">
        <section className="recommendation-hero">
          <span>Current recommendation</span>
          <h2>Approve a controlled pilot</h2>
          <strong>{scenario.name}</strong>
          <p>
            It improves forecast gross profit while protecting signature and
            entry-price anchors. Rollout remains inappropriate until assumed
            ADTC, UPH, and substitution effects are observed.
          </p>
          <div className="decision-impact-row">
            <Impact label="EBITDA impact" value={signedCurrency(forecast.ebitdaImpact)} />
            <Impact label="ADTC change" value={signedPercent(forecast.trafficChange)} />
            <Impact label="GM change" value={signedCurrency(forecast.grossProfit - baseline.grossProfit)} />
            <Impact label="VFM index" value={`${scenario.valueForMoneyIndex}`} />
          </div>
          <div className="decision-button-row">
            <button className="button button--primary" type="button">Approve pilot</button>
            <button className="button button--secondary" type="button">Revise option</button>
            <button className="button button--secondary" type="button">Hold current price</button>
          </div>
        </section>

        <aside className="decision-reason-panel">
          <p className="eyebrow">Why this recommendation</p>
          <ul>
            <li><CircleCheck size={17} />Entry Americano and signature bundle prices remain protected.</li>
            <li><CircleCheck size={17} />Forecast gross profit and EBITDA improve after implementation cost.</li>
            <li><CircleCheck size={17} />Price moves remain below stated Good Value break points for key items.</li>
            <li><CircleAlert size={17} />Traffic and cannibalization inputs are assumptions, not observed evidence.</li>
          </ul>
          <dl>
            <div><dt>Forecast ADS</dt><dd>{currencyFormatter.format(forecast.ads)}</dd></div>
            <div><dt>Forecast ADTC</dt><dd>{decimalFormatter.format(forecast.adtc)}</dd></div>
            <div><dt>Forecast GM%</dt><dd>{percentFormatter.format(forecast.grossMargin)}</dd></div>
            <div><dt>Brand risk</dt><dd>{scenario.brandRisk}</dd></div>
          </dl>
        </aside>
      </div>

      <section className="action-plan-panel mt-5">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Execution commitment</p>
            <h2>What happens after approval?</h2>
          </div>
          <span>Pilot · measure · decide</span>
        </div>
        <div className="action-plan-grid mt-5">
          <Action icon={UserRoundCheck} label="Owner" value="Commercial Director" detail="Co-owner: Finance Director" />
          <Action icon={CalendarCheck} label="Pilot" value="10 matched stores · 4 weeks" detail="Dine-in and takeaway; no overlapping promotion" />
          <Action icon={CircleCheck} label="Success gates" value="GM dollars ≥ +3%; ADTC ≥ −1.5%" detail="VFM ≥ 97; no signature-item UPH decline beyond −3%" />
          <Action icon={RotateCcw} label="Exit rule" value="Stop or revise after 2 consecutive weeks" detail="If ADTC < −2%, VFM < 95, or EBITDA uplift is negative" />
        </div>
      </section>
    </section>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function Action({
  detail,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  icon: typeof UserRoundCheck;
  label: string;
  value: string;
}) {
  return (
    <article>
      <Icon aria-hidden="true" size={19} />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
