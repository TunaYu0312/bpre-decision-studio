import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { ConstraintBlueprint } from "@/domain/constraint-blueprint";
import type { Constraint } from "@/domain/constraint";

export class TraceabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TraceabilityError";
  }
}

export interface ConstraintTraceability {
  constraint: Constraint;
  article: ConstitutionRule;
  blueprint: ConstraintBlueprint;
}

export function resolveConstraintTraceability(
  constraint: Constraint,
  articles: ConstitutionRule[],
  blueprints: ConstraintBlueprint[],
): ConstraintTraceability {
  const article = articles.find(
    (candidate) => candidate.id === constraint.constitutionRuleId,
  );
  if (!article) {
    throw new TraceabilityError(
      `Missing Constitution Article ${constraint.constitutionRuleId}.`,
    );
  }

  const blueprint = blueprints.find(
    (candidate) => candidate.id === constraint.constraintBlueprintId,
  );
  if (!blueprint) {
    throw new TraceabilityError(
      `Missing Constraint Blueprint ${constraint.constraintBlueprintId}.`,
    );
  }

  const mismatches = [
    article.constitutionVersionId !== constraint.constitutionVersionId &&
      "Article Constitution version",
    blueprint.constitutionVersionId !== constraint.constitutionVersionId &&
      "Blueprint Constitution version",
    blueprint.parentArticleId !== article.id && "Blueprint parent Article",
    constraint.constitutionRuleId !== article.id && "Constraint parent Article",
    article.pillar !== constraint.pillar && "Article pillar",
    !article.relevantPillars.includes(constraint.pillar) &&
      "Article relevant pillars",
    blueprint.pillar !== constraint.pillar && "Blueprint pillar",
    blueprint.metricKey !== constraint.metricKey && "Blueprint metric",
  ].filter(Boolean);

  if (mismatches.length > 0) {
    throw new TraceabilityError(
      `Invalid traceability for ${constraint.constraintId}: ${mismatches.join(
        ", ",
      )}.`,
    );
  }

  return { constraint, article, blueprint };
}
