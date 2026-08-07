import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AnalysisService } from "@/lib/services/analysis.service";
import { RequestService } from "@/lib/services/request.service";
import { analysisRequestSchema } from "@/lib/validations/analysis.schema";
import { AnalysisResponse } from "@/types/analysis.types";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { ApiErrors } from "@/lib/errors/api-error";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    const body = await request.json();
    const validation = analysisRequestSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const { requestId, requestText } = validation.data;

    // Verify request ownership
    const productRequest = await RequestService.getRequest(user!.id, requestId);
    if (!productRequest) {
      throw ApiErrors.NOT_FOUND('Request');
    }

    // Use description from database instead of client input for security
    const textToAnalyze = productRequest.description || requestText;

    // Analyze the request
    const analysis = await AnalysisService.analyzeRequest(textToAnalyze);

    // Save analysis
    await AnalysisService.saveAnalysis(requestId, analysis);

    return NextResponse.json<AnalysisResponse>(
      { data: analysis },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
