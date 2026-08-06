"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-zinc-100 border-b-2 border-zinc-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-black italic text-black">
          TMC Product Intelligence
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 font-medium">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-zinc-200 bg-white text-zinc-700 font-bold hover:border-red-400 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
