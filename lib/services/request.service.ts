import { createClient } from "@/lib/supabase/server";
import { ProductRequest } from "@/types/request.types";
import { ApiError } from "@/lib/errors/api-error";
import { handleSupabaseError, isSupabaseError } from "@/lib/errors/supabase-error";

/**
 * RequestService handles all request-related database operations
 * 
 * Responsibilities:
 * - CRUD operations for requests
 * - Data validation and transformation
 * - Error handling with appropriate error types
 * - Ownership verification
 */
export class RequestService {
  /**
   * Create a new product request
   * 
   * @param userId - Owner of the request
   * @param title - Request title
   * @param description - Detailed description
   * @param category - Request category
   * @returns Created request object
   * @throws ApiError if creation fails
   */
  static async createRequest(
    userId: string,
    title: string,
    description: string,
    category: string
  ): Promise<ProductRequest> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("requests")
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
          category,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Create request")
          : new ApiError("Failed to create request", 500, "DATABASE_ERROR");
      }

      if (!data) {
        throw new ApiError("No data returned after creating request", 500, "INTERNAL_ERROR");
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in createRequest:", error);
      throw new ApiError("Failed to create request", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Get all requests for a user
   * 
   * @param userId - User ID to fetch requests for
   * @returns Array of requests (empty array if none found)
   * @throws ApiError if fetch fails
   */
  static async getRequests(userId: string): Promise<ProductRequest[]> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Fetch requests")
          : new ApiError("Failed to fetch requests", 500, "DATABASE_ERROR");
      }

      return data || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in getRequests:", error);
      throw new ApiError("Failed to fetch requests", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Get a single request by ID
   * 
   * @param userId - User ID for ownership verification
   * @param requestId - Request ID to fetch
   * @returns Request object or null if not found
   * @throws ApiError if fetch fails (but returns null if not found)
   */
  static async getRequest(
    userId: string,
    requestId: string
  ): Promise<ProductRequest | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Fetch request")
          : new ApiError("Failed to fetch request", 500, "DATABASE_ERROR");
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in getRequest:", error);
      throw new ApiError("Failed to fetch request", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Update a request
   * 
   * @param userId - User ID for ownership verification
   * @param requestId - Request ID to update
   * @param updates - Fields to update
   * @returns Updated request object
   * @throws ApiError if update fails or request not found
   */
  static async updateRequest(
    userId: string,
    requestId: string,
    updates: Partial<Pick<ProductRequest, "title" | "description" | "category" | "status">>
  ): Promise<ProductRequest> {
    try {
      const supabase = await createClient();

      // Trim string fields
      const sanitizedUpdates: typeof updates = {};
      if (updates.title) sanitizedUpdates.title = updates.title.trim();
      if (updates.description) sanitizedUpdates.description = updates.description.trim();
      if (updates.category) sanitizedUpdates.category = updates.category;
      if (updates.status) sanitizedUpdates.status = updates.status;

      const { data, error } = await supabase
        .from("requests")
        .update(sanitizedUpdates)
        .eq("id", requestId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Update request")
          : new ApiError("Failed to update request", 500, "DATABASE_ERROR");
      }

      if (!data) {
        throw new ApiError("Request not found or access denied", 404, "NOT_FOUND");
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in updateRequest:", error);
      throw new ApiError("Failed to update request", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Delete a request
   * 
   * @param userId - User ID for ownership verification
   * @param requestId - Request ID to delete
   * @throws ApiError if deletion fails
   */
  static async deleteRequest(userId: string, requestId: string): Promise<void> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("requests")
        .delete()
        .eq("id", requestId)
        .eq("user_id", userId);

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Delete request")
          : new ApiError("Failed to delete request", 500, "DATABASE_ERROR");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in deleteRequest:", error);
      throw new ApiError("Failed to delete request", 500, "INTERNAL_ERROR");
    }
  }
}
