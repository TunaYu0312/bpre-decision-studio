import { Download, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { StatusBadge } from "@/components/status-badge";
import { useRepository } from "@/data/repository-context";
import {
  bprePillars,
  constraintStatuses,
  decisionTypes,
  failureOutcomes,
  severities,
  type Constraint,
} from "@/domain/constraint";

import {
  constraintsToCsv,
  constraintsToJson,
  downloadTextFile,
} from "./constraint-export";
import {
  filterConstraintTraceability,
  type ConstraintFilters,
} from "./constraint-service";
import {
  resolveConstraintTraceability,
  type ConstraintTraceability,
} from "./constraint-traceability";

export function ConstraintListPage() {
  const repository = useRepository();
  const [records, setRecords] = useState<ConstraintTraceability[]>([]);
  const [traceabilityError, setTraceabilityError] = useState("");
  const [filters, setFilters] = useState<ConstraintFilters>({});

  useEffect(() => {
    let active = true;
    Promise.all([
      repository.listConstraints(),
      repository.listConstitutionRules(),
      repository.listConstraintBlueprints(),
    ]).then(([constraints, articles, blueprints]) => {
      if (!active) return;
      try {
        setRecords(
          constraints.map((constraint) =>
            resolveConstraintTraceability(
              constraint,
              articles,
              blueprints,
            ),
          ),
        );
        setTraceabilityError("");
      } catch (error) {
        setRecords([]);
        setTraceabilityError(
          error instanceof Error
            ? error.message
            : "Constraint traceability could not be resolved.",
        );
      }
    });
    return () => {
      active = false;
    };
  }, [repository]);

  const filtered = useMemo(
    () => filterConstraintTraceability(records, filters),
    [filters, records],
  );
  const scopes = [
    ...new Set(records.map((record) => record.constraint.scope)),
  ].sort();
  const filteredConstraints = filtered.map((record) => record.constraint);

  const updateFilter = (key: keyof ConstraintFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value || undefined }));
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Operational guardrails</p>
          <h1 className="page-title">Constraint Library</h1>
          <p className="page-description">
            Measurable and inspectable decision boundaries linked to strategy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="button button--secondary"
            onClick={() =>
              downloadTextFile(
                constraintsToJson(filteredConstraints),
                "bpre-constraints.json",
                "application/json",
              )
            }
            type="button"
          >
            <Download aria-hidden="true" size={16} />
            JSON
          </button>
          <button
            className="button button--secondary"
            onClick={() =>
              downloadTextFile(
                constraintsToCsv(filteredConstraints),
                "bpre-constraints.csv",
                "text/csv;charset=utf-8",
              )
            }
            type="button"
          >
            <Download aria-hidden="true" size={16} />
            CSV
          </button>
          <Link className="button button--primary" to="/constraints/new">
            <Plus aria-hidden="true" size={17} />
            New Constraint
          </Link>
        </div>
      </div>

      <div className="filter-panel mt-7">
        <label className="search-field">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search constraints</span>
          <input
            aria-label="Search constraints"
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="ID, name, or metric key"
            type="search"
            value={filters.search ?? ""}
          />
        </label>
        <FilterSelect
          label="Pillar"
          onChange={(value) => updateFilter("pillar", value)}
          options={bprePillars}
          value={filters.pillar}
        />
        <FilterSelect
          label="Status"
          onChange={(value) => updateFilter("status", value)}
          options={constraintStatuses}
          value={filters.status}
        />
        <FilterSelect
          label="Decision type"
          onChange={(value) => updateFilter("decisionType", value)}
          options={decisionTypes}
          value={filters.decisionType}
        />
        <FilterSelect
          label="Scope"
          onChange={(value) => updateFilter("scope", value)}
          options={scopes}
          value={filters.scope}
        />
        <FilterSelect
          label="Severity"
          onChange={(value) => updateFilter("severity", value)}
          options={severities}
          value={filters.severity}
        />
        <FilterSelect
          label="Outcome"
          onChange={(value) => updateFilter("outcome", value)}
          options={failureOutcomes}
          value={filters.outcome}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{filtered.length} matching constraints</span>
        <button
          className="text-button"
          onClick={() => setFilters({})}
          type="button"
        >
          Clear filters
        </button>
      </div>

      {traceabilityError && (
        <div className="traceability-error mt-4" role="alert">
          <strong>Traceability error</strong>
          <span>{traceabilityError}</span>
        </div>
      )}

      <div className="table-shell mt-4">
        <table className="operating-table">
          <thead>
            <tr>
              <th>Constraint</th>
              <th>Constitution source</th>
              <th>Pillar</th>
              <th>Condition</th>
              <th>Severity</th>
              <th>Outcome</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ article, constraint: record }) => (
              <tr key={record.id}>
                <td>
                  <Link
                    className="record-link"
                    to={`/constraints/${record.id}`}
                  >
                    {record.name}
                  </Link>
                  <span className="record-meta">
                    {record.constraintId} · {record.metricKey}
                  </span>
                </td>
                <td className="source-cell">
                  <span className="source-article-id">{article.ruleId}</span>
                  <span className="source-principle" title={article.principle}>
                    {article.principle}
                  </span>
                </td>
                <td>
                  <span className="pillar-tag">{record.pillar}</span>
                </td>
                <td className="font-mono text-xs">
                  {record.operator} {formatThreshold(record)}
                </td>
                <td>{record.severity}</td>
                <td>{record.outcomeIfFailed}</td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
            {records.length > 0 && filtered.length === 0 && (
              <tr>
                <td colSpan={7}>No constraints match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatThreshold(record: Constraint): string {
  if (record.operator === "REQUIRED") return "Required";
  if (Array.isArray(record.thresholdValue)) {
    return record.thresholdValue.join(", ");
  }
  return `${String(record.thresholdValue)} ${record.unit}`.trim();
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value?: string;
}) {
  return (
    <label className="compact-select">
      <span>{label}</span>
      <select
        onChange={(event) => onChange(event.target.value)}
        value={value ?? ""}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
