"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BriefSection } from "@/components/requests/BriefSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BriefResult } from "@/types/brief.types";
import { ProductRequest } from "@/types/request.types";

export default function BriefPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<ProductRequest | null>(null);
  const [brief, setBrief] = useState<BriefResult | null>(null);

  useEffect(() => {
    async function fetchBrief() {
      try {
        // Fetch brief from database
        const response = await fetch(`/api/requests/${requestId}/brief`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch brief");
        }

        setRequest(data.data.request);
        setBrief(data.data.brief);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBrief();
  }, [requestId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading brief...
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
              <Button onClick={() => router.push(`/requests/${requestId}/review`)}>
                Back to Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Brief not available yet.
              </p>
              <Button onClick={() => router.push(`/requests/${requestId}/review`)}>
                Back to Review
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
          Product Brief
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete product brief generated from your request
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

      <BriefSection brief={brief} />
    </div>
  );
}
