import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CircleAlert,
  ClipboardCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useRepository } from "@/data/repository-context";
import type { DecisionProject } from "@/domain/decision-project";

import { getUpcomingReviews } from "./decision-home-utils";

export function DecisionHomePage() {
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

  const attention = projects.filter(
    (project) =>
      project.status === "Revision Required" ||
      project.status === "Escalated" ||
      project.meetingMode === "Incomplete Decision",
  );
  const escalated = projects.filter(
    (project) =>
      project.recommendation === "Escalate" ||
      project.meetingMode === "Executive Escalation",
  );
  const upcomingReviews = getUpcomingReviews(projects);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">BPR&E Decision Meeting Studio</p>
          <h1 className="page-title">Decisions requiring attention</h1>
          <p className="page-description">
            A structured decision workspace for high-value retail and restaurant decisions.
            It turns business meetings into clear recommendations, accountable
            action plans, and review commitments.
          </p>
        </div>
        <Link className="button button--secondary" to="/decision-agenda">
          Open Decision Agenda
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="decision-kpi-grid mt-7">
        <KpiCard
          icon={CircleAlert}
          label="Requires attention"
          tone="amber"
          value={attention.length}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Executive escalations"
          tone="red"
          value={escalated.length}
        />
        <KpiCard
          icon={ClipboardCheck}
          label="Revision recommendations"
          tone="violet"
          value={projects.filter((item) => item.recommendation === "Revise").length}
        />
        <KpiCard
          icon={CalendarClock}
          label="Upcoming reviews"
          tone="blue"
          value={upcomingReviews.length}
        />
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <section className="operating-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Active judgment</p>
              <h2>What needs a decision now</h2>
            </div>
            <span>{attention.length} open</span>
          </div>
          <div className="mt-5 space-y-3">
            {attention.map((project) => (
              <article className="attention-card" key={project.id}>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="soft-tag">{project.decisionType}</span>
                    <span className="soft-tag">{project.decisionLevel}</span>
                    <span className="meeting-mode-badge">
                      {project.meetingMode}
                    </span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.evaluationSnapshot.reason}</p>
                  <div className="attention-meta">
                    <span>Owner: {project.owner}</span>
                    <span>North Star: {project.primaryNorthStar}</span>
                    <span>Template: {project.decisionTypeTemplate.name}</span>
                    <span>Decision date: {project.decisionDeadline}</span>
                  </div>
                </div>
                <Link
                  aria-label="Open Breakfast Combo Pilot"
                  className="button button--primary"
                  to={`/decisions/${project.id}`}
                >
                  Open meeting
                </Link>
              </article>
            ))}
          </div>
          {attention.length === 1 && (
            <p className="sr-only">1 decision requires attention</p>
          )}
        </section>

        <section className="operating-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Review calendar</p>
              <h2>Upcoming deadlines</h2>
            </div>
          </div>
          <ol className="deadline-list mt-5">
            {upcomingReviews.slice(0, 4).map((event) => (
              <li key={event.id}>
                <time>{event.date}</time>
                <div>
                  <strong>{event.description}</strong>
                  <span>{event.project.projectId}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}

function KpiCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof CircleAlert;
  label: string;
  tone: string;
  value: number;
}) {
  return (
    <article className={`decision-kpi decision-kpi--${tone}`}>
      <Icon aria-hidden="true" size={18} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
