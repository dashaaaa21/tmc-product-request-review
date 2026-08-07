import { BriefResult } from "@/types/brief.types";

interface BriefSectionProps {
  brief: BriefResult;
}

// Safe array access helper
function safeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
}

// Safe string access helper
function safeString(str: string | undefined | null, fallback: string = ""): string {
  return typeof str === "string" ? str : fallback;
}

// Display procurement brief document
export function BriefSection({ brief }: BriefSectionProps) {
  // Validate brief data
  if (!brief) {
    return (
      <div className="border-2 border-red-200 rounded-3xl p-8 bg-red-50 text-center">
        <p className="text-red-600 font-medium">Brief data is invalid or missing.</p>
      </div>
    );
  }

  const productOverview = safeString(brief.productOverview, "No product overview available.");
  const confirmedRequirements = safeArray(brief.confirmedRequirements);
  const assumptions = safeArray(brief.assumptions);
  const openQuestions = safeArray(brief.openQuestions);
  const procurementSummary = safeString(brief.procurementSummary, "No procurement summary available.");

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
            {productOverview}
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
          {confirmedRequirements.length > 0 ? (
            <ul className="space-y-3">
              {confirmedRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-lime-600 text-lg font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {safeString(req, "Invalid requirement")}
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
          {assumptions.length > 0 ? (
            <ul className="space-y-3">
              {assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg font-bold mt-0.5">
                    •
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {safeString(assumption, "Invalid assumption")}
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
          {openQuestions.length > 0 ? (
            <ul className="space-y-3">
              {openQuestions.map((question, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-600 text-lg font-bold mt-0.5">
                    ?
                  </span>
                  <span className="text-zinc-700 leading-relaxed">
                    {safeString(question, "Invalid question")}
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
            {procurementSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
