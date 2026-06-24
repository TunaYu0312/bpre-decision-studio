import { nextMinorVersion } from "./common";
import {
  constitutionSchema,
  constitutionScopeKey,
  type Constitution,
} from "./constitution";
import {
  constraintSchema,
  type Constraint,
  type ConstraintStatus,
} from "./constraint";

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export function assertConstitutionEditable(record: Constitution): void {
  if (record.status !== "Draft") {
    throw new DomainError(
      "Only Draft Constitutions can be edited. Clone this version to create a new Draft.",
    );
  }
}

export function cloneConstitution(
  source: Constitution,
  input: { id: string; now: string; changeNotes: string },
): Constitution {
  if (!input.changeNotes.trim()) {
    throw new DomainError("Change notes are required when cloning.");
  }

  return constitutionSchema.parse({
    ...source,
    id: input.id,
    version: nextMinorVersion(source.version),
    status: "Draft",
    supersedesId: source.id,
    changeNotes: input.changeNotes,
    createdAt: input.now,
    updatedAt: input.now,
    activatedAt: undefined,
    invalidationReason: undefined,
    effectiveEndDate: undefined,
  });
}

export function activateConstitution(
  records: Constitution[],
  targetId: string,
  now: string,
): Constitution[] {
  const target = records.find((record) => record.id === targetId);
  if (!target) {
    throw new DomainError("Constitution not found.");
  }
  assertConstitutionEditable(target);

  const targetScope = constitutionScopeKey(target);
  return records.map((record) => {
    if (record.id === targetId) {
      return constitutionSchema.parse({
        ...record,
        status: "Active",
        activatedAt: now,
        updatedAt: now,
      });
    }

    if (
      record.status === "Active" &&
      constitutionScopeKey(record) === targetScope
    ) {
      return constitutionSchema.parse({
        ...record,
        status: "Superseded",
        updatedAt: now,
      });
    }
    return record;
  });
}

export function invalidateConstitution(
  record: Constitution,
  input: {
    reason: string;
    effectiveEndDate: string;
    executiveOwner: string;
    now: string;
  },
): Constitution {
  if (record.status !== "Active") {
    throw new DomainError("Only an Active Constitution can be invalidated.");
  }
  if (!input.reason.trim()) {
    throw new DomainError("Invalidation reason is required.");
  }
  if (!input.effectiveEndDate.trim()) {
    throw new DomainError("Effective end date is required.");
  }
  if (!input.executiveOwner.trim()) {
    throw new DomainError("Executive owner is required.");
  }

  return constitutionSchema.parse({
    ...record,
    status: "Invalidated",
    invalidationReason: input.reason,
    effectiveEndDate: input.effectiveEndDate,
    executiveOwner: input.executiveOwner,
    updatedAt: input.now,
  });
}

const constraintTransitions: Record<ConstraintStatus, ConstraintStatus[]> = {
  Draft: ["Active"],
  Active: ["Suspended", "Retired"],
  Suspended: ["Active", "Retired"],
  Retired: [],
};

export function assertConstraintEditable(record: Constraint): void {
  if (record.status !== "Draft") {
    throw new DomainError(
      "Only Draft Constraints can be edited. Clone this version to create a new Draft.",
    );
  }
}

export function transitionConstraint(
  record: Constraint,
  nextStatus: ConstraintStatus,
  now: string,
): Constraint {
  if (!constraintTransitions[record.status].includes(nextStatus)) {
    throw new DomainError(
      `Cannot transition a Constraint from ${record.status} to ${nextStatus}.`,
    );
  }

  return constraintSchema.parse({
    ...record,
    status: nextStatus,
    updatedAt: now,
  });
}

export function cloneConstraint(
  source: Constraint,
  input: { id: string; now: string; changeNotes: string },
): Constraint {
  if (!input.changeNotes.trim()) {
    throw new DomainError("Change notes are required when cloning.");
  }

  return constraintSchema.parse({
    ...source,
    id: input.id,
    version: nextMinorVersion(source.version),
    status: "Draft",
    supersedesId: source.id,
    changeNotes: input.changeNotes,
    createdAt: input.now,
    updatedAt: input.now,
  });
}

export function activateConstraintVersion(
  records: Constraint[],
  targetId: string,
  now: string,
): Constraint[] {
  const target = records.find((record) => record.id === targetId);
  if (!target) throw new DomainError("Constraint not found.");
  const activated = transitionConstraint(target, "Active", now);

  return records.map((record) => {
    if (record.id === targetId) return activated;
    if (
      target.supersedesId === record.id &&
      (record.status === "Active" || record.status === "Suspended")
    ) {
      return transitionConstraint(record, "Retired", now);
    }
    return record;
  });
}
