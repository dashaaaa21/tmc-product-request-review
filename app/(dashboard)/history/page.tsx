"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RequestHistoryCard } from "@/components/requests/RequestHistoryCard";
import { ProductRequest } from "@/types/request.types";

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/requests");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      setRequests(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    const filtered = requests.filter((request) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [requests, searchQuery, statusFilter, sortOrder]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const pending = requests.filter((r) => r.status === "pending").length;
    return { total, approved, pending };
  }, [requests]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-lime-400 mx-auto mb-4"></div>
            <p className="text-zinc-600 font-medium">Loading request history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="border-2 border-red-200 rounded-3xl p-8 text-center bg-red-50 shadow-sm">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={() => fetchRequests()}
            className="px-8 py-3 bg-red-400 text-white rounded-full font-bold hover:bg-red-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black italic text-black mb-3">
          Request History
        </h1>
        <p className="text-zinc-600 text-lg">
          View your previously submitted merchandise requests and generated product briefs
        </p>
      </div>

      {/* Stats */}
      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          <div className="border-2 border-zinc-200 rounded-3xl p-6 bg-zinc-50 shadow-sm">
            <p className="text-sm text-zinc-600 mb-1 font-medium">Total</p>
            <p className="text-4xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="border-2 border-orange-200 rounded-3xl p-6 bg-orange-50 shadow-sm">
            <p className="text-sm text-orange-600 mb-1 font-medium">Pending</p>
            <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="border-2 border-lime-200 rounded-3xl p-6 bg-lime-50 shadow-sm">
            <p className="text-sm text-lime-600 mb-1 font-medium">Approved</p>
            <p className="text-4xl font-bold text-lime-600">{stats.approved}</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {!loading && requests.length > 0 && (
        <div className="border-2 border-zinc-200 rounded-3xl p-6 bg-zinc-50 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search requests..."
              aria-label="Search requests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-zinc-200 rounded-2xl bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-lime-400 transition-colors"
            />
            
            {/* Sort order buttons */}
            <div className="flex gap-2 bg-white border-2 border-zinc-200 rounded-2xl p-1">
              <button
                onClick={() => setSortOrder("newest")}
                className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                  sortOrder === "newest"
                    ? "bg-lime-400 text-black"
                    : "bg-white text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                  sortOrder === "oldest"
                    ? "bg-lime-400 text-black"
                    : "bg-white text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Oldest First
              </button>
            </div>
          </div>
          
          {/* Status filter buttons */}
          <div className="flex gap-2 bg-white border-2 border-zinc-200 rounded-2xl p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                statusFilter === "all"
                  ? "bg-lime-400 text-black"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                statusFilter === "pending"
                  ? "bg-orange-400 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                statusFilter === "approved"
                  ? "bg-lime-400 text-black"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Approved
            </button>
          </div>
        </div>
      )}

      {filteredRequests.length === 0 && !loading && requests.length > 0 && (
        <div className="border-2 border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50 shadow-sm">
          <p className="text-zinc-600 mb-6 text-lg">
            No requests found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setSortOrder("newest");
            }}
            className="px-8 py-3 bg-zinc-200 text-black rounded-full font-bold hover:bg-zinc-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="border-2 border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50 shadow-sm">
          <p className="text-zinc-600 mb-2 text-lg">No requests found.</p>
          <p className="text-zinc-500 text-sm mb-6">
            Create your first merchandise request to get started
          </p>
          <button
            onClick={() => router.push("/requests")}
            className="px-8 py-3 bg-lime-400 text-black rounded-full font-bold hover:bg-lime-300 transition-colors"
          >
            Create Request →
          </button>
        </div>
      )}

      {filteredRequests.length > 0 && (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <RequestHistoryCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
