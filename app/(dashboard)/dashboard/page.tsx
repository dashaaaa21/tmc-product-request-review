"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductRequest } from "@/types/request.types";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      
      // Stats from ALL requests
      setStats({
        total: allRequests.length,
        pending: allRequests.filter((r: ProductRequest) => r.status === "pending").length,
        approved: allRequests.filter((r: ProductRequest) => r.status === "approved").length,
      });

      // Show only 3 most recent
      setRequests(allRequests.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to TMC Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Create and review merchandise requests with AI-powered analysis
        </p>
        <Button size="lg" onClick={() => router.push("/requests")}>
          + New Request
        </Button>
      </div>

      {/* Stats Cards */}
      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {stats.approved}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Requests */}
      {!loading && requests.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Button variant="outline" onClick={() => router.push("/history")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/requests/${request.id}/review`)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {request.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {request.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No requests yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first merchandise request to get started
              </p>
              <Button onClick={() => router.push("/requests")}>
                Create Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => fetchRecentRequests()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/requests")}>
          <CardHeader>
            <CardTitle className="text-lg">New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new product request with AI-powered analysis
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/history")}>
          <CardHeader>
            <CardTitle className="text-lg">History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View all your previous requests and their status
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Product Briefs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access AI-generated product briefs from History page
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
