"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-zinc-200 rounded-3xl p-8 bg-white shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic text-black mb-3">
              Welcome Back
            </h1>
            <p className="text-zinc-600 text-lg">
              Sign in to TMC Product Request Review
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-black mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-2xl bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-lime-400 transition-colors"
                placeholder="alice@tmc.nl"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-black mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-2xl bg-white text-black placeholder-zinc-400 focus:outline-none focus:border-lime-400 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-lime-400 text-black rounded-full font-bold text-lg border-2 border-lime-400 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-600">
            <p className="font-medium">Demo accounts:</p>
            <p className="mt-1">alice@tmc.nl / bob@tmc.nl</p>
            <p className="text-xs mt-1 text-zinc-500">Password: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}