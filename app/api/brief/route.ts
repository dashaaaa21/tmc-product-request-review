import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BriefService } from "@/lib/services/brief.service";
import { AnalysisService } from "@/lib/services/analysis.service";
import { RequestService } from "@/lib/services/request.service";
import { BriefResponse } from "@/types/brief.types";
import { createBriefSchema } from "@/lib/validations/brief.schema";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<BriefResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = createBriefSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<BriefResponse>(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { requestId } = validation.data;

    // Get request
    const productRequest = await RequestService.getRequest(user.id, requestId);
    if (!productRequest) {
      return NextResponse.json<BriefResponse>(
        { error: "Request not found or access denied" },
        { status: 404 }
      );
    }

    // Get analysis
    const analysis = await AnalysisService.getAnalysis(requestId, user.id);
    if (!analysis) {
      return NextResponse.json<BriefResponse>(
        { error: "Analysis not found. Please analyze the request first." },
        { status: 404 }
      );
    }

    // Generate brief using AI
    const brief = await BriefService.generateBrief(
      productRequest.description,
      analysis
    );

    // Save brief and update status
    await BriefService.save(requestId, brief);

    return NextResponse.json<BriefResponse>({ data: brief }, { status: 200 });
  } catch (error) {
    console.error("Generate brief error:", error);
    return NextResponse.json<BriefResponse>(
      { error: "Unable to generate brief" },
      { status: 500 }
    );
  }
}
