export interface BriefResult {
  productOverview: string;
  confirmedRequirements: string[];
  assumptions: string[];
  openQuestions: string[];
  procurementSummary: string;
}

export interface BriefResponse {
  data?: BriefResult;
  error?: string;
}

export interface CreateBriefInput {
  requestId: string;
}
