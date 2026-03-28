"use client";

import type { AnalysisResult } from "@/lib/types";

interface CodesPanelProps {
  cpt: AnalysisResult["cpt"];
  icd10: AnalysisResult["icd10"];
}

export default function CodesPanel({ cpt, icd10 }: CodesPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">CPT Code</h3>

        <div className="rounded-lg bg-teal-50 p-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-teal-700">{cpt.code}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              cpt.confidence === "High"
                ? "bg-green-100 text-green-700"
                : cpt.confidence === "Medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }`}>
              {cpt.confidence} confidence
            </span>
          </div>
          <p className="mt-1 text-sm text-teal-800">{cpt.description}</p>
        </div>

        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="font-medium text-slate-700">By MDM: </span>
            <span className="text-slate-600">{cpt.justification_by_mdm}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">By Time: </span>
            <span className="text-slate-600">{cpt.justification_by_time || "N/A"}</span>
          </div>
          {cpt.upgrade_potential && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-800">
              <span className="font-semibold">Upgrade potential: </span>
              {cpt.upgrade_potential}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">ICD-10 Codes</h3>

        <div className="space-y-2.5">
          {icd10.map((code, i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-bold text-slate-800">{code.code}</span>
                {code.is_primary && (
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                    Primary
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium text-slate-700">{code.description}</p>
              <p className="mt-1 text-xs text-slate-500">{code.justification}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
