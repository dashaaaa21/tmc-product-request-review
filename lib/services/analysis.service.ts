import { createClient } from "@/lib/supabase/server";
import { AnalysisResult } from "@/types/analysis.types";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
} from "@/lib/prompts/analysis.prompt";
import { analysisResultSchema } from "@/lib/validations/analysis.schema";
import { ApiError } from "@/lib/errors/api-error";
import { handleSupabaseError, isSupabaseError } from "@/lib/errors/supabase-error";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AnalysisService handles AI analysis operations and database interactions
 * 
 * Responsibilities:
 * - Generate AI analysis using OpenAI
 * - Save and retrieve analysis from database
 * - Validate AI responses
 * - Handle errors appropriately
 */
export class AnalysisService {
  /**
   * Generate AI analysis for a request
   * 
   * @param requestText - Text to analyze
   * @returns Validated analysis result
   * @throws ApiError if AI generation or validation fails
   */
  static async analyzeRequest(requestText: string): Promise<AnalysisResult> {
    try {
      if (!requestText || requestText.trim().length === 0) {
        throw new ApiError("Request text cannot be empty", 400, "VALIDATION_ERROR");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: ANALYSIS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildAnalysisPrompt(requestText.trim()),
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
        console.log("Parsed AI response:", JSON.stringify(parsedContent, null, 2));
        const validatedResult = analysisResultSchema.parse(parsedContent);
        return validatedResult;
      } catch (parseError) {
        console.error("AI response parsing error:", parseError);
        console.error("Raw AI response:", content);
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
      console.error("Unexpected error in analyzeRequest:", error);
      throw new ApiError(
        "Failed to generate analysis. Please try again.",
        500,
        "AI_ERROR"
      );
    }
  }

  /**
   * Save analysis to database
   * 
   * @param requestId - Request ID to associate analysis with
   * @param analysis - Analysis data to save
   * @throws ApiError if save fails
   */
  static async saveAnalysis(
    requestId: string,
    analysis: AnalysisResult
  ): Promise<void> {
    try {
      const supabase = await createClient();

      const { error } = await supabase.from("analyses").insert({
        request_id: requestId,
        key_points: analysis,
      });

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Save analysis")
          : new ApiError("Failed to save analysis", 500, "DATABASE_ERROR");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in saveAnalysis:", error);
      throw new ApiError("Failed to save analysis", 500, "INTERNAL_ERROR");
    }
  }

  /**
   * Get analysis for a request
   * 
   * @param requestId - Request ID to fetch analysis for
   * @param userId - User ID for ownership verification
   * @returns Analysis result or null if not found
   * @throws ApiError if fetch fails or access denied
   */
  static async getAnalysis(
    requestId: string,
    userId: string
  ): Promise<AnalysisResult | null> {
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

      // Get latest analysis
      const { data, error } = await supabase
        .from("analyses")
        .select("key_points")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw isSupabaseError(error)
          ? handleSupabaseError(error, "Fetch analysis")
          : new ApiError("Failed to fetch analysis", 500, "DATABASE_ERROR");
      }

      if (!data) {
        return null;
      }

      // Validate JSONB data with Zod (protection against corrupted data)
      try {
        return analysisResultSchema.parse(data.key_points);
      } catch (validationError) {
        console.error("Analysis data validation error:", validationError);
        throw new ApiError(
          "Invalid analysis data in database. Please regenerate the analysis.",
          500,
          "DATA_CORRUPTION"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Unexpected error in getAnalysis:", error);
      throw new ApiError("Failed to fetch analysis", 500, "INTERNAL_ERROR");
    }
  }
}
