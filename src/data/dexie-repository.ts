import Dexie, { type EntityTable } from "dexie";

import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { Constitution } from "@/domain/constitution";
import type { Constraint } from "@/domain/constraint";

import type { SeedWorkspace, WorkspaceRepository } from "./repository";

interface WorkspaceMeta {
  key: string;
  value: number | string;
}

class WorkspaceDatabase extends Dexie {
  constitutions!: EntityTable<Constitution, "id">;
  constitutionRules!: EntityTable<ConstitutionRule, "id">;
  constraints!: EntityTable<Constraint, "id">;
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
        this.database.constraints,
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
        await this.database.constraints.bulkPut(workspace.constraints);
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
