import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RequestService } from "@/lib/services/request.service";
import { ApiResponse, ProductRequest } from "@/types/request.types";
import { createRequestSchema } from "@/lib/validations/request.schema";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    const body = await request.json();
    const validation = createRequestSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const { title, description, category } = validation.data;
    const productRequest = await RequestService.createRequest(
      user!.id,
      title,
      description,
      category
    );

    return NextResponse.json<ApiResponse<ProductRequest>>(
      { data: productRequest },
      { status: 201 }
    );
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

    console.log("GET /api/requests: Fetching requests for user:", user!.id);
    const requests = await RequestService.getRequests(user!.id);
    console.log("GET /api/requests: Found", requests.length, "requests");

    return NextResponse.json<ApiResponse<ProductRequest[]>>(
      { data: requests },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
