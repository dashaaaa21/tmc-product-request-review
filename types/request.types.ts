export interface CreateRequestInput {
  requestText: string;
}

export interface ProductRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "implemented";
  category: string;
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
