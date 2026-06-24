import type { WorkspaceRepository } from "@/data/repository";
import {
  constitutionSchema,
  type Constitution,
} from "@/domain/constitution";
import {
  assertConstitutionEditable,
  cloneConstitution,
  DomainError,
  invalidateConstitution,
} from "@/domain/lifecycle";

interface ConstitutionServiceDependencies {
  now: () => string;
  id: () => string;
}

const defaultDependencies: ConstitutionServiceDependencies = {
  now: () => new Date().toISOString(),
  id: () => `constitution-${crypto.randomUUID()}`,
};

export class ConstitutionService {
  constructor(
    private readonly repository: WorkspaceRepository,
    private readonly dependencies: ConstitutionServiceDependencies =
      defaultDependencies,
  ) {}

  list(): Promise<Constitution[]> {
    return this.repository.listConstitutions();
  }

  get(id: string): Promise<Constitution | undefined> {
    return this.repository.getConstitution(id);
  }

  async createDraft(input: Constitution): Promise<Constitution> {
    const now = this.dependencies.now();
    const record = constitutionSchema.parse({
      ...input,
      id: this.dependencies.id(),
      status: "Draft",
      createdAt: now,
      updatedAt: now,
      activatedAt: undefined,
      invalidationReason: undefined,
      effectiveEndDate: undefined,
      supersedesId: undefined,
    });
    await this.repository.putConstitution(record);
    return record;
  }

  async updateDraft(
    id: string,
    input: Constitution,
  ): Promise<Constitution> {
    const current = await this.repository.getConstitution(id);
    if (!current) {
      throw new DomainError("Constitution not found.");
    }
    assertConstitutionEditable(current);

    const updated = constitutionSchema.parse({
      ...input,
      id: current.id,
      status: "Draft",
      createdAt: current.createdAt,
      updatedAt: this.dependencies.now(),
      supersedesId: current.supersedesId,
      activatedAt: undefined,
      invalidationReason: undefined,
      effectiveEndDate: undefined,
    });
    await this.repository.putConstitution(updated);
    return updated;
  }

  async clone(id: string, changeNotes: string): Promise<Constitution> {
    const source = await this.repository.getConstitution(id);
    if (!source) {
      throw new DomainError("Constitution not found.");
    }

    const cloned = cloneConstitution(source, {
      id: this.dependencies.id(),
      now: this.dependencies.now(),
      changeNotes,
    });
    await this.repository.putConstitution(cloned);
    return cloned;
  }

  async activate(id: string): Promise<Constitution> {
    return this.repository.activateConstitutionVersion(
      id,
      this.dependencies.now(),
    );
  }

  async invalidate(
    id: string,
    input: {
      reason: string;
      effectiveEndDate: string;
      executiveOwner: string;
    },
  ): Promise<Constitution> {
    const current = await this.repository.getConstitution(id);
    if (!current) {
      throw new DomainError("Constitution not found.");
    }

    const updated = invalidateConstitution(current, {
      ...input,
      now: this.dependencies.now(),
    });
    await this.repository.putConstitution(updated);
    return updated;
  }
}
