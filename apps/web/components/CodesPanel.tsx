"use client";

import type { AnalysisResult } from "@/lib/types";

interface CodesPanelProps {
  cptCodes: AnalysisResult["cpt_codes"];
  cptJustification: AnalysisResult["cpt_justification"];
  icd10: AnalysisResult["icd10"];
}

export default function CodesPanel({ cptCodes, cptJustification, icd10 }: CodesPanelProps) {
  const primaryCodes = cptCodes.filter((c) => !c.is_addon);
  const addonCodes = cptCodes.filter((c) => c.is_addon);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">CPT Codes</h3>

        {primaryCodes.map((code, i) => (
          <div key={i} className="rounded-lg bg-teal-50 p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-teal-700">{code.code}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                cptJustification.confidence === "High"
                  ? "bg-green-100 text-green-700"
                  : cptJustification.confidence === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}>
                {cptJustification.confidence} confidence
              </span>
            </div>
            <p className="mt-1 text-sm text-teal-800">{code.description}</p>
            <p className="mt-1 text-xs text-teal-700">{code.justification}</p>
          </div>
        ))}

        {addonCodes.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add-on Codes</p>
            {addonCodes.map((code, i) => (
              <div key={i} className="rounded-lg border border-teal-200 bg-teal-50/50 p-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-lg font-bold text-teal-700">{code.code}</span>
                  <span className="text-xs text-slate-500">+ {code.addon_to}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-teal-800">{code.description}</p>
                <p className="mt-1 text-xs text-teal-700">{code.justification}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="font-medium text-slate-700">By MDM: </span>
            <span className="text-slate-600">{cptJustification.by_mdm}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">By Time: </span>
            <span className="text-slate-600">{cptJustification.by_time || "N/A"}</span>
          </div>
          {cptJustification.upgrade_potential && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-800">
              <span className="font-semibold">Upgrade potential: </span>
              {cptJustification.upgrade_potential}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">
          ICD-10 Codes
          <span className="ml-2 text-sm font-normal text-slate-500">({icd10.length} found)</span>
        </h3>

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
