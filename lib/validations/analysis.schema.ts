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
    .array(
      z.string()
        .trim()
        .min(5, "Each fact must be at least 5 characters")
        .max(500, "Each fact must not exceed 500 characters")
    )
    .min(0, "Facts must be an array")
    .max(50, "Too many facts - maximum 50 allowed")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Facts must not contain duplicates"
    ),
  
  missing: z
    .array(
      z.string()
        .trim()
        .min(5, "Each missing item must be at least 5 characters")
        .max(500, "Each missing item must not exceed 500 characters")
    )
    .min(0, "Missing info must be an array")
    .max(50, "Too many missing items - maximum 50 allowed")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Missing information must not contain duplicates"
    ),
  
  contradictions: z
    .array(
      z.string()
        .trim()
        .min(5, "Each contradiction must be at least 5 characters")
        .max(500, "Each contradiction must not exceed 500 characters")
    )
    .min(0, "Contradictions must be an array")
    .max(50, "Too many contradictions - maximum 50 allowed")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Contradictions must not contain duplicates"
    ),
  
  followUpQuestions: z
    .array(
      z.string()
        .trim()
        .min(10, "Each question must be at least 10 characters")
        .max(500, "Each question must not exceed 500 characters")
        .refine(
          (q) => q.endsWith("?"),
          "Each follow-up question must end with a question mark"
        )
    )
    .min(0, "Follow-up questions must be an array")
    .max(50, "Too many questions - maximum 50 allowed")
    .refine(
      (arr) => new Set(arr).size === arr.length,
      "Follow-up questions must not contain duplicates"
    ),
});

export type AnalysisRequestInput = z.infer<typeof analysisRequestSchema>;
export type AnalysisResultValidated = z.infer<typeof analysisResultSchema>;
