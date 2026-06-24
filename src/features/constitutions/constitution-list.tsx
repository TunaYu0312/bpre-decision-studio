import { ArrowRight, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { StatusBadge } from "@/components/status-badge";
import { useRepository } from "@/data/repository-context";
import type { Constitution } from "@/domain/constitution";

import { ConstitutionService } from "./constitution-service";

export function ConstitutionListPage() {
  const repository = useRepository();
  const service = useMemo(
    () => new ConstitutionService(repository),
    [repository],
  );
  const [records, setRecords] = useState<Constitution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service
      .list()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, [service]);

  const activeCount = records.filter((record) => record.status === "Active").length;
  const draftCount = records.filter((record) => record.status === "Draft").length;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Strategic governance</p>
          <h1 className="page-title">Decision Constitutions</h1>
          <p className="page-description">
            Versioned strategic boundaries that govern high-value decisions.
          </p>
        </div>
        <Link className="button button--primary" to="/constitutions/new">
          <Plus aria-hidden="true" size={17} />
          New Constitution
        </Link>
      </div>

      <div className="stats-grid mt-7">
        <div className="stat-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>
        <div className="stat-card">
          <span>Drafts</span>
          <strong>{draftCount}</strong>
        </div>
        <div className="stat-card">
          <span>Historical versions</span>
          <strong>{records.length - activeCount - draftCount}</strong>
        </div>
      </div>

      <div className="table-shell mt-6">
        <table className="operating-table">
          <thead>
            <tr>
              <th>Constitution</th>
              <th>Scope</th>
              <th>Strategic stage</th>
              <th>Status</th>
              <th>Effective</th>
              <th>
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6}>Loading Constitutions…</td>
              </tr>
            )}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={6}>
                  No Constitution exists. Create a Draft to define the first
                  strategic boundary.
                </td>
              </tr>
            )}
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <Link
                    className="record-link"
                    to={`/constitutions/${record.id}`}
                  >
                    {record.title}
                  </Link>
                  <span className="record-meta">
                    {record.constitutionId} · v{record.version}
                  </span>
                </td>
                <td>
                  {record.scope}
                  <span className="record-meta">{record.scopeValue}</span>
                </td>
                <td>{record.strategicStage}</td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
                <td>{record.effectiveDate}</td>
                <td>
                  <Link
                    aria-label={`Open ${record.title} version ${record.version}`}
                    className="icon-link"
                    to={`/constitutions/${record.id}`}
                  >
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
