import OpenAI from "openai";
import { AnalysisResult } from "@/types/analysis.types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async analyzeRequest(requestText: string): Promise<AnalysisResult> {
    const prompt = `You are an AI assistant helping TMC employees analyze merchandise requests.

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes merchandise requests and returns structured JSON responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content) as AnalysisResult;
    return result;
  }
}
