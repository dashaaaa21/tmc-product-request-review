import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RequestService } from "@/lib/services/request.service";
import { ApiResponse, ProductRequest } from "@/types/request.types";
import { createRequestSchema } from "@/lib/validations/request.schema";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { checkRateLimit, RATE_LIMITS } from "@/lib/middleware/rate-limit";
import { ApiError } from "@/lib/errors/api-error";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    // Rate limiting
    const rateLimitResult = checkRateLimit(
      `create-request:${user!.id}`,
      RATE_LIMITS.API_STANDARD
    );

    if (!rateLimitResult.allowed) {
      throw new ApiError(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    const body = await request.json();
    const validation = createRequestSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const { title, description, category } = validation.data;
    
    // Create request with validated data only
    const productRequest = await RequestService.createRequest(
      user!.id,
      title,
      description,
      category
    );

    const response = NextResponse.json<ApiResponse<ProductRequest>>(
      { data: productRequest },
      { status: 201 }
    );
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", RATE_LIMITS.API_STANDARD.maxRequests.toString());
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    // Rate limiting
    const rateLimitResult = checkRateLimit(
      `get-requests:${user!.id}`,
      RATE_LIMITS.API_STANDARD
    );

    if (!rateLimitResult.allowed) {
      throw new ApiError(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }

    // Only fetch user's own requests (enforced by RLS + application logic)
    const requests = await RequestService.getRequests(user!.id);

    const response = NextResponse.json<ApiResponse<ProductRequest[]>>(
      { data: requests },
      { status: 200 }
    );
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", RATE_LIMITS.API_STANDARD.maxRequests.toString());
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
