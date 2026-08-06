import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Root page redirects to dashboard if authenticated, otherwise to login
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
