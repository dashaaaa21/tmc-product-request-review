"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/custom-select";

export function RequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("merchandise");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        body: JSON.stringify({ title, description, category }),
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-zinc-200 rounded-3xl p-8 bg-zinc-50 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-black italic text-black mb-2">Product Request</h2>
        <p className="text-zinc-600">
          Describe your merchandise request. Our AI assistant will review completeness and create a product brief.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-bold text-black"
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
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-2xl bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-lime-400 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-sm font-bold text-black"
          >
            Category *
          </label>
          <CustomSelect
            id="category"
            value={category}
            onChange={(value) => setCategory(value)}
            options={[
              { value: "merchandise", label: "Merchandise" },
              { value: "apparel", label: "Apparel" },
              { value: "accessories", label: "Accessories" },
              { value: "promotional", label: "Promotional" },
              { value: "other", label: "Other" },
            ]}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-bold text-black"
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
            className="resize-none border-2 border-zinc-200 rounded-2xl bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-lime-400 transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && !analyzing && (
          <div className="bg-green-50 border-2 border-green-200 text-green-600 px-6 py-4 rounded-2xl text-sm font-medium">
            Request created successfully! Opening AI review...
          </div>
        )}

        <button
          type="submit"
          disabled={loading || analyzing || !title.trim() || !description.trim()}
          className="w-full px-6 py-4 bg-lime-400 text-black rounded-full font-bold border-2 border-lime-400 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? "Creating Request..." : analyzing ? "Analyzing..." : "Submit Request →"}
        </button>
      </form>
    </div>
  );
}
