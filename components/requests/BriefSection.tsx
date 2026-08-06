import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefResult } from "@/types/brief.types";

interface BriefSectionProps {
  brief: BriefResult;
}

// Display procurement brief document
export function BriefSection({ brief }: BriefSectionProps) {
  return (
    <div className="space-y-6">
      {/* Product Overview */}
      <Card>
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Product Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {brief.productOverview}
          </p>
        </CardContent>
      </Card>

      {/* Confirmed Requirements */}
      <Card>
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-800 dark:text-green-200">
            Confirmed Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.confirmedRequirements.length > 0 ? (
            <ul className="space-y-2">
              {brief.confirmedRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">
                    ✓
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No confirmed requirements.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-800 dark:text-purple-200">
            Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.assumptions.length > 0 ? (
            <ul className="space-y-2">
              {brief.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {assumption}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No assumptions made.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Open Questions */}
      <Card>
        <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardTitle className="text-yellow-800 dark:text-yellow-200">
            Open Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.openQuestions.length > 0 ? (
            <ul className="space-y-2">
              {brief.openQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-1">
                    ?
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {question}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No open questions.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Procurement Summary */}
      <Card>
        <CardHeader className="bg-gray-50 dark:bg-gray-700">
          <CardTitle className="text-gray-800 dark:text-gray-200">
            Procurement Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {brief.procurementSummary}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
