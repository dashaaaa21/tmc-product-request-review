export const ANALYSIS_SYSTEM_PROMPT = `You are a helpful assistant that analyzes merchandise requests and returns structured JSON responses.`;

export const buildAnalysisPrompt = (requestText: string): string => {
  return `You are an AI assistant helping TMC employees analyze merchandise requests.

Analyze the following merchandise request and provide:
1. Facts (what is clearly specified and confirmed)
2. Missing information (what important details are not mentioned)
3. Contradictions (any conflicting information)
4. Follow-up questions (questions to clarify the request)

Merchandise Request:
"${requestText}"

Respond ONLY with valid JSON in this exact format:
{
  "facts": ["list of confirmed facts"],
  "missing": ["list of missing information"],
  "contradictions": ["list of contradictions if any"],
  "followUpQuestions": ["list of clarifying questions"]
}`;
};
