import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RequestService } from "@/lib/services/request.service";
import { ApiResponse, ProductRequest } from "@/types/request.types";
import { createRequestSchema } from "@/lib/validations/request.schema";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, category, priority } = validation.data;
    const productRequest = await RequestService.createRequest(
      user.id,
      title,
      description,
      category,
      priority
    );

    return NextResponse.json<ApiResponse<ProductRequest>>(
      { data: productRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Unable to create request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requests = await RequestService.getRequests(user.id);

    return NextResponse.json<ApiResponse<ProductRequest[]>>(
      { data: requests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Unable to fetch requests" },
      { status: 500 }
    );
  }
}
