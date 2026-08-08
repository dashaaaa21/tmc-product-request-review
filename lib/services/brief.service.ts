import OpenAI from "openai";
import { BriefResult } from "@/types/brief.types";
import { AnalysisResult } from "@/types/analysis.types";
import { createClient } from "@/lib/supabase/server";
import {
  BRIEF_SYSTEM_PROMPT,
  buildBriefPrompt,
} from "@/lib/prompts/brief.prompt";
import { briefResultSchema } from "@/lib/validations/brief.schema";
import { ApiError } from "@/lib/errors/api-error";
import { handleSupabaseError, isSupabaseError } from "@/lib/errors/supabase-error";

// Lazy initialization to avoid build-time errors
let openaiInstance: OpenAI | null = null;
function getOpenAI() {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
    });
  }
  return openaiInstance;
}

/**
 * BriefService handles brief generation and database operations
 * 
 * Responsibilities:
 * - Generate AI briefs using OpenAI
 * - Save briefs to database
 * - Update request status after brief generation
 * - Retrieve briefs with proper validation
 */
export class BriefService {
  /**
   * Generate AI brief from request and analysis
   * 
   * @param requestText - Original request text
   * @param analysis - Analysis result to base brief on
   * @returns Validated brief result
   * @throws ApiError if generation or validation fails
   */
  static async generateBrief(
    requestText: string,
    analysis: AnalysisResult
  ): Promise<BriefResult> {
    try {
      if (!requestText || requestText.trim().length === 0) {
        throw new ApiError("Request text cannot be empty", 400, "VALIDATION_ERROR");
      }

      if (!analysis) {
        throw new ApiError("Analysis is required to generate brief", 400, "VALIDATION_ERROR");
      }

      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: BRIEF_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildBriefPrompt(requestText.trim(), analysis),
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new ApiError("No response from AI", 500, "AI_ERROR");
      }

      // Parse and validate OpenAI response with Zod
      try {
        const parsedContent = JSON.parse(content);
        const validatedResult = briefResultSchema.parse(parsedContent);
        return validatedResult;
      } catch {
        console.error("Brief validation failed");
        throw new ApiError(
          "Invalid AI response format. Please try again.",
          500,
          "AI_VALIDATION_ERROR"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in generateBrief:", error);
      throw new ApiError(
        "Failed to generate brief. Please try again.",
        500,
        "AI_ERROR"
      );
    }
  }

  /**
   * Save brief and update request status
   * Status workflow: pending → approved (after brief generation)
   * 
   * @param requestId - Request ID to associate brief with
   * @param brief - Brief data to save
   * @throws ApiError if save or status update fails
   */
  static async save(requestId: string, brief: BriefResult): Promise<void> {
    try {
      const supabase = await createClient();

      // Save brief
      const { error: briefError } = await supabase.from("briefs").insert({
        request_id: requestId,
        product_overview: brief.productOverview,
        confirmed_requirements: brief.confirmedRequirements,
        assumptions: brief.assumptions,
        open_questions: brief.openQuestions,
        procurement_summary: brief.procurementSummary,
      });

      if (briefError) {
        throw isSupabaseError(briefError)
          ? handleSupabaseError(briefError, "Save brief")
          : new ApiError("Failed to save brief", 500, "DATABASE_ERROR");
      }

      // Update request status to approved after brief generation
      const { error: statusError } = await supabase
        .from("requests")
        .update({ status: "approved" })
        .eq("id", requestId);

      if (statusError) {
        throw isSupabaseError(statusError)
          ? handleSupabaseError(statusError, "Update request status")
          : new ApiError("Failed to update request status", 500, "DATABASE_ERROR");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in save:", error);
      throw new ApiError("Failed to save brief", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Get brief for a request
   * 
   * @param requestId - Request ID to fetch brief for
   * @param userId - User ID for ownership verification
   * @returns Brief result or null if not found
   * @throws ApiError if fetch fails or access denied
   */
  static async getBrief(
    requestId: string,
    userId: string
  ): Promise<BriefResult | null> {
    try {
      const supabase = await createClient();

      // Verify request ownership
      const { data: request, error: requestError } = await supabase
        .from("requests")
        .select("id")
        .eq("id", requestId)
        .eq("user_id", userId)
        .maybeSingle();

      if (requestError) {
        throw isSupabaseError(requestError)
          ? handleSupabaseError(requestError, "Verify request ownership")
          : new ApiError("Failed to verify ownership", 500, "DATABASE_ERROR");
      }

      if (!request) {
        throw new ApiError("Request not found or access denied", 404, "NOT_FOUND");
      }

      // Get latest brief
      const { data, error } = await supabase
        .from("briefs")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Fetch brief")
          : new ApiError("Failed to fetch brief", 500, "DATABASE_ERROR");
      }

      if (!data) {
        return null;
      }

      // Normalize JSONB fields to arrays (protection against corrupted data)
      const confirmedRequirements = Array.isArray(data.confirmed_requirements)
        ? data.confirmed_requirements
        : [];
      const assumptions = Array.isArray(data.assumptions) ? data.assumptions : [];
      const openQuestions = Array.isArray(data.open_questions)
        ? data.open_questions
        : [];

      // Validate and return
      try {
        return briefResultSchema.parse({
          productOverview: data.product_overview || "",
          confirmedRequirements,
          assumptions,
          openQuestions,
          procurementSummary: data.procurement_summary || "",
        });
      } catch (validationError) {
        console.error("Brief data validation error:", validationError);
        throw new ApiError(
          "Invalid brief data in database. Please regenerate the brief.",
          500,
          "DATA_CORRUPTION"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in getBrief:", error);
      throw new ApiError("Failed to fetch brief", 500, "INTERNAL_ERROR");
    }
  }
}
