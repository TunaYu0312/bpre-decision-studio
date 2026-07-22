import {
  ArrowLeft,
  CopyPlus,
  Edit3,
  Power,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { StatusBadge } from "@/components/status-badge";
import { useRepository } from "@/data/repository-context";
import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constitution } from "@/domain/constitution";

import { ConstitutionService } from "./constitution-service";

export function ConstitutionDetailPage() {
  const { id = "" } = useParams();
  const repository = useRepository();
  const service = useMemo(
    () => new ConstitutionService(repository),
    [repository],
  );
  const navigate = useNavigate();
  const [record, setRecord] = useState<Constitution>();
  const [history, setHistory] = useState<Constitution[]>([]);
  const [rules, setRules] = useState<ConstitutionRule[]>([]);
  const [error, setError] = useState("");

  const reload = async () => {
    const current = await service.get(id);
    setRecord(current);
    if (!current) return;
    const all = await service.list();
    setHistory(
      all
        .filter((item) => item.constitutionId === current.constitutionId)
        .sort((left, right) => right.version.localeCompare(left.version)),
    );
    setRules(await repository.listConstitutionRulesFor(current.id));
  };

  useEffect(() => {
    let active = true;
    service.get(id).then(async (current) => {
      if (!active) return;
      setRecord(current);
      if (!current) return;
      const [all, linkedRules] = await Promise.all([
        service.list(),
        repository.listConstitutionRulesFor(current.id),
      ]);
      if (!active) return;
      setHistory(
        all
          .filter((item) => item.constitutionId === current.constitutionId)
          .sort((left, right) => right.version.localeCompare(left.version)),
      );
      setRules(linkedRules);
    });
    return () => {
      active = false;
    };
  }, [id, repository, service]);

  if (!record) {
    return <p className="text-slate-400">Loading Constitution…</p>;
  }

  const run = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
      await reload();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed.",
      );
    }
  };

  const clone = async () => {
    const notes = window.prompt(
      "Describe what will change in the new Draft version:",
    );
    if (!notes) return;
    const cloned = await service.clone(record.id, notes);
    navigate(`/constitutions/${cloned.id}/edit`);
  };

  const invalidate = async () => {
    const reason = window.prompt("Invalidation reason:");
    if (!reason) return;
    const effectiveEndDate = window.prompt(
      "Effective end date (YYYY-MM-DD):",
      new Date().toISOString().slice(0, 10),
    );
    if (!effectiveEndDate) return;
    await run(() =>
      service.invalidate(record.id, {
        reason,
        effectiveEndDate,
        executiveOwner: record.executiveOwner,
      }),
    );
  };

  return (
    <section className="mx-auto max-w-7xl">
      <Link className="back-link" to="/constitutions">
        <ArrowLeft aria-hidden="true" size={16} />
        All Constitutions
      </Link>

      <div className="detail-layout mt-5">
        <div className="min-w-0">
          <div className="detail-card">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={record.status} />
              <span className="record-meta">
                {record.constitutionId} · v{record.version}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              {record.title}
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              {record.primaryStrategicPriority}
            </p>

            <div className="detail-grid mt-7">
              <Detail label="Scope" value={`${record.scope} · ${record.scopeValue}`} />
              <Detail label="Strategic stage" value={record.strategicStage} />
              <Detail label="North Star" value={record.primaryNorthStarMetric} />
              <Detail
                label="Effective period"
                value={`${record.effectiveDate} → ${record.effectiveEndDate ?? record.reviewDate}`}
              />
              <Detail label="Executive owner" value={record.executiveOwner} />
              <Detail label="Maintainer" value={record.maintainer} />
            </div>
          </div>

          <DetailSection title="Customer foundation">
            <ListBlock
              label="Priority customers"
              values={record.priorityTargetCustomers}
            />
            <ListBlock
              label="Journey moments"
              values={record.priorityJourneyMoments}
            />
            <ListBlock
              label="Experience non-negotiables"
              values={record.customerExperienceNonNegotiables}
            />
          </DetailSection>

          <DetailSection title="BPR&E strategic boundaries">
            {Object.entries({
              Brand: record.boundaries.brand,
              Product: record.boundaries.product,
              "Restaurant / Retail": record.boundaries.restaurantRetail,
              "Economic Box": record.boundaries.economicBox,
            }).map(([label, value]) => (
              <div className="pillar-block" key={label}>
                <span>{label}</span>
                <p>{value}</p>
              </div>
            ))}
          </DetailSection>

          <DetailSection title="Red lines and escalation">
            <ListBlock
              label="Non-negotiable trade-offs"
              values={record.nonNegotiableTradeOffs}
            />
            <ListBlock
              label="CEO escalation thresholds"
              values={record.ceoEscalationThresholds}
            />
          </DetailSection>

          <DetailSection title="Linked Constitution rules">
            {rules.length === 0 ? (
              <p className="text-sm text-slate-500">
                No rules are linked to this version yet.
              </p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div className="rule-row" key={rule.id}>
                    <span>{rule.pillar}</span>
                    <div>
                      <strong>{rule.name}</strong>
                      <p>{rule.principle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailSection>
        </div>

        <aside className="space-y-5">
          <div className="action-panel">
            <p className="eyebrow">Version actions</p>
            {record.status === "Draft" && (
              <>
                <Link
                  className="button button--secondary w-full"
                  to={`/constitutions/${record.id}/edit`}
                >
                  <Edit3 aria-hidden="true" size={16} />
                  Edit Draft
                </Link>
                <button
                  className="button button--primary w-full"
                  onClick={() => void run(() => service.activate(record.id))}
                  type="button"
                >
                  <Power aria-hidden="true" size={16} />
                  Activate version
                </button>
              </>
            )}
            <button
              className="button button--secondary w-full"
              onClick={() => void clone()}
              type="button"
            >
              <CopyPlus aria-hidden="true" size={16} />
              Clone new version
            </button>
            {record.status === "Active" && (
              <button
                className="button button--danger w-full"
                onClick={() => void invalidate()}
                type="button"
              >
                <ShieldAlert aria-hidden="true" size={16} />
                Invalidate
              </button>
            )}
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="action-panel">
            <p className="eyebrow">Version history</p>
            <div className="mt-4 space-y-3">
              {history.map((item) => (
                <Link
                  className={`history-row ${item.id === record.id ? "history-row--current" : ""}`}
                  key={item.id}
                  to={`/constitutions/${item.id}`}
                >
                  <span>v{item.version}</span>
                  <StatusBadge status={item.status} />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="detail-label">{label}</span>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function DetailSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="detail-card mt-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function ListBlock({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <span className="detail-label">{label}</span>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
        {values.map((value) => (
          <li className="flex gap-2" key={value}>
            <span className="text-amber-300">—</span>
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
