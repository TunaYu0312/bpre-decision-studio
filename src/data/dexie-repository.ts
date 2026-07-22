import Dexie, { type EntityTable } from "dexie";

import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constitution } from "@/domain/constitution";
import type { ConstraintBlueprint } from "@/domain/constraint-blueprint";
import type { Constraint } from "@/domain/constraint";
import type { ConstraintStatus } from "@/domain/constraint";
import type { DecisionProject } from "@/domain/decision-project";
import {
  activateConstitution,
  activateConstraintVersion,
  DomainError,
  transitionConstraint,
} from "@/domain/lifecycle";

import type { SeedWorkspace, WorkspaceRepository } from "./repository";

interface WorkspaceMeta {
  key: string;
  value: number | string;
}

class WorkspaceDatabase extends Dexie {
  constitutions!: EntityTable<Constitution, "id">;
  constitutionRules!: EntityTable<ConstitutionRule, "id">;
  constraintBlueprints!: EntityTable<ConstraintBlueprint, "id">;
  constraints!: EntityTable<Constraint, "id">;
  decisionProjects!: EntityTable<DecisionProject, "id">;
  workspaceMeta!: EntityTable<WorkspaceMeta, "key">;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      constitutions:
        "id, constitutionId, status, [scope+scopeValue], effectiveDate, updatedAt",
      constitutionRules: "id, ruleId, constitutionVersionId, pillar",
      constraints:
        "id, constraintId, status, pillar, constitutionVersionId, metricKey, severity, outcomeIfFailed",
      workspaceMeta: "key",
    });
    this.version(2).stores({
      constitutions:
        "id, constitutionId, status, [scope+scopeValue], effectiveDate, updatedAt",
      constitutionRules: "id, ruleId, constitutionVersionId, pillar",
      constraintBlueprints:
        "id, blueprintId, constitutionVersionId, parentArticleId, pillar, metricKey",
      constraints:
        "id, constraintId, status, pillar, constitutionVersionId, metricKey, severity, outcomeIfFailed",
      workspaceMeta: "key",
    });
    this.version(3).stores({
      constitutions:
        "id, constitutionId, status, [scope+scopeValue], effectiveDate, updatedAt",
      constitutionRules: "id, ruleId, constitutionVersionId, pillar",
      constraintBlueprints:
        "id, blueprintId, constitutionVersionId, parentArticleId, pillar, metricKey",
      constraints:
        "id, constraintId, status, pillar, constitutionVersionId, metricKey, severity, outcomeIfFailed",
      decisionProjects:
        "id, projectId, status, meetingMode, recommendation, decisionDeadline, updatedAt",
      workspaceMeta: "key",
    });
  }
}

export class DexieWorkspaceRepository implements WorkspaceRepository {
  private readonly database: WorkspaceDatabase;

  constructor(name = "bpre-decision-studio") {
    this.database = new WorkspaceDatabase(name);
  }

  async listConstitutions(): Promise<Constitution[]> {
    const records = await this.database.constitutions.toArray();
    return records.sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    );
  }

  getConstitution(id: string): Promise<Constitution | undefined> {
    return this.database.constitutions.get(id);
  }

  async putConstitution(record: Constitution): Promise<void> {
    await this.database.constitutions.put(record);
  }

  async putConstitutions(records: Constitution[]): Promise<void> {
    await this.database.transaction(
      "rw",
      this.database.constitutions,
      async () => {
        await this.database.constitutions.bulkPut(records);
      },
    );
  }

  async activateConstitutionVersion(
    id: string,
    now: string,
  ): Promise<Constitution> {
    return this.database.transaction(
      "rw",
      this.database.constitutions,
      async () => {
        const records = await this.database.constitutions.toArray();
        const updated = activateConstitution(records, id, now);
        await this.database.constitutions.bulkPut(updated);
        const activated = updated.find((record) => record.id === id);
        if (!activated) throw new DomainError("Constitution not found.");
        return activated;
      },
    );
  }

  listConstitutionRules(): Promise<ConstitutionRule[]> {
    return this.database.constitutionRules.toArray();
  }

  listConstitutionRulesFor(
    constitutionVersionId: string,
  ): Promise<ConstitutionRule[]> {
    return this.database.constitutionRules
      .where("constitutionVersionId")
      .equals(constitutionVersionId)
      .toArray();
  }

  listConstraintBlueprints(): Promise<ConstraintBlueprint[]> {
    return this.database.constraintBlueprints.toArray();
  }

  getConstraintBlueprint(
    id: string,
  ): Promise<ConstraintBlueprint | undefined> {
    return this.database.constraintBlueprints.get(id);
  }

  listConstraintBlueprintsForArticle(
    parentArticleId: string,
  ): Promise<ConstraintBlueprint[]> {
    return this.database.constraintBlueprints
      .where("parentArticleId")
      .equals(parentArticleId)
      .toArray();
  }

  async listConstraints(): Promise<Constraint[]> {
    const records = await this.database.constraints.toArray();
    return records.sort((left, right) =>
      left.constraintId.localeCompare(right.constraintId),
    );
  }

  getConstraint(id: string): Promise<Constraint | undefined> {
    return this.database.constraints.get(id);
  }

  async putConstraint(record: Constraint): Promise<void> {
    await this.database.constraints.put(record);
  }

  async putConstraints(records: Constraint[]): Promise<void> {
    await this.database.transaction("rw", this.database.constraints, async () => {
      await this.database.constraints.bulkPut(records);
    });
  }

  async transitionConstraintVersion(
    id: string,
    nextStatus: ConstraintStatus,
    now: string,
  ): Promise<Constraint> {
    return this.database.transaction("rw", this.database.constraints, async () => {
      const current = await this.database.constraints.get(id);
      if (!current) throw new DomainError("Constraint not found.");

      if (nextStatus !== "Active") {
        const updated = transitionConstraint(current, nextStatus, now);
        await this.database.constraints.put(updated);
        return updated;
      }

      const records = await this.database.constraints.toArray();
      const updated = activateConstraintVersion(records, id, now);
      await this.database.constraints.bulkPut(updated);
      const activated = updated.find((record) => record.id === id);
      if (!activated) throw new DomainError("Constraint not found.");
      return activated;
    });
  }

  async listDecisionProjects(): Promise<DecisionProject[]> {
    const records = await this.database.decisionProjects.toArray();
    return records.sort((left, right) =>
      left.decisionDeadline.localeCompare(right.decisionDeadline),
    );
  }

  getDecisionProject(id: string): Promise<DecisionProject | undefined> {
    return this.database.decisionProjects.get(id);
  }

  async putDecisionProject(record: DecisionProject): Promise<void> {
    await this.database.decisionProjects.put(record);
  }

  async seedWorkspaceIfNeeded(
    seedVersion: number,
    workspace: SeedWorkspace,
  ): Promise<boolean> {
    return this.database.transaction(
      "rw",
      [
        this.database.workspaceMeta,
        this.database.constitutions,
        this.database.constitutionRules,
        this.database.constraintBlueprints,
        this.database.constraints,
        this.database.decisionProjects,
      ],
      async () => {
        const current = await this.database.workspaceMeta.get("seedVersion");
        if (current?.value === seedVersion) {
          return false;
        }

        await this.database.constitutions.bulkPut(workspace.constitutions);
        await this.database.constitutionRules.bulkPut(
          workspace.constitutionRules,
        );
        await this.database.constraintBlueprints.bulkPut(
          workspace.constraintBlueprints,
        );
        await this.database.constraints.bulkPut(workspace.constraints);
        await this.database.decisionProjects.bulkPut(
          workspace.decisionProjects,
        );
        await this.database.workspaceMeta.put({
          key: "seedVersion",
          value: seedVersion,
        });
        return true;
      },
    );
  }

  async reset(): Promise<void> {
    this.database.close();
    await Dexie.delete(this.database.name);
  }
}
