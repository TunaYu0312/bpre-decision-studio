import type { WorkspaceRepository } from "@/data/repository";
import {
  constraintSchema,
  type Constraint,
  type ConstraintStatus,
} from "@/domain/constraint";
import {
  assertConstraintEditable,
  cloneConstraint,
  DomainError,
} from "@/domain/lifecycle";

import type { ConstraintTraceability } from "./constraint-traceability";

export interface ConstraintFilters {
  search?: string;
  pillar?: string;
  status?: string;
  decisionType?: string;
  scope?: string;
  severity?: string;
  outcome?: string;
}

export function filterConstraints(
  records: Constraint[],
  filters: ConstraintFilters,
): Constraint[] {
  const search = filters.search?.trim().toLowerCase();
  return records.filter((record) => {
    if (
      search &&
      ![record.constraintId, record.name, record.metricKey].some((value) =>
        value.toLowerCase().includes(search),
      )
    ) {
      return false;
    }
    if (filters.pillar && record.pillar !== filters.pillar) return false;
    if (filters.status && record.status !== filters.status) return false;
    if (
      filters.decisionType &&
      !record.applicableDecisionTypes.includes(
        filters.decisionType as Constraint["applicableDecisionTypes"][number],
      )
    ) {
      return false;
    }
    if (filters.scope && record.scope !== filters.scope) return false;
    if (filters.severity && record.severity !== filters.severity) return false;
    if (filters.outcome && record.outcomeIfFailed !== filters.outcome) {
      return false;
    }
    return true;
  });
}

export function filterConstraintTraceability(
  records: ConstraintTraceability[],
  filters: ConstraintFilters,
): ConstraintTraceability[] {
  const baseMatches = new Set(
    filterConstraints(
      records.map((record) => record.constraint),
      { ...filters, search: undefined },
    ).map((record) => record.id),
  );
  const search = filters.search?.trim().toLowerCase();

  return records.filter((record) => {
    if (!baseMatches.has(record.constraint.id)) return false;
    if (!search) return true;

    return [
      record.constraint.constraintId,
      record.constraint.name,
      record.constraint.metricKey,
      record.article.ruleId,
      record.article.principle,
      record.blueprint.blueprintId,
      record.blueprint.controlObjective,
    ].some((value) => value.toLowerCase().includes(search));
  });
}

interface ConstraintServiceDependencies {
  now: () => string;
  id: () => string;
}

const defaultDependencies: ConstraintServiceDependencies = {
  now: () => new Date().toISOString(),
  id: () => `constraint-${crypto.randomUUID()}`,
};

export class ConstraintService {
  constructor(
    private readonly repository: WorkspaceRepository,
    private readonly dependencies: ConstraintServiceDependencies =
      defaultDependencies,
  ) {}

  async list(filters: ConstraintFilters = {}): Promise<Constraint[]> {
    return filterConstraints(await this.repository.listConstraints(), filters);
  }

  get(id: string): Promise<Constraint | undefined> {
    return this.repository.getConstraint(id);
  }

  async createDraft(input: Constraint): Promise<Constraint> {
    const now = this.dependencies.now();
    const record = constraintSchema.parse({
      ...input,
      id: this.dependencies.id(),
      status: "Draft",
      supersedesId: undefined,
      createdAt: now,
      updatedAt: now,
    });
    await this.repository.putConstraint(record);
    return record;
  }

  async updateDraft(id: string, input: Constraint): Promise<Constraint> {
    const current = await this.repository.getConstraint(id);
    if (!current) throw new DomainError("Constraint not found.");
    assertConstraintEditable(current);

    const updated = constraintSchema.parse({
      ...input,
      id: current.id,
      status: "Draft",
      supersedesId: current.supersedesId,
      createdAt: current.createdAt,
      updatedAt: this.dependencies.now(),
    });
    await this.repository.putConstraint(updated);
    return updated;
  }

  async clone(id: string, changeNotes: string): Promise<Constraint> {
    const source = await this.repository.getConstraint(id);
    if (!source) throw new DomainError("Constraint not found.");

    const cloned = cloneConstraint(source, {
      id: this.dependencies.id(),
      now: this.dependencies.now(),
      changeNotes,
    });
    await this.repository.putConstraint(cloned);
    return cloned;
  }

  async transition(
    id: string,
    nextStatus: ConstraintStatus,
  ): Promise<Constraint> {
    return this.repository.transitionConstraintVersion(
      id,
      nextStatus,
      this.dependencies.now(),
    );
  }
}
