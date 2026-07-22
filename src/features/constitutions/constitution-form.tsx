import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";

import { useRepository } from "@/data/repository-context";
import { seedConstitution } from "@/data/seed";
import {
  constitutionScopes,
  strategicStages,
  type Constitution,
} from "@/domain/constitution";

import { ConstitutionService } from "./constitution-service";

const required = z.string().trim().min(1, "Required");
const constitutionFormSchema = z.object({
  constitutionId: required,
  version: z.string().regex(/^\d+\.\d+$/, "Use major.minor"),
  title: required,
  scope: z.enum(constitutionScopes),
  scopeValue: required,
  businessUnitMarket: required,
  strategicStage: z.enum(strategicStages),
  effectiveDate: required,
  reviewDate: required,
  executiveOwner: required,
  maintainer: required,
  primaryStrategicPriority: required,
  primaryNorthStarMetric: required,
  supportingMetrics: z.string(),
  acceptableTradeOffs: required,
  nonNegotiableTradeOffs: required,
  ceoEscalationThresholds: required,
  priorityTargetCustomers: required,
  priorityJourneyMoments: required,
  customerProblemsToSolve: required,
  customerExperienceNonNegotiables: required,
  brandBoundary: required,
  productBoundary: required,
  restaurantRetailBoundary: required,
  economicBoxBoundary: required,
  decisionRights: required,
  ceoEscalationConditions: required,
  annualReviewCadence: required,
  exceptionalUpdateTriggers: required,
  changeNotes: required,
});

type FormValues = z.infer<typeof constitutionFormSchema>;

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (value: string[]) => value.join("\n");

function toFormValues(record: Constitution): FormValues {
  return {
    constitutionId: record.constitutionId,
    version: record.version,
    title: record.title,
    scope: record.scope,
    scopeValue: record.scopeValue,
    businessUnitMarket: record.businessUnitMarket,
    strategicStage: record.strategicStage,
    effectiveDate: record.effectiveDate,
    reviewDate: record.reviewDate,
    executiveOwner: record.executiveOwner,
    maintainer: record.maintainer,
    primaryStrategicPriority: record.primaryStrategicPriority,
    primaryNorthStarMetric: record.primaryNorthStarMetric,
    supportingMetrics: joinLines(record.supportingMetrics),
    acceptableTradeOffs: joinLines(record.acceptableTradeOffs),
    nonNegotiableTradeOffs: joinLines(record.nonNegotiableTradeOffs),
    ceoEscalationThresholds: joinLines(record.ceoEscalationThresholds),
    priorityTargetCustomers: joinLines(record.priorityTargetCustomers),
    priorityJourneyMoments: joinLines(record.priorityJourneyMoments),
    customerProblemsToSolve: joinLines(record.customerProblemsToSolve),
    customerExperienceNonNegotiables: joinLines(
      record.customerExperienceNonNegotiables,
    ),
    brandBoundary: record.boundaries.brand,
    productBoundary: record.boundaries.product,
    restaurantRetailBoundary: record.boundaries.restaurantRetail,
    economicBoxBoundary: record.boundaries.economicBox,
    decisionRights: record.decisionRights,
    ceoEscalationConditions: record.ceoEscalationConditions,
    annualReviewCadence: record.annualReviewCadence,
    exceptionalUpdateTriggers: record.exceptionalUpdateTriggers,
    changeNotes: record.changeNotes,
  };
}

function toRecord(values: FormValues, base: Constitution): Constitution {
  return {
    ...base,
    ...values,
    supportingMetrics: splitLines(values.supportingMetrics),
    acceptableTradeOffs: splitLines(values.acceptableTradeOffs),
    nonNegotiableTradeOffs: splitLines(values.nonNegotiableTradeOffs),
    ceoEscalationThresholds: splitLines(values.ceoEscalationThresholds),
    priorityTargetCustomers: splitLines(values.priorityTargetCustomers),
    priorityJourneyMoments: splitLines(values.priorityJourneyMoments),
    customerProblemsToSolve: splitLines(values.customerProblemsToSolve),
    customerExperienceNonNegotiables: splitLines(
      values.customerExperienceNonNegotiables,
    ),
    boundaries: {
      brand: values.brandBoundary,
      product: values.productBoundary,
      restaurantRetail: values.restaurantRetailBoundary,
      economicBox: values.economicBoxBoundary,
    },
  };
}

function Field({
  error,
  label,
  children,
}: {
  error?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}

export function ConstitutionFormPage() {
  const { id } = useParams();
  const repository = useRepository();
  const service = useMemo(
    () => new ConstitutionService(repository),
    [repository],
  );
  const navigate = useNavigate();
  const [base, setBase] = useState<Constitution>(seedConstitution);
  const [formError, setFormError] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(constitutionFormSchema),
    defaultValues: toFormValues({
      ...seedConstitution,
      constitutionId: "",
      title: "",
      status: "Draft",
      version: "1.0",
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
      const record = toRecord(values, base);
      const saved = id
        ? await service.updateDraft(id, record)
        : await service.createDraft(record);
      navigate(`/constitutions/${saved.id}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save.");
    }
  });

  return (
    <section className="mx-auto max-w-5xl">
      <Link className="back-link" to={id ? `/constitutions/${id}` : "/constitutions"}>
        <ArrowLeft aria-hidden="true" size={16} />
        Back
      </Link>
      <div className="page-header mt-5">
        <div>
          <p className="eyebrow">Constitution editor</p>
          <h1 className="page-title">
            {id ? "Edit Draft Constitution" : "Create Constitution"}
          </h1>
          <p className="page-description">
            Strategic boundaries become operational only when they are explicit.
          </p>
        </div>
      </div>

      <form className="mt-7 space-y-6" onSubmit={submit}>
        <FormSection title="A. Document control">
          <Field
            error={form.formState.errors.constitutionId?.message}
            label="Constitution ID"
          >
            <input {...form.register("constitutionId")} />
          </Field>
          <Field error={form.formState.errors.version?.message} label="Version">
            <input {...form.register("version")} />
          </Field>
          <Field error={form.formState.errors.title?.message} label="Title">
            <input {...form.register("title")} />
          </Field>
          <Field label="Scope">
            <select {...form.register("scope")}>
              {constitutionScopes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </Field>
          <Field label="Scope value">
            <input {...form.register("scopeValue")} />
          </Field>
          <Field label="Business unit / market">
            <input {...form.register("businessUnitMarket")} />
          </Field>
          <Field label="Strategic stage">
            <select {...form.register("strategicStage")}>
              {strategicStages.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </Field>
          <Field label="Effective date">
            <input type="date" {...form.register("effectiveDate")} />
          </Field>
          <Field label="Review date">
            <input type="date" {...form.register("reviewDate")} />
          </Field>
          <Field label="Executive owner">
            <input {...form.register("executiveOwner")} />
          </Field>
          <Field label="Maintainer">
            <input {...form.register("maintainer")} />
          </Field>
        </FormSection>

        <FormSection title="B. Strategic mandate">
          <WideField label="Primary strategic priority">
            <textarea {...form.register("primaryStrategicPriority")} />
          </WideField>
          <Field label="Primary North Star metric">
            <input {...form.register("primaryNorthStarMetric")} />
          </Field>
          <WideField label="Supporting metrics — one per line">
            <textarea {...form.register("supportingMetrics")} />
          </WideField>
          <WideField label="Acceptable trade-offs — one per line">
            <textarea {...form.register("acceptableTradeOffs")} />
          </WideField>
          <WideField label="Non-negotiable red lines — one per line">
            <textarea {...form.register("nonNegotiableTradeOffs")} />
          </WideField>
          <WideField label="CEO escalation thresholds — one per line">
            <textarea {...form.register("ceoEscalationThresholds")} />
          </WideField>
        </FormSection>

        <FormSection title="C. Customer-centricity foundation">
          <WideField label="Priority target customers — one per line">
            <textarea {...form.register("priorityTargetCustomers")} />
          </WideField>
          <WideField label="Priority journey moments — one per line">
            <textarea {...form.register("priorityJourneyMoments")} />
          </WideField>
          <WideField label="Customer problems to solve — one per line">
            <textarea {...form.register("customerProblemsToSolve")} />
          </WideField>
          <WideField label="Experience non-negotiables — one per line">
            <textarea {...form.register("customerExperienceNonNegotiables")} />
          </WideField>
        </FormSection>

        <FormSection title="D. BPR&E strategic boundaries">
          <WideField label="Brand">
            <textarea {...form.register("brandBoundary")} />
          </WideField>
          <WideField label="Product">
            <textarea {...form.register("productBoundary")} />
          </WideField>
          <WideField label="Restaurant / Retail">
            <textarea {...form.register("restaurantRetailBoundary")} />
          </WideField>
          <WideField label="Economic Box">
            <textarea {...form.register("economicBoxBoundary")} />
          </WideField>
        </FormSection>

        <FormSection title="E. Governance and review">
          <WideField label="Decision rights">
            <textarea {...form.register("decisionRights")} />
          </WideField>
          <WideField label="CEO escalation conditions">
            <textarea {...form.register("ceoEscalationConditions")} />
          </WideField>
          <Field label="Annual review cadence">
            <input {...form.register("annualReviewCadence")} />
          </Field>
          <WideField label="Exceptional update triggers">
            <textarea {...form.register("exceptionalUpdateTriggers")} />
          </WideField>
          <WideField label="Change notes">
            <textarea {...form.register("changeNotes")} />
          </WideField>
        </FormSection>

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

function FormSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="form-grid">{children}</div>
    </fieldset>
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
