import { z } from "zod";

export const createBriefSchema = z.object({
  requestId: z.string().uuid("Invalid request ID format"),
});

export const briefResultSchema = z.object({
  productOverview: z.string().min(10, "Product overview is required"),
  confirmedRequirements: z.array(z.string()),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  procurementSummary: z.string().min(20, "Procurement summary is required"),
});

export type CreateBriefInput = z.infer<typeof createBriefSchema>;
export type BriefResultValidated = z.infer<typeof briefResultSchema>;
