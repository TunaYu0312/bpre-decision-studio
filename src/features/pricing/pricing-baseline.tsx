import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  CircleCheck,
  ReceiptText,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";

import {
  seedMenuAnalysisSlices,
  seedPricingProjects,
} from "@/data/pricing-seed";
import {
  calculateBaselineEconomics,
  type BaselineEconomics,
  type MenuEngineeringCategory,
} from "@/domain/pricing";

import {
  currencyFormatter,
  compactCurrencyFormatter,
  decimalFormatter,
  numberFormatter,
  percentFormatter,
  priceFormatter,
} from "./pricing-format";
import { PricingFlow } from "./pricing-flow";

const matrixOrder: MenuEngineeringCategory[] = [
  "Star",
  "Plowhorse",
  "Puzzle",
  "Dog",
];

const matrixDescriptions: Record<MenuEngineeringCategory, string> = {
  Star: "High popularity · High contribution",
  Plowhorse: "High popularity · Lower contribution",
  Puzzle: "Lower popularity · High contribution",
  Dog: "Lower popularity · Lower contribution",
};

export function PricingBaselinePage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);
  const [sliceId, setSliceId] = useState("all-day");

  if (!project) return <Navigate replace to="/pricing" />;

  const selectedSlice =
    seedMenuAnalysisSlices.find((slice) => slice.id === sliceId) ??
    seedMenuAnalysisSlices[0];
  const analysis = calculateBaselineEconomics(
    selectedSlice.items,
    selectedSlice.transactions,
    { periodDays: project.periodDays, storeCount: project.storeCount },
  );

  return (
    <section className="mx-auto max-w-[1500px]">
      <Link className="back-link" to={`/pricing/${project.id}/intent`}>
        <ArrowLeft aria-hidden="true" size={15} />
        Decision Intent
      </Link>
      <PricingFlow active="baseline" projectId={project.id} />

      <div className="page-header mt-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">Step 2 · Meeting material preparation</p>
            <span className="pricing-status pricing-status--ready">
              <CircleCheck aria-hidden="true" size={13} />
              POS baseline reconciled
            </span>
          </div>
          <h1 className="page-title">Menu Analysis</h1>
          <p className="page-description">
            Diagnose Product Mix, daily operating economics, and menu roles for
            all day or a selected daypart before discussing price.
          </p>
        </div>
        <Link className="button button--primary" to={`/pricing/${project.id}/research`}>
          Continue to Price Response
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="analysis-toolbar mt-7">
        <div>
          <label htmlFor="daypart">Analysis period</label>
          <select
            id="daypart"
            onChange={(event) => setSliceId(event.target.value)}
            value={sliceId}
          >
            {seedMenuAnalysisSlices.map((slice) => (
              <option key={slice.id} value={slice.id}>
                {slice.label} · {slice.timeWindow}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span>Data grain</span>
          <strong>{project.dataGrain}</strong>
        </div>
        <div>
          <span>Coverage</span>
          <strong>{project.storeCount} stores · {project.periodDays} days</strong>
        </div>
        <div>
          <span>Custom period</span>
          <strong>Enabled when POS transaction timestamps are imported</strong>
        </div>
      </div>

      <div className="pricing-metric-grid pricing-metric-grid--six mt-5">
        <Metric icon={ShoppingBasket} label="Period transactions" value={numberFormatter.format(analysis.transactions)} />
        <Metric icon={Store} label="ADTC" value={decimalFormatter.format(analysis.adtc)} />
        <Metric icon={ReceiptText} label="Average Check (AC)" value={priceFormatter.format(analysis.averageCheck)} />
        <Metric icon={BadgeDollarSign} label="Average Daily Sales (ADS)" value={currencyFormatter.format(analysis.ads)} />
        <Metric icon={CalendarClock} label="Total menu UPH" value={decimalFormatter.format(analysis.totalUph)} />
        <Metric icon={BadgeDollarSign} label="Gross profit" value={compactCurrencyFormatter.format(analysis.grossProfit)} />
      </div>

      <div className="menu-analysis-layout mt-5">
        <section className="menu-matrix-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Menu Engineering Matrix · Boston-style</p>
              <h2>{selectedSlice.label} menu position</h2>
            </div>
            <span>Popularity × contribution margin per unit</span>
          </div>
          <div className="menu-matrix mt-5">
            {matrixOrder.map((category) => (
              <article className={`matrix-quadrant matrix-quadrant--${category.toLowerCase()}`} key={category}>
                <div>
                  <strong>{category}</strong>
                  <span>{matrixDescriptions[category]}</span>
                </div>
                <ul>
                  {analysis.items
                    .filter((item) => item.menuEngineeringCategory === category)
                    .map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>
                        <span>
                          UPH {decimalFormatter.format(item.uph)} · CM {priceFormatter.format(item.contributionMargin)}
                        </span>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="disclaimer mt-4">
            Classification is diagnostic, not a pricing instruction. The demo
            uses 70% of average item popularity and weighted average contribution
            margin as thresholds. Production thresholds are configurable by
            category, and substitution must be reviewed before acting.
          </p>
        </section>

        <aside className="menu-analysis-questions">
          <p className="eyebrow">Questions for the meeting</p>
          <h2>What does this slice tell us?</h2>
          <ol>
            <li>Which items create traffic but under-deliver contribution?</li>
            <li>Which profitable items have low visibility or weak conversion?</li>
            <li>Which items protect entry price and Good Value for Money?</li>
            <li>Where could a price move shift demand to a worse mix?</li>
          </ol>
          <div className="formula-card">
            <span>Daily operating bridge</span>
            <strong>ADS = AC × ADTC</strong>
            <strong>ADQ = UPH × ADTC ÷ 100</strong>
            <p>
              Multi-store inputs are normalized per store per day before these
              formulas are applied.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-5">
        <div className="section-heading mb-4">
          <div>
            <p className="eyebrow">Product Mix detail</p>
            <h2>{selectedSlice.label} item economics</h2>
          </div>
          <span>Sales % = item sales ÷ total sales</span>
        </div>
        <ProductMixTable analysis={analysis} />
      </section>
    </section>
  );
}

function ProductMixTable({ analysis }: { analysis: BaselineEconomics }) {
  return (
    <div className="table-shell">
      <table className="operating-table pricing-baseline-table">
        <thead>
          <tr>
            <th>Menu item</th>
            <th>Role</th>
            <th>Matrix</th>
            <th>List price</th>
            <th>Units</th>
            <th>UPH</th>
            <th>ADQ</th>
            <th>Sales</th>
            <th>Sales %</th>
            <th>CM / unit</th>
            <th>Gross profit</th>
            <th>GM%</th>
          </tr>
        </thead>
        <tbody>
          {analysis.items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong className="pricing-item-name">{item.name}</strong>
                <span className="record-meta">{item.category}</span>
              </td>
              <td><span className="soft-tag">{item.role}</span></td>
              <td><span className={`matrix-tag matrix-tag--${item.menuEngineeringCategory.toLowerCase()}`}>{item.menuEngineeringCategory}</span></td>
              <td>{priceFormatter.format(item.listPrice)}</td>
              <td>{numberFormatter.format(item.units)}</td>
              <td>{decimalFormatter.format(item.uph)}</td>
              <td>{decimalFormatter.format(item.adq)}</td>
              <td>{currencyFormatter.format(item.netSales)}</td>
              <td>{percentFormatter.format(item.salesMix)}</td>
              <td>{priceFormatter.format(item.contributionMargin)}</td>
              <td>{currencyFormatter.format(item.grossProfit)}</td>
              <td>{percentFormatter.format(item.grossMargin)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Selected-period total</td>
            <td>{numberFormatter.format(analysis.totalUnits)}</td>
            <td>{decimalFormatter.format(analysis.totalUph)}</td>
            <td>—</td>
            <td>{currencyFormatter.format(analysis.netSales)}</td>
            <td>100.0%</td>
            <td>—</td>
            <td>{currencyFormatter.format(analysis.grossProfit)}</td>
            <td>{percentFormatter.format(analysis.grossMargin)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingBasket;
  label: string;
  value: string;
}) {
  return (
    <article className="pricing-metric-card">
      <Icon aria-hidden="true" size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
