import { X } from "lucide-react";

import type { ConstitutionRule } from "@/domain/constitution-rule";
import type { ConstraintBlueprint } from "@/domain/constraint-blueprint";
import type { Constraint } from "@/domain/constraint";
import type { ConstraintEvaluation } from "@/domain/decision-project";

export function ConstraintSourceDrawer({
  article,
  blueprint,
  constraint,
  evaluation,
  onClose,
}: {
  article: ConstitutionRule;
  blueprint: ConstraintBlueprint;
  constraint: Constraint;
  evaluation: ConstraintEvaluation;
  onClose: () => void;
}) {
  return (
    <div className="drawer-backdrop" role="presentation">
      <aside
        aria-label="Constraint source details"
        aria-modal="true"
        className="source-drawer"
        role="dialog"
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Why does this rule apply?</p>
            <h2>Constraint Source</h2>
          </div>
          <button
            aria-label="Close constraint source"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="drawer-content">
          <DrawerItem label="Constraint" value={constraint.name} />
          <DrawerItem
            label="Derived from"
            value={`${article.ruleId} — ${article.name}`}
          />
          <DrawerItem label="Strategic principle" value={article.principle} />
          <DrawerItem
            label="Control objective"
            value={blueprint.controlObjective}
          />
          <DrawerItem label="Why this rule exists" value={blueprint.riskToAvoid} />
          <DrawerItem
            label="Threshold source"
            value={blueprint.thresholdSource}
          />
          <DrawerItem
            label="Derivation rationale"
            value={constraint.derivationRationale}
          />
          <DrawerItem
            label="Exception policy"
            value={constraint.exceptionPolicy}
          />
          <DrawerItem
            label="Meeting evaluation"
            value={`${evaluation.projectCondition} → ${evaluation.result} / ${evaluation.outcome}`}
          />
        </div>
      </aside>
    </div>
  );
}

function DrawerItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="drawer-item">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}
