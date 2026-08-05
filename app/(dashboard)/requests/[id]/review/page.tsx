"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReviewSection } from "@/components/requests/ReviewSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/requests/${requestId}/analysis`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch analysis");
        }

        setRequest(data.data.request);
        setAnalysis(data.data.analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [requestId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analysis...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => router.push("/requests")}>
                Back to Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Analysis not available yet.
              </p>
              <Button onClick={() => router.push("/requests")}>
                Back to Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/history")}
          className="mb-4"
        >
          ← Back to History
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Request Review
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI analysis of your merchandise request
        </p>
        {request && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
              Original Request:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {request.description}
            </p>
          </div>
        )}
      </div>

      <ReviewSection analysis={analysis} />
    </div>
  );
}
