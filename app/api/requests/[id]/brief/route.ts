import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BriefService } from "@/lib/services/brief.service";
import { handleApiError, validateAuth } from "@/lib/errors/error-handler";
import { verifyRequestOwnership } from "@/lib/middleware/ownership";

// Get brief for a specific request
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

    // Get request data
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

    // Get brief
    const brief = await BriefService.getBrief(id, user!.id);

    return NextResponse.json(
      {
        data: {
          request: productRequest,
          brief,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
