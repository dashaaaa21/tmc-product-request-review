"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForm() {
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Product Request:", request);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

          <Button
            type="submit"
            disabled={loading || !request.trim()}
            className="w-full"
          >
            {loading ? "Analyzing..." : "Analyze Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
