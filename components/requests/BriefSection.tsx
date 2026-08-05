import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefResult } from "@/types/brief.types";

interface BriefSectionProps {
  brief: BriefResult;
}

// Display generated product brief in 4 sections
export function BriefSection({ brief }: BriefSectionProps) {
  return (
    <div className="space-y-6">
      {/* Facts */}
      <Card>
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-800 dark:text-green-200">
            Facts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.facts.length > 0 ? (
            <ul className="space-y-2">
              {brief.facts.map((fact, index) => (
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
              No facts listed.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.assumptions.length > 0 ? (
            <ul className="space-y-2">
              {brief.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">
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

      {/* Unknowns */}
      <Card>
        <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20">
          <CardTitle className="text-yellow-800 dark:text-yellow-200">
            Unknowns
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {brief.unknowns.length > 0 ? (
            <ul className="space-y-2">
              {brief.unknowns.map((unknown, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-1">
                    ?
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {unknown}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No unknowns identified.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Final Brief */}
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="text-purple-800 dark:text-purple-200">
            Final Product Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {brief.finalBrief}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
