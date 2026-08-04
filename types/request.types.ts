export interface CreateRequestInput {
  requestText: string;
}

export interface ProductRequest {
  id: string;
  user_id: string;
  request_text: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  category: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
