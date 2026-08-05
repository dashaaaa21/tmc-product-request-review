import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check user owns this request
    const { data: productRequest, error: requestError } = await supabase
      .from("requests")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
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
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Unable to fetch analysis" },
      { status: 500 }
    );
  }
}
