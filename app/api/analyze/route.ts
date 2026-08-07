import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AnalysisService } from "@/lib/services/analysis.service";
import { analysisRequestSchema } from "@/lib/validations/analysis.schema";
import { AnalysisResponse } from "@/types/analysis.types";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { ApiError } from "@/lib/errors/api-error";
import { checkRateLimit, RATE_LIMITS } from "@/lib/middleware/rate-limit";
import { verifyRequestOwnership } from "@/lib/middleware/ownership";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    // Rate limiting for AI generation
    const rateLimitResult = checkRateLimit(
      `analyze:${user!.id}`,
      RATE_LIMITS.AI_GENERATION
    );

    if (!rateLimitResult.allowed) {
      throw new ApiError(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const body = await request.json();
    const validation = analysisRequestSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const { requestId } = validation.data;

    // Verify request ownership (prevents access to other users' data)
    await verifyRequestOwnership(user!.id, requestId);

    // Get request data from database (never trust client input)
    const { data: productRequest } = await supabase
      .from("requests")
      .select("description")
      .eq("id", requestId)
      .eq("user_id", user!.id)
      .single();

    if (!productRequest) {
      throw new ApiError("Request not found", 404, "NOT_FOUND");
    }

    // Analyze the request using data from database
    const analysis = await AnalysisService.analyzeRequest(
      productRequest.description
    );

    // Save analysis
    await AnalysisService.saveAnalysis(requestId, analysis);

    // Add rate limit headers
    const response = NextResponse.json<AnalysisResponse>(
      { data: analysis },
      { status: 200 }
    );
    
    response.headers.set("X-RateLimit-Limit", RATE_LIMITS.AI_GENERATION.maxRequests.toString());
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
