import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type {
  DecisionProject,
  FinalDecisionOutcome,
} from "@/domain/decision-project";

import { DecisionService } from "./decision-service";

const required = z.string().trim().min(1, "Required");
const finalDecisionFormSchema = z.object({
  outcome: z.enum([
    "Approve",
    "Approve Exception",
    "Revise",
    "Escalate",
    "Reject",
    "Defer",
  ]),
  rationale: z
    .string()
    .trim()
    .min(1, "Decision rationale is required"),
  decisionMaker: required,
  decisionDate: required,
  owner: required,
  coOwner: required,
  approver: required,
  primaryNorthStar: required,
  supportingKpis: required,
  successTarget: required,
  executionScope: required,
  reviewCheckpoints: required,
  exitRule: required,
  acceptedExceptionIds: z.array(z.string()),
});

type FinalDecisionFormValues = z.infer<typeof finalDecisionFormSchema>;

export function FinalDecisionPanel({
  initialOutcome,
  onRecorded,
  project,
  service,
}: {
  initialOutcome: FinalDecisionOutcome;
  onRecorded: (project: DecisionProject) => void;
  project: DecisionProject;
  service: DecisionService;
}) {
  const [serviceError, setServiceError] = useState("");
  const failedConstraints = useMemo(
    () =>
      project.evaluationSnapshot.results.filter(
        (evaluation) => evaluation.result === "Fail",
      ),
    [project.evaluationSnapshot.results],
  );
  const form = useForm<FinalDecisionFormValues>({
    resolver: zodResolver(finalDecisionFormSchema),
    defaultValues: {
      outcome: initialOutcome,
      rationale: "",
      decisionMaker: project.approver,
      decisionDate: project.meetingDate,
      owner: project.owner,
      coOwner: project.coOwner,
      approver: project.approver,
      primaryNorthStar: project.primaryNorthStar,
      supportingKpis: project.supportingKpis.join("\n"),
      successTarget: "+$20K incremental EBITDA within 30 days",
      executionScope: "30 stores / 10 days",
      reviewCheckpoints: "Day 5\nDay 10\nDay 30\nDay 90",
      exitRule:
        "Stop the pilot if incremental EBITDA remains negative at Day 10 or average wait time exceeds one minute.",
      acceptedExceptionIds: [],
    },
  });
  const selectedOutcome = useWatch({
    control: form.control,
    name: "outcome",
  });

  const submit = form.handleSubmit(async (values) => {
    setServiceError("");
    try {
      const recorded = await service.recordDecision(project.id, {
        outcome: values.outcome,
        rationale: values.rationale,
        decisionMaker: values.decisionMaker,
        decisionDate: values.decisionDate,
        acceptedExceptionIds: values.acceptedExceptionIds,
        commitments: {
          owner: values.owner,
          coOwner: values.coOwner,
          approver: values.approver,
          primaryNorthStar: values.primaryNorthStar,
          supportingKpis: splitLines(values.supportingKpis),
          successTarget: values.successTarget,
          executionScope: values.executionScope,
          reviewCheckpoints: splitLines(values.reviewCheckpoints),
          exitRule: values.exitRule,
        },
      });
      onRecorded(recorded);
    } catch (error) {
      setServiceError(
        error instanceof Error ? error.message : "Unable to record decision.",
      );
    }
  });

  return (
    <section className="final-decision-panel" id="final-decision">
      <div className="meeting-section-title">
        <span>8</span>
        <h2>Final Decision and Action Plan</h2>
      </div>
      <form className="final-decision-form" onSubmit={submit}>
        <div className="form-grid">
          <Field label="Final Decision">
            <select aria-label="Final Decision" {...form.register("outcome")}>
              <option>Approve</option>
              <option>Approve Exception</option>
              <option>Revise</option>
              <option>Escalate</option>
              <option>Reject</option>
              <option>Defer</option>
            </select>
          </Field>
          <Field label="Decision Maker">
            <input {...form.register("decisionMaker")} />
          </Field>
          <Field label="Decision Date">
            <input type="date" {...form.register("decisionDate")} />
          </Field>
          <WideField label="Decision rationale">
            <textarea
              aria-label="Decision rationale"
              {...form.register("rationale")}
            />
            {form.formState.errors.rationale && (
              <small className="form-field-error">
                {form.formState.errors.rationale.message}
              </small>
            )}
          </WideField>
          {selectedOutcome === "Approve Exception" && (
            <div className="form-field form-field--wide">
              <span>Accepted Exceptions</span>
              <div className="checkbox-grid">
                {failedConstraints.map((evaluation) => (
                  <label key={evaluation.constraintId}>
                    <input
                      type="checkbox"
                      value={evaluation.constraintId}
                      {...form.register("acceptedExceptionIds")}
                    />
                    {evaluation.constraintId}
                  </label>
                ))}
              </div>
            </div>
          )}
          <Field label="Decision Owner">
            <input {...form.register("owner")} />
          </Field>
          <Field label="Co-owner">
            <input {...form.register("coOwner")} />
          </Field>
          <Field label="Approver">
            <input {...form.register("approver")} />
          </Field>
          <Field label="Primary North Star">
            <input {...form.register("primaryNorthStar")} />
          </Field>
          <WideField label="Supporting KPIs">
            <textarea {...form.register("supportingKpis")} />
          </WideField>
          <WideField label="Success Target">
            <input {...form.register("successTarget")} />
          </WideField>
          <Field label="Execution Scope">
            <input {...form.register("executionScope")} />
          </Field>
          <Field label="Review Checkpoints">
            <textarea {...form.register("reviewCheckpoints")} />
          </Field>
          <WideField label="Exit Rule">
            <textarea {...form.register("exitRule")} />
          </WideField>
        </div>
        {serviceError && <p className="form-error">{serviceError}</p>}
        <div className="final-decision-actions">
          <p>
            This records a human decision and immutable meeting snapshot. It
            does not execute the business action.
          </p>
          <button className="button button--primary" type="submit">
            <Save aria-hidden="true" size={16} />
            Record Human Decision
          </button>
        </div>
      </form>
    </section>
  );
}

export function DecisionRecordSummary({
  project,
}: {
  project: DecisionProject;
}) {
  const record = project.decisionRecord;
  if (!record) return null;

  return (
    <div className="decision-record-stack">
      <section className="recorded-decision-banner" role="status">
        <CheckCircle2 aria-hidden="true" size={20} />
        <div>
          <strong>Decision recorded</strong>
          <span>
            {record.outcome} · {record.decisionMaker} · {record.decisionDate}
          </span>
        </div>
      </section>

      <section className="meeting-section">
        <div className="meeting-section-title">
          <span>8</span>
          <h2>Final Decision and Action Plan</h2>
        </div>
        <div className="meeting-section-body">
          <div className="narrative-grid">
            <Summary label="Outcome" value={record.outcome} />
            <Summary label="Decision Maker" value={record.decisionMaker} />
            <Summary label="Decision Rationale" value={record.rationale} />
            <Summary
              label="Primary North Star"
              value={record.commitments.primaryNorthStar}
            />
            <Summary
              label="Success Target"
              value={record.commitments.successTarget}
            />
            <Summary label="Exit Rule" value={record.commitments.exitRule} />
          </div>
          <div className="table-shell mt-5">
            <table className="operating-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {project.actionPlan.map((task) => (
                  <tr key={task.id}>
                    <td>{task.action}</td>
                    <td>{task.owner}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="meeting-section">
        <div className="meeting-section-title">
          <span>9</span>
          <h2>Decision Record and Review Timeline</h2>
        </div>
        <div className="meeting-section-body">
          <ol className="decision-timeline">
            {project.timeline.map((event) => (
              <li key={event.id}>
                <time>{event.date}</time>
                <div>
                  <strong>{event.eventType}</strong>
                  <p>{event.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <details className="meeting-disclosure">
            <summary>View immutable audit snapshot</summary>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              Decision Card {record.snapshot.decisionCardVersion} ·{" "}
              {record.snapshot.articleIds.length} Articles ·{" "}
              {record.snapshot.constraintVersions.length} Constraint versions ·{" "}
              {record.snapshot.evidence.length} evidence items · recorded{" "}
              {record.snapshot.recordedAt}
            </p>
          </details>
        </div>
      </section>
    </div>
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

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="narrative-item">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
