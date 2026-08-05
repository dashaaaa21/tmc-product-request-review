import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BriefService } from "@/lib/services/brief.service";
import { RequestService } from "@/lib/services/request.service";

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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get request
    const productRequest = await RequestService.getRequest(user.id, id);
    if (!productRequest) {
      return NextResponse.json(
        { error: "Request not found or access denied" },
        { status: 404 }
      );
    }

    // Get brief
    const brief = await BriefService.getBrief(id, user.id);

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
    console.error("Fetch brief error:", error);
    return NextResponse.json(
      { error: "Unable to fetch brief" },
      { status: 500 }
    );
  }
}
