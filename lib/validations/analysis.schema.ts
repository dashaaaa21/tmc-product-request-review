import { z } from "zod";

export const analysisRequestSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  requestText: z
    .string()
    .trim()
    .min(20, "Request text must be at least 20 characters")
    .max(5000, "Request text must not exceed 5000 characters"),
});

export const analysisResultSchema = z.object({
  facts: z.array(z.string()),
  missing: z.array(z.string()),
  contradictions: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
export type AnalysisResultValidated = z.infer<typeof analysisResultSchema>;
