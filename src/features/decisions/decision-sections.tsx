import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Eye,
  TrendingDown,
} from "lucide-react";

import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constraint } from "@/domain/constraint";
import type { DecisionProject } from "@/domain/decision-project";

export function DecisionSections({
  articles,
  constraints,
  onConstraintSelect,
  project,
}: {
  articles: ConstitutionRule[];
  constraints: Constraint[];
  onConstraintSelect: (id: string) => void;
  project: DecisionProject;
}) {
  const constraintMap = new Map(
    constraints.map((constraint) => [constraint.id, constraint]),
  );
  const passCount = project.evaluationSnapshot.results.filter(
    (item) => item.result === "Pass",
  ).length;
  const reviseCount = project.evaluationSnapshot.results.filter(
    (item) => item.outcome === "Revise",
  ).length;
  const escalateCount = project.evaluationSnapshot.results.filter(
    (item) => item.outcome === "Escalate",
  ).length;
  const missingCount = project.evaluationSnapshot.results.filter(
    (item) => item.result === "Missing",
  ).length;

  return (
    <div className="decision-discussion">
      <MeetingSection number="1" title="What Are We Deciding?">
        <div className="narrative-grid">
          <NarrativeItem label="Decision Statement" value={project.decisionStatement} />
          <NarrativeItem label="Why Now?" value={project.whyNow} />
          <NarrativeItem label="Business Objective" value={project.businessObjective} />
          <NarrativeItem label="Decision Type" value={project.decisionType} />
          <NarrativeItem
            label="Requested Decision"
            value={project.requestedDecision}
          />
        </div>
      </MeetingSection>

      <MeetingSection number="2" title="Who Are We Trying to Serve?">
        <div className="narrative-grid">
          <NarrativeItem
            label="Priority Target Customer"
            value={project.targetCustomers.join(" and ")}
          />
          <NarrativeItem
            label="Priority Journey Moment"
            value={project.journeyMoment}
          />
          <NarrativeItem
            label="Customer Problem to Solve"
            value={project.customerProblem}
          />
          <NarrativeItem
            label="Experience Non-Negotiables"
            value={project.experienceNonNegotiables.join(" ")}
          />
        </div>
        <p className="context-note">
          Customer context defines whether the project solves a real customer
          problem; it is not an additional marketing description.
        </p>
      </MeetingSection>

      <MeetingSection number="3" title="What Does the Evidence Show?">
        <div className="evidence-grid">
          {project.evidence.map((evidence) => (
            <article className="evidence-card" key={evidence.id}>
              <div>
                <span>{evidence.name}</span>
                <EvidenceQuality quality={evidence.quality} />
              </div>
              <strong>{evidence.displayValue}</strong>
            </article>
          ))}
        </div>
        <div className="evidence-completeness">
          <span>
            Evidence Completeness: {project.evidenceComplete} of{" "}
            {project.evidenceRequired} required inputs complete
          </span>
          <progress
            aria-label="Evidence completeness"
            max={project.evidenceRequired}
            value={project.evidenceComplete}
          />
        </div>
        <details className="meeting-disclosure">
          <summary>View Data Sources and Assumptions</summary>
          <div className="source-grid">
            {project.evidence.map((evidence) => (
              <div key={evidence.id}>
                <strong>{evidence.name}</strong>
                <span>{evidence.source}</span>
                <span>{evidence.period}</span>
                <span>{evidence.calculationNote}</span>
                <span>
                  Owner: {evidence.owner} · Confidence: {evidence.confidence}
                </span>
              </div>
            ))}
          </div>
        </details>
      </MeetingSection>

      <MeetingSection number="4" title="What Are the Real Options and Trade-offs?">
        <div className="tradeoff-banner">
          <div>
            <span>Core Trade-off</span>
            <strong>{project.coreTradeOff.upside}</strong>
          </div>
          <span className="tradeoff-versus">vs.</span>
          <strong>{project.coreTradeOff.downside}</strong>
        </div>
        <div className="table-shell mt-5">
          <table className="operating-table option-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Description</th>
                <th>Customer Value</th>
                <th>Economic Impact</th>
                <th>Constraint Status</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {project.options.map((option) => (
                <tr
                  className={option.recommended ? "recommended-row" : ""}
                  key={option.id}
                >
                  <td>
                    <strong>{option.label}</strong>
                    {option.recommended && (
                      <span className="recommended-label">
                        Recommended Option
                      </span>
                    )}
                  </td>
                  <td>{option.description}</td>
                  <td>{option.customerValue}</td>
                  <td>{option.economicImpact}</td>
                  <td>{option.constraintStatus}</td>
                  <td>{option.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MeetingSection>

      <MeetingSection number="5" title="BPR&E Impact Assessment">
        <div className="impact-grid">
          {project.impacts.map((impact) => (
            <article className={`impact-card impact-card--${slug(impact.status)}`} key={impact.pillar}>
              <div>
                <strong>{impact.pillar}</strong>
                <span>{impact.status}</span>
              </div>
              <p>{impact.summary}</p>
            </article>
          ))}
        </div>
      </MeetingSection>

      <MeetingSection
        number="6"
        title="Does This Project Meet Its Required Conditions?"
      >
        <div className="constraint-summary">
          <SummaryChip label="Passed" value={passCount} />
          <SummaryChip label="Require Revision" value={reviseCount} />
          <SummaryChip label="Requires Escalation" value={escalateCount} />
          <SummaryChip label="Missing Evidence" value={missingCount} />
        </div>
        <div className="table-shell mt-5">
          <table className="operating-table evaluation-table">
            <thead>
              <tr>
                <th>Pillar</th>
                <th>Constraint</th>
                <th>Project Condition</th>
                <th>Result</th>
                <th>Outcome</th>
                <th>Required Action</th>
              </tr>
            </thead>
            <tbody>
              {project.evaluationSnapshot.results.map((evaluation) => {
                const constraint = constraintMap.get(evaluation.constraintId);
                if (!constraint) return null;
                return (
                  <tr
                    className={
                      evaluation.result === "Fail" ? "evaluation-row--fail" : ""
                    }
                    key={evaluation.constraintId}
                  >
                    <td>
                      <span className="pillar-tag">{constraint.pillar}</span>
                    </td>
                    <td>
                      <button
                        className="constraint-source-button"
                        onClick={() => onConstraintSelect(constraint.id)}
                        type="button"
                      >
                        {constraint.name}
                        <Eye aria-hidden="true" size={14} />
                      </button>
                    </td>
                    <td>{evaluation.projectCondition}</td>
                    <td>
                      <EvaluationBadge result={evaluation.result} />
                    </td>
                    <td>{evaluation.outcome}</td>
                    <td>{evaluation.requiredAction}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MeetingSection>

      <MeetingSection number="7" title="Which Strategic Rules Apply?">
        <div className="article-reference-list">
          {articles.map((article) => (
            <article key={article.id}>
              <div>
                <span>{article.ruleId}</span>
                <strong>{article.name}</strong>
              </div>
              <p>{article.principle}</p>
            </article>
          ))}
        </div>
        <p className="context-note">
          These Articles are not additional approval layers. They explain why
          the active Constraints apply to this project.
        </p>
      </MeetingSection>
    </div>
  );
}

function MeetingSection({
  children,
  number,
  title,
}: {
  children: React.ReactNode;
  number: string;
  title: string;
}) {
  return (
    <section className="meeting-section">
      <div className="meeting-section-title">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <div className="meeting-section-body">{children}</div>
    </section>
  );
}

function NarrativeItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="narrative-item">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function EvidenceQuality({
  quality,
}: {
  quality: DecisionProject["evidence"][number]["quality"];
}) {
  const Icon =
    quality === "Verified"
      ? CheckCircle2
      : quality === "Missing"
        ? CircleHelp
        : quality === "Assumption"
          ? AlertCircle
          : TrendingDown;
  return (
    <span className={`evidence-quality evidence-quality--${slug(quality)}`}>
      <Icon aria-hidden="true" size={12} />
      {quality}
    </span>
  );
}

function SummaryChip({ label, value }: { label: string; value: number }) {
  return <span>{`${value} ${label}`}</span>;
}

function EvaluationBadge({ result }: { result: string }) {
  return (
    <span className={`evaluation-badge evaluation-badge--${slug(result)}`}>
      {result}
    </span>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}
