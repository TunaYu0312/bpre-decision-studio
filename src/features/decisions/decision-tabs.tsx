import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  Eye,
  TrendingDown,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constraint } from "@/domain/constraint";
import type {
  ConstraintEvaluation,
  DecisionProject,
  FinalDecisionOutcome,
} from "@/domain/decision-project";

import {
  DecisionRecordSummary,
  FinalDecisionPanel,
} from "./final-decision-panel";
import type { DecisionService } from "./decision-service";

type DecisionTabId = "brief" | "card" | "evidence" | "rules" | "follow-up";

interface DecisionTabsProps {
  articles: ConstitutionRule[];
  constraints: Constraint[];
  onAction: (action: FinalDecisionOutcome) => void;
  onConstraintSelect: (id: string) => void;
  onRecorded: (project: DecisionProject) => void;
  project: DecisionProject;
  selectedAction: FinalDecisionOutcome | undefined;
  service: DecisionService;
}

const tabs: Array<{ id: DecisionTabId; label: string }> = [
  { id: "brief", label: "Decision Brief" },
  { id: "card", label: "Decision Card" },
  { id: "evidence", label: "Evidence & Options" },
  { id: "rules", label: "Rules & Exceptions" },
  { id: "follow-up", label: "Decision & Follow-up" },
];

export function DecisionTabs({
  articles,
  constraints,
  onAction,
  onConstraintSelect,
  onRecorded,
  project,
  selectedAction,
  service,
}: DecisionTabsProps) {
  const [activeTab, setActiveTab] = useState<DecisionTabId>("brief");
  const counts = useEvaluationCounts(project);
  const rulesBadge = counts.escalate + counts.revise + counts.missing;

  return (
    <div className="decision-tab-workspace">
      <div aria-label="Decision meeting flow" className="decision-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            aria-controls={`decision-tab-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className="decision-tab"
            id={`decision-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
            {tab.id === "rules" && rulesBadge > 0 && (
              <span aria-label={`${rulesBadge} rule items need attention`}>
                {rulesBadge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`decision-tab-${activeTab}`}
        className="decision-tab-panel"
        id={`decision-tab-panel-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === "brief" && (
          <DecisionBrief onAction={onAction} project={project} />
        )}
        {activeTab === "card" && <DecisionCard project={project} />}
        {activeTab === "evidence" && <EvidenceAndOptions project={project} />}
        {activeTab === "rules" && (
          <RulesAndExceptions
            articles={articles}
            constraints={constraints}
            counts={counts}
            onConstraintSelect={onConstraintSelect}
            project={project}
          />
        )}
        {activeTab === "follow-up" && (
          <DecisionFollowUp
            onRecorded={onRecorded}
            project={project}
            selectedAction={selectedAction}
            service={service}
          />
        )}
      </div>
    </div>
  );
}

function DecisionBrief({
  onAction,
  project,
}: {
  onAction: (action: FinalDecisionOutcome) => void;
  project: DecisionProject;
}) {
  const recommendedOption = project.options.find((option) => option.recommended);
  const reasons = getKeyReasons(project);
  const recommendationLabel = recommendationDisplay(project.recommendation);

  return (
    <section className="decision-brief">
      <div className="brief-hero">
        <div>
          <p className="eyebrow">Recommendation first</p>
          <h2>{recommendationLabel}</h2>
          <p>{project.evaluationSnapshot.reason}</p>
        </div>
        <div className="brief-request-card">
          <span>Decision Request</span>
          <strong>{project.decisionRequest}</strong>
        </div>
      </div>

      <div className="brief-grid">
        <article className="brief-card brief-card--wide">
          <span>Three key reasons</span>
          <ol className="brief-reason-list">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ol>
        </article>
        <article className="brief-card">
          <span>Core strategic trade-off</span>
          <strong>{project.coreTradeOff.upside}</strong>
          <p>{project.coreTradeOff.downside}</p>
        </article>
        <article className="brief-card">
          <span>Recommended option</span>
          <strong>{recommendedOption?.label ?? "No recommended option"}</strong>
          <p>{recommendedOption?.description ?? "Select an option before approval."}</p>
        </article>
        <article className="brief-card brief-card--wide">
          <span>Required meeting decision</span>
          <strong>{project.requestedDecision}</strong>
          <div className="brief-action-row">
            <button
              className="button button--primary"
              onClick={() => onAction("Revise")}
              type="button"
            >
              Prepare Revision Record
            </button>
            <button
              className="button button--secondary"
              onClick={() => onAction("Approve Exception")}
              type="button"
            >
              Prepare Exception Record
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function DecisionCard({ project }: { project: DecisionProject }) {
  const reviewEvents = project.timeline.filter((event) =>
    event.eventType.toLowerCase().includes("review"),
  );

  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Decision card"
        title="What exactly are we deciding?"
      />
      <div className="narrative-grid">
        <NarrativeItem label="Business Objective" value={project.businessObjective} />
        <NarrativeItem
          label="Target Customer"
          value={project.targetCustomers.join(" and ")}
        />
        <NarrativeItem label="Customer Journey Moment" value={project.journeyMoment} />
        <NarrativeItem label="Project Scope" value={project.decisionStatement} />
        <NarrativeItem label="Budget / Investment Envelope" value={project.budget} />
        <NarrativeItem
          label="Owner / Co-owner"
          value={`${project.owner} / ${project.coOwner}`}
        />
        <NarrativeItem label="Primary North Star" value={project.primaryNorthStar} />
        <NarrativeItem
          label="Supporting KPIs"
          value={project.supportingKpis.join(", ")}
        />
      </div>
      <div className="review-grid">
        <article>
          <span>Review dates</span>
          <ul>
            {reviewEvents.map((event) => (
              <li key={event.id}>
                <time>{event.date}</time>
                <strong>{event.description}</strong>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <span>Exit rule</span>
          <p>
            Stop or redesign if Store-level EBITDA stays negative, wait-time
            degradation breaches the guardrail, or Day 30 repeat-rate evidence
            does not validate the pilot.
          </p>
        </article>
      </div>
    </section>
  );
}

function EvidenceAndOptions({ project }: { project: DecisionProject }) {
  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Evidence & options"
        title="Only decision-relevant evidence is shown"
      />
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
      <div className="tradeoff-banner">
        <div>
          <span>Strategic trade-off</span>
          <strong>{project.coreTradeOff.upside}</strong>
        </div>
        <span className="tradeoff-versus">vs.</span>
        <strong>{project.coreTradeOff.downside}</strong>
      </div>
      <div className="table-shell">
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
              <tr className={option.recommended ? "recommended-row" : ""} key={option.id}>
                <td>
                  <strong>{option.label}</strong>
                  {option.recommended && (
                    <span className="recommended-label">Recommended Option</span>
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
    </section>
  );
}

function RulesAndExceptions({
  articles,
  constraints,
  counts,
  onConstraintSelect,
  project,
}: {
  articles: ConstitutionRule[];
  constraints: Constraint[];
  counts: ReturnType<typeof useEvaluationCounts>;
  onConstraintSelect: (id: string) => void;
  project: DecisionProject;
}) {
  const constraintMap = new Map(
    constraints.map((constraint) => [constraint.id, constraint]),
  );
  const articleMap = new Map(articles.map((article) => [article.id, article]));
  const attentionItems = project.evaluationSnapshot.results.filter(
    (evaluation) =>
      evaluation.result === "Fail" ||
      evaluation.outcome === "Revise" ||
      evaluation.outcome === "Escalate" ||
      evaluation.result === "Missing",
  );

  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Rules & exceptions"
        title="Only rules applicable to this decision"
      />
      <div className="constraint-summary">
        <SummaryChip label="Passed" value={counts.pass} />
        <SummaryChip label="Require Revision" value={counts.revise} />
        <SummaryChip label="Requires Escalation" value={counts.escalate} />
        <SummaryChip label="Missing Evidence" value={counts.missing} />
      </div>
      <div className="rule-attention-list">
        {attentionItems.map((evaluation) => {
          const constraint = constraintMap.get(evaluation.constraintId);
          const article = constraint
            ? articleMap.get(constraint.constitutionRuleId)
            : undefined;
          if (!constraint || !article) return null;
          return (
            <article className="rule-attention-card" key={evaluation.constraintId}>
              <div className="rule-chain">
                <ChainItem label="Constitution Article" value={`${article.name}: ${article.principle}`} />
                <ChainItem label="Derived Constraint" value={constraint.name} />
                <ChainItem label="Project Condition" value={evaluation.projectCondition} />
                <ChainItem label="Evaluation Result" value={`${evaluation.result} · ${evaluation.outcome}`} />
                <ChainItem label="Required Action" value={evaluation.requiredAction} />
              </div>
              <div className="exception-memo">
                <span>Exception request</span>
                <strong>
                  {evaluation.outcome === "Escalate"
                    ? "Executive exception required"
                    : "Revision required before approval"}
                </strong>
                <p>Reason: {constraint.derivationRationale}</p>
                <p>Authority: {constraint.exceptionPolicy}</p>
                <p>
                  Risk accepted: {constraint.description} if the meeting records
                  an exception.
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="table-shell">
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
    </section>
  );
}

function DecisionFollowUp({
  onRecorded,
  project,
  selectedAction,
  service,
}: {
  onRecorded: (project: DecisionProject) => void;
  project: DecisionProject;
  selectedAction: FinalDecisionOutcome | undefined;
  service: DecisionService;
}) {
  if (project.decisionRecord) {
    return <DecisionRecordSummary project={project} />;
  }

  if (selectedAction) {
    return (
      <FinalDecisionPanel
        initialOutcome={selectedAction}
        onRecorded={onRecorded}
        project={project}
        service={service}
      />
    );
  }

  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Decision & follow-up"
        title="Record the human decision after the meeting action is selected"
      />
      <div className="follow-up-summary">
        <NarrativeItem label="Owner / Co-owner" value={`${project.owner} / ${project.coOwner}`} />
        <NarrativeItem label="KPI / North Star" value={project.primaryNorthStar} />
        <NarrativeItem
          label="Review Schedule"
          value={project.timeline
            .filter((event) => event.eventType.toLowerCase().includes("review"))
            .map((event) => `${event.date}: ${event.description}`)
            .join(" ")}
        />
        <NarrativeItem
          label="Exit Rule"
          value="Stop or redesign if the pilot cannot restore non-negative EBITDA or protect service and brand guardrails by the review dates."
        />
      </div>
      <p className="context-note">
        Select a meeting action from the Decision Brief or sticky rail to open
        the final human decision record.
      </p>
    </section>
  );
}

function PanelHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="panel-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
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

function ChainItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
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

function EvaluationBadge({ result }: { result: ConstraintEvaluation["result"] }) {
  return (
    <span className={`evaluation-badge evaluation-badge--${slug(result)}`}>
      {result}
    </span>
  );
}

function SummaryChip({ label, value }: { label: string; value: number }) {
  return <span>{`${value} ${label}`}</span>;
}

function useEvaluationCounts(project: DecisionProject) {
  return useMemo(
    () => ({
      escalate: project.evaluationSnapshot.results.filter(
        (item) => item.outcome === "Escalate",
      ).length,
      missing: project.evaluationSnapshot.results.filter(
        (item) => item.result === "Missing",
      ).length,
      pass: project.evaluationSnapshot.results.filter(
        (item) => item.result === "Pass",
      ).length,
      revise: project.evaluationSnapshot.results.filter(
        (item) => item.outcome === "Revise",
      ).length,
    }),
    [project],
  );
}

function getKeyReasons(project: DecisionProject): string[] {
  const failedReasons = project.evaluationSnapshot.results
    .filter((result) => result.result === "Fail")
    .map((result) => result.requiredAction);
  const reasons = [...failedReasons, ...project.requiredResolutions];
  return Array.from(new Set(reasons)).slice(0, 3);
}

function recommendationDisplay(
  recommendation: DecisionProject["recommendation"],
): string {
  if (recommendation === "Pass") return "APPROVE";
  if (recommendation === "Escalate") return "EXECUTIVE ESCALATION";
  if (recommendation === "Incomplete") return "INCOMPLETE";
  return "REVISION REQUIRED";
}

function slug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}
