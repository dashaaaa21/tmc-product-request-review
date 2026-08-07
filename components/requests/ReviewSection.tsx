import { AnalysisResult } from "@/types/analysis.types";

interface ReviewSectionProps {
  analysis: AnalysisResult;
}

// Display AI analysis results in 4 sections
export function ReviewSection({ analysis }: ReviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Facts - what's clearly stated */}
      <div className="border-2 border-lime-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-lime-50 px-6 py-4 border-b-2 border-lime-200">
          <h3 className="text-xl font-black italic text-lime-700">
            Clear Information
          </h3>
        </div>
        <div className="p-6">
          {analysis.facts.length > 0 ? (
            <ul className="space-y-3">
              {analysis.facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lime-600 text-lg font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {fact}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No clear information found.
            </p>
          )}
        </div>
      </div>

      {/* Missing - what's not specified */}
      <div className="border-2 border-orange-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-orange-50 px-6 py-4 border-b-2 border-orange-200">
          <h3 className="text-xl font-black italic text-orange-700">
            Missing Information
          </h3>
        </div>
        <div className="p-6">
          {analysis.missing.length > 0 ? (
            <ul className="space-y-3">
              {analysis.missing.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg font-bold mt-0.5">
                    •
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No missing information detected.
            </p>
          )}
        </div>
      </div>

      {/* Conflicts in the request */}
      <div className="border-2 border-red-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-red-50 px-6 py-4 border-b-2 border-red-200">
          <h3 className="text-xl font-black italic text-red-700">
            Contradictions
          </h3>
        </div>
        <div className="p-6">
          {analysis.contradictions.length > 0 ? (
            <ul className="space-y-3">
              {analysis.contradictions.map((contradiction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 text-lg font-bold mt-0.5">•</span>
                  <span className="text-zinc-700 leading-relaxed">
                    {contradiction}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No contradictions found.
            </p>
          )}
        </div>
      </div>

      {/* Questions to clarify */}
      <div className="border-2 border-blue-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-blue-50 px-6 py-4 border-b-2 border-blue-200">
          <h3 className="text-xl font-black italic text-blue-700">
            Follow-up Questions
          </h3>
        </div>
        <div className="p-6">
          {analysis.followUpQuestions.length > 0 ? (
            <ul className="space-y-3">
              {analysis.followUpQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-600 text-lg font-bold mt-0.5">
                    ?
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {question}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No follow-up questions needed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
