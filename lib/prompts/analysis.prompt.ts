export const ANALYSIS_SYSTEM_PROMPT = `You are a helpful assistant that analyzes merchandise requests and returns structured JSON responses.`;

export const buildAnalysisPrompt = (requestText: string): string => {
  return `You are an AI assistant helping TMC employees analyze merchandise requests.

Analyze the following merchandise request and provide:
1. Facts (what is clearly specified and confirmed)
2. Missing information (what important details are not mentioned)
3. Contradictions (any conflicting information)
4. Follow-up questions (questions to clarify the request)

IMPORTANT VALIDATION RULES:
- Each fact, missing item, and contradiction must be 5-500 characters
- Each question must be 10-500 characters and END with "?"
- No duplicates allowed in any array
- Maximum 50 items per array
- Be specific and concise

Merchandise Request:
"${requestText}"

Respond ONLY with valid JSON in this exact format:
{
  "facts": ["list of confirmed facts"],
  "missing": ["list of missing information"],
  "contradictions": ["list of contradictions if any"],
  "followUpQuestions": ["list of clarifying questions ending with ?"]
}`;
};
