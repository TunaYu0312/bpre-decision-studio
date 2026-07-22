import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CircleAlert,
  Gauge,
  ShoppingBasket,
} from "lucide-react";
import { useState } from "react";
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
  compactCurrencyFormatter,
  decimalFormatter,
  percentFormatter,
  priceFormatter,
  signedCurrency,
  signedPercent,
} from "./pricing-format";
import { PricingFlow } from "./pricing-flow";

export function ScenarioLabPage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);
  const [scenarioId, setScenarioId] = useState(
    seedPricingScenarios.find((scenario) => scenario.isRecommended)?.id ??
      seedPricingScenarios[0].id,
  );

  if (!project) return <Navigate replace to="/pricing" />;

  const baseline = calculateBaselineEconomics(
    project.items,
    project.transactions,
    { periodDays: project.periodDays, storeCount: project.storeCount },
  );
  const forecasts = seedPricingScenarios.map((scenario) =>
    calculateScenarioForecast(project, scenario),
  );
  const selected =
    forecasts.find((forecast) => forecast.scenario.id === scenarioId) ??
    forecasts[0];

  return (
    <section className="mx-auto max-w-[1500px]">
      <Link className="back-link" to={`/pricing/${project.id}/research`}>
        <ArrowLeft aria-hidden="true" size={15} />
        Price Response
      </Link>
      <PricingFlow active="scenarios" projectId={project.id} />

      <div className="page-header mt-6">
        <div>
          <p className="eyebrow">Step 4 · Options & trade-offs</p>
          <h1 className="page-title">Scenario & Product Mix Comparison</h1>
          <p className="page-description">
            Compare each explicit price architecture against the same baseline,
            including ADTC, UPH, cannibalization, Sales Mix, GM dollars, GM%,
            and EBITDA impact.
          </p>
        </div>
        <Link className="button button--primary" to={`/pricing/${project.id}/decision`}>
          Open Decision Brief
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="scenario-card-grid mt-7">
        {forecasts.map((forecast) => (
          <button
            aria-pressed={scenarioId === forecast.scenario.id}
            className={scenarioId === forecast.scenario.id ? "scenario-card scenario-card--selected" : "scenario-card"}
            key={forecast.scenario.id}
            onClick={() => setScenarioId(forecast.scenario.id)}
            type="button"
          >
            <span>
              {forecast.scenario.isRecommended ? "Recommended for pilot" : "Alternative"}
            </span>
            <h2>{forecast.scenario.name}</h2>
            <p>{forecast.scenario.strategy}</p>
            <dl>
              <div><dt>EBITDA impact</dt><dd>{signedCurrency(forecast.ebitdaImpact)}</dd></div>
              <div><dt>ADTC</dt><dd>{signedPercent(forecast.trafficChange)}</dd></div>
              <div><dt>GM%</dt><dd>{percentFormatter.format(forecast.grossMargin)}</dd></div>
              <div><dt>VFM</dt><dd>{forecast.scenario.valueForMoneyIndex}</dd></div>
            </dl>
          </button>
        ))}
      </div>

      <div className="scenario-summary-grid mt-5">
        <SummaryMetric icon={ShoppingBasket} label="Forecast ADTC" value={decimalFormatter.format(selected.adtc)} delta={signedPercent(selected.trafficChange)} />
        <SummaryMetric icon={BadgeDollarSign} label="Forecast ADS" value={currencyFormatter.format(selected.ads)} delta={signedPercent(selected.ads / baseline.ads - 1)} />
        <SummaryMetric icon={Gauge} label="Average Check" value={priceFormatter.format(selected.averageCheck)} delta={signedPercent(selected.averageCheck / baseline.averageCheck - 1)} />
        <SummaryMetric icon={BadgeDollarSign} label="Gross profit" value={compactCurrencyFormatter.format(selected.grossProfit)} delta={signedCurrency(selected.grossProfit - baseline.grossProfit)} />
        <SummaryMetric icon={Gauge} label="Gross margin" value={percentFormatter.format(selected.grossMargin)} delta={signedPercent(selected.grossMargin - baseline.grossMargin, true)} />
        <SummaryMetric icon={BadgeDollarSign} label="EBITDA impact" value={signedCurrency(selected.ebitdaImpact)} delta="ΔGM − incremental operating cost" />
      </div>

      <div className="scenario-warning mt-5">
        <CircleAlert aria-hidden="true" size={18} />
        <p>
          Forecast UPH, ADTC change, and cannibalization are explicit demo
          assumptions. They are not inferred facts. The recommended option is a
          pilot recommendation until these assumptions are observed.
        </p>
      </div>

      <section className="scenario-detail-panel mt-5">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Before / after by item</p>
            <h2>{selected.scenario.name}</h2>
          </div>
          <span>Product Mix = item sales ÷ total sales</span>
        </div>
        <div className="table-shell mt-5">
          <table className="operating-table scenario-comparison-table">
            <thead>
              <tr>
                <th>Menu item</th>
                <th>Price before → after</th>
                <th>UPH before → after</th>
                <th>ADQ after</th>
                <th>Sales Mix before → after</th>
                <th>Sales after</th>
                <th>GM after</th>
                <th>Matrix before → after</th>
                <th>Demand / cannibalization assumption</th>
              </tr>
            </thead>
            <tbody>
              {selected.items.map((item) => {
                const baselineItem = baseline.items.find(
                  (candidate) => candidate.id === item.id,
                )!;
                return (
                  <tr key={item.id}>
                    <td>
                      <strong className="pricing-item-name">{item.name}</strong>
                      <span className="record-meta">{item.role}</span>
                    </td>
                    <td>
                      {priceFormatter.format(item.currentListPrice)} →{" "}
                      <strong>{priceFormatter.format(item.proposedListPrice)}</strong>
                      <span className="record-meta">{signedPercent(item.priceChange)}</span>
                    </td>
                    <td>
                      {decimalFormatter.format(item.baselineUph)} →{" "}
                      <strong>{decimalFormatter.format(item.forecastUph)}</strong>
                      <span className="record-meta">{signedPercent(item.uphChange)}</span>
                    </td>
                    <td>{decimalFormatter.format(item.adq)}</td>
                    <td>
                      {percentFormatter.format(baselineItem.salesMix)} →{" "}
                      <strong>{percentFormatter.format(item.salesMix)}</strong>
                      <span className="record-meta">
                        {signedPercent(item.salesMix - baselineItem.salesMix, true)}
                      </span>
                    </td>
                    <td>{currencyFormatter.format(item.netSales)}</td>
                    <td>{currencyFormatter.format(item.grossProfit)}</td>
                    <td>{baselineItem.menuEngineeringCategory} → <strong>{item.menuEngineeringCategory}</strong></td>
                    <td className="scenario-assumption-cell">
                      <strong>{item.cannibalizationNote}</strong>
                      <span>{item.assumption}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function SummaryMetric({
  delta,
  icon: Icon,
  label,
  value,
}: {
  delta: string;
  icon: typeof ShoppingBasket;
  label: string;
  value: string;
}) {
  return (
    <article>
      <Icon aria-hidden="true" size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{delta}</small>
    </article>
  );
}
