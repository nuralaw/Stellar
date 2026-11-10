// Shared by the report dialog (client) and /api/report (server).
export const REPORT_REASONS = {
  answer: "The answer key is wrong",
  explanation: "The explanation is wrong or unclear",
  typo: "Typo or missing text",
  display: "Formula, table or figure looks broken",
  other: "Something else",
} as const;
export type ReportReason = keyof typeof REPORT_REASONS;
