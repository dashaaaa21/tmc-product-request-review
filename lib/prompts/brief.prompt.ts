import { AnalysisResult } from "@/types/analysis.types";

export const BRIEF_SYSTEM_PROMPT = `You are a procurement specialist at TMC.
Generate structured product briefs in JSON format based on merchandise requests and their analysis.`;

export const buildBriefPrompt = (
  requestText: string,
  analysis: AnalysisResult
): string => {
  return `Based on the original merchandise request and its AI analysis, generate a structured Product Brief.

Original Request:
"${requestText}"

Analysis:
- Clear Facts: ${JSON.stringify(analysis.facts)}
- Missing Information: ${JSON.stringify(analysis.missing)}
- Contradictions: ${JSON.stringify(analysis.contradictions)}
- Follow-up Questions: ${JSON.stringify(analysis.followUpQuestions)}

Generate a Product Brief with:
1. Facts: confirmed information from the request
2. Assumptions: reasonable assumptions to fill gaps
3. Unknowns: what still needs clarification
4. Final Brief: a complete, professional product brief paragraph

Respond ONLY with valid JSON in this exact format:
{
  "facts": ["fact 1", "fact 2"],
  "assumptions": ["assumption 1", "assumption 2"],
  "unknowns": ["unknown 1", "unknown 2"],
  "finalBrief": "A complete paragraph describing the product brief..."
}`;
};
