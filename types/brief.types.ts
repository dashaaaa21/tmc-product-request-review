export interface BriefResult {
  facts: string[];
  assumptions: string[];
  unknowns: string[];
  finalBrief: string;
}

export interface BriefResponse {
  data?: BriefResult;
  error?: string;
}

export interface CreateBriefInput {
  requestId: string;
}
