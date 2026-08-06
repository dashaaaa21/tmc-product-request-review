"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductRequest } from "@/types/request.types";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });

  useEffect(() => {
    fetchRecentRequests();
  }, []);

  async function fetchRecentRequests() {
    try {
      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      const allRequests = data.data || [];
      
      setStats({
        total: allRequests.length,
        pending: allRequests.filter((r: ProductRequest) => r.status === "pending").length,
        approved: allRequests.filter((r: ProductRequest) => r.status === "approved").length,
      });

      setRequests(allRequests.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-zinc-200 rounded-2xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-zinc-50 rounded-3xl border-2 border-zinc-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="border-2 border-red-300 rounded-3xl p-6 bg-red-50">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-black p-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black italic text-black">Dashboard</h1>
        <p className="text-zinc-600 mt-3 text-lg">Overview of your product requests</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-4xl font-black italic mb-6 text-black">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="border-2 border-zinc-200 rounded-3xl p-8 bg-zinc-50 hover:border-lime-400 transition-all cursor-pointer shadow-sm"
            onClick={() => router.push("/requests")}
          >
            <div className="w-12 h-12 rounded-full border-2 border-lime-400 mb-6 flex items-center justify-center text-3xl text-lime-500 font-bold pb-2">
              +
            </div>
            <h3 className="text-xl font-black italic mb-2 text-black">New Request</h3>
            <p className="text-zinc-600 mb-6">Create a new product request for analysis</p>
            <button className="w-full px-6 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors">
              CREATE →
            </button>
          </div>

          <div
            className="border-2 border-zinc-200 rounded-3xl p-8 bg-zinc-50 hover:border-lime-400 transition-all cursor-pointer shadow-sm"
            onClick={() => router.push("/history")}
          >
            <div className="w-12 h-12 rounded-full border-2 border-lime-400 mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-black italic mb-2 text-black">View History</h3>
            <p className="text-zinc-600 mb-6">Browse all your previous requests</p>
            <button className="w-full px-6 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors">
              VIEW →
            </button>
          </div>

          <div
            className="border-2 border-zinc-200 rounded-3xl p-8 bg-zinc-50 hover:border-lime-400 transition-all cursor-pointer shadow-sm"
            onClick={() => {
              if (requests.length > 0) {
                router.push(`/requests/${requests[0].id}/review`);
              }
            }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-lime-400 mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-black italic mb-2 text-black">Latest Review</h3>
            <p className="text-zinc-600 mb-6">View your most recent request analysis</p>
            <button className="w-full px-6 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors">
              REVIEW →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-4xl font-black italic mb-6 text-black">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-zinc-200 rounded-3xl p-8 bg-zinc-50 hover:border-lime-400 transition-colors shadow-sm">
            <h3 className="text-2xl font-black italic mb-2 text-black">Total Requests</h3>
            <p className="text-zinc-600 mb-6">All product requests submitted</p>
            <div className="text-5xl font-bold text-black">{stats.total}</div>
          </div>

          <div className="border-2 border-orange-200 rounded-3xl p-8 bg-orange-50 hover:border-orange-400 transition-colors shadow-sm">
            <h3 className="text-2xl font-black italic mb-2 text-black">Pending</h3>
            <p className="text-zinc-600 mb-6">Awaiting review and analysis</p>
            <div className="text-5xl font-bold text-orange-500">{stats.pending}</div>
          </div>

          <div className="border-2 border-lime-200 rounded-3xl p-8 bg-lime-50 hover:border-lime-400 transition-colors shadow-sm">
            <h3 className="text-2xl font-black italic mb-2 text-black">Approved</h3>
            <p className="text-zinc-600 mb-6">Ready for procurement team</p>
            <div className="text-5xl font-bold text-lime-500">{stats.approved}</div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-4xl font-black italic mb-6 text-black">Recent Requests</h2>
        {requests.length === 0 ? (
          <div className="border-2 border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50 shadow-sm">
            <p className="text-zinc-600 mb-6 text-lg">No requests yet</p>
            <button
              onClick={() => router.push("/requests")}
              className="px-10 py-4 bg-lime-400 text-black rounded-full font-bold border-2 border-lime-400 hover:bg-lime-300 transition-all"
            >
              CREATE REQUEST →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border-2 border-zinc-200 rounded-3xl p-6 bg-zinc-50 hover:border-lime-400 transition-all cursor-pointer shadow-sm"
                onClick={() => router.push(`/requests/${request.id}/review`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black italic mb-2 text-black">{request.title}</h3>
                    <p className="text-zinc-600">{request.category}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      request.status === "approved"
                        ? "bg-lime-400/20 text-lime-700 border-2 border-lime-400"
                        : request.status === "pending"
                        ? "bg-orange-400/20 text-orange-700 border-2 border-orange-400"
                        : "bg-zinc-200 text-zinc-700 border-2 border-zinc-300"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
