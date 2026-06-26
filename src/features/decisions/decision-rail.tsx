import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type {
  DecisionProject,
  FinalDecisionOutcome,
} from "@/domain/decision-project";

export function DecisionRail({
  onAction,
  project,
}: {
  onAction: (action: FinalDecisionOutcome) => void;
  project: DecisionProject;
}) {
  const assessment = recommendationDisplay(project.recommendation);
  const approvalBlocked = project.meetingMode === "Incomplete Decision";
  const primaryAction: FinalDecisionOutcome =
    project.meetingMode === "Executive Escalation"
      ? "Approve Exception"
      : project.meetingMode === "Fast Track"
        ? "Approve"
        : "Revise";

  return (
    <aside className="decision-rail" aria-label="Meeting decision summary">
      <section className="rail-card rail-card--assessment" aria-live="polite">
        <p className="eyebrow">System assessment</p>
        <div className="recommendation-mark mt-4">
          <AlertTriangle aria-hidden="true" size={20} />
          <div>
            <span>Recommendation</span>
            <strong>{assessment}</strong>
          </div>
        </div>
        <p className="rail-reason">{project.evaluationSnapshot.reason}</p>
        <div className="readiness-meter">
          <div>
            <span>Decision readiness</span>
            <strong>
              {project.evaluationSnapshot.readinessComplete} of{" "}
              {project.evaluationSnapshot.readinessRequired}
            </strong>
          </div>
          <progress
            aria-label="Decision readiness"
            max={project.evaluationSnapshot.readinessRequired}
            value={project.evaluationSnapshot.readinessComplete}
          />
        </div>
      </section>

      <section className="rail-card">
        <p className="eyebrow">What must be resolved</p>
        <ol className="resolution-list mt-4">
          {project.requiredResolutions.map((resolution) => (
            <li key={resolution}>
              <CheckCircle2 aria-hidden="true" size={16} />
              <span>{resolution}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rail-card">
        <p className="eyebrow">Meeting actions</p>
        <div className="mt-4 grid gap-2">
          <button
            className="button button--primary w-full"
            disabled={approvalBlocked}
            onClick={() => onAction(primaryAction)}
            type="button"
          >
            {primaryActionLabel(primaryAction)}
          </button>
          <button
            className="button button--secondary w-full"
            disabled={approvalBlocked}
            onClick={() => onAction("Approve Exception")}
            type="button"
          >
            Approve Exception
          </button>
          <button
            className="button button--secondary w-full"
            onClick={() => onAction("Escalate")}
            type="button"
          >
            Escalate to CEO
          </button>
          <button
            className="button button--danger w-full"
            onClick={() => onAction("Reject")}
            type="button"
          >
            Reject Proposal
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          An action opens the human decision record. Nothing is approved or
          executed automatically.
        </p>
      </section>
    </aside>
  );
}

function recommendationDisplay(
  recommendation: DecisionProject["recommendation"],
): string {
  if (recommendation === "Pass") return "APPROVE";
  if (recommendation === "Escalate") return "EXECUTIVE ESCALATION";
  if (recommendation === "Incomplete") return "INCOMPLETE";
  return "REVISION REQUIRED";
}

function primaryActionLabel(action: FinalDecisionOutcome): string {
  if (action === "Approve") return "Approve Decision";
  if (action === "Approve Exception") return "Approve Exception";
  if (action === "Escalate") return "Escalate to CEO";
  if (action === "Reject") return "Reject Proposal";
  return "Return for Revision";
}
