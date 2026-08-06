import { createClient } from "@/lib/supabase/server";
import { ProductRequest } from "@/types/request.types";

export class RequestService {
  static async createRequest(
    userId: string,
    title: string,
    description: string,
    category: string
  ): Promise<ProductRequest> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("requests")
      .insert({
        user_id: userId,
        title,
        description,
        category,
        status: "pending", // New requests start as pending
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }

    return data;
  }

  static async getRequests(userId: string): Promise<ProductRequest[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }

    return data || [];
  }

  static async getRequest(userId: string, requestId: string): Promise<ProductRequest | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", requestId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch request: ${error.message}`);
    }

    return data;
  }

  static async deleteRequest(userId: string, requestId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", requestId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete request: ${error.message}`);
    }
  }
}
