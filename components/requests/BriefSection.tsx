import { BriefResult } from "@/types/brief.types";

interface BriefSectionProps {
  brief: BriefResult;
}

// Display procurement brief document
export function BriefSection({ brief }: BriefSectionProps) {
  return (
    <div className="space-y-6">
      {/* Product Overview */}
      <div className="border-2 border-blue-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-blue-50 px-6 py-4 border-b-2 border-blue-200">
          <h3 className="text-xl font-black italic text-blue-700">
            Product Overview
          </h3>
        </div>
        <div className="p-6">
          <p className="text-zinc-700 leading-relaxed">
            {brief.productOverview}
          </p>
        </div>
      </div>

      {/* Confirmed Requirements */}
      <div className="border-2 border-lime-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-lime-50 px-6 py-4 border-b-2 border-lime-200">
          <h3 className="text-xl font-black italic text-lime-700">
            Confirmed Requirements
          </h3>
        </div>
        <div className="p-6">
          {brief.confirmedRequirements.length > 0 ? (
            <ul className="space-y-3">
              {brief.confirmedRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lime-600 text-lg font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No confirmed requirements.
            </p>
          )}
        </div>
      </div>

      {/* Assumptions */}
      <div className="border-2 border-purple-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-purple-50 px-6 py-4 border-b-2 border-purple-200">
          <h3 className="text-xl font-black italic text-purple-700">
            Assumptions
          </h3>
        </div>
        <div className="p-6">
          {brief.assumptions.length > 0 ? (
            <ul className="space-y-3">
              {brief.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg font-bold mt-0.5">
                    •
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {assumption}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No assumptions made.
            </p>
          )}
        </div>
      </div>

      {/* Open Questions */}
      <div className="border-2 border-orange-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-orange-50 px-6 py-4 border-b-2 border-orange-200">
          <h3 className="text-xl font-black italic text-orange-700">
            Open Questions
          </h3>
        </div>
        <div className="p-6">
          {brief.openQuestions.length > 0 ? (
            <ul className="space-y-3">
              {brief.openQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg font-bold mt-0.5">
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
              No open questions.
            </p>
          )}
        </div>
      </div>

      {/* Procurement Summary */}
      <div className="border-2 border-zinc-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <div className="bg-zinc-50 px-6 py-4 border-b-2 border-zinc-200">
          <h3 className="text-xl font-black italic text-zinc-700">
            Procurement Summary
          </h3>
        </div>
        <div className="p-6">
          <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {brief.procurementSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
