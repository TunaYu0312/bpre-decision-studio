import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useRepository } from "@/data/repository-context";
import type { DecisionProject } from "@/domain/decision-project";

export function DecisionAgendaPage() {
  const repository = useRepository();
  const [projects, setProjects] = useState<DecisionProject[]>([]);

  useEffect(() => {
    let active = true;
    repository.listDecisionProjects().then((records) => {
      if (active) setProjects(records);
    });
    return () => {
      active = false;
    };
  }, [repository]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Decision meeting queue</p>
          <h1 className="page-title">Decision Agenda</h1>
          <p className="page-description">
            Prioritize retail and restaurant Decision Projects by required
            judgment, template fit, readiness, and review date.
          </p>
        </div>
      </div>

      <div className="table-shell mt-7">
        <table className="operating-table">
          <thead>
            <tr>
              <th>Decision</th>
              <th>Meeting mode</th>
              <th>Template</th>
              <th>Recommendation</th>
              <th>Owner</th>
              <th>North Star</th>
              <th>Deadline</th>
              <th>Meeting</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <strong className="text-white">{project.title}</strong>
                  <span className="record-meta">
                    {project.projectId} · {project.decisionLevel}
                  </span>
                </td>
                <td>
                  <span className="meeting-mode-badge">
                    {project.meetingMode}
                  </span>
                </td>
                <td>{project.decisionTypeTemplate.name}</td>
                <td>{project.recommendation}</td>
                <td>{project.owner}</td>
                <td>{project.primaryNorthStar}</td>
                <td>{project.decisionDeadline}</td>
                <td>
                  <Link
                    className="text-button"
                    to={`/decisions/${project.id}/meeting`}
                  >
                    Open meeting
                    <ArrowRight aria-hidden="true" size={14} />
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
