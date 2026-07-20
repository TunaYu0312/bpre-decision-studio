import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CircleCheck,
  Database,
  FlaskConical,
  ReceiptText,
  ShoppingBasket,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import { seedPricingProjects } from "@/data/pricing-seed";
import { calculateBaselineEconomics } from "@/domain/pricing";

import {
  currencyFormatter,
  decimalFormatter,
  numberFormatter,
  percentFormatter,
  priceFormatter,
} from "./pricing-format";

export function PricingBaselinePage() {
  const { id } = useParams();
  const project = seedPricingProjects.find((record) => record.id === id);

  if (!project) {
    return <Navigate replace to="/pricing" />;
  }

  const baseline = calculateBaselineEconomics(
    project.items,
    project.transactions,
  );
  const topGrossProfitItem = [...baseline.items].sort(
    (left, right) => right.grossProfit - left.grossProfit,
  )[0];

  return (
    <section className="mx-auto max-w-[1500px]">
      <Link className="back-link" to="/pricing">
        <ArrowLeft aria-hidden="true" size={15} />
        Pricing Projects
      </Link>

      <div className="page-header mt-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">Baseline &amp; Research · Step 1 of 4</p>
            <span className="pricing-status pricing-status--ready">
              <CircleCheck aria-hidden="true" size={13} />
              Verified baseline
            </span>
          </div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-description">
            Establish the item-level economics and a consistent UPH denominator
            before testing any new price.
          </p>
        </div>
        <Link
          className="button button--primary"
          to={`/pricing/${project.id}/research`}
        >
          Continue to Price Sensitivity
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="pricing-scope-strip mt-7">
        <ScopeItem label="Scope" value={project.scope} />
        <ScopeItem label="Baseline period" value={project.baselinePeriod} />
        <ScopeItem
          label="UPH denominator"
          value={project.eligibleTransactionDefinition}
        />
        <ScopeItem label="Owner" value={project.owner} />
      </div>

      <div className="pricing-metric-grid mt-5">
        <MetricCard
          icon={ShoppingBasket}
          label="Eligible transactions"
          value={numberFormatter.format(baseline.transactions)}
        />
        <MetricCard
          icon={ReceiptText}
          label="Total menu UPH"
          value={decimalFormatter.format(baseline.totalUph)}
        />
        <MetricCard
          icon={BadgeDollarSign}
          label="Net sales"
          value={currencyFormatter.format(baseline.netSales)}
        />
        <MetricCard
          icon={BadgeDollarSign}
          label="Gross profit dollars"
          value={currencyFormatter.format(baseline.grossProfit)}
        />
        <MetricCard
          icon={Database}
          label="Gross margin"
          value={percentFormatter.format(baseline.grossMargin)}
        />
      </div>

      <div className="pricing-baseline-layout mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="pricing-baseline-main">
          <div className="table-shell">
            <table className="operating-table pricing-baseline-table">
              <thead>
                <tr>
                  <th>Menu item</th>
                  <th>Role</th>
                  <th>List price</th>
                  <th>Net price</th>
                  <th>Units</th>
                  <th>UPH</th>
                  <th>Sales</th>
                  <th>Sales %</th>
                  <th>Gross profit</th>
                  <th>Gross margin</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {baseline.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong className="pricing-item-name">{item.name}</strong>
                      <span className="record-meta">{item.category}</span>
                    </td>
                    <td>
                      <span className="soft-tag">{item.role}</span>
                    </td>
                    <td>{priceFormatter.format(item.listPrice)}</td>
                    <td>{priceFormatter.format(item.netRealizedPrice)}</td>
                    <td>{numberFormatter.format(item.units)}</td>
                    <td>{decimalFormatter.format(item.uph)}</td>
                    <td>{currencyFormatter.format(item.netSales)}</td>
                    <td>{percentFormatter.format(item.salesMix)}</td>
                    <td>{currencyFormatter.format(item.grossProfit)}</td>
                    <td>{percentFormatter.format(item.grossMargin)}</td>
                    <td>
                      <span className="evidence-badge evidence-badge--observed">
                        {item.evidenceQuality}
                      </span>
                      <span className="record-meta">{item.source}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>Baseline total</td>
                  <td>{numberFormatter.format(baseline.totalUnits)}</td>
                  <td>{decimalFormatter.format(baseline.totalUph)}</td>
                  <td>{currencyFormatter.format(baseline.netSales)}</td>
                  <td>100.0%</td>
                  <td>{currencyFormatter.format(baseline.grossProfit)}</td>
                  <td>{percentFormatter.format(baseline.grossMargin)}</td>
                  <td>Observed</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="disclaimer mt-4">
            UPH = item units ÷ eligible transactions × 100. Net realized price
            is used for economics. Sales % = item net sales ÷ total net sales;
            it is the Product Mix used for pricing analysis. Demo values are
            illustrative.
          </p>
        </section>

        <aside className="pricing-readiness-panel">
          <div>
            <p className="eyebrow">Readiness check</p>
            <h2>Baseline is usable</h2>
          </div>
          <ReadinessItem
            status="ready"
            title="POS demand"
            description="Item units and eligible transactions use the same scope and period."
          />
          <ReadinessItem
            status="ready"
            title="Item economics"
            description="Net realized price and variable cost are available for all eight items."
          />
          <ReadinessItem
            status="pending"
            title="Price response"
            description="Price Sensitivity Study and observed elasticity have not been added."
          />
          <div className="pricing-insight">
            <span>Largest gross-profit pool</span>
            <strong>{topGrossProfitItem.name}</strong>
            <p>{currencyFormatter.format(topGrossProfitItem.grossProfit)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ScopeItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MetricCard({
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

function ReadinessItem({
  description,
  status,
  title,
}: {
  description: string;
  status: "ready" | "pending";
  title: string;
}) {
  const Icon = status === "ready" ? CircleCheck : FlaskConical;

  return (
    <article className={`readiness-item readiness-item--${status}`}>
      <Icon aria-hidden="true" size={18} />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}
