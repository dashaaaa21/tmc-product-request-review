import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { verifyRequestOwnership } from "@/lib/middleware/ownership";

// Get analysis for a specific request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    validateAuth(user);

    const { id } = await params;

    // Verify ownership before fetching data
    await verifyRequestOwnership(user!.id, id);

    // Fetch request data
    const { data: productRequest, error: requestError } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id) // Double-check ownership
      .single();

    if (requestError || !productRequest) {
      return NextResponse.json(
        { error: "Request not found or access denied" },
        { status: 404 }
      );
    }

    // Get latest analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (analysisError) {
      return NextResponse.json(
        { error: "Failed to fetch analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: {
          request: productRequest,
          analysis: analysis ? analysis.key_points : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
