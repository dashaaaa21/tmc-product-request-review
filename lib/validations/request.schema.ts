import { z } from "zod";

// Allowed categories - only these are valid
const ALLOWED_CATEGORIES = [
  "merchandise",
  "apparel",
  "accessories",
  "promotional",
  "other",
] as const;

// Strict validation for creating a request
export const createRequestSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .refine((val) => val.length > 0, "Title cannot be empty"),
  
  description: z
    .string({
      message: "Description is required",
    })
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .refine((val) => val.length > 0, "Description cannot be empty"),
  
  category: z
    .enum(ALLOWED_CATEGORIES, {
      message: "Category is required. Must be one of: merchandise, apparel, accessories, promotional, or other",
    }),
});

// Schema for updating a request (all fields optional)
export const updateRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .optional(),
  
  category: z
    .enum(ALLOWED_CATEGORIES)
    .optional(),
  
  status: z
    .enum(["pending", "approved", "rejected", "implemented"])
    .optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type RequestCategory = (typeof ALLOWED_CATEGORIES)[number];
