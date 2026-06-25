import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useRepository } from "@/data/repository-context";
import type { DecisionProject } from "@/domain/decision-project";

import { DecisionRecordSummary } from "./final-decision-panel";

export function ReviewFollowUpPage() {
  const repository = useRepository();
  const [project, setProject] = useState<DecisionProject>();

  useEffect(() => {
    let active = true;
    repository.listDecisionProjects().then((projects) => {
      if (active) setProject(projects[0]);
    });
    return () => {
      active = false;
    };
  }, [repository]);

  if (!project) return <p className="text-slate-400">Loading follow-up…</p>;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Execution accountability</p>
          <h1 className="page-title">Review &amp; Follow-up</h1>
          <p className="page-description">
            Track the action plan, KPI commitments, review dates, and exit rule
            created by the human decision.
          </p>
        </div>
        <Link
          className="button button--secondary"
          to={`/decisions/${project.id}`}
        >
          Open meeting record
        </Link>
      </div>
      {project.decisionRecord ? (
        <div className="mt-7">
          <DecisionRecordSummary project={project} />
        </div>
      ) : (
        <div className="empty-panel mt-7">
          <h2 className="text-lg font-semibold text-white">
            No human decision recorded yet
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Complete the Decision Meeting Workspace to create an accountable
            action and review record.
          </p>
        </div>
      )}
    </section>
  );
}
