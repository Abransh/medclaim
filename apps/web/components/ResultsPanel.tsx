"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import StructuredChart from "./StructuredChart";
import CodesPanel from "./CodesPanel";
import RiskAnalysis from "./RiskAnalysis";

const tabs = [
  { id: "chart", label: "Chart" },
  { id: "codes", label: "Codes" },
  { id: "risk", label: "Risk" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ResultsPanel({ results }: { results: AnalysisResult }) {
  const [activeTab, setActiveTab] = useState<TabId>("risk");

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
            {tab.id === "risk" && (
              <span className={`ml-1.5 inline-block h-2 w-2 rounded-full ${
                results.risk_level === "LOW"
                  ? "bg-green-500"
                  : results.risk_level === "MEDIUM"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`} />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className={activeTab !== "risk" ? "hidden md:block" : ""}>
          <RiskAnalysis data={results} />
        </div>
        <div className={activeTab !== "chart" ? "hidden md:block" : ""}>
          <StructuredChart chart={results.chart} />
        </div>
        <div className={activeTab !== "codes" ? "hidden md:block" : ""}>
          <CodesPanel cptCodes={results.cpt_codes} cptJustification={results.cpt_justification} icd10={results.icd10} />
        </div>
      </div>
    </div>
  );
}
