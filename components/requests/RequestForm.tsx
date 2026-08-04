"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForm() {
  const router = useRouter();
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestText: request }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create request");
      }

      setSuccess(true);
      
      // Call AI analysis
      setAnalyzing(true);
      try {
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            requestId: data.data.id,
            requestText: request 
          }),
        });

        if (!analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          throw new Error(analysisData.error || "Failed to analyze request");
        }
      } catch (analysisErr) {
        // Analysis failed, but request was created successfully
        // Could show a warning to the user if needed
      } finally {
        setAnalyzing(false);
      }

      setRequest("");
      
      setTimeout(() => {
        router.push("/history");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Request</CardTitle>
        <CardDescription>
          Describe your merchandise request. Our AI assistant will review completeness and create a product brief.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="request"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              Describe your merchandise request
            </label>
            <Textarea
              id="request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Example: 500 matte-black aluminium water bottles with a white logo, delivered in Amsterdam within five weeks, maximum budget €9 per item."
              rows={8}
              required
              className="resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              Request created successfully! Redirecting to history...
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || analyzing || !request.trim()}
            className="w-full"
          >
            {loading ? "Creating..." : analyzing ? "Analyzing..." : "Analyze Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
