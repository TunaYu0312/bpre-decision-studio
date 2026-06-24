import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";

import { useRepository } from "@/data/repository-context";
import { seedConstraints } from "@/data/seed";
import {
  bprePillars,
  constraintOperators,
  constraintTypes,
  dataTypes,
  decisionTypes,
  escalationRoles,
  exceptionPolicies,
  failureOutcomes,
  severities,
  type Constraint,
} from "@/domain/constraint";

import { ConstraintService } from "./constraint-service";

const required = z.string().trim().min(1, "Required");
const formSchema = z.object({
  constraintId: required,
  version: z.string().regex(/^\d+\.\d+$/, "Use major.minor"),
  constitutionVersionId: required,
  constitutionRuleId: required,
  pillar: z.enum(bprePillars),
  constraintType: z.enum(constraintTypes),
  name: required,
  description: required,
  scope: required,
  applicableDecisionTypes: z.array(z.enum(decisionTypes)).min(1),
  metricKey: required.regex(/^[a-z][a-z0-9_]*$/, "Use snake_case"),
  dataType: z.enum(dataTypes),
  operator: z.enum(constraintOperators),
  thresholdValue: z.string(),
  unit: z.string(),
  severity: z.enum(severities),
  outcomeIfFailed: z.enum(failureOutcomes),
  escalationRole: z.enum(escalationRoles),
  exceptionPolicy: z.enum(exceptionPolicies),
  requiredEvidence: required,
  effectiveDate: required,
  reviewFrequency: required,
  changeNotes: required,
});

type FormValues = z.infer<typeof formSchema>;

function thresholdToText(value: Constraint["thresholdValue"]): string {
  return Array.isArray(value) ? value.join("\n") : String(value ?? "");
}

function toFormValues(record: Constraint): FormValues {
  return {
    ...record,
    thresholdValue: thresholdToText(record.thresholdValue),
  };
}

function parseThreshold(values: FormValues): Constraint["thresholdValue"] {
  if (values.operator === "REQUIRED") return null;
  if (["Number", "Currency", "Percentage"].includes(values.dataType)) {
    return Number(values.thresholdValue);
  }
  if (values.dataType === "Boolean") {
    return values.thresholdValue.toLowerCase() === "true";
  }
  if (values.dataType === "Enum") {
    return values.thresholdValue
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return values.thresholdValue;
}

export function ConstraintFormPage() {
  const { id } = useParams();
  const repository = useRepository();
  const service = useMemo(
    () => new ConstraintService(repository),
    [repository],
  );
  const navigate = useNavigate();
  const [base, setBase] = useState<Constraint>(seedConstraints[0]);
  const [formError, setFormError] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues({
      ...seedConstraints[0],
      constraintId: "",
      name: "",
      metricKey: "",
      status: "Draft",
      changeNotes: "",
    }),
  });

  useEffect(() => {
    if (!id) return;
    service.get(id).then((record) => {
      if (!record) return;
      setBase(record);
      form.reset(toFormValues(record));
    });
  }, [form, id, service]);

  const submit = form.handleSubmit(async (values) => {
    setFormError("");
    try {
      const record: Constraint = {
        ...base,
        ...values,
        thresholdValue: parseThreshold(values),
      };
      const saved = id
        ? await service.updateDraft(id, record)
        : await service.createDraft(record);
      navigate(`/constraints/${saved.id}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save.");
    }
  });

  return (
    <section className="mx-auto max-w-5xl">
      <Link className="back-link" to={id ? `/constraints/${id}` : "/constraints"}>
        <ArrowLeft aria-hidden="true" size={16} />
        Back
      </Link>
      <div className="page-header mt-5">
        <div>
          <p className="eyebrow">Constraint editor</p>
          <h1 className="page-title">
            {id ? "Edit Draft Constraint" : "Create Constraint"}
          </h1>
          <p className="page-description">
            Translate a strategic principle into a measurable decision rule.
          </p>
        </div>
      </div>

      <form className="mt-7 space-y-6" onSubmit={submit}>
        <fieldset className="form-section">
          <legend>Rule identity and linkage</legend>
          <div className="form-grid">
            <Field label="Constraint ID">
              <input {...form.register("constraintId")} />
            </Field>
            <Field label="Version">
              <input {...form.register("version")} />
            </Field>
            <Field label="Constitution version ID">
              <input {...form.register("constitutionVersionId")} />
            </Field>
            <Field label="Constitution rule ID">
              <input {...form.register("constitutionRuleId")} />
            </Field>
            <Field label="BPR&E pillar">
              <select {...form.register("pillar")}>
                {bprePillars.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Constraint type">
              <select {...form.register("constraintType")}>
                {constraintTypes.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <WideField label="Constraint name">
              <input {...form.register("name")} />
            </WideField>
            <WideField label="Description / rationale">
              <textarea {...form.register("description")} />
            </WideField>
            <Field label="Scope">
              <input {...form.register("scope")} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Applicability and condition</legend>
          <div className="form-grid">
            <div className="form-field form-field--wide">
              <span>Applicable decision types</span>
              <div className="checkbox-grid">
                {decisionTypes.map((value) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      value={value}
                      {...form.register("applicableDecisionTypes")}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Metric key">
              <input {...form.register("metricKey")} />
            </Field>
            <Field label="Data type">
              <select {...form.register("dataType")}>
                {dataTypes.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Operator">
              <select {...form.register("operator")}>
                {constraintOperators.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Threshold value">
              <textarea
                placeholder="Use one value per line for Enum"
                {...form.register("thresholdValue")}
              />
            </Field>
            <Field label="Unit">
              <input {...form.register("unit")} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Governance response</legend>
          <div className="form-grid">
            <Field label="Severity">
              <select {...form.register("severity")}>
                {severities.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Outcome if failed">
              <select {...form.register("outcomeIfFailed")}>
                {failureOutcomes.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Escalation role">
              <select {...form.register("escalationRole")}>
                {escalationRoles.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Exception policy">
              <select {...form.register("exceptionPolicy")}>
                {exceptionPolicies.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <WideField label="Required evidence">
              <textarea {...form.register("requiredEvidence")} />
            </WideField>
            <Field label="Effective date">
              <input type="date" {...form.register("effectiveDate")} />
            </Field>
            <Field label="Review frequency">
              <input {...form.register("reviewFrequency")} />
            </Field>
            <WideField label="Change notes">
              <textarea {...form.register("changeNotes")} />
            </WideField>
          </div>
        </fieldset>

        {Object.keys(form.formState.errors).length > 0 && (
          <p className="form-error">
            Complete the highlighted required fields before saving.
          </p>
        )}
        {formError && <p className="form-error">{formError}</p>}
        <div className="flex justify-end">
          <button className="button button--primary" type="submit">
            <Save aria-hidden="true" size={17} />
            Save Draft
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function WideField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="form-field form-field--wide">
      <span>{label}</span>
      {children}
    </label>
  );
}
