import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AIService } from "@/lib/services/ai.service";
import { RequestService } from "@/lib/services/request.service";
import { analysisRequestSchema } from "@/lib/validations/analysis.schema";
import { AnalysisResponse } from "@/types/analysis.types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<AnalysisResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = analysisRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<AnalysisResponse>(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { requestId, requestText } = validation.data;

    // Verify that the request belongs to the current user
    const productRequest = await RequestService.getRequest(user.id, requestId);
    if (!productRequest) {
      return NextResponse.json<AnalysisResponse>(
        { error: "Request not found or access denied" },
        { status: 404 }
      );
    }

    // Analyze the request
    const analysis = await AIService.analyzeRequest(requestText);

    // Save analysis to database - store the analysis as JSON in analysis_text
    const { error: dbError } = await supabase
      .from("analyses")
      .insert({
        request_id: requestId,
        analysis_text: JSON.stringify(analysis),
        key_points: analysis,
      });

    if (dbError) {
      console.error("Error saving analysis:", dbError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json<AnalysisResponse>(
      { data: analysis },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing request:", error);
    return NextResponse.json<AnalysisResponse>(
      { error: "Unable to analyze request" },
      { status: 500 }
    );
  }
}
