import { z } from "zod";

export const createBriefSchema = z.object({
  requestId: z.string().uuid("Invalid request ID format"),
});

export const briefResultSchema = z.object({
  facts: z.array(z.string()),
  assumptions: z.array(z.string()),
  unknowns: z.array(z.string()),
  finalBrief: z.string().min(1, "Final brief cannot be empty"),
});

export type CreateBriefInput = z.infer<typeof createBriefSchema>;
export type BriefResultValidated = z.infer<typeof briefResultSchema>;
