import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import { useRepository } from "@/data/repository-context";
import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constraint } from "@/domain/constraint";
import type {
  ConstraintEvaluation,
  DecisionProject,
  FinalDecisionOutcome,
} from "@/domain/decision-project";

import { DecisionService } from "./decision-service";

type MeetingPageId = "brief" | "facts" | "options" | "risks" | "commitments";

const meetingPages: Array<{
  id: MeetingPageId;
  label: string;
  question: string;
}> = [
  {
    id: "brief",
    label: "Decision Brief",
    question: "What decision is required today?",
  },
  {
    id: "facts",
    label: "Facts",
    question: "What do we know, and what is still uncertain?",
  },
  {
    id: "options",
    label: "Options",
    question: "What are the real choices and trade-offs?",
  },
  {
    id: "risks",
    label: "Risks",
    question: "What must be revised, escalated, or accepted?",
  },
  {
    id: "commitments",
    label: "Commitments",
    question: "What decision and responsibilities are locked?",
  },
];

export function DecisionMeetingModePage() {
  const { id = "" } = useParams();
  const repository = useRepository();
  const service = useMemo(() => new DecisionService(repository), [repository]);
  const [project, setProject] = useState<DecisionProject>();
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [articles, setArticles] = useState<ConstitutionRule[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOutcome, setSelectedOutcome] =
    useState<FinalDecisionOutcome>("Revise");

  useEffect(() => {
    let active = true;
    Promise.all([
      service.get(id),
      repository.listConstraints(),
      repository.listConstitutionRules(),
    ]).then(([decision, allConstraints, allArticles]) => {
      if (!active) return;
      setProject(decision);
      setConstraints(allConstraints);
      setArticles(allArticles);
    });
    return () => {
      active = false;
    };
  }, [id, repository, service]);

  if (!project) {
    return <p className="meeting-loading">Loading meeting mode...</p>;
  }

  const activePage = meetingPages[activeIndex];
  const appliedConstraintIds = new Set(
    project.evaluationSnapshot.results.map((result) => result.constraintId),
  );
  const appliedConstraints = constraints.filter((constraint) =>
    appliedConstraintIds.has(constraint.id),
  );
  const relevantArticleSet = new Set(project.relevantArticleIds);
  const relevantArticles = articles.filter((article) =>
    relevantArticleSet.has(article.id),
  );

  return (
    <main className="meeting-mode-shell">
      <header className="meeting-mode-topbar">
        <div>
          <p className="eyebrow">Meeting Mode</p>
          <strong>{project.projectId} · {project.decisionType}</strong>
        </div>
        <nav aria-label="Mode switch" className="mode-switch">
          <Link aria-current="page" to={`/decisions/${project.id}/meeting`}>
            Meeting Mode
          </Link>
          <Link to={`/decisions/${project.id}`}>
            Workspace Mode
            <ExternalLink aria-hidden="true" size={13} />
          </Link>
        </nav>
      </header>

      <section className="meeting-stage" aria-labelledby="meeting-page-title">
        <div className="meeting-progress" aria-label="Meeting sequence">
          {meetingPages.map((page, index) => (
            <button
              aria-current={index === activeIndex ? "step" : undefined}
              className="meeting-progress-step"
              key={page.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span>{index + 1}</span>
              {page.label}
            </button>
          ))}
        </div>

        <div className="meeting-slide">
          <div className="meeting-slide-question">
            <span>Page {activeIndex + 1} / 5</span>
            <h1 id="meeting-page-title">{activePage.question}</h1>
          </div>

          {activePage.id === "brief" && <DecisionBriefPage project={project} />}
          {activePage.id === "facts" && <DataFactsPage project={project} />}
          {activePage.id === "options" && <OptionsPage project={project} />}
          {activePage.id === "risks" && (
            <RisksPage
              articles={relevantArticles}
              constraints={appliedConstraints}
              project={project}
            />
          )}
          {activePage.id === "commitments" && (
            <CommitmentsPage
              onOutcomeChange={setSelectedOutcome}
              project={project}
              selectedOutcome={selectedOutcome}
            />
          )}
        </div>

        <footer className="meeting-controls">
          <button
            className="button button--secondary"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Previous
          </button>
          <span>{activePage.label}</span>
          {activeIndex === meetingPages.length - 1 ? (
            <span className="meeting-complete-indicator">End of meeting flow</span>
          ) : (
            <button
              className="button button--primary"
              onClick={() =>
                setActiveIndex((index) =>
                  Math.min(meetingPages.length - 1, index + 1),
                )
              }
              type="button"
            >
              Next
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}

function DecisionBriefPage({ project }: { project: DecisionProject }) {
  const reasons = getKeyReasons(project);

  return (
    <div className="meeting-brief-page">
      <section className="meeting-recommendation-card">
        <span>Recommendation</span>
        <h2>{recommendationDisplay(project.recommendation)}</h2>
        <p>{project.evaluationSnapshot.reason}</p>
      </section>
      <section className="meeting-main-card">
        <p className="eyebrow">Decision Required</p>
        <h2>{project.title}</h2>
        <strong>{project.decisionRequest}</strong>
        <div className="meeting-reason-list">
          {reasons.map((reason) => (
            <p key={reason}>
              <CheckCircle2 aria-hidden="true" size={17} />
              {reason}
            </p>
          ))}
        </div>
      </section>
      <section className="meeting-decision-needed">
        <span>Decision needed today</span>
        <strong>{project.requestedDecision}</strong>
      </section>
      <div className="meeting-tag-row" aria-label="Meeting essentials">
        <MeetingTag label="Decision Owner" value={project.owner} />
        <MeetingTag label="Execution Owner" value={project.executionOwner} />
        <MeetingTag label="North Star" value={project.primaryNorthStar} />
        <MeetingTag label="Meeting Deadline" value={project.decisionDeadline} />
      </div>
    </div>
  );
}

function DataFactsPage({ project }: { project: DecisionProject }) {
  const facts = project.evidence.slice(0, 6);
  const keyUncertainty =
    project.evidence.find((item) => item.quality === "Missing") ??
    project.evidence.find((item) => item.quality !== "Verified");

  return (
    <div className="meeting-facts-page">
      <div className="meeting-metric-grid">
        {facts.map((evidence) => (
          <article className="meeting-metric-card" key={evidence.id}>
            <span>{evidence.name}</span>
            <strong>{evidence.displayValue}</strong>
            <EvidenceQuality quality={evidence.quality} />
          </article>
        ))}
      </div>
      <section className="meeting-key-uncertainty">
        <span>Key uncertainty</span>
        <strong>
          {keyUncertainty
            ? `${keyUncertainty.name}: ${keyUncertainty.calculationNote}`
            : "No material uncertainty flagged."}
        </strong>
      </section>
      <details className="meeting-detail-drawer">
        <summary>View Evidence Detail</summary>
        <div className="meeting-detail-grid">
          {facts.map((evidence) => (
            <article key={evidence.id}>
              <strong>{evidence.name}</strong>
              <span>{evidence.source}</span>
              <span>{evidence.period}</span>
              <span>{evidence.calculationNote}</span>
              <span>Owner: {evidence.owner}</span>
            </article>
          ))}
        </div>
      </details>
    </div>
  );
}

function OptionsPage({ project }: { project: DecisionProject }) {
  const optionCards = project.options.slice(0, 3).map((option) => ({
    ...option,
    ...optionMeetingCopy(option.id),
  }));

  return (
    <div className="meeting-options-page">
      <div className="meeting-option-grid">
        {optionCards.map((option) => (
          <article
            className={`meeting-option-card ${
              option.recommended ? "meeting-option-card--recommended" : ""
            }`}
            key={option.id}
          >
            <span>{option.label}</span>
            <h2>{option.shortTitle}</h2>
            <p>{option.description}</p>
            <dl>
              <div>
                <dt>Gain</dt>
                <dd>{option.gain}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{option.risk}</dd>
              </div>
              <div>
                <dt>Economic impact</dt>
                <dd>{option.economicImpact}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{option.recommendation}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <section className="meeting-tradeoff-statement">
        The real trade-off is not promotion or no promotion. It is traffic
        growth versus sustainable store economics and customer value.
      </section>
    </div>
  );
}

function RisksPage({
  articles,
  constraints,
  project,
}: {
  articles: ConstitutionRule[];
  constraints: Constraint[];
  project: DecisionProject;
}) {
  const constraintMap = new Map(
    constraints.map((constraint) => [constraint.id, constraint]),
  );
  const articleMap = new Map(articles.map((article) => [article.id, article]));
  const failedOrEscalated = project.evaluationSnapshot.results.filter(
    (evaluation) =>
      evaluation.result === "Fail" || evaluation.outcome === "Escalate",
  );
  const missingEvidence = project.evidence.find(
    (evidence) => evidence.quality === "Missing",
  );
  const riskItems = [
    ...failedOrEscalated.slice(0, 2).map((evaluation) => ({
      evaluation,
      kind: "rule" as const,
    })),
    ...(missingEvidence
      ? [{ evidence: missingEvidence, kind: "evidence" as const }]
      : []),
  ].slice(0, 3);

  return (
    <div className="meeting-risks-page">
      <div className="meeting-risk-list">
        {riskItems.map((item, index) => {
          if (item.kind === "evidence") {
            return (
              <article className="meeting-risk-card" key={item.evidence.id}>
                <span>{index + 1}. Evidence Risk</span>
                <h2>{item.evidence.name}</h2>
                <p>{item.evidence.displayValue}</p>
                <strong>Required response: Add Day 30 review condition</strong>
                <details className="meeting-detail-drawer">
                  <summary>Why this risk matters?</summary>
                  <p>
                    {item.evidence.calculationNote} Evidence owner:{" "}
                    {item.evidence.owner}.
                  </p>
                </details>
              </article>
            );
          }

          const constraint = constraintMap.get(item.evaluation.constraintId);
          const article = constraint
            ? articleMap.get(constraint.constitutionRuleId)
            : undefined;

          return (
            <RiskRuleCard
              article={article}
              constraint={constraint}
              evaluation={item.evaluation}
              index={index}
              key={item.evaluation.constraintId}
            />
          );
        })}
      </div>
    </div>
  );
}

function RiskRuleCard({
  article,
  constraint,
  evaluation,
  index,
}: {
  article: ConstitutionRule | undefined;
  constraint: Constraint | undefined;
  evaluation: ConstraintEvaluation;
  index: number;
}) {
  return (
    <article className="meeting-risk-card">
      <span>{index + 1}. {constraint?.pillar ?? "Rule"} Risk</span>
      <h2>{constraint?.name ?? evaluation.constraintId}</h2>
      <p>{evaluation.projectCondition}</p>
      <strong>Required response: {evaluation.requiredAction}</strong>
      <details className="meeting-detail-drawer">
        <summary>Why this rule applies?</summary>
        <div className="meeting-rule-chain">
          <RuleChainItem
            label="Constitution Article"
            value={
              article
                ? `${article.name}: ${article.principle}`
                : "No article found"
            }
          />
          <RuleChainItem
            label="Derived Constraint"
            value={constraint?.name ?? evaluation.constraintId}
          />
          <RuleChainItem
            label="Project Condition"
            value={evaluation.projectCondition}
          />
          <RuleChainItem
            label="Evaluation Result"
            value={`${evaluation.result} · ${evaluation.outcome}`}
          />
          <RuleChainItem
            label="Required Action"
            value={evaluation.requiredAction}
          />
        </div>
      </details>
    </article>
  );
}

function CommitmentsPage({
  onOutcomeChange,
  project,
  selectedOutcome,
}: {
  onOutcomeChange: (outcome: FinalDecisionOutcome) => void;
  project: DecisionProject;
  selectedOutcome: FinalDecisionOutcome;
}) {
  const reviewDates = project.timeline
    .filter((event) => event.eventType.toLowerCase().includes("review"))
    .map((event) => `${event.description.replace(" due.", "")}: ${event.date}`);

  return (
    <div className="meeting-commitments-page">
      <section className="meeting-final-decision-card">
        <span>Final decision</span>
        <h2>{finalDecisionLabel(selectedOutcome)}</h2>
        <p>
          Current proposal cannot proceed because EBITDA is negative and the
          pricing mechanism creates avoidable brand-value risk.
        </p>
        <div className="meeting-final-actions" aria-label="Final decision actions">
          {(["Revise", "Approve", "Approve Exception", "Escalate", "Reject"] as const).map(
            (outcome) => (
              <button
                className={
                  outcome === selectedOutcome
                    ? "button button--primary"
                    : "button button--secondary"
                }
                key={outcome}
                onClick={() => onOutcomeChange(outcome)}
                type="button"
              >
                {finalDecisionLabel(outcome)}
              </button>
            ),
          )}
        </div>
      </section>

      <section className="meeting-commitment-grid">
        <CommitmentItem label="Decision Owner" value={project.owner} />
        <CommitmentItem label="Execution Owner" value={project.executionOwner} />
        <CommitmentItem label="Data Owner" value={project.dataOwner} />
        <CommitmentItem label="Approver" value={project.approver} />
        <CommitmentItem label="Primary North Star" value={project.primaryNorthStar} />
        <CommitmentItem label="Supporting KPIs" value={project.supportingKpis.join(" | ")} />
        <CommitmentItem label="Review Dates" value={reviewDates.join(" | ")} />
        <CommitmentItem
          label="Exit Rule"
          value="Do not launch if revised projected EBITDA remains negative. Stop pilot if Day 10 EBITDA is negative or wait time exceeds one minute."
        />
      </section>

      <section className="meeting-action-plan">
        <span>Action plan</span>
        <ol>
          {project.proposedActionPlan.slice(0, 4).map((task) => (
            <li key={task.id}>
              <strong>{task.action}</strong>
              <span>{task.owner} · {task.dueDate}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function MeetingTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="meeting-tag">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CommitmentItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meeting-commitment-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RuleChainItem({ label, value }: { label: string; value: string }) {
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
  return (
    <span className={`meeting-quality meeting-quality--${slug(quality)}`}>
      {quality === "Missing" && <CircleHelp aria-hidden="true" size={13} />}
      {quality}
    </span>
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

function finalDecisionLabel(outcome: FinalDecisionOutcome): string {
  if (outcome === "Approve") return "Approve";
  if (outcome === "Approve Exception") return "Approve Exception";
  if (outcome === "Escalate") return "Escalate";
  if (outcome === "Reject") return "Reject";
  if (outcome === "Defer") return "Defer";
  return "Return for Revision";
}

function optionMeetingCopy(optionId: string) {
  if (optionId === "option-b") {
    return {
      gain: "Better product mix, positive EBITDA path, protects value perception",
      risk: "Requires more store preparation",
      shortTitle: "Revised Bundle",
    };
  }
  if (optionId === "option-c") {
    return {
      gain: "No execution or pricing risk",
      risk: "Missed traffic opportunity",
      shortTitle: "No Launch",
    };
  }
  return {
    gain: "Fast traffic uplift",
    risk: "Negative EBITDA and weaker price perception",
    shortTitle: "Current Proposal",
  };
}

function slug(value: string): string {
  return value.toLowerCase().replaceAll(" ", "-");
}
