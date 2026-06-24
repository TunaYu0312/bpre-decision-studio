import { z } from "zod";

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

export const isoTimestampSchema = z.string().datetime({ offset: true });

export const nonEmptyStringSchema = z.string().trim().min(1, "Required");

export const versionSchema = z
  .string()
  .regex(/^\d+\.\d+$/, "Use major.minor version format");

export function nextMinorVersion(version: string): string {
  const [major, minor] = version.split(".").map(Number);
  return `${major}.${minor + 1}`;
}

export function createStableId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
