import { createClient } from "@/lib/supabase/server";
import { AnalysisResult } from "@/types/analysis.types";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
} from "@/lib/prompts/analysis.prompt";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AnalysisService {
  // Generate AI analysis for a request
  static async analyzeRequest(requestText: string): Promise<AnalysisResult> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: ANALYSIS_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildAnalysisPrompt(requestText),
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content) as AnalysisResult;
    return result;
  }

  // Save analysis to database
  static async saveAnalysis(
    requestId: string,
    analysis: AnalysisResult
  ): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("analyses").insert({
      request_id: requestId,
      analysis_text: `AI Analysis completed at ${new Date().toISOString()}`,
      key_points: analysis,
    });

    if (error) {
      throw new Error("Failed to save analysis");
    }
  }

  // Get analysis for a request
  static async getAnalysis(
    requestId: string,
    userId: string
  ): Promise<AnalysisResult | null> {
    const supabase = await createClient();

    // Verify request ownership
    const { data: request } = await supabase
      .from("requests")
      .select("id")
      .eq("id", requestId)
      .eq("user_id", userId)
      .single();

    if (!request) {
      throw new Error("Request not found or access denied");
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
      throw new Error("Failed to fetch analysis");
    }

    return data ? (data.key_points as AnalysisResult) : null;
  }
}
