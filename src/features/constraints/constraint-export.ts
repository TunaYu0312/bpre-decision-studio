import type { Constraint } from "@/domain/constraint";

export function constraintsToJson(records: Constraint[]): string {
  return JSON.stringify(
    {
      exportType: "bpre-constraints",
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      records,
    },
    null,
    2,
  );
}

const csvColumns: Array<{
  heading: string;
  value: (record: Constraint) => string | number | boolean | null;
}> = [
  { heading: "Constraint ID", value: (record) => record.constraintId },
  { heading: "Version", value: (record) => record.version },
  { heading: "Status", value: (record) => record.status },
  {
    heading: "Constitution Version ID",
    value: (record) => record.constitutionVersionId,
  },
  {
    heading: "Constitution Article ID",
    value: (record) => record.constitutionRuleId,
  },
  {
    heading: "Constraint Blueprint ID",
    value: (record) => record.constraintBlueprintId,
  },
  {
    heading: "Derivation Rationale",
    value: (record) => record.derivationRationale,
  },
  { heading: "Pillar", value: (record) => record.pillar },
  { heading: "Type", value: (record) => record.constraintType },
  { heading: "Name", value: (record) => record.name },
  { heading: "Scope", value: (record) => record.scope },
  {
    heading: "Decision Types",
    value: (record) => record.applicableDecisionTypes.join(" | "),
  },
  { heading: "Metric Key", value: (record) => record.metricKey },
  { heading: "Data Type", value: (record) => record.dataType },
  { heading: "Operator", value: (record) => record.operator },
  {
    heading: "Threshold",
    value: (record) =>
      Array.isArray(record.thresholdValue)
        ? record.thresholdValue.join(" | ")
        : record.thresholdValue,
  },
  { heading: "Unit", value: (record) => record.unit },
  { heading: "Severity", value: (record) => record.severity },
  { heading: "Outcome", value: (record) => record.outcomeIfFailed },
  { heading: "Escalation Role", value: (record) => record.escalationRole },
  { heading: "Exception Policy", value: (record) => record.exceptionPolicy },
  { heading: "Effective Date", value: (record) => record.effectiveDate },
];

function escapeCsv(value: string | number | boolean | null): string {
  const text = value === null ? "" : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function constraintsToCsv(records: Constraint[]): string {
  const rows = [
    csvColumns.map((column) => escapeCsv(column.heading)).join(","),
    ...records.map((record) =>
      csvColumns.map((column) => escapeCsv(column.value(record))).join(","),
    ),
  ];
  return rows.join("\r\n");
}

export function downloadTextFile(
  content: string,
  filename: string,
  type: string,
): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
