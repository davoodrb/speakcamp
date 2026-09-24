import z from "zod";
import { ReportReason } from "#/generated/prisma/enums";

export const REPORT_DETAILS_MAX = 500;

export const reportReasonSchema = z.enum(ReportReason);

export const reportDetailsSchema = z
  .string()
  .trim()
  .min(1, "Please describe what happened")
  .max(REPORT_DETAILS_MAX, "Details must be 500 characters or less");

export const createReportFormSchema = z.object({
  reportedUserId: z.string().min(1, "Reported user is required"),
  reason: reportReasonSchema,
  details: reportDetailsSchema,
});

export type CreateReportForm = z.infer<typeof createReportFormSchema>;
