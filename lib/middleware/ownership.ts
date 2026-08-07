import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/errors/api-error";

/**
 * Verify that the authenticated user owns the specified request
 * Prevents users from accessing other users' data
 * 
 * @param userId - Authenticated user ID
 * @param requestId - Request ID to check
 * @throws ApiError if request not found or access denied
 */
export async function verifyRequestOwnership(
  userId: string,
  requestId: string
): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("id")
    .eq("id", requestId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Ownership verification error:", error);
    throw new ApiError(
      "Failed to verify request ownership",
      500,
      "INTERNAL_ERROR"
    );
  }

  if (!data) {
    throw new ApiError(
      "Request not found or access denied",
      404,
      "NOT_FOUND"
    );
  }
}

/**
 * Verify that the authenticated user owns the analysis through its request
 * 
 * @param userId - Authenticated user ID
 * @param analysisId - Analysis ID to check
 * @throws ApiError if analysis not found or access denied
 */
export async function verifyAnalysisOwnership(
  userId: string,
  analysisId: string
): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("request_id, requests!inner(user_id)")
    .eq("id", analysisId)
    .maybeSingle();

  if (error) {
    console.error("Analysis ownership verification error:", error);
    throw new ApiError(
      "Failed to verify analysis ownership",
      500,
      "INTERNAL_ERROR"
    );
  }

  // Type assertion for nested query result
  const result = data as { request_id: string; requests: { user_id: string } } | null;

  if (!result || !result.requests || result.requests.user_id !== userId) {
    throw new ApiError(
      "Analysis not found or access denied",
      404,
      "NOT_FOUND"
    );
  }
}

/**
 * Verify that the authenticated user owns the brief through its request
 * 
 * @param userId - Authenticated user ID
 * @param briefId - Brief ID to check
 * @throws ApiError if brief not found or access denied
 */
export async function verifyBriefOwnership(
  userId: string,
  briefId: string
): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("briefs")
    .select("request_id, requests!inner(user_id)")
    .eq("id", briefId)
    .maybeSingle();

  if (error) {
    console.error("Brief ownership verification error:", error);
    throw new ApiError(
      "Failed to verify brief ownership",
      500,
      "INTERNAL_ERROR"
    );
  }

  // Type assertion for nested query result
  const result = data as { request_id: string; requests: { user_id: string } } | null;

  if (!result || !result.requests || result.requests.user_id !== userId) {
    throw new ApiError(
      "Brief not found or access denied",
      404,
      "NOT_FOUND"
    );
  }
}
