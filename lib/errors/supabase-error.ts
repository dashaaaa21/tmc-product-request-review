import { PostgrestError } from "@supabase/supabase-js";
import { ApiError } from "./api-error";

/**
 * Common Supabase/Postgres error codes
 */
export const SUPABASE_ERROR_CODES = {
  // Postgres error codes
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",
  CHECK_VIOLATION: "23514",
  
  // Supabase/PostgREST error codes
  NOT_FOUND: "PGRST116",
  INVALID_REQUEST: "PGRST102",
  MULTIPLE_ROWS: "PGRST116",
} as const;

/**
 * Convert Supabase/Postgres error to ApiError with appropriate status code and message
 */
export function handleSupabaseError(
  error: PostgrestError,
  context: string = "Database operation"
): ApiError {
  // Not found error
  if (error.code === SUPABASE_ERROR_CODES.NOT_FOUND) {
    return new ApiError(
      `${context} failed: Resource not found`,
      404,
      "NOT_FOUND"
    );
  }

  // Unique constraint violation (duplicate)
  if (error.code === SUPABASE_ERROR_CODES.UNIQUE_VIOLATION) {
    return new ApiError(
      `${context} failed: Resource already exists`,
      409,
      "DUPLICATE_RESOURCE"
    );
  }

  // Foreign key violation (invalid reference)
  if (error.code === SUPABASE_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
    return new ApiError(
      `${context} failed: Invalid reference`,
      400,
      "INVALID_REFERENCE"
    );
  }

  // Not null violation
  if (error.code === SUPABASE_ERROR_CODES.NOT_NULL_VIOLATION) {
    return new ApiError(
      `${context} failed: Required field is missing`,
      400,
      "VALIDATION_ERROR"
    );
  }

  // Check constraint violation
  if (error.code === SUPABASE_ERROR_CODES.CHECK_VIOLATION) {
    return new ApiError(
      `${context} failed: Data validation error`,
      400,
      "VALIDATION_ERROR"
    );
  }

  // Generic database error
  console.error(`Supabase error in ${context}:`, error);
  return new ApiError(
    `${context} failed: ${error.message}`,
    500,
    "DATABASE_ERROR"
  );
}

/**
 * Type guard to check if error is a Supabase error
 */
export function isSupabaseError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "details" in error
  );
}
