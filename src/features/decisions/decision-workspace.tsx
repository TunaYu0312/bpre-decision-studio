import { FileDown, MessageSquarePlus, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

import { useRepository } from "@/data/repository-context";
import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { ConstraintBlueprint } from "@/domain/constraint-blueprint";
import type { Constraint } from "@/domain/constraint";
import type { DecisionProject } from "@/domain/decision-project";
import type { FinalDecisionOutcome } from "@/domain/decision-project";

import { ConstraintSourceDrawer } from "./constraint-source-drawer";
import { DecisionRail } from "./decision-rail";
import { DecisionTabs } from "./decision-tabs";
import { DecisionService } from "./decision-service";

export function DecisionWorkspacePage() {
  const { id = "" } = useParams();
  const repository = useRepository();
  const service = useMemo(
    () => new DecisionService(repository),
    [repository],
  );
  const [project, setProject] = useState<DecisionProject>();
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [articles, setArticles] = useState<ConstitutionRule[]>([]);
  const [blueprints, setBlueprints] = useState<ConstraintBlueprint[]>([]);
  const [selectedConstraintId, setSelectedConstraintId] = useState("");
  const [selectedAction, setSelectedAction] =
    useState<FinalDecisionOutcome>();

  useEffect(() => {
    let active = true;
    Promise.all([
      service.get(id),
      repository.listConstraints(),
      repository.listConstitutionRules(),
      repository.listConstraintBlueprints(),
    ]).then(([decision, allConstraints, allArticles, allBlueprints]) => {
      if (!active) return;
      setProject(decision);
      setConstraints(allConstraints);
      setArticles(allArticles);
      setBlueprints(allBlueprints);
    });
    return () => {
      active = false;
    };
  }, [id, repository, service]);

  if (!project) {
    return <p className="text-slate-400">Loading decision workspace…</p>;
  }

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
  const selectedConstraint = constraints.find(
    (constraint) => constraint.id === selectedConstraintId,
  );
  const selectedEvaluation = project.evaluationSnapshot.results.find(
    (evaluation) => evaluation.constraintId === selectedConstraintId,
  );
  const selectedBlueprint = blueprints.find(
    (blueprint) => blueprint.id === selectedConstraint?.constraintBlueprintId,
  );
  const selectedArticle = articles.find(
    (article) => article.id === selectedConstraint?.constitutionRuleId,
  );

  return (
    <section className="decision-workspace mx-auto max-w-[1500px]">
      <div className="meeting-command-bar">
        <div>
          <nav aria-label="Breadcrumb" className="meeting-breadcrumb">
            <Link to="/decision-agenda">Decision Agenda</Link>
            <span>/</span>
            <span>Active Decisions</span>
            <span>/</span>
            <strong>Breakfast Combo Pilot</strong>
          </nav>
          <div className="meeting-status-row">
            <span>{project.decisionType}</span>
            <span>{project.decisionLevel}</span>
            <span>{project.meetingMode}</span>
            <span>Meeting: 14 Jun 2026</span>
          </div>
        </div>
        <div className="meeting-command-actions">
          <button className="button button--secondary" type="button">
            Open Evidence Pack
          </button>
          <button className="button button--secondary" type="button">
            <FileDown aria-hidden="true" size={15} />
            Export Meeting Brief
          </button>
          <button className="button button--secondary" type="button">
            <MessageSquarePlus aria-hidden="true" size={15} />
            Add Meeting Note
          </button>
          <button aria-label="More Actions" className="icon-button" type="button">
            <MoreHorizontal aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <header className="decision-meeting-header">
        <p className="eyebrow">Decision meeting workspace</p>
        <h1>{project.title}</h1>
        <p>{project.subtitle}</p>
        <div className="decision-snapshot-grid">
          <Snapshot label="Decision Request" value={project.decisionRequest} />
          <Snapshot label="Decision Owner" value={project.owner} />
          <Snapshot label="Co-owner" value={project.coOwner} />
          <Snapshot label="Decision Deadline" value={project.decisionDeadline} />
          <Snapshot label="Strategic Stage" value={project.strategicStage} />
          <Snapshot label="Primary North Star" value={project.primaryNorthStar} />
        </div>
      </header>

      <div className="meeting-lifecycle" aria-label="Decision lifecycle">
        {["Prepared", "Evaluated", "Meeting", "Action", "Review"].map(
          (step, index) => (
            <span
              className={index <= 2 ? "meeting-lifecycle--active" : ""}
              key={step}
            >
              {step}
            </span>
          ),
        )}
      </div>

      <div className="decision-workspace-grid">
        <DecisionTabs
          articles={relevantArticles}
          constraints={appliedConstraints}
          onAction={(action) => setSelectedAction(action)}
          onConstraintSelect={setSelectedConstraintId}
          onRecorded={(recorded) => {
            setProject(recorded);
            setSelectedAction(undefined);
          }}
          project={project}
          selectedAction={selectedAction}
          service={service}
        />
        <DecisionRail
          onAction={(action) => setSelectedAction(action as FinalDecisionOutcome)}
          project={project}
        />
      </div>

      {selectedConstraint &&
        selectedEvaluation &&
        selectedBlueprint &&
        selectedArticle && (
          <ConstraintSourceDrawer
            article={selectedArticle}
            blueprint={selectedBlueprint}
            constraint={selectedConstraint}
            evaluation={selectedEvaluation}
            onClose={() => setSelectedConstraintId("")}
          />
        )}
    </section>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="decision-snapshot">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
