import { z } from "zod";

export const createRequestSchema = z.object({
  requestText: z
    .string()
    .trim()
    .min(20, "Request must be at least 20 characters")
    .max(5000, "Request must not exceed 5000 characters"),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
