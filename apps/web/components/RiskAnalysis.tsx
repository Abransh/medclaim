"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";

type RiskData = Pick<AnalysisResult, "risk_level" | "risk_score" | "downcoding_probability" | "denial_probability" | "reasons" | "fixes" | "code_recommendation" | "summary">;

const riskColors = {
  LOW: { bg: "bg-green-50", border: "border-green-500", text: "text-green-800", badge: "bg-green-100" },
  MEDIUM: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-800", badge: "bg-amber-100" },
  HIGH: { bg: "bg-red-50", border: "border-red-500", text: "text-red-800", badge: "bg-red-100" },
};

export default function RiskAnalysis({ data }: { data: RiskData }) {
  const [expandedFix, setExpandedFix] = useState<number | null>(null);
  const colors = riskColors[data.risk_level];

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border-l-4 ${colors.border} ${colors.bg} p-5`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className={`rounded-xl ${colors.badge} px-4 py-2`}>
            <span className={`text-2xl font-bold ${colors.text}`}>{data.risk_level} RISK</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-slate-500">Score: </span>
              <span className="font-bold text-slate-800">{data.risk_score}/10</span>
            </div>
            <div>
              <span className="text-slate-500">Downcoding: </span>
              <span className="font-bold text-slate-800">{data.downcoding_probability}</span>
            </div>
            <div>
              <span className="text-slate-500">Denial: </span>
              <span className="font-bold text-slate-800">{data.denial_probability}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700">{data.summary}</p>
      </div>

      {data.code_recommendation && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Code Recommendation</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">AI Suggested Code</p>
              <p className="font-mono text-lg font-bold text-slate-800">{data.code_recommendation.suggested_code}</p>
              <p className="mt-1 text-xs text-slate-600">{data.code_recommendation.reasoning}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700">Audit-Safe Code</p>
              <p className="font-mono text-lg font-bold text-amber-800">{data.code_recommendation.safe_code}</p>
              <p className="mt-1 text-xs text-amber-700">Recommended to minimize denial risk</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <p className="text-xs font-medium text-teal-600">If Documentation Improved</p>
              <p className="font-mono text-lg font-bold text-teal-700">{data.code_recommendation.if_improved_code}</p>
              <p className="mt-1 text-xs text-teal-700">{data.code_recommendation.if_improved_reasoning}</p>
            </div>
          </div>
        </div>
      )}

      {data.reasons.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Areas to Review</h3>
          <div className="space-y-2">
            {data.reasons.map((r, i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : r.severity === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                  }`}>
                    {r.severity}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-500">{r.category}</span>
                    <p className="text-sm text-slate-800">{r.issue}</p>
                    <p className="mt-1 text-xs italic text-slate-500">{r.insurance_perspective}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.fixes.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Suggested Improvements</h3>
          <div className="space-y-2">
            {data.fixes.map((fix) => (
              <div
                key={fix.priority}
                className="cursor-pointer rounded-lg border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                onClick={() => setExpandedFix(expandedFix === fix.priority ? null : fix.priority)}
              >
                <div className="flex items-start gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                    {fix.priority}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">{fix.category}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                        fix.effort === "Easy"
                          ? "bg-green-50 text-green-700"
                          : fix.effort === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}>
                        {fix.effort}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800">{fix.current_issue}</p>

                    {expandedFix === fix.priority && (
                      <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
                        <div>
                          <p className="text-xs font-medium text-teal-700">Specific Fix:</p>
                          <p className="mt-0.5 text-sm text-slate-700">{fix.specific_fix}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-blue-700">Impact:</p>
                          <p className="mt-0.5 text-sm text-slate-700">{fix.impact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <svg
                    className={`h-4 w-4 shrink-0 text-slate-400 transition ${expandedFix === fix.priority ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
