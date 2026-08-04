export interface AnalysisResult {
  facts: string[];
  missing: string[];
  contradictions: string[];
  followUpQuestions: string[];
}

export interface AnalysisRequest {
  requestText: string;
}

export interface AnalysisResponse {
  data?: AnalysisResult;
  error?: string;
}
