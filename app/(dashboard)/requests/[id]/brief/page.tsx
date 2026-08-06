"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BriefSection } from "@/components/requests/BriefSection";
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
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-lime-400 mx-auto mb-4"></div>
              <p className="text-zinc-600 font-medium">Loading brief...</p>
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
              onClick={() => router.push(`/requests/${requestId}/review`)}
              className="px-8 py-3 bg-red-400 text-white rounded-full font-bold hover:bg-red-300 transition-colors"
            >
              Back to Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-zinc-200 rounded-3xl p-12 bg-zinc-50 shadow-sm text-center">
            <p className="text-zinc-600 mb-6 text-lg">Brief not available yet.</p>
            <button
              onClick={() => router.push(`/requests/${requestId}/review`)}
              className="px-8 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors"
            >
              Back to Review
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
            Product Brief
          </h1>
          <p className="text-zinc-600 text-lg mb-6">
            Complete product brief generated from your request
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

        <BriefSection brief={brief} />
      </div>
    </div>
  );
}
