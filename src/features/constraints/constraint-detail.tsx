import {
  ArrowLeft,
  CirclePause,
  CopyPlus,
  Edit3,
  Power,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { StatusBadge } from "@/components/status-badge";
import { useRepository } from "@/data/repository-context";
import type { Constraint, ConstraintStatus } from "@/domain/constraint";

import { ConstraintService } from "./constraint-service";
import {
  resolveConstraintTraceability,
  type ConstraintTraceability,
} from "./constraint-traceability";

export function ConstraintDetailPage() {
  const { id = "" } = useParams();
  const repository = useRepository();
  const service = useMemo(
    () => new ConstraintService(repository),
    [repository],
  );
  const navigate = useNavigate();
  const [record, setRecord] = useState<Constraint>();
  const [traceability, setTraceability] =
    useState<ConstraintTraceability>();
  const [traceabilityError, setTraceabilityError] = useState("");
  const [error, setError] = useState("");

  const reload = async () => {
    const [current, articles, blueprints] = await Promise.all([
      service.get(id),
      repository.listConstitutionRules(),
      repository.listConstraintBlueprints(),
    ]);
    setRecord(current);
    if (!current) return;
    try {
      setTraceability(
        resolveConstraintTraceability(current, articles, blueprints),
      );
      setTraceabilityError("");
    } catch (traceError) {
      setTraceability(undefined);
      setTraceabilityError(
        traceError instanceof Error
          ? traceError.message
          : "Constraint traceability could not be resolved.",
      );
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      service.get(id),
      repository.listConstitutionRules(),
      repository.listConstraintBlueprints(),
    ]).then(([current, articles, blueprints]) => {
      if (!active) return;
      setRecord(current);
      if (!current) return;
      try {
        setTraceability(
          resolveConstraintTraceability(current, articles, blueprints),
        );
        setTraceabilityError("");
      } catch (traceError) {
        setTraceability(undefined);
        setTraceabilityError(
          traceError instanceof Error
            ? traceError.message
            : "Constraint traceability could not be resolved.",
        );
      }
    });
    return () => {
      active = false;
    };
  }, [id, repository, service]);

  if (!record) return <p className="text-slate-400">Loading Constraint…</p>;

  const runTransition = async (
    nextStatus: ConstraintStatus,
    requiresWarning = false,
  ) => {
    if (
      requiresWarning &&
      !window.confirm(
        `This preserves the Constraint in history. Linked open projects: 0. Continue with ${nextStatus}?`,
      )
    ) {
      return;
    }
    setError("");
    try {
      await service.transition(record.id, nextStatus);
      await reload();
    } catch (transitionError) {
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : "Action failed.",
      );
    }
  };

  const clone = async () => {
    const notes = window.prompt("Describe the change in the new Draft version:");
    if (!notes) return;
    const cloned = await service.clone(record.id, notes);
    navigate(`/constraints/${cloned.id}/edit`);
  };

  return (
    <section className="mx-auto max-w-7xl">
      <Link className="back-link" to="/constraints">
        <ArrowLeft aria-hidden="true" size={16} />
        Constraint Library
      </Link>
      <div className="detail-layout mt-5">
        <div className="min-w-0">
          <div className="detail-card">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={record.status} />
              <span className="pillar-tag">{record.pillar}</span>
              <span className="record-meta">
                {record.constraintId} · v{record.version}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              {record.name}
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              {record.description}
            </p>

            <div className="condition-panel mt-7">
              <span>{record.metricKey}</span>
              <strong>{record.operator}</strong>
              <span>{formatThreshold(record)}</span>
            </div>

            <div className="detail-grid mt-7">
              <Detail label="Constraint type" value={record.constraintType} />
              <Detail label="Data type" value={record.dataType} />
              <Detail label="Scope" value={record.scope} />
              <Detail label="Severity" value={record.severity} />
              <Detail label="Outcome if failed" value={record.outcomeIfFailed} />
              <Detail label="Escalation role" value={record.escalationRole} />
              <Detail label="Exception policy" value={record.exceptionPolicy} />
              <Detail label="Effective date" value={record.effectiveDate} />
              <Detail label="Review frequency" value={record.reviewFrequency} />
            </div>
          </div>

          <section className="detail-card mt-5">
            <h2 className="text-lg font-semibold text-white">
              Applicability and evidence
            </h2>
            <div className="mt-5 space-y-5">
              <div>
                <span className="detail-label">Decision types</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.applicableDecisionTypes.map((type) => (
                    <span className="soft-tag" key={type}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="detail-label">Required evidence</span>
                <p className="mt-2 leading-7 text-slate-300">
                  {record.requiredEvidence}
                </p>
              </div>
              <div>
                <span className="detail-label">Change notes</span>
                <p className="mt-2 text-sm text-slate-300">
                  {record.changeNotes}
                </p>
              </div>
            </div>
          </section>

          <section className="detail-card mt-5">
            <h2 className="text-lg font-semibold text-white">
              Derivation chain
            </h2>
            {traceability ? (
              <div className="derivation-chain mt-5">
                <DerivationStep
                  label="Decision Constitution Article"
                  meta={traceability.article.ruleId}
                  value={traceability.article.principle}
                />
                <DerivationStep
                  label="Constitution version"
                  value={record.constitutionVersionId}
                />
                <DerivationStep
                  label="BPR&E control objective"
                  meta={traceability.blueprint.blueprintId}
                  value={traceability.blueprint.controlObjective}
                />
                <DerivationStep
                  label="Risk to avoid"
                  value={traceability.blueprint.riskToAvoid}
                />
                <DerivationStep
                  label="Threshold source"
                  value={traceability.blueprint.thresholdSource}
                />
                <DerivationStep
                  label="Derivation rationale"
                  value={record.derivationRationale}
                />
                <div className="atomic-rule">
                  <span>Atomic constraint</span>
                  <code>{formatAtomicRule(record)}</code>
                </div>
              </div>
            ) : (
              <div className="traceability-error mt-5" role="alert">
                <strong>Traceability error</strong>
                <span>{traceabilityError}</span>
              </div>
            )}
          </section>
        </div>

        <aside className="action-panel">
          <p className="eyebrow">Constraint actions</p>
          {record.status === "Draft" && (
            <>
              <Link
                className="button button--secondary w-full"
                to={`/constraints/${record.id}/edit`}
              >
                <Edit3 aria-hidden="true" size={16} />
                Edit Draft
              </Link>
              <button
                className="button button--primary w-full"
                onClick={() => void runTransition("Active")}
                type="button"
              >
                <Power aria-hidden="true" size={16} />
                Activate
              </button>
            </>
          )}
          {record.status === "Active" && (
            <>
              <button
                className="button button--secondary w-full"
                onClick={() => void runTransition("Suspended", true)}
                type="button"
              >
                <CirclePause aria-hidden="true" size={16} />
                Suspend
              </button>
              <button
                className="button button--danger w-full"
                onClick={() => void runTransition("Retired", true)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={16} />
                Retire
              </button>
            </>
          )}
          {record.status === "Suspended" && (
            <>
              <button
                className="button button--primary w-full"
                onClick={() => void runTransition("Active")}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={16} />
                Reactivate
              </button>
              <button
                className="button button--danger w-full"
                onClick={() => void runTransition("Retired", true)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={16} />
                Retire
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
          {error && <p className="form-error mt-3">{error}</p>}
        </aside>
      </div>
    </section>
  );
}

function formatThreshold(record: Constraint): string {
  if (record.operator === "REQUIRED") return "Required information";
  const value = Array.isArray(record.thresholdValue)
    ? record.thresholdValue.join(", ")
    : String(record.thresholdValue);
  return `${value} ${record.unit}`.trim();
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="detail-label">{label}</span>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function DerivationStep({
  label,
  meta,
  value,
}: {
  label: string;
  meta?: string;
  value: string;
}) {
  return (
    <div className="derivation-step">
      <div>
        <span className="detail-label">{label}</span>
        {meta && <span className="derivation-meta">{meta}</span>}
      </div>
      <p>{value}</p>
    </div>
  );
}

function formatAtomicRule(record: Constraint): string {
  return `IF ${record.scope} THEN ${record.metricKey} ${record.operator} ${formatThreshold(
    record,
  )} ELSE ${record.outcomeIfFailed}`;
}
