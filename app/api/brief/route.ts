import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BriefService } from "@/lib/services/brief.service";
import { AnalysisService } from "@/lib/services/analysis.service";
import { BriefResponse } from "@/types/brief.types";
import { createBriefSchema } from "@/lib/validations/brief.schema";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { checkRateLimit, RATE_LIMITS } from "@/lib/middleware/rate-limit";
import { verifyRequestOwnership } from "@/lib/middleware/ownership";
import { ApiError } from "@/lib/errors/api-error";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    // Rate limiting for AI generation
    const rateLimitResult = checkRateLimit(
      `brief:${user!.id}`,
      RATE_LIMITS.AI_GENERATION
    );

    if (!rateLimitResult.allowed) {
      throw new ApiError(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = createBriefSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const { requestId } = validation.data;

    // Verify request ownership (prevents access to other users' data)
    await verifyRequestOwnership(user!.id, requestId);

    // Get request data from database
    const { data: productRequest } = await supabase
      .from("requests")
      .select("description")
      .eq("id", requestId)
      .eq("user_id", user!.id)
      .single();

    if (!productRequest) {
      throw new ApiError("Request not found", 404, "NOT_FOUND");
    }

    // Get analysis
    const analysis = await AnalysisService.getAnalysis(requestId, user!.id);
    if (!analysis) {
      throw new ApiError(
        "Analysis not found. Please analyze the request first.",
        404,
        "NOT_FOUND"
      );
    }

    // Generate brief using AI (using database data only)
    const brief = await BriefService.generateBrief(
      productRequest.description,
      analysis
    );

    // Save brief and update status
    await BriefService.save(requestId, brief);

    // Add rate limit headers
    const response = NextResponse.json<BriefResponse>(
      { data: brief },
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
