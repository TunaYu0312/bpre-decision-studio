import {
  ArrowLeft,
  ArrowRight,
  ChartSpline,
  CircleAlert,
  Database,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";

import {
  seedPriceResponseCurves,
  seedPriceResponseSignals,
  seedPricingProjects,
  seedPricingScenarios,
} from "@/data/pricing-seed";
import type { PriceResponseCurve } from "@/domain/pricing";

import { priceFormatter } from "./pricing-format";
import { PricingFlow } from "./pricing-flow";

export function PriceSensitivityPage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);
  const [itemId, setItemId] = useState("signature-breakfast-set");

  if (!project) return <Navigate replace to="/pricing" />;

  const curve =
    seedPriceResponseCurves.find((record) => record.itemId === itemId) ??
    seedPriceResponseCurves[0];
  const item = project.items.find((record) => record.id === curve.itemId)!;
  const signal = seedPriceResponseSignals.find(
    (record) => record.itemId === curve.itemId,
  );
  const candidatePrices = seedPricingScenarios.map((scenario) => ({
    label: scenario.name.split(" · ")[0],
    price:
      scenario.items.find((record) => record.itemId === curve.itemId)
        ?.proposedListPrice ?? item.listPrice,
  }));

  return (
    <section className="mx-auto max-w-[1500px]">
      <Link className="back-link" to={`/pricing/${project.id}/baseline`}>
        <ArrowLeft aria-hidden="true" size={15} />
        Menu Analysis
      </Link>
      <PricingFlow active="research" projectId={project.id} />

      <div className="page-header mt-6">
        <div>
          <p className="eyebrow">Step 3 · Price response evidence</p>
          <h1 className="page-title">Where does customer response change?</h1>
          <p className="page-description">
            Compare stated price sensitivity with normalized historical
            price–UPH evidence. The two curves answer different questions and
            remain visibly separate.
          </p>
        </div>
        <Link className="button button--primary" to={`/pricing/${project.id}/scenarios`}>
          Compare Pricing Options
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="research-warning mt-7">
        <CircleAlert aria-hidden="true" size={19} />
        <div>
          <strong>Illustrative evidence, not a completed client study</strong>
          <p>
            Curve values demonstrate the meeting workflow. A production
            recommendation requires documented survey design or comparable
            historical price periods with promotion, availability, and
            seasonality controls.
          </p>
        </div>
      </div>

      <div className="price-response-layout mt-5">
        <section className="price-curve-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Item price-response curve</p>
              <h2>{item.name}</h2>
            </div>
            <select
              aria-label="Select menu item"
              onChange={(event) => setItemId(event.target.value)}
              value={itemId}
            >
              {seedPriceResponseCurves.map((record) => {
                const recordItem = project.items.find(
                  (candidate) => candidate.id === record.itemId,
                )!;
                return (
                  <option key={record.itemId} value={record.itemId}>
                    {recordItem.name}
                  </option>
                );
              })}
            </select>
          </div>

          <PriceCurve curve={curve} />

          <div className="curve-legend">
            <span><i className="legend-line legend-line--amber" />Good Value for Money index</span>
            <span><i className="legend-line legend-line--blue" />Observed UPH index</span>
            <span><i className="legend-line legend-line--dashed" />Stated purchase intent</span>
          </div>
          <p className="disclaimer">
            Indices are normalized for comparison. Stated purchase intent is
            not actual elasticity, and historical response is not causal unless
            confounding factors are controlled.
          </p>
        </section>

        <aside className="price-signal-panel">
          <p className="eyebrow">Decision signals</p>
          <h2>{item.name}</h2>
          <dl>
            <div>
              <dt>Current list price</dt>
              <dd>{priceFormatter.format(item.listPrice)}</dd>
            </div>
            <div>
              <dt>Stated acceptable range</dt>
              <dd>
                {signal
                  ? `${priceFormatter.format(signal.acceptablePriceLow)}–${priceFormatter.format(signal.acceptablePriceHigh)}`
                  : "Missing"}
              </dd>
            </div>
            <div>
              <dt>Good-value break point</dt>
              <dd>{signal ? priceFormatter.format(signal.goodValueBreakPoint) : "Missing"}</dd>
            </div>
          </dl>
          <div className="candidate-price-list">
            <span>Candidate prices</span>
            {candidatePrices.map((candidate) => (
              <div key={candidate.label}>
                <strong>{candidate.label}</strong>
                <b>{priceFormatter.format(candidate.price)}</b>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="evidence-layer-grid mt-5">
        <EvidenceCard
          icon={FlaskConical}
          title="Price Sensitivity Study"
          label="Research-stated"
          text="PSM or Gabor–Granger defines perceived ranges, Good Value for Money breaks, and stated purchase intent."
        />
        <EvidenceCard
          icon={Database}
          title="Historical price periods"
          label="Observed / modelled"
          text="Comparable price periods estimate actual UPH and traffic response after controlling for promotions and availability."
        />
        <EvidenceCard
          icon={ChartSpline}
          title="Pilot calibration"
          label="Required when uncertain"
          text="A controlled store pilot validates ADTC, UPH, substitution, and customer value before broad rollout."
        />
      </div>
    </section>
  );
}

function PriceCurve({ curve }: { curve: PriceResponseCurve }) {
  const width = 720;
  const height = 300;
  const padding = 42;
  const minPrice = Math.min(...curve.points.map((point) => point.price));
  const maxPrice = Math.max(...curve.points.map((point) => point.price));
  const x = (price: number) =>
    padding + ((price - minPrice) / (maxPrice - minPrice)) * (width - padding * 2);
  const y = (value: number) =>
    height - padding - (value / 120) * (height - padding * 2);
  const path = (field: "statedGoodValueIndex" | "observedUphIndex" | "statedPurchaseIntent") =>
    curve.points
      .map((point, index) => {
        const value = point[field] ?? 0;
        return `${index === 0 ? "M" : "L"} ${x(point.price)} ${y(value)}`;
      })
      .join(" ");

  return (
    <svg
      aria-label="Price response curves"
      className="price-curve"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
    >
      {[0, 30, 60, 90, 120].map((tick) => (
        <g key={tick}>
          <line className="curve-grid-line" x1={padding} x2={width - padding} y1={y(tick)} y2={y(tick)} />
          <text className="curve-axis-label" x={8} y={y(tick) + 4}>{tick}</text>
        </g>
      ))}
      {curve.points.map((point) => (
        <text className="curve-axis-label" key={point.price} textAnchor="middle" x={x(point.price)} y={height - 12}>
          ¥{point.price}
        </text>
      ))}
      <path className="curve-path curve-path--amber" d={path("statedGoodValueIndex")} />
      <path className="curve-path curve-path--blue" d={path("observedUphIndex")} />
      <path className="curve-path curve-path--dashed" d={path("statedPurchaseIntent")} />
    </svg>
  );
}

function EvidenceCard({
  icon: Icon,
  label,
  text,
  title,
}: {
  icon: typeof ChartSpline;
  label: string;
  text: string;
  title: string;
}) {
  return (
    <article>
      <Icon aria-hidden="true" size={19} />
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
