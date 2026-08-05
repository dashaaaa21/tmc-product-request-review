import OpenAI from "openai";
import { BriefResult } from "@/types/brief.types";
import { AnalysisResult } from "@/types/analysis.types";
import { createClient } from "@/lib/supabase/server";
import {
  BRIEF_SYSTEM_PROMPT,
  buildBriefPrompt,
} from "@/lib/prompts/brief.prompt";
import { briefResultSchema } from "@/lib/validations/brief.schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class BriefService {
  // Generate AI brief from request and analysis
  static async generateBrief(
    requestText: string,
    analysis: AnalysisResult
  ): Promise<BriefResult> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: BRIEF_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildBriefPrompt(requestText, analysis),
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Validate OpenAI response with Zod
    const parsed = briefResultSchema.parse(JSON.parse(content));
    return parsed;
  }

  // Save brief and update request status in one operation
  static async save(requestId: string, brief: BriefResult): Promise<void> {
    const supabase = await createClient();

    // Save brief
    const { error: briefError } = await supabase.from("briefs").insert({
      request_id: requestId,
      facts: brief.facts,
      assumptions: brief.assumptions,
      unknowns: brief.unknowns,
      final_brief: brief.finalBrief,
    });

    if (briefError) {
      console.error("Brief save error details:", briefError);
      throw new Error(`Failed to save brief: ${briefError.message}`);
    }

    // Update request status
    const { error: statusError } = await supabase
      .from("requests")
      .update({ status: "approved" })
      .eq("id", requestId);

    if (statusError) {
      throw new Error("Failed to update request status");
    }
  }

  // Get brief for a request
  static async getBrief(
    requestId: string,
    userId: string
  ): Promise<BriefResult | null> {
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

    // Get latest brief
    const { data, error } = await supabase
      .from("briefs")
      .select("*")
      .eq("request_id", requestId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error("Failed to fetch brief");
    }

    return data
      ? {
          facts: data.facts || [],
          assumptions: data.assumptions || [],
          unknowns: data.unknowns || [],
          finalBrief: data.final_brief || "",
        }
      : null;
  }
}
