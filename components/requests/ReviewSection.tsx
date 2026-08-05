import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/types/analysis.types";

interface ReviewSectionProps {
  analysis: AnalysisResult;
}

// Display AI analysis results in 4 sections
export function ReviewSection({ analysis }: ReviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Facts - what's clearly stated */}
      <Card>
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-800 dark:text-green-200">
            Clear Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.facts.length > 0 ? (
            <ul className="space-y-2">
              {analysis.facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">
                    ✓
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {fact}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No clear information found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Missing - what's not specified */}
      <Card>
        <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardTitle className="text-yellow-800 dark:text-yellow-200">
            Missing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.missing.length > 0 ? (
            <ul className="space-y-2">
              {analysis.missing.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-1">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No missing information detected.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Conflicts in the request */}
      <Card>
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <CardTitle className="text-red-800 dark:text-red-200">
            Contradictions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.contradictions.length > 0 ? (
            <ul className="space-y-2">
              {analysis.contradictions.map((contradiction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {contradiction}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No contradictions found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Questions to clarify */}
      <Card>
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Follow-up Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {analysis.followUpQuestions.length > 0 ? (
            <ul className="space-y-2">
              {analysis.followUpQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {question}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No follow-up questions needed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
