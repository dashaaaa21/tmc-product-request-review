"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReviewSection } from "@/components/requests/ReviewSection";
import { AnalysisResult } from "@/types/analysis.types";
import { ProductRequest } from "@/types/request.types";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<ProductRequest | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/requests/${requestId}/analysis`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch analysis");
        }

        setRequest(data.data.request);
        
        // If no analysis exists, trigger it automatically
        if (!data.data.analysis && data.data.request) {
          console.log("No analysis found, triggering automatic analysis...");
          await triggerAnalysis(data.data.request);
        } else {
          setAnalysis(data.data.analysis);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    async function triggerAnalysis(req: ProductRequest) {
      try {
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            requestId: req.id,
            requestText: req.description 
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          setAnalysis(analysisData.data);
        } else {
          setError("Could not generate analysis automatically. Please try again.");
        }
      } catch (err) {
        setError("Failed to generate analysis automatically.");
      }
    }

    fetchAnalysis();
  }, [requestId]);

  const handleGenerateBrief = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate brief");
      }

      // Success - go to brief page
      router.push(`/requests/${requestId}/brief`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-lime-400 mx-auto mb-4"></div>
              <p className="text-zinc-600 font-medium">Loading analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-red-200 rounded-3xl p-8 bg-red-50 shadow-sm text-center">
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button
              onClick={() => router.push("/requests")}
              className="px-8 py-3 bg-red-400 text-white rounded-full font-bold hover:bg-red-300 transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-zinc-200 rounded-3xl p-12 bg-zinc-50 shadow-sm text-center">
            <p className="text-zinc-600 mb-6 text-lg">Analysis not available yet.</p>
            <button
              onClick={() => router.push("/requests")}
              className="px-8 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => router.push("/history")}
            className="mb-6 px-6 py-2 bg-white text-black rounded-full font-bold text-sm border-2 border-zinc-200 hover:border-lime-400 transition-colors"
          >
            ← Back to History
          </button>
          <h1 className="text-5xl font-black italic text-black mb-3">
            Request Review
          </h1>
          <p className="text-zinc-600 text-lg mb-6">
            AI analysis of your merchandise request
          </p>
          {request && (
            <div className="border-2 border-zinc-200 rounded-3xl p-6 bg-white shadow-sm">
              <h2 className="text-xl font-black italic text-black mb-3">
                Original Request:
              </h2>
              <p className="text-zinc-700 leading-relaxed">
                {request.description}
              </p>
            </div>
          )}
        </div>

        <ReviewSection analysis={analysis} />

        <div className="flex justify-center">
          <button
            onClick={handleGenerateBrief}
            disabled={generating}
            className="px-10 py-4 bg-lime-400 text-black rounded-full font-bold text-lg border-2 border-lime-400 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating Brief..." : "Generate Product Brief →"}
          </button>
        </div>
      </div>
    </div>
  );
}
