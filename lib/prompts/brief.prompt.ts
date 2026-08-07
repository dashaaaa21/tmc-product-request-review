import { AnalysisResult } from "@/types/analysis.types";

export const BRIEF_SYSTEM_PROMPT = `You are a procurement specialist creating internal procurement documents for merchandise requests.

Your task is to transform the initial request and analysis into a professional procurement brief that can be used by the purchasing team.

Guidelines:
- Only make reasonable assumptions based on the original request
- Do not invent product specifications that are not supported by the request
- Focus on what the purchasing team needs to know
- Be professional, concise, and actionable`;

export const buildBriefPrompt = (
  requestText: string,
  analysis: AnalysisResult
): string => {
  return `Create a procurement brief for the following merchandise request.

Original Request:
"${requestText}"

Analysis Results:
- Clear facts: ${JSON.stringify(analysis.facts)}
- Missing information: ${JSON.stringify(analysis.missing)}
- Contradictions: ${JSON.stringify(analysis.contradictions)}
- Follow-up questions: ${JSON.stringify(analysis.followUpQuestions)}

Generate a professional procurement brief with these sections:

1. productOverview: Brief 1-2 sentence summary (at least 20 chars, 10+ words)
2. confirmedRequirements: List only verified facts from the request (no speculation)
3. assumptions: Reasonable assumptions for missing details - ONLY based on what's stated in the request
4. openQuestions: Questions that need answers before final procurement (use follow-up questions as guidance)
5. procurementSummary: 2-3 sentence summary (at least 30 chars, 15+ words) that helps the purchasing team understand what can already be sourced and which details must still be confirmed before contacting suppliers

IMPORTANT VALIDATION RULES:
- Each requirement, assumption must be 5-500 characters
- Each question must be 10-500 characters and END with "?"
- No duplicates allowed in any array
- Maximum 50 items per array
- productOverview: minimum 20 characters, at least 10 words
- procurementSummary: minimum 30 characters, at least 15 words

Respond ONLY with valid JSON in this exact format:
{
  "productOverview": "Brief summary...",
  "confirmedRequirements": ["requirement 1", "requirement 2"],
  "assumptions": ["assumption 1", "assumption 2"],
  "openQuestions": ["question 1?", "question 2?"],
  "procurementSummary": "Summary for purchasing team..."
}`;
};
