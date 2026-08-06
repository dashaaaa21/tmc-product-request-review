"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("merchandise");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
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
        body: JSON.stringify({ title, description, category, priority }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create request");
      }

      setSuccess(true);
      
      // Run AI analysis
      setAnalyzing(true);
      try {
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            requestId: data.data.id,
            requestText: description 
          }),
        });

        if (!analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          console.error("Analysis failed:", analysisData.error);
          setError("Request created, but analysis failed. You can retry later.");
          return;
        }
        
        // Success - go to review page
        router.push(`/requests/${data.data.id}/review`);
      } catch (analysisErr) {
        console.error("Analysis error:", analysisErr);
        setError("Request created, but analysis failed. You can retry later.");
      } finally {
        setAnalyzing(false);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("merchandise");
      setPriority("medium");
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
              htmlFor="title"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Custom Water Bottles"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="merchandise">Merchandise</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
                <option value="promotional">Promotional</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="priority"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Priority *
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900 dark:text-white"
            >
              Description *
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          {success && !analyzing && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              Request created successfully! Opening AI review...
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || analyzing || !title.trim() || !description.trim()}
            className="w-full"
          >
            {loading ? "Creating Request..." : analyzing ? "Analyzing..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
