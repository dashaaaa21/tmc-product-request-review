import { z } from "zod";

export const analysisRequestSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  requestText: z
    .string()
    .trim()
    .min(20, "Request text must be at least 20 characters")
    .max(5000, "Request text must not exceed 5000 characters"),
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
