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

type DecisionTabId = "project" | "facts" | "decision" | "execution";

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
  { id: "project", label: "Decision Project" },
  { id: "facts", label: "Data Facts" },
  { id: "decision", label: "Decision" },
  { id: "execution", label: "Execution & Review" },
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
  const [activeTab, setActiveTab] = useState<DecisionTabId>("project");
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
            {tab.id === "decision" && rulesBadge > 0 && (
              <span aria-hidden="true">
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
        {activeTab === "project" && <DecisionProjectCard project={project} />}
        {activeTab === "facts" && <DataFactsCard project={project} />}
        {activeTab === "decision" && (
          <DecisionCard
            articles={articles}
            constraints={constraints}
            counts={counts}
            onAction={onAction}
            onConstraintSelect={onConstraintSelect}
            project={project}
          />
        )}
        {activeTab === "execution" && (
          <ExecutionReviewCard
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

function DecisionProjectCard({ project }: { project: DecisionProject }) {
  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Decision Project Card"
        title="What are we deciding and why now?"
      />
      <div className="decision-project-hero">
        <NarrativeItem label="Decision Project Name" value={project.title} />
        <NarrativeItem label="Decision ID" value={project.projectId} />
        <NarrativeItem label="Decision Type" value={project.decisionType} />
        <NarrativeItem label="Decision Priority / Level" value={project.decisionLevel} />
        <NarrativeItem label="Meeting Date" value={project.meetingDate} />
        <NarrativeItem label="Decision Deadline" value={project.decisionDeadline} />
      </div>
      <div className="narrative-grid">
        <NarrativeItem label="Background" value={project.subtitle} />
        <NarrativeItem label="Why Now" value={project.whyNow} />
        <NarrativeItem label="Strategic Stage" value={project.strategicStage} />
        <NarrativeItem label="Business Objective" value={project.businessObjective} />
        <NarrativeItem
          label="Target Customer"
          value={project.targetCustomers.join(" and ")}
        />
        <NarrativeItem label="Customer Journey Moment" value={project.journeyMoment} />
        <NarrativeItem
          label="Scope"
          value={`${project.decisionStatement} ${project.budget}`}
        />
        <NarrativeItem label="Decision Request" value={project.decisionRequest} />
        <NarrativeItem label="Decision Owner" value={project.owner} />
        <NarrativeItem label="Co-owner" value={project.coOwner} />
        <NarrativeItem label="Approver" value={project.approver} />
      </div>
    </section>
  );
}

function DataFactsCard({ project }: { project: DecisionProject }) {
  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Data Facts Card"
        title="What do we know, estimate, and still need to validate?"
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

function DecisionCard({
  articles,
  constraints,
  counts,
  onAction,
  onConstraintSelect,
  project,
}: {
  articles: ConstitutionRule[];
  constraints: Constraint[];
  counts: ReturnType<typeof useEvaluationCounts>;
  onAction: (action: FinalDecisionOutcome) => void;
  onConstraintSelect: (id: string) => void;
  project: DecisionProject;
}) {
  const recommendedOption = project.options.find((option) => option.recommended);
  const reasons = getKeyReasons(project);

  return (
    <section className="meeting-panel-stack">
      <PanelHeading
        eyebrow="Decision Card"
        title="Options, trade-offs, risks, rules, and recommendation"
      />
      <div className="tradeoff-banner">
        <div>
          <span>Core Strategic Conflict</span>
          <strong>{project.coreTradeOff.upside}</strong>
        </div>
        <span className="tradeoff-versus">vs.</span>
        <strong>{project.coreTradeOff.downside}</strong>
      </div>
      <OptionsComparison project={project} />
      <BpreAssessment project={project} />
      <RecommendationPanel
        onAction={onAction}
        project={project}
        reasons={reasons}
        recommendedOption={recommendedOption}
      />
      <RulesAndExceptions
        articles={articles}
        constraints={constraints}
        counts={counts}
        onConstraintSelect={onConstraintSelect}
        project={project}
      />
    </section>
  );
}

function OptionsComparison({ project }: { project: DecisionProject }) {
  return (
    <section className="decision-card-section">
      <h3>Options Comparison</h3>
      <div className="table-shell">
        <table className="operating-table option-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Description</th>
              <th>Main Benefit</th>
              <th>Main Cost / Risk</th>
              <th>Economic Impact</th>
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
                <td>{option.constraintStatus}</td>
                <td>{option.economicImpact}</td>
                <td>{option.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BpreAssessment({ project }: { project: DecisionProject }) {
  return (
    <section className="decision-card-section">
      <h3>BPR&E Assessment</h3>
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
    </section>
  );
}

function RecommendationPanel({
  onAction,
  project,
  reasons,
  recommendedOption,
}: {
  onAction: (action: FinalDecisionOutcome) => void;
  project: DecisionProject;
  reasons: string[];
  recommendedOption: DecisionProject["options"][number] | undefined;
}) {
  return (
    <section className="decision-card-section recommendation-panel">
      <div>
        <p className="eyebrow">Recommendation</p>
        <h2>{recommendationDisplay(project.recommendation)}</h2>
        <p>{project.evaluationSnapshot.reason}</p>
      </div>
      <div className="brief-grid">
        <article className="brief-card">
          <span>Why</span>
          <ol className="brief-reason-list">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ol>
        </article>
        <article className="brief-card">
          <span>Recommended Change</span>
          <strong>{recommendedOption?.label ?? "No recommended option"}</strong>
          <p>{recommendedOption?.description ?? "Select an option before approval."}</p>
        </article>
        <article className="brief-card brief-card--wide">
          <span>Required Meeting Decision</span>
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
    <section className="decision-card-section">
      <h3>Rules and Exceptions</h3>
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
                <p>Business rationale: {constraint.derivationRationale}</p>
                <p>Expected upside: {project.coreTradeOff.upside}</p>
                <p>Risk accepted: {constraint.description}</p>
                <p>Authority: {constraint.exceptionPolicy}</p>
                <p>Expiry date: {project.decisionDeadline}</p>
                <p>Mandatory review date: Day 10 and Day 30</p>
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
              <th>Rule</th>
              <th>Project Condition</th>
              <th>Result</th>
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

function ExecutionReviewCard({
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
        eyebrow="Execution & Review Card"
        title="What did we decide, who owns it, and when will we review?"
      />
      <OwnershipModel project={project} />
      <div className="follow-up-summary">
        <NarrativeItem label="Primary North Star" value={project.primaryNorthStar} />
        <NarrativeItem
          label="Supporting KPIs"
          value={project.supportingKpis.join(", ")}
        />
        <NarrativeItem
          label="Success Target"
          value="+$20K incremental EBITDA within 30 days"
        />
        <NarrativeItem
          label="Guardrail Metrics"
          value="Wait time, signature-product value perception, payback, product mix"
        />
        <NarrativeItem
          label="Review Plan"
          value="Day 5, Day 10, Day 30, Day 90"
        />
        <NarrativeItem
          label="Exit Rule"
          value="Stop the pilot if incremental EBITDA remains negative at Day 10 or average wait time exceeds one minute."
        />
      </div>
      <ActionPlanTable project={project} />
      <p className="context-note">
        Select a meeting action from the sticky decision rail or Decision card
        to open the final human decision record.
      </p>
    </section>
  );
}

function OwnershipModel({ project }: { project: DecisionProject }) {
  return (
    <section className="decision-card-section">
      <h3>Ownership Model</h3>
      <div className="ownership-grid">
        <NarrativeItem label="Decision Owner" value={project.owner} />
        <NarrativeItem label="Execution Owner" value={project.coOwner} />
        <NarrativeItem label="Data Owner" value="Data Team" />
        <NarrativeItem label="Approver" value={project.approver} />
      </div>
    </section>
  );
}

function ActionPlanTable({ project }: { project: DecisionProject }) {
  return (
    <section className="decision-card-section">
      <h3>Action Plan</h3>
      <div className="table-shell">
        <table className="operating-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Owner</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {project.proposedActionPlan.map((task) => (
              <tr key={task.id}>
                <td>{task.action}</td>
                <td>{task.owner}</td>
                <td>{task.dueDate}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  if (recommendation === "Pass") return "READY FOR APPROVAL";
  if (recommendation === "Escalate") return "CEO ESCALATION REQUIRED";
  if (recommendation === "Incomplete") return "DECISION NOT READY";
  return "REVISION REQUIRED";
}

function slug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}
