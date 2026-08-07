import { z } from "zod";

// Validation for incoming analysis request
export const analysisRequestSchema = z.object({
  requestId: z
    .string({
      message: "Request ID is required",
    })
    .uuid({ message: "Invalid request ID format" }),
  
  requestText: z
    .string({
      message: "Request text is required",
    })
    .trim()
    .min(20, "Request text must be at least 20 characters")
    .max(5000, "Request text must not exceed 5000 characters")
    .refine((val) => val.length > 0, "Request text cannot be empty"),
});

// Validation for AI-generated analysis result
export const analysisResultSchema = z.object({
  facts: z
    .array(z.string().trim().min(1))
    .min(0, "Facts must be an array")
    .max(50, "Too many facts"),
  
  missing: z
    .array(z.string().trim().min(1))
    .min(0, "Missing info must be an array")
    .max(50, "Too many missing items"),
  
  contradictions: z
    .array(z.string().trim().min(1))
    .min(0, "Contradictions must be an array")
    .max(50, "Too many contradictions"),
  
  followUpQuestions: z
    .array(z.string().trim().min(1))
    .min(0, "Follow-up questions must be an array")
    .max(50, "Too many questions"),
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
export type AnalysisResultValidated = z.infer<typeof analysisResultSchema>;
