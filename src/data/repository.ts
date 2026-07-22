import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constitution } from "@/domain/constitution";
import type { ConstraintBlueprint } from "@/domain/constraint-blueprint";
import type { Constraint } from "@/domain/constraint";
import type { ConstraintStatus } from "@/domain/constraint";
import type { DecisionProject } from "@/domain/decision-project";

export interface SeedWorkspace {
  constitutions: Constitution[];
  constitutionRules: ConstitutionRule[];
  constraintBlueprints: ConstraintBlueprint[];
  constraints: Constraint[];
  decisionProjects: DecisionProject[];
}

export interface WorkspaceRepository {
  listConstitutions(): Promise<Constitution[]>;
  getConstitution(id: string): Promise<Constitution | undefined>;
  putConstitution(record: Constitution): Promise<void>;
  putConstitutions(records: Constitution[]): Promise<void>;
  activateConstitutionVersion(id: string, now: string): Promise<Constitution>;

  listConstitutionRules(): Promise<ConstitutionRule[]>;
  listConstitutionRulesFor(
    constitutionVersionId: string,
  ): Promise<ConstitutionRule[]>;

  listConstraintBlueprints(): Promise<ConstraintBlueprint[]>;
  getConstraintBlueprint(id: string): Promise<ConstraintBlueprint | undefined>;
  listConstraintBlueprintsForArticle(
    parentArticleId: string,
  ): Promise<ConstraintBlueprint[]>;

  listConstraints(): Promise<Constraint[]>;
  getConstraint(id: string): Promise<Constraint | undefined>;
  putConstraint(record: Constraint): Promise<void>;
  putConstraints(records: Constraint[]): Promise<void>;
  transitionConstraintVersion(
    id: string,
    nextStatus: ConstraintStatus,
    now: string,
  ): Promise<Constraint>;

  listDecisionProjects(): Promise<DecisionProject[]>;
  getDecisionProject(id: string): Promise<DecisionProject | undefined>;
  putDecisionProject(record: DecisionProject): Promise<void>;

  seedWorkspaceIfNeeded(
    seedVersion: number,
    workspace: SeedWorkspace,
  ): Promise<boolean>;
}
